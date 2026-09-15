<template>
    <DashboardLayout>
      <!-- Header -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/dashboard/admin/deposits"
              class="w-10 h-10 rounded-xl flex items-center justify-center
                     bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]"
            >
              <i class="bi bi-arrow-left text-gray-600 dark:text-white/60"></i>
            </NuxtLink>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Deposit Details</h1>
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
      </div>
  
      <template v-else-if="store.state.current">
        <!-- Hero -->
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
                <div class="flex items-center gap-2 mb-1 flex-wrap">
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
  
            <AdminDepositActions
              :status="store.state.current.status"
              :disabled="store.state.isSubmitting"
              @approve="openAction('approve')"
              @reject="openAction('reject')"
            />
          </div>
        </div>
  
        <!-- Approve warning: what will happen -->
        <div
          v-if="store.state.current.status === 'pending' || store.state.current.status === 'confirming'"
          class="mb-6 rounded-2xl p-5 md:p-6 border-2 border-dashed
                 bg-amber-500/[0.06] border-amber-500/30"
        >
          <div class="flex items-start gap-3">
            <i class="bi bi-exclamation-triangle-fill text-amber-500 text-xl mt-0.5"></i>
            <div class="flex-1">
              <h3 class="font-bold text-amber-600 dark:text-amber-400 mb-3">
                Approving this deposit will:
              </h3>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-white/70">
                <li class="flex items-start gap-2">
                  <i class="bi bi-check2-circle text-emerald-500 mt-0.5"></i>
                  <span>Credit <strong>${{ formatMoney(store.state.current.amountUSD) }} USD</strong> to {{ store.state.current.user?.name }}'s balance</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="bi bi-check2-circle text-emerald-500 mt-0.5"></i>
                  <span>Add <strong>{{ store.state.current.amountCrypto }} {{ store.state.current.currency }}</strong> to their crypto balance</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="bi bi-check2-circle text-emerald-500 mt-0.5"></i>
                  <span>Increment their lifetime deposits by ${{ formatMoney(store.state.current.amountUSD) }}</span>
                </li>
                <li v-if="hasReferrer" class="flex items-start gap-2">
                  <i class="bi bi-people-fill text-amber-500 mt-0.5"></i>
                  <span>
                    Pay <strong class="text-amber-600 dark:text-amber-400">5% referral commission ({{ formatMoney(referralCommission) }})</strong>
                    to the referring user
                  </span>
                </li>
                <li v-else class="flex items-start gap-2 text-gray-500 dark:text-white/40">
                  <i class="bi bi-dash-circle mt-0.5"></i>
                  <span>No referral commission (user was not referred)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
  
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <!-- Left: details -->
          <div class="lg:col-span-2 space-y-4 md:space-y-6">
            <!-- Summary -->
            <div class="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm
                        dark:bg-[#101A47] dark:border-white/[0.05]">
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Deposit Details</h3>
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
                <div class="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-white/[0.06]"></div>
                <div v-for="(ev, i) in timeline" :key="i" class="relative pb-6 last:pb-0">
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
  
            <!-- Note -->
            <div v-if="store.state.current.note"
                 class="rounded-2xl p-6 border shadow-sm
                        bg-amber-50 border-amber-200 dark:bg-amber-500/[0.06] dark:border-amber-500/[0.15]">
              <div class="flex items-start gap-3">
                <i class="bi bi-info-circle-fill text-amber-500 text-lg mt-0.5"></i>
                <div>
                  <p class="text-sm font-bold text-amber-700 dark:text-amber-400 mb-1">Note</p>
                  <p class="text-sm text-gray-700 dark:text-white/70">{{ store.state.current.note }}</p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Right: user -->
          <div class="space-y-4 md:space-y-6">
            <div class="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm
                        dark:bg-[#101A47] dark:border-white/[0.05]">
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">User</h3>
              <div class="flex items-center gap-3 mb-5">
                <div class="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <span class="text-base font-bold text-emerald-600 dark:text-emerald-400">
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
  
              <div
                v-if="hasReferrer"
                class="p-3 rounded-xl mb-4 bg-amber-500/[0.06] border border-amber-500/[0.15]"
              >
                <p class="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                  <i class="bi bi-people-fill mr-1"></i>Referred User
                </p>
                <p class="text-xs text-gray-600 dark:text-white/60">
                  Approving will pay a 5% commission to their referrer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
  
      <!-- Not found -->
      <div v-else class="rounded-2xl p-12 text-center bg-white border border-gray-100
                         dark:bg-[#101A47] dark:border-white/[0.05]">
        <i class="bi bi-inbox text-5xl text-gray-300 dark:text-white/20"></i>
        <p class="font-semibold text-gray-700 dark:text-white/70 mt-4">Deposit not found</p>
        <NuxtLink to="/dashboard/admin/deposits" class="text-amber-500 font-bold text-sm mt-2 inline-block">
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
  import { CURRENCY_META, DEPOSIT_ADMIN_STATUS_META } from '~/composables/constants'
  
  definePageMeta({ layout: 'dashboard', middleware: 'admin' })
  
  const route = useRoute()
  const store = useAdminDepositStore()
  const actionType = ref(null)
  const toast = ref(null)
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const currencyMeta = computed(() => {
    const d = store.state.current
    return CURRENCY_META[d?.currency] || { color: '#F7931A', emoji: '?' }
  })
  
  const statusMeta = (s) =>
    DEPOSIT_ADMIN_STATUS_META[s] || DEPOSIT_ADMIN_STATUS_META.pending
  
  /** Whether the user was referred (backend uses `referredBy` on User) */
  const hasReferrer = computed(() => !!store.state.current?.user?.referredBy)
  
  const referralCommission = computed(() =>
    (store.state.current?.amountUSD || 0) * 0.05
  )
  
  const detailRows = computed(() => {
    const d = store.state.current
    if (!d) return []
    return [
      { label: 'Reference',       value: `<span class="font-mono text-xs">${d.reference}</span>` },
      { label: 'Currency',        value: `${d.currency} · ${d.network}` },
      { label: 'Amount (USD)',    value: `$${formatMoney(d.amountUSD)}` },
      { label: 'Amount (Crypto)', value: `${d.amountCrypto} ${d.currency}` },
      { label: 'Address',         value: `<span class="font-mono text-xs">${d.address}</span>` },
      { label: 'Tx Hash',         value: d.txHash ? `<span class="font-mono text-xs">${d.txHash}</span>` : '—' },
      { label: 'Confirmations',   value: `${d.confirmations || 0} / ${d.requiredConfirmations || 2}` },
      { label: 'Created',         value: formatDate(d.createdAt) },
      { label: 'Expires At',      value: formatDate(d.expiresAt) },
      { label: 'Confirmed At',    value: formatDate(d.confirmedAt) },
      { label: 'Credited At',     value: formatDate(d.creditedAt) },
      { label: 'Price at Creation', value: d.metadata?.priceAtCreation ? `$${formatMoney(d.metadata.priceAtCreation)}` : '—' },
    ]
  })
  
  const timeline = computed(() => {
    const d = store.state.current
    if (!d) return []
    return [
      { label: 'Requested', date: formatDateTime(d.createdAt), done: true, color: 'bg-amber-500' },
      { label: 'Confirming', date: formatDateTime(d.confirmedAt), done: d.status === 'confirming' || !!d.confirmedAt, color: 'bg-blue-500' },
      { label: 'Credited', date: formatDateTime(d.creditedAt), done: !!d.creditedAt, color: 'bg-emerald-500' },
    ]
  })
  
  const actionConfig = computed(() => {
    const type = actionType.value
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
  
  const formatDateTime = (d) => {
    if (!d) return ''
    const dt = new Date(d)
    return `${dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
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
    if (actionType.value === 'approve') res = await store.approveDeposit(id, { note: payload.note })
    if (actionType.value === 'reject')  res = await store.rejectDeposit(id, { reason: payload.reason })
  
    if (res.success) {
      showToast(res.message || 'Done')
      actionType.value = null
    } else {
      showToast(res.message || 'Failed', 'error')
    }
  }
  
  const refresh = () => store.fetchDeposit(route.params.id, { force: true })
  
  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  onMounted(() => {
    store.clearCurrent()
    store.fetchDeposit(route.params.id)
  })
  </script>