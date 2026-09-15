// composables/requests/useAdminInvestmentRequests.js
import { ADMIN_INVESTMENT_ENDPOINTS } from '~/composables/constants';

export const useAdminInvestmentRequests = () => {
  const api = useApi();
  const authOpts = { requiresAuth: true }; // adminAuth is enforced by role on backend

  // ── Plans ──
  const getAllPlans = () =>
    api.get(ADMIN_INVESTMENT_ENDPOINTS.PLANS, authOpts);

  const createPlan = (payload) =>
    api.post(ADMIN_INVESTMENT_ENDPOINTS.PLANS, payload, authOpts);

  const updatePlan = (id, payload) =>
    api.put(ADMIN_INVESTMENT_ENDPOINTS.PLAN_BY_ID(id), payload, authOpts);

  const togglePlan = (id) =>
    api.patch(ADMIN_INVESTMENT_ENDPOINTS.PLAN_TOGGLE(id), {}, authOpts);

  const deletePlan = (id) =>
    api.delete(ADMIN_INVESTMENT_ENDPOINTS.PLAN_BY_ID(id), authOpts);

  const seedDefaultPlans = () =>
    api.post(ADMIN_INVESTMENT_ENDPOINTS.PLAN_SEED, {}, authOpts);

  // ── Investments ──
  const getAllInvestments = (params = {}) =>
    api.get(ADMIN_INVESTMENT_ENDPOINTS.INVESTMENTS, {
      ...authOpts,
      query: params,
    });

  const getInvestmentStats = () =>
    api.get(ADMIN_INVESTMENT_ENDPOINTS.INVESTMENT_STATS, authOpts);

  const runPayouts = () =>
    api.post(ADMIN_INVESTMENT_ENDPOINTS.RUN_PAYOUTS, {}, authOpts);

  const getInvestmentEarnings = (id) =>
    api.get(ADMIN_INVESTMENT_ENDPOINTS.INVESTMENT_EARNINGS(id), authOpts);

  return {
    getAllPlans,
    createPlan,
    updatePlan,
    togglePlan,
    deletePlan,
    seedDefaultPlans,
    getAllInvestments,
    getInvestmentStats,
    runPayouts,
    getInvestmentEarnings,
  };
};