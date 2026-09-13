// composables/useApi.js

/**
 * Base API request wrapper
 * Auto-imported by Nuxt — use as `useApi()` in any component
 */
export const useApi = () => {
    const config = useRuntimeConfig();
  
    const baseURL =
      config.public.apiBaseUrl ||
      process.env.NUXT_PUBLIC_API_BASE_URL ||
      'http://localhost:5000/api/v1';
  
    /**
     * Get stored auth token
     */
    const getToken = () => {
      if (import.meta.client) {
        return localStorage.getItem('auth_token');
      }
      return null;
    };
  
    /**
     * Core request method
     */
    const request = async (endpoint, options = {}) => {
      const {
        method = 'GET',
        body = null,
        headers = {},
        requiresAuth = false,
        query = null,
      } = options;
  
      // Build URL
      let url = `${baseURL}${endpoint}`;
      if (query && typeof query === 'object') {
        const params = new URLSearchParams(
          Object.entries(query).filter(
            ([, v]) => v !== undefined && v !== null && v !== ''
          )
        );
        const qs = params.toString();
        if (qs) url += `?${qs}`;
      }
  
      // Headers
      const finalHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      };
  
      if (requiresAuth) {
        const token = getToken();
        if (token) finalHeaders.Authorization = `Bearer ${token}`;
      }
  
      // Body
      const fetchOptions = { method, headers: finalHeaders };
      if (body && method !== 'GET') {
        fetchOptions.body = JSON.stringify(body);
      }
  
      try {
        const response = await fetch(url, fetchOptions);
        const data = await response.json().catch(() => ({}));
  
        // Handle 401
        if (response.status === 401 && import.meta.client) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
  
          if (!window.location.pathname.includes('/login')) {
            navigateTo('/login');
          }
        }
  
        if (!response.ok) {
          return {
            success: false,
            status: response.status,
            message: data?.message || 'Request failed',
            data: data?.data || null,
          };
        }
  
        return {
          success: true,
          status: response.status,
          message: data?.message || 'Success',
          data: data?.data || data,
        };
      } catch (error) {
        console.error('API request error:', error);
        return {
          success: false,
          status: 0,
          message: 'Network error. Please check your connection.',
          data: null,
        };
      }
    };
  
    // Shorthands
    const get = (endpoint, options = {}) =>
      request(endpoint, { ...options, method: 'GET' });
  
    const post = (endpoint, body, options = {}) =>
      request(endpoint, { ...options, method: 'POST', body });
  
    const put = (endpoint, body, options = {}) =>
      request(endpoint, { ...options, method: 'PUT', body });
  
    const patch = (endpoint, body, options = {}) =>
      request(endpoint, { ...options, method: 'PATCH', body });
  
    const del = (endpoint, options = {}) =>
      request(endpoint, { ...options, method: 'DELETE' });
  
    return { request, get, post, put, patch, delete: del };
  };