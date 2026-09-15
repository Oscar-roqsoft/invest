// composables/requests/useAdminUserRequests.js
import { ADMIN_USER_ENDPOINTS } from '~/composables/constants';

export const useAdminUserRequests = () => {
  const api = useApi();
  const authOpts = { requiresAuth: true };

  const getAllUsers = (params = {}) =>
    api.get(ADMIN_USER_ENDPOINTS.LIST, { ...authOpts, query: params });

  const getUserById = (id) =>
    api.get(ADMIN_USER_ENDPOINTS.BY_ID(id), authOpts);

  const setBanStatus = (id, { isBanned, reason }) =>
    api.post(ADMIN_USER_ENDPOINTS.BAN(id), { isBanned, reason }, authOpts);

  const updateUser = (id, payload) =>
    api.put(ADMIN_USER_ENDPOINTS.BY_ID(id), payload, authOpts);

  const getUserStats = () =>
    api.get(ADMIN_USER_ENDPOINTS.STATS, authOpts);

  return {
    getAllUsers,
    getUserById,
    setBanStatus,
    updateUser,
    getUserStats,
  };
};