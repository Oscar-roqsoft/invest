<template>
    <DashboardLayout>
      <!-- Header -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-amber-500/10">
              <i class="bi bi-wallet2 text-amber-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Deposit Wallets</h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                Manage the addresses users deposit to
              </p>
            </div>
          </div>
  
          <div class="flex items-center gap-2">
            <button
              @click="seedDefaults"
              :disabled="store.state.isSeeding"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
                     bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
            >
              <span v-if="store.state.isSeeding" class="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
              <i v-else class="bi bi-cloud-download"></i>
              Seed Defaults
            </button>
            <NuxtLink
              to="/dashboard/admin/wallets/new"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                     hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
            >
              <i class="bi bi-plus-circle"></i>
              New Wallet
            </NuxtLink>
          </div>
        </div>
      </div>
  
      <!-- Warning: placeholder addresses -->
      <div
        v-if="store.needsAddress.length"
        class="mb-4 flex items-start gap-3 p-4 rounded-2xl
               bg-amber-500/[0.06] border border-amber-500/[0.15]"
      >
        <i class="bi bi-exclamation-triangle-fill text-amber-500 text-lg mt-0.5"></i>
        <div class="flex-1">
          <p class="text-sm font-bold text-amber-600 dark:text-amber-400">
            {{ store.needsAddress.length }} wallet{{ store.needsAddress.length === 1 ? '' : 's' }} need a real address
          </p>
          <p class="text-xs text-gray-600 dark:text-white/60 mt-1">
            Seeded wallets ship with the placeholder <code class="font-mono">REPLACE_WITH_REAL_ADDRESS</code>.
            Replace before activating.
          </p>
        </div>
      </div>
  
      <!-- Stat cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05]">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Total</p>
          <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ store.totalWallets }}</p>
        </div>
        <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05]">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Active</p>
          <p class="text-2xl font-bold text-emerald-500">{{ store.activeWallets.length }}</p>
        </div>
        <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05]">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Usable</p>
          <p class="text-2xl font-bold text-blue-500">{{ store.usableWallets.length }}</p>
        </div>
        <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05]">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Need address</p>
          <p class="text-2xl font-bold text-amber-500">{{ store.needsAddress.length }}</p>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="rounded-2xl p-4 mb-4 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="flex flex-wrap gap-3">
          <select
            v-model="store.state.filters.currency"
            @change="applyFilters"
            class="px-4 py-2.5 rounded-xl text-sm cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-800
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option value="all">All Currencies</option>
            <option v-for="c in SUPPORTED_CURRENCIES" :key="c.value" :value="c.value">
              {{ c.value }} — {{ c.name }}
            </option>
          </select>
  
          <select
            v-model="store.state.filters.isActive"
            @change="applyFilters"
            class="px-4 py-2.5 rounded-xl text-sm cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-800
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="true">Active only</option>
            <option value="false">Inactive only</option>
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
      <div v-if="store.state.isLoading && !store.state.walletsLoaded" class="space-y-3">
        <div
          v-for="i in 5"
          :key="i"
          class="rounded-2xl p-5 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse"
        >
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-gray-200 dark:bg-white/[0.06]"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-white/[0.06] rounded w-1/4"></div>
              <div class="h-3 bg-gray-100 dark:bg-white/[0.04] rounded w-1/3"></div>
            </div>
            <div class="h-9 w-24 bg-gray-200 dark:bg-white/[0.06] rounded-xl"></div>
          </div>
        </div>
      </div>
  
      <!-- Empty -->
      <div
        v-else-if="!store.hasWallets"
        class="rounded-2xl p-12 text-center bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05]"
      >
        <i class="bi bi-inbox text-5xl text-gray-300 dark:text-white/20"></i>
        <p class="font-semibold text-gray-700 dark:text-white/70 mt-4">No wallets configured</p>
        <p class="text-sm text-gray-500 dark:text-white/40 mt-1 mb-5">
          Seed the defaults to bootstrap common currencies, then replace their addresses.
        </p>
        <button
          @click="seedDefaults"
          :disabled="store.state.isSeeding"
          class="px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50"
          style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%); color: #020862;"
        >
          <i class="bi bi-cloud-download mr-1"></i> Seed Defaults
        </button>
      </div>
  
      <!-- List -->
      <div v-else class="space-y-3">
        <div
          v-for="w in store.state.wallets"
          :key="w._id"
          class="rounded-2xl p-4 md:p-5 bg-white border border-gray-100 shadow-sm
                 dark:bg-[#101A47] dark:border-white/[0.05]
                 transition-all duration-200 hover:shadow-md"
          :class="!w.isActive ? 'opacity-60' : ''"
        >
          <div class="flex flex-wrap items-center gap-4">
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-2xl text-white"
              :style="{ background: w.color || '#F7931A' }"
            >
              <span v-html="w.emoji || '₿'"></span>
            </div>
  
            <div class="flex-1 min-w-[200px]">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <h4 class="font-bold text-lg text-gray-800 dark:text-white">
                  {{ w.currency }} <span class="text-sm font-normal text-gray-500 dark:text-white/40">· {{ w.network }}</span>
                </h4>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  :class="w.isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-white/40'"
                >
                  {{ w.isActive ? 'ACTIVE' : 'INACTIVE' }}
                </span>
                <span
                  v-if="isPlaceholder(w)"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold
                         bg-amber-500/10 text-amber-600 dark:text-amber-400"
                >
                  <i class="bi bi-exclamation-triangle-fill mr-1"></i>NEEDS ADDRESS
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-white/40 mb-1">{{ w.name }}</p>
              <p class="text-xs text-gray-400 dark:text-white/30 font-mono truncate max-w-md">
                {{ shortAddress(w.address) }}
              </p>
            </div>
  
            <div class="flex items-center gap-6">
              <div>
                <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40">Min</p>
                <p class="font-bold text-gray-800 dark:text-white">${{ formatMoney(w.minDeposit, 0) }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40">Confs</p>
                <p class="font-bold text-gray-800 dark:text-white">{{ w.requiredConfirmations }}</p>
              </div>
              <div class="hidden md:block">
                <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40">Sort</p>
                <p class="font-bold text-gray-800 dark:text-white">{{ w.sortOrder }}</p>
              </div>
            </div>
  
            <div class="flex items-center gap-2">
              <button
                @click="toggle(w)"
                :disabled="store.state.isSubmitting"
                class="w-10 h-10 rounded-xl flex items-center justify-center transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
                :class="w.isActive
                  ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'"
                :title="w.isActive ? 'Deactivate' : 'Activate'"
              >
                <i :class="w.isActive ? 'bi bi-pause-circle' : 'bi bi-play-circle'"></i>
              </button>
  
              <NuxtLink
                :to="`/dashboard/admin/wallets/${w._id}/edit`"
                class="w-10 h-10 rounded-xl flex items-center justify-center transition-all
                       bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                title="Edit"
              >
                <i class="bi bi-pencil-square"></i>
              </NuxtLink>
  
              <button
                @click="confirmDelete(w)"
                :disabled="store.state.isSubmitting"
                class="w-10 h-10 rounded-xl flex items-center justify-center transition-all
                       bg-red-500/10 text-red-500 hover:bg-red-500/20
                       disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Delete confirm -->
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="deleteTarget"
          class="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="deleteTarget = null"
        >
          <div class="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl
                      bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">
            <div class="p-6 text-center">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                <i class="bi bi-exclamation-triangle-fill text-red-500 text-2xl"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2">Delete wallet?</h3>
              <p class="text-sm text-gray-500 dark:text-white/50 mb-5">
                The <strong class="text-gray-800 dark:text-white">{{ deleteTarget.currency }} · {{ deleteTarget.network }}</strong>
                address will be removed. Users won't be able to deposit to it any more.
              </p>
              <div class="flex gap-3">
                <button
                  @click="deleteTarget = null"
                  class="flex-1 py-2.5 rounded-xl font-semibold text-sm
                         bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70"
                >Cancel</button>
                <button
                  @click="doDelete"
                  :disabled="store.state.isSubmitting"
                  class="flex-1 py-2.5 rounded-xl font-bold text-sm
                         bg-red-500 text-white hover:bg-red-600 disabled:opacity-50
                         inline-flex items-center justify-center gap-2"
                >
                  <span v-if="store.state.isSubmitting" class="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Delete
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
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[600] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3"
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
  import { useAdminWalletStore } from '~/stores/adminWallet'
  import { SUPPORTED_CURRENCIES, PLACEHOLDER_ADDRESS } from '~/composables/constants'
  
  definePageMeta({ layout: 'dashboard', middleware: 'admin' })
  
  const store = useAdminWalletStore()
  const deleteTarget = ref(null)
  const toast = ref(null)
  
  const hasFilters = computed(() =>
    store.state.filters.currency !== 'all' || store.state.filters.isActive !== 'all'
  )
  
  const formatMoney = (n, decimals = 2) =>
    Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  
  const shortAddress = (a) => {
    if (!a) return '—'
    if (a.length <= 24) return a
    return `${a.slice(0, 12)}…${a.slice(-10)}`
  }
  
  const isPlaceholder = (w) =>
    !w.address || w.address === PLACEHOLDER_ADDRESS
  
  const showToast = (message, type = 'success') => {
    toast.value = { message, type }
    setTimeout(() => (toast.value = null), 3000)
  }
  
  // ── actions ──
  const applyFilters = () => store.fetchWallets()
  
  const resetFilters = async () => {
    store.resetFilters()
    await store.fetchWallets()
  }
  
  const toggle = async (w) => {
    const res = await store.toggleWallet(w._id)
    if (res.success) showToast(res.message || 'Updated')
    else showToast(res.message || 'Failed', 'error')
  }
  
  const confirmDelete = (w) => { deleteTarget.value = w }
  
  const doDelete = async () => {
    if (!deleteTarget.value) return
    const res = await store.deleteWallet(deleteTarget.value._id)
    if (res.success) {
      showToast('Wallet deleted')
      deleteTarget.value = null
    } else {
      showToast(res.message || 'Failed', 'error')
    }
  }
  
  const seedDefaults = async () => {
    const res = await store.seedDefaults()
    if (res.success) showToast(`${res.created} wallets created`)
    else showToast(res.message || 'Seeding failed', 'error')
  }
  
  // ── init ──
  onMounted(() => store.fetchWallets())
  </script>