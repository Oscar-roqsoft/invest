// stores/referral.js
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useReferralStore = defineStore('referral', () => {
  // Lazy composable — avoids circular import issues
  const getRequests = () => useReferralRequests();

  // ───────── STATE ─────────
  const state = reactive({
    info: null,
    stats: null,

    referrals: [],
    referralsPagination: { total: 0, page: 1, limit: 20, pages: 0 },

    earnings: [],
    earningsTotal: 0,
    earningsPagination: { total: 0, page: 1, limit: 20, pages: 0 },

    tree: [],
    treeTotals: { level1: 0, level2: 0 },

    monthlyEarnings: [],
    leaderboard: [],
    validationResult: null,

    isLoading: false,
    isSubmitting: false,
    error: null,
  });

  // ───────── HELPERS ─────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  // The plugin attaches $cached to the STORE instance.
  // We grab a reference to the store so we can use it here.
  // (must be inside each action, not at module top, due to pinia init order)
  const self = () => useReferralStore();

  // ───────── INFO ─────────
  const fetchInfo = async (opts = {}) => {
    state.isLoading = true;
    clearError();
    try {
      const requests = getRequests();
      const res = await self().$cached(
        'info',
        () => requests.getReferralInfo(),
        {
          ttl: 60_000,
          force: opts.force,
          onSuccess: (data) => { state.info = data; },
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

  // ───────── STATS ─────────
  const fetchStats = async (opts = {}) => {
    state.isLoading = true;
    clearError();
    try {
      const requests = getRequests();
      const res = await self().$cached(
        'stats',
        () => requests.getReferralStats(),
        {
          ttl: 60_000,
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
      state.isLoading = false;
    }
  };

  // ───────── REFERRALS ─────────
  const fetchReferrals = async (params = {}, opts = {}) => {
    state.isLoading = true;
    clearError();
    try {
      const requests = getRequests();
      const key = `referrals:${JSON.stringify(params)}`;
      const res = await self().$cached(
        key,
        () => requests.getMyReferrals(params),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.referrals = data.referrals || [];
            state.referralsPagination = data.pagination || state.referralsPagination;
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

  // ───────── EARNINGS ─────────
  const fetchEarnings = async (params = {}, opts = {}) => {
    state.isLoading = true;
    clearError();
    try {
      const requests = getRequests();
      const key = `earnings:${JSON.stringify(params)}`;
      const res = await self().$cached(
        key,
        () => requests.getReferralEarnings(params),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.earnings = data.earnings || [];
            state.earningsTotal = data.totalEarned || 0;
            state.earningsPagination = data.pagination || state.earningsPagination;
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

  // ───────── TREE ─────────
  const fetchTree = async (opts = {}) => {
    state.isLoading = true;
    clearError();
    try {
      const requests = getRequests();
      const res = await self().$cached(
        'tree',
        () => requests.getReferralTree(),
        {
          ttl: 60_000,
          force: opts.force,
          onSuccess: (data) => {
            state.tree = data.tree || [];
            state.treeTotals = {
              level1: data.totalLevel1 || 0,
              level2: data.totalLevel2 || 0,
            };
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

  // ───────── MONTHLY EARNINGS ─────────
  const fetchMonthlyEarnings = async (months = 6, opts = {}) => {
    try {
      const requests = getRequests();
      const res = await self().$cached(
        `monthly:${months}`,
        () => requests.getMonthlyEarnings(months),
        {
          ttl: 5 * 60_000,
          force: opts.force,
          onSuccess: (data) => { state.monthlyEarnings = data.summary || []; },
        }
      );
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ───────── LEADERBOARD ─────────
  const fetchLeaderboard = async (limit = 10, opts = {}) => {
    try {
      const requests = getRequests();
      const res = await self().$cached(
        `leaderboard:${limit}`,
        () => requests.getLeaderboard(limit),
        {
          ttl: 5 * 60_000,
          force: opts.force,
          onSuccess: (data) => { state.leaderboard = data.leaderboard || []; },
        }
      );
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ───────── VALIDATE CODE ─────────
  const validateCode = async (code, opts = {}) => {
    try {
      const requests = getRequests();
      const res = await self().$cached(
        `validate:${code}`,
        () => requests.validateReferralCode(code),
        {
          ttl: 60_000,
          force: opts.force,
          onSuccess: (data) => { state.validationResult = data; },
        }
      );
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ───────── CLEANUP ─────────
  const clearAll = () => {
    state.info = null;
    state.stats = null;
    state.referrals = [];
    state.earnings = [];
    state.earningsTotal = 0;
    state.tree = [];
    state.treeTotals = { level1: 0, level2: 0 };
    state.monthlyEarnings = [];
    state.leaderboard = [];
    state.validationResult = null;
    state.error = null;

    // clear cache timestamps too
    self().$invalidate();
  };

  return {
    state,
    fetchInfo,
    fetchStats,
    fetchReferrals,
    fetchEarnings,
    fetchTree,
    fetchMonthlyEarnings,
    fetchLeaderboard,
    validateCode,
    clearAll,
    setError,
    clearError,
  };
});