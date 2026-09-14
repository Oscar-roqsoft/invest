export default defineNuxtPlugin((nuxtApp) => {
    const pinia = nuxtApp.$pinia;
  
    pinia.use(({ store }) => {
      const timestamps = reactive({});
      const ttlMap = reactive({});
      const MAX_KEYS = 200; // safety cap
  
      const pruneIfNeeded = () => {
        const keys = Object.keys(timestamps);
        if (keys.length <= MAX_KEYS) return;
        // Drop oldest 20%
        keys
          .sort((a, b) => timestamps[a] - timestamps[b])
          .slice(0, Math.floor(MAX_KEYS * 0.2))
          .forEach((k) => {
            delete timestamps[k];
            delete ttlMap[k];
          });
      };
  
      store.$setTTL = (key, ttl) => { ttlMap[key] = ttl; };
  
      store.$isFresh = (key) => {
        const ts = timestamps[key];
        if (!ts) return false;
        const ttl = ttlMap[key] || 60_000;
        return Date.now() - ts < ttl;
      };
  
      store.$markFresh = (key) => {
        timestamps[key] = Date.now();
        pruneIfNeeded();
      };
  
      store.$invalidate = (key) => {
        if (Array.isArray(key)) key.forEach((k) => { delete timestamps[k]; delete ttlMap[k]; });
        else if (key) { delete timestamps[key]; delete ttlMap[key]; }
        else { Object.keys(timestamps).forEach((k) => { delete timestamps[k]; delete ttlMap[k]; }); }
      };
  
      /** Invalidate by prefix — e.g. invalidate all "tx:" keys */
      store.$invalidatePrefix = (prefix) => {
        Object.keys(timestamps)
          .filter((k) => k.startsWith(prefix))
          .forEach((k) => { delete timestamps[k]; delete ttlMap[k]; });
      };
  
      store.$cached = async (key, fetcher, options = {}) => {
        const { force = false, ttl, onSuccess, skipCache = false } = options;
  
        if (ttl) ttlMap[key] = ttl;
  
        if (!force && !skipCache && store.$isFresh(key)) {
          return { success: true, cached: true };
        }
  
        try {
          const res = await fetcher();
          if (res?.success) {
            if (onSuccess) onSuccess(res.data);
            store.$markFresh(key);
          }
          return res;
        } catch (err) {
          return { success: false, message: err.message };
        }
      };
    });
  });