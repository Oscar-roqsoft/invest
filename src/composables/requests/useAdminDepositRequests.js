// composables/requests/useAdminDepositRequests.js
import { ADMIN_DEPOSIT_ENDPOINTS } from '~/composables/constants';

export const useAdminDepositRequests = () => {
  const api = useApi();
  const authOpts = { requiresAuth: true };

  const getAllDeposits = (params = {}) =>
    api.get(ADMIN_DEPOSIT_ENDPOINTS.LIST, { ...authOpts, query: params });

  const getDepositById = (id) =>
    api.get(ADMIN_DEPOSIT_ENDPOINTS.BY_ID(id), authOpts);

  const approveDeposit = (id, payload = {}) =>
    api.post(ADMIN_DEPOSIT_ENDPOINTS.APPROVE(id), payload, authOpts);

  const rejectDeposit = (id, payload = {}) =>
    api.post(ADMIN_DEPOSIT_ENDPOINTS.REJECT(id), payload, authOpts);

  const getDepositStats = () =>
    api.get(ADMIN_DEPOSIT_ENDPOINTS.STATS, authOpts);

  return {
    getAllDeposits,
    getDepositById,
    approveDeposit,
    rejectDeposit,
    getDepositStats,
  };
};