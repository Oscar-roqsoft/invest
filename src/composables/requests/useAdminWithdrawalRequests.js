// composables/requests/useAdminWithdrawalRequests.js
import { ADMIN_WITHDRAWAL_ENDPOINTS } from '~/composables/constants';

export const useAdminWithdrawalRequests = () => {
  const api = useApi();
  const authOpts = { requiresAuth: true };

  const getAllWithdrawals = (params = {}) =>
    api.get(ADMIN_WITHDRAWAL_ENDPOINTS.LIST, { ...authOpts, query: params });

  const getWithdrawalById = (id) =>
    api.get(ADMIN_WITHDRAWAL_ENDPOINTS.BY_ID(id), authOpts);

  const approveWithdrawal = (id, payload = {}) =>
    api.post(ADMIN_WITHDRAWAL_ENDPOINTS.APPROVE(id), payload, authOpts);

  const markProcessing = (id, payload = {}) =>
    api.post(ADMIN_WITHDRAWAL_ENDPOINTS.PROCESS(id), payload, authOpts);

  const completeWithdrawal = (id, payload = {}) =>
    api.post(ADMIN_WITHDRAWAL_ENDPOINTS.COMPLETE(id), payload, authOpts);

  const rejectWithdrawal = (id, payload = {}) =>
    api.post(ADMIN_WITHDRAWAL_ENDPOINTS.REJECT(id), payload, authOpts);

  const getWithdrawalStats = () =>
    api.get(ADMIN_WITHDRAWAL_ENDPOINTS.STATS, authOpts);

  return {
    getAllWithdrawals,
    getWithdrawalById,
    approveWithdrawal,
    markProcessing,
    completeWithdrawal,
    rejectWithdrawal,
    getWithdrawalStats,
  };
};