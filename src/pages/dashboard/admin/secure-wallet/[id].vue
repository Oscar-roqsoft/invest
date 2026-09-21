<template>
    <DashboardLayout>
      <!-- ─────── HEADER ─────── -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/dashboard/admin/secure-wallet"
              class="w-10 h-10 rounded-xl flex items-center justify-center
                     bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]"
            >
              <i class="bi bi-arrow-left text-gray-600 dark:text-white/60"></i>
            </NuxtLink>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">
                Wallet Detail
              </h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                {{ store.state.current?.coin }} · {{ store.state.current?.network }}
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- ─────── LOADING ─────── -->
      <div v-if="store.state.isLoadingDetail && !store.state.current" class="space-y-4">
        <div class="rounded-2xl p-6 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse">
          <div class="h-6 w-48 bg-gray-200 dark:bg-white/[0.06] rounded mb-4"></div>
          <div class="h-32 bg-gray-100 dark:bg-white/[0.04] rounded"></div>
        </div>
      </div>
  
      <template v-else-if="store.state.current">
        <!-- ─────── HERO ─────── -->
        <div class="rounded-3xl p-6 md:p-8 mb-6
                    bg-white border border-gray-100 shadow-sm
                    dark:bg-gradient-to-br dark:from-[#152155] dark:via-[#101A47] dark:to-[#0F1B4C]
                    dark:border-white/[0.06]">
          <div class="flex flex-wrap items-start gap-6">
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white flex-shrink-0"
              :style="{ background: coinMeta.color }"
            >
              <span v-html="coinMeta.emoji"></span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <h2 class="font-bold text-2xl text-gray-800 dark:text-white">
                  {{ store.state.current.coin }}
                </h2>
                <span class="text-xs px-2 py-0.5 rounded-full
                             bg-gray-100 dark:bg-white/[0.06]
                             text-gray-500 dark:text-white/40 font-mono">
                  {{ store.state.current.network }}
                </span>
                <span
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
                  :class="typeMeta(store.state.current.type).cls"
                >
                  <i :class="typeMeta(store.state.current.type).icon"></i>
                  {{ typeMeta(store.state.current.type).label }}
                </span>
                <span
                  v-if="store.state.current.source === 'admin'"
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                         bg-purple-500/10 text-purple-500"
                >
                  <i class="bi bi-shield-fill-check mr-0.5"></i>By admin
                </span>
              </div>
              <p class="text-sm text-gray-500 dark:text-white/40">{{ store.state.current.name }}</p>
              <p v-if="store.state.current.label" class="text-xs text-gray-400 dark:text-white/30 mt-1">
                <i class="bi bi-tag mr-1"></i>{{ store.state.current.label }}
              </p>
            </div>
  
            <!-- Actions -->
            <div class="flex flex-col gap-2">
              <button
                v-if="!store.state.decrypted"
                @click="openReasonModal"
                :disabled="store.state.isLoadingDetail"
                class="px-5 py-3 rounded-xl font-bold text-sm
                       bg-red-500 text-white hover:bg-red-600
                       disabled:opacity-50 disabled:cursor-not-allowed
                       inline-flex items-center gap-2
                       transition-all hover:shadow-lg hover:shadow-red-500/30"
              >
                <i class="bi bi-eye-fill"></i> Reveal Decrypted Data
              </button>
              <button
                v-else
                @click="store.clearCurrent(); store.fetchWallets()"
                class="px-5 py-3 rounded-xl font-bold text-sm
                       bg-gray-100 dark:bg-white/[0.06]
                       text-gray-700 dark:text-white/70
                       hover:bg-gray-200 dark:hover:bg-white/[0.1]
                       inline-flex items-center gap-2"
              >
                <i class="bi bi-arrow-clockwise"></i> Reload
              </button>
            </div>
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
  
        <!-- ─────── GRID ─────── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
  
          <!-- LEFT: Wallet metadata -->
          <div class="lg:col-span-2 space-y-4 md:space-y-6">
            <div class="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm
                        dark:bg-[#101A47] dark:border-white/[0.05]">
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Wallet Info</h3>
              <div class="space-y-1">
                <div
                  v-for="row in infoRows"
                  :key="row.label"
                  class="flex justify-between items-start py-3 border-b last:border-0
                         border-gray-100 dark:border-white/[0.04]"
                >
                  <span class="text-sm text-gray-500 dark:text-white/40 flex-shrink-0">{{ row.label }}</span>
                  <span
                    class="text-sm font-semibold text-gray-800 dark:text-white/90 text-right ml-4 break-all"
                    v-html="row.value"
                  ></span>
                </div>
              </div>
            </div>
  
            <!-- Decrypted secret (only when revealed) -->
            <div
              v-if="store.state.decrypted"
              class="rounded-2xl p-6 border-2 border-red-500/30 bg-red-500/[0.03]
                     dark:bg-red-500/[0.04]"
            >
              <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <i class="bi bi-unlock-fill text-red-500 text-lg"></i>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-red-600 dark:text-red-400">Decrypted Secret</h3>
                  <p class="text-xs text-red-500/70">Handle with care — never share or screenshot</p>
                </div>
              </div>
  
              <!-- Phrase -->
              <div v-if="store.state.decrypted.phrase" class="relative">
                <div class="p-4 rounded-xl bg-white dark:bg-black/30
                            border border-red-500/20">
                  <p class="text-xs text-gray-500 dark:text-white/40 mb-2 font-bold uppercase tracking-wider">
                    Recovery Phrase
                  </p>
                  <p class="font-mono text-sm text-gray-800 dark:text-white leading-relaxed break-words">
                    {{ store.state.decrypted.phrase }}
                  </p>
                </div>
                <button
                  @click="copySecret(store.state.decrypted.phrase, 'Phrase')"
                  class="absolute top-3 right-3 w-9 h-9 rounded-lg flex items-center justify-center
                         bg-white/90 dark:bg-black/50 hover:bg-white
                         border border-red-500/20"
                >
                  <i class="bi bi-clipboard text-red-500 text-sm"></i>
                </button>
              </div>
  
              <!-- Private key -->
              <div v-if="store.state.decrypted.privateKey" class="relative">
                <div class="p-4 rounded-xl bg-white dark:bg-black/30
                            border border-red-500/20">
                  <p class="text-xs text-gray-500 dark:text-white/40 mb-2 font-bold uppercase tracking-wider">
                    Private Key
                  </p>
                  <p class="font-mono text-xs text-gray-800 dark:text-white break-all">
                    {{ store.state.decrypted.privateKey }}
                  </p>
                </div>
                <button
                  @click="copySecret(store.state.decrypted.privateKey, 'Private key')"
                  class="absolute top-3 right-3 w-9 h-9 rounded-lg flex items-center justify-center
                         bg-white/90 dark:bg-black/50 hover:bg-white
                         border border-red-500/20"
                >
                  <i class="bi bi-clipboard text-red-500 text-sm"></i>
                </button>
              </div>
  
              <!-- Keystore -->
              <div v-if="store.state.decrypted.keystore" class="relative">
                <div class="p-4 rounded-xl bg-white dark:bg-black/30
                            border border-red-500/20 max-h-80 overflow-auto custom-scrollbar">
                  <p class="text-xs text-gray-500 dark:text-white/40 mb-2 font-bold uppercase tracking-wider">
                    Keystore JSON
                  </p>
                  <pre class="font-mono text-xs text-gray-800 dark:text-white whitespace-pre-wrap break-all">{{ prettyKeystore }}</pre>
                </div>
                <button
                  @click="copySecret(store.state.decrypted.keystore, 'Keystore')"
                  class="absolute top-3 right-3 w-9 h-9 rounded-lg flex items-center justify-center
                         bg-white/90 dark:bg-black/50 hover:bg-white
                         border border-red-500/20"
                >
                  <i class="bi bi-clipboard text-red-500 text-sm"></i>
                </button>
              </div>
  
              <div class="mt-4 p-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/[0.2]">
                <p class="text-xs text-amber-700 dark:text-amber-400">
                  <i class="bi bi-clock-history mr-1"></i>
                  <strong>This view was logged.</strong>
                  The user can see this wallet was accessed by an admin.
                </p>
              </div>
            </div>
          </div>
  
          <!-- RIGHT: User + Audit -->
          <div class="space-y-4 md:space-y-6">
            <!-- User card -->
            <div class="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm
                        dark:bg-[#101A47] dark:border-white/[0.05]">
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">User</h3>
              <div v-if="store.state.current.user" class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <span class="text-base font-bold text-amber-600 dark:text-amber-400">
                    {{ initials(store.state.current.user) }}
                  </span>
                </div>
                <div class="min-w-0">
                  <p class="font-bold text-gray-800 dark:text-white truncate">
                    {{ store.state.current.user.name || '—' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-white/40 truncate">
                    {{ store.state.current.user.email }}
                  </p>
                </div>
              </div>
              <NuxtLink
                v-if="store.state.current.user"
                :to="`/dashboard/admin/users/${store.state.current.user._id}`"
                class="mt-4 w-full py-2.5 rounded-xl font-bold text-xs
                       bg-gray-100 dark:bg-white/[0.06]
                       text-gray-700 dark:text-white/70
                       hover:bg-gray-200 dark:hover:bg-white/[0.1]
                       inline-flex items-center justify-center gap-2"
              >
                <i class="bi bi-person-badge"></i> View User Profile
              </NuxtLink>
            </div>
  
            <!-- Audit -->
            <div class="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm
                        dark:bg-[#101A47] dark:border-white/[0.05]">
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Last Admin View</h3>
              <div v-if="store.state.current.lastViewedByAdminAt">
                <p class="text-xs text-gray-500 dark:text-white/40 mb-1">Viewed at</p>
                <p class="text-sm font-bold text-gray-800 dark:text-white mb-3">
                  {{ formatDateTime(store.state.current.lastViewedByAdminAt) }}
                </p>
                <p class="text-xs text-gray-500 dark:text-white/40 mb-1">Reason</p>
                <p class="text-xs text-gray-700 dark:text-white/70 italic">
                  "{{ store.state.current.lastViewedReason || '—' }}"
                </p>
              </div>
              <p v-else class="text-xs text-gray-400 dark:text-white/30 italic">
                Never viewed by an admin
              </p>
            </div>
          </div>
        </div>
      </template>
  
      <!-- ─────── NOT FOUND ─────── -->
      <div v-else class="rounded-2xl p-12 text-center bg-white border border-gray-100
                         dark:bg-[#101A47] dark:border-white/[0.05]">
        <i class="bi bi-shield-slash text-5xl text-gray-300 dark:text-white/20"></i>
        <p class="font-semibold text-gray-700 dark:text-white/70 mt-4">Wallet not found</p>
        <NuxtLink to="/dashboard/admin/secure-wallet" class="text-amber-500 font-bold text-sm mt-2 inline-block">
          Back to list
        </NuxtLink>
      </div>
  
      <!-- ─────── REASON MODAL ─────── -->
      <AdminSecureWalletReasonModal
        :open="showReasonModal"
        :wallet="store.state.current"
        :loading="store.state.isLoadingDetail"
        :error-message="store.state.error"
        @close="showReasonModal = false"
        @submit="onReasonSubmit"
      />
  
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
  
  const route = useRoute()
  const store = useAdminSecureWalletStore()
  
  const showReasonModal = ref(false)
  const toast = ref(null)
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const coinMeta = computed(() => {
    const c = store.state.current?.coin
    return SECURE_WALLET_COINS.find((x) => x.coin === c) ||
      { color: '#6B7280', emoji: '?' }
  })
  
  const TYPE_META = {
    phrase:     { label: 'Phrase',     icon: 'bi bi-chat-quote', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    privateKey: { label: 'Private Key',icon: 'bi bi-key',        cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    keystore:   { label: 'Keystore',   icon: 'bi bi-file-lock',  cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  }
  const typeMeta = (t) => TYPE_META[t] || TYPE_META.phrase
  
  const infoRows = computed(() => {
    const w = store.state.current
    if (!w) return []
    return [
      { label: 'Coin',        value: `${w.coin} (${w.symbol})` },
      { label: 'Network',     value: w.network },
      { label: 'Type',        value: w.type },
      { label: 'Source',      value: w.source === 'admin' ? 'Imported by admin' : 'Imported by user' },
      { label: 'Address',     value: `<span class="font-mono text-xs">${w.address}</span>` },
      { label: 'Status',      value: w.status === 'active' ? 'Active' : 'Archived' },
      { label: 'Created',     value: formatDateTime(w.createdAt) },
    ]
  })
  
  const prettyKeystore = computed(() => {
    if (!store.state.decrypted?.keystore) return ''
    try {
      return JSON.stringify(JSON.parse(store.state.decrypted.keystore), null, 2)
    } catch {
      return store.state.decrypted.keystore
    }
  })
  
  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────
  const initials = (user) => {
    const n = user?.name || user?.email || ''
    return n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?'
  }
  
  const formatDateTime = (d) => {
    if (!d) return '—'
    const dt = new Date(d)
    return `${dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  }
  
  const showToast = (msg, type = 'success') => {
    toast.value = { message: msg, type }
    setTimeout(() => (toast.value = null), 3000)
  }
  
  const copySecret = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(`${label} copied to clipboard`)
    } catch {
      showToast('Failed to copy', 'error')
    }
  }
  
  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────
  const openReasonModal = () => {
    store.clearError()
    showReasonModal.value = true
  }
  
  const onReasonSubmit = async (reason) => {
    const res = await store.viewWallet(route.params.id, reason)
    if (res.success) {
      showReasonModal.value = false
      showToast('Data decrypted')
    }
    // errors surface through store.state.error → modal's errorMessage prop
  }
  
  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  onMounted(() => {
    store.clearCurrent()
    // Load metadata only (list-shape) — no decrypt until admin provides a reason.
    store.fetchWallets({ page: 1, limit: 100 }).then(() => {
      const match = store.state.wallets.find((w) => w._id === route.params.id)
      if (match) state.current = match
    })
  })
  
  // Local-only state assignment (in case fetchWallets didn't include this id)
  const state = store.state
  </script>
  
  <style scoped>
  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.3);
    border-radius: 10px;
  }
  </style>