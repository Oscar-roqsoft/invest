<template>
    <DashboardLayout>
      <!-- ─────── HEADER ─────── -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-amber-500/10">
              <i class="bi bi-credit-card-2-front-fill text-amber-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Virtual Cards</h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                Manage all user cards — generate, freeze, cancel
              </p>
            </div>
          </div>
  
          <div class="flex items-center gap-2">
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
            <button
              @click="showGenerate = true"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                     hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
            >
              <i class="bi bi-plus-circle"></i> Generate for User
            </button>
          </div>
        </div>
      </div>
  
      <!-- ─────── STATS STRIP ─────── -->
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
              placeholder="Search by user name, email, or last 4 digits..."
              class="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <select
            v-model="store.state.filters.tier"
            @change="applyFilters"
            class="px-4 py-2.5 rounded-xl text-sm cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-800
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option value="all">All Tiers</option>
            <option value="gold">Gold</option>
            <option value="black">Black</option>
          </select>
  
          <select
            v-model="store.state.filters.status"
            @change="applyFilters"
            class="px-4 py-2.5 rounded-xl text-sm cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-800
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="frozen">Frozen</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
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
      <div v-if="store.state.isLoading && !store.hasCards" class="space-y-3">
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
      <div v-else-if="!store.hasCards"
           class="rounded-2xl p-12 text-center bg-white border border-gray-100
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="w-20 h-20 mx-auto rounded-2xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-4">
          <i class="bi bi-credit-card text-3xl text-gray-300 dark:text-white/20"></i>
        </div>
        <p class="font-semibold text-gray-700 dark:text-white/70">No cards yet</p>
        <p class="text-sm text-gray-500 dark:text-white/40 mt-1 mb-5">
          {{ hasFilters ? 'Try adjusting filters' : 'Generate the first card for a user' }}
        </p>
        <button
          @click="showGenerate = true"
          class="px-5 py-2.5 rounded-xl font-bold text-sm
                 inline-flex items-center gap-2"
          style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%); color: #020862;"
        >
          <i class="bi bi-plus-circle"></i> Generate Card
        </button>
      </div>
  
      <!-- ─────── TABLE ─────── -->
      <div v-else class="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm
                         dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1000px]">
            <thead class="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01]">
              <tr>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">User</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Card</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Tier</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Status</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Issued</th>
                <th class="text-right py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="c in store.state.cards"
                :key="c._id"
                class="border-b border-gray-100 hover:bg-gray-50
                       dark:border-white/[0.03] dark:hover:bg-white/[0.03] transition-colors"
              >
                <!-- User -->
                <td class="py-4 px-5">
                  <div v-if="c.user" class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <span class="text-sm font-bold text-amber-600 dark:text-amber-400">
                        {{ initials(c.user) }}
                      </span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[160px]">
                        {{ c.user.name || '—' }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-white/40 truncate max-w-[160px]">
                        {{ c.user.email }}
                      </p>
                    </div>
                  </div>
                  <span v-else class="text-xs text-gray-400 italic">Deleted user</span>
                </td>
  
                <!-- Card -->
                <td class="py-4 px-5">
                  <p class="font-mono text-sm font-bold text-gray-800 dark:text-white">
                    •••• {{ c.last4 }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-white/30">
                    Exp {{ c.expiryDisplay }}
                  </p>
                </td>
  
                <!-- Tier -->
                <td class="py-4 px-5">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                    :class="tierMeta(c.tier).badgeClass"
                  >
                    <i :class="tierMeta(c.tier).icon"></i>
                    {{ tierMeta(c.tier).name }}
                  </span>
                </td>
  
                <!-- Status -->
                <td class="py-4 px-5">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
                    :class="statusMeta(c.status).cls"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusMeta(c.status).dot"></span>
                    {{ statusMeta(c.status).label }}
                  </span>
                </td>
  
                <!-- Issued -->
                <td class="py-4 px-5">
                  <p class="text-xs text-gray-500 dark:text-white/40 whitespace-nowrap">
                    {{ formatDate(c.issuedAt) }}
                  </p>
                  <p v-if="c.createdByAdmin" class="text-[10px] text-purple-500 font-bold mt-0.5">
                    <i class="bi bi-shield-fill-check mr-0.5"></i>By admin
                  </p>
                </td>
  
                <!-- Actions -->
                <td class="py-4 px-5 text-right">
                  <AdminCardActions
                    :card="c"
                    :disabled="store.state.isSubmitting"
                    compact
                    @freeze="toggleFreeze(c)"
                    @cancel="confirmDelete(c)"
                  />
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
  
      <!-- ─────── GENERATE MODAL ─────── -->
      <AdminGenerateCardModal
        :open="showGenerate"
        @close="showGenerate = false"
        @generated="onGenerated"
      />
  
      <!-- ─────── DELETE CONFIRM ─────── -->
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
                <i class="bi bi-exclamation-triangle-fill text-red-500 text-2xl"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2">Cancel this card?</h3>
              <p class="text-sm text-gray-500 dark:text-white/50 mb-5">
                <strong class="text-gray-800 dark:text-white">{{ deleteTarget.user?.name || 'User' }}</strong>'s
                {{ tierMeta(deleteTarget.tier).name }} (•••• {{ deleteTarget.last4 }}) will be cancelled.
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
                  Cancel Card
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
  import { useAdminCardStore } from '~/stores/adminCard'
  import { CARD_TIERS, CARD_STATUS_META } from '~/composables/constants'
  
  definePageMeta({ layout: 'dashboard', middleware: 'admin' })
  
  const store = useAdminCardStore()
  const localSearch = ref('')
  const deleteTarget = ref(null)
  const showGenerate = ref(false)
  const toast = ref(null)
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const hasFilters = computed(() =>
    store.state.filters.tier !== 'all' ||
    store.state.filters.status !== 'all' ||
    store.state.filters.search
  )
  
  const statCards = computed(() => {
    const s = store.state.stats
    const loading = !store.state.statsLoaded
    const byTier = (t) => (s?.byTier || []).find((x) => x._id === t)?.count || 0
    const byStatus = (st) => (s?.byStatus || []).find((x) => x._id === st)?.count || 0
  
    return [
      {
        key: 'total', label: 'Total Cards', value: `${s?.total || 0}`,
        sub: `${s?.issuedLast7Days || 0} issued last 7 days`,
        icon: 'bi bi-credit-card-2-front', iconColor: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)',
        loading,
      },
      {
        key: 'gold', label: 'Gold', value: `${byTier('gold')}`,
        sub: 'Standard tier',
        icon: 'bi bi-star-fill', iconColor: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)',
        loading,
      },
      {
        key: 'black', label: 'Black', value: `${byTier('black')}`,
        sub: 'Premium tier',
        icon: 'bi bi-gem', iconColor: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.15)',
        loading,
      },
      {
        key: 'admin', label: 'Admin Issued', value: `${s?.issuedByAdmin || 0}`,
        sub: `${byStatus('active')} currently active`,
        icon: 'bi bi-shield-fill-check', iconColor: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)',
        loading,
      },
    ]
  })
  
  const startIndex = computed(() =>
    (store.state.pagination.page - 1) * store.state.pagination.limit
  )
  const endIndex = computed(() =>
    Math.min(startIndex.value + store.state.cards.length, store.state.pagination.total)
  )
  
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
  const initials = (user) => {
    const n = user?.name || user?.email || ''
    return n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?'
  }
  
  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  const tierMeta = (t) => CARD_TIERS.find((x) => x.value === t) || CARD_TIERS[0]
  const statusMeta = (s) => CARD_STATUS_META[s] || CARD_STATUS_META.active
  
  const showToast = (msg, type = 'success') => {
    toast.value = { message: msg, type }
    setTimeout(() => (toast.value = null), 3000)
  }
  
  // ─────────────────────────────────────────────────────────────
  // FILTERS
  // ─────────────────────────────────────────────────────────────
  const applyFilters = () => {
    store.state.pagination.page = 1
    store.fetchCards()
  }
  
  let searchTimer = null
  const debouncedSearch = () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      store.setFilters({ search: localSearch.value })
      store.fetchCards()
    }, 400)
  }
  
  const resetFilters = async () => {
    localSearch.value = ''
    store.resetFilters()
    await store.fetchCards()
  }
  
  const goPage = (p) => {
    if (p < 1 || p > store.totalPages) return
    store.setPage(p)
    store.fetchCards()
  }
  
  const refreshAll = async () => {
    await Promise.all([
      store.fetchCards({}, { force: true }),
      store.fetchStats({ force: true }),
    ])
  }
  
  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────
  const toggleFreeze = async (card) => {
    const res = await store.freezeCard(card._id)
    if (res.success) showToast(res.message || 'Updated')
    else showToast(res.message || 'Failed', 'error')
  }
  
  const confirmDelete = (card) => { deleteTarget.value = card }
  
  const doDelete = async () => {
    if (!deleteTarget.value) return
    const res = await store.deleteCard(deleteTarget.value._id)
    if (res.success) {
      showToast('Card cancelled')
      deleteTarget.value = null
    } else {
      showToast(res.message || 'Failed', 'error')
    }
  }
  
  const onGenerated = (card) => {
    showToast(`Card generated for ${card?.user?.name || 'user'}`)
    store.fetchStats({ force: true })
  }
  
  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  onMounted(() => {
    store.fetchCards()
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