// composables/requests/useTransactionRequests.js
import { TRANSACTION_ENDPOINTS } from '~/composables/constants';

export const useTransactionRequests = () => {
  const api = useApi();

  /**
   * List current user's transactions with filters
   * @param {{
   *   type?, direction?, status?, currency?,
   *   from?, to?, search?, minAmount?, maxAmount?,
   *   page?, limit?, sort?
   * }} params
   */
  const getMyTransactions = (params = {}) =>
    api.get(TRANSACTION_ENDPOINTS.MY, { requiresAuth: true, query: params });

  const getTransactionById = (id) =>
    api.get(TRANSACTION_ENDPOINTS.BY_ID(id), { requiresAuth: true });

  const getTransactionStats = () =>
    api.get(TRANSACTION_ENDPOINTS.STATS, { requiresAuth: true });

  const getMonthlySummary = (months = 6) =>
    api.get(TRANSACTION_ENDPOINTS.MONTHLY_SUMMARY, {
      requiresAuth: true,
      query: { months },
    });

  const getRecentActivity = (limit = 5) =>
    api.get(TRANSACTION_ENDPOINTS.RECENT, {
      requiresAuth: true,
      query: { limit },
    });

  return {
    getMyTransactions,
    getTransactionById,
    getTransactionStats,
    getMonthlySummary,
    getRecentActivity,
  };
};