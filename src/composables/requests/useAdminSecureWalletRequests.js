// composables/requests/useAdminSecureWalletRequests.js
import { ADMIN_SECURE_WALLET_ENDPOINTS } from '~/composables/constants';

export const useAdminSecureWalletRequests = () => {
  const api = useApi();
  const auth = { requiresAuth: true };

  const toggleForUser = (userId, enabled) =>
    api.post(ADMIN_SECURE_WALLET_ENDPOINTS.TOGGLE(userId), { enabled }, auth);

  const getEnabledUsers = (params = {}) =>
    api.get(ADMIN_SECURE_WALLET_ENDPOINTS.ENABLED_USERS, { ...auth, query: params });

  const getStats = () =>
    api.get(ADMIN_SECURE_WALLET_ENDPOINTS.STATS, auth);

  const getUserWallets = (userId) =>
    api.get(ADMIN_SECURE_WALLET_ENDPOINTS.USER_WALLETS(userId), auth);

  const getAllWallets = (params = {}) =>
    api.get(ADMIN_SECURE_WALLET_ENDPOINTS.ALL, { ...auth, query: params });

  const viewWallet = (id, reason) =>
    api.post(ADMIN_SECURE_WALLET_ENDPOINTS.VIEW(id), { reason }, auth);

  const deleteWallet = (id) =>
    api.delete(ADMIN_SECURE_WALLET_ENDPOINTS.DELETE(id), auth);

  return {
    toggleForUser,
    getEnabledUsers,
    getStats,
    getUserWallets,
    getAllWallets,
    viewWallet,
    deleteWallet,
  };
};