<template>
    <DashboardLayout>
      <!-- Header -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/dashboard/admin/withdrawals"
              class="w-10 h-10 rounded-xl flex items-center justify-center
                     bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]"
            >
              <i class="bi bi-arrow-left text-gray-600 dark:text-white/60"></i>
            </NuxtLink>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">
                Withdrawal Details
              </h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                <span class="font-mono">{{ store.state.current?.reference || '...' }}</span>
              </p>
            </div>
          </div>
  
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
  
      <!-- Loading -->
      <div v-if="store.state.isLoadingDetail && !store.state.current" class="space-y-4">
        <div class="rounded-2xl p-6 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse">
          <div class="h-6 w-48 bg-gray-200 dark:bg-white/[0.06] rounded mb-4"></div>
          <div class="h-32 bg-gray-100 dark:bg-white/[0.04] rounded"></div>
        </div>
        <div class="rounded-2xl p-6 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse">
          <div class="h-6 w-32 bg-gray-200 dark:bg-white/[0.06] rounded"></div>
        </div>
      </div>
  
      <template v-else-if="store.state.current">
        <!-- Hero card -->
        <div class="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden
                    bg-white border border-gray-100 shadow-sm
                    dark:bg-gradient-to-br dark:from-[#152155] dark:via-[#101A47] dark:to-[#0F1B4C]
                    dark:border-white/[0.06]">
          <div class="flex flex-wrap items-start justify-between gap-6">
            <div class="flex items-center gap-4">
              <div
                class="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white"
                :style="{ background: currencyMeta.color }"
              >
                <span v-html="currencyMeta.emoji"></span>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h2 class="font-bold text-2xl text-gray-800 dark:text-white">
                    ${{ formatMoney(store.state.current.amountUSD) }}
                  </h2>
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
                    :class="statusMeta(store.state.current.status).cls"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusMeta(store.state.current.status).dot"></span>
                    {{ statusMeta(store.state.current.status).label }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 dark:text-white/40">
                  {{ store.state.current.amountCrypto }} {{ store.state.current.currency }} ·
                  {{ store.state.current.network }}
                </p>
              </div>
            </div>
  
            <AdminWithdrawalActions
              :status="store.state.current.status"
              :disabled="store.state.isSubmitting"
              @approve="openAction('approve')"
              @process="openAction('process')"
              @complete="openAction('complete')"
              @reject="openAction('reject')"
            />
          </div>
        </div>
  
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <!-- Left: Details -->
          <div class="lg:col-span-2 space-y-4 md:space-y-6">
            <!-- Summary -->
            <div class="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm
                        dark:bg-[#101A47] dark:border-white/[0.05]">
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Transaction Details</h3>
              <div class="space-y-1">
                <div
                  v-for="row in detailRows"
                  :key="row.label"
                  class="flex justify-between items-start py-3 border-b last:border-0 border-gray-100 dark:border-white/[0.04]"
                >
                  <span class="text-sm text-gray-500 dark:text-white/40 flex-shrink-0">{{ row.label }}</span>
                  <span
                    class="text-sm font-semibold text-gray-800 dark:text-white/90 text-right ml-4 break-all"
                    :class="row.class"
                    v-html="row.value"
                  ></span>
                </div>
              </div>
            </div>
  
            <!-- Timeline -->
            <div class="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm
                        dark:bg-[#101A47] dark:border-white/[0.05]">
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Timeline</h3>
              <div class="relative pl-6">
                <!-- Vertical line -->
                <div class="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-white/[0.06]"></div>
  
                <div
                  v-for="(ev, i) in timeline"
                  :key="i"
                  class="relative pb-6 last:pb-0"
                >
                  <div
                    class="absolute -left-4 top-0 w-4 h-4 rounded-full border-2 border-white dark:border-[#101A47]"
                    :class="ev.done ? ev.color : 'bg-gray-200 dark:bg-white/[0.1]'"
                  ></div>
                  <div>
                    <p class="font-semibold text-sm text-gray-800 dark:text-white">{{ ev.label }}</p>
                    <p class="text-xs text-gray-500 dark:text-white/40 mt-0.5">{{ ev.date || 'Pending' }}</p>
                    <p v-if="ev.note" class="text-xs text-gray-500 dark:text-white/50 mt-1 italic">
                      "{{ ev.note }}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Admin note / rejection reason -->
            <div
              v-if="store.state.current.adminNote || store.state.current.rejectionReason"
              class="rounded-2xl p-6 border shadow-sm"
              :class="store.state.current.rejectionReason
                ? 'bg-red-50 border-red-200 dark:bg-red-500/[0.06] dark:border-red-500/[0.15]'
                : 'bg-amber-50 border-amber-200 dark:bg-amber-500/[0.06] dark:border-amber-500/[0.15]'"
            >
              <div class="flex items-start gap-3">
                <i
                  class="text-lg mt-0.5"
                  :class="store.state.current.rejectionReason
                    ? 'bi bi-x-circle-fill text-red-500'
                    : 'bi bi-info-circle-fill text-amber-500'"
                ></i>
                <div>
                  <p class="text-sm font-bold mb-1"
                     :class="store.state.current.rejectionReason
                       ? 'text-red-700 dark:text-red-400'
                       : 'text-amber-700 dark:text-amber-400'">
                    {{ store.state.current.rejectionReason ? 'Rejection Reason' : 'Admin Note' }}
                  </p>
                  <p class="text-sm text-gray-700 dark:text-white/70">
                    {{ store.state.current.rejectionReason || store.state.current.adminNote }}
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Right: User info -->
          <div class="space-y-4 md:space-y-6">
            <div class="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm
                        dark:bg-[#101A47] dark:border-white/[0.05]">
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">User</h3>
              <div class="flex items-center gap-3 mb-5">
                <div class="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <span class="text-base font-bold text-amber-600 dark:text-amber-400">
                    {{ initials(store.state.current.user) }}
                  </span>
                </div>
                <div class="min-w-0">
                  <p class="font-bold text-gray-800 dark:text-white truncate">
                    {{ store.state.current.user?.name || '—' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-white/40 truncate">
                    {{ store.state.current.user?.email || '—' }}
                  </p>
                </div>
              </div>
  
              <div v-if="store.state.current.user?.balances" class="space-y-2">
                <div class="flex items-center justify-between p-3 rounded-xl
                            bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
                  <span class="text-xs text-gray-500 dark:text-white/40">USD Balance</span>
                  <span class="text-sm font-bold text-gray-800 dark:text-white">
                    ${{ formatMoney(store.state.current.user.balances.USD) }}
                  </span>
                </div>
              </div>
            </div>
  
            <div class="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm
                        dark:bg-[#101A47] dark:border-white/[0.05]">
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Processed By</h3>
              <div v-if="store.state.current.processedBy" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <i class="bi bi-person-badge text-blue-500"></i>
                </div>
                <div>
                  <p class="font-bold text-sm text-gray-800 dark:text-white">
                    {{ store.state.current.processedBy.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-white/40">
                    {{ store.state.current.processedBy.email }}
                  </p>
                </div>
              </div>
              <p v-else class="text-sm text-gray-400 dark:text-white/30 italic">
                Not yet processed
              </p>
            </div>
          </div>
        </div>
      </template>
  
      <!-- Error state -->
      <div
        v-else
        class="rounded-2xl p-12 text-center bg-white border border-gray-100
               dark:bg-[#101A47] dark:border-white/[0.05]"
      >
        <i class="bi bi-inbox text-5xl text-gray-300 dark:text-white/20"></i>
        <p class="font-semibold text-gray-700 dark:text-white/70 mt-4">Withdrawal not found</p>
        <NuxtLink to="/dashboard/admin/withdrawals" class="text-amber-500 font-bold text-sm mt-2 inline-block">
          Back to list
        </NuxtLink>
      </div>
  
      <!-- Action Modal -->
      <AdminActionModal
        :open="!!actionType"
        :title="actionConfig.title"
        :subtitle="actionConfig.subtitle"
        :icon="actionConfig.icon"
        :header-color="actionConfig.headerColor"
        :submit-label="actionConfig.submitLabel"
        :submit-color="actionConfig.submitColor"
        :loading="store.state.isSubmitting"
        :error-message="store.state.error"
        :withdrawal="store.state.current"
        :show-tx-hash="actionConfig.showTxHash"
        :tx-hash-required="actionConfig.txHashRequired"
        :show-reason="actionConfig.showReason"
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
  import { useAdminWithdrawalStore } from '~/stores/adminWithdrawal'
  import { CURRENCY_META, WITHDRAWAL_ADMIN_STATUS_META } from '~/composables/constants'
  
  definePageMeta({ layout: 'dashboard', middleware: 'admin' })
  
  const route = useRoute()
  const store = useAdminWithdrawalStore()
  const actionType = ref(null)
  const toast = ref(null)
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const currencyMeta = computed(() => {
    const w = store.state.current
    return CURRENCY_META[w?.currency] || { color: '#F7931A', emoji: '?' }
  })
  
  const statusMeta = (s) =>
    WITHDRAWAL_ADMIN_STATUS_META[s] || WITHDRAWAL_ADMIN_STATUS_META.pending
  
  const detailRows = computed(() => {
    const w = store.state.current
    if (!w) return []
    return [
      { label: 'Reference',           value: `<span class="font-mono text-xs">${w.reference}</span>` },
      { label: 'Currency',            value: `${w.currency} · ${w.network}` },
      { label: 'Amount (USD)',        value: `$${formatMoney(w.amountUSD)}` },
      { label: 'Amount (Crypto)',     value: `${w.amountCrypto} ${w.currency}` },
      { label: 'Network Fee',         value: `-$${formatMoney(w.networkFeeUSD)}`, class: 'text-red-500' },
      { label: 'Processing Fee',      value: `-$${formatMoney(w.processingFeeUSD)}`, class: 'text-red-500' },
      { label: 'Total Fees',          value: `-$${formatMoney(w.totalFeeUSD)}`, class: 'text-red-500' },
      { label: 'Net Amount (USD)',    value: `$${formatMoney(w.netAmountUSD)}`, class: 'text-amber-500' },
      { label: 'Net Amount (Crypto)', value: `${w.netAmountCrypto} ${w.currency}`, class: 'text-amber-500' },
      { label: 'Destination Address', value: `<span class="font-mono text-xs">${w.address}</span>` },
      { label: 'Transaction Hash',    value: w.txHash ? `<span class="font-mono text-xs">${w.txHash}</span>` : '—' },
      { label: 'Created',             value: formatDate(w.createdAt) },
      { label: 'Approved',            value: formatDate(w.approvedAt) },
      { label: 'Processed',           value: formatDate(w.processedAt) },
      { label: 'Completed',           value: formatDate(w.completedAt) },
    ]
  })
  
  const timeline = computed(() => {
    const w = store.state.current
    if (!w) return []
    return [
      {
        label: 'Requested',
        date: formatDateTime(w.createdAt),
        done: true,
        color: 'bg-amber-500',
      },
      {
        label: 'Approved',
        date: formatDateTime(w.approvedAt),
        done: !!w.approvedAt,
        color: 'bg-blue-500',
        note: w.approvedAt ? w.adminNote : '',
      },
      {
        label: 'Processing',
        date: formatDateTime(w.processedAt),
        done: !!w.processedAt,
        color: 'bg-indigo-500',
        note: w.processedAt && w.txHash ? `tx: ${shortHash(w.txHash)}` : '',
      },
      {
        label: 'Completed',
        date: formatDateTime(w.completedAt),
        done: !!w.completedAt,
        color: 'bg-emerald-500',
      },
    ]
  })
  
  const actionConfig = computed(() => {
    const type = actionType.value
    const map = {
      approve: {
        title: 'Approve Withdrawal',
        subtitle: 'Mark as ready for processing',
        icon: 'bi bi-check-circle-fill',
        headerColor: 'bg-emerald-500/10 text-emerald-500',
        submitLabel: 'Approve',
        submitColor: 'bg-emerald-500 text-white hover:bg-emerald-600',
        showTxHash: false,
        showReason: true,
      },
      process: {
        title: 'Mark as Processing',
        subtitle: 'You are sending the crypto on-chain',
        icon: 'bi bi-arrow-repeat',
        headerColor: 'bg-blue-500/10 text-blue-500',
        submitLabel: 'Mark Processing',
        submitColor: 'bg-blue-500 text-white hover:bg-blue-600',
        showTxHash: true,
        showReason: true,
      },
      complete: {
        title: 'Complete Withdrawal',
        subtitle: 'The transaction is confirmed on-chain',
        icon: 'bi bi-check-all',
        headerColor: 'bg-emerald-500/10 text-emerald-500',
        submitLabel: 'Complete',
        submitColor: 'bg-emerald-600 text-white hover:bg-emerald-700',
        showTxHash: true,
        showReason: true,
      },
      reject: {
        title: 'Reject Withdrawal',
        subtitle: 'Balance will be refunded to the user',
        icon: 'bi bi-x-circle-fill',
        headerColor: 'bg-red-500/10 text-red-500',
        submitLabel: 'Reject & Refund',
        submitColor: 'bg-red-500 text-white hover:bg-red-600',
        showTxHash: false,
        showReason: true,
        reasonRequired: true,
        reasonLabel: 'Rejection Reason *',
        reasonPlaceholder: 'Explain why the withdrawal was rejected (sent to user)',
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
  
  const formatDateTime = (d) => {
    if (!d) return ''
    const dt = new Date(d)
    return `${dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  }
  
  const shortHash = (h) => {
    if (!h) return ''
    if (h.length <= 20) return h
    return `${h.slice(0, 10)}…${h.slice(-8)}`
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
  const openAction = (type) => {
    store.clearError()
    actionType.value = type
  }
  
  const closeAction = () => {
    if (store.state.isSubmitting) return
    actionType.value = null
  }
  
  const submitAction = async (payload) => {
    if (!actionType.value || !store.state.current) return
    const id = store.state.current._id
    let res
  
    if (actionType.value === 'approve')  res = await store.approveWithdrawal(id, { note: payload.note })
    if (actionType.value === 'process')  res = await store.markProcessing(id, { txHash: payload.txHash, note: payload.note })
    if (actionType.value === 'complete') res = await store.completeWithdrawal(id, { txHash: payload.txHash, note: payload.note })
    if (actionType.value === 'reject')   res = await store.rejectWithdrawal(id, { reason: payload.reason })
  
    if (res.success) {
      showToast(res.message || 'Done')
      actionType.value = null
    } else {
      showToast(res.message || 'Failed', 'error')
    }
  }
  
  const refresh = () => store.fetchWithdrawal(route.params.id, { force: true })
  
  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  onMounted(() => {
    store.clearCurrent()
    store.fetchWithdrawal(route.params.id)
  })
  </script>