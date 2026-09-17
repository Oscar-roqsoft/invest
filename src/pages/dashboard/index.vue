<template>
  <DashboardLayout>
    <div class="dashboard-content space-y-6 mt-20">

      <!-- ═══════════════════════════════════════════════════
           MAIN BALANCE CARD
           ═══════════════════════════════════════════════════ -->
      <div
        class="rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-500 hover:shadow-2xl
               bg-white shadow-xl shadow-gray-200/50 border border-gray-100
               dark:bg-gradient-to-br dark:from-[#152155] dark:via-[#101A47] dark:to-[#0F1B4C]
               dark:border-white/[0.06] dark:shadow-2xl dark:shadow-blue-900/40"
      >
        <!-- Decorative -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl dark:hidden"></div>
          <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl dark:hidden"></div>
          <div class="hidden dark:block absolute -top-20 -right-20 w-64 h-64 bg-blue-500/[0.15] rounded-full blur-3xl"></div>
          <div class="hidden dark:block absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/[0.12] rounded-full blur-3xl"></div>
          <div class="hidden dark:block absolute inset-0 opacity-[0.02]" style="background-image: radial-gradient(circle, #F5D77F 1px, transparent 1px); background-size: 24px 24px;"></div>
        </div>

        <div class="relative z-10">
          <div class="flex flex-wrap items-start justify-between gap-6 mb-8">
            <div>
              <div class="flex items-center gap-2 mb-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center
                            bg-gold-500/10 dark:bg-amber-500/[0.12]">
                  <i class="bi bi-wallet2 text-amber-500 text-sm"></i>
                </div>
                <span class="text-sm font-medium uppercase tracking-wider
                             text-gray-500 dark:text-white/40">
                  Total Balance
                </span>
              </div>

              <!-- ░░ Loading ░░ -->
              <div v-if="balancesLoading"
                   class="h-12 w-64 rounded-lg bg-gray-200 dark:bg-white/[0.06] animate-pulse"></div>
              <div v-else class="text-4xl md:text-5xl font-bold tracking-tight transition-colors duration-500
                                 text-gray-900 dark:text-white">
                ${{ formatMoney(walletsStore.availableUSD) }}
              </div>

              <div class="mt-2 text-sm text-gray-400 dark:text-white/30">
                Available for withdrawal
              </div>
            </div>

            <!-- Mini stats -->
            <div class="flex gap-8 md:gap-12">
              <div>
                <div class="text-xs uppercase tracking-wider mb-1 text-gray-500 dark:text-white/40">
                  Earnings
                </div>
                <div v-if="statsLoading" class="h-6 w-20 rounded bg-gray-200 dark:bg-white/[0.06] animate-pulse"></div>
                <div v-else class="text-amber-500 font-bold text-xl">
                  ${{ formatMoney(walletsStore.state.stats?.totalEarnings) }}
                </div>
              </div>
              <div>
                <div class="text-xs uppercase tracking-wider mb-1 text-gray-500 dark:text-white/40">
                  Deposits
                </div>
                <div v-if="statsLoading" class="h-6 w-20 rounded bg-gray-200 dark:bg-white/[0.06] animate-pulse"></div>
                <div v-else class="font-bold text-xl text-gray-800 dark:text-white">
                  ${{ formatMoney(walletsStore.state.stats?.totalDeposits) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <NuxtLink
              to="/withdraw"
              class="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-300 border backdrop-blur-sm
                     bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200
                     dark:bg-white/[0.04] dark:text-white/90 dark:hover:bg-white/[0.08] dark:border-white/[0.06]"
            >
              <i class="bi bi-arrow-up-right"></i>
              <span>Withdraw Funds</span>
            </NuxtLink>
            <NuxtLink
              to="/deposit"
              class="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
            >
              <i class="bi bi-plus-circle"></i>
              <span>Deposit Funds</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════
           STATS CARDS
           ═══════════════════════════════════════════════════ -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <template v-if="statsLoading">
          <div
            v-for="i in 4"
            :key="i"
            class="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-white/[0.06]"></div>
              <div class="h-6 w-14 rounded-full bg-gray-100 dark:bg-white/[0.04]"></div>
            </div>
            <div class="h-3 w-24 bg-gray-100 dark:bg-white/[0.04] rounded mb-3"></div>
            <div class="h-6 w-28 bg-gray-200 dark:bg-white/[0.06] rounded"></div>
          </div>
        </template>

        <template v-else>
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="stat-card rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                   bg-white border border-gray-100 hover:border-gold-300 shadow-sm
                   dark:bg-[#101A47] dark:border-white/[0.05] dark:hover:border-blue-500/30 dark:hover:shadow-blue-900/30"
          >
            <div class="flex items-start justify-between mb-4">
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center"
                :style="{ background: stat.bgColor }"
              >
                <i :class="stat.icon" :style="{ color: stat.iconColor }" class="text-xl"></i>
              </div>
            </div>
            <p class="text-xs uppercase tracking-wider mb-2 font-medium text-gray-500 dark:text-white/40">
              {{ stat.label }}
            </p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ stat.value }}
            </p>
          </div>
        </template>
      </div>

      <!-- ═══════════════════════════════════════════════════
           CRYPTO HOLDINGS (fetched from system wallets)
           ═══════════════════════════════════════════════════ -->
      <div class="rounded-2xl overflow-hidden
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 dark:border-white/[0.06]">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                        bg-amber-500/10 dark:bg-amber-500/[0.08]">
              <i class="bi bi-coin text-amber-500 text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white">Your Crypto Holdings</h3>
              <p class="text-xs text-gray-400 dark:text-white/40">
                Balances across all supported currencies
              </p>
            </div>
          </div>
        </div>

        <!-- ░░ Loading skeleton ░░ -->
        <div
          v-if="walletListLoading"
          class="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="rounded-2xl p-4 bg-gray-50 dark:bg-white/[0.02] animate-pulse"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/[0.06]"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 dark:bg-white/[0.06] rounded w-1/2"></div>
                <div class="h-3 bg-gray-100 dark:bg-white/[0.04] rounded w-1/3"></div>
              </div>
            </div>
            <div class="h-6 bg-gray-200 dark:bg-white/[0.06] rounded w-2/3"></div>
          </div>
        </div>

        <!-- ░░ Empty ░░ -->
        <div
          v-else-if="cryptosWithBalance.length === 0"
          class="py-14 text-center px-4"
        >
          <div class="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-4">
            <i class="bi bi-coin text-2xl text-gray-300 dark:text-white/20"></i>
          </div>
          <p class="font-semibold text-gray-700 dark:text-white/70">No crypto holdings yet</p>
          <p class="text-sm text-gray-500 dark:text-white/40 mt-1 mb-5">
            Make a deposit to start holding crypto in your account
          </p>
          <NuxtLink
            to="/deposit"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm
                   transition-all hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%); color: #020862;"
          >
            <i class="bi bi-plus-circle"></i> Make a Deposit
          </NuxtLink>
        </div>

        <!-- ░░ Grid ░░ -->
        <div v-else class="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="c in cryptosWithBalance"
            :key="c.currency"
            class="rounded-2xl p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04]
                   transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl"
                :style="{ background: c.color || '#F7931A' }"
              >
                <span v-html="c.emoji || '₿'"></span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-bold text-gray-800 dark:text-white">{{ c.currency }}</p>
                <p class="text-xs text-gray-500 dark:text-white/40 truncate">{{ c.name }}</p>
              </div>
            </div>
            <div>
              <p class="text-xl font-bold text-gray-800 dark:text-white">
                {{ formatCrypto(c.balance) }}
                <span class="text-sm font-normal text-gray-500 dark:text-white/40">{{ c.currency }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════
           REFERRAL + ACCOUNT INFO
           ═══════════════════════════════════════════════════ -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- Referral -->
        <div class="rounded-2xl p-6 md:p-8 transition-all duration-300
                    bg-white border border-gray-100 shadow-sm
                    dark:bg-[#101A47] dark:border-white/[0.05]">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                        bg-gold-500/10 dark:bg-amber-500/[0.08]">
              <i class="bi bi-share-fill text-amber-500 text-lg"></i>
            </div>
            <div>
              <h4 class="font-bold text-lg text-gray-800 dark:text-white">Referral Program</h4>
              <p class="text-xs text-gray-400 dark:text-white/40">
                Earn {{ referralRate }}% on every referral
              </p>
            </div>
          </div>

          <p class="text-sm mb-4 text-gray-600 dark:text-white/60">
            Share your link and earn a
            <strong class="text-amber-500">{{ referralRate }}% bonus</strong>
            when someone signs up!
          </p>

          <div class="flex gap-2 mb-3">
            <div v-if="referralStore.state.isLoading && !referralStore.state.info"
                 class="flex-1 h-12 rounded-xl bg-gray-100 dark:bg-white/[0.04] animate-pulse"></div>
            <input
              v-else
              ref="referralInput"
              type="text"
              readonly
              class="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 font-mono
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/60 dark:focus:border-blue-500/40"
              :value="referralLink"
            >
            <button
              @click="copyReferralLink"
              :disabled="!referralLink"
              class="px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300
                     hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              :style="copied
                ? 'background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white;'
                : 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;'"
            >
              <i :class="copied ? 'bi bi-check-circle' : 'bi bi-copy'" class="mr-2"></i>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>

          <p class="text-xs text-gray-400 dark:text-white/30">
            Every successful referral gives you
            <strong class="text-amber-500">{{ referralRate }}%</strong>
            of their initial investment.
          </p>
        </div>

        <!-- Account info -->
        <div class="rounded-2xl p-6 md:p-8 transition-all duration-300
                    bg-white border border-gray-100 shadow-sm
                    dark:bg-[#101A47] dark:border-white/[0.05]">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                        bg-gold-500/10 dark:bg-blue-500/[0.08]">
              <i class="bi bi-person-circle text-blue-400 text-lg"></i>
            </div>
            <div>
              <h4 class="font-bold text-lg text-gray-800 dark:text-white">Account Information</h4>
              <p class="text-xs text-gray-400 dark:text-white/40">Your account details</p>
            </div>
          </div>

          <div class="space-y-1">
            <template v-if="authStore.state.isFetchingUser && !authStore.state.user">
              <div
                v-for="i in 4"
                :key="i"
                class="flex justify-between items-center py-3 border-b last:border-0 border-gray-100 dark:border-white/[0.04]"
              >
                <div class="h-4 w-32 bg-gray-100 dark:bg-white/[0.04] rounded animate-pulse"></div>
                <div class="h-4 w-24 bg-gray-200 dark:bg-white/[0.06] rounded animate-pulse"></div>
              </div>
            </template>

            <template v-else>
              <div
                v-for="info in accountInfo"
                :key="info.label"
                class="flex justify-between items-center py-3 border-b last:border-0
                       border-gray-100 dark:border-white/[0.04]"
              >
                <span class="text-sm text-gray-500 dark:text-white/40">{{ info.label }}</span>
                <span class="text-sm font-semibold text-gray-800 dark:text-white/90">{{ info.value }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════
           RECENT TRANSACTIONS
           ═══════════════════════════════════════════════════ -->
      <div class="rounded-2xl transition-all duration-300 overflow-hidden
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="flex items-center justify-between p-5 md:p-6">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                        bg-gold-500/10 dark:bg-blue-500/[0.08]">
              <i class="bi bi-clock-history text-blue-400 text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white">Recent Transactions</h3>
              <p class="text-xs text-gray-400 dark:text-white/40">Your latest activity</p>
            </div>
          </div>
          <NuxtLink
            to="/transactions"
            class="text-amber-500 text-sm font-semibold hover:text-amber-400 transition-colors duration-200 flex items-center gap-1 group"
          >
            View All
            <i class="bi bi-arrow-right group-hover:translate-x-1 transition-transform duration-200"></i>
          </NuxtLink>
        </div>

        <div class="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar">
          <table class="w-full min-w-[600px]">
            <thead class="sticky top-0 z-10 backdrop-blur-md bg-white/95 dark:bg-[#101A47]/95">
              <tr class="border-b border-gray-200 dark:border-white/[0.06]">
                <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/30">Type</th>
                <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/30">Amount</th>
                <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/30">Status</th>
                <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/30">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="txStore.state.isLoading && !txStore.state.recent.length">
                <td colspan="4" class="py-4 px-5 md:px-6">
                  <div class="space-y-3">
                    <div
                      v-for="i in 4"
                      :key="i"
                      class="flex items-center gap-3 p-3 rounded-xl animate-pulse bg-gray-50 dark:bg-white/[0.02]"
                    >
                      <div class="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/[0.06]"></div>
                      <div class="flex-1 space-y-2">
                        <div class="h-3 bg-gray-200 dark:bg-white/[0.06] rounded w-1/4"></div>
                        <div class="h-2 bg-gray-100 dark:bg-white/[0.04] rounded w-1/3"></div>
                      </div>
                      <div class="h-6 w-20 bg-gray-200 dark:bg-white/[0.06] rounded-full"></div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr v-else-if="!txStore.state.isLoading && !recentTransactions.length">
                <td colspan="4" class="py-10 text-center">
                  <i class="bi bi-inbox text-4xl text-gray-300 dark:text-white/20"></i>
                  <p class="text-sm text-gray-500 dark:text-white/40 mt-2">No recent activity</p>
                </td>
              </tr>

              <tr
                v-else
                v-for="tx in recentTransactions"
                :key="tx._id"
                class="transition-colors duration-200 border-b
                       border-gray-100 hover:bg-gray-50
                       dark:border-white/[0.03] dark:hover:bg-white/[0.03]"
              >
                <td class="py-4 px-5 md:px-6">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      :class="txIconBg(tx)"
                    >
                      <i :class="txIcon(tx)" class="text-lg"></i>
                    </div>
                    <div>
                      <span class="text-sm font-semibold block whitespace-nowrap text-gray-800 dark:text-white/90 capitalize">
                        {{ tx.type }}
                      </span>
                      <span class="text-xs text-gray-400 dark:text-white/30 font-mono">
                        #{{ tx.reference }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-5 md:px-6 whitespace-nowrap">
                  <span
                    class="text-sm font-bold"
                    :class="tx.direction === 'credit' ? 'text-emerald-500' : 'text-red-500'"
                  >
                    {{ tx.direction === 'credit' ? '+' : '−' }}${{ formatMoney(tx.amount) }}
                  </span>
                </td>
                <td class="py-4 px-5 md:px-6">
                  <TransactionStatusBadge :status="tx.status" />
                </td>
                <td class="py-4 px-5 md:px-6 text-sm whitespace-nowrap text-gray-500 dark:text-white/30">
                  {{ formatDate(tx.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between px-5 md:px-6 py-3 border-t
                    border-gray-100 bg-gray-50
                    dark:border-white/[0.06] dark:bg-white/[0.01]">
          <span class="text-xs text-gray-500 dark:text-white/30">
            Showing {{ recentTransactions.length }} of your latest transactions
          </span>
          <NuxtLink
            to="/transactions"
            class="text-xs font-bold text-amber-500 hover:text-amber-400"
          >
            View All
          </NuxtLink>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWalletStore } from '~/stores/wallet'          // ✅ user-side wallet store (plural)
import { useTransactionStore } from '~/stores/transaction'
import { useReferralStore } from '~/stores/referral'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'dashboard' })

// ─────────────────────────────────────────────────────────────
// STORES
// ─────────────────────────────────────────────────────────────
const walletsStore = useWalletStore()                       // ✅ replaced useWalletStore
const txStore = useTransactionStore()
const referralStore = useReferralStore()
const authStore = useAuthStore()

// ─────────────────────────────────────────────────────────────
// LOADING FLAGS
// ─────────────────────────────────────────────────────────────
const balancesLoading = computed(
  () => walletsStore.state.isLoadingBalances && !walletsStore.state.balancesLoaded
)
const statsLoading = computed(
  () => walletsStore.state.isLoadingStats && !walletsStore.state.statsLoaded
)
const walletListLoading = computed(
  () => walletsStore.state.isLoadingAddresses && !walletsStore.state.systemWalletsLoaded
)

// ─────────────────────────────────────────────────────────────
// CRYPTO HOLDINGS — pairs system wallets with user balances
// ─────────────────────────────────────────────────────────────
const cryptosWithBalance = computed(() => {
  const wallets = walletsStore.state.systemWallets || []
  const balances = walletsStore.state.balances || {}

  return wallets
    .map((w) => ({
      currency: w.currency,
      name: w.name,
      color: w.color,
      emoji: w.emoji,
      balance: Number(balances[w.currency] || 0),
    }))
    // Show only currencies the user actually holds (or if all are zero, show all)
    .filter((c) => c.balance > 0)
})

// ─────────────────────────────────────────────────────────────
// REFERRAL
// ─────────────────────────────────────────────────────────────
const referralInput = ref(null)
const copied = ref(false)

const referralRate = computed(() => referralStore.state.info?.commissionRate || 5)

const referralLink = computed(() => {
  const info = referralStore.state.info
  if (info?.referralLink) return info.referralLink
  if (info?.code) {
    const origin = import.meta.client ? window.location.origin : 'https://coinsquarewealth.org'
    return `${origin}/?ref=${info.code}`
  }
  return ''
})

const copyReferralLink = async () => {
  if (!referralLink.value) return
  try {
    await navigator.clipboard.writeText(referralLink.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    referralInput.value?.select()
    document.execCommand('copy')
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}

// ─────────────────────────────────────────────────────────────
// STATS CARDS
// ─────────────────────────────────────────────────────────────
const stats = computed(() => {
  const w = walletsStore.state.stats || {}
  const b = walletsStore.availableUSD

  return [
    {
      label: 'Total Balance',
      value: `$${formatMoney(b)}`,
      icon: 'bi bi-wallet2',
      bgColor: 'rgba(187, 145, 74, 0.15)',
      iconColor: '#bb914a',
    },
    {
      label: 'Total Deposits',
      value: `$${formatMoney(w.totalDeposits)}`,
      icon: 'bi bi-arrow-down-circle',
      bgColor: 'rgba(34, 197, 94, 0.15)',
      iconColor: '#22c55e',
    },
    {
      label: 'Total Withdrawals',
      value: `$${formatMoney(w.totalWithdrawals)}`,
      icon: 'bi bi-arrow-up-circle',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      iconColor: '#ef4444',
    },
    {
      label: 'Total Earnings',
      value: `$${formatMoney(w.totalEarnings)}`,
      icon: 'bi bi-graph-up-arrow',
      bgColor: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#3b82f6',
    },
  ]
})

// ─────────────────────────────────────────────────────────────
// ACCOUNT INFO
// ─────────────────────────────────────────────────────────────
const accountInfo = computed(() => {
  const u = authStore.state.user
  if (!u) return []
  return [
    { label: 'Username', value: u.username || u.name || '—' },
    { label: 'Email',    value: u.email || '—' },
    { label: 'Referral Code', value: u.referralCode || '—' },
    { label: 'KYC Status', value: u.kyc?.status || 'not_started' },
  ]
})

// ─────────────────────────────────────────────────────────────
// RECENT TRANSACTIONS
// ─────────────────────────────────────────────────────────────
const recentTransactions = computed(() => txStore.state.recent || [])

const txIcon = (tx) => {
  if (tx.direction === 'credit') return 'bi bi-arrow-down-circle text-emerald-500'
  if (tx.type === 'withdrawal') return 'bi bi-arrow-up-circle text-red-500'
  if (tx.type === 'investment') return 'bi bi-graph-up-arrow text-blue-500'
  return 'bi bi-arrow-up-circle text-red-500'
}
const txIconBg = (tx) => {
  if (tx.direction === 'credit') return 'bg-green-50 dark:bg-emerald-500/[0.08]'
  return 'bg-red-50 dark:bg-red-500/[0.08]'
}

// ─────────────────────────────────────────────────────────────
// FORMATTERS
// ─────────────────────────────────────────────────────────────
const formatMoney = (n) =>
  Number(n || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const formatCrypto = (n) => {
  const v = Number(n || 0)
  if (v === 0) return '0'
  if (v < 0.001) return v.toFixed(8)
  if (v < 1) return v.toFixed(6)
  if (v < 1000) return v.toFixed(4)
  return v.toLocaleString('en-US', { maximumFractionDigits: 4 })
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

// ─────────────────────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    walletsStore.fetchBalances(),          // 30 s
    walletsStore.fetchStats(),             // 2 min
    walletsStore.fetchSystemWallets(),     // ✅ NEW — fetches the wallet list
    txStore.fetchRecent(8),                // 1 min
    referralStore.fetchInfo(),             // 60 s
    authStore.state.user ? Promise.resolve() : authStore.fetchUser(),
  ])
})

onUnmounted(() => {
  // nothing to clean — no polling on this page
})
</script>

<style scoped>
.stat-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(96, 165, 250, 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(96, 165, 250, 0.5);
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(96, 165, 250, 0.3) transparent;
}

table { border-collapse: separate; border-spacing: 0; }
tbody tr:last-child { border-bottom: none !important; }

@media (max-width: 767px) {
  .stat-card { padding: 1rem; }
}
</style>