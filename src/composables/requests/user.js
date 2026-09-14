// composables/requests/user.js
import { USER_ENDPOINTS } from '~/composables/constants';

export const useUserRequests = () => {
  const api = useApi();

  /*
  |--------------------------------------------------------------------------
  | PROFILE
  |--------------------------------------------------------------------------
  */
  const getProfile = () =>
    api.get(USER_ENDPOINTS.PROFILE, { requiresAuth: true });

  const updateProfile = (data) =>
    api.put(USER_ENDPOINTS.PROFILE, data, { requiresAuth: true });

  const updateAvatar = (avatarUrl) =>
    api.put(USER_ENDPOINTS.AVATAR, { avatar: avatarUrl }, { requiresAuth: true });

  /*
  |--------------------------------------------------------------------------
  | SECURITY
  |--------------------------------------------------------------------------
  */
  const getSecurityOverview = () =>
    api.get(USER_ENDPOINTS.SECURITY, { requiresAuth: true });

  const changePassword = (data) =>
    api.post(USER_ENDPOINTS.CHANGE_PASSWORD, data, { requiresAuth: true });

  const setPin = (data) =>
    api.post(USER_ENDPOINTS.SET_PIN, data, { requiresAuth: true });

  const changePin = (data) =>
    api.post(USER_ENDPOINTS.CHANGE_PIN, data, { requiresAuth: true });

  const toggle2FA = (data) =>
    api.post(USER_ENDPOINTS.TOGGLE_2FA, data, { requiresAuth: true });

  /*
  |--------------------------------------------------------------------------
  | KYC
  |--------------------------------------------------------------------------
  */
  const submitKYC = (data) =>
    api.post(USER_ENDPOINTS.KYC, data, { requiresAuth: true });

  /*
  |--------------------------------------------------------------------------
  | DANGER ZONE
  |--------------------------------------------------------------------------
  */
  const deleteAccount = (data) =>
    api.delete(USER_ENDPOINTS.DELETE_ACCOUNT, {
      requiresAuth: true,
      body: data,
    });

  return {
    // Profile
    getProfile,
    updateProfile,
    updateAvatar,

    // Security
    getSecurityOverview,
    changePassword,
    setPin,
    changePin,
    toggle2FA,

    // KYC
    submitKYC,

    // Danger zone
    deleteAccount,
  };
};