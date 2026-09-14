<template>
  <DashboardLayout>
    <!-- ─────── HEADER (unchanged) ─────── -->
    <div class="my-6 md:mb-8 mt-[70px]">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-gold-500/10 dark:bg-blue-500/[0.08]">
            <i class="bi bi-clock-history text-amber-500 text-lg"></i>
          </div>
          <div>
            <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Transactions</h1>
            <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">View and manage all your transactions</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="exportTransactions"
            :disabled="store.state.isLoading || !store.hasTransactions"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                   bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                   disabled:opacity-50 disabled:cursor-not-allowed
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
          >
            <i class="bi bi-download"></i>
            <span class="hidden sm:inline">Export</span>
          </button>
          <NuxtLink
            to="/deposit"
            class="flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
          >
            <i class="bi bi-plus-circle"></i>
            <span class="hidden sm:inline">New Deposit</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ─────── STATS ─────── -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div
        v-for="stat in overviewStats"
        :key="stat.label"
        class="rounded-2xl p-4 md:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
               bg-white border border-gray-100 shadow-sm
               dark:bg-[#101A47] dark:border-white/[0.05]"
      >
        <div class="flex items-center gap-2 mb-3">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="{ background: stat.bgColor }">
            <i :class="stat.icon" :style="{ color: stat.iconColor }" class="text-sm"></i>
          </div>
          <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white/40">
            {{ stat.label }}
          </span>
        </div>

        <div v-if="store.state.isLoadingStats" class="h-7 w-24 bg-gray-200 dark:bg-white/[0.06] rounded animate-pulse"></div>
        <p v-else class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{{ stat.value }}</p>

        <p v-if="stat.change" class="text-xs mt-1" :class="stat.changeColor">{{ stat.change }}</p>
      </div>
    </div>

    <!-- ─────── MAIN CARD ─────── -->
    <div class="rounded-2xl overflow-hidden
                bg-white border border-gray-100 shadow-sm
                dark:bg-[#101A47] dark:border-white/[0.05]">

      <!-- Tabs (unchanged style, wired to store) -->
      <div class="border-b border-gray-100 dark:border-white/[0.06]">
        <div class="flex overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="selectTab(tab.id)"
            class="relative flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all duration-200"
            :class="activeTab === tab.id
              ? 'text-amber-500 dark:text-amber-400'
              : 'text-gray-500 dark:text-white/40 hover:text-gray-800 dark:hover:text-white/70'"
          >
            <i :class="tab.icon" class="text-base"></i>
            {{ tab.name }}
            <span
              v-if="tab.count"
              class="ml-1 px-2 py-0.5 rounded-full text-xs font-bold"
              :class="activeTab === tab.id
                ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/[0.15] dark:text-amber-400'
                : 'bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-white/40'"
            >{{ tab.count }}</span>
            <div
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
              style="background: linear-gradient(90deg, #F5D77F 0%, #E6BB5C 100%);"
            ></div>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="p-4 md:p-5 border-b border-gray-100 dark:border-white/[0.06]">
        <div class="flex flex-col md:flex-row gap-3">
          <div class="relative flex-1">
            <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 text-sm"></i>
            <input
              v-model="localSearch"
              @input="debouncedSearch"
              type="text"
              placeholder="Search by reference or description..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200
                     bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
            >
          </div>

          <select
            v-model="filters.status"
            @change="applyFilters"
            class="px-4 py-2.5 rounded-xl text-sm cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-700
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option v-for="s in TRANSACTION_STATUSES" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>

          <select
            v-model="filters.currency"
            @change="applyFilters"
            class="px-4 py-2.5 rounded-xl text-sm cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-700
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option value="all">All Currencies</option>
            <option v-for="c in currencyOptions" :key="c" :value="c">{{ c }}</option>
          </select>

          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                   bg-red-50 text-red-600 hover:bg-red-100 border border-red-200
                   dark:bg-red-500/[0.08] dark:text-red-400 dark:hover:bg-red-500/[0.15] dark:border-red-500/[0.15]"
          >
            <i class="bi bi-x-circle"></i> Clear
          </button>
        </div>
      </div>

      <!-- ░░ LOADING SKELETON ░░ -->
      <div v-if="store.state.isLoading && !store.hasTransactions" class="p-4 md:p-5 space-y-3">
        <div
          v-for="i in 6"
          :key="i"
          class="flex items-center gap-3 p-4 rounded-xl animate-pulse
                 bg-gray-50 dark:bg-white/[0.02]"
        >
          <div class="w-11 h-11 rounded-xl bg-gray-200 dark:bg-white/[0.06]"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3.5 bg-gray-200 dark:bg-white/[0.06] rounded w-1/4"></div>
            <div class="h-2.5 bg-gray-100 dark:bg-white/[0.04] rounded w-1/3"></div>
          </div>
          <div class="h-6 w-24 bg-gray-200 dark:bg-white/[0.06] rounded-full"></div>
          <div class="h-4 w-16 bg-gray-200 dark:bg-white/[0.06] rounded"></div>
        </div>
      </div>

      <!-- ░░ TABLE ░░ -->
      <div v-else-if="store.hasTransactions">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead class="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01]">
              <tr>
                <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Transaction</th>
                <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Type</th>
                <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Amount</th>
                <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Status</th>
                <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Date</th>
                <th class="text-right py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tx in store.state.transactions"
                :key="tx._id"
                class="transition-colors duration-200 border-b
                       border-gray-100 hover:bg-gray-50
                       dark:border-white/[0.03] dark:hover:bg-white/[0.03]"
              >
                <!-- Crypto -->
                <td class="py-4 px-5 md:px-6">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg text-white"
                      :style="{ background: currencyMeta(tx.currency).color }"
                    >
                      <span v-html="currencyMeta(tx.currency).emoji"></span>
                    </div>
                    <div class="min-w-0">
                      <span class="text-sm font-bold block text-gray-800 dark:text-white">{{ tx.currency }}</span>
                      <span class="text-xs text-gray-400 dark:text-white/30 font-mono truncate block max-w-[140px]">
                        #{{ tx.reference }}
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Type + direction -->
                <td class="py-4 px-5 md:px-6">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      :class="tx.direction === 'credit'
                        ? 'bg-green-50 dark:bg-emerald-500/[0.08]'
                        : 'bg-red-50 dark:bg-red-500/[0.08]'"
                    >
                      <i
                        :class="tx.direction === 'credit'
                          ? 'bi bi-arrow-down-circle text-emerald-500 text-sm'
                          : 'bi bi-arrow-up-circle text-red-500 text-sm'"
                      ></i>
                    </div>
                    <span
                      class="text-sm font-semibold capitalize"
                      :class="tx.direction === 'credit'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'"
                    >{{ tx.type }}</span>
                  </div>
                </td>

                <!-- Amount -->
                <td class="py-4 px-5 md:px-6">
                  <span
                    class="text-sm font-bold block"
                    :class="tx.direction === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'"
                  >
                    {{ tx.direction === 'credit' ? '+' : '-' }}${{ formatMoney(tx.amount) }}
                  </span>
                  <span v-if="tx.amountCrypto" class="text-xs text-gray-400 dark:text-white/30">
                    ≈ {{ tx.amountCrypto }} {{ tx.currency }}
                  </span>
                </td>

                <!-- Status -->
                <td class="py-4 px-5 md:px-6">
                  <TransactionStatusBadge :status="tx.status" />
                </td>

                <!-- Date -->
                <td class="py-4 px-5 md:px-6">
                  <div class="text-sm text-gray-700 dark:text-white/70 font-medium whitespace-nowrap">
                    {{ formatDate(tx.createdAt) }}
                  </div>
                  <div class="text-xs text-gray-400 dark:text-white/30">
                    {{ formatTime(tx.createdAt) }}
                  </div>
                </td>

                <!-- Action -->
                <td class="py-4 px-5 md:px-6 text-right">
                  <button
                    @click="viewDetails(tx)"
                    class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ml-auto
                           bg-gray-50 hover:bg-gold-500/10 text-gray-500 hover:text-gold-600
                           dark:bg-white/[0.04] dark:hover:bg-amber-500/[0.1] dark:text-white/40 dark:hover:text-amber-400"
                  >
                    <i class="bi bi-eye text-sm"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-5 border-t
                    border-gray-100 bg-gray-50/50
                    dark:border-white/[0.06] dark:bg-white/[0.01]">
          <div class="text-xs text-gray-500 dark:text-white/40">
            Showing <strong class="text-gray-800 dark:text-white">{{ startIndex + 1 }}</strong>
            to <strong class="text-gray-800 dark:text-white">{{ endIndex }}</strong>
            of <strong class="text-gray-800 dark:text-white">{{ store.state.pagination.total }}</strong> transactions
          </div>

          <div class="flex items-center gap-1">
            <button
              @click="prevPage"
              :disabled="store.state.pagination.page === 1"
              class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-200 text-gray-600 dark:text-white/50 dark:hover:bg-white/[0.06]"
            >
              <i class="bi bi-chevron-left text-sm"></i>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              class="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200"
              :class="store.state.pagination.page === page
                ? 'text-primary-900 shadow-md shadow-amber-500/20'
                : 'text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/[0.06]'"
              :style="store.state.pagination.page === page ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%);' : ''"
            >
              {{ page }}
            </button>

            <button
              @click="nextPage"
              :disabled="store.state.pagination.page === store.totalPages"
              class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-200 text-gray-600 dark:text-white/50 dark:hover:bg-white/[0.06]"
            >
              <i class="bi bi-chevron-right text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- ░░ EMPTY ░░ -->
      <div v-else class="flex flex-col items-center justify-center py-16 px-4">
        <div class="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-4">
          <i class="bi bi-inbox text-4xl text-gray-300 dark:text-white/20"></i>
        </div>
        <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2">No transactions found</h3>
        <p class="text-sm text-gray-500 dark:text-white/40 text-center max-w-sm mb-6">
          {{ hasActiveFilters
            ? 'Try adjusting your filters or search terms.'
            : "You don't have any transactions yet. Start by making your first deposit." }}
        </p>
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="px-6 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-white/80
                 bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]"
        >
          <i class="bi bi-arrow-clockwise mr-1"></i> Clear Filters
        </button>
        <NuxtLink
          v-else
          to="/deposit"
          class="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
          style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
        >
          <i class="bi bi-plus-circle mr-1"></i> Make a Deposit
        </NuxtLink>
      </div>
    </div>

    <!-- ─────── DETAIL MODAL ─────── -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="selectedTransaction"
        class="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeDetail"
      >
        <div class="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl
                    bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">

          <!-- ░░ modal loading ░░ -->
          <div v-if="store.state.isLoadingDetail && !store.state.current" class="p-6 space-y-4 animate-pulse">
            <div class="h-16 w-16 mx-auto rounded-2xl bg-gray-200 dark:bg-white/[0.06]"></div>
            <div class="h-6 w-32 mx-auto bg-gray-200 dark:bg-white/[0.06] rounded"></div>
            <div class="space-y-2">
              <div v-for="i in 5" :key="i" class="h-4 bg-gray-100 dark:bg-white/[0.04] rounded"></div>
            </div>
          </div>

          <template v-else-if="store.state.current">
            <div class="relative p-6 pb-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/[0.03] dark:to-white/[0.01]">
              <button
                @click="closeDetail"
                class="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center
                       bg-white/80 dark:bg-white/[0.06] hover:bg-white dark:hover:bg-white/[0.12]"
              >
                <i class="bi bi-x-lg text-gray-600 dark:text-white/60 text-sm"></i>
              </button>

              <div class="flex flex-col items-center text-center">
                <div
                  class="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 font-bold text-2xl text-white"
                  :style="{ background: currencyMeta(store.state.current.currency).color }"
                >
                  <span v-html="currencyMeta(store.state.current.currency).emoji"></span>
                </div>
                <span
                  class="text-2xl font-bold"
                  :class="store.state.current.direction === 'credit'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'"
                >
                  {{ store.state.current.direction === 'credit' ? '+' : '-' }}${{ formatMoney(store.state.current.amount) }}
                </span>
                <span v-if="store.state.current.amountCrypto" class="text-xs text-gray-500 dark:text-white/40 mt-1">
                  ≈ {{ store.state.current.amountCrypto }} {{ store.state.current.currency }}
                </span>
              </div>
            </div>

            <div class="p-6 space-y-1">
              <div
                v-for="detail in getTransactionDetails(store.state.current)"
                :key="detail.label"
                class="flex justify-between items-center py-3 border-b last:border-0
                       border-gray-100 dark:border-white/[0.04]"
              >
                <span class="text-sm text-gray-500 dark:text-white/40">{{ detail.label }}</span>
                <span
                  class="text-sm font-semibold text-gray-800 dark:text-white/90 text-right ml-4 truncate max-w-[60%]"
                  :class="detail.class"
                  v-html="detail.value"
                ></span>
              </div>
            </div>

            <div class="p-4 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.01]">
              <button
                @click="closeDetail"
                class="w-full py-3 rounded-xl font-bold text-sm"
                style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
              >
                Close
              </button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTransactionStore } from '~/stores/transaction'
import { TRANSACTION_STATUSES, CURRENCY_META } from '~/composables/constants'

definePageMeta({ layout: 'dashboard' })

// ─────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────
const store = useTransactionStore()

// ─────────────────────────────────────────────────────────────
// LOCAL UI STATE
// ─────────────────────────────────────────────────────────────
const activeTab = ref('all')
const localSearch = ref('')
const selectedTransaction = ref(null)
const dateFilter = ref('all')   // reserved — maps to from/to below

// Local mirror of store filters (two-way bind)
const filters = computed({
  get: () => store.state.filters,
  set: (v) => { store.state.filters = v },
})

// ─────────────────────────────────────────────────────────────
// TABS (counts come from stats)
// ─────────────────────────────────────────────────────────────
const tabs = computed(() => {
  const counts = store.state.stats?.countsByType || []
  const byType = (t) => counts.find((c) => c._id === t)?.count || 0

  return [
    { id: 'all',         name: 'All',         icon: 'bi bi-list-ul',            count: store.state.pagination.total || 0 },
    { id: 'deposit',     name: 'Deposits',    icon: 'bi bi-arrow-down-circle',  count: byType('deposit') },
    { id: 'withdrawal',  name: 'Withdrawals', icon: 'bi bi-arrow-up-circle',    count: byType('withdrawal') },
    { id: 'pending',     name: 'Pending',     icon: 'bi bi-clock-history',      count: byType('pending') },
  ]
})

// ─────────────────────────────────────────────────────────────
// STATS CARDS
// ─────────────────────────────────────────────────────────────
const overviewStats = computed(() => {
  const s = store.state.stats?.totals || {}
  const loading = store.state.isLoadingStats

  return [
    {
      label: 'Total Deposits',
      value: loading ? '—' : `$${formatMoney(s.totalDeposits)}`,
      icon: 'bi bi-arrow-down-circle', iconColor: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
    },
    {
      label: 'Total Withdrawals',
      value: loading ? '—' : `$${formatMoney(s.totalWithdrawals)}`,
      icon: 'bi bi-arrow-up-circle', iconColor: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.15)',
    },
    {
      label: 'Net Balance',
      value: loading ? '—' : `${store.netBalance >= 0 ? '+' : '-'}$${formatMoney(Math.abs(store.netBalance))}`,
      icon: 'bi bi-wallet2', iconColor: '#bb914a',
      bgColor: 'rgba(187, 145, 74, 0.15)',
    },
    {
      label: 'Transactions',
      value: loading ? '—' : `${s.transactionCount || 0}`,
      icon: 'bi bi-clock-history', iconColor: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.15)',
    },
  ]
})

const currencyOptions = computed(() => {
  const fromStats = (store.state.stats?.byCurrency || []).map((c) => c._id)
  const fallback = Object.keys(CURRENCY_META)
  return fromStats.length ? fromStats : fallback
})

// ─────────────────────────────────────────────────────────────
// PAGINATION HELPERS
// ─────────────────────────────────────────────────────────────
const startIndex = computed(() => (store.state.pagination.page - 1) * store.state.pagination.limit)
const endIndex = computed(() => Math.min(startIndex.value + store.state.transactions.length, store.state.pagination.total))

const visiblePages = computed(() => {
  const total = store.totalPages
  const current = store.state.pagination.page
  const pages = []
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else if (current <= 3) {
    for (let i = 1; i <= 4; i++) pages.push(i)
  } else if (current >= total - 2) {
    for (let i = total - 3; i <= total; i++) pages.push(i)
  } else {
    for (let i = current - 1; i <= current + 1; i++) pages.push(i)
  }
  return pages
})

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatMoney = (n) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
const formatTime = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

const currencyMeta = (c) =>
  CURRENCY_META[c] || { color: '#888', emoji: '?', name: c }

// ─────────────────────────────────────────────────────────────
// FILTER ACTIONS
// ─────────────────────────────────────────────────────────────
const hasActiveFilters = computed(() =>
  store.state.filters.search !== '' ||
  store.state.filters.status !== 'all' ||
  store.state.filters.currency !== 'all' ||
  store.state.filters.type !== 'all' ||
  store.state.filters.direction !== 'all'
)

let searchTimer = null
const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    store.setFilters({ search: localSearch.value })
    store.fetchMyTransactions()
  }, 400)
}

const applyFilters = () => {
  store.fetchMyTransactions()
}

const selectTab = (id) => {
  activeTab.value = id
  if (id === 'all') {
    store.setFilters({ type: 'all', status: 'all' })
  } else if (id === 'deposit' || id === 'withdrawal') {
    store.setFilters({ type: id, status: 'all' })
  } else if (id === 'pending') {
    store.setFilters({ status: 'pending', type: 'all' })
  }
  store.fetchMyTransactions()
}

const clearFilters = () => {
  localSearch.value = ''
  store.resetFilters()
  activeTab.value = 'all'
  store.fetchMyTransactions()
}

// ─────────────────────────────────────────────────────────────
// PAGINATION ACTIONS
// ─────────────────────────────────────────────────────────────
const prevPage = () => {
  if (store.state.pagination.page > 1) {
    store.setPage(store.state.pagination.page - 1)
    store.fetchMyTransactions()
  }
}
const nextPage = () => {
  if (store.state.pagination.page < store.totalPages) {
    store.setPage(store.state.pagination.page + 1)
    store.fetchMyTransactions()
  }
}
const goToPage = (p) => {
  store.setPage(p)
  store.fetchMyTransactions()
}

// ─────────────────────────────────────────────────────────────
// DETAIL MODAL
// ─────────────────────────────────────────────────────────────
const viewDetails = async (tx) => {
  selectedTransaction.value = tx
  await store.fetchTransaction(tx._id)   // fetch full record (cached 5 min)
}
const closeDetail = () => {
  selectedTransaction.value = null
  store.clearCurrent()
}

const getTransactionDetails = (tx) => {
  if (!tx) return []
  const statusClass =
    tx.status === 'completed' ? 'text-emerald-500' :
    tx.status === 'pending' || tx.status === 'confirming' ? 'text-amber-500' :
    tx.status === 'failed' ? 'text-red-500' : 'text-gray-500'

  const dirClass = tx.direction === 'credit' ? 'text-emerald-500' : 'text-red-500'

  return [
    { label: 'Reference',          value: `<span class="font-mono text-xs">${tx.reference}</span>` },
    { label: 'Type',               value: tx.type, class: dirClass },
    { label: 'Direction',          value: tx.direction === 'credit' ? 'Credit' : 'Debit', class: dirClass },
    { label: 'Currency',           value: tx.currency },
    { label: 'Amount (USD)',       value: `$${formatMoney(tx.amount)}` },
    { label: 'Crypto Amount',      value: tx.amountCrypto ? `${tx.amountCrypto} ${tx.currency}` : '—' },
    { label: 'Status',             value: tx.status, class: statusClass },
    { label: 'Date & Time',        value: `${formatDate(tx.createdAt)} · ${formatTime(tx.createdAt)}` },
    { label: 'Balance After',      value: tx.balanceAfter ? `$${formatMoney(tx.balanceAfter)}` : '—' },
  ]
}

// ─────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────
const exportTransactions = () => {
  const rows = store.state.transactions
  if (!rows.length) return
  const csv = [
    ['Reference', 'Type', 'Direction', 'Currency', 'Amount USD', 'Crypto Amount', 'Status', 'Date'].join(','),
    ...rows.map((t) => [
      t.reference, t.type, t.direction, t.currency,
      t.amount, t.amountCrypto || 0, t.status,
      new Date(t.createdAt).toISOString(),
    ].join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `transactions-${Date.now()}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

// ─────────────────────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────────────────────
onMounted(() => {
  store.fetchMyTransactions()   // cached 30 s
  store.fetchStats()            // cached 2 min
})

// Reset search if the store filters are cleared externally
watch(() => store.state.filters.search, (v) => {
  if (!v && localSearch.value) localSearch.value = ''
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
tbody tr { transition: all 0.2s ease; }
.overflow-x-auto { -webkit-overflow-scrolling: touch; }
.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: rgba(187, 145, 74, 0.3); border-radius: 10px; }
.overflow-x-auto::-webkit-scrollbar-thumb:hover { background: rgba(187, 145, 74, 0.5); }
</style>