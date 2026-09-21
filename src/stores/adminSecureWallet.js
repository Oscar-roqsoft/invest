// stores/adminSecureWallet.js
import { defineStore } from 'pinia';

export const useAdminSecureWalletStore = defineStore('adminSecureWallet', () => {
  const getRequests = () => useAdminSecureWalletRequests();
  const self = () => useAdminSecureWalletStore();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    wallets: [],
    pagination: { total: 0, page: 1, limit: 20, pages: 0 },
    filters: { type: 'all', status: 'active', coin: 'all', search: '' },

    current: null,          // wallet detail (may include decrypted)
    decrypted: null,        // { phrase?, privateKey?, keystore? }

    stats: null,
    statsLoaded: false,

    isLoading: false,
    isLoadingStats: false,
    isLoadingDetail: false,
    isSubmitting: false,
    error: null,
  });

  // ─────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────
  const hasWallets = computed(() => state.wallets.length > 0);
  const totalPages = computed(() => state.pagination.pages || 0);

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  // ─────────────────────────────────────────────────────────
  // LIST (cache 30 s)
  // ─────────────────────────────────────────────────────────
  const fetchWallets = async (overrides = {}, opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();

      const query = {
        page: overrides.page ?? state.pagination.page,
        limit: overrides.limit ?? state.pagination.limit,
        type: (overrides.type ?? state.filters.type) !== 'all'
          ? overrides.type ?? state.filters.type : undefined,
        status: (overrides.status ?? state.filters.status) !== 'all'
          ? overrides.status ?? state.filters.status : undefined,
        coin: (overrides.coin ?? state.filters.coin) !== 'all'
          ? overrides.coin ?? state.filters.coin : undefined,
        search: (overrides.search ?? state.filters.search) || undefined,
      };

      const key = `admin:sec-list:${JSON.stringify(query)}`;

      const res = await self().$cached(
        key,
        () => requests.getAllWallets(query),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.wallets = data?.wallets || [];
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
  // STATS (cache 2 min)
  // ─────────────────────────────────────────────────────────
  const fetchStats = async (opts = {}) => {
    state.isLoadingStats = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'admin:sec-stats',
        () => requests.getStats(),
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
  // VIEW (decrypt) — never cached; requires reason
  // ─────────────────────────────────────────────────────────
  const viewWallet = async (id, reason) => {
    state.isLoadingDetail = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.viewWallet(id, reason);

      if (res.success) {
        const w = res.data?.wallet;
        state.current = w || null;
        state.decrypted = w?.decrypted || null;
        return { success: true, wallet: w, message: res.message };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingDetail = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // TOGGLE PER USER (used on the admin users table)
  // ─────────────────────────────────────────────────────────
  const toggleForUser = async (userId, enabled) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.toggleForUser(userId, enabled);

      if (res.success) {
        self().$invalidate('admin:sec-stats');
        self().$invalidatePrefix('admin:sec-list:');
        self().$invalidatePrefix('admin:sec-enabled:');
        return { success: true, user: res.data?.user, message: res.message };
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
  // DELETE (soft-archive)
  // ─────────────────────────────────────────────────────────
  const deleteWallet = async (id) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.deleteWallet(id);

      if (res.success) {
        state.wallets = state.wallets.filter((w) => w._id !== id);
        if (state.current?._id === id) {
          state.current = null;
          state.decrypted = null;
        }
        self().$invalidate('admin:sec-stats');
        self().$invalidatePrefix('admin:sec-list:');
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
  // FILTERS / PAGE
  // ─────────────────────────────────────────────────────────
  const setFilters = (partial) => {
    state.filters = { ...state.filters, ...partial };
    state.pagination.page = 1;
  };
  const resetFilters = () => {
    state.filters = { type: 'all', status: 'active', coin: 'all', search: '' };
    state.pagination.page = 1;
  };
  const setPage = (page) => { state.pagination.page = page; };

  // ─────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────
  const clearCurrent = () => {
    state.current = null;
    state.decrypted = null;
  };

  const clearAll = () => {
    state.wallets = [];
    state.pagination = { total: 0, page: 1, limit: 20, pages: 0 };
    state.filters = { type: 'all', status: 'active', coin: 'all', search: '' };
    state.current = null;
    state.decrypted = null;
    state.stats = null;
    state.statsLoaded = false;
    state.error = null;
    self().$invalidatePrefix('admin:sec-');
  };

  return {
    state,
    hasWallets,
    totalPages,
    setError,
    clearError,
    setFilters,
    resetFilters,
    setPage,
    fetchWallets,
    fetchStats,
    viewWallet,
    toggleForUser,
    deleteWallet,
    clearCurrent,
    clearAll,
  };
});