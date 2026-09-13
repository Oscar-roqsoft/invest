// middleware/guest.js
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  authStore.init();

  const guestOnly = ['/login', '/register'];

  if (guestOnly.includes(to.path) && authStore.state.isAuthenticated) {
    return navigateTo('/dashboard');
  }
});