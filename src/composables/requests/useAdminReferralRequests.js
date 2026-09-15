// composables/requests/useAdminReferralRequests.js
import { ADMIN_REFERRAL_ENDPOINTS } from '~/composables/constants';

export const useAdminReferralRequests = () => {
  const api = useApi();
  const authOpts = { requiresAuth: true };

  const getAllReferrals = (params = {}) =>
    api.get(ADMIN_REFERRAL_ENDPOINTS.LIST, { ...authOpts, query: params });

  const getReferralStats = () =>
    api.get(ADMIN_REFERRAL_ENDPOINTS.STATS, authOpts);

  const getUserReferrals = (userId) =>
    api.get(ADMIN_REFERRAL_ENDPOINTS.USER_REFERRALS(userId), authOpts);

  const manuallyCreditReferral = (payload) =>
    api.post(ADMIN_REFERRAL_ENDPOINTS.MANUAL_CREDIT, payload, authOpts);

  const backfillReferrals = () =>
    api.post(ADMIN_REFERRAL_ENDPOINTS.BACKFILL, {}, authOpts);

  return {
    getAllReferrals,
    getReferralStats,
    getUserReferrals,
    manuallyCreditReferral,
    backfillReferrals,
  };
};