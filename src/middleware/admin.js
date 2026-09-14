// middleware/admin.js
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  authStore.init();

  // Must be logged in
  if (!authStore.state.isAuthenticated) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  // Must be admin
  if (!authStore.isAdmin) {
    return navigateTo('/dashboard');
  }
});