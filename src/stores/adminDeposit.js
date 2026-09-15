// stores/adminDeposit.js
import { defineStore } from 'pinia';

export const useAdminDepositStore = defineStore('adminDeposit', () => {
  const getRequests = () => useAdminDepositRequests();
  const self = () => useAdminDepositStore();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    deposits: [],
    pagination: { total: 0, page: 1, limit: 20, pages: 0 },
    filters: { status: 'all', currency: 'all', search: '' },

    current: null,

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
  const hasDeposits = computed(() => state.deposits.length > 0);
  const totalPages = computed(() => state.pagination.pages || 0);

  const pendingCount = computed(() =>
    (state.stats?.byStatus?.find((s) => s._id === 'pending')?.count || 0) +
    (state.stats?.byStatus?.find((s) => s._id === 'confirming')?.count || 0)
  );

  const pendingTotalUSD = computed(() =>
    (state.stats?.byStatus?.find((s) => s._id === 'pending')?.totalUSD || 0) +
    (state.stats?.byStatus?.find((s) => s._id === 'confirming')?.totalUSD || 0)
  );

  const availableActions = computed(() => {
    const status = state.current?.status;
    if (!status) return {};
    return DEPOSIT_TRANSITIONS[status] || {};
  });

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  const findById = (id) => state.deposits.find((d) => d._id === id) || null;

  /**
   * Any successful admin action changes:
   *   - admin list cache
   *   - admin stats cache
   *   - user's wallet balances (USD + crypto)
   *   - user's transactions
   *   - if approved AND referrer exists → referrer's wallet too
   */
  const invalidateDownstream = () => {
    self().$invalidatePrefix('admin:dep-list:');
    self().$invalidate('admin:dep-stats');
    try { useWalletStore().invalidateAll?.(); } catch {}
    try { useTransactionStore().invalidateAll?.(); } catch {}
    try { useReferralStore?.().$invalidatePrefix?.('referral:'); } catch {}
  };

  // ─────────────────────────────────────────────────────────
  // LIST (cache 15 s)
  // ─────────────────────────────────────────────────────────
  const fetchDeposits = async (overrides = {}, opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();

      const query = {
        page: overrides.page ?? state.pagination.page,
        limit: overrides.limit ?? state.pagination.limit,
        status: (overrides.status ?? state.filters.status) !== 'all'
          ? overrides.status ?? state.filters.status : undefined,
        currency: (overrides.currency ?? state.filters.currency) !== 'all'
          ? overrides.currency ?? state.filters.currency : undefined,
        search: (overrides.search ?? state.filters.search) || undefined,
      };

      const cacheKey = `admin:dep-list:${JSON.stringify(query)}`;

      const res = await self().$cached(
        cacheKey,
        () => requests.getAllDeposits(query),
        {
          ttl: 15_000,
          force: opts.force,
          onSuccess: (data) => {
            state.deposits = data?.deposits || [];
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
  // DETAIL (cache 10 s)
  // ─────────────────────────────────────────────────────────
  const fetchDeposit = async (id, opts = {}) => {
    state.isLoadingDetail = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        `admin:dep-one:${id}`,
        () => requests.getDepositById(id),
        {
          ttl: 10_000,
          force: opts.force,
          onSuccess: (data) => { state.current = data?.deposit || null; },
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
  // STATS (cache 30 s)
  // ─────────────────────────────────────────────────────────
  const fetchStats = async (opts = {}) => {
    try {
      const requests = getRequests();
      const res = await self().$cached(
        'admin:dep-stats',
        () => requests.getDepositStats(),
        {
          ttl: 30_000,
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
  // TRANSITIONS
  // ─────────────────────────────────────────────────────────
  const _applyTransition = async (id, actionFn) => {
    state.isSubmitting = true;
    clearError();

    try {
      const res = await actionFn();

      if (res.success) {
        const d = res.data?.deposit;
        if (d) {
          const idx = state.deposits.findIndex((x) => x._id === id);
          if (idx !== -1) state.deposits[idx] = d;
          if (state.current?._id === id) state.current = d;
        }
        invalidateDownstream();
        return { success: true, deposit: d, message: res.message };
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

  const approveDeposit = (id, { note } = {}) => {
    const requests = getRequests();
    return _applyTransition(id, () => requests.approveDeposit(id, { note }));
  };

  const rejectDeposit = (id, { reason } = {}) => {
    const requests = getRequests();
    return _applyTransition(id, () => requests.rejectDeposit(id, { reason }));
  };

  // ─────────────────────────────────────────────────────────
  // FILTERS / PAGINATION
  // ─────────────────────────────────────────────────────────
  const setFilters = (partial) => {
    state.filters = { ...state.filters, ...partial };
    state.pagination.page = 1;
  };
  const resetFilters = () => {
    state.filters = { status: 'all', currency: 'all', search: '' };
    state.pagination.page = 1;
  };
  const setPage = (page) => { state.pagination.page = page; };

  // ─────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────
  const clearCurrent = () => { state.current = null; };

  const clearAll = () => {
    state.deposits = [];
    state.pagination = { total: 0, page: 1, limit: 20, pages: 0 };
    state.filters = { status: 'all', currency: 'all', search: '' };
    state.current = null;
    state.stats = null;
    state.statsLoaded = false;
    state.error = null;
    self().$invalidatePrefix('admin:dep-');
  };

  return {
    // state
    state,
    // getters
    hasDeposits,
    totalPages,
    pendingCount,
    pendingTotalUSD,
    availableActions,
    // helpers
    setError,
    clearError,
    findById,
    setFilters,
    resetFilters,
    setPage,
    invalidateDownstream,
    // actions
    fetchDeposits,
    fetchDeposit,
    fetchStats,
    approveDeposit,
    rejectDeposit,
    // cleanup
    clearCurrent,
    clearAll,
  };
});