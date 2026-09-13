// stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  // Get the auth requests composable
  const requests = useAuthRequests();

  // Storage keys
  const TOKEN_KEY = 'auth_token';
  const REFRESH_TOKEN_KEY = 'refresh_token';
  const USER_KEY = 'user_data';

  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────
  const state = reactive({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    isFetchingUser: false,
    error: null,

    pendingEmail: null,
    requiresVerification: false,
    otpEmail: null,

    adminUsers: [],
  });

  // ─────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────
  const isVerified = computed(() => state.user?.isVerified === true);
  const isAdmin = computed(() => state.user?.role === 'admin');
  const userName = computed(() => state.user?.name || 'User');
  const userInitials = computed(() => {
    if (!state.user?.name) return '?';
    return state.user.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });

  // ─────────────────────────────────────────────────────────────
  // STORAGE
  // ─────────────────────────────────────────────────────────────
  const persistSession = (token, refreshTokenValue, user) => {
    if (!import.meta.client) return;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (refreshTokenValue) localStorage.setItem(REFRESH_TOKEN_KEY, refreshTokenValue);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  const clearSession = () => {
    if (!import.meta.client) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const loadSession = () => {
    if (!import.meta.client) return;

    const token = localStorage.getItem(TOKEN_KEY);
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    state.token = token || null;
    state.refreshToken = refresh || null;

    if (userStr) {
      try {
        state.user = JSON.parse(userStr);
        state.isAuthenticated = !!token && !!state.user;
      } catch {
        state.user = null;
        state.isAuthenticated = false;
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // SETTERS
  // ─────────────────────────────────────────────────────────────
  const setUser = (payload) => {
    state.user = payload;
    if (import.meta.client && payload) {
      localStorage.setItem(USER_KEY, JSON.stringify(payload));
    }
  };

  const setToken = (token, refreshTokenValue = null) => {
    state.token = token;
    if (refreshTokenValue) state.refreshToken = refreshTokenValue;
    state.isAuthenticated = !!token;
    if (import.meta.client) {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (refreshTokenValue) localStorage.setItem(REFRESH_TOKEN_KEY, refreshTokenValue);
    }
  };

  const setError = (message) => { state.error = message; };
  const clearError = () => { state.error = null; };
  const setPendingEmail = (email) => {
    state.pendingEmail = email;
    state.otpEmail = email;
  };

  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────

  /**
   * REGISTER
   */
  const register = async (payload) => {
    state.isLoading = true;
    state.error = null;

    try {
      const res = await requests.register(payload);

      if (res.success) {
        const token = res.data?.token;
        const refresh = res.data?.refreshToken;
        const user = res.data?.user;

        persistSession(token, refresh, user);
        state.token = token;
        state.refreshToken = refresh;
        state.user = user;
        state.pendingEmail = user?.email || payload.email;
        state.otpEmail = state.pendingEmail;
        state.requiresVerification = true;

        return { success: true, data: res.data, message: res.message };
      }

      state.error = res.message;
      return { success: false, message: res.message };
    } catch (err) {
      state.error = err.message || 'Registration failed';
      return { success: false, message: state.error };
    } finally {
      state.isLoading = false;
    }
  };

  /**
   * LOGIN
   */
  const login = async (payload) => {
    state.isLoading = true;
    state.error = null;

    try {
      const res = await requests.signIn(payload);

      if (res.success) {
        const token = res.data?.token;
        const refresh = res.data?.refreshToken;
        const user = res.data?.user;
        const requiresVerification = res.data?.requiresVerification;

        if (requiresVerification) {
          state.pendingEmail = user?.email || payload.email;
          state.otpEmail = state.pendingEmail;
          state.requiresVerification = true;
          state.token = token;
          persistSession(token, null, null);
          return { success: true, requiresVerification: true, message: res.message };
        }

        persistSession(token, refresh, user);
        state.token = token;
        state.refreshToken = refresh;
        state.user = user;
        state.isAuthenticated = true;
        state.requiresVerification = false;

        return { success: true, data: res.data, message: res.message };
      }

      state.error = res.message;
      return { success: false, message: res.message };
    } catch (err) {
      state.error = err.message || 'Login failed';
      return { success: false, message: state.error };
    } finally {
      state.isLoading = false;
    }
  };

  /**
   * VERIFY OTP
   */
  const verifyOTP = async (otp) => {
    state.isLoading = true;
    state.error = null;

    try {
      if (!state.otpEmail) {
        return { success: false, message: 'No email to verify' };
      }

      const res = await requests.verifyOtp({ email: state.otpEmail, otp });

      if (res.success) {
        const token = res.data?.token;
        const refresh = res.data?.refreshToken;
        const user = res.data?.user;

        persistSession(token, refresh, user);
        state.token = token;
        state.refreshToken = refresh;
        state.user = user;
        state.isAuthenticated = true;
        state.requiresVerification = false;
        state.pendingEmail = null;
        state.otpEmail = null;

        return { success: true, data: res.data, message: res.message };
      }

      state.error = res.message;
      return { success: false, message: res.message };
    } catch (err) {
      state.error = err.message || 'Verification failed';
      return { success: false, message: state.error };
    } finally {
      state.isLoading = false;
    }
  };

  /**
   * RESEND OTP
   */
  const resendOTP = async (email = null) => {
    state.isLoading = true;
    state.error = null;

    try {
      const targetEmail = email || state.otpEmail || state.pendingEmail;
      if (!targetEmail) return { success: false, message: 'No email to resend to' };

      const res = await requests.resendOtp({ email: targetEmail });

      if (res.success) return { success: true, message: res.message };

      state.error = res.message;
      return { success: false, message: res.message };
    } catch (err) {
      state.error = err.message || 'Resend failed';
      return { success: false, message: state.error };
    } finally {
      state.isLoading = false;
    }
  };

  /**
   * FORGOT PASSWORD
   */
  const forgot = async (payload) => {
    state.isLoading = true;
    state.error = null;

    try {
      const res = await requests.forgotPassword(payload);
      if (res.success) return { success: true, message: res.message };

      state.error = res.message;
      return { success: false, message: res.message };
    } catch (err) {
      state.error = err.message || 'Request failed';
      return { success: false, message: state.error };
    } finally {
      state.isLoading = false;
    }
  };

  /**
   * RESET PASSWORD
   */
  const reset = async (payload) => {
    state.isLoading = true;
    state.error = null;

    try {
      const res = await requests.resetPassword(payload);
      if (res.success) return { success: true, message: res.message };

      state.error = res.message;
      return { success: false, message: res.message };
    } catch (err) {
      state.error = err.message || 'Reset failed';
      return { success: false, message: state.error };
    } finally {
      state.isLoading = false;
    }
  };

  /**
   * UPDATE PASSWORD
   */
  const changePassword = async (payload) => {
    state.isLoading = true;
    state.error = null;

    try {
      const res = await requests.updatePassword(payload);
      if (res.success) return { success: true, message: res.message };

      state.error = res.message;
      return { success: false, message: res.message };
    } catch (err) {
      state.error = err.message || 'Update failed';
      return { success: false, message: state.error };
    } finally {
      state.isLoading = false;
    }
  };

  /**
   * FETCH CURRENT USER
   */
  const fetchUser = async () => {
    state.isFetchingUser = true;

    try {
      const res = await requests.getCurrentUser();

      if (res.success && res.data?.user) {
        state.user = res.data.user;
        state.isAuthenticated = true;
        if (import.meta.client) {
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        }
        return { success: true, user: res.data.user };
      }

      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      clearSession();
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      state.isFetchingUser = false;
    }
  };

  /**
   * FETCH ALL USERS (admin)
   */
  const fetchAdminUsers = async () => {
    try {
      const res = await requests.getAllUsers();
      if (res.success) {
        state.adminUsers = res.data?.users || [];
        return { success: true, users: state.adminUsers };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  /**
   * REFRESH TOKEN
   */
  const refreshSession = async () => {
    if (!state.refreshToken) return { success: false };

    try {
      const res = await requests.refreshToken(state.refreshToken);
      if (res.success) {
        state.token = res.data.token;
        state.refreshToken = res.data.refreshToken;
        persistSession(res.data.token, res.data.refreshToken, state.user);
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  /**
   * LOGOUT
   */
  const logout = async () => {
    try {
      if (state.token) await requests.logoutApi();
    } catch (err) {
      // ignore
    }

    clearSession();
    state.user = null;
    state.token = null;
    state.refreshToken = null;
    state.isAuthenticated = false;
    state.error = null;
    state.pendingEmail = null;
    state.otpEmail = null;
    state.requiresVerification = false;
    state.adminUsers = [];

    navigateTo('/login');
  };

  /**
   * INIT
   */
  const init = () => {
    loadSession();
  };

  return {
    state,
    isVerified,
    isAdmin,
    userName,
    userInitials,
    register,
    login,
    verifyOTP,
    resendOTP,
    forgot,
    reset,
    changePassword,
    fetchUser,
    fetchAdminUsers,
    refreshSession,
    logout,
    init,
    setUser,
    setToken,
    setError,
    clearError,
    setPendingEmail,
  };
});