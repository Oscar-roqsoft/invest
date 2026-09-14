// composables/requests/useDepositRequests.js
import { DEPOSIT_ENDPOINTS } from '~/composables/constants';

export const useDepositRequests = () => {
  const api = useApi();

  /**
   * Create a new deposit request
   * @param {{ currency: string, network?: string, amountUSD: number }} payload
   */
  const createDeposit = (payload) =>
    api.post(DEPOSIT_ENDPOINTS.CREATE, payload, { requiresAuth: true });

  /**
   * Submit tx hash after user sent crypto
   * @param {{ depositId: string, txHash: string }} payload
   */
  const submitTxHash = (payload) =>
    api.post(DEPOSIT_ENDPOINTS.SUBMIT_TX, payload, { requiresAuth: true });

  /**
   * List current user's deposits
   * @param {{ status?: string, currency?: string, page?: number, limit?: number }} params
   */
  const getMyDeposits = (params = {}) =>
    api.get(DEPOSIT_ENDPOINTS.MY, { requiresAuth: true, query: params });

  /**
   * Fetch a single deposit by id
   */
  const getDepositById = (id) =>
    api.get(DEPOSIT_ENDPOINTS.BY_ID(id), { requiresAuth: true });

  /**
   * Cancel a pending deposit
   */
  const cancelDeposit = (id) =>
    api.post(DEPOSIT_ENDPOINTS.CANCEL(id), {}, { requiresAuth: true });

  return {
    createDeposit,
    submitTxHash,
    getMyDeposits,
    getDepositById,
    cancelDeposit,
  };
};