// composables/requests/useInvestmentRequests.js
import { INVESTMENT_ENDPOINTS } from '~/composables/constants';

export const useInvestmentRequests = () => {
  const api = useApi();

  // ── Public ──
  const getPlans = () =>
    api.get(INVESTMENT_ENDPOINTS.PLANS);

  const getPlanBySlug = (slug) =>
    api.get(INVESTMENT_ENDPOINTS.PLAN_BY_SLUG(slug));

  // ── Auth ──
  const previewInvestment = ({ planId, amount }) =>
    api.post(INVESTMENT_ENDPOINTS.PREVIEW, { planId, amount }, { requiresAuth: true });

  const createInvestment = ({ planId, amount }) =>
    api.post(INVESTMENT_ENDPOINTS.CREATE, { planId, amount }, { requiresAuth: true });

  const getMyInvestments = (params = {}) =>
    api.get(INVESTMENT_ENDPOINTS.MY, { requiresAuth: true, query: params });

  const getActiveInvestments = () =>
    api.get(INVESTMENT_ENDPOINTS.ACTIVE, { requiresAuth: true });

  const getInvestmentById = (id) =>
    api.get(INVESTMENT_ENDPOINTS.BY_ID(id), { requiresAuth: true });

  const getInvestmentStats = () =>
    api.get(INVESTMENT_ENDPOINTS.STATS, { requiresAuth: true });

  return {
    getPlans,
    getPlanBySlug,
    previewInvestment,
    createInvestment,
    getMyInvestments,
    getActiveInvestments,
    getInvestmentById,
    getInvestmentStats,
  };
};