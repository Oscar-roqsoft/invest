
import { AUTH_ENDPOINTS } from '~/composables/constants';

/**
 * Auth requests composable
 * Auto-imported — use as `useAuthRequests()` in any component
 */
export const useAuthRequests = () => {
  const api = useApi();

  /*
  |--------------------------------------------------------------------------
  | REGISTER
  |--------------------------------------------------------------------------
  */
  const register = async (payload) => {
    return api.post(AUTH_ENDPOINTS.REGISTER, {
      name: payload.name?.trim(),
      email: payload.email?.toLowerCase().trim(),
      password: payload.password,
      referralCode: payload.referralCode?.trim() || undefined,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */
  const signIn = async (payload) => {
    return api.post(AUTH_ENDPOINTS.LOGIN, {
      email: payload.email?.toLowerCase().trim(),
      password: payload.password,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | VERIFY OTP
  |--------------------------------------------------------------------------
  */
  const verifyOtp = async (payload) => {
    return api.post(AUTH_ENDPOINTS.VERIFY_OTP, {
      email: payload.email?.toLowerCase().trim(),
      otp: String(payload.otp).trim(),
    });
  };

  /*
  |--------------------------------------------------------------------------
  | RESEND OTP
  |--------------------------------------------------------------------------
  */
  const resendOtp = async (payload) => {
    return api.post(AUTH_ENDPOINTS.RESEND_OTP, {
      email: payload.email?.toLowerCase().trim(),
    });
  };

  /*
  |--------------------------------------------------------------------------
  | FORGOT PASSWORD
  |--------------------------------------------------------------------------
  */
  const forgotPassword = async (payload) => {
    return api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
      email: payload.email?.toLowerCase().trim(),
    });
  };

  /*
  |--------------------------------------------------------------------------
  | RESET PASSWORD
  |--------------------------------------------------------------------------
  */
  const resetPassword = async (payload) => {
    return api.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
      token: payload.token,
      newPassword: payload.newPassword,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE PASSWORD
  |--------------------------------------------------------------------------
  */
  const updatePassword = async (payload) => {
    return api.post(
      AUTH_ENDPOINTS.UPDATE_PASSWORD,
      {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      },
      { requiresAuth: true }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | REFRESH TOKEN
  |--------------------------------------------------------------------------
  */
  const refreshToken = async (refreshTokenValue) => {
    return api.post(AUTH_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken: refreshTokenValue,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | GET CURRENT USER
  |--------------------------------------------------------------------------
  */
  const getCurrentUser = async () => {
    return api.get(AUTH_ENDPOINTS.ME, { requiresAuth: true });
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */
  const logoutApi = async () => {
    return api.post(AUTH_ENDPOINTS.LOGOUT, {}, { requiresAuth: true });
  };

  /*
  |--------------------------------------------------------------------------
  | GET ALL USERS (admin)
  |--------------------------------------------------------------------------
  */
  const getAllUsers = async () => {
    return api.get(AUTH_ENDPOINTS.USERS, { requiresAuth: true });
  };

  return {
    register,
    signIn,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    updatePassword,
    refreshToken,
    getCurrentUser,
    logoutApi,
    getAllUsers,
  };
};