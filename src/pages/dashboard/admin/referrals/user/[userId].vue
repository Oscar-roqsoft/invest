<template>
    <DashboardLayout>
      <!-- Header -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/dashboard/admin/referrals"
              class="w-10 h-10 rounded-xl flex items-center justify-center
                     bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]"
            >
              <i class="bi bi-arrow-left text-gray-600 dark:text-white/60"></i>
            </NuxtLink>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">
                {{ store.state.userDetail?.name || 'User Referrals' }}
              </h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                {{ store.state.userDetail?.email || '...' }}
                <span v-if="store.state.userDetail?.referralCode" class="ml-2 font-mono">
                  · {{ store.state.userDetail.referralCode }}
                </span>
              </p>
            </div>
          </div>
  
          <div class="flex items-center gap-2">
            <button
              @click="openManualCredit"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm
                     transition-all hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
            >
              <i class="bi bi-plus-circle"></i> Manual Credit
            </button>
            <button
              @click="refresh"
              :disabled="store.state.isLoadingUserDetail"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
                     bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
            >
              <span v-if="store.state.isLoadingUserDetail" class="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
              <i v-else class="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>
      </div>
  
      <!-- Loading -->
      <div v-if="store.state.isLoadingUserDetail && !store.state.userDetailLoaded" class="space-y-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="i in 4" :key="i"
               class="rounded-2xl p-4 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse">
            <div class="h-4 w-24 bg-gray-200 dark:bg-white/[0.06] rounded mb-3"></div>
            <div class="h-6 w-20 bg-gray-200 dark:bg-white/[0.06] rounded"></div>
          </div>
        </div>
        <div class="rounded-2xl p-6 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse">
          <div class="h-6 w-32 bg-gray-200 dark:bg-white/[0.06] rounded mb-4"></div>
          <div class="space-y-2">
            <div v-for="i in 5" :key="i" class="h-12 bg-gray-100 dark:bg-white/[0.04] rounded"></div>
          </div>
        </div>
      </div>
  
      <template v-else-if="store.state.userDetail">
        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05]">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Referrals</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ store.state.userReferrals.length }}</p>
          </div>
          <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05]">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Total Earned</p>
            <p class="text-2xl font-bold text-emerald-500">${{ formatMoney(totalEarned) }}</p>
          </div>
          <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05]">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Credited</p>
            <p class="text-2xl font-bold text-emerald-500">{{ creditedCount }}</p>
          </div>
          <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05]">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Pending</p>
            <p class="text-2xl font-bold text-amber-500">{{ pendingCount }}</p>
          </div>
        </div>
  
        <!-- List -->
        <div class="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm
                    dark:bg-[#101A47] dark:border-white/[0.05]">
          <div class="p-5 border-b border-gray-100 dark:border-white/[0.06]">
            <h3 class="font-bold text-lg text-gray-800 dark:text-white">Referral Records</h3>
            <p class="text-xs text-gray-400 dark:text-white/40">All commissions earned by this user</p>
          </div>
  
          <!-- Empty -->
          <div v-if="!store.state.userReferrals.length" class="p-12 text-center">
            <i class="bi bi-inbox text-4xl text-gray-300 dark:text-white/20"></i>
            <p class="text-sm text-gray-500 dark:text-white/40 mt-3">No referral records yet</p>
          </div>
  
          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[700px]">
              <thead class="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01]">
                <tr>
                  <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Referred User</th>
                  <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Deposit</th>
                  <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Commission</th>
                  <th class="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Status</th>
                  <th class="text-right py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="r in store.state.userReferrals"
                  :key="r._id"
                  class="border-b border-gray-100 hover:bg-gray-50
                         dark:border-white/[0.03] dark:hover:bg-white/[0.03] transition-colors"
                >
                  <td class="py-4 px-5">
                    <div v-if="r.referred" class="min-w-0">
                      <p class="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[160px]">
                        {{ r.referred.name || '—' }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-white/40 truncate max-w-[160px]">
                        {{ r.referred.email }}
                      </p>
                      <p v-if="r.referred.totalDeposits" class="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                        Total deposits: ${{ formatMoney(r.referred.totalDeposits) }}
                      </p>
                    </div>
                    <div v-else-if="r.referredSnapshot">
                      <p class="text-sm font-bold text-gray-500">
                        {{ r.referredSnapshot.name }}
                        <span class="text-xs font-normal text-gray-400">(snapshot)</span>
                      </p>
                      <p class="text-xs text-gray-400">{{ r.referredSnapshot.email }}</p>
                    </div>
                    <span v-else class="text-xs text-gray-400 italic">Deleted user</span>
                  </td>
  
                  <td class="py-4 px-5">
                    <div v-if="r.deposit">
                      <p class="text-xs font-mono text-gray-700 dark:text-white/70">{{ r.deposit.reference }}</p>
                      <p class="text-xs text-gray-400 dark:text-white/30">
                        {{ r.deposit.currency }} · ${{ formatMoney(r.deposit.amountUSD) }}
                      </p>
                    </div>
                    <span v-else class="text-xs text-gray-400">—</span>
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
        </div>
      </template>
  
      <!-- Not found -->
      <div v-else class="rounded-2xl p-12 text-center bg-white border border-gray-100
                         dark:bg-[#101A47] dark:border-white/[0.05]">
        <i class="bi bi-inbox text-5xl text-gray-300 dark:text-white/20"></i>
        <p class="font-semibold text-gray-700 dark:text-white/70 mt-4">User not found</p>
        <NuxtLink to="/dashboard/admin/referrals" class="text-amber-500 font-bold text-sm mt-2 inline-block">
          Back to referrals
        </NuxtLink>
      </div>
  
      <!-- Manual credit modal -->
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="showManualCredit"
          class="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          @click.self="!store.state.isSubmitting && (showManualCredit = false)"
        >
          <div class="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl
                      bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">
            <div class="p-6 pb-4 text-center">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
                <i class="bi bi-plus-circle text-amber-500 text-2xl"></i>
              </div>
              <h3 class="font-bold text-xl text-gray-800 dark:text-white">Manual Referral Credit</h3>
              <p class="text-sm text-gray-500 dark:text-white/40 mt-1">
                Use when auto-credit failed for a completed deposit
              </p>
            </div>
  
            <div class="px-6 space-y-4">
              <div class="p-3 rounded-xl bg-blue-50 border border-blue-200
                          dark:bg-blue-500/[0.06] dark:border-blue-500/[0.15]">
                <p class="text-xs text-blue-700 dark:text-blue-400">
                  <i class="bi bi-info-circle mr-1"></i>
                  The referrer will be <strong>{{ store.state.userDetail?.name }}</strong>.
                  Make sure the referred user was actually referred by them.
                </p>
              </div>
  
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
                  Referred User ID *
                </label>
                <input
                  v-model="form.referredId"
                  type="text"
                  placeholder="MongoDB ObjectId of the referred user"
                  class="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none
                         bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                         dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
                >
              </div>
  
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
                  Deposit ID *
                </label>
                <input
                  v-model="form.depositId"
                  type="text"
                  placeholder="MongoDB ObjectId of the completed deposit"
                  class="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none
                         bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                         dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
                >
              </div>
  
              <p v-if="creditError" class="text-xs text-red-500">
                <i class="bi bi-exclamation-circle mr-1"></i>{{ creditError }}
              </p>
            </div>
  
            <div class="p-5 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.01]
                        flex gap-3 mt-6">
              <button
                @click="showManualCredit = false"
                :disabled="store.state.isSubmitting"
                class="flex-1 py-3 rounded-xl font-semibold text-sm
                       bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                       disabled:opacity-50"
              >Cancel</button>
              <button
                @click="submitManualCredit"
                :disabled="!isCreditValid || store.state.isSubmitting"
                class="flex-1 py-3 rounded-xl font-bold text-sm text-white
                       bg-emerald-500 hover:bg-emerald-600
                       disabled:opacity-50 disabled:cursor-not-allowed
                       inline-flex items-center justify-center gap-2"
              >
                <span v-if="store.state.isSubmitting" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                {{ store.state.isSubmitting ? 'Crediting...' : 'Credit Commission' }}
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
  
  definePageMeta({ layout: 'dashboard', middleware: 'admin' })
  
  const route = useRoute()
  const store = useAdminReferralStore()
  const toast = ref(null)
  const showManualCredit = ref(false)
  const creditError = ref('')
  
  const form = ref({ referredId: '', depositId: '' })
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const totalEarned = computed(() =>
    store.state.userReferrals
      .filter((r) => r.status === 'credited')
      .reduce((s, r) => s + (r.amount || 0), 0)
  )
  
  const creditedCount = computed(() =>
    store.state.userReferrals.filter((r) => r.status === 'credited').length
  )
  const pendingCount = computed(() =>
    store.state.userReferrals.filter((r) => r.status === 'pending').length
  )
  
  const isCreditValid = computed(() =>
    form.value.referredId.trim().length >= 12 &&
    form.value.depositId.trim().length >= 12
  )
  
  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────
  const formatMoney = (n) =>
    Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  
  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  const showToast = (msg, type = 'success') => {
    toast.value = { message: msg, type }
    setTimeout(() => (toast.value = null), 3000)
  }
  
  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────
  const openManualCredit = () => {
    form.value = { referredId: '', depositId: '' }
    creditError.value = ''
    store.clearError()
    showManualCredit.value = true
  }
  
  const submitManualCredit = async () => {
    creditError.value = ''
    const referrerId = store.state.userDetail?._id
    if (!referrerId) {
      creditError.value = 'Missing referrer ID'
      return
    }
  
    const res = await store.manuallyCredit({
      referrerId,
      referredId: form.value.referredId.trim(),
      depositId: form.value.depositId.trim(),
    })
  
    if (res.success) {
      showToast('Commission credited')
      showManualCredit.value = false
      store.fetchUserReferrals(route.params.userId, { force: true })
      store.fetchStats({ force: true })
    } else {
      creditError.value = res.message || 'Failed to credit'
    }
  }
  
  const refresh = () => store.fetchUserReferrals(route.params.userId, { force: true })
  
  onMounted(() => {
    store.clearUserDetail()
    store.fetchUserReferrals(route.params.userId)
  })
  </script>