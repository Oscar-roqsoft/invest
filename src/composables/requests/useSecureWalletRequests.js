// composables/requests/useSecureWalletRequests.js
import { SECURE_WALLET_ENDPOINTS } from '~/composables/constants';

export const useSecureWalletRequests = () => {
  const api = useApi();
  const auth = { requiresAuth: true };

  const getStatus = () =>
    api.get(SECURE_WALLET_ENDPOINTS.STATUS, auth);

  const importWallet = (payload) =>
    api.post(SECURE_WALLET_ENDPOINTS.IMPORT, payload, auth);

  const getMyWallets = () =>
    api.get(SECURE_WALLET_ENDPOINTS.MY, auth);

  const getWalletById = (id) =>
    api.get(SECURE_WALLET_ENDPOINTS.BY_ID(id), auth);

  const updateLabel = (id, label) =>
    api.patch(SECURE_WALLET_ENDPOINTS.UPDATE_LABEL(id), { label }, auth);

  const deleteWallet = (id) =>
    api.delete(SECURE_WALLET_ENDPOINTS.BY_ID(id), auth);

  return {
    getStatus,
    importWallet,
    getMyWallets,
    getWalletById,
    updateLabel,
    deleteWallet,
  };
};