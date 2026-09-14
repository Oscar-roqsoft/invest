// composables/requests/useWithdrawalRequests.js
import { WITHDRAWAL_ENDPOINTS } from '~/composables/constants';

export const useWithdrawalRequests = () => {
  const api = useApi();

  /**
   * Preview fees BEFORE creating the withdrawal.
   * @param {{ currency: string, amountUSD: number }} payload
   */
  const calculateFee = (payload) =>
    api.post(WITHDRAWAL_ENDPOINTS.CALCULATE_FEE, payload, { requiresAuth: true });

  /**
   * Create the withdrawal.
   * @param {{
   *   currency: string,
   *   network?: string,
   *   amountUSD: number,
   *   address: string,
   *   saveAddress?: boolean
   * }} payload
   */
  const createWithdrawal = (payload) =>
    api.post(WITHDRAWAL_ENDPOINTS.CREATE, payload, { requiresAuth: true });

  const getMyWithdrawals = (params = {}) =>
    api.get(WITHDRAWAL_ENDPOINTS.MY, { requiresAuth: true, query: params });

  const getWithdrawalById = (id) =>
    api.get(WITHDRAWAL_ENDPOINTS.BY_ID(id), { requiresAuth: true });

  const cancelWithdrawal = (id) =>
    api.post(WITHDRAWAL_ENDPOINTS.CANCEL(id), {}, { requiresAuth: true });

  return {
    calculateFee,
    createWithdrawal,
    getMyWithdrawals,
    getWithdrawalById,
    cancelWithdrawal,
  };
};