<template>
    <DashboardLayout>
      <!-- ─────── HEADER ─────── -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/dashboard/secure-wallet"
              class="w-10 h-10 rounded-xl flex items-center justify-center
                     bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]
                     transition-colors"
            >
              <i class="bi bi-arrow-left text-gray-600 dark:text-white/60"></i>
            </NuxtLink>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">
                Import Wallet
              </h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                Choose your wallet brand to continue
              </p>
            </div>
          </div>
  
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 px-3 py-2 rounded-xl
                        bg-emerald-50 border border-emerald-200
                        dark:bg-emerald-500/[0.08] dark:border-emerald-500/[0.15]">
              <i class="bi bi-shield-lock-fill text-emerald-500 text-sm"></i>
              <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                Encrypted at rest
              </span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- ─────── SEARCH ─────── -->
      <div class="rounded-2xl p-4 mb-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="relative">
          <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search wallet brand..."
            class="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all
                   bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400
                   focus:border-amber-500/50
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
                   dark:placeholder-white/30 dark:focus:border-amber-500/50"
          >
        </div>
      </div>
  
      <!-- ─────── BRAND GRID ─────── -->
      <div v-if="filteredBrands.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <button
          v-for="brand in filteredBrands"
          :key="brand.slug"
          @click="openBrand(brand)"
          class="group relative rounded-2xl p-5 transition-all duration-300
                 bg-white border border-gray-100 shadow-sm
                 hover:-translate-y-1 hover:shadow-lg hover:border-amber-300
                 dark:bg-[#101A47] dark:border-white/[0.05]
                 dark:hover:border-amber-500/30 dark:hover:shadow-lg"
        >
          <!-- Icon -->
          <div class="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3
                      bg-gray-50 dark:bg-white/[0.06]
                      overflow-hidden relative">
            <img
              v-if="!brokenIcons[brand.slug]"
              :src="brand.icon"
              :alt="brand.name"
              class="w-10 h-10 object-contain"
              @error="markBroken(brand.slug)"
            >
            <div
              v-else
              class="w-full h-full flex items-center justify-center font-bold text-white text-lg"
              :style="{ background: brandFallbackColor(brand.name) }"
            >
              {{ initials(brand.name) }}
            </div>
          </div>
  
          <!-- Name -->
          <p class="font-semibold text-sm text-center text-gray-800 dark:text-white truncate">
            {{ brand.name }}
          </p>
  
          <!-- Chevron hint -->
          <i class="bi bi-arrow-right absolute bottom-3 right-3 text-xs text-gray-300
                    dark:text-white/20 group-hover:text-amber-500 transition-colors"></i>
        </button>
      </div>
  
      <!-- ─────── EMPTY ─────── -->
      <div
        v-else
        class="rounded-2xl p-12 text-center
               bg-white border border-gray-100
               dark:bg-[#101A47] dark:border-white/[0.05]"
      >
        <i class="bi bi-search text-5xl text-gray-300 dark:text-white/20"></i>
        <p class="font-semibold text-gray-700 dark:text-white/70 mt-4">
          No wallets found
        </p>
        <p class="text-sm text-gray-500 dark:text-white/40 mt-1">
          Try a different search term
        </p>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="mt-5 px-5 py-2.5 rounded-xl font-bold text-sm
                 bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                 hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all"
        >
          Clear search
        </button>
      </div>
  
      <!-- ─────── CAN'T FIND WALLET ─────── -->
      <div class="mt-6 rounded-2xl p-5
                  bg-gradient-to-r from-amber-500/[0.06] to-amber-500/[0.02]
                  border border-amber-500/[0.15]">
        <div class="flex items-start gap-3">
          <i class="bi bi-info-circle-fill text-amber-500 text-lg mt-0.5"></i>
          <div class="flex-1">
            <p class="font-bold text-sm text-gray-800 dark:text-white">
              Don't see your wallet?
            </p>
            <p class="text-xs text-gray-600 dark:text-white/60 mt-1">
              You can still import using any wallet brand — the import form lets you pick
              the coin and network manually.
            </p>
            <button
              @click="openBrand({ slug: 'custom', name: 'Custom Wallet', icon: '' })"
              class="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg
                     font-bold text-xs transition-all
                     bg-amber-500/10 text-amber-600 hover:bg-amber-500/20
                     dark:text-amber-400"
            >
              <i class="bi bi-plus-circle"></i> Import as Custom
            </button>
          </div>
        </div>
      </div>
  
      <!-- ─────── IMPORT MODAL ─────── -->
      <SecureWalletImportModal
        :open="!!selectedBrand"
        :brand="selectedBrand"
        @close="selectedBrand = null"
        @imported="onImported"
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
  import { ref, computed, onMounted, reactive } from 'vue'
  import { useSecureWalletStore } from '~/stores/secureWallet'
  import { SECURE_WALLET_BRANDS } from '~/composables/constants'
  
  definePageMeta({ layout: 'dashboard' })
  
  const store = useSecureWalletStore()
  const searchQuery = ref('')
  const selectedBrand = ref(null)
  const toast = ref(null)
  
  // Tracks icons that failed to load (falls back to initials avatar)
  const brokenIcons = reactive({})
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const filteredBrands = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return SECURE_WALLET_BRANDS
    return SECURE_WALLET_BRANDS.filter((b) =>
      b.name.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q)
    )
  })
  
  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────
  const markBroken = (slug) => { brokenIcons[slug] = true }
  
  const initials = (name) => {
    const parts = String(name || '').trim().split(/\s+/)
    if (parts.length === 0) return '?'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  
  // Deterministic pastel color from name
  const brandFallbackColor = (name) => {
    const palette = [
      '#F7931A', '#627EEA', '#26A17B', '#2775CA', '#F3BA2F', '#14F195',
      '#8247E5', '#EF4444', '#10B981', '#06B6D4', '#8B5CF6', '#EC4899',
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) >>> 0
    }
    return palette[hash % palette.length]
  }
  
  const showToast = (msg, type = 'success') => {
    toast.value = { message: msg, type }
    setTimeout(() => (toast.value = null), 3000)
  }
  
  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────
  const openBrand = (brand) => { selectedBrand.value = brand }
  
  const onImported = () => {
    selectedBrand.value = null
    showToast('Wallet imported successfully')
    // Bounce back to the list after a beat so the user sees their new wallet
    setTimeout(() => navigateTo('/dashboard/secure-wallet'), 1200)
  }
  
  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  onMounted(async () => {
    // If user landed here directly (bookmark), verify they're allowed
    if (!store.state.statusLoaded) {
      await store.fetchStatus()
    }
    if (store.state.statusLoaded && !store.state.enabled) {
      // Feature off — kick them back to the landing page which shows the notice
      navigateTo('/dashboard/secure-wallet')
    }
  })
  </script>