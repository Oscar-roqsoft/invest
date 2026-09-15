<template>
    <DashboardLayout>
      <!-- Header -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/dashboard/admin/users"
              class="w-10 h-10 rounded-xl flex items-center justify-center
                     bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]"
            >
              <i class="bi bi-arrow-left text-gray-600 dark:text-white/60"></i>
            </NuxtLink>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">
                {{ store.state.current?.name || 'User Detail' }}
              </h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                {{ store.state.current?.email || '...' }}
              </p>
            </div>
          </div>
  
          <div class="flex items-center gap-2">
            <button
              v-if="store.state.current && store.state.current.role !== 'admin'"
              @click="openBanModal"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all
                     hover:shadow-lg hover:scale-[1.02]"
              :class="store.state.current.isBanned
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-red-500 text-white hover:bg-red-600'"
            >
              <i :class="store.state.current.isBanned ? 'bi bi-check-circle' : 'bi bi-slash-circle'"></i>
              {{ store.state.current.isBanned ? 'Unban' : 'Ban User' }}
            </button>
            <button
              @click="refresh"
              :disabled="store.state.isLoadingDetail"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
                     bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
            >
              <span v-if="store.state.isLoadingDetail" class="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
              <i v-else class="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>
      </div>
  
      <!-- Loading -->
      <div v-if="store.state.isLoadingDetail && !store.state.current" class="space-y-4">
        <div class="rounded-2xl p-6 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-20 h-20 rounded-full bg-gray-200 dark:bg-white/[0.06]"></div>
            <div class="space-y-2 flex-1">
              <div class="h-5 w-48 bg-gray-200 dark:bg-white/[0.06] rounded"></div>
              <div class="h-4 w-64 bg-gray-100 dark:bg-white/[0.04] rounded"></div>
            </div>
          </div>
        </div>
      </div>
  
      <template v-else-if="store.state.current">
        <!-- Hero -->
        <div class="rounded-3xl p-6 md:p-8 mb-6 bg-white border border-gray-100 shadow-sm
                    dark:bg-gradient-to-br dark:from-[#152155] dark:via-[#101A47] dark:to-[#0F1B4C]
                    dark:border-white/[0.06]">
          <div class="flex flex-wrap items-start gap-6">
            <div class="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img v-if="store.state.current.avatar" :src="store.state.current.avatar" class="w-full h-full object-cover" alt="" />
              <span v-else class="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {{ initials(store.state.current) }}
              </span>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <h2 class="font-bold text-2xl text-gray-800 dark:text-white">
                  {{ store.state.current.name || '—' }}
                </h2>
                <AdminUserStatusBadges :user="store.state.current" />
              </div>
              <p class="text-sm text-gray-500 dark:text-white/40">{{ store.state.current.email }}</p>
              <p v-if="store.state.current.phone" class="text-sm text-gray-500 dark:text-white/40">
                {{ store.state.current.phone }}
              </p>
            </div>
  
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">Balance</p>
                <p class="text-xl font-bold text-gray-800 dark:text-white">
                  ${{ formatMoney(store.state.current.balances?.USD) }}
                </p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">Referral Code</p>
                <p class="text-sm font-mono font-bold text-amber-500">
                  {{ store.state.current.referralCode || '—' }}
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Tabs -->
        <div class="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm
                    dark:bg-[#101A47] dark:border-white/[0.05]">
          <div class="border-b border-gray-100 dark:border-white/[0.06]">
            <div class="flex overflow-x-auto">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="relative flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap transition-all"
                :class="activeTab === tab.id
                  ? 'text-amber-500 dark:text-amber-400'
                  : 'text-gray-500 dark:text-white/40 hover:text-gray-800 dark:hover:text-white/70'"
              >
                <i :class="tab.icon"></i> {{ tab.name }}
                <div
                  v-if="activeTab === tab.id"
                  class="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style="background: linear-gradient(90deg, #F5D77F 0%, #E6BB5C 100%);"
                ></div>
              </button>
            </div>
          </div>
  
          <div class="p-6">
  
            <!-- Overview -->
            <div v-if="activeTab === 'overview'" class="space-y-6">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                  <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">Total Deposits</p>
                  <p class="text-lg font-bold text-emerald-500">${{ formatMoney(store.state.current.totalDeposits) }}</p>
                </div>
                <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                  <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">Total Withdrawals</p>
                  <p class="text-lg font-bold text-red-500">${{ formatMoney(store.state.current.totalWithdrawals) }}</p>
                </div>
                <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                  <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">Earnings</p>
                  <p class="text-lg font-bold text-amber-500">${{ formatMoney(store.state.current.totalEarnings) }}</p>
                </div>
                <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                  <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">Investments</p>
                  <p class="text-lg font-bold text-blue-500">${{ formatMoney(store.state.current.totalInvestments) }}</p>
                </div>
              </div>
  
              <div class="space-y-1">
                <div
                  v-for="row in overviewRows"
                  :key="row.label"
                  class="flex justify-between items-start py-3 border-b last:border-0 border-gray-100 dark:border-white/[0.04]"
                >
                  <span class="text-sm text-gray-500 dark:text-white/40">{{ row.label }}</span>
                  <span class="text-sm font-semibold text-gray-800 dark:text-white/90 text-right ml-4">
                    {{ row.value }}
                  </span>
                </div>
              </div>
            </div>
  
            <!-- KYC -->
            <div v-else-if="activeTab === 'kyc'" class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-lg text-gray-800 dark:text-white">KYC Information</h3>
                  <p class="text-xs text-gray-500 dark:text-white/40">Submitted documents and status</p>
                </div>
                <NuxtLink
                  v-if="store.state.current.kyc?.status === 'pending'"
                  :to="`/dashboard/admin/kyc/${store.state.current._id}`"
                  class="px-4 py-2 rounded-xl text-sm font-bold
                         transition-all hover:shadow-lg hover:scale-[1.02]"
                  style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%); color: #020862;"
                >
                  <i class="bi bi-shield-check mr-1"></i> Review KYC
                </NuxtLink>
              </div>
  
              <div v-if="!store.state.current.kyc || store.state.current.kyc.status === 'not_started'"
                   class="p-8 text-center rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                <i class="bi bi-shield-slash text-3xl text-gray-300 dark:text-white/20"></i>
                <p class="text-sm text-gray-500 dark:text-white/40 mt-3">No KYC submitted</p>
              </div>
  
              <div v-else class="space-y-1">
                <div
                  v-for="row in kycRows"
                  :key="row.label"
                  class="flex justify-between items-start py-3 border-b last:border-0 border-gray-100 dark:border-white/[0.04]"
                >
                  <span class="text-sm text-gray-500 dark:text-white/40">{{ row.label }}</span>
                  <span class="text-sm font-semibold text-gray-800 dark:text-white/90 text-right ml-4" v-html="row.value"></span>
                </div>
              </div>
            </div>
  
            <!-- Edit -->
            <div v-else-if="activeTab === 'edit'" class="space-y-5">
              <div class="p-3 rounded-xl bg-amber-50 border border-amber-200
                          dark:bg-amber-500/[0.06] dark:border-amber-500/[0.15]">
                <p class="text-xs text-amber-700 dark:text-amber-400">
                  <i class="bi bi-info-circle mr-1"></i>
                  Only safe fields are editable. Balance, role, and KYC status are protected.
                </p>
              </div>
  
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Name</label>
                  <input
                    v-model="editForm.name"
                    type="text"
                    class="w-full px-4 py-3 rounded-xl text-sm outline-none
                           bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                           dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
                  >
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Phone</label>
                  <input
                    v-model="editForm.phone"
                    type="text"
                    class="w-full px-4 py-3 rounded-xl text-sm outline-none
                           bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                           dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
                  >
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Country</label>
                  <input
                    v-model="editForm.country"
                    type="text"
                    class="w-full px-4 py-3 rounded-xl text-sm outline-none
                           bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                           dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
                  >
                </div>
                <div class="flex items-end">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      v-model="editForm.isVerified"
                      type="checkbox"
                      class="w-5 h-5 rounded accent-emerald-500"
                    >
                    <span class="text-sm font-semibold text-gray-700 dark:text-white/80">Email Verified</span>
                  </label>
                </div>
              </div>
  
              <div class="flex justify-end pt-3">
                <button
                  @click="saveEdit"
                  :disabled="store.state.isSubmitting"
                  class="px-6 py-3 rounded-xl font-bold text-sm transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]
                         inline-flex items-center gap-2"
                  style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
                >
                  <span v-if="store.state.isSubmitting" class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
                  Save Changes
                </button>
              </div>
            </div>
  
          </div>
        </div>
      </template>
  
      <!-- Not found -->
      <div v-else class="rounded-2xl p-12 text-center bg-white border border-gray-100
                         dark:bg-[#101A47] dark:border-white/[0.05]">
        <i class="bi bi-inbox text-5xl text-gray-300 dark:text-white/20"></i>
        <p class="font-semibold text-gray-700 dark:text-white/70 mt-4">User not found</p>
        <NuxtLink to="/dashboard/admin/users" class="text-amber-500 font-bold text-sm mt-2 inline-block">
          Back to list
        </NuxtLink>
      </div>
  
      <!-- Ban modal -->
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="showBanModal && store.state.current"
          class="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          @click.self="!store.state.isSubmitting && (showBanModal = false)"
        >
          <div class="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl
                      bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">
            <div class="p-6 text-center">
              <div
                class="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                :class="store.state.current.isBanned ? 'bg-emerald-500/10' : 'bg-red-500/10'"
              >
                <i
                  class="text-2xl"
                  :class="store.state.current.isBanned
                    ? 'bi bi-check-circle-fill text-emerald-500'
                    : 'bi bi-slash-circle-fill text-red-500'"
                ></i>
              </div>
              <h3 class="font-bold text-xl text-gray-800 dark:text-white mb-2">
                {{ store.state.current.isBanned ? 'Unban user?' : 'Ban user?' }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-white/50 mb-5">
                <strong>{{ store.state.current.name }}</strong> ({{ store.state.current.email }})
              </p>
  
              <div v-if="!store.state.current.isBanned" class="text-left">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
                  Reason (optional)
                </label>
                <textarea
                  v-model="banReason"
                  rows="3"
                  class="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none
                         bg-gray-50 border border-gray-200 text-gray-800
                         dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
                ></textarea>
              </div>
  
              <div class="flex gap-3 mt-6">
                <button
                  @click="showBanModal = false"
                  :disabled="store.state.isSubmitting"
                  class="flex-1 py-3 rounded-xl font-semibold text-sm
                         bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70"
                >Cancel</button>
                <button
                  @click="submitBan"
                  :disabled="store.state.isSubmitting"
                  class="flex-1 py-3 rounded-xl font-bold text-sm text-white
                         disabled:opacity-50 disabled:cursor-not-allowed
                         inline-flex items-center justify-center gap-2"
                  :class="store.state.current.isBanned
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-red-500 hover:bg-red-600'"
                >
                  <span v-if="store.state.isSubmitting" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  {{ store.state.current.isBanned ? 'Unban' : 'Ban User' }}
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
  import { ref, computed, onMounted, watch } from 'vue'
  import { useAdminUserStore } from '~/stores/adminUser'
  
  definePageMeta({ layout: 'dashboard', middleware: 'admin' })
  
  const route = useRoute()
  const store = useAdminUserStore()
  const activeTab = ref('overview')
  const showBanModal = ref(false)
  const banReason = ref('')
  const toast = ref(null)
  
  const editForm = ref({
    name: '',
    phone: '',
    country: '',
    isVerified: false,
  })
  
  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'bi bi-grid' },
    { id: 'kyc',      name: 'KYC',      icon: 'bi bi-shield-check' },
    { id: 'edit',     name: 'Edit',     icon: 'bi bi-pencil-square' },
  ]
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const overviewRows = computed(() => {
    const u = store.state.current
    if (!u) return []
    return [
      { label: 'User ID',            value: u._id },
      { label: 'Email',              value: u.email || '—' },
      { label: 'Phone',              value: u.phone || '—' },
      { label: 'Country',            value: u.country || '—' },
      { label: 'Referred By',        value: u.referredBy || '—' },
      { label: 'Referral Earnings',  value: `$${formatMoney(u.referralEarnings)}` },
      { label: 'Registered',         value: formatDate(u.createdAt) },
      { label: 'Last Login',         value: formatDate(u.lastLogin) },
    ]
  })
  
  const kycRows = computed(() => {
    const k = store.state.current?.kyc
    if (!k || k.status === 'not_started') return []
    return [
      { label: 'Status',           value: `<span class="font-bold">${k.status}</span>` },
      { label: 'Document Type',    value: k.documentType || '—' },
      { label: 'Document Number',  value: k.documentNumber || '—' },
      { label: 'Submitted',        value: formatDate(k.submittedAt) },
      { label: 'Reviewed',         value: formatDate(k.reviewedAt) },
      { label: 'Rejection Reason', value: k.rejectionReason || '—' },
    ]
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
  // SYNC EDIT FORM WITH LOADED USER
  // ─────────────────────────────────────────────────────────────
  watch(
    () => store.state.current,
    (u) => {
      if (!u) return
      editForm.value = {
        name: u.name || '',
        phone: u.phone || '',
        country: u.country || '',
        isVerified: !!u.isVerified,
      }
    },
    { immediate: true }
  )
  
  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────
  const refresh = () => store.fetchUser(route.params.id, { force: true })
  
  const openBanModal = () => {
    banReason.value = ''
    showBanModal.value = true
  }
  
  const submitBan = async () => {
    const u = store.state.current
    if (!u) return
    const res = await store.setBanStatus(u._id, {
      isBanned: !u.isBanned,
      reason: u.isBanned ? undefined : banReason.value.trim(),
    })
    if (res.success) {
      showToast(res.message || 'Done')
      showBanModal.value = false
    } else {
      showToast(res.message || 'Failed', 'error')
    }
  }
  
  const saveEdit = async () => {
    const res = await store.updateUser(route.params.id, editForm.value)
    if (res.success) showToast('User updated')
    else showToast(res.message || 'Update failed', 'error')
  }
  
  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  onMounted(() => {
    store.clearCurrent()
    store.fetchUser(route.params.id)
  })
  </script>