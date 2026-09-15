<template>
    <DashboardLayout>
      <!-- Header -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-blue-500/10">
              <i class="bi bi-people-fill text-blue-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Users</h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                Manage all platform accounts
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
  
      <!-- Filters -->
      <div class="rounded-2xl p-4 mb-4 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05] space-y-3">
        <div class="flex flex-col md:flex-row gap-3">
          <div class="relative flex-1">
            <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"></i>
            <input
              v-model="localSearch"
              @input="debouncedSearch"
              type="text"
              placeholder="Search by name, email, or phone..."
              class="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <select
            v-model="store.state.filters.sort"
            @change="applyFilters"
            class="px-4 py-2.5 rounded-xl text-sm cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-800
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option v-for="s in ADMIN_USER_FILTERS.sorts" :key="s.value" :value="s.value">{{ s.label }}</option>
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
  
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            v-model="store.state.filters.role"
            @change="applyFilters"
            class="px-3 py-2 rounded-lg text-xs cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-800
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option v-for="r in ADMIN_USER_FILTERS.roles" :key="r.value" :value="r.value">{{ r.label }}</option>
          </select>
  
          <select
            v-model="store.state.filters.kycStatus"
            @change="applyFilters"
            class="px-3 py-2 rounded-lg text-xs cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-800
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option v-for="k in ADMIN_USER_FILTERS.kycStatuses" :key="k.value" :value="k.value">{{ k.label }}</option>
          </select>
  
          <select
            v-model="store.state.filters.isBanned"
            @change="applyFilters"
            class="px-3 py-2 rounded-lg text-xs cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-800
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option v-for="b in ADMIN_USER_FILTERS.banned" :key="b.value" :value="b.value">{{ b.label }}</option>
          </select>
  
          <select
            v-model="store.state.filters.isVerified"
            @change="applyFilters"
            class="px-3 py-2 rounded-lg text-xs cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-800
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option v-for="v in ADMIN_USER_FILTERS.verified" :key="v.value" :value="v.value">{{ v.label }}</option>
          </select>
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
      <div v-if="store.state.isLoading && !store.hasUsers" class="space-y-3">
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
            <div class="h-6 w-32 bg-gray-200 dark:bg-white/[0.06] rounded-full"></div>
            <div class="h-10 w-20 bg-gray-200 dark:bg-white/[0.06] rounded-xl"></div>
          </div>
        </div>
      </div>
  
      <!-- Empty -->
      <div v-else-if="!store.hasUsers"
           class="rounded-2xl p-12 text-center bg-white border border-gray-100
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <i class="bi bi-inbox text-5xl text-gray-300 dark:text-white/20"></i>
        <p class="font-semibold text-gray-700 dark:text-white/70 mt-4">No users found</p>
        <p class="text-sm text-gray-500 dark:text-white/40 mt-1">
          {{ hasFilters ? 'Try adjusting filters' : 'Users will appear here once they register' }}
        </p>
      </div>
  
      <!-- Table -->
      <div v-else class="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm
                         dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[900px]">
            <thead class="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01]">
              <tr>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">User</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Status</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Balance</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Activity</th>
                <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Joined</th>
                <th class="text-right py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="u in store.state.users"
                :key="u._id"
                class="border-b border-gray-100 hover:bg-gray-50
                       dark:border-white/[0.03] dark:hover:bg-white/[0.03] transition-colors"
              >
                <!-- User -->
                <td class="py-4 px-5">
                  <NuxtLink :to="`/dashboard/admin/users/${u._id}`" class="flex items-center gap-3 group">
                    <div class="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img v-if="u.avatar" :src="u.avatar" class="w-full h-full object-cover" alt="" />
                      <span v-else class="text-sm font-bold text-amber-600 dark:text-amber-400">
                        {{ initials(u) }}
                      </span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[180px] group-hover:text-amber-500 transition-colors">
                        {{ u.name || '—' }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-white/40 truncate max-w-[180px]">{{ u.email }}</p>
                    </div>
                  </NuxtLink>
                </td>
  
                <!-- Status -->
                <td class="py-4 px-5">
                  <AdminUserStatusBadges :user="u" />
                </td>
  
                <!-- Balance -->
                <td class="py-4 px-5">
                  <p class="text-sm font-bold text-gray-800 dark:text-white">
                    ${{ formatMoney(u.balances?.USD) }}
                  </p>
                  <p v-if="u.referralCode" class="text-xs text-gray-400 dark:text-white/30 font-mono">
                    {{ u.referralCode }}
                  </p>
                </td>
  
                <!-- Activity -->
                <td class="py-4 px-5">
                  <p class="text-xs text-gray-700 dark:text-white/60">
                    <span class="font-bold">${{ formatMoney(u.totalDeposits) }}</span> deposited
                  </p>
                  <p class="text-xs text-gray-400 dark:text-white/30">
                    {{ u.totalWithdrawals ? `$${formatMoney(u.totalWithdrawals)} withdrawn` : 'No withdrawals' }}
                  </p>
                </td>
  
                <!-- Joined -->
                <td class="py-4 px-5">
                  <p class="text-xs text-gray-500 dark:text-white/40 whitespace-nowrap">
                    {{ formatDate(u.createdAt) }}
                  </p>
                </td>
  
                <!-- Actions -->
                <td class="py-4 px-5 text-right">
                  <div class="inline-flex items-center gap-2">
                    <NuxtLink
                      :to="`/dashboard/admin/users/${u._id}`"
                      class="w-9 h-9 rounded-xl flex items-center justify-center transition-all
                             bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                      title="View details"
                    >
                      <i class="bi bi-eye"></i>
                    </NuxtLink>
  
                    <button
                      v-if="u.role !== 'admin'"
                      @click="openBanModal(u)"
                      class="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                      :class="u.isBanned
                        ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                        : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'"
                      :title="u.isBanned ? 'Unban' : 'Ban'"
                    >
                      <i :class="u.isBanned ? 'bi bi-check-circle' : 'bi bi-slash-circle'"></i>
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
            <button            @click="goPage(store.state.pagination.page - 1)"
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
  
      <!-- Ban/Unban modal -->
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="banTarget"
          class="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          @click.self="!store.state.isSubmitting && (banTarget = null)"
        >
          <div class="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl
                      bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">
            <div class="p-6 text-center">
              <div
                class="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                :class="banTarget.user.isBanned
                  ? 'bg-emerald-500/10'
                  : 'bg-red-500/10'"
              >
                <i
                  class="text-2xl"
                  :class="banTarget.user.isBanned
                    ? 'bi bi-check-circle-fill text-emerald-500'
                    : 'bi bi-slash-circle-fill text-red-500'"
                ></i>
              </div>
              <h3 class="font-bold text-xl text-gray-800 dark:text-white mb-2">
                {{ banTarget.user.isBanned ? 'Unban user?' : 'Ban user?' }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-white/50 mb-5">
                <strong class="text-gray-800 dark:text-white">{{ banTarget.user.name }}</strong>
                ({{ banTarget.user.email }})
              </p>
  
              <div v-if="!banTarget.user.isBanned" class="text-left">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
                  Reason (optional)
                </label>
                <textarea
                  v-model="banReason"
                  rows="3"
                  placeholder="e.g. Suspicious activity, TOS violation..."
                  class="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none
                         bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                         dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
                ></textarea>
              </div>
  
              <div class="flex gap-3 mt-6">
                <button
                  @click="banTarget = null"
                  :disabled="store.state.isSubmitting"
                  class="flex-1 py-3 rounded-xl font-semibold text-sm
                         bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                         disabled:opacity-50"
                >Cancel</button>
                <button
                  @click="confirmBan"
                  :disabled="store.state.isSubmitting"
                  class="flex-1 py-3 rounded-xl font-bold text-sm text-white
                         disabled:opacity-50 disabled:cursor-not-allowed
                         inline-flex items-center justify-center gap-2"
                  :class="banTarget.user.isBanned
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-red-500 hover:bg-red-600'"
                >
                  <span v-if="store.state.isSubmitting" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  {{ banTarget.user.isBanned ? 'Unban' : 'Ban User' }}
                </button>
              </div>
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
  import { useAdminUserStore } from '~/stores/adminUser'
  import { ADMIN_USER_FILTERS } from '~/composables/constants'
  
  definePageMeta({ layout: 'dashboard', middleware: 'admin' })
  
  const store = useAdminUserStore()
  const localSearch = ref('')
  const toast = ref(null)
  const banTarget = ref(null)
  const banReason = ref('')
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const hasFilters = computed(() =>
    store.state.filters.search !== '' ||
    store.state.filters.role !== 'all' ||
    store.state.filters.kycStatus !== 'all' ||
    store.state.filters.isBanned !== 'all' ||
    store.state.filters.isVerified !== 'all' ||
    store.state.filters.sort !== 'newest'
  )
  
  const statCards = computed(() => {
    const s = store.state.stats
    const loading = !store.state.statsLoaded
    return [
      {
        key: 'total', label: 'Total Users', value: `${s?.total || 0}`,
        sub: `${s?.newThisMonth || 0} new this month`,
        icon: 'bi bi-people-fill', iconColor: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)',
        loading,
      },
      {
        key: 'verified', label: 'Verified', value: `${s?.verified || 0}`,
        sub: `${s?.unverified || 0} unverified`,
        icon: 'bi bi-patch-check-fill', iconColor: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)',
        loading,
      },
      {
        key: 'kycPending', label: 'KYC Pending', value: `${s?.kycPending || 0}`,
        sub: `${s?.kycApproved || 0} approved`,
        icon: 'bi bi-shield-check', iconColor: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)',
        loading,
      },
      {
        key: 'banned', label: 'Banned', value: `${s?.banned || 0}`,
        icon: 'bi bi-slash-circle-fill', iconColor: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)',
        loading,
      },
    ]
  })
  
  const startIndex = computed(() => (store.state.pagination.page - 1) * store.state.pagination.limit)
  const endIndex = computed(() => Math.min(startIndex.value + store.state.users.length, store.state.pagination.total))
  
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
    store.fetchUsers()
  }
  
  let searchTimer = null
  const debouncedSearch = () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      store.setFilters({ search: localSearch.value })
      store.fetchUsers()
    }, 400)
  }
  
  const resetFilters = async () => {
    localSearch.value = ''
    store.resetFilters()
    await store.fetchUsers()
  }
  
  const goPage = (p) => {
    if (p < 1 || p > store.totalPages) return
    store.setPage(p)
    store.fetchUsers()
  }
  
  const refreshAll = async () => {
    await Promise.all([
      store.fetchUsers({}, { force: true }),
      store.fetchStats({ force: true }),
    ])
  }
  
  const openBanModal = (user) => {
    banReason.value = ''
    banTarget.value = { user }
  }
  
  const confirmBan = async () => {
    if (!banTarget.value) return
    const { user } = banTarget.value
    const res = await store.setBanStatus(user._id, {
      isBanned: !user.isBanned,
      reason: user.isBanned ? undefined : banReason.value.trim(),
    })
    if (res.success) {
      showToast(res.message || 'Done')
      banTarget.value = null
      store.fetchStats({ force: true })
    } else {
      showToast(res.message || 'Failed', 'error')
    }
  }
  
  onMounted(() => {
    store.fetchUsers()
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