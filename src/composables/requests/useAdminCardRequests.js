// composables/requests/useAdminCardRequests.js
import { ADMIN_CARD_ENDPOINTS } from '~/composables/constants';

export const useAdminCardRequests = () => {
  const api = useApi();
  const auth = { requiresAuth: true };

  const getAllCards = (params = {}) =>
    api.get(ADMIN_CARD_ENDPOINTS.LIST, { ...auth, query: params });

  const getStats = () =>
    api.get(ADMIN_CARD_ENDPOINTS.STATS, auth);

  const getCardById = (id) =>
    api.get(ADMIN_CARD_ENDPOINTS.BY_ID(id), auth);

  const generateForUser = ({ userId, tier }) =>
    api.post(ADMIN_CARD_ENDPOINTS.GENERATE, { userId, tier }, auth);

  const freezeCard = (id) =>
    api.post(ADMIN_CARD_ENDPOINTS.FREEZE(id), {}, auth);

  const deleteCard = (id) =>
    api.delete(ADMIN_CARD_ENDPOINTS.DELETE(id), auth);

  return {
    getAllCards,
    getStats,
    getCardById,
    generateForUser,
    freezeCard,
    deleteCard,
  };
};