// plugins/init.client.js
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  authStore.init();
});