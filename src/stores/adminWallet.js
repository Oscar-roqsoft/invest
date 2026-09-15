// stores/adminWallet.js
import { defineStore } from 'pinia';

export const useAdminWalletStore = defineStore('adminWallet', () => {
  const getRequests = () => useAdminWalletRequests();
  const self = () => useAdminWalletStore();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    wallets: [],
    walletsLoaded: false,

    editing: null,

    filters: { currency: 'all', isActive: 'all' },

    isLoading: false,
    isSubmitting: false,
    isSeeding: false,
    error: null,
  });

  // ─────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────
  const hasWallets = computed(() => state.wallets.length > 0);
  const activeWallets = computed(() => state.wallets.filter((w) => w.isActive));
  const inactiveWallets = computed(() => state.wallets.filter((w) => !w.isActive));

  const totalWallets = computed(() => state.wallets.length);

  /** Wallets whose address is still the seed placeholder */
  const needsAddress = computed(() =>
    state.wallets.filter((w) => w.address === 'REPLACE_WITH_REAL_ADDRESS')
  );

  /** Active + valid address → these are what users can actually deposit to */
  const usableWallets = computed(() =>
    state.wallets.filter(
      (w) => w.isActive && w.address !== 'REPLACE_WITH_REAL_ADDRESS'
    )
  );

  /** Group by currency */
  const walletsByCurrency = computed(() => {
    const map = {};
    for (const w of state.wallets) {
      if (!map[w.currency]) map[w.currency] = [];
      map[w.currency].push(w);
    }
    return map;
  });

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  const findWalletById = (id) => state.wallets.find((w) => w._id === id) || null;

  const setEditing = (wallet) => { state.editing = wallet; };
  const clearEditing = () => { state.editing = null; };

  /**
   * Nuke the PUBLIC wallet store's addresses cache so users see fresh data.
   * Called after every successful write.
   */
  const invalidatePublicAddresses = () => {
    try {
      const publicWallet = useWalletStore();
      publicWallet.$invalidate?.('wallet:addresses');
      publicWallet.$invalidatePrefix?.('wallet:');
    } catch { /* store not initialized — safe */ }
  };

  // ─────────────────────────────────────────────────────────
  // LIST (no cache — admin always sees truth)
  // ─────────────────────────────────────────────────────────
  const fetchWallets = async () => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();

      const query = {
        currency: state.filters.currency !== 'all' ? state.filters.currency : undefined,
        isActive: state.filters.isActive !== 'all' ? state.filters.isActive : undefined,
      };

      const res = await requests.getAllWallets(query);

      if (res.success) {
        state.wallets = res.data?.wallets || [];
        state.walletsLoaded = true;
        return { success: true, wallets: state.wallets };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoading = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────────────────
  const createWallet = async (payload) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.createWallet(payload);

      if (res.success) {
        const wallet = res.data?.wallet;
        if (wallet) state.wallets.push(wallet);
        invalidatePublicAddresses();
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
  // UPDATE
  // ─────────────────────────────────────────────────────────
  const updateWallet = async (id, payload) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.updateWallet(id, payload);

      if (res.success) {
        const wallet = res.data?.wallet;
        if (wallet) {
          const idx = state.wallets.findIndex((w) => w._id === id);
          if (idx !== -1) state.wallets[idx] = wallet;
        }
        invalidatePublicAddresses();
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
  // TOGGLE
  // ─────────────────────────────────────────────────────────
  const toggleWallet = async (id) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.toggleWallet(id);

      if (res.success) {
        const wallet = res.data?.wallet;
        if (wallet) {
          const idx = state.wallets.findIndex((w) => w._id === id);
          if (idx !== -1) state.wallets[idx] = wallet;
        }
        invalidatePublicAddresses();
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
        invalidatePublicAddresses();
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
  // SEED
  // ─────────────────────────────────────────────────────────
  const seedDefaults = async () => {
    state.isSeeding = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.seedDefaults();

      if (res.success) {
        await fetchWallets();
        invalidatePublicAddresses();
        return { success: true, created: res.data?.wallets?.length || 0, message: res.message };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isSeeding = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // FILTERS
  // ─────────────────────────────────────────────────────────
  const setFilters = (partial) => {
    state.filters = { ...state.filters, ...partial };
  };
  const resetFilters = () => {
    state.filters = { currency: 'all', isActive: 'all' };
  };

  // ─────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────
  const clearAll = () => {
    state.wallets = [];
    state.walletsLoaded = false;
    state.editing = null;
    state.filters = { currency: 'all', isActive: 'all' };
    state.error = null;
  };

  return {
    // state
    state,
    // getters
    hasWallets,
    activeWallets,
    inactiveWallets,
    totalWallets,
    needsAddress,
    usableWallets,
    walletsByCurrency,
    // helpers
    setError,
    clearError,
    findWalletById,
    setEditing,
    clearEditing,
    setFilters,
    resetFilters,
    invalidatePublicAddresses,
    // actions
    fetchWallets,
    createWallet,
    updateWallet,
    toggleWallet,
    deleteWallet,
    seedDefaults,
    clearAll,
  };
});