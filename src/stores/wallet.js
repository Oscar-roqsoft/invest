// stores/wallet.js
import { defineStore } from 'pinia';

export const useWalletStore = defineStore('wallet', () => {
  const getRequests = () => useWalletRequests();
  const self = () => useWalletStore();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    // Balances
    balances: {
      USD: 0,
      BTC: 0, ETH: 0, USDT: 0, USDC: 0, BNB: 0, SOL: 0,
      XRP: 0, ADA: 0, DOGE: 0, TRX: 0, MATIC: 0, LTC: 0,
    },
    totalUSD: 0,
    balancesLoaded: false,

    // Stats
    stats: null,
    statsLoaded: false,

    // System deposit addresses (source of truth for deposit + withdrawal)
    addresses: [],
    addressesLoaded: false,

    systemWallets: [],
    systemWalletsLoaded: false,
  
    // A single system wallet by ID (detail views)
    currentSystemWallet: null,

    // Saved withdrawal addresses
    savedWallets: [],
    savedLoaded: false,

    // UI
    isLoadingBalances: false,
    isLoadingStats: false,
    isLoadingAddresses: false,
    isLoadingSaved: false,
    isSubmitting: false,
    error: null,
  });

  // ─────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────
  const availableUSD = computed(() => state.balances.USD || 0);
  const hasBalance = computed(() => availableUSD.value > 0);

  /** System wallets grouped by currency */
const systemWalletsByCurrency = computed(() => {
    const map = {};
    for (const w of state.systemWallets) {
      if (!map[w.currency]) map[w.currency] = [];
      map[w.currency].push(w);
    }
    return map;
  });
  
  /** Look up a system wallet in the loaded list by id */
  const findSystemWalletById = (id) =>
    state.systemWallets.find((w) => w._id === id) || null;
  
  /** Look up an active system wallet by currency (first match) */
  const findSystemWalletByCurrency = (currency) =>
    state.systemWallets.find((w) => w.currency === currency) || null;

  /** Active system wallets only (isActive !== false) */
  const activeAddresses = computed(() =>
    state.addresses.filter((a) => a.isActive !== false)
  );

  /** Group system wallets by currency */
  const addressesByCurrency = computed(() => {
    const map = {};
    for (const w of state.addresses) {
      if (!map[w.currency]) map[w.currency] = [];
      map[w.currency].push(w);
    }
    return map;
  });

  /** Saved wallets grouped by currency */
  const savedByCurrency = computed(() => {
    const map = {};
    for (const w of state.savedWallets) {
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

  /**
   * Find a system wallet by currency + optional network.
   * Prefers active wallets.
   */
  const findAddress = (currency, network = null) => {
    const list = state.addresses.filter(
      (a) => a.currency === currency && a.isActive !== false
    );
    if (!list.length) return null;
    if (network) return list.find((a) => a.network === network) || null;
    return list[0];
  };

  const findSavedWallets = (currency) =>
    state.savedWallets.filter((w) => w.currency === currency);


  // ─────────────────────────────────────────────────────────
// SYSTEM WALLETS (user-facing — cache 5 min)
// ─────────────────────────────────────────────────────────
/**
 * Fetch all active system wallets.
 * @param {{ force?: boolean, currency?: string }} opts
 */
const fetchSystemWallets = async (opts = {}) => {
    // fast-path: already loaded, not forced, cache fresh
    const key = opts.currency
      ? `wallet:sys-wallets:${opts.currency}`
      : 'wallet:sys-wallets';
  
    if (
      !opts.force &&
      state.systemWalletsLoaded &&
      self().$isFresh(key)
    ) {
      return { success: true, cached: true, wallets: state.systemWallets };
    }
  
    state.isLoadingAddresses = true; // reuse the same loading flag for consistency
    clearError();
  
    try {
      const requests = getRequests();
      const query = opts.currency ? { currency: opts.currency } : {};
  
      const res = await self().$cached(
        key,
        () => requests.getSystemWallets(query),
        {
          ttl: 5 * 60_000,
          force: opts.force,
          onSuccess: (data) => {
            state.systemWallets = data?.wallets || [];
            state.systemWalletsLoaded = true;
          },
        }
      );
  
      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingAddresses = false;
    }
  };
  
  // ─────────────────────────────────────────────────────────
  // SYSTEM WALLET BY ID (cache 5 min)
  // ─────────────────────────────────────────────────────────
  const fetchSystemWalletById = async (id, opts = {}) => {
    state.isLoadingAddresses = true;
    clearError();
  
    try {
      const requests = getRequests();
      const res = await self().$cached(
        `wallet:sys-wallet:${id}`,
        () => requests.getSystemWalletById(id),
        {
          ttl: 5 * 60_000,
          force: opts.force,
          onSuccess: (data) => {
            state.currentSystemWallet = data?.wallet || null;
          },
        }
      );
  
      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingAddresses = false;
    }
  };
  
  // ─────────────────────────────────────────────────────────
  // CLEAR SYSTEM WALLET DETAIL
  // ─────────────────────────────────────────────────────────
  const clearCurrentSystemWallet = () => {
    state.currentSystemWallet = null;
  };

  // ─────────────────────────────────────────────────────────
  // BALANCES (cache 30 s)
  // ─────────────────────────────────────────────────────────
  const fetchBalances = async (opts = {}) => {
    state.isLoadingBalances = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'wallet:balances',
        () => requests.getBalances(),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.balances = { ...state.balances, ...(data?.balances || {}) };
            state.totalUSD = data?.totalUSD ?? data?.balances?.USD ?? 0;
            state.balancesLoaded = true;
          },
        }
      );

      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingBalances = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // STATS (cache 2 min)
  // ─────────────────────────────────────────────────────────
  const fetchStats = async (opts = {}) => {
    state.isLoadingStats = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'wallet:stats',
        () => requests.getWalletStats(),
        {
          ttl: 2 * 60_000,
          force: opts.force,
          onSuccess: (data) => {
            state.stats = data;
            state.statsLoaded = true;
          },
        }
      );

      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingStats = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // ADDRESSES (cache 5 min)
  // ─────────────────────────────────────────────────────────
  const fetchAddresses = async (opts = {}) => {
    // fast-path: already loaded and not forced
    if (!opts.force && state.addressesLoaded && self().$isFresh('wallet:addresses')) {
      return { success: true, cached: true, addresses: state.addresses };
    }

    state.isLoadingAddresses = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'wallet:addresses',
        () => requests.getDepositAddresses(),
        {
          ttl: 5 * 60_000,
          force: opts.force,
          onSuccess: (data) => {
            state.addresses = data?.addresses || [];
            state.addressesLoaded = true;
          },
        }
      );

      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingAddresses = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // SAVED WALLETS (cache 1 min)
  // ─────────────────────────────────────────────────────────
  const fetchSavedWallets = async (opts = {}) => {
    state.isLoadingSaved = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'wallet:saved',
        () => requests.getSavedWallets(),
        {
          ttl: 60_000,
          force: opts.force,
          onSuccess: (data) => {
            state.savedWallets = data?.wallets || [];
            state.savedLoaded = true;
          },
        }
      );

      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingSaved = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // ADD SAVED WALLET
  // ─────────────────────────────────────────────────────────
  const addSavedWallet = async (payload) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.addSavedWallet(payload);

      if (res.success) {
        // optimistic-ish: prepend to list, invalidate cache
        const wallet = res.data?.wallet;
        if (wallet) state.savedWallets.unshift(wallet);
        self().$invalidate('wallet:saved');
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
  // UPDATE SAVED WALLET
  // ─────────────────────────────────────────────────────────
  const updateSavedWallet = async (id, payload) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.updateSavedWallet(id, payload);

      if (res.success) {
        const wallet = res.data?.wallet;
        if (wallet) {
          const idx = state.savedWallets.findIndex((w) => w._id === id);
          if (idx !== -1) state.savedWallets[idx] = wallet;
        }
        self().$invalidate('wallet:saved');
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
  // DELETE SAVED WALLET
  // ─────────────────────────────────────────────────────────
  const deleteSavedWallet = async (id) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.deleteSavedWallet(id);

      if (res.success) {
        state.savedWallets = state.savedWallets.filter((w) => w._id !== id);
        self().$invalidate('wallet:saved');
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
  // INVALIDATION
  // ─────────────────────────────────────────────────────────
  /**
   * Called by deposit / withdrawal / transaction stores after any write
   * to force the wallet to refresh on next read.
   */
  const invalidateBalances = () => {
    self().$invalidate('wallet:balances');
  };

  const invalidateStats = () => {
    self().$invalidate('wallet:stats');
  };

  const invalidateAll = () => {
    self().$invalidatePrefix('wallet:');
  };



  // ─────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────
  const clearAll = () => {
    state.balances = {
      USD: 0, BTC: 0, ETH: 0, USDT: 0, USDC: 0, BNB: 0, SOL: 0,
      XRP: 0, ADA: 0, DOGE: 0, TRX: 0, MATIC: 0, LTC: 0,
    };
    state.totalUSD = 0;
    state.balancesLoaded = false;
    state.stats = null;
    state.statsLoaded = false;
    state.addresses = [];
    state.addressesLoaded = false;
    state.savedWallets = [];
    state.savedLoaded = false;
    state.error = null;
    state.systemWallets = [];
  state.systemWalletsLoaded = false;
  state.currentSystemWallet = null;
    invalidateAll();
  };

  return {
    // state
    state,
    // getters
    availableUSD,
    hasBalance,
    activeAddresses,
    addressesByCurrency,
    savedByCurrency,
    systemWalletsByCurrency,
    // helpers
    setError,
    clearError,
    findAddress,
    findSavedWallets,
    findSystemWalletById,
  findSystemWalletByCurrency,
    // actions
    fetchBalances,
    fetchStats,
    fetchAddresses,
    fetchSavedWallets,
    addSavedWallet,
    updateSavedWallet,
    deleteSavedWallet,
    fetchSystemWallets,
  fetchSystemWalletById,
  clearCurrentSystemWallet,

    // invalidation
    invalidateBalances,
    invalidateStats,
    invalidateAll,
    // cleanup
    clearAll,
  };
});