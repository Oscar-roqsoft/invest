// stores/card.js
import { defineStore } from 'pinia';

export const useCardStore = defineStore('card', () => {
  const getRequests = () => useCardRequests();
  const self = () => useCardStore();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    cards: [],
    cardsLoaded: false,

    eligibility: null,
    eligibilityLoaded: false,

    current: null,       // a single card being viewed (full details)

    isLoading: false,
    isLoadingEligibility: false,
    isLoadingDetail: false,
    isSubmitting: false,
    error: null,
  });

  // ─────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────
  const hasCards = computed(() => state.cards.length > 0);

  const activeCards = computed(() =>
    state.cards.filter((c) => c.status === 'active')
  );

  /** Do they already have a card of this tier? */
  const hasCardOfTier = (tier) =>
    state.cards.some((c) => c.tier === tier);

  /** Can they generate for a given tier? (eligibility tiers.gold/black) */
  const canGenerateTier = (tier) => {
    if (!state.eligibility) return false;
    return !!state.eligibility.tiers?.[tier];
  };

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  const findById = (id) => state.cards.find((c) => c._id === id) || null;

  // ─────────────────────────────────────────────────────────
  // ELIGIBILITY
  // ─────────────────────────────────────────────────────────
  const fetchEligibility = async (opts = {}) => {
    state.isLoadingEligibility = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'card:eligibility',
        () => requests.getEligibility(),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.eligibility = data;
            state.eligibilityLoaded = true;
          },
        }
      );

      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoadingEligibility = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // MY CARDS
  // ─────────────────────────────────────────────────────────
  const fetchMyCards = async (opts = {}) => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        'card:my',
        () => requests.getMyCards(),
        {
          ttl: 30_000,
          force: opts.force,
          onSuccess: (data) => {
            state.cards = data?.cards || [];
            state.cardsLoaded = true;
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
  // DETAIL (full number + cvv)
  // ─────────────────────────────────────────────────────────
  const fetchCard = async (id, opts = {}) => {
    state.isLoadingDetail = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await self().$cached(
        `card:one:${id}`,
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

  // ─────────────────────────────────────────────────────────
  // GENERATE
  // ─────────────────────────────────────────────────────────
  const generateCard = async ({ tier }) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.generateCard({ tier });

      if (res.success) {
        const card = res.data?.card;
        if (card) {
          state.cards.unshift({
            ...card,
            // full shape includes fullNumber+cvv; strip for list safety
            fullNumber: undefined,
            cvv: undefined,
          });
        }
        // Invalidate eligibility (they now have that tier)
        self().$invalidate('card:eligibility');
        self().$invalidatePrefix('card:one:');
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

  // ─────────────────────────────────────────────────────────
  // FREEZE / UNFREEZE
  // ─────────────────────────────────────────────────────────
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
          // patch status only — keep list shape
          state.cards[idx] = { ...state.cards[idx], status: card.status, frozenAt: card.frozenAt };
        }
        if (state.current?._id === id && card) state.current = card;
        self().$invalidate(`card:one:${id}`);
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

  // ─────────────────────────────────────────────────────────
  // DELETE (soft cancel)
  // ─────────────────────────────────────────────────────────
  const deleteCard = async (id) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.deleteCard(id);

      if (res.success) {
        state.cards = state.cards.filter((c) => c._id !== id);
        if (state.current?._id === id) state.current = null;
        self().$invalidate('card:eligibility');
        self().$invalidate(`card:one:${id}`);
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
    state.cards = [];
    state.cardsLoaded = false;
    state.eligibility = null;
    state.eligibilityLoaded = false;
    state.current = null;
    state.error = null;
    self().$invalidatePrefix('card:');
  };

  return {
    // state
    state,
    // getters
    hasCards,
    activeCards,
    hasCardOfTier,
    canGenerateTier,
    // helpers
    setError,
    clearError,
    findById,
    // actions
    fetchEligibility,
    fetchMyCards,
    fetchCard,
    generateCard,
    freezeCard,
    deleteCard,
    // cleanup
    clearCurrent,
    clearAll,
  };
});