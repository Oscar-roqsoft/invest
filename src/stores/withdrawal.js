// stores/withdrawal.js
import { defineStore } from 'pinia';
import { WITHDRAWAL_RULES } from '~/composables/constants';

export const useWithdrawalStore = defineStore('withdrawal', () => {
  const getRequests = () => useWithdrawalRequests();
  const self = () => useWithdrawalStore();

  const state = reactive({
    // Fee preview
    preview: null,
    isPreviewing: false,

    // Active / detail
    current: null,

    // List
    withdrawals: [],
    pagination: { total: 0, page: 1, limit: 20, pages: 0 },
    filters: { status: 'all', currency: 'all' },

    // PIN (transient)
    pinAttempts: 0,
    isPinLocked: false,

    // UI
    isLoading: false,
    isSubmitting: false,
    error: null,
    _pollTimer: null,
  });

  // ───── GETTERS ─────
  const hasWithdrawals = computed(() => state.withdrawals.length > 0);
  const isPending = computed(() => state.current?.status === 'pending');
  const isTerminal = computed(() =>
    ['completed', 'rejected', 'cancelled'].includes(state.current?.status)
  );
  const canCancel = computed(() => state.current?.status === 'pending');

  // ───── HELPERS ─────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  // ───── FEE PREVIEW (never cached) ─────
  const previewFee = async ({ currency, amountUSD }) => {
    state.isPreviewing = true;
    clearError();
    try {
      const requests = getRequests();
      const res = await requests.calculateFee({ currency, amountUSD });
      if (res.success) {
        state.preview = res.data;
        return { success: true, preview: res.data };
      }
      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isPreviewing = false;
    }
  };

  const clearPreview = () => { state.preview = null; };

  // ───── CREATE (with PIN guard) ─────
  const createWithdrawal = async ({ currency, network, amountUSD, address, saveAddress, pin }) => {
    // 🔒 PIN gate (client-side check; see note)
    if (!pin || String(pin).length < WITHDRAWAL_RULES.PIN_LENGTH) {
      return { success: false, message: 'PIN is required' };
    }
    if (state.isPinLocked) {
      return { success: false, message: 'PIN temporarily locked. Try again later.' };
    }

    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.createWithdrawal({
        currency,
        network,
        amountUSD: Number(amountUSD),
        address,
        saveAddress,
        pin, // pass along — backend can enforce later
      });

      if (res.success) {
        state.current = res.data?.withdrawal || null;
        if (state.current) state.withdrawals.unshift(state.current);
        state.pinAttempts = 0;

        // 🧹 invalidate stale caches
        self().$invalidatePrefix('withdrawal:list:');
        try { useTransactionStore().invalidateAll?.(); } catch {}
        try { useWalletStore().invalidateAll?.(); } catch {}

        return {
          success: true,
          withdrawal: state.current,
          estimatedProcessingTime: res.data?.estimatedProcessingTime,
          message: res.message,
        };
      }

      // If backend ever returns 401/invalid pin — count attempts
      if (/pin/i.test(res.message || '')) {
        state.pinAttempts += 1;
        if (state.pinAttempts >= WITHDRAWAL_RULES.PIN_MAX_ATTEMPTS) {
          state.isPinLocked = true;
        }
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

  // ───── FETCH ONE (cached 10s) ─────
  const fetchWithdrawal = async (id, opts = {}) => {
    state.isLoading = true;
    clearError();
    try {
      const requests = getRequests();
      const res = await self().$cached(
        `withdrawal:one:${id}`,
        () => requests.getWithdrawalById(id),
        {
          ttl: 10_000,
          force: opts.force,
          onSuccess: (data) => { state.current = data?.withdrawal || null; },
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

  // ───── LIST (cached 30s per filter) ─────
  const fetchMyWithdrawals = async (params = {}, opts = {}) => {
    state.isLoading = true;
    clearError();
    try {
      const requests = getRequests();
      const query = {
        page: params.page ?? state.pagination.page,
        limit: params.limit ?? state.pagination.limit,
        status: (params.status ?? state.filters.status) !== 'all'
          ? params.status ?? state.filters.status : undefined,
        currency: (params.currency ?? state.filters.currency) !== 'all'
          ? params.currency ?? state.filters.currency : undefined,
      };
      const cacheKey = `withdrawal:list:${JSON.stringify(query)}`;

      const res = await self().$cached(
        cacheKey,
        () => requests.getMyWithdrawals(query),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.withdrawals = data?.withdrawals || [];
            if (data?.pagination) state.pagination = data.pagination;
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

  // ───── CANCEL ─────
  const cancelWithdrawal = async (id) => {
    state.isSubmitting = true;
    clearError();
    try {
      const requests = getRequests();
      const res = await requests.cancelWithdrawal(id);
      if (res.success) {
        state.current = res.data?.withdrawal || state.current;
        const idx = state.withdrawals.findIndex((w) => w._id === id);
        if (idx !== -1 && res.data?.withdrawal) state.withdrawals[idx] = res.data.withdrawal;

        self().$invalidatePrefix('withdrawal:list:');
        self().$invalidate(`withdrawal:one:${id}`);
        try { useTransactionStore().invalidateAll?.(); } catch {}

        stopPolling();
        return { success: true, withdrawal: state.current, message: res.message };
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

  // ───── FILTERS / PAGE ─────
  const setFilters = (partial) => {
    state.filters = { ...state.filters, ...partial };
    state.pagination.page = 1;
  };
  const resetFilters = () => {
    state.filters = { status: 'all', currency: 'all' };
    state.pagination.page = 1;
  };
  const setPage = (page) => { state.pagination.page = page; };

  // ───── POLLING ─────
  const startPolling = (id, intervalMs = WITHDRAWAL_RULES.POLL_INTERVAL_MS) => {
    stopPolling();
    if (!import.meta.client) return;
    state._pollTimer = setInterval(async () => {
      if (isTerminal.value) { stopPolling(); return; }
      await fetchWithdrawal(id, { force: true });
      if (isTerminal.value) stopPolling();
    }, intervalMs);
  };
  const stopPolling = () => {
    if (state._pollTimer) { clearInterval(state._pollTimer); state._pollTimer = null; }
  };

  // ───── CLEANUP ─────
  const resetPinAttempts = () => {
    state.pinAttempts = 0;
    state.isPinLocked = false;
  };
  const clearPreviewState = () => { state.preview = null; };
  const clearCurrent = () => { stopPolling(); state.current = null; };

  const clearAll = () => {
    stopPolling();
    state.preview = null;
    state.current = null;
    state.withdrawals = [];
    state.pagination = { total: 0, page: 1, limit: 20, pages: 0 };
    state.filters = { status: 'all', currency: 'all' };
    state.error = null;
    resetPinAttempts();
    self().$invalidatePrefix('withdrawal:');
  };

  return {
    state,
    hasWithdrawals,
    isPending,
    isTerminal,
    canCancel,
    setError,
    clearError,
    setFilters,
    resetFilters,
    setPage,
    previewFee,
    clearPreview,
    createWithdrawal,
    fetchWithdrawal,
    fetchMyWithdrawals,
    cancelWithdrawal,
    startPolling,
    stopPolling,
    resetPinAttempts,
    clearPreviewState,
    clearCurrent,
    clearAll,
  };
});