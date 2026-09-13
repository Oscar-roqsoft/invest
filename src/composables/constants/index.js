// composables/constants/index.js

export const API_BASE_URL =
  process.env.NUXT_PUBLIC_API_BASE_URL ||
  'http://localhost:5000/api/v1';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  UPDATE_PASSWORD: '/auth/update-password',
  ME: '/auth/me',
  USERS: '/auth/users',
};

// Token storage keys
export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'user_data';

// OTP config
export const OTP_LENGTH = 6;
export const OTP_RESEND_TIMER = 60; // seconds