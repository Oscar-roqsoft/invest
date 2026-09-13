// middleware/auth.js
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  authStore.init();

  // Public routes that don't require auth
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/verify-otp',
    '/forgot-password',
    '/reset-password',
  ];

  if (publicRoutes.includes(to.path)) return;

  if (!authStore.state.isAuthenticated) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});