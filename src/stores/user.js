// stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    profile: null,
    completion: {
      percentage: 0,
      filledFields: [],
      missingFields: [],
    },
    security: {
      isVerified: false,
      isPinSet: false,
      twoFactorVerification: false,
      kycStatus: 'not_started',
      hasPhone: false,
      score: 0,
    },

    isLoading: false,
    isSubmitting: false,
    isUploadingAvatar: false,
    error: null,
  });

  // ─────────────────────────────────────────────────────────
  // LAZY COMPOSABLES — only inside actions
  // ─────────────────────────────────────────────────────────
  // ❌ DON'T do: const requests = useUserRequests(); at top level
  // ✅ DO: get it inside each action

  const getRequests = () => useUserRequests();
  const getUploads = () => useUploadRequests();

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  const syncWithAuth = (user) => {
    try {
      const authStore = useAuthStore();
      authStore.setUser(user);
    } catch (err) {
      console.warn('Could not sync with auth store:', err.message);
    }
  };

  // ─────────────────────────────────────────────────────────
  // PROFILE
  // ─────────────────────────────────────────────────────────
  const fetchProfile = async () => {
    state.isLoading = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.getProfile();

      if (res.success) {
        state.profile = res.data.user;
        state.completion = res.data.completion || state.completion;
        syncWithAuth(res.data.user);
        return { success: true, user: res.data.user };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isLoading = false;
    }
  };

  const updateProfile = async (data) => {
    state.isSubmitting = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.updateProfile(data);

      if (res.success) {
        state.profile = res.data.user;
        state.completion = res.data.completion || state.completion;
        syncWithAuth(res.data.user);
        return { success: true, user: res.data.user };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isSubmitting = false;
    }
  };

  const updateAvatar = async (avatarUrl) => {
    state.isUploadingAvatar = true;
    clearError();

    try {
      const requests = getRequests();
      const res = await requests.updateAvatar(avatarUrl);

      if (res.success) {
        state.profile = res.data.user;
        syncWithAuth(res.data.user);
        return { success: true, user: res.data.user };
      }

      setError(res.message);
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isUploadingAvatar = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // UPLOAD FILE (generic — for KYC, etc.)
  // ─────────────────────────────────────────────────────────
  const uploadFile = async (file, options = {}) => {
    const uploads = getUploads();
    return await uploads.uploadFile(file, options);
  };

  // ─────────────────────────────────────────────────────────
  // UPLOAD AVATAR (upload + update profile)
  // ─────────────────────────────────────────────────────────
  const uploadAvatar = async (file, callbacks = {}) => {
    state.isUploadingAvatar = true;
    clearError();

    try {
      // ⭐ Get the composable INSIDE the action
      const uploads = getUploads();

      // ⭐ Upload with compression
      const uploadResult = await uploads.uploadFile(file, {
        type: 'avatar',
        compress: true,
        compressionOptions: {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          initialQuality: 0.85,
        },
        onProgress: callbacks.onUploadProgress,
        onCompressionProgress: callbacks.onCompressProgress,
      });

      if (!uploadResult.success) {
        setError(uploadResult.message);
        return {
          success: false,
          message: uploadResult.message,
        };
      }

      // ⭐ Now save the URL to the user's profile
      // Note: call the internal updateAvatar we defined above
      const updateRes = await updateAvatar(uploadResult.url);

      return {
        ...updateRes,
        compression: uploadResult.compression,
      };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      state.isUploadingAvatar = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // SECURITY
  // ─────────────────────────────────────────────────────────
  const fetchSecurity = async () => {
    try {
      const requests = getRequests();
      const res = await requests.getSecurityOverview();

      if (res.success) {
        state.security = { ...state.security, ...res.data.security };
        return { success: true, security: state.security };
      }

      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const changePassword = async (payload) => {
    state.isSubmitting = true;
    try {
      const requests = getRequests();
      return await requests.changePassword(payload);
    } finally {
      state.isSubmitting = false;
    }
  };

  const setPin = async (payload) => {
    state.isSubmitting = true;
    try {
      const requests = getRequests();
      const res = await requests.setPin(payload);
      if (res.success) {
        state.security.isPinSet = true;
      }
      return res;
    } finally {
      state.isSubmitting = false;
    }
  };

  const changePin = async (payload) => {
    state.isSubmitting = true;
    try {
      const requests = getRequests();
      return await requests.changePin(payload);
    } finally {
      state.isSubmitting = false;
    }
  };

  const toggle2FA = async (enabled, password) => {
    state.isSubmitting = true;
    try {
      const requests = getRequests();
      const res = await requests.toggle2FA({ enabled, password });
      if (res.success) {
        state.security.twoFactorVerification = res.data.twoFactorVerification;
      }
      return res;
    } finally {
      state.isSubmitting = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // KYC
  // ─────────────────────────────────────────────────────────
  const submitKYC = async (payload) => {
    state.isSubmitting = true;
    try {
      const requests = getRequests();
      const res = await requests.submitKYC(payload);
      if (res.success && state.profile) {
        state.profile.kyc = res.data.kyc;
        state.security.kycStatus = res.data.kyc.status;
      }
      return res;
    } finally {
      state.isSubmitting = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // DANGER ZONE
  // ─────────────────────────────────────────────────────────
  const deleteAccount = async (password, reason = '') => {
    state.isSubmitting = true;
    try {
      const requests = getRequests();
      const res = await requests.deleteAccount({ password, reason });
      if (res.success) {
        const authStore = useAuthStore();
        authStore.logout();
      }
      return res;
    } finally {
      state.isSubmitting = false;
    }
  };

  // ─────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────
  const clearAll = () => {
    state.profile = null;
    state.completion = { percentage: 0, filledFields: [], missingFields: [] };
    state.security = {
      isVerified: false,
      isPinSet: false,
      twoFactorVerification: false,
      kycStatus: 'not_started',
      hasPhone: false,
      score: 0,
    };
    state.error = null;
  };

  return {
    state,
    fetchProfile,
    updateProfile,
    updateAvatar,
    uploadFile,
    uploadAvatar,
    fetchSecurity,
    changePassword,
    setPin,
    changePin,
    toggle2FA,
    submitKYC,
    deleteAccount,
    clearAll,
    setError,
    clearError,
  };
});