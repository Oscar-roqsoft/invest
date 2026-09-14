// composables/constants/index.js



export const API_BASE_URL = 'https://invest-db.onrender.com/api/v1';
// export const API_BASE_URL = 'http://localhost:5000/api/v1';

  



// ─────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// USER (profile/security)
// ─────────────────────────────────────────────────────────────
export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  AVATAR: '/user/avatar',
  SECURITY: '/user/security',
  CHANGE_PASSWORD: '/user/change-password',
  SET_PIN: '/user/set-pin',
  CHANGE_PIN: '/user/change-pin',
  TOGGLE_2FA: '/user/toggle-2fa',
  KYC: '/user/kyc',
  DELETE_ACCOUNT: '/user/account',
};

// ─────────────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────────────
export const ADMIN_ENDPOINTS = {
  // Users
  USERS: '/admin/users',
  USER_STATS: '/admin/users/stats',
  USER_BY_ID: (id) => `/admin/users/${id}`,
  USER_BAN: (id) => `/admin/users/${id}/ban`,

  // KYC
  KYC: '/admin/kyc',
  KYC_STATS: '/admin/kyc/stats',
  KYC_HISTORY: '/admin/kyc/history',
  KYC_BY_USER: (userId) => `/admin/kyc/${userId}`,
  KYC_APPROVE: (userId) => `/admin/kyc/${userId}/approve`,
  KYC_REJECT: (userId) => `/admin/kyc/${userId}/reject`,
  KYC_REQUEST_RESUBMISSION: (userId) => `/admin/kyc/${userId}/request-resubmission`,
  KYC_BULK_APPROVE: '/admin/kyc/bulk-approve',
  KYC_BULK_REJECT: '/admin/kyc/bulk-reject',

  // Deposits
  DEPOSITS: '/admin/deposits',
  DEPOSIT_STATS: '/admin/deposits/stats',
  DEPOSIT_BY_ID: (id) => `/admin/deposits/${id}`,
  DEPOSIT_APPROVE: (id) => `/admin/deposits/${id}/approve`,
  DEPOSIT_REJECT: (id) => `/admin/deposits/${id}/reject`,

  // Withdrawals
  WITHDRAWALS: '/admin/withdrawals',
  WITHDRAWAL_STATS: '/admin/withdrawals/stats',
  WITHDRAWAL_BY_ID: (id) => `/admin/withdrawals/${id}`,
  WITHDRAWAL_APPROVE: (id) => `/admin/withdrawals/${id}/approve`,
  WITHDRAWAL_PROCESS: (id) => `/admin/withdrawals/${id}/process`,
  WITHDRAWAL_COMPLETE: (id) => `/admin/withdrawals/${id}/complete`,
  WITHDRAWAL_REJECT: (id) => `/admin/withdrawals/${id}/reject`,

  // System Wallets
  SYSTEM_WALLETS: '/admin/system-wallets',
  SYSTEM_WALLET_BY_ID: (id) => `/admin/system-wallets/${id}`,
  SYSTEM_WALLET_TOGGLE: (id) => `/admin/system-wallets/${id}/toggle`,
  SYSTEM_WALLET_SEED: '/admin/system-wallets/seed-defaults',

  // Plans
  PLANS: '/admin/plans',
  PLAN_BY_ID: (id) => `/admin/plans/${id}`,
  PLAN_TOGGLE: (id) => `/admin/plans/${id}/toggle`,
  PLAN_SEED: '/admin/plans/seed-defaults',

  // Investments
  INVESTMENTS: '/admin/investments',
  INVESTMENT_STATS: '/admin/investments/stats',
  INVESTMENT_EARNINGS: (id) => `/admin/investments/${id}/earnings`,
  INVESTMENT_RUN_PAYOUTS: '/admin/investments/run-payouts',

  // Transactions
  TRANSACTIONS: '/admin/transactions',
  TRANSACTION_STATS: '/admin/transactions/stats',
  TRANSACTION_DAILY_VOLUME: '/admin/transactions/daily-volume',
  TRANSACTION_BY_USER: (userId) => `/admin/transactions/user/${userId}`,

  // Referrals
  REFERRALS: '/admin/referrals',
  REFERRAL_STATS: '/admin/referrals/stats',
  REFERRAL_BY_USER: (userId) => `/admin/referrals/user/${userId}`,
  REFERRAL_MANUAL_CREDIT: '/admin/referrals/manual-credit',
  REFERRAL_BACKFILL: '/admin/referrals/backfill',
};

export const REFERRAL_ENDPOINTS = {
  INFO: '/referral/info',
  MY: '/referral/my',
  STATS: '/referral/stats',
  EARNINGS: '/referral/earnings',
  TREE: '/referral/tree',
  LEADERBOARD: '/referral/leaderboard',
  MONTHLY_EARNINGS: '/referral/monthly-earnings',
  VALIDATE: (code) => `/referral/validate/${code}`,
};

// ─────────────────────────────────────────────────────────────
// WALLET
// ─────────────────────────────────────────────────────────────
export const WALLET_ENDPOINTS = {
  BALANCES: '/wallet/balances',
  STATS: '/wallet/stats',
  ADDRESSES: '/wallet/addresses',
  ADDRESS_BY_CURRENCY: (currency) => `/wallet/addresses/${currency}`,
  SAVED: '/wallet/saved',
  SAVED_BY_ID: (id) => `/wallet/saved/${id}`,
};

// ─────────────────────────────────────────────────────────────
// DEPOSIT
// ─────────────────────────────────────────────────────────────
export const DEPOSIT_ENDPOINTS = {
  CREATE: '/deposit/create',
  SUBMIT_TX: '/deposit/submit-tx',
  MY: '/deposit/my',
  BY_ID: (id) => `/deposit/${id}`,
  CANCEL: (id) => `/deposit/${id}/cancel`,
};

// Deposit business rules (mirror backend)
export const DEPOSIT_RULES = {
  MIN_USD: 20,
  EXPIRY_SECONDS: 30 * 60,      // 30 minutes
  POLL_INTERVAL_MS: 15_000,     // poll status every 15s
  SUPPORTED_CURRENCIES: [
    'BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'SOL',
    'XRP', 'ADA', 'DOGE', 'TRX', 'MATIC', 'LTC',
  ],
};

export const DEPOSIT_STATUS = {
  PENDING: 'pending',
  CONFIRMING: 'confirming',
  COMPLETED: 'completed',
  FAILED: 'failed',
  EXPIRED: 'expired',
};

// ─────────────────────────────────────────────────────────────
// TRANSACTION
// ─────────────────────────────────────────────────────────────
export const TRANSACTION_ENDPOINTS = {
  MY: '/transaction/my',
  BY_ID: (id) => `/transaction/${id}`,
  STATS: '/transaction/stats',
  MONTHLY_SUMMARY: '/transaction/monthly-summary',
  RECENT: '/transaction/recent',
};

export const TRANSACTION_TYPES = [
  { value: 'all',        label: 'All Types',    icon: 'bi bi-grid' },
  { value: 'deposit',    label: 'Deposit',      icon: 'bi bi-arrow-down-circle' },
  { value: 'withdrawal', label: 'Withdrawal',   icon: 'bi bi-arrow-up-circle' },
  { value: 'investment', label: 'Investment',   icon: 'bi bi-graph-up-arrow' },
  { value: 'earning',    label: 'Earning',      icon: 'bi bi-cash-coin' },
  { value: 'referral',   label: 'Referral',     icon: 'bi bi-people' },
  { value: 'refund',     label: 'Refund',       icon: 'bi bi-arrow-counterclockwise' },
  { value: 'bonus',      label: 'Bonus',        icon: 'bi bi-gift' },
];

export const TRANSACTION_DIRECTIONS = [
  { value: 'all',    label: 'All' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit',  label: 'Debit' },
];

export const TRANSACTION_STATUSES = [
  { value: 'all',        label: 'All Status' },
  { value: 'pending',    label: 'Pending' },
  { value: 'confirming', label: 'Confirming' },
  { value: 'completed',  label: 'Completed' },
  { value: 'failed',     label: 'Failed' },
  { value: 'cancelled',  label: 'Cancelled' },
];

export const TRANSACTION_SORT = [
  { value: 'newest',      label: 'Newest first' },
  { value: 'oldest',      label: 'Oldest first' },
  { value: 'amount_high', label: 'Amount: High → Low' },
  { value: 'amount_low',  label: 'Amount: Low → High' },
];

// Fallback colour/emoji meta for currencies (used across deposit + tx pages)
export const CURRENCY_META = {
  BTC:   { color: '#F7931A', emoji: '₿', name: 'Bitcoin' },
  ETH:   { color: '#627EEA', emoji: 'Ξ', name: 'Ethereum' },
  USDT:  { color: '#26A17B', emoji: '₮', name: 'Tether USD' },
  USDC:  { color: '#2775CA', emoji: '$', name: 'USD Coin' },
  BNB:   { color: '#F3BA2F', emoji: '⬢', name: 'Binance Coin' },
  SOL:   { color: '#14F195', emoji: '◎', name: 'Solana' },
  XRP:   { color: '#23292F', emoji: '✕', name: 'Ripple' },
  ADA:   { color: '#0033AD', emoji: '₳', name: 'Cardano' },
  DOGE:  { color: '#C2A633', emoji: 'Ð', name: 'Dogecoin' },
  TRX:   { color: '#EF0027', emoji: '⚡', name: 'TRON' },
  MATIC: { color: '#8247E5', emoji: '⬟', name: 'Polygon' },
  LTC:   { color: '#BFBBBB', emoji: 'Ł', name: 'Litecoin' },
  USD:   { color: '#10B981', emoji: '$', name: 'US Dollar' },
};

// ─────────────────────────────────────────────────────────────
// WITHDRAWAL
// ─────────────────────────────────────────────────────────────
export const WITHDRAWAL_ENDPOINTS = {
  CALCULATE_FEE: '/withdrawal/calculate-fee',
  CREATE: '/withdrawal/create',
  MY: '/withdrawal/my',
  BY_ID: (id) => `/withdrawal/${id}`,
  CANCEL: (id) => `/withdrawal/${id}/cancel`,
};

// Mirror of backend enums (safe defaults if API hasn't responded)
export const WITHDRAWAL_RULES = {
  MIN_USD: 30,            // MIN_WITHDRAWAL_USD fallback
  MIN_NET_USD: 10,        // MIN_NET_AMOUNT_USD fallback
  POLL_INTERVAL_MS: 30_000,
};

export const WITHDRAWAL_STATUS = {
  PENDING:    'pending',
  APPROVED:   'approved',
  PROCESSING: 'processing',
  COMPLETED:  'completed',
  REJECTED:   'rejected',
  CANCELLED:  'cancelled',
};

export const WITHDRAWAL_STATUS_META = {
  pending:    { label: 'Pending',    dot: 'bg-amber-500',   cls: 'bg-amber-50 text-amber-600 dark:bg-amber-500/[0.08] dark:text-amber-400' },
  approved:   { label: 'Approved',   dot: 'bg-blue-500',    cls: 'bg-blue-50 text-blue-600 dark:bg-blue-500/[0.08] dark:text-blue-400' },
  processing: { label: 'Processing', dot: 'bg-blue-500',    cls: 'bg-blue-50 text-blue-600 dark:bg-blue-500/[0.08] dark:text-blue-400' },
  completed:  { label: 'Completed',  dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400' },
  rejected:   { label: 'Rejected',   dot: 'bg-red-500',     cls: 'bg-red-50 text-red-600 dark:bg-red-500/[0.08] dark:text-red-400' },
  cancelled:  { label: 'Cancelled',  dot: 'bg-gray-400',    cls: 'bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-white/50' },
};


// ─────────────────────────────────────────────────────────────
// INVESTMENT
// ─────────────────────────────────────────────────────────────
export const INVESTMENT_ENDPOINTS = {
  PLANS:           '/investment/plans',
  PLAN_BY_SLUG:    (slug) => `/investment/plans/${slug}`,
  PREVIEW:         '/investment/preview',
  CREATE:          '/investment/create',
  MY:              '/investment/my',
  ACTIVE:          '/investment/active',
  STATS:           '/investment/stats',
  BY_ID:           (id) => `/investment/${id}`,
};

export const INVESTMENT_STATUS_META = {
  active:    { label: 'Active',    dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400' },
  completed: { label: 'Completed', dot: 'bg-blue-500',    cls: 'bg-blue-50 text-blue-600 dark:bg-blue-500/[0.08] dark:text-blue-400' },
  cancelled: { label: 'Cancelled', dot: 'bg-gray-400',    cls: 'bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-white/50' },
};

export const INVESTMENT_STATUSES = [
  { value: 'all',       label: 'All' },
  { value: 'active',    label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const INVESTMENT_RULES = {
  PIN_REQUIRED: true,           // flip to false if you don't want PIN on investments
  PIN_LENGTH: 4,
  PREVIEW_DEBOUNCE_MS: 400,     // when we do call the preview endpoint
};
// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────
export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'user_data';

// ─────────────────────────────────────────────────────────────
// MISC
// ─────────────────────────────────────────────────────────────
export const OTP_LENGTH = 6;
export const OTP_RESEND_TIMER = 60;