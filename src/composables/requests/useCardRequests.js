// composables/requests/useCardRequests.js
import { CARD_ENDPOINTS } from '~/composables/constants';

export const useCardRequests = () => {
  const api = useApi();
  const auth = { requiresAuth: true };

  const getEligibility = () =>
    api.get(CARD_ENDPOINTS.ELIGIBILITY, auth);

  const getMyCards = () =>
    api.get(CARD_ENDPOINTS.MY, auth);

  const generateCard = ({ tier }) =>
    api.post(CARD_ENDPOINTS.GENERATE, { tier }, auth);

  const getCardById = (id) =>
    api.get(CARD_ENDPOINTS.BY_ID(id), auth);

  const freezeCard = (id) =>
    api.post(CARD_ENDPOINTS.FREEZE(id), {}, auth);

  const deleteCard = (id) =>
    api.delete(CARD_ENDPOINTS.DELETE(id), auth);

  return {
    getEligibility,
    getMyCards,
    generateCard,
    getCardById,
    freezeCard,
    deleteCard,
  };
};