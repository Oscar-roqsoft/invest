// composables/requests/referral.js
import { REFERRAL_ENDPOINTS } from '~/composables/constants';

export const useReferralRequests = () => {
  const api = useApi();

  /*
  |--------------------------------------------------------------------------
  | PUBLIC
  |--------------------------------------------------------------------------
  */

  /**
   * Validate a referral code (used at register).
   */
  const validateReferralCode = (code) =>
    api.get(REFERRAL_ENDPOINTS.VALIDATE(code));

  /**
   * Public leaderboard of top referrers.
   */
  const getLeaderboard = (limit = 10) =>
    api.get(REFERRAL_ENDPOINTS.LEADERBOARD, { query: { limit } });

  /*
  |--------------------------------------------------------------------------
  | PROTECTED
  |--------------------------------------------------------------------------
  */

  /**
   * Get my referral code, link, and summary.
   */
  const getReferralInfo = () =>
    api.get(REFERRAL_ENDPOINTS.INFO, { requiresAuth: true });

  /**
   * List users I referred (with filters + pagination).
   */
  const getMyReferrals = (params = {}) =>
    api.get(REFERRAL_ENDPOINTS.MY, {
      requiresAuth: true,
      query: params,
    });

  /**
   * Detailed referral stats (conversion rate, etc.).
   */
  const getReferralStats = () =>
    api.get(REFERRAL_ENDPOINTS.STATS, { requiresAuth: true });

  /**
   * Commission earnings history.
   */
  const getReferralEarnings = (params = {}) =>
    api.get(REFERRAL_ENDPOINTS.EARNINGS, {
      requiresAuth: true,
      query: params,
    });

  /**
   * Multi-level referral tree.
   */
  const getReferralTree = () =>
    api.get(REFERRAL_ENDPOINTS.TREE, { requiresAuth: true });

  /**
   * Monthly earnings chart data.
   */
  const getMonthlyEarnings = (months = 6) =>
    api.get(REFERRAL_ENDPOINTS.MONTHLY_EARNINGS, {
      requiresAuth: true,
      query: { months },
    });

  return {
    // Public
    validateReferralCode,
    getLeaderboard,

    // Protected
    getReferralInfo,
    getMyReferrals,
    getReferralStats,
    getReferralEarnings,
    getReferralTree,
    getMonthlyEarnings,
  };
};