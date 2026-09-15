// stores/adminWithdrawal.js
import { defineStore } from 'pinia';

export const useAdminWithdrawalStore = defineStore('adminWithdrawal', () => {
  const getRequests = () => useAdminWithdrawalRequests();
  const self = () => useAdminWithdrawalStore();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    withdrawals: [],
    pagination: { total: 0, page: 1, limit: 20, pages: 0 },
    filters: { status: 'all', currency: 'all', search: '' },

    current: null,        // withdrawal detail

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
  const hasWithdrawals = computed(() => state.withdrawals.length > 0);
  const totalPages = computed(() => state.pagination.pages || 0);

  const pendingCount = computed(() =>
    state.stats?.byStatus?.find((s) => s._id === 'pending')?.count || 0
  );

  const pendingTotalUSD = computed(() =>
    state.stats?.byStatus?.find((s) => s._id === 'pending')?.totalUSD || 0
  );

  /** Actions available on the currently-viewed withdrawal */
  const availableActions = computed(() => {
    const status = state.current?.status;
    if (!status) return {};
    return WITHDRAWAL_TRANSITIONS[status] || {};
  });

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  const findById = (id) => state.withdrawals.find((w) => w._id === id) || null;

  /**
   * Any successful admin action changes:
   *   - admin list cache
   *   - admin stats cache
   *   - user's wallet (balance moved or refunded)
   *   - user's transaction list
   */
  const invalidateDownstream = () => {
    self().$invalidatePrefix('admin:wd-list:');
    self().$invalidate('admin:wd-stats');
    try { useWalletStore().invalidateAll?.(); } catch {}
    try { useTransactionStore().invalidateAll?.(); } catch {}
  };

  // ─────────────────────────────────────────────────────────
  // LIST (cache 15 s — needs to feel fresh)
  // ─────────────────────────────────────────────────────────
  const fetchWithdrawals = async (overrides = {}, opts = {}) => {
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

      const cacheKey = `admin:wd-list:${JSON.stringify(query)}`;

      const res = await self().$cached(
        cacheKey,
        () => requests.getAllWithdrawals(query),
        {
          ttl: 15_000,     // short — pending queue must feel live
          force: opts.force,
          onSuccess: (data) => {
            state.withdrawals = data?.withdrawals || [];
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
  const fetchWithdrawal = async (id, opts = {}) => {
    state.isLoadingDetail = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        `admin:wd-one:${id}`,
        () => requests.getWithdrawalById(id),
        {
          ttl: 10_000,
          force: opts.force,
          onSuccess: (data) => { state.current = data?.withdrawal || null; },
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
        'admin:wd-stats',
        () => requests.getWithdrawalStats(),
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
  // TRANSITIONS — all share the same boilerplate
  // ─────────────────────────────────────────────────────────
  const _applyTransition = async (id, actionFn, successMessage) => {
    state.isSubmitting = true;
    clearError();

    try {
      const res = await actionFn();

      if (res.success) {
        const w = res.data?.withdrawal;
        if (w) {
          // Update list
          const idx = state.withdrawals.findIndex((x) => x._id === id);
          if (idx !== -1) state.withdrawals[idx] = w;
          // Update current detail (if we're on that page)
          if (state.current?._id === id) state.current = w;
        }
        invalidateDownstream();
        return { success: true, withdrawal: w, message: res.message || successMessage };
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

  const approveWithdrawal = (id, { note } = {}) => {
    const requests = getRequests();
    return _applyTransition(id, () => requests.approveWithdrawal(id, { note }), 'Withdrawal approved');
  };

  const markProcessing = (id, { txHash, note } = {}) => {
    const requests = getRequests();
    return _applyTransition(id, () => requests.markProcessing(id, { txHash, note }), 'Withdrawal processing');
  };

  const completeWithdrawal = (id, { txHash, note } = {}) => {
    const requests = getRequests();
    return _applyTransition(id, () => requests.completeWithdrawal(id, { txHash, note }), 'Withdrawal completed');
  };

  const rejectWithdrawal = (id, { reason } = {}) => {
    const requests = getRequests();
    return _applyTransition(id, () => requests.rejectWithdrawal(id, { reason }), 'Withdrawal rejected');
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
    state.withdrawals = [];
    state.pagination = { total: 0, page: 1, limit: 20, pages: 0 };
    state.filters = { status: 'all', currency: 'all', search: '' };
    state.current = null;
    state.stats = null;
    state.statsLoaded = false;
    state.error = null;
    self().$invalidatePrefix('admin:wd-');
  };

  return {
    // state
    state,
    // getters
    hasWithdrawals,
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
    fetchWithdrawals,
    fetchWithdrawal,
    fetchStats,
    approveWithdrawal,
    markProcessing,
    completeWithdrawal,
    rejectWithdrawal,
    // cleanup
    clearCurrent,
    clearAll,
  };
});