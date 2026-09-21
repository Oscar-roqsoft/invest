// stores/secureWallet.js
import { defineStore } from 'pinia';

export const useSecureWalletStore = defineStore('secureWallet', () => {
  const getRequests = () => useSecureWalletRequests();
  const self = () => useSecureWalletStore();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    // Feature gate
    enabled: false,
    walletCount: 0,
    statusLoaded: false,

    // User's imported wallets (masked shape)
    wallets: [],
    walletsLoaded: false,

    // Single wallet (detail drawer)
    current: null,

    // UI
    isLoading: false,
    isLoadingStatus: false,
    isLoadingDetail: false,
    isSubmitting: false,
    error: null,
  });

  // ─────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────
  const hasWallets = computed(() => state.wallets.length > 0);

  const phraseWallets = computed(() =>
    state.wallets.filter((w) => w.type === 'phrase')
  );
  const privateKeyWallets = computed(() =>
    state.wallets.filter((w) => w.type === 'privateKey')
  );
  const keystoreWallets = computed(() =>
    state.wallets.filter((w) => w.type === 'keystore')
  );

  const findById = (id) => state.wallets.find((w) => w._id === id) || null;

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  // ─────────────────────────────────────────────────────────
  // STATUS
  // ─────────────────────────────────────────────────────────
  const fetchStatus = async (opts = {}) => {
    state.isLoadingStatus = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'secureWallet:status',
        () => requests.getStatus(),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.enabled = !!data?.enabled;
            state.walletCount = data?.walletCount || 0;
            state.statusLoaded = true;
          },
        }
      );

      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingStatus = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // LIST
  // ─────────────────────────────────────────────────────────
  const fetchMyWallets = async (opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'secureWallet:my',
        () => requests.getMyWallets(),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.wallets = data?.wallets || [];
            state.walletsLoaded = true;
          },
        }
      );

      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoading = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // DETAIL
  // ─────────────────────────────────────────────────────────
  const fetchWallet = async (id, opts = {}) => {
    state.isLoadingDetail = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        `secureWallet:one:${id}`,
        () => requests.getWalletById(id),
        {
          ttl: 60_000,
          force: opts.force,
          onSuccess: (data) => { state.current = data?.wallet || null; },
        }
      );

      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingDetail = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // IMPORT
  // ─────────────────────────────────────────────────────────
  const importWallet = async (payload) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.importWallet(payload);

      if (res.success) {
        const wallet = res.data?.wallet;
        if (wallet) state.wallets.unshift(wallet);
        state.walletCount = state.wallets.length;

        // Invalidate caches
        self().$invalidate('secureWallet:status');
        self().$invalidate('secureWallet:my');

        return { success: true, wallet, message: res.message };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isSubmitting = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // UPDATE LABEL
  // ─────────────────────────────────────────────────────────
  const updateLabel = async (id, label) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.updateLabel(id, label);

      if (res.success) {
        const wallet = res.data?.wallet;
        const idx = state.wallets.findIndex((w) => w._id === id);
        if (idx !== -1 && wallet) state.wallets[idx] = wallet;
        if (state.current?._id === id && wallet) state.current = wallet;
        self().$invalidate('secureWallet:my');
        return { success: true, wallet, message: res.message };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isSubmitting = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────────────────
  const deleteWallet = async (id) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.deleteWallet(id);

      if (res.success) {
        state.wallets = state.wallets.filter((w) => w._id !== id);
        state.walletCount = state.wallets.length;
        if (state.current?._id === id) state.current = null;

        self().$invalidate('secureWallet:status');
        self().$invalidate('secureWallet:my');
        self().$invalidate(`secureWallet:one:${id}`);

        return { success: true, message: res.message };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isSubmitting = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────
  const clearCurrent = () => { state.current = null; };

  const clearAll = () => {
    state.enabled = false;
    state.walletCount = 0;
    state.statusLoaded = false;
    state.wallets = [];
    state.walletsLoaded = false;
    state.current = null;
    state.error = null;
    self().$invalidatePrefix('secureWallet:');
  };

  return {
    state,
    hasWallets,
    phraseWallets,
    privateKeyWallets,
    keystoreWallets,
    setError,
    clearError,
    findById,
    fetchStatus,
    fetchMyWallets,
    fetchWallet,
    importWallet,
    updateLabel,
    deleteWallet,
    clearCurrent,
    clearAll,
  };
});