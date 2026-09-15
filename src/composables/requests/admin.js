// composables/requests/dashboard/admin.js
import { ADMIN_ENDPOINTS } from '~/composables/constants';

export const useAdminRequests = () => {
  const api = useApi();

  // ─────────────────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────────────────
  const getAllUsers = (params = {}) =>
    api.get(ADMIN_ENDPOINTS.USERS, { requiresAuth: true, query: params });

  const getUserStats = () =>
    api.get(ADMIN_ENDPOINTS.USER_STATS, { requiresAuth: true });

  const getUserById = (id) =>
    api.get(ADMIN_ENDPOINTS.USER_BY_ID(id), { requiresAuth: true });

  const updateUser = (id, data) =>
    api.put(ADMIN_ENDPOINTS.USER_BY_ID(id), data, { requiresAuth: true });

  const setBanStatus = (id, data) =>
    api.post(ADMIN_ENDPOINTS.USER_BAN(id), data, { requiresAuth: true });

  // ─────────────────────────────────────────────────────────
  // KYC
  // ─────────────────────────────────────────────────────────
  const getAllKyc = (params = {}) =>
    api.get(ADMIN_ENDPOINTS.KYC, { requiresAuth: true, query: params });

  const getKycStats = () =>
    api.get(ADMIN_ENDPOINTS.KYC_STATS, { requiresAuth: true });

  const getKycHistory = (params = {}) =>
    api.get(ADMIN_ENDPOINTS.KYC_HISTORY, { requiresAuth: true, query: params });

  const getKycByUser = (userId) =>
    api.get(ADMIN_ENDPOINTS.KYC_BY_USER(userId), { requiresAuth: true });

  const approveKyc = (userId, data = {}) =>
    api.post(ADMIN_ENDPOINTS.KYC_APPROVE(userId), data, { requiresAuth: true });

  const rejectKyc = (userId, data) =>
    api.post(ADMIN_ENDPOINTS.KYC_REJECT(userId), data, { requiresAuth: true });

  const requestKycResubmission = (userId, data) =>
    api.post(ADMIN_ENDPOINTS.KYC_REQUEST_RESUBMISSION(userId), data, { requiresAuth: true });

  const bulkApproveKyc = (userIds) =>
    api.post(ADMIN_ENDPOINTS.KYC_BULK_APPROVE, { userIds }, { requiresAuth: true });

  const bulkRejectKyc = (userIds, rejectionReason) =>
    api.post(ADMIN_ENDPOINTS.KYC_BULK_REJECT, { userIds, rejectionReason }, { requiresAuth: true });

  // ─────────────────────────────────────────────────────────
  // DEPOSITS
  // ─────────────────────────────────────────────────────────
  const getAllDeposits = (params = {}) =>
    api.get(ADMIN_ENDPOINTS.DEPOSITS, { requiresAuth: true, query: params });

  const getDepositStats = () =>
    api.get(ADMIN_ENDPOINTS.DEPOSIT_STATS, { requiresAuth: true });

  const getDepositById = (id) =>
    api.get(ADMIN_ENDPOINTS.DEPOSIT_BY_ID(id), { requiresAuth: true });

  const approveDeposit = (id, data = {}) =>
    api.post(ADMIN_ENDPOINTS.DEPOSIT_APPROVE(id), data, { requiresAuth: true });

  const rejectDeposit = (id, data) =>
    api.post(ADMIN_ENDPOINTS.DEPOSIT_REJECT(id), data, { requiresAuth: true });

  // ─────────────────────────────────────────────────────────
  // WITHDRAWALS
  // ─────────────────────────────────────────────────────────
  const getAllWithdrawals = (params = {}) =>
    api.get(ADMIN_ENDPOINTS.WITHDRAWALS, { requiresAuth: true, query: params });

  const getWithdrawalStats = () =>
    api.get(ADMIN_ENDPOINTS.WITHDRAWAL_STATS, { requiresAuth: true });

  const getWithdrawalById = (id) =>
    api.get(ADMIN_ENDPOINTS.WITHDRAWAL_BY_ID(id), { requiresAuth: true });

  const approveWithdrawal = (id, data = {}) =>
    api.post(ADMIN_ENDPOINTS.WITHDRAWAL_APPROVE(id), data, { requiresAuth: true });

  const processWithdrawal = (id, data = {}) =>
    api.post(ADMIN_ENDPOINTS.WITHDRAWAL_PROCESS(id), data, { requiresAuth: true });

  const completeWithdrawal = (id, data = {}) =>
    api.post(ADMIN_ENDPOINTS.WITHDRAWAL_COMPLETE(id), data, { requiresAuth: true });

  const rejectWithdrawal = (id, data) =>
    api.post(ADMIN_ENDPOINTS.WITHDRAWAL_REJECT(id), data, { requiresAuth: true });

  // ─────────────────────────────────────────────────────────
  // SYSTEM WALLETS
  // ─────────────────────────────────────────────────────────
  const getSystemWallets = (params = {}) =>
    api.get(ADMIN_ENDPOINTS.SYSTEM_WALLETS, { requiresAuth: true, query: params });

  const getSystemWalletById = (id) =>
    api.get(ADMIN_ENDPOINTS.SYSTEM_WALLET_BY_ID(id), { requiresAuth: true });

  const createSystemWallet = (data) =>
    api.post(ADMIN_ENDPOINTS.SYSTEM_WALLETS, data, { requiresAuth: true });

  const updateSystemWallet = (id, data) =>
    api.put(ADMIN_ENDPOINTS.SYSTEM_WALLET_BY_ID(id), data, { requiresAuth: true });

  const toggleSystemWallet = (id) =>
    api.patch(ADMIN_ENDPOINTS.SYSTEM_WALLET_TOGGLE(id), {}, { requiresAuth: true });

  const deleteSystemWallet = (id) =>
    api.delete(ADMIN_ENDPOINTS.SYSTEM_WALLET_BY_ID(id), { requiresAuth: true });

  const seedSystemWallets = () =>
    api.post(ADMIN_ENDPOINTS.SYSTEM_WALLET_SEED, {}, { requiresAuth: true });

  // ─────────────────────────────────────────────────────────
  // PLANS
  // ─────────────────────────────────────────────────────────
  const getAllPlans = () =>
    api.get(ADMIN_ENDPOINTS.PLANS, { requiresAuth: true });

  const createPlan = (data) =>
    api.post(ADMIN_ENDPOINTS.PLANS, data, { requiresAuth: true });

  const updatePlan = (id, data) =>
    api.put(ADMIN_ENDPOINTS.PLAN_BY_ID(id), data, { requiresAuth: true });

  const togglePlan = (id) =>
    api.patch(ADMIN_ENDPOINTS.PLAN_TOGGLE(id), {}, { requiresAuth: true });

  const deletePlan = (id) =>
    api.delete(ADMIN_ENDPOINTS.PLAN_BY_ID(id), { requiresAuth: true });

  const seedPlans = () =>
    api.post(ADMIN_ENDPOINTS.PLAN_SEED, {}, { requiresAuth: true });

  // ─────────────────────────────────────────────────────────
  // INVESTMENTS
  // ─────────────────────────────────────────────────────────
  const getAllInvestments = (params = {}) =>
    api.get(ADMIN_ENDPOINTS.INVESTMENTS, { requiresAuth: true, query: params });

  const getInvestmentStats = () =>
    api.get(ADMIN_ENDPOINTS.INVESTMENT_STATS, { requiresAuth: true });

  const getInvestmentEarnings = (id) =>
    api.get(ADMIN_ENDPOINTS.INVESTMENT_EARNINGS(id), { requiresAuth: true });

  const runInvestmentPayouts = () =>
    api.post(ADMIN_ENDPOINTS.INVESTMENT_RUN_PAYOUTS, {}, { requiresAuth: true });

  // ─────────────────────────────────────────────────────────
  // TRANSACTIONS
  // ─────────────────────────────────────────────────────────
  const getAllTransactions = (params = {}) =>
    api.get(ADMIN_ENDPOINTS.TRANSACTIONS, { requiresAuth: true, query: params });

  const getTransactionStats = (params = {}) =>
    api.get(ADMIN_ENDPOINTS.TRANSACTION_STATS, { requiresAuth: true, query: params });

  const getDailyVolume = (params = {}) =>
    api.get(ADMIN_ENDPOINTS.TRANSACTION_DAILY_VOLUME, { requiresAuth: true, query: params });

  const getUserTransactions = (userId, params = {}) =>
    api.get(ADMIN_ENDPOINTS.TRANSACTION_BY_USER(userId), { requiresAuth: true, query: params });

  // ─────────────────────────────────────────────────────────
  // REFERRALS
  // ─────────────────────────────────────────────────────────
  const getAllReferrals = (params = {}) =>
    api.get(ADMIN_ENDPOINTS.REFERRALS, { requiresAuth: true, query: params });

  const getReferralStats = () =>
    api.get(ADMIN_ENDPOINTS.REFERRAL_STATS, { requiresAuth: true });

  const getUserReferrals = (userId) =>
    api.get(ADMIN_ENDPOINTS.REFERRAL_BY_USER(userId), { requiresAuth: true });

  const manualCreditReferral = (data) =>
    api.post(ADMIN_ENDPOINTS.REFERRAL_MANUAL_CREDIT, data, { requiresAuth: true });

  const backfillReferrals = () =>
    api.post(ADMIN_ENDPOINTS.REFERRAL_BACKFILL, {}, { requiresAuth: true });

  return {
    // Users
    getAllUsers,
    getUserStats,
    getUserById,
    updateUser,
    setBanStatus,

    // KYC
    getAllKyc,
    getKycStats,
    getKycHistory,
    getKycByUser,
    approveKyc,
    rejectKyc,
    requestKycResubmission,
    bulkApproveKyc,
    bulkRejectKyc,

    // Deposits
    getAllDeposits,
    getDepositStats,
    getDepositById,
    approveDeposit,
    rejectDeposit,

    // Withdrawals
    getAllWithdrawals,
    getWithdrawalStats,
    getWithdrawalById,
    approveWithdrawal,
    processWithdrawal,
    completeWithdrawal,
    rejectWithdrawal,

    // System Wallets
    getSystemWallets,
    getSystemWalletById,
    createSystemWallet,
    updateSystemWallet,
    toggleSystemWallet,
    deleteSystemWallet,
    seedSystemWallets,

    // Plans
    getAllPlans,
    createPlan,
    updatePlan,
    togglePlan,
    deletePlan,
    seedPlans,

    // Investments
    getAllInvestments,
    getInvestmentStats,
    getInvestmentEarnings,
    runInvestmentPayouts,

    // Transactions
    getAllTransactions,
    getTransactionStats,
    getDailyVolume,
    getUserTransactions,

    // Referrals
    getAllReferrals,
    getReferralStats,
    getUserReferrals,
    manualCreditReferral,
    backfillReferrals,
  };
};