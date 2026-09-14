// stores/investment.js
import { defineStore } from 'pinia';

export const useInvestmentStore = defineStore('investment', () => {
  const getRequests = () => useInvestmentRequests();
  const self = () => useInvestmentStore();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    // Plans (public)
    plans: [],
    plansLoaded: false,
    currentPlan: null,        // plan being viewed on detail page

    // Preview (transient)
    preview: null,
    isPreviewing: false,

    // Active investments (for the "My investments" page + dashboard)
    activeInvestments: [],
    activeLoaded: false,

    // Full list
    investments: [],
    pagination: { total: 0, page: 1, limit: 20, pages: 0 },
    filters: { status: 'all' },

    // Detail
    current: null,            // investment detail
    currentProgress: 0,
    currentDaysLeft: 0,

    // Stats
    stats: null,
    statsLoaded: false,

    // UI
    isLoading: false,
    isSubmitting: false,
    error: null,
    _pollTimer: null,
  });

  // ─────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────
  const hasInvestments = computed(() => state.investments.length > 0);
  const hasActive = computed(() => state.activeInvestments.length > 0);

  /** Total currently invested (only active) */
  const totalActiveInvested = computed(() =>
    state.activeInvestments.reduce((s, i) => s + (i.amount || 0), 0)
  );

  /** Total earned across all investments */
  const totalEarned = computed(() =>
    state.investments.reduce((s, i) => s + (i.earned || 0), 0)
  );

  /** Plans sorted by sortOrder (backend already sorts, but defensive) */
  const sortedPlans = computed(() =>
    [...state.plans].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  );

  /** The "popular" plan if any */
  const popularPlan = computed(() =>
    state.plans.find((p) => p.isPopular) || null
  );

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  const findPlanById = (id) => state.plans.find((p) => p._id === id) || null;
  const findPlanBySlug = (slug) =>
    state.plans.find((p) => p.slug === slug) || null;

  // ─────────────────────────────────────────────────────────
  // PLANS (cache 10 min)
  // ─────────────────────────────────────────────────────────
  const fetchPlans = async (opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'investment:plans',
        () => requests.getPlans(),
        {
          ttl: 10 * 60_000,
          force: opts.force,
          onSuccess: (data) => {
            state.plans = data?.plans || [];
            state.plansLoaded = true;
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
  // PLAN BY SLUG (cache 10 min)
  // ─────────────────────────────────────────────────────────
  const fetchPlanBySlug = async (slug, opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        `investment:plan:${slug}`,
        () => requests.getPlanBySlug(slug),
        {
          ttl: 10 * 60_000,
          force: opts.force,
          onSuccess: (data) => { state.currentPlan = data?.plan || null; },
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
  // PREVIEW (never cached — user changes amount often)
  // ─────────────────────────────────────────────────────────
  const previewInvestment = async ({ planId, amount }) => {
    state.isPreviewing = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.previewInvestment({ planId, amount });

      if (res.success) {
        state.preview = res.data;
        return { success: true, preview: res.data };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isPreviewing = false;
    }
  };

  const clearPreview = () => { state.preview = null; };

  // ─────────────────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────────────────
  const createInvestment = async ({ planId, amount }) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.createInvestment({ planId, amount });

      if (res.success) {
        const inv = res.data?.investment;
        if (inv) {
          state.activeInvestments.unshift(inv);
          state.investments.unshift(inv);
          state.current = inv;
        }

        // 🧹 Invalidate caches
        self().$invalidatePrefix('investment:my:');
        self().$invalidate('investment:active');
        self().$invalidate('investment:stats');

        // Balance + transactions changed too
        try {
          const walletStore = useWalletStore();
          walletStore.invalidateBalances();
          walletStore.invalidateStats();
        } catch {}
        try { useTransactionStore().invalidateAll(); } catch {}

        return { success: true, investment: inv, message: res.message };
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
  // MY INVESTMENTS (cache 30 s per filter)
  // ─────────────────────────────────────────────────────────
  const fetchMyInvestments = async (params = {}, opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();

      const query = {
        page: params.page ?? state.pagination.page,
        limit: params.limit ?? state.pagination.limit,
        status: (params.status ?? state.filters.status) !== 'all'
          ? params.status ?? state.filters.status
          : undefined,
      };

      const cacheKey = `investment:my:${JSON.stringify(query)}`;

      const res = await self().$cached(
        cacheKey,
        () => requests.getMyInvestments(query),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.investments = data?.investments || [];
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
  // ACTIVE (cache 30 s)
  // ─────────────────────────────────────────────────────────
  const fetchActiveInvestments = async (opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'investment:active',
        () => requests.getActiveInvestments(),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.activeInvestments = data?.investments || [];
            state.activeLoaded = true;
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
  // ONE (cache 5 s — for progress polling)
  // ─────────────────────────────────────────────────────────
  const fetchInvestment = async (id, opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        `investment:one:${id}`,
        () => requests.getInvestmentById(id),
        {
          ttl: 5_000,
          force: opts.force,
          onSuccess: (data) => {
            state.current = data?.investment || null;
            state.currentProgress = data?.progress ?? 0;
            state.currentDaysLeft = data?.daysLeft ?? 0;
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
    try {
      const requests = getRequests();
      const res = await self().$cached(
        'investment:stats',
        () => requests.getInvestmentStats(),
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
  // FILTERS / PAGINATION
  // ─────────────────────────────────────────────────────────
  const setFilters = (partial) => {
    state.filters = { ...state.filters, ...partial };
    state.pagination.page = 1;
  };
  const resetFilters = () => {
    state.filters = { status: 'all' };
    state.pagination.page = 1;
  };
  const setPage = (page) => { state.pagination.page = page; };

  // ─────────────────────────────────────────────────────────
  // POLLING (only for active investments)
  // ─────────────────────────────────────────────────────────
  const startPolling = (id, intervalMs = 60_000) => {
    stopPolling();
    if (!import.meta.client) return;
    state._pollTimer = setInterval(async () => {
      const status = state.current?.status;
      if (status && status !== 'active') { stopPolling(); return; }
      await fetchInvestment(id, { force: true });
    }, intervalMs);
  };
  const stopPolling = () => {
    if (state._pollTimer) { clearInterval(state._pollTimer); state._pollTimer = null; }
  };

  // ─────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────
  const clearCurrentPlan = () => { state.currentPlan = null; };
  const clearCurrent = () => { stopPolling(); state.current = null; state.currentProgress = 0; state.currentDaysLeft = 0; };
  const clearPreviewState = () => { state.preview = null; };

  const clearAll = () => {
    stopPolling();
    state.plans = [];
    state.plansLoaded = false;
    state.currentPlan = null;
    state.preview = null;
    state.activeInvestments = [];
    state.activeLoaded = false;
    state.investments = [];
    state.pagination = { total: 0, page: 1, limit: 20, pages: 0 };
    state.filters = { status: 'all' };
    state.current = null;
    state.currentProgress = 0;
    state.currentDaysLeft = 0;
    state.stats = null;
    state.statsLoaded = false;
    state.error = null;
    self().$invalidatePrefix('investment:');
  };

  return {
    // state
    state,
    // getters
    hasInvestments,
    hasActive,
    totalActiveInvested,
    totalEarned,
    sortedPlans,
    popularPlan,
    // helpers
    setError,
    clearError,
    findPlanById,
    findPlanBySlug,
    setFilters,
    resetFilters,
    setPage,
    // actions
    fetchPlans,
    fetchPlanBySlug,
    previewInvestment,
    clearPreview,
    createInvestment,
    fetchMyInvestments,
    fetchActiveInvestments,
    fetchInvestment,
    fetchStats,
    // polling + cleanup
    startPolling,
    stopPolling,
    clearCurrentPlan,
    clearCurrent,
    clearPreviewState,
    clearAll,
  };
});