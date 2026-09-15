// stores/adminInvestment.js
import { defineStore } from 'pinia';

export const useAdminInvestmentStore = defineStore('adminInvestment', () => {
  const getRequests = () => useAdminInvestmentRequests();
  const self = () => useAdminInvestmentStore();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    // Plans (admin — includes inactive)
    plans: [],
    plansLoaded: false,

    // Current plan for edit page
    editing: null,

    // Investments (admin)
    investments: [],
    investmentsPagination: { total: 0, page: 1, limit: 20, pages: 0 },
    investmentsFilters: { status: 'all', planId: '' },

    // Stats
    stats: null,
    statsLoaded: false,

    // Earnings log for one investment
    earningsLog: [],

    // UI
    isLoading: false,
    isSubmitting: false,
    isSeeding: false,
    isRunningPayouts: false,
    error: null,
  });

  // ─────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────
  const hasPlans = computed(() => state.plans.length > 0);
  const activePlans = computed(() => state.plans.filter((p) => p.isActive));
  const inactivePlans = computed(() => state.plans.filter((p) => !p.isActive));

  const totalPlans = computed(() => state.plans.length);

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  /**
   * After any write to plans, we must:
   *   1. invalidate our own admin cache
   *   2. invalidate the PUBLIC investment store cache so users see fresh data
   */
  const invalidatePublicPlans = () => {
    try {
      useInvestmentStore().state && self(); // ensure setup ran
      const inv = useInvestmentStore();
      inv.$invalidate?.('investment:plans');
      inv.$invalidatePrefix?.('investment:plan:');
    } catch (err) {
      // store may not be initialized yet — safe to ignore
    }
  };

  // ─────────────────────────────────────────────────────────
  // PLANS — LIST
  // ─────────────────────────────────────────────────────────
  const fetchPlans = async () => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.getAllPlans();

      if (res.success) {
        state.plans = res.data?.plans || [];
        state.plansLoaded = true;
        return { success: true, plans: state.plans };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoading = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // PLANS — CREATE
  // ─────────────────────────────────────────────────────────
  const createPlan = async (payload) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.createPlan(payload);

      if (res.success) {
        const plan = res.data?.plan;
        if (plan) state.plans.push(plan);
        invalidatePublicPlans();
        return { success: true, plan, message: res.message };
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
  // PLANS — UPDATE
  // ─────────────────────────────────────────────────────────
  const updatePlan = async (id, payload) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.updatePlan(id, payload);

      if (res.success) {
        const plan = res.data?.plan;
        if (plan) {
          const idx = state.plans.findIndex((p) => p._id === id);
          if (idx !== -1) state.plans[idx] = plan;
        }
        invalidatePublicPlans();
        return { success: true, plan, message: res.message };
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
  // PLANS — TOGGLE
  // ─────────────────────────────────────────────────────────
  const togglePlan = async (id) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.togglePlan(id);

      if (res.success) {
        const plan = res.data?.plan;
        if (plan) {
          const idx = state.plans.findIndex((p) => p._id === id);
          if (idx !== -1) state.plans[idx] = plan;
        }
        invalidatePublicPlans();
        return { success: true, plan, message: res.message };
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
  // PLANS — DELETE
  // ─────────────────────────────────────────────────────────
  const deletePlan = async (id) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.deletePlan(id);

      if (res.success) {
        state.plans = state.plans.filter((p) => p._id !== id);
        invalidatePublicPlans();
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
  // PLANS — SEED
  // ─────────────────────────────────────────────────────────
  const seedDefaults = async () => {
    state.isSeeding = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.seedDefaultPlans();

      if (res.success) {
        // Reload list to see everything
        await fetchPlans();
        invalidatePublicPlans();
        return { success: true, created: res.data?.plans?.length || 0, message: res.message };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isSeeding = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // EDITING (local, for form pages)
  // ─────────────────────────────────────────────────────────
  const findPlanById = (id) => state.plans.find((p) => p._id === id) || null;

  const setEditing = (plan) => { state.editing = plan; };
  const clearEditing = () => { state.editing = null; };

  // ─────────────────────────────────────────────────────────
  // INVESTMENTS — LIST (cache 30 s)
  // ─────────────────────────────────────────────────────────
  const fetchInvestments = async (params = {}, opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();

      const query = {
        page: params.page ?? state.investmentsPagination.page,
        limit: params.limit ?? state.investmentsPagination.limit,
        status: (params.status ?? state.investmentsFilters.status) !== 'all'
          ? params.status ?? state.investmentsFilters.status
          : undefined,
        planId: params.planId ?? (state.investmentsFilters.planId || undefined),
      };

      const cacheKey = `admin:inv-list:${JSON.stringify(query)}`;

      const res = await self().$cached(
        cacheKey,
        () => requests.getAllInvestments(query),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.investments = data?.investments || [];
            if (data?.pagination) state.investmentsPagination = data.pagination;
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
  // INVESTMENTS — STATS (cache 30 s)
  // ─────────────────────────────────────────────────────────
  const fetchStats = async (opts = {}) => {
    try {
      const requests = getRequests();
      const res = await self().$cached(
        'admin:inv-stats',
        () => requests.getInvestmentStats(),
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
  // EARNINGS LOG (per investment)
  // ─────────────────────────────────────────────────────────
  const fetchEarningsLog = async (investmentId, opts = {}) => {
    try {
      const requests = getRequests();
      const res = await self().$cached(
        `admin:earnings:${investmentId}`,
        () => requests.getInvestmentEarnings(investmentId),
        {
          ttl: 60_000,
          force: opts.force,
          onSuccess: (data) => { state.earningsLog = data?.earnings || []; },
        }
      );
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ─────────────────────────────────────────────────────────
  // RUN PAYOUTS (manual)
  // ─────────────────────────────────────────────────────────
  const runPayouts = async () => {
    state.isRunningPayouts = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.runPayouts();

      if (res.success) {
        // Stats changed — invalidate
        self().$invalidate('admin:inv-stats');
        self().$invalidatePrefix('admin:inv-list:');
        try { useTransactionStore().invalidateAll(); } catch {}
        try { useWalletStore().invalidateStats?.(); } catch {}
        return { success: true, message: res.message };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isRunningPayouts = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // FILTERS / PAGINATION (investments)
  // ─────────────────────────────────────────────────────────
  const setInvestmentsFilters = (partial) => {
    state.investmentsFilters = { ...state.investmentsFilters, ...partial };
    state.investmentsPagination.page = 1;
  };
  const resetInvestmentsFilters = () => {
    state.investmentsFilters = { status: 'all', planId: '' };
    state.investmentsPagination.page = 1;
  };
  const setInvestmentsPage = (page) => {
    state.investmentsPagination.page = page;
  };

  // ─────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────
  const clearAll = () => {
    state.plans = [];
    state.plansLoaded = false;
    state.editing = null;
    state.investments = [];
    state.investmentsPagination = { total: 0, page: 1, limit: 20, pages: 0 };
    state.investmentsFilters = { status: 'all', planId: '' };
    state.stats = null;
    state.statsLoaded = false;
    state.earningsLog = [];
    state.error = null;
    self().$invalidatePrefix('admin:');
  };

  return {
    // state
    state,
    // getters
    hasPlans,
    activePlans,
    inactivePlans,
    totalPlans,
    // helpers
    setError,
    clearError,
    findPlanById,
    setEditing,
    clearEditing,
    setInvestmentsFilters,
    resetInvestmentsFilters,
    setInvestmentsPage,
    invalidatePublicPlans,
    // plans
    fetchPlans,
    createPlan,
    updatePlan,
    togglePlan,
    deletePlan,
    seedDefaults,
    // investments
    fetchInvestments,
    fetchStats,
    fetchEarningsLog,
    runPayouts,
    // cleanup
    clearAll,
  };
});