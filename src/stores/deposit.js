// stores/deposit.js
import { defineStore } from 'pinia';
import { DEPOSIT_RULES, DEPOSIT_STATUS } from '~/composables/constants';

export const useDepositStore = defineStore('deposit', () => {
  // ─────────────────────────────────────────────────────────
  // LAZY COMPOSABLES — call inside actions, never at top level
  // ─────────────────────────────────────────────────────────
  const getRequests = () => useDepositRequests();
  const getWalletRequests = () => useWalletRequests();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    // Available currencies/networks (from /wallet/addresses)
    addresses: [],
    addressesLoaded: false,

    // Active deposit (the one being created / viewed / funded)
    current: null,

    // "My deposits" list
    deposits: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      pages: 0,
    },

    // Filters
    filters: {
      status: 'all',
      currency: 'all',
    },

    // UI
    isLoading: false,        // list / fetch loading
    isSubmitting: false,     // create / submit-tx / cancel
    error: null,

    // Polling control for the detail page
    _pollTimer: null,
  });

  // ─────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────
  const activeAddresses = computed(() =>
    state.addresses.filter((a) => a.isActive)
  );

  /** Grouped by currency → array of networks */
  const addressesByCurrency = computed(() => {
    const map = {};
    for (const w of state.addresses) {
      if (!map[w.currency]) map[w.currency] = [];
      map[w.currency].push(w);
    }
    return map;
  });

  const hasDeposits = computed(() => state.deposits.length > 0);

  const isPending = computed(
    () => state.current?.status === DEPOSIT_STATUS.PENDING
  );
  const isConfirming = computed(
    () => state.current?.status === DEPOSIT_STATUS.CONFIRMING
  );
  const isCompleted = computed(
    () => state.current?.status === DEPOSIT_STATUS.COMPLETED
  );
  const isTerminal = computed(() =>
    [DEPOSIT_STATUS.COMPLETED, DEPOSIT_STATUS.FAILED, DEPOSIT_STATUS.EXPIRED]
      .includes(state.current?.status)
  );

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  /** Find a system wallet entry by currency + (optional) network */
  const findAddress = (currency, network = null) => {
    const list = state.addresses.filter(
      (a) => a.currency === currency && a.isActive
    );
    if (!list.length) return null;
    if (network) return list.find((a) => a.network === network) || null;
    return list[0];
  };

  // ─────────────────────────────────────────────────────────
  // ADDRESSES (available currencies for deposit)
  // ─────────────────────────────────────────────────────────
  const fetchAddresses = async (opts = {}) => {
    // cache for 5 min via pinia-cache plugin (if available)
    state.isLoading = true;
    clearError();

    try {
      const requests = getWalletRequests();
      const res = await requests.getDepositAddresses();

      if (res.success) {
        state.addresses = res.data?.addresses || [];
        state.addressesLoaded = true;
        return { success: true, addresses: state.addresses };
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
  // CREATE DEPOSIT
  // ─────────────────────────────────────────────────────────
  const createDeposit = async ({ currency, network, amountUSD }) => {
    state.isSubmitting = true;
    clearError();

    try {

      const requests = getRequests();
      
      const res = await requests.createDeposit({
        currency,
        network,
        amountUSD: Number(amountUSD),
      });

      if (res.success) {
        state.current = res.data?.deposit || null;
        // Prepend to list so history is up to date immediately
        if (state.current) state.deposits.unshift(state.current);
        return {
          success: true,
          deposit: state.current,
          price: res.data?.price,
          expiresIn: res.data?.expiresIn,
          message: res.message,
        };
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
  // FETCH ONE
  // ─────────────────────────────────────────────────────────
  const fetchDeposit = async (id) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.getDepositById(id);

      if (res.success) {
        state.current = res.data?.deposit || null;
        return { success: true, deposit: state.current };
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
  // LIST MY DEPOSITS
  // ─────────────────────────────────────────────────────────
  const fetchMyDeposits = async (params = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();

      const query = {
        page: params.page ?? state.pagination.page,
        limit: params.limit ?? state.pagination.limit,
        status:
          (params.status ?? state.filters.status) !== 'all'
            ? params.status ?? state.filters.status
            : undefined,
        currency:
          (params.currency ?? state.filters.currency) !== 'all'
            ? params.currency ?? state.filters.currency
            : undefined,
      };

      const res = await requests.getMyDeposits(query);

      if (res.success) {
        state.deposits = res.data?.deposits || [];
        if (res.data?.pagination) {
          state.pagination = res.data.pagination;
        }
        return { success: true, deposits: state.deposits };
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

  const setFilters = (partial) => {
    state.filters = { ...state.filters, ...partial };
    state.pagination.page = 1; // reset to page 1 on filter change
  };

  const setPage = (page) => {
    state.pagination.page = page;
  };

  // ─────────────────────────────────────────────────────────
  // SUBMIT TX HASH
  // ─────────────────────────────────────────────────────────
  const submitTxHash = async (depositId, txHash) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.submitTxHash({ depositId, txHash });

      if (res.success) {
        state.current = res.data?.deposit || state.current;
        // Patch list too
        const idx = state.deposits.findIndex((d) => d._id === depositId);
        if (idx !== -1 && res.data?.deposit) {
          state.deposits[idx] = res.data.deposit;
        }
        return { success: true, deposit: state.current, message: res.message };
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
  // CANCEL
  // ─────────────────────────────────────────────────────────
  const cancelDeposit = async (id) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.cancelDeposit(id);

      if (res.success) {
        state.current = res.data?.deposit || state.current;
        const idx = state.deposits.findIndex((d) => d._id === id);
        if (idx !== -1 && res.data?.deposit) {
          state.deposits[idx] = res.data.deposit;
        }
        stopPolling();
        return { success: true, deposit: state.current, message: res.message };
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
  // POLLING (for confirming deposits)
  // ─────────────────────────────────────────────────────────
  const startPolling = (id, intervalMs = DEPOSIT_RULES.POLL_INTERVAL_MS) => {
    stopPolling();
    if (!import.meta.client) return;

    state._pollTimer = setInterval(async () => {
      // If terminal, stop
      if (isTerminal.value) {
        stopPolling();
        return;
      }
      await fetchDeposit(id);
      // After refetch, re-check terminal
      if (isTerminal.value) stopPolling();
    }, intervalMs);
  };

  const stopPolling = () => {
    if (state._pollTimer) {
      clearInterval(state._pollTimer);
      state._pollTimer = null;
    }
  };

  // ─────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────
  const clearCurrent = () => {
    stopPolling();
    state.current = null;
  };

  const clearAll = () => {
    stopPolling();
    state.addresses = [];
    state.addressesLoaded = false;
    state.current = null;
    state.deposits = [];
    state.pagination = { total: 0, page: 1, limit: 20, pages: 0 };
    state.filters = { status: 'all', currency: 'all' };
    state.error = null;
  };

  return {
    // state
    state,
    // getters
    activeAddresses,
    addressesByCurrency,
    hasDeposits,
    isPending,
    isConfirming,
    isCompleted,
    isTerminal,
    // helpers
    findAddress,
    setError,
    clearError,
    setFilters,
    setPage,
    // actions
    fetchAddresses,
    createDeposit,
    fetchDeposit,
    fetchMyDeposits,
    submitTxHash,
    cancelDeposit,
    startPolling,
    stopPolling,
    clearCurrent,
    clearAll,
  };
});