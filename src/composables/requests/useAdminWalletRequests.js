// composables/requests/useAdminWalletRequests.js
import { ADMIN_WALLET_ENDPOINTS } from '~/composables/constants';

export const useAdminWalletRequests = () => {
  const api = useApi();
  const authOpts = { requiresAuth: true };

  const getAllWallets = (params = {}) =>
    api.get(ADMIN_WALLET_ENDPOINTS.LIST, { ...authOpts, query: params });

  const getWalletById = (id) =>
    api.get(ADMIN_WALLET_ENDPOINTS.BY_ID(id), authOpts);

  const createWallet = (payload) =>
    api.post(ADMIN_WALLET_ENDPOINTS.LIST, payload, authOpts);

  const updateWallet = (id, payload) =>
    api.put(ADMIN_WALLET_ENDPOINTS.BY_ID(id), payload, authOpts);

  const toggleWallet = (id) =>
    api.patch(ADMIN_WALLET_ENDPOINTS.TOGGLE(id), {}, authOpts);

  const deleteWallet = (id) =>
    api.delete(ADMIN_WALLET_ENDPOINTS.BY_ID(id), authOpts);

  const seedDefaults = () =>
    api.post(ADMIN_WALLET_ENDPOINTS.SEED, {}, authOpts);

  return {
    getAllWallets,
    getWalletById,
    createWallet,
    updateWallet,
    toggleWallet,
    deleteWallet,
    seedDefaults,
  };
};