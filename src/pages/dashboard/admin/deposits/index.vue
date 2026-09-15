<template>
    <DashboardLayout>
      <!-- Header -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-emerald-500/10">
              <i class="bi bi-arrow-down-circle text-emerald-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Deposits</h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                Review and credit incoming deposits
              </p>
            </div>
          </div>
  
          <button
            @click="refreshAll"
            :disabled="store.state.isLoading"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
                   bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                   disabled:opacity-50 disabled:cursor-not-allowed
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
          >
            <span v-if="store.state.isLoading" class="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
            <i v-else class="bi bi-arrow-clockwise"></i> Refresh
          </button>
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
            <span class="w-2 h-2 rounded-full" :class="s.dot"></span>
            <span class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold">
              {{ s.label }}
            </span>
          </div>
          <div v-if="s.loading" class="h-6 w-20 rounded bg-gray-200 dark:bg-white/[0.06] animate-pulse"></div>
          <div v-else class="text-lg md:text-xl font-bold text-gray-800 dark:text-white">{{ s.value }}</div>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="rounded-2xl p-4 mb-4 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="flex flex-col md:flex-row gap-3">
          <div class="relative flex-1">
            <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"></i>
            <input
              v-model="localSearch"
              @input="debouncedSearch"
              type="text"
              placeholder="Search by reference, tx hash, or address..."
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
            <option v-for="s in ADMIN_DEPOSIT_FILTERS" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
  
          <select
            v-model="store.state.filters.currency"
            @change="applyFilters"
            class="px-4 py-2.5 rounded-xl text-sm cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-800
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option value="all">All Currencies</option>
            <option v-for="c in SUPPORTED_CURRENCIES" :key="c.value" :value="c.value">{{ c.value }}</option>
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
           class="mb-4 flex items-start gap-3 p-4 rounded-2xl
                  bg-red-50 border border-red-200
                  dark:bg-red-500/[0.08] dark:border-red-500/[0.15]">
        <i class="bi bi-exclamation-circle-fill text-red-500 text-lg mt-0.5"></i>
        <p class="flex-1 text-sm text-red-700 dark:text-red-400">{{ store.state.error }}</p>
        <button @click="store.clearError()" class="text-red-500 hover:text-red-700">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
  
      <!-- Skeleton -->
      <div v-if="store.state.isLoading && !store.hasDeposits" class="space-y-3">
        <div
          v-for="i in 6"
          :key="i"
          class="rounded-2xl p-5 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/[0.06]"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-white/[0.06] rounded w-1/3"></div>
              <div class="h-3 bg-gray-100 dark:bg-white/[0.04] rounded w-1/4"></div>
            </div>
            <div class="h-6 w-24 bg-gray-200 dark:bg-white/[0.06] rounded-full"></div>
            <div class="h-10 w-32 bg-gray-200 dark:bg-white/[0.06] rounded-xl"></div>
          </div>
        </div>
      </div>
  
      <!-- Empty -->
      <div v-else-if="!store.hasDeposits"
           class="rounded-2xl p-12 text-center bg-white border border-gray-100
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <i class="bi bi-inbox text-5xl text-gray-300 dark:text-white/20"></i>
        <p class="font-semibold text-gray-700 dark:text-white/70 mt-4">No deposits found</p>
        <p class="text-sm text-gray-500 dark:text-white/40 mt-1">
          {{ hasFilters ? 'Try adjusting filters' : 'Nothing to review right now' }}
        </p>
      </div>
  
      <!-- Table -->
      <div v-else class="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm
                         dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1000px]">
            <thead class="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01]">
              <tr>
                <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">User</th>
                <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Reference</th>
                <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Amount</th>
                <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Currency</th>
                <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Status</th>
                <th class="text-right py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="d in store.state.deposits"
                :key="d._id"
                class="border-b border-gray-100 hover:bg-gray-50 dark:border-white/[0.03] dark:hover:bg-white/[0.03] transition-colors"
              >
                <td class="py-4 px-5 md:px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {{ initials(d.user) }}
                      </span>
                    </div>
                    <div class="min-w-0">
                      <span class="text-sm font-bold block text-gray-800 dark:text-white truncate max-w-[140px]">
                        {{ d.user?.name || '—' }}
                      </span>
                      <span class="text-xs text-gray-400 dark:text-white/30 truncate max-w-[140px] block">
                        {{ d.user?.email || '—' }}
                      </span>
                    </div>
                  </div>
                </td>
  
                <td class="py-4 px-5 md:px-6">
                  <NuxtLink
                    :to="`/dashboard/admin/deposits/${d._id}`"
                    class="font-mono text-xs font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  >
                    {{ d.reference }}
                  </NuxtLink>
                  <div class="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                    {{ formatDate(d.createdAt) }}
                  </div>
                </td>
  
                <td class="py-4 px-5 md:px-6">
                  <div class="text-sm font-bold text-gray-800 dark:text-white">
                    ${{ formatMoney(d.amountUSD) }}
                  </div>
                  <div class="text-xs text-gray-400 dark:text-white/30">
                    {{ d.amountCrypto }} {{ d.currency }}
                  </div>
                </td>
  
                <td class="py-4 px-5 md:px-6">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs"
                      :style="{ background: currencyMeta(d.currency).color }"
                    >
                      <span v-html="currencyMeta(d.currency).emoji"></span>
                    </div>
                    <div class="text-xs font-bold text-gray-800 dark:text-white">
                      {{ d.currency }} · {{ d.network }}
                    </div>
                  </div>
                </td>
  
                <td class="py-4 px-5 md:px-6">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap"
                    :class="statusMeta(d.status).cls"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusMeta(d.status).dot"></span>
                    {{ statusMeta(d.status).label }}
                  </span>
                </td>
  
                <td class="py-4 px-5 md:px-6 text-right">
                  <AdminDepositActions
                    :status="d.status"
                    :disabled="store.state.isSubmitting"
                    compact
                    @approve="openAction('approve', d)"
                    @reject="openAction('reject', d)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Pagination -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-5 border-t
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
  
      <!-- Action Modal — reuse AdminActionModal -->
      <AdminActionModal
        :open="!!actionTarget"
        :title="actionConfig.title"
        :subtitle="actionConfig.subtitle"
        :icon="actionConfig.icon"
        :header-color="actionConfig.headerColor"
        :submit-label="actionConfig.submitLabel"
        :submit-color="actionConfig.submitColor"
        :loading="store.state.isSubmitting"
        :error-message="store.state.error"
        :withdrawal="actionTarget?.deposit"
        :show-tx-hash="false"
        :show-reason="true"
        :reason-required="actionConfig.reasonRequired"
        :reason-label="actionConfig.reasonLabel"
        :reason-placeholder="actionConfig.reasonPlaceholder"
        @close="closeAction"
        @submit="submitAction"
      />
  
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
  import { useAdminDepositStore } from '~/stores/adminDeposit'
  import {
    SUPPORTED_CURRENCIES,
    CURRENCY_META,
    ADMIN_DEPOSIT_FILTERS,
    DEPOSIT_ADMIN_STATUS_META,
  } from '~/composables/constants'
  
  definePageMeta({ layout: 'dashboard', middleware: 'admin' })
  
  const store = useAdminDepositStore()
  const localSearch = ref('')
  const toast = ref(null)
  const actionTarget = ref(null) // { type, deposit }
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const hasFilters = computed(() =>
    store.state.filters.status !== 'all' ||
    store.state.filters.currency !== 'all' ||
    store.state.filters.search
  )
  
  const statCards = computed(() => {
    const byStatus = store.state.stats?.byStatus || []
    const find = (s) => byStatus.find((x) => x._id === s)
    const loading = !store.state.statsLoaded
    const sum = (...s) => s.reduce((acc, x) => acc + (find(x)?.count || 0), 0)
    const sumUSD = (...s) => s.reduce((acc, x) => acc + (find(x)?.totalUSD || 0), 0)
  
    return [
      { key: 'pending',    label: 'Pending Queue', value: `${sum('pending','confirming')} · $${formatMoney(sumUSD('pending','confirming'))}`, dot: 'bg-amber-500', loading },
      { key: 'completed',  label: 'Credited',      value: `${sum('completed')} · $${formatMoney(sumUSD('completed'))}`, dot: 'bg-emerald-500', loading },
      { key: 'failed',     label: 'Failed',        value: `${sum('failed')} · $${formatMoney(sumUSD('failed'))}`, dot: 'bg-red-500', loading },
      { key: 'expired',    label: 'Expired',       value: `${sum('expired')}`, dot: 'bg-gray-400', loading },
    ]
  })
  
  const startIndex = computed(() => (store.state.pagination.page - 1) * store.state.pagination.limit)
  const endIndex = computed(() => Math.min(startIndex.value + store.state.deposits.length, store.state.pagination.total))
  
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
  
  const actionConfig = computed(() => {
    const type = actionTarget.value?.type
    const map = {
      approve: {
        title: 'Approve & Credit Deposit',
        subtitle: 'This will credit the user AND pay referral commission (if any)',
        icon: 'bi bi-check-circle-fill',
        headerColor: 'bg-emerald-500/10 text-emerald-500',
        submitLabel: 'Approve & Credit',
        submitColor: 'bg-emerald-500 text-white hover:bg-emerald-600',
        reasonLabel: 'Admin Note (optional)',
        reasonPlaceholder: 'Any internal note...',
      },
      reject: {
        title: 'Reject Deposit',
        subtitle: 'The user will be notified. No balance change.',
        icon: 'bi bi-x-circle-fill',
        headerColor: 'bg-red-500/10 text-red-500',
        submitLabel: 'Reject',
        submitColor: 'bg-red-500 text-white hover:bg-red-600',
        reasonRequired: true,
        reasonLabel: 'Rejection Reason *',
        reasonPlaceholder: 'Explain why the deposit was rejected (shown to user)',
      },
    }
    return map[type] || {}
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
  
  const currencyMeta = (c) => CURRENCY_META[c] || { color: '#F7931A', emoji: '?' }
  const statusMeta = (s) => DEPOSIT_ADMIN_STATUS_META[s] || DEPOSIT_ADMIN_STATUS_META.pending
  
  const showToast = (msg, type = 'success') => {
    toast.value = { message: msg, type }
    setTimeout(() => (toast.value = null), 3000)
  }
  
  // ─────────────────────────────────────────────────────────────
  // FILTER / PAGE
  // ─────────────────────────────────────────────────────────────
  const applyFilters = () => {
    store.state.pagination.page = 1
    store.fetchDeposits()
  }
  
  let searchTimer = null
  const debouncedSearch = () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      store.setFilters({ search: localSearch.value })
      store.fetchDeposits()
    }, 400)
  }
  
  const resetFilters = async () => {
    localSearch.value = ''
    store.resetFilters()
    await store.fetchDeposits()
  }
  
  const goPage = (p) => {
    if (p < 1 || p > store.totalPages) return
    store.setPage(p)
    store.fetchDeposits()
  }
  
  const refreshAll = async () => {
    await Promise.all([
      store.fetchDeposits({}, { force: true }),
      store.fetchStats({ force: true }),
    ])
  }
  
  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────
  const openAction = (type, deposit) => {
    store.clearError()
    actionTarget.value = { type, deposit }
  }
  
  const closeAction = () => {
    if (store.state.isSubmitting) return
    actionTarget.value = null
  }
  
  const submitAction = async (payload) => {
    if (!actionTarget.value) return
    const { type, deposit } = actionTarget.value
  
    let res
    if (type === 'approve') res = await store.approveDeposit(deposit._id, { note: payload.note })
    if (type === 'reject')  res = await store.rejectDeposit(deposit._id, { reason: payload.reason })
  
    if (res.success) {
      showToast(res.message || 'Done')
      actionTarget.value = null
      store.fetchStats()
    } else {
      showToast(res.message || 'Failed', 'error')
    }
  }
  
  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  onMounted(() => {
    Promise.all([
      store.fetchDeposits(),
      store.fetchStats(),
    ])
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