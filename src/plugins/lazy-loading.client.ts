import LazyLoading from "vue-lazy-loading"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(LazyLoading);
});
