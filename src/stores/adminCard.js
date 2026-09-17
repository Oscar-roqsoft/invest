// stores/adminCard.js
import { defineStore } from 'pinia';

export const useAdminCardStore = defineStore('adminCard', () => {
  const getRequests = () => useAdminCardRequests();
  const self = () => useAdminCardStore();

  const state = reactive({
    cards: [],
    pagination: { total: 0, page: 1, limit: 20, pages: 0 },
    filters: { tier: 'all', status: 'all', search: '' },

    stats: null,
    statsLoaded: false,

    current: null,

    isLoading: false,
    isLoadingStats: false,
    isLoadingDetail: false,
    isSubmitting: false,
    error: null,
  });

  const hasCards = computed(() => state.cards.length > 0);
  const totalPages = computed(() => state.pagination.pages || 0);

  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  // ───── LIST (cache 30 s) ─────
  const fetchCards = async (overrides = {}, opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();

      const query = {
        page: overrides.page ?? state.pagination.page,
        limit: overrides.limit ?? state.pagination.limit,
        tier: (overrides.tier ?? state.filters.tier) !== 'all'
          ? overrides.tier ?? state.filters.tier : undefined,
        status: (overrides.status ?? state.filters.status) !== 'all'
          ? overrides.status ?? state.filters.status : undefined,
        search: (overrides.search ?? state.filters.search) || undefined,
      };

      const key = `admin:card-list:${JSON.stringify(query)}`;

      const res = await self().$cached(
        key,
        () => requests.getAllCards(query),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.cards = data?.cards || [];
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

  // ───── STATS (cache 2 min) ─────
  const fetchStats = async (opts = {}) => {
    state.isLoadingStats = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'admin:card-stats',
        () => requests.getStats(),
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

  // ───── DETAIL ─────
  const fetchCard = async (id, opts = {}) => {
    state.isLoadingDetail = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        `admin:card-one:${id}`,
        () => requests.getCardById(id),
        {
          ttl: 60_000,
          force: opts.force,
          onSuccess: (data) => { state.current = data?.card || null; },
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

  // ───── GENERATE FOR USER ─────
  const generateForUser = async ({ userId, tier }) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.generateForUser({ userId, tier });

      if (res.success) {
        const card = res.data?.card;
        if (card) state.cards.unshift(card);
        self().$invalidatePrefix('admin:card-list:');
        self().$invalidate('admin:card-stats');
        return { success: true, card, message: res.message };
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

  // ───── FREEZE ─────
  const freezeCard = async (id) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.freezeCard(id);

      if (res.success) {
        const card = res.data?.card;
        const idx = state.cards.findIndex((c) => c._id === id);
        if (idx !== -1 && card) {
          state.cards[idx] = { ...state.cards[idx], status: card.status, frozenAt: card.frozenAt };
        }
        if (state.current?._id === id && card) state.current = card;
        self().$invalidatePrefix('admin:card-list:');
        self().$invalidate('admin:card-stats');
        return { success: true, card, message: res.message };
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

  // ───── DELETE ─────
  const deleteCard = async (id) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.deleteCard(id);

      if (res.success) {
        state.cards = state.cards.filter((c) => c._id !== id);
        if (state.current?._id === id) state.current = null;
        self().$invalidatePrefix('admin:card-list:');
        self().$invalidate('admin:card-stats');
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

  // ───── FILTERS / PAGE ─────
  const setFilters = (partial) => {
    state.filters = { ...state.filters, ...partial };
    state.pagination.page = 1;
  };
  const resetFilters = () => {
    state.filters = { tier: 'all', status: 'all', search: '' };
    state.pagination.page = 1;
  };
  const setPage = (page) => { state.pagination.page = page; };

  const clearCurrent = () => { state.current = null; };

  const clearAll = () => {
    state.cards = [];
    state.pagination = { total: 0, page: 1, limit: 20, pages: 0 };
    state.filters = { tier: 'all', status: 'all', search: '' };
    state.stats = null;
    state.statsLoaded = false;
    state.current = null;
    state.error = null;
    self().$invalidatePrefix('admin:card-');
  };

  return {
    state,
    hasCards,
    totalPages,
    setError,
    clearError,
    setFilters,
    resetFilters,
    setPage,
    fetchCards,
    fetchStats,
    fetchCard,
    generateForUser,
    freezeCard,
    deleteCard,
    clearCurrent,
    clearAll,
  };
});