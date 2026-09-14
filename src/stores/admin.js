// stores/admin.js
import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', () => {
  const requests = useAdminRequests();

  // ─────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────
  const state = reactive({
    // Users
    users: [],
    userStats: null,
    currentUser: null,

    // KYC
    kycSubmissions: [],
    kycStats: null,
    kycHistory: [],
    currentKyc: null,

    // Deposits
    deposits: [],
    depositStats: null,
    currentDeposit: null,

    // Withdrawals
    withdrawals: [],
    withdrawalStats: null,
    currentWithdrawal: null,

    // System Wallets
    systemWallets: [],

    // Plans
    plans: [],

    // Investments
    investments: [],
    investmentStats: null,

    // Transactions
    transactions: [],
    transactionStats: null,
    dailyVolume: [],

    // Referrals
    referrals: [],
    referralStats: null,

    // UI State
    isLoading: false,
    isSubmitting: false,
    error: null,

    // Pagination (shared per resource)
    pagination: {
      users: { page: 1, limit: 20, total: 0, pages: 0 },
      kyc: { page: 1, limit: 20, total: 0, pages: 0 },
      deposits: { page: 1, limit: 20, total: 0, pages: 0 },
      withdrawals: { page: 1, limit: 20, total: 0, pages: 0 },
      investments: { page: 1, limit: 20, total: 0, pages: 0 },
      transactions: { page: 1, limit: 30, total: 0, pages: 0 },
      referrals: { page: 1, limit: 30, total: 0, pages: 0 },
    },
  });

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────
  const setLoading = (val) => { state.isLoading = val; };
  const setSubmitting = (val) => { state.isSubmitting = val; };
  const setError = (msg) => { state.error = msg; };
  const clearError = () => { state.error = null; };

  const updatePagination = (key, pagination) => {
    if (pagination && state.pagination[key]) {
      state.pagination[key] = { ...state.pagination[key], ...pagination };
    }
  };

  const handleResponse = (key, res, dataKey) => {
    if (res.success && res.data) {
      if (Array.isArray(res.data[dataKey])) {
        state[key] = res.data[dataKey];
      }
      updatePagination(key, res.data.pagination);
      return { success: true, data: res.data };
    }
    return { success: false, message: res.message };
  };

  // ─────────────────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────────────────
  const fetchUsers = async (params = {}) => {
    setLoading(true);
    clearError();
    try {
      const res = await requests.getAllUsers(params);
      return handleResponse('users', res, 'users');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const res = await requests.getUserStats();
      if (res.success) state.userStats = res.data;
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const fetchUserById = async (id) => {
    setLoading(true);
    try {
      const res = await requests.getUserById(id);
      if (res.success && res.data?.user) {
        state.currentUser = res.data.user;
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, data) => {
    setSubmitting(true);
    try {
      const res = await requests.updateUser(id, data);
      if (res.success && res.data?.user) {
        // Update local list
        const idx = state.users.findIndex((u) => u._id === id);
        if (idx !== -1) state.users[idx] = res.data.user;
        if (state.currentUser?._id === id) state.currentUser = res.data.user;
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const banUser = async (id, data) => {
    setSubmitting(true);
    try {
      const res = await requests.setBanStatus(id, data);
      if (res.success) {
        const idx = state.users.findIndex((u) => u._id === id);
        if (idx !== -1) {
          state.users[idx].isBanned = res.data.user.isBanned;
        }
        if (state.currentUser?._id === id) {
          state.currentUser.isBanned = res.data.user.isBanned;
        }
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // KYC
  // ─────────────────────────────────────────────────────────
  const fetchKycSubmissions = async (params = {}) => {
    setLoading(true);
    clearError();
    try {
      const res = await requests.getAllKyc(params);
      return handleResponse('kycSubmissions', res, 'submissions');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchKycStats = async () => {
    try {
      const res = await requests.getKycStats();
      if (res.success) state.kycStats = res.data;
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const fetchKycHistory = async (params = {}) => {
    try {
      const res = await requests.getKycHistory(params);
      if (res.success) state.kycHistory = res.data.records || [];
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const fetchKycByUser = async (userId) => {
    try {
      const res = await requests.getKycByUser(userId);
      if (res.success) state.currentKyc = res.data.user;
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const approveKyc = async (userId, data = {}) => {
    setSubmitting(true);
    try {
      const res = await requests.approveKyc(userId, data);
      if (res.success) {
        // Remove from pending list
        state.kycSubmissions = state.kycSubmissions.filter((k) => k._id !== userId);
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const rejectKyc = async (userId, rejectionReason) => {
    setSubmitting(true);
    try {
      const res = await requests.rejectKyc(userId, { rejectionReason });
      if (res.success) {
        state.kycSubmissions = state.kycSubmissions.filter((k) => k._id !== userId);
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const requestKycResubmission = async (userId, reason) => {
    setSubmitting(true);
    try {
      const res = await requests.requestKycResubmission(userId, { reason });
      if (res.success) {
        state.kycSubmissions = state.kycSubmissions.filter((k) => k._id !== userId);
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const bulkApproveKyc = async (userIds) => {
    setSubmitting(true);
    try {
      const res = await requests.bulkApproveKyc(userIds);
      if (res.success) {
        state.kycSubmissions = state.kycSubmissions.filter((k) => !userIds.includes(k._id));
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const bulkRejectKyc = async (userIds, rejectionReason) => {
    setSubmitting(true);
    try {
      const res = await requests.bulkRejectKyc(userIds, rejectionReason);
      if (res.success) {
        state.kycSubmissions = state.kycSubmissions.filter((k) => !userIds.includes(k._id));
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // DEPOSITS
  // ─────────────────────────────────────────────────────────
  const fetchDeposits = async (params = {}) => {
    setLoading(true);
    clearError();
    try {
      const res = await requests.getAllDeposits(params);
      return handleResponse('deposits', res, 'deposits');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchDepositStats = async () => {
    try {
      const res = await requests.getDepositStats();
      if (res.success) state.depositStats = res.data;
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const approveDeposit = async (id, note = '') => {
    setSubmitting(true);
    try {
      const res = await requests.approveDeposit(id, { note });
      if (res.success) {
        // Update local deposit
        const idx = state.deposits.findIndex((d) => d._id === id);
        if (idx !== -1) state.deposits[idx].status = 'completed';
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const rejectDeposit = async (id, reason) => {
    setSubmitting(true);
    try {
      const res = await requests.rejectDeposit(id, { reason });
      if (res.success) {
        const idx = state.deposits.findIndex((d) => d._id === id);
        if (idx !== -1) state.deposits[idx].status = 'failed';
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // WITHDRAWALS
  // ─────────────────────────────────────────────────────────
  const fetchWithdrawals = async (params = {}) => {
    setLoading(true);
    clearError();
    try {
      const res = await requests.getAllWithdrawals(params);
      return handleResponse('withdrawals', res, 'withdrawals');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawalStats = async () => {
    try {
      const res = await requests.getWithdrawalStats();
      if (res.success) state.withdrawalStats = res.data;
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const approveWithdrawal = async (id, note = '') => {
    setSubmitting(true);
    try {
      const res = await requests.approveWithdrawal(id, { note });
      if (res.success) updateWithdrawalLocal(id, 'approved');
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const processWithdrawal = async (id, txHash = '', note = '') => {
    setSubmitting(true);
    try {
      const res = await requests.processWithdrawal(id, { txHash, note });
      if (res.success) updateWithdrawalLocal(id, 'processing');
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const completeWithdrawal = async (id, txHash = '', note = '') => {
    setSubmitting(true);
    try {
      const res = await requests.completeWithdrawal(id, { txHash, note });
      if (res.success) updateWithdrawalLocal(id, 'completed');
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const rejectWithdrawal = async (id, reason) => {
    setSubmitting(true);
    try {
      const res = await requests.rejectWithdrawal(id, { reason });
      if (res.success) updateWithdrawalLocal(id, 'rejected');
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const updateWithdrawalLocal = (id, status) => {
    const idx = state.withdrawals.findIndex((w) => w._id === id);
    if (idx !== -1) state.withdrawals[idx].status = status;
  };

  // ─────────────────────────────────────────────────────────
  // SYSTEM WALLETS
  // ─────────────────────────────────────────────────────────
  const fetchSystemWallets = async (params = {}) => {
    setLoading(true);
    try {
      const res = await requests.getSystemWallets(params);
      if (res.success) state.systemWallets = res.data.wallets || [];
      return res;
    } finally {
      setLoading(false);
    }
  };

  const createSystemWallet = async (data) => {
    setSubmitting(true);
    try {
      const res = await requests.createSystemWallet(data);
      if (res.success) state.systemWallets.push(res.data.wallet);
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const updateSystemWallet = async (id, data) => {
    setSubmitting(true);
    try {
      const res = await requests.updateSystemWallet(id, data);
      if (res.success) {
        const idx = state.systemWallets.findIndex((w) => w._id === id);
        if (idx !== -1) state.systemWallets[idx] = res.data.wallet;
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSystemWallet = async (id) => {
    try {
      const res = await requests.toggleSystemWallet(id);
      if (res.success) {
        const idx = state.systemWallets.findIndex((w) => w._id === id);
        if (idx !== -1) state.systemWallets[idx] = res.data.wallet;
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteSystemWallet = async (id) => {
    try {
      const res = await requests.deleteSystemWallet(id);
      if (res.success) {
        state.systemWallets = state.systemWallets.filter((w) => w._id !== id);
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const seedSystemWallets = async () => {
    setSubmitting(true);
    try {
      const res = await requests.seedSystemWallets();
      if (res.success) {
        await fetchSystemWallets();
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // PLANS
  // ─────────────────────────────────────────────────────────
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await requests.getAllPlans();
      if (res.success) state.plans = res.data.plans || [];
      return res;
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (data) => {
    setSubmitting(true);
    try {
      const res = await requests.createPlan(data);
      if (res.success) state.plans.push(res.data.plan);
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const updatePlan = async (id, data) => {
    setSubmitting(true);
    try {
      const res = await requests.updatePlan(id, data);
      if (res.success) {
        const idx = state.plans.findIndex((p) => p._id === id);
        if (idx !== -1) state.plans[idx] = res.data.plan;
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const togglePlan = async (id) => {
    try {
      const res = await requests.togglePlan(id);
      if (res.success) {
        const idx = state.plans.findIndex((p) => p._id === id);
        if (idx !== -1) state.plans[idx] = res.data.plan;
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deletePlan = async (id) => {
    try {
      const res = await requests.deletePlan(id);
      if (res.success) {
        state.plans = state.plans.filter((p) => p._id !== id);
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const seedPlans = async () => {
    setSubmitting(true);
    try {
      const res = await requests.seedPlans();
      if (res.success) await fetchPlans();
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // INVESTMENTS
  // ─────────────────────────────────────────────────────────
  const fetchInvestments = async (params = {}) => {
    setLoading(true);
    try {
      const res = await requests.getAllInvestments(params);
      return handleResponse('investments', res, 'investments');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestmentStats = async () => {
    try {
      const res = await requests.getInvestmentStats();
      if (res.success) state.investmentStats = res.data;
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const runInvestmentPayouts = async () => {
    setSubmitting(true);
    try {
      return await requests.runInvestmentPayouts();
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // TRANSACTIONS
  // ─────────────────────────────────────────────────────────
  const fetchTransactions = async (params = {}) => {
    setLoading(true);
    try {
      const res = await requests.getAllTransactions(params);
      return handleResponse('transactions', res, 'transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionStats = async (params = {}) => {
    try {
      const res = await requests.getTransactionStats(params);
      if (res.success) state.transactionStats = res.data;
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const fetchDailyVolume = async (params = {}) => {
    try {
      const res = await requests.getDailyVolume(params);
      if (res.success) state.dailyVolume = res.data.volume || [];
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ─────────────────────────────────────────────────────────
  // REFERRALS
  // ─────────────────────────────────────────────────────────
  const fetchReferrals = async (params = {}) => {
    setLoading(true);
    try {
      const res = await requests.getAllReferrals(params);
      return handleResponse('referrals', res, 'referrals');
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralStats = async () => {
    try {
      const res = await requests.getReferralStats();
      if (res.success) state.referralStats = res.data;
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const manualCreditReferral = async (data) => {
    setSubmitting(true);
    try {
      return await requests.manualCreditReferral(data);
    } finally {
      setSubmitting(false);
    }
  };

  const backfillReferrals = async () => {
    setSubmitting(true);
    try {
      return await requests.backfillReferrals();
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────────────────────
  const clearAll = () => {
    state.users = [];
    state.userStats = null;
    state.currentUser = null;
    state.kycSubmissions = [];
    state.kycStats = null;
    state.kycHistory = [];
    state.currentKyc = null;
    state.deposits = [];
    state.depositStats = null;
    state.currentDeposit = null;
    state.withdrawals = [];
    state.withdrawalStats = null;
    state.currentWithdrawal = null;
    state.systemWallets = [];
    state.plans = [];
    state.investments = [];
    state.investmentStats = null;
    state.transactions = [];
    state.transactionStats = null;
    state.dailyVolume = [];
    state.referrals = [];
    state.referralStats = null;
    state.error = null;
  };

  return {
    // State
    state,

    // Helpers
    setLoading,
    setSubmitting,
    setError,
    clearError,
    clearAll,

    // Users
    fetchUsers,
    fetchUserStats,
    fetchUserById,
    updateUser,
    banUser,

    // KYC
    fetchKycSubmissions,
    fetchKycStats,
    fetchKycHistory,
    fetchKycByUser,
    approveKyc,
    rejectKyc,
    requestKycResubmission,
    bulkApproveKyc,
    bulkRejectKyc,

    // Deposits
    fetchDeposits,
    fetchDepositStats,
    approveDeposit,
    rejectDeposit,

    // Withdrawals
    fetchWithdrawals,
    fetchWithdrawalStats,
    approveWithdrawal,
    processWithdrawal,
    completeWithdrawal,
    rejectWithdrawal,

    // System Wallets
    fetchSystemWallets,
    createSystemWallet,
    updateSystemWallet,
    toggleSystemWallet,
    deleteSystemWallet,
    seedSystemWallets,

    // Plans
    fetchPlans,
    createPlan,
    updatePlan,
    togglePlan,
    deletePlan,
    seedPlans,

    // Investments
    fetchInvestments,
    fetchInvestmentStats,
    runInvestmentPayouts,

    // Transactions
    fetchTransactions,
    fetchTransactionStats,
    fetchDailyVolume,

    // Referrals
    fetchReferrals,
    fetchReferralStats,
    manualCreditReferral,
    backfillReferrals,
  };
});