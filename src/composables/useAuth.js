// composables/useAuth.js
import { useAuthStore } from '~/stores/auth';

/**
 * Convenience auth composable
 * Combines store state + common actions
 */
export const useAuth = () => {
  const store = useAuthStore();

  return {
    // State (read-only refs)
    user: computed(() => store.state.user),
    isAuthenticated: computed(() => store.state.isAuthenticated),
    isLoading: computed(() => store.state.isLoading),
    error: computed(() => store.state.error),
    isVerified: store.isVerified,
    isAdmin: store.isAdmin,
    userName: store.userName,

    // Actions
    register: store.register,
    login: store.login,
    verifyOTP: store.verifyOTP,
    resendOTP: store.resendOTP,
    forgot: store.forgot,
    reset: store.reset,
    changePassword: store.changePassword,
    fetchUser: store.fetchUser,
    logout: store.logout,
    init: store.init,

    // Setters
    setUser: store.setUser,
    setToken: store.setToken,
  };
};