// stores/adminUser.js
import { defineStore } from 'pinia';

export const useAdminUserStore = defineStore('adminUser', () => {
  const getRequests = () => useAdminUserRequests();
  const self = () => useAdminUserStore();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    users: [],
    pagination: { total: 0, page: 1, limit: 20, pages: 0 },

    filters: {
      search: '',
      role: 'all',
      kycStatus: 'all',
      isBanned: 'all',
      isVerified: 'all',
      sort: 'newest',
    },

    current: null,       // detail page

    stats: null,
    statsLoaded: false,

    isLoading: false,
    isLoadingDetail: false,
    isSubmitting: false,
    error: null,
  });

  // ─────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────
  const hasUsers = computed(() => state.users.length > 0);
  const totalPages = computed(() => state.pagination.pages || 0);

  const totalUsers = computed(() => state.stats?.total || 0);
  const verifiedUsers = computed(() => state.stats?.verified || 0);
  const bannedUsers = computed(() => state.stats?.banned || 0);
  const kycPendingCount = computed(() => state.stats?.kycPending || 0);

  const findById = (id) => state.users.find((u) => u._id === id) || null;

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  const invalidateDownstream = () => {
    // User writes (ban/update) can affect: user's own cache, wallet stats
    // in a bank case; for admin operations it's mostly the admin list
    self().$invalidatePrefix('admin:usr-list:');
    self().$invalidate('admin:usr-stats');
    self().$invalidatePrefix('admin:usr-one:');
    // KYC status changes may affect kyc caches too
    try { useAdminKycStore?.().$invalidatePrefix?.('admin:kyc-'); } catch {}
  };

  // ─────────────────────────────────────────────────────────
  // LIST (cache 2 min)
  // ─────────────────────────────────────────────────────────
  const fetchUsers = async (overrides = {}, opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();

      const query = {
        page: overrides.page ?? state.pagination.page,
        limit: overrides.limit ?? state.pagination.limit,
        search: (overrides.search ?? state.filters.search) || undefined,
        role: (overrides.role ?? state.filters.role) !== 'all'
          ? overrides.role ?? state.filters.role : undefined,
        kycStatus: (overrides.kycStatus ?? state.filters.kycStatus) !== 'all'
          ? overrides.kycStatus ?? state.filters.kycStatus : undefined,
        isBanned: (overrides.isBanned ?? state.filters.isBanned) !== 'all'
          ? overrides.isBanned ?? state.filters.isBanned : undefined,
        isVerified: (overrides.isVerified ?? state.filters.isVerified) !== 'all'
          ? overrides.isVerified ?? state.filters.isVerified : undefined,
        sort: overrides.sort ?? state.filters.sort,
      };

      const cacheKey = `admin:usr-list:${JSON.stringify(query)}`;

      const res = await self().$cached(
        cacheKey,
        () => requests.getAllUsers(query),
        {
          ttl: 2 * 60_000,
          force: opts.force,
          onSuccess: (data) => {
            state.users = data?.users || [];
            if (data?.pagination) state.pagination = data.pagination;
          },
        }
      );

      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoading = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // DETAIL (cache 60 s)
  // ─────────────────────────────────────────────────────────
  const fetchUser = async (id, opts = {}) => {
    state.isLoadingDetail = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        `admin:usr-one:${id}`,
        () => requests.getUserById(id),
        {
          ttl: 60_000,
          force: opts.force,
          onSuccess: (data) => { state.current = data?.user || null; },
        }
      );

      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingDetail = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // STATS (cache 2 min)
  // ─────────────────────────────────────────────────────────
  const fetchStats = async (opts = {}) => {
    try {
      const requests = getRequests();
      const res = await self().$cached(
        'admin:usr-stats',
        () => requests.getUserStats(),
        {
          ttl: 2 * 60_000,
          force: opts.force,
          onSuccess: (data) => {
            state.stats = data;
            state.statsLoaded = true;
          },
        }
      );
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ─────────────────────────────────────────────────────────
  // BAN / UNBAN
  // ─────────────────────────────────────────────────────────
  const setBanStatus = async (id, { isBanned, reason }) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.setBanStatus(id, { isBanned, reason });

      if (res.success) {
        // Patch list item
        const idx = state.users.findIndex((u) => u._id === id);
        if (idx !== -1) {
          state.users[idx] = { ...state.users[idx], isBanned: res.data?.user?.isBanned };
        }
        // Patch detail
        if (state.current?._id === id) {
          state.current = { ...state.current, isBanned: res.data?.user?.isBanned };
        }
        invalidateDownstream();
        return { success: true, message: res.message };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isSubmitting = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // UPDATE USER (admin — limited fields)
  // ─────────────────────────────────────────────────────────
  const updateUser = async (id, payload) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.updateUser(id, payload);

      if (res.success) {
        const user = res.data?.user;
        if (user) {
          const idx = state.users.findIndex((u) => u._id === id);
          if (idx !== -1) state.users[idx] = user;
          if (state.current?._id === id) state.current = user;
        }
        invalidateDownstream();
        return { success: true, user, message: res.message };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isSubmitting = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // FILTERS / PAGINATION
  // ─────────────────────────────────────────────────────────
  const setFilters = (partial) => {
    state.filters = { ...state.filters, ...partial };
    state.pagination.page = 1;
  };
  const resetFilters = () => {
    state.filters = {
      search: '',
      role: 'all',
      kycStatus: 'all',
      isBanned: 'all',
      isVerified: 'all',
      sort: 'newest',
    };
    state.pagination.page = 1;
  };
  const setPage = (page) => { state.pagination.page = page; };

  // ─────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────
  const clearCurrent = () => { state.current = null; };

  const clearAll = () => {
    state.users = [];
    state.pagination = { total: 0, page: 1, limit: 20, pages: 0 };
    resetFilters();
    state.current = null;
    state.stats = null;
    state.statsLoaded = false;
    state.error = null;
    self().$invalidatePrefix('admin:usr-');
  };

  return {
    // state
    state,
    // getters
    hasUsers,
    totalPages,
    totalUsers,
    verifiedUsers,
    bannedUsers,
    kycPendingCount,
    // helpers
    setError,
    clearError,
    findById,
    setFilters,
    resetFilters,
    setPage,
    invalidateDownstream,
    // actions
    fetchUsers,
    fetchUser,
    fetchStats,
    setBanStatus,
    updateUser,
    // cleanup
    clearCurrent,
    clearAll,
  };
});