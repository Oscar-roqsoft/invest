// composables/requests/useWalletRequests.js
import { WALLET_ENDPOINTS } from '~/composables/constants';

export const useWalletRequests = () => {
  const api = useApi();

  const getBalances = () =>
    api.get(WALLET_ENDPOINTS.BALANCES, { requiresAuth: true });

  const getWalletStats = () =>
    api.get(WALLET_ENDPOINTS.STATS, { requiresAuth: true });

  /** Active system wallets (currencies available for deposit) */
  const getDepositAddresses = () =>
    api.get(WALLET_ENDPOINTS.ADDRESSES, { requiresAuth: true });

  const getDepositAddressByCurrency = (currency) =>
    api.get(WALLET_ENDPOINTS.ADDRESS_BY_CURRENCY(currency), { requiresAuth: true });

  const getSavedWallets = () =>
    api.get(WALLET_ENDPOINTS.SAVED, { requiresAuth: true });

  const addSavedWallet = (payload) =>
    api.post(WALLET_ENDPOINTS.SAVED, payload, { requiresAuth: true });

  const updateSavedWallet = (id, payload) =>
    api.put(WALLET_ENDPOINTS.SAVED_BY_ID(id), payload, { requiresAuth: true });

  const deleteSavedWallet = (id) =>
    api.delete(WALLET_ENDPOINTS.SAVED_BY_ID(id), { requiresAuth: true });

  return {
    getBalances,
    getWalletStats,
    getDepositAddresses,
    getDepositAddressByCurrency,
    getSavedWallets,
    addSavedWallet,
    updateSavedWallet,
    deleteSavedWallet,
  };
};