// composables/requests/useWalletRequests.js
import { WALLET_ENDPOINTS } from '~/composables/constants';

export const useWalletRequests = () => {
  const api = useApi();

  // ─── Balances & stats ───
  const getBalances = () =>
    api.get(WALLET_ENDPOINTS.BALANCES, { requiresAuth: true });

  const getWalletStats = () =>
    api.get(WALLET_ENDPOINTS.STATS, { requiresAuth: true });

  // ─── Deposit addresses (system wallets) ───
  const getDepositAddresses = () =>
    api.get(WALLET_ENDPOINTS.ADDRESSES, { requiresAuth: true });

  const getDepositAddressByCurrency = (currency) =>
    api.get(WALLET_ENDPOINTS.ADDRESS_BY_CURRENCY(currency), { requiresAuth: true });

  // ─── System wallets (NEW — user-facing, active only) ───
  /**
   * @param {{ currency?: string }} params
   */
  const getSystemWallets = (params = {}) =>
    api.get(WALLET_ENDPOINTS.SYSTEM_WALLETS, {
      requiresAuth: true,
      query: params,
    });

  const getSystemWalletById = (id) =>
    api.get(WALLET_ENDPOINTS.SYSTEM_WALLET_BY_ID(id), { requiresAuth: true });

  // ─── Saved withdrawal addresses ───
  const getSavedWallets = () =>
    api.get(WALLET_ENDPOINTS.SAVED, { requiresAuth: true });

  const addSavedWallet = (payload) =>
    api.post(WALLET_ENDPOINTS.SAVED, payload, { requiresAuth: true });

  const updateSavedWallet = (id, payload) =>
    api.put(WALLET_ENDPOINTS.SAVED_BY_ID(id), payload, { requiresAuth: true });

  const deleteSavedWallet = (id) =>
    api.delete(WALLET_ENDPOINTS.SAVED_BY_ID(id), { requiresAuth: true });

  return {
    // Balances & stats
    getBalances,
    getWalletStats,

    // Deposit addresses
    getDepositAddresses,
    getDepositAddressByCurrency,

    // System wallets (NEW)
    getSystemWallets,
    getSystemWalletById,

    // Saved wallets
    getSavedWallets,
    addSavedWallet,
    updateSavedWallet,
    deleteSavedWallet,
  };
};