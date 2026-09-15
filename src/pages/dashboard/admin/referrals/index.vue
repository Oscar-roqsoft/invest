<template>
    <DashboardLayout>
      <!-- Header -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-amber-500/10">
              <i class="bi bi-people-fill text-amber-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Referrals</h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                Platform-wide referral commissions and top earners
              </p>
            </div>
          </div>
  
          <div class="flex items-center gap-2">
            <button
              @click="confirmBackfill = true"
              :disabled="store.state.isBackfilling"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
                     bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
            >
              <span v-if="store.state.isBackfilling" class="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
              <i v-else class="bi bi-arrow-repeat"></i>
              Backfill Missing
            </button>
            <button
              @click="refreshAll"
              :disabled="store.state.isLoading"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
                     bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
            >
              <i class="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>
      </div>
  
      <!-- Stat strip -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div
          v-for="s in statCards"
          :key="s.key"
          class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm
                 dark:bg-[#101A47] dark:border-white/[0.05]"
        >
          <div class="flex items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" :style="{ background: s.bgColor }">
              <i :class="s.icon" :style="{ color: s.iconColor }" class="text-xs"></i>
            </div>
            <span class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold">
              {{ s.label }}
            </span>
          </div>
          <div v-if="s.loading" class="h-6 w-20 rounded bg-gray-200 dark:bg-white/[0.06] animate-pulse"></div>
          <div v-else class="text-lg md:text-xl font-bold text-gray-800 dark:text-white">{{ s.value }}</div>
          <p v-if="s.sub" class="text-[10px] text-gray-400 dark:text-white/30 mt-1">{{ s.sub }}</p>
        </div>
      </div>
  
      <!-- Layout: list + top referrers -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
  
        <!-- LEFT: list (3/4) -->
        <div class="lg:col-span-3 space-y-4">
  
          <!-- Filters -->
          <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            <div class="flex flex-col md:flex-row gap-3">
              <div class="relative flex-1">
                <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"></i>
                <input
                  v-model="localSearch"
                  @input="debouncedSearch"
                  type="text"
                  placeholder="Search by referrer or referred..."
                  class="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all
                         bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                         dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
                >
              </div>
  
              <select
                v-model="store.state.filters.status"
                @change="applyFilters"
                class="px-4 py-2.5 rounded-xl text-sm cursor-pointer
                       bg-gray-50 border border-gray-200 text-gray-800
                       dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
              >
                <option v-for="s in ADMIN_REFERRAL_FILTERS" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
  
              <select
                v-model="store.state.filters.sort"
                @change="applyFilters"
                class="px-4 py-2.5 rounded-xl text-sm cursor-pointer
                       bg-gray-50 border border-gray-200 text-gray-800
                       dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
              >
                <option v-for="s in ADMIN_REFERRAL_SORT" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
  
              <button
                v-if="hasFilters"
                @click="resetFilters"
                class="px-4 py-2.5 rounded-xl text-sm font-semibold
                       bg-red-50 text-red-600 hover:bg-red-100 border border-red-200
                       dark:bg-red-500/[0.08] dark:text-red-400 dark:border-red-500/[0.15]"
              >
                <i class="bi bi-x-circle mr-1"></i> Clear
              </button>
            </div>
          </div>
  
          <!-- Error -->
          <div v-if="store.state.error"
               class="flex items-start gap-3 p-4 rounded-2xl
                      bg-red-50 border border-red-200
                      dark:bg-red-500/[0.08] dark:border-red-500/[0.15]">
            <i class="bi bi-exclamation-circle-fill text-red-500 text-lg mt-0.5"></i>
            <p class="flex-1 text-sm text-red-700 dark:text-red-400">{{ store.state.error }}</p>
            <button @click="store.clearError()" class="text-red-500 hover:text-red-700">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
  
          <!-- Skeleton -->
          <div v-if="store.state.isLoading && !store.hasReferrals"
               class="rounded-2xl p-5 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] space-y-3">
            <div
              v-for="i in 6"
              :key="i"
              class="flex items-center gap-4 p-3 rounded-xl animate-pulse bg-gray-50 dark:bg-white/[0.02]"
            >
              <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/[0.06]"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3.5 bg-gray-200 dark:bg-white/[0.06] rounded w-1/3"></div>
                <div class="h-2.5 bg-gray-100 dark:bg-white/[0.04] rounded w-1/4"></div>
              </div>
              <div class="h-4 w-20 bg-gray-200 dark:bg-white/[0.06] rounded"></div>
            </div>
          </div>
  
          <!-- Empty -->
          <div v-else-if="!store.hasReferrals"
               class="rounded-2xl p-12 text-center bg-white border border-gray-100
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            <i class="bi bi-inbox text-5xl text-gray-300 dark:text-white/20"></i>
            <p class="font-semibold text-gray-700 dark:text-white/70 mt-4">No referrals found</p>
            <p class="text-sm text-gray-500 dark:text-white/40 mt-1">
              {{ hasFilters ? 'Try adjusting filters' : 'Referrals will appear here once they come in' }}
            </p>
          </div>
  
          <!-- Table -->
          <div v-else class="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm
                             dark:bg-[#101A47] dark:border-white/[0.05]">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[800px]">
                <thead class="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01]">
                  <tr>
                    <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Referrer</th>
                    <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Referred</th>
                    <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Commission</th>
                    <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Source</th>
                    <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Status</th>
                    <th class="text-right py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="r in store.state.referrals"
                    :key="r._id"
                    class="border-b border-gray-100 hover:bg-gray-50
                           dark:border-white/[0.03] dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <td class="py-4 px-5">
                      <NuxtLink
                        v-if="r.referrer"
                        :to="`/dashboard/admin/referrals/user/${r.referrer._id}`"
                        class="flex items-center gap-3 group"
                      >
                        <div class="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <span class="text-xs font-bold text-amber-600 dark:text-amber-400">
                            {{ initials(r.referrer) }}
                          </span>
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[140px] group-hover:text-amber-500 transition-colors">
                            {{ r.referrer.name || '—' }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-white/40 truncate max-w-[140px]">
                            {{ r.referrer.referralCode ? `Code: ${r.referrer.referralCode}` : r.referrer.email }}
                          </p>
                        </div>
                      </NuxtLink>
                      <span v-else class="text-xs text-gray-400 italic">Deleted user</span>
                    </td>
  
                    <td class="py-4 px-5">
                      <div v-if="r.referred" class="min-w-0">
                        <p class="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[140px]">
                          {{ r.referred.name || '—' }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-white/40 truncate max-w-[140px]">
                          {{ r.referred.email }}
                        </p>
                      </div>
                      <div v-else-if="r.referredSnapshot" class="min-w-0">
                        <p class="text-sm font-bold text-gray-500 truncate max-w-[140px]">
                          {{ r.referredSnapshot.name }}
                          <span class="text-xs font-normal text-gray-400">(snapshot)</span>
                        </p>
                        <p class="text-xs text-gray-400 truncate max-w-[140px]">
                          {{ r.referredSnapshot.email }}
                        </p>
                      </div>
                      <span v-else class="text-xs text-gray-400 italic">Deleted user</span>
                    </td>
  
                    <td class="py-4 px-5">
                      <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        +${{ formatMoney(r.amount) }}
                      </p>
                      <p class="text-xs text-gray-400 dark:text-white/30">
                        {{ ((r.rate || 0) * 100).toFixed(0) }}% of ${{ formatMoney(r.sourceAmount) }}
                      </p>
                    </td>
  
                    <td class="py-4 px-5">
                      <div v-if="r.deposit" class="min-w-0">
                        <p class="text-xs font-mono text-gray-700 dark:text-white/70 truncate max-w-[140px]">
                          {{ r.deposit.reference }}
                        </p>
                        <p class="text-xs text-gray-400 dark:text-white/30">
                          {{ r.deposit.currency }} · ${{ formatMoney(r.deposit.amountUSD) }}
                        </p>
                      </div>
                      <span v-else class="text-xs text-gray-400">—</span>
                    </td>
  
                    <td class="py-4 px-5">
                      <AdminReferralStatusBadge :status="r.status" />
                    </td>
  
                    <td class="py-4 px-5 text-right">
                      <p class="text-xs text-gray-500 dark:text-white/40 whitespace-nowrap">
                        {{ formatDate(r.createdAt) }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            <!-- Pagination -->
            <div class="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-t
                        border-gray-100 bg-gray-50/50 dark:border-white/[0.06] dark:bg-white/[0.01]">
              <div class="text-xs text-gray-500 dark:text-white/40">
                Showing <strong class="text-gray-800 dark:text-white">{{ startIndex + 1 }}</strong>
                to <strong class="text-gray-800 dark:text-white">{{ endIndex }}</strong>
                of <strong class="text-gray-800 dark:text-white">{{ store.state.pagination.total }}</strong>
              </div>
              <div class="flex items-center gap-1">
                <button
                  @click="goPage(store.state.pagination.page - 1)"
                  :disabled="store.state.pagination.page === 1"
                  class="w-9 h-9 rounded-lg flex items-center justify-center
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-gray-200 dark:hover:bg-white/[0.06]"
                >
                  <i class="bi bi-chevron-left text-sm"></i>
                </button>
                <button
                  v-for="p in visiblePages"
                  :key="p"
                  @click="goPage(p)"
                  class="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                  :class="store.state.pagination.page === p
                    ? 'text-primary-900 shadow-md shadow-amber-500/20'
                    : 'text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/[0.06]'"
                  :style="store.state.pagination.page === p ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%);' : ''"
                >
                  {{ p }}
                </button>
                <button
                  @click="goPage(store.state.pagination.page + 1)"
                  :disabled="store.state.pagination.page === store.totalPages"
                  class="w-9 h-9 rounded-lg flex items-center justify-center
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-gray-200 dark:hover:bg-white/[0.06]"
                >
                  <i class="bi bi-chevron-right text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- RIGHT: top referrers (1/4) -->
        <div class="lg:col-span-1">
          <AdminTopReferrers
            :referrers="store.topReferrers"
            :loading="store.state.isLoadingStats && !store.state.statsLoaded"
          />
        </div>
      </div>
  
      <!-- Backfill confirm modal -->
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="confirmBackfill"
          class="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          @click.self="!store.state.isBackfilling && (confirmBackfill = false)"
        >
          <div class="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl
                      bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">
            <div class="p-6 text-center">
              <div class="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
                <i class="bi bi-arrow-repeat text-amber-500 text-2xl"></i>
              </div>
              <h3 class="font-bold text-xl text-gray-800 dark:text-white mb-2">Run Referral Backfill?</h3>
              <p class="text-sm text-gray-500 dark:text-white/50 mb-3">
                This scans every completed deposit for users who were referred but never got a commission.
                It will **credit their referrers** and create the missing records.
              </p>
              <div class="p-3 rounded-xl mb-5 bg-amber-50 border border-amber-200
                          dark:bg-amber-500/[0.06] dark:border-amber-500/[0.15]">
                <p class="text-xs text-amber-700 dark:text-amber-400">
                  <i class="bi bi-clock-history mr-1"></i>
                  On large platforms this can take <strong>several minutes</strong>.
                  Don't close the page.
                </p>
              </div>
              <div class="flex gap-3">
                <button
                  @click="confirmBackfill = false"
                  :disabled="store.state.isBackfilling"
                  class="flex-1 py-3 rounded-xl font-semibold text-sm
                         bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                         disabled:opacity-50"
                >Cancel</button>
                <button
                  @click="runBackfill"
                  :disabled="store.state.isBackfilling"
                  class="flex-1 py-3 rounded-xl font-bold text-sm text-white
                         bg-amber-500 hover:bg-amber-600
                         disabled:opacity-50 disabled:cursor-not-allowed
                         inline-flex items-center justify-center gap-2"
                >
                  <span v-if="store.state.isBackfilling" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  {{ store.state.isBackfilling ? 'Running...' : 'Run Backfill' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
  
      <!-- Backfill result modal -->
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="backfillResult"
          class="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          @click.self="backfillResult = null"
        >
          <div class="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl
                      bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">
            <div class="p-6 text-center">
              <div class="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <i class="bi bi-check-circle-fill text-emerald-500 text-2xl"></i>
              </div>
              <h3 class="font-bold text-xl text-gray-800 dark:text-white mb-4">Backfill Complete</h3>
  
              <div class="space-y-2 text-left mb-5">
                <div class="flex justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                  <span class="text-sm text-gray-500 dark:text-white/40">Created</span>
                  <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {{ backfillResult.created }} referrals
                  </span>
                </div>
                <div class="flex justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                  <span class="text-sm text-gray-500 dark:text-white/40">Skipped (already existed)</span>
                  <span class="text-sm font-bold text-gray-800 dark:text-white">
                    {{ backfillResult.skipped }}
                  </span>
                </div>
                <div class="flex justify-between p-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/[0.15]">
                  <span class="text-sm text-amber-700 dark:text-amber-400 font-bold">Total Commission Credited</span>
                  <span class="text-sm font-bold text-amber-700 dark:text-amber-400">
                    ${{ formatMoney(backfillResult.totalCommission) }}
                  </span>
                </div>
              </div>
  
              <button
                @click="backfillResult = null"
                class="w-full py-3 rounded-xl font-bold text-sm"
                style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%); color: #020862;"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>
  
      <!-- Toast -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div
          v-if="toast"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[800] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          :class="toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'"
        >
          <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'" class="text-white text-lg"></i>
          <span class="text-white text-sm font-bold">{{ toast.message }}</span>
        </div>
      </Transition>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useAdminReferralStore } from '~/stores/adminReferral'
  import { ADMIN_REFERRAL_FILTERS, ADMIN_REFERRAL_SORT } from '~/composables/constants'
  
  definePageMeta({ layout: 'dashboard', middleware: 'admin' })
  
  const store = useAdminReferralStore()
  const localSearch = ref('')
  const toast = ref(null)
  const confirmBackfill = ref(false)
  const backfillResult = ref(null)
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const hasFilters = computed(() =>
    store.state.filters.status !== 'all' ||
    store.state.filters.search !== '' ||
    store.state.filters.sort !== 'newest'
  )
  
  const statCards = computed(() => {
    const loading = !store.state.statsLoaded
    const s = store.state.stats
  
    return [
      {
        key: 'commission',
        label: 'Total Commission Paid',
        value: `$${formatMoney(s?.totalCommissionPaid)}`,
        sub: `${s?.totalReferralRecords || 0} referral records`,
        icon: 'bi bi-cash-stack', iconColor: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)',
        loading,
      },
      {
        key: 'volume',
        label: 'Source Volume',
        value: `$${formatMoney(s?.totalSourceVolume)}`,
        sub: 'Deposits that triggered commissions',
        icon: 'bi bi-graph-up-arrow', iconColor: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)',
        loading,
      },
      {
        key: 'referred',
        label: 'Referred Users',
        value: `${s?.totalReferredUsers || 0}`,
        sub: 'Unique users with at least 1 deposit',
        icon: 'bi bi-people-fill', iconColor: '#bb914a', bgColor: 'rgba(187, 145, 74, 0.15)',
        loading,
      },
      {
        key: 'credited',
        label: 'Credited',
        value: `${store.byStatus?.credited?.count || 0}`,
        sub: `$${formatMoney(store.byStatus?.credited?.totalAmount)} total`,
        icon: 'bi bi-check-circle-fill', iconColor: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.15)',
        loading,
      },
    ]
  })
  
  const startIndex = computed(() => (store.state.pagination.page - 1) * store.state.pagination.limit)
  const endIndex = computed(() => Math.min(startIndex.value + store.state.referrals.length, store.state.pagination.total))
  
  const visiblePages = computed(() => {
    const total = store.totalPages
    const current = store.state.pagination.page
    const pages = []
    if (total <= 5) for (let i = 1; i <= total; i++) pages.push(i)
    else if (current <= 3) for (let i = 1; i <= 4; i++) pages.push(i)
    else if (current >= total - 2) for (let i = total - 3; i <= total; i++) pages.push(i)
    else for (let i = current - 1; i <= current + 1; i++) pages.push(i)
    return pages
  })
  
  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────
  const formatMoney = (n) =>
    Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  
  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  const initials = (user) => {
    if (!user) return '?'
    const n = user.name || user.email || ''
    return n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?'
  }
  
  const showToast = (msg, type = 'success') => {
    toast.value = { message: msg, type }
    setTimeout(() => (toast.value = null), 3000)
  }
  
  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────
  const applyFilters = () => {
    store.state.pagination.page = 1
    store.fetchReferrals()
  }
  
  let searchTimer = null
  const debouncedSearch = () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      store.setFilters({ search: localSearch.value })
      store.fetchReferrals()
    }, 400)
  }
  
  const resetFilters = async () => {
    localSearch.value = ''
    store.resetFilters()
    await store.fetchReferrals()
  }
  
  const goPage = (p) => {
    if (p < 1 || p > store.totalPages) return
    store.setPage(p)
    store.fetchReferrals()
  }
  
  const refreshAll = async () => {
    await Promise.all([
      store.fetchReferrals({}, { force: true }),
      store.fetchStats({ force: true }),
    ])
  }
  
  const runBackfill = async () => {
    const res = await store.backfill()
    if (res.success) {
      backfillResult.value = res.result
      confirmBackfill.value = false
      // Refresh stats/list
      store.fetchStats({ force: true })
    } else {
      showToast(res.message || 'Backfill failed', 'error')
    }
  }
  
  onMounted(() => {
    store.fetchReferrals()
    store.fetchStats()
  })
  </script>
  
  <style scoped>
  .overflow-x-auto::-webkit-scrollbar { height: 6px; }
  .overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: rgba(187, 145, 74, 0.3);
    border-radius: 10px;
  }
  </style>