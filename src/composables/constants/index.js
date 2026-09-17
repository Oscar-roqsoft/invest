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
  SYSTEM_WALLETS:      '/wallet/system-wallets',
  SYSTEM_WALLET_BY_ID: (id) => `/wallet/system-wallets/${id}`,
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
// ADMIN — INVESTMENT PLANS + INVESTMENTS
// ─────────────────────────────────────────────────────────────
export const ADMIN_INVESTMENT_ENDPOINTS = {
  // Plans
  PLANS:              '/admin/plans',
  PLAN_SEED:          '/admin/plans/seed-defaults',
  PLAN_BY_ID:         (id) => `/admin/plans/${id}`,
  PLAN_TOGGLE:        (id) => `/admin/plans/${id}/toggle`,

  // Investments
  INVESTMENTS:        '/admin/investments',
  INVESTMENT_STATS:   '/admin/investments/stats',
  RUN_PAYOUTS:        '/admin/investments/run-payouts',
  INVESTMENT_EARNINGS:(id) => `/admin/investments/${id}/earnings`,
};

// Icons and colors the plan form suggests (backend accepts anything)
export const PLAN_ICON_OPTIONS = [
  { value: 'bi bi-rocket',            label: 'Rocket (Starter)' },
  { value: 'bi bi-graph-up-arrow',    label: 'Chart up (Growth)' },
  { value: 'bi bi-gem',               label: 'Gem (Premium)' },
  { value: 'bi bi-crown-fill',        label: 'Crown (Elite)' },
  { value: 'bi bi-lightning-charge-fill', label: 'Lightning' },
  { value: 'bi bi-shield-check',      label: 'Shield' },
  { value: 'bi bi-star-fill',         label: 'Star' },
  { value: 'bi bi-fire',              label: 'Fire' },
  { value: 'bi bi-award-fill',        label: 'Award' },
  { value: 'bi bi-diamond-fill',      label: 'Diamond' },
];

export const PLAN_COLOR_OPTIONS = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#bb914a', label: 'Gold' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ef4444', label: 'Red' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#ec4899', label: 'Pink' },
];


// ─────────────────────────────────────────────────────────────
// ADMIN — SYSTEM WALLETS
// ─────────────────────────────────────────────────────────────
export const ADMIN_WALLET_ENDPOINTS = {
  LIST:           '/admin/system-wallets',
  SEED:           '/admin/system-wallets/seed-defaults',
  BY_ID:          (id) => `/admin/system-wallets/${id}`,
  TOGGLE:         (id) => `/admin/system-wallets/${id}/toggle`,
};

// The 12 currencies the backend model allows
export const SUPPORTED_CURRENCIES = [
  { value: 'BTC',   name: 'Bitcoin',        emoji: '₿', color: '#F7931A', defaultNetwork: 'Bitcoin' },
  { value: 'ETH',   name: 'Ethereum',       emoji: 'Ξ', color: '#627EEA', defaultNetwork: 'ERC20' },
  { value: 'USDT',  name: 'Tether USD',     emoji: '₮', color: '#26A17B', defaultNetwork: 'TRC20' },
  { value: 'USDC',  name: 'USD Coin',       emoji: '$', color: '#2775CA', defaultNetwork: 'ERC20' },
  { value: 'BNB',   name: 'Binance Coin',   emoji: '⬢', color: '#F3BA2F', defaultNetwork: 'BEP20' },
  { value: 'SOL',   name: 'Solana',         emoji: '◎', color: '#14F195', defaultNetwork: 'Solana' },
  { value: 'XRP',   name: 'Ripple',         emoji: '✕', color: '#23292F', defaultNetwork: 'XRP Ledger' },
  { value: 'ADA',   name: 'Cardano',        emoji: '₳', color: '#0033AD', defaultNetwork: 'Cardano' },
  { value: 'DOGE',  name: 'Dogecoin',       emoji: 'Ð', color: '#C2A633', defaultNetwork: 'Dogecoin' },
  { value: 'TRX',   name: 'TRON',           emoji: '⚡', color: '#EF0027', defaultNetwork: 'TRC20' },
  { value: 'MATIC', name: 'Polygon',        emoji: '⬟', color: '#8247E5', defaultNetwork: 'Polygon' },
  { value: 'LTC',   name: 'Litecoin',       emoji: 'Ł', color: '#BFBBBB', defaultNetwork: 'Litecoin' },
];

// Suggested networks per currency (admin can free-type others)
export const NETWORK_SUGGESTIONS = {
  BTC:   ['Bitcoin', 'Lightning'],
  ETH:   ['ERC20', 'Arbitrum', 'Optimism', 'Base'],
  USDT:  ['TRC20', 'ERC20', 'BEP20', 'Polygon', 'Solana'],
  USDC:  ['ERC20', 'Polygon', 'Solana', 'BEP20', 'Base'],
  BNB:   ['BEP20', 'BEP2'],
  SOL:   ['Solana'],
  XRP:   ['XRP Ledger'],
  ADA:   ['Cardano'],
  DOGE:  ['Dogecoin'],
  TRX:   ['TRC20'],
  MATIC: ['Polygon', 'ERC20'],
  LTC:   ['Litecoin'],
};


// ─────────────────────────────────────────────────────────────
// ADMIN — WITHDRAWALS
// ─────────────────────────────────────────────────────────────
export const ADMIN_WITHDRAWAL_ENDPOINTS = {
  LIST:           '/admin/withdrawals',
  STATS:          '/admin/withdrawals/stats',
  BY_ID:          (id) => `/admin/withdrawals/${id}`,
  APPROVE:        (id) => `/admin/withdrawals/${id}/approve`,
  PROCESS:        (id) => `/admin/withdrawals/${id}/process`,
  COMPLETE:       (id) => `/admin/withdrawals/${id}/complete`,
  REJECT:         (id) => `/admin/withdrawals/${id}/reject`,
};

/**
 * Which actions are allowed in which status.
 * Mirrors the backend guards exactly.
 */
export const WITHDRAWAL_TRANSITIONS = {
  pending:    { approve: true,  process: false, complete: false, reject: true  },
  approved:   { approve: false, process: true,  complete: true,  reject: true  },
  processing: { approve: false, process: false, complete: true,  reject: true  },
  completed:  { approve: false, process: false, complete: false, reject: false },
  rejected:   { approve: false, process: false, complete: false, reject: false },
  cancelled:  { approve: false, process: false, complete: false, reject: false },
};

/** Extra meta for the admin badge */
export const WITHDRAWAL_ADMIN_STATUS_META = {
  pending:    { label: 'Pending',    dot: 'bg-amber-500',   cls: 'bg-amber-50 text-amber-600 dark:bg-amber-500/[0.08] dark:text-amber-400',   icon: 'bi bi-clock' },
  approved:   { label: 'Approved',   dot: 'bg-blue-500',    cls: 'bg-blue-50 text-blue-600 dark:bg-blue-500/[0.08] dark:text-blue-400',         icon: 'bi bi-shield-check' },
  processing: { label: 'Processing', dot: 'bg-indigo-500',  cls: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/[0.08] dark:text-indigo-400', icon: 'bi bi-arrow-repeat' },
  completed:  { label: 'Completed',  dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400', icon: 'bi bi-check-circle' },
  rejected:   { label: 'Rejected',   dot: 'bg-red-500',     cls: 'bg-red-50 text-red-600 dark:bg-red-500/[0.08] dark:text-red-400',           icon: 'bi bi-x-circle' },
  cancelled:  { label: 'Cancelled',  dot: 'bg-gray-400',    cls: 'bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-white/50',         icon: 'bi bi-slash-circle' },
};

export const ADMIN_WITHDRAWAL_FILTERS = [
  { value: 'all',        label: 'All' },
  { value: 'pending',    label: 'Pending' },
  { value: 'approved',   label: 'Approved' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed',  label: 'Completed' },
  { value: 'rejected',   label: 'Rejected' },
  { value: 'cancelled',  label: 'Cancelled' },
];


// ─────────────────────────────────────────────────────────────
// ADMIN — DEPOSITS
// ─────────────────────────────────────────────────────────────
export const ADMIN_DEPOSIT_ENDPOINTS = {
  LIST:    '/admin/deposits',
  STATS:   '/admin/deposits/stats',
  BY_ID:   (id) => `/admin/deposits/${id}`,
  APPROVE: (id) => `/admin/deposits/${id}/approve`,
  REJECT:  (id) => `/admin/deposits/${id}/reject`,
};

/** Which actions are allowed in which deposit status */
export const DEPOSIT_TRANSITIONS = {
  pending:    { approve: true,  reject: true  },
  confirming: { approve: true,  reject: true  },
  completed:  { approve: false, reject: false },
  failed:     { approve: false, reject: false },
  expired:    { approve: false, reject: false },
};

export const DEPOSIT_ADMIN_STATUS_META = {
  pending:    { label: 'Pending',    dot: 'bg-amber-500',   cls: 'bg-amber-50 text-amber-600 dark:bg-amber-500/[0.08] dark:text-amber-400',   icon: 'bi bi-clock' },
  confirming: { label: 'Confirming', dot: 'bg-blue-500',    cls: 'bg-blue-50 text-blue-600 dark:bg-blue-500/[0.08] dark:text-blue-400',         icon: 'bi bi-arrow-repeat' },
  completed:  { label: 'Completed',  dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400', icon: 'bi bi-check-circle' },
  failed:     { label: 'Failed',     dot: 'bg-red-500',     cls: 'bg-red-50 text-red-600 dark:bg-red-500/[0.08] dark:text-red-400',           icon: 'bi bi-x-circle' },
  expired:    { label: 'Expired',    dot: 'bg-gray-400',    cls: 'bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-white/50',         icon: 'bi bi-slash-circle' },
};

export const ADMIN_DEPOSIT_FILTERS = [
  { value: 'all',        label: 'All' },
  { value: 'pending',    label: 'Pending' },
  { value: 'confirming', label: 'Confirming' },
  { value: 'completed',  label: 'Completed' },
  { value: 'failed',     label: 'Failed' },
  { value: 'expired',    label: 'Expired' },
];

// Placeholder the seed uses; warn on if admin accidentally activates it
export const PLACEHOLDER_ADDRESS = 'REPLACE_WITH_REAL_ADDRESS';



// ─────────────────────────────────────────────────────────────
// ADMIN — REFERRALS
// ─────────────────────────────────────────────────────────────
export const ADMIN_REFERRAL_ENDPOINTS = {
  LIST:               '/admin/referrals',
  STATS:              '/admin/referrals/stats',
  USER_REFERRALS:     (userId) => `/admin/referrals/user/${userId}`,
  MANUAL_CREDIT:      '/admin/referrals/manual-credit',
  BACKFILL:           '/admin/referrals/backfill',
};

export const REFERRAL_ADMIN_STATUS_META = {
  pending:   { label: 'Pending',   dot: 'bg-amber-500',   cls: 'bg-amber-50 text-amber-600 dark:bg-amber-500/[0.08] dark:text-amber-400' },
  credited:  { label: 'Credited',  dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400' },
  cancelled: { label: 'Cancelled', dot: 'bg-gray-400',    cls: 'bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-white/50' },
  failed:    { label: 'Failed',    dot: 'bg-red-500',     cls: 'bg-red-50 text-red-600 dark:bg-red-500/[0.08] dark:text-red-400' },
};

export const ADMIN_REFERRAL_FILTERS = [
  { value: 'all',       label: 'All' },
  { value: 'credited',  label: 'Credited' },
  { value: 'pending',   label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const ADMIN_REFERRAL_SORT = [
  { value: 'newest',      label: 'Newest first' },
  { value: 'oldest',      label: 'Oldest first' },
  { value: 'amount_high', label: 'Commission: High → Low' },
  { value: 'amount_low',  label: 'Commission: Low → High' },
];

// composables/constants/index.js

// ─────────────────────────────────────────────────────────────
// ADMIN — USERS
// ─────────────────────────────────────────────────────────────
export const ADMIN_USER_ENDPOINTS = {
  LIST:       '/admin/users',
  STATS:      '/admin/users/stats',
  BY_ID:      (id) => `/admin/users/${id}`,
  BAN:        (id) => `/admin/users/${id}/ban`,
};

export const ADMIN_USER_FILTERS = {
  roles: [
    { value: 'all',   label: 'All Roles' },
    { value: 'user',  label: 'User' },
    { value: 'admin', label: 'Admin' },
  ],
  kycStatuses: [
    { value: 'all',             label: 'All KYC' },
    { value: 'not_started',     label: 'Not Started' },
    { value: 'pending',         label: 'Pending' },
    { value: 'approved',        label: 'Approved' },
    { value: 'rejected',        label: 'Rejected' },
  ],
  banned: [
    { value: 'all',   label: 'All' },
    { value: 'false', label: 'Active only' },
    { value: 'true',  label: 'Banned only' },
  ],
  verified: [
    { value: 'all',   label: 'All' },
    { value: 'true',  label: 'Verified only' },
    { value: 'false', label: 'Unverified only' },
  ],
  sorts: [
    { value: 'newest',  label: 'Newest first' },
    { value: 'oldest',  label: 'Oldest first' },
    { value: 'name',    label: 'Name A→Z' },
    { value: 'balance', label: 'Balance: High → Low' },
  ],
};

export const USER_KYC_STATUS_META = {
  not_started: { label: 'Not Started', dot: 'bg-gray-400',    cls: 'bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-white/50' },
  pending:     { label: 'Pending',     dot: 'bg-amber-500',   cls: 'bg-amber-50 text-amber-600 dark:bg-amber-500/[0.08] dark:text-amber-400' },
  approved:    { label: 'Approved',    dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400' },
  rejected:    { label: 'Rejected',    dot: 'bg-red-500',     cls: 'bg-red-50 text-red-600 dark:bg-red-500/[0.08] dark:text-red-400' },
};


// ─────────────────────────────────────────────────────────────
// VIRTUAL CARDS
// ─────────────────────────────────────────────────────────────
export const CARD_ENDPOINTS = {
  ELIGIBILITY: '/card/eligibility',
  MY:          '/card/my',
  GENERATE:    '/card/generate',
  BY_ID:       (id) => `/card/${id}`,
  FREEZE:      (id) => `/card/${id}/freeze`,
  DELETE:      (id) => `/card/${id}`,
};

export const ADMIN_CARD_ENDPOINTS = {
  LIST:        '/admin/cards',
  STATS:       '/admin/cards/stats',
  GENERATE:    '/admin/cards/generate',
  BY_ID:       (id) => `/admin/cards/${id}`,
  FREEZE:      (id) => `/admin/cards/${id}/freeze`,
  DELETE:      (id) => `/admin/cards/${id}`,
};

/** One entry per tier — used by UI for labels, colors, gradients */
export const CARD_TIERS = [
  {
    value: 'gold',
    name: 'Gold Card',
    tagline: 'Standard virtual card',
    minBalance: 5000,
    gradient: 'linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%)',
    textColor: '#020862',
    accentColor: '#E6BB5C',
    ringClass: 'ring-amber-500/40',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    icon: 'bi bi-credit-card-2-front-fill',
    perks: [
      'Virtual USD card',
      'Instant issuance',
      'Freeze / unfreeze anytime',
      'Display-only — no spending',
    ],
  },
  {
    value: 'black',
    name: 'Black Card',
    tagline: 'Premium virtual card',
    minBalance: 5000,   // same gate as gold in our spec
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #000000 100%)',
    textColor: '#F5D77F',
    accentColor: '#F5D77F',
    ringClass: 'ring-neutral-700',
    badgeClass: 'bg-neutral-800 text-amber-400 border-neutral-700',
    icon: 'bi bi-credit-card-2-back-fill',
    perks: [
      'Premium virtual USD card',
      'Instant issuance',
      'Freeze / unfreeze anytime',
      'Display-only — no spending',
    ],
  },
];

export const CARD_STATUS_META = {
  active:    { label: 'Active',    dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400' },
  frozen:    { label: 'Frozen',    dot: 'bg-blue-500',    cls: 'bg-blue-50 text-blue-600 dark:bg-blue-500/[0.08] dark:text-blue-400' },
  expired:   { label: 'Expired',   dot: 'bg-gray-400',    cls: 'bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-white/50' },
  cancelled: { label: 'Cancelled', dot: 'bg-red-500',     cls: 'bg-red-50 text-red-600 dark:bg-red-500/[0.08] dark:text-red-400' },
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