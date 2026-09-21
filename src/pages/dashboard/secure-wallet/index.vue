<template>
    <DashboardLayout>
      <!-- ─────── HEADER ─────── -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-emerald-500/10 dark:bg-emerald-500/[0.08]">
              <i class="bi bi-shield-lock-fill text-emerald-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Secure Wallet</h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                Store your recovery phrases, private keys, and keystores securely
              </p>
            </div>
          </div>
  
          <NuxtLink
            v-if="store.state.enabled"
            to="/dashboard/secure-wallet/new"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                   hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
          >
            <i class="bi bi-plus-circle"></i> Add Wallet
          </NuxtLink>
        </div>
      </div>
  
      <!-- ─────── FEATURE DISABLED ─────── -->
      <div
        v-if="store.state.statusLoaded && !store.state.enabled"
        class="rounded-2xl p-8 md:p-12 text-center
               bg-white border border-gray-100 shadow-sm
               dark:bg-[#101A47] dark:border-white/[0.05]"
      >
        <div class="w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5">
          <i class="bi bi-lock-fill text-3xl text-amber-500"></i>
        </div>
        <h3 class="font-bold text-xl text-gray-800 dark:text-white mb-2">Feature Not Enabled</h3>
        <p class="text-sm text-gray-500 dark:text-white/40 max-w-md mx-auto">
          The secure wallet feature is not enabled for your account yet.
          Please contact support to activate it.
        </p>
      </div>
  
      <!-- ─────── LOADING ─────── -->
      <div
        v-else-if="store.state.isLoading && !store.state.walletsLoaded"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="rounded-2xl p-5 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse"
        >
          <div class="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-white/[0.06] mb-4"></div>
          <div class="h-4 w-32 bg-gray-200 dark:bg-white/[0.06] rounded mb-2"></div>
          <div class="h-3 w-24 bg-gray-100 dark:bg-white/[0.04] rounded"></div>
        </div>
      </div>
  
      <!-- ─────── WALLETS LIST ─────── -->
      <div v-else-if="store.hasWallets" class="space-y-4">
        <!-- Stats strip -->
        <div class="grid grid-cols-3 gap-3 md:gap-4">
          <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">
              Total Wallets
            </p>
            <p class="text-xl font-bold text-gray-800 dark:text-white">{{ store.state.wallets.length }}</p>
          </div>
          <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">
              Phrases
            </p>
            <p class="text-xl font-bold text-amber-500">{{ store.phraseWallets.length }}</p>
          </div>
          <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">
              Keys / Keystores
            </p>
            <p class="text-xl font-bold text-blue-500">
              {{ store.privateKeyWallets.length + store.keystoreWallets.length }}
            </p>
          </div>
        </div>
  
        <!-- Wallet cards grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="w in store.state.wallets"
            :key="w._id"
            class="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm
                   dark:bg-[#101A47] dark:border-white/[0.05]
                   transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <!-- Icon + coin -->
            <div class="flex items-start gap-3 mb-4">
              <div
                class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-2xl text-white"
                :style="{ background: coinMeta(w.coin).color }"
              >
                <span v-html="coinMeta(w.coin).emoji"></span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <h4 class="font-bold text-gray-800 dark:text-white truncate">{{ w.coin }}</h4>
                  <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                               bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-white/40">
                    {{ w.network }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-white/40 truncate">{{ w.name }}</p>
              </div>
            </div>
  
            <!-- Type badge -->
            <div class="flex items-center gap-2 mb-3">
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
                :class="typeMeta(w.type).cls"
              >
                <i :class="typeMeta(w.type).icon"></i>
                {{ typeMeta(w.type).label }}
              </span>
              <span
                v-if="w.source === 'admin'"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                       bg-purple-500/10 text-purple-500"
              >
                <i class="bi bi-shield-fill-check mr-0.5"></i>By admin
              </span>
            </div>
  
            <!-- Address -->
            <div class="rounded-lg p-3 mb-3 bg-gray-50 dark:bg-white/[0.03]">
              <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">
                Address
              </p>
              <p class="text-xs font-mono text-gray-700 dark:text-white/70 truncate" :title="w.address">
                {{ w.maskedAddress || w.address }}
              </p>
            </div>
  
            <!-- Label -->
            <p v-if="w.label" class="text-xs text-gray-500 dark:text-white/40 mb-3 truncate">
              <i class="bi bi-tag mr-1"></i>{{ w.label }}
            </p>
  
            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="confirmDelete(w)"
                :disabled="store.state.isSubmitting"
                class="flex-1 py-2 rounded-lg font-bold text-xs
                       bg-red-500/10 text-red-500 hover:bg-red-500/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       inline-flex items-center justify-center gap-1"
              >
                <i class="bi bi-trash"></i> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- ─────── EMPTY ─────── -->
      <div
        v-else-if="store.state.statusLoaded && store.state.enabled && !store.state.isLoading"
        class="rounded-2xl p-10 md:p-14 text-center
               bg-white border-2 border-dashed border-gray-200
               dark:bg-[#101A47] dark:border-white/[0.08]"
      >
        <div class="w-20 h-20 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
          <i class="bi bi-shield-plus text-3xl text-emerald-500"></i>
        </div>
        <h3 class="font-bold text-xl text-gray-800 dark:text-white mb-2">No wallets saved yet</h3>
        <p class="text-sm text-gray-500 dark:text-white/40 max-w-md mx-auto mb-6">
          Save your recovery phrase, private key, or keystore to keep it safe.
          You can only add each coin once.
        </p>
        <NuxtLink
          to="/dashboard/secure-wallet/new"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all
                 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
          style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
        >
          <i class="bi bi-plus-circle"></i> Add Your First Wallet
        </NuxtLink>
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
                <i class="bi bi-exclamation-triangle-fill text-red-500 text-2xl"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2">Remove wallet?</h3>
              <p class="text-sm text-gray-500 dark:text-white/50 mb-5">
                <strong class="text-gray-800 dark:text-white">{{ deleteTarget.coin }} · {{ deleteTarget.network }}</strong>
                will be removed. You can re-import it later.
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
                  Remove
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
  import { useSecureWalletStore } from '~/stores/secureWallet'
  import { SECURE_WALLET_COINS } from '~/composables/constants'
  
  definePageMeta({ layout: 'dashboard' })
  
  const store = useSecureWalletStore()
  const deleteTarget = ref(null)
  const toast = ref(null)
  
  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────
  const coinMeta = (coin) =>
    SECURE_WALLET_COINS.find((c) => c.coin === coin) ||
    { color: '#6B7280', emoji: '?' }
  
  const TYPE_META = {
    phrase:     { label: 'Phrase',     icon: 'bi bi-chat-quote', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    privateKey: { label: 'Private Key',icon: 'bi bi-key',        cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    keystore:   { label: 'Keystore',   icon: 'bi bi-file-lock',  cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  }
  const typeMeta = (t) => TYPE_META[t] || TYPE_META.phrase
  
  const showToast = (msg, type = 'success') => {
    toast.value = { message: msg, type }
    setTimeout(() => (toast.value = null), 3000)
  }
  
  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────
  const confirmDelete = (w) => { deleteTarget.value = w }
  
  const doDelete = async () => {
    if (!deleteTarget.value) return
    const res = await store.deleteWallet(deleteTarget.value._id)
    if (res.success) {
      showToast('Wallet removed')
      deleteTarget.value = null
    } else {
      showToast(res.message || 'Failed', 'error')
    }
  }
  
  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  onMounted(async () => {
    await store.fetchStatus()
    if (store.state.enabled) {
      await store.fetchMyWallets()
    }
  })
  </script>