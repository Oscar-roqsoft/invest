// stores/adminReferral.js
import { defineStore } from 'pinia';

export const useAdminReferralStore = defineStore('adminReferral', () => {
  const getRequests = () => useAdminReferralRequests();
  const self = () => useAdminReferralStore();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    // List (platform-wide)
    referrals: [],
    pagination: { total: 0, page: 1, limit: 30, pages: 0 },
    filters: {
      status: 'all',
      search: '',
      referrerId: '',
      referredId: '',
      sort: 'newest',
    },

    // Stats (includes topReferrers)
    stats: null,
    statsLoaded: false,

    // Per-user detail
    userDetail: null,
    userReferrals: [],
    userDetailLoaded: false,

    // UI
    isLoading: false,
    isLoadingStats: false,
    isLoadingUserDetail: false,
    isSubmitting: false,
    isBackfilling: false,
    error: null,
  });

  // ─────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────
  const hasReferrals = computed(() => state.referrals.length > 0);
  const totalPages = computed(() => state.pagination.pages || 0);

  const totalCommissionPaid = computed(() =>
    state.stats?.totalCommissionPaid || 0
  );
  const totalSourceVolume = computed(() =>
    state.stats?.totalSourceVolume || 0
  );
  const totalReferredUsers = computed(() =>
    state.stats?.totalReferredUsers || 0
  );

  const topReferrers = computed(() => state.stats?.topReferrers || []);

  const byStatus = computed(() => {
    const map = {};
    for (const row of state.stats?.byStatus || []) {
      map[row._id] = row;
    }
    return map;
  });

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  const invalidateDownstream = () => {
    // Newly credited referrals change:
    //   - user's wallet balance
    //   - user's transaction list
    //   - user's own referral info cache
    try { useWalletStore().invalidateAll?.(); } catch {}
    try { useTransactionStore().invalidateAll?.(); } catch {}
    try { useReferralStore?.().$invalidatePrefix?.('referral:'); } catch {}
  };

  // ─────────────────────────────────────────────────────────
  // LIST (cache 30 s)
  // ─────────────────────────────────────────────────────────
  const fetchReferrals = async (overrides = {}, opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();

      const query = {
        page: overrides.page ?? state.pagination.page,
        limit: overrides.limit ?? state.pagination.limit,
        status: (overrides.status ?? state.filters.status) !== 'all'
          ? overrides.status ?? state.filters.status : undefined,
        search: (overrides.search ?? state.filters.search) || undefined,
        referrerId: (overrides.referrerId ?? state.filters.referrerId) || undefined,
        referredId: (overrides.referredId ?? state.filters.referredId) || undefined,
        sort: overrides.sort ?? state.filters.sort,
      };

      const cacheKey = `admin:ref-list:${JSON.stringify(query)}`;

      const res = await self().$cached(
        cacheKey,
        () => requests.getAllReferrals(query),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.referrals = data?.referrals || [];
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
  // STATS (cache 2 min — heavy aggregate)
  // ─────────────────────────────────────────────────────────
  const fetchStats = async (opts = {}) => {
    state.isLoadingStats = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'admin:ref-stats',
        () => requests.getReferralStats(),
        {
          ttl: 2 * 60_000,
          force: opts.force,
          onSuccess: (data) => {
            state.stats = data;
            state.statsLoaded = true;
          },
        }
      );

      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingStats = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // USER DETAIL (cache 60 s)
  // ─────────────────────────────────────────────────────────
  const fetchUserReferrals = async (userId, opts = {}) => {
    state.isLoadingUserDetail = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        `admin:ref-user:${userId}`,
        () => requests.getUserReferrals(userId),
        {
          ttl: 60_000,
          force: opts.force,
          onSuccess: (data) => {
            state.userDetail = data?.user || null;
            state.userReferrals = data?.referrals || [];
            state.userDetailLoaded = true;
          },
        }
      );

      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingUserDetail = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // MANUAL CREDIT
  // ─────────────────────────────────────────────────────────
  const manuallyCredit = async ({ referrerId, referredId, depositId }) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.manuallyCreditReferral({
        referrerId,
        referredId,
        depositId,
      });

      if (res.success) {
        // Invalidate caches that just changed
        self().$invalidatePrefix('admin:ref-list:');
        self().$invalidate('admin:ref-stats');
        self().$invalidatePrefix('admin:ref-user:');
        invalidateDownstream();
        return { success: true, referral: res.data?.referral, message: res.message };
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
  // BACKFILL (long-running)
  // ─────────────────────────────────────────────────────────
  const backfill = async () => {
    state.isBackfilling = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.backfillReferrals();

      if (res.success) {
        // Everything likely changed
        self().$invalidatePrefix('admin:ref-');
        invalidateDownstream();
        return { success: true, result: res.data, message: res.message };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isBackfilling = false;
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
      status: 'all',
      search: '',
      referrerId: '',
      referredId: '',
      sort: 'newest',
    };
    state.pagination.page = 1;
  };
  const setPage = (page) => { state.pagination.page = page; };

  // ─────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────
  const clearUserDetail = () => {
    state.userDetail = null;
    state.userReferrals = [];
    state.userDetailLoaded = false;
  };

  const clearAll = () => {
    state.referrals = [];
    state.pagination = { total: 0, page: 1, limit: 30, pages: 0 };
    resetFilters();
    state.stats = null;
    state.statsLoaded = false;
    clearUserDetail();
    state.error = null;
    self().$invalidatePrefix('admin:ref-');
  };

  return {
    // state
    state,
    // getters
    hasReferrals,
    totalPages,
    totalCommissionPaid,
    totalSourceVolume,
    totalReferredUsers,
    topReferrers,
    byStatus,
    // helpers
    setError,
    clearError,
    setFilters,
    resetFilters,
    setPage,
    invalidateDownstream,
    // actions
    fetchReferrals,
    fetchStats,
    fetchUserReferrals,
    manuallyCredit,
    backfill,
    // cleanup
    clearUserDetail,
    clearAll,
  };
});