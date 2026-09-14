// stores/transaction.js
import { defineStore } from 'pinia';
import { TRANSACTION_ENDPOINTS } from '~/composables/constants';

export const useTransactionStore = defineStore('transaction', () => {
  const getRequests = () => useTransactionRequests();
  const self = () => useTransactionStore();

  // ───────── STATE ─────────
  const state = reactive({
    transactions: [],
    pagination: { total: 0, page: 1, limit: 20, pages: 0 },

    filters: {
      type: 'all',
      direction: 'all',
      status: 'all',
      currency: 'all',
      from: '',
      to: '',
      search: '',
      minAmount: '',
      maxAmount: '',
      sort: 'newest',
    },

    current: null,
    stats: null,
    monthlySummary: [],
    recent: [],

    isLoading: false,
    isLoadingStats: false,
    isLoadingDetail: false,
    error: null,
  });

  // ───────── GETTERS ─────────
  const hasTransactions = computed(() => state.transactions.length > 0);
  const totalPages = computed(() => state.pagination.pages || 0);
  const netBalance = computed(() => {
    if (!state.stats) return 0;
    return state.stats.netBalance ?? (
      (state.stats.totals?.totalCredits || 0) -
      (state.stats.totals?.totalDebits || 0)
    );
  });

  // ───────── HELPERS ─────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  const buildQuery = (overrides = {}) => {
    const f = { ...state.filters, ...overrides };
    const query = {};
    const pass = (key, value) => {
      if (value === undefined || value === null) return;
      const v = typeof value === 'string' ? value.trim() : value;
      if (v === '' || v === 'all') return;
      query[key] = v;
    };
    pass('type', f.type);
    pass('direction', f.direction);
    pass('status', f.status);
    pass('currency', f.currency);
    pass('from', f.from);
    pass('to', f.to);
    pass('search', f.search);
    pass('minAmount', f.minAmount);
    pass('maxAmount', f.maxAmount);
    pass('sort', f.sort);
    query.page = overrides.page ?? state.pagination.page;
    query.limit = overrides.limit ?? state.pagination.limit;
    return query;
  };

  // ───────── LIST (cache 30 s per filter combo) ─────────
  const fetchMyTransactions = async (overrides = {}, opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();
      const query = buildQuery(overrides);
      const cacheKey = `tx:list:${JSON.stringify(query)}`;

      const res = await self().$cached(
        cacheKey,
        () => requests.getMyTransactions(query),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.transactions = data?.transactions || [];
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

  // ───────── DETAIL (cache 5 min) ─────────
  const fetchTransaction = async (id, opts = {}) => {
    state.isLoadingDetail = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        `tx:one:${id}`,
        () => requests.getTransactionById(id),
        {
          ttl: 5 * 60_000,
          force: opts.force,
          onSuccess: (data) => { state.current = data?.transaction || null; },
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

  // ───────── STATS (cache 2 min) ─────────
  const fetchStats = async (opts = {}) => {
    state.isLoadingStats = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'tx:stats',
        () => requests.getTransactionStats(),
        {
          ttl: 2 * 60_000,
          force: opts.force,
          onSuccess: (data) => { state.stats = data; },
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

  // ───────── MONTHLY SUMMARY (cache 10 min) ─────────
  const fetchMonthlySummary = async (months = 6, opts = {}) => {
    try {
      const requests = getRequests();
      const res = await self().$cached(
        `tx:monthly:${months}`,
        () => requests.getMonthlySummary(months),
        {
          ttl: 10 * 60_000,
          force: opts.force,
          onSuccess: (data) => { state.monthlySummary = data?.summary || []; },
        }
      );
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ───────── RECENT (cache 1 min) ─────────
  const fetchRecent = async (limit = 5, opts = {}) => {
    try {
      const requests = getRequests();
      const res = await self().$cached(
        `tx:recent:${limit}`,
        () => requests.getRecentActivity(limit),
        {
          ttl: 60_000,
          force: opts.force,
          onSuccess: (data) => { state.recent = data?.transactions || []; },
        }
      );
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ───────── FILTERS ─────────
  const setFilters = (partial) => {
    state.filters = { ...state.filters, ...partial };
    state.pagination.page = 1;
  };

  const resetFilters = () => {
    state.filters = {
      type: 'all', direction: 'all', status: 'all', currency: 'all',
      from: '', to: '', search: '', minAmount: '', maxAmount: '',
      sort: 'newest',
    };
    state.pagination.page = 1;
  };

  const setPage = (page) => { state.pagination.page = page; };

  // ───────── INVALIDATE (call after write operations elsewhere) ─────────
  const invalidateAll = () => {
    self().$invalidatePrefix('tx:');
  };

  // ───────── CLEANUP ─────────
  const clearCurrent = () => { state.current = null; };

  const clearAll = () => {
    state.transactions = [];
    state.pagination = { total: 0, page: 1, limit: 20, pages: 0 };
    resetFilters();
    state.current = null;
    state.stats = null;
    state.monthlySummary = [];
    state.recent = [];
    state.error = null;
    invalidateAll();
  };

  return {
    state,
    hasTransactions,
    totalPages,
    netBalance,
    setError,
    clearError,
    setFilters,
    resetFilters,
    setPage,
    fetchMyTransactions,
    fetchTransaction,
    fetchStats,
    fetchMonthlySummary,
    fetchRecent,
    invalidateAll,
    clearCurrent,
    clearAll,
  };
});