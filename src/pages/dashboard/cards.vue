<template>
    <DashboardLayout>
      <!-- ─────── HEADER ─────── -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-amber-500/10 dark:bg-amber-500/[0.08]">
              <i class="bi bi-credit-card-2-front-fill text-amber-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Virtual Cards</h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                Generate premium virtual cards (display-only)
              </p>
            </div>
          </div>
          <button
            @click="refreshAll"
            :disabled="store.state.isLoading || store.state.isLoadingEligibility"
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
  
      <!-- ─────── ELIGIBILITY STRIP ─────── -->
      <div class="rounded-2xl p-5 md:p-6 mb-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div v-if="store.state.isLoadingEligibility && !store.state.eligibilityLoaded"
             class="flex items-center gap-4 animate-pulse">
          <div class="w-12 h-12 rounded-xl bg-gray-200 dark:bg-white/[0.06]"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-40 bg-gray-200 dark:bg-white/[0.06] rounded"></div>
            <div class="h-3 w-64 bg-gray-100 dark:bg-white/[0.04] rounded"></div>
          </div>
        </div>
  
        <div v-else class="flex flex-wrap items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="eligibility.eligible
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-amber-500/10 text-amber-500'"
          >
            <i :class="eligibility.eligible ? 'bi bi-check-circle-fill' : 'bi bi-info-circle-fill'" class="text-xl"></i>
          </div>
  
          <div class="flex-1 min-w-[200px]">
            <p class="font-bold text-gray-800 dark:text-white">
              <template v-if="eligibility.eligible">You're eligible to generate a card</template>
              <template v-else>You're not eligible yet</template>
            </p>
            <p class="text-xs text-gray-500 dark:text-white/40 mt-1">
              {{ eligibility.eligible
                ? 'Choose a tier below to generate your card'
                : eligibility.reason || 'Complete the requirement below' }}
            </p>
          </div>
  
          <div class="flex items-center gap-6 ml-auto">
            <div class="text-right">
              <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">Available Balance</p>
              <p class="text-lg font-bold text-gray-800 dark:text-white">
                ${{ formatMoney(eligibility.balanceUSD) }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">Required</p>
              <p class="text-lg font-bold"
                 :class="eligibility.eligible ? 'text-emerald-500' : 'text-amber-500'">
                ${{ formatMoney(eligibility.requiredUSD) }}
              </p>
            </div>
          </div>
        </div>
  
        <!-- Progress bar -->
        <div v-if="!eligibility.eligible && !store.state.isLoadingEligibility"
             class="mt-4">
          <div class="h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-white/[0.06]">
            <div
              class="h-full rounded-full transition-all duration-700"
              :style="{
                width: eligibilityProgress + '%',
                background: 'linear-gradient(90deg, #F5D77F 0%, #E6BB5C 50%, #D4A44A 100%)',
              }"
            ></div>
          </div>
          <p class="text-xs text-gray-400 dark:text-white/30 mt-1.5">
            ${{ formatMoney(Math.max(0, (eligibility.requiredUSD || 0) - (eligibility.balanceUSD || 0))) }}
            more needed to unlock
          </p>
        </div>
      </div>
  
      <!-- ─────── MY CARDS ─────── -->
      <div v-if="store.state.isLoading && !store.state.cardsLoaded"
           class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div
          v-for="i in 2"
          :key="i"
          class="rounded-2xl p-5 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse"
        >
          <div class="aspect-[1.586/1] rounded-2xl bg-gray-200 dark:bg-white/[0.06] mb-4"></div>
          <div class="h-4 w-32 bg-gray-200 dark:bg-white/[0.06] rounded mb-2"></div>
          <div class="h-3 w-48 bg-gray-100 dark:bg-white/[0.04] rounded"></div>
        </div>
      </div>
  
      <div v-else-if="hasCards" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div
          v-for="card in store.state.cards"
          :key="card._id"
          class="rounded-2xl p-5 md:p-6
                 bg-white border border-gray-100 shadow-sm
                 dark:bg-[#101A47] dark:border-white/[0.05]"
        >
          <!-- Card visual -->
          <div class="flex justify-center mb-5">
            <VirtualCard
              :card="cardsWithRevealed[card._id] || card"
              :reveal="revealed[card._id]"
              :flipped="flipped[card._id]"
              size="md"
              @toggle-reveal="toggleReveal(card._id)"
              @flip="flipCard(card._id)"
            />
          </div>
  
          <!-- Info row -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span
                class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                :class="tierMeta(card.tier).badgeClass"
              >
                <i :class="tierMeta(card.tier).icon" class="mr-1"></i>
                {{ tierMeta(card.tier).name }}
              </span>
              <span
                class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
                :class="statusMeta(card.status).cls"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="statusMeta(card.status).dot"></span>
                {{ statusMeta(card.status).label }}
              </span>
            </div>
            <p class="text-[10px] text-gray-400 dark:text-white/30 font-mono">
              •••• {{ card.last4 }}
            </p>
          </div>
  
          <!-- Detail rows -->
          <div class="space-y-2 mb-4 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-white/40">Issued</span>
              <span class="font-semibold text-gray-800 dark:text-white">{{ formatDate(card.issuedAt) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-white/40">Expires</span>
              <span class="font-semibold text-gray-800 dark:text-white">{{ formatDate(card.expiresAt) }}</span>
            </div>
          </div>
  
          <!-- Actions -->
          <div class="flex gap-2">
            <button
              v-if="card.status === 'active' || card.status === 'frozen'"
              @click="toggleFreeze(card)"
              :disabled="store.state.isSubmitting"
              class="flex-1 py-2.5 rounded-xl font-bold text-xs transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     inline-flex items-center justify-center gap-2"
              :class="card.status === 'frozen'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'"
            >
              <i :class="card.status === 'frozen' ? 'bi bi-play-circle' : 'bi bi-snow'"></i>
              {{ card.status === 'frozen' ? 'Unfreeze' : 'Freeze' }}
            </button>
  
            <button
              @click="confirmDelete(card)"
              :disabled="store.state.isSubmitting"
              class="flex-1 py-2.5 rounded-xl font-bold text-xs transition-all
                     bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20
                     disabled:opacity-50 disabled:cursor-not-allowed
                     inline-flex items-center justify-center gap-2"
            >
              <i class="bi bi-trash"></i> Cancel Card
            </button>
          </div>
        </div>
      </div>
  
      <!-- ─────── GENERATE SECTION ─────── -->
      <div v-else-if="!hasCards && !store.state.isLoading"
           class="rounded-2xl p-6 md:p-10 text-center mb-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
          <i class="bi bi-credit-card-2-front text-3xl text-amber-500"></i>
        </div>
        <h3 class="font-bold text-xl text-gray-800 dark:text-white mb-2">No cards yet</h3>
        <p class="text-sm text-gray-500 dark:text-white/40 mb-6 max-w-md mx-auto">
          Pick a tier below to generate your first virtual card.
          <br v-if="!eligibility.eligible">
          <span v-if="!eligibility.eligible" class="text-amber-500 font-semibold">
            You need ${{ formatMoney(eligibility.requiredUSD) }} available balance.
          </span>
        </p>
      </div>
  
      <!-- Tier grid (also shown when user has some but not all cards) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="tier in CARD_TIERS"
          :key="tier.value"
          class="rounded-2xl p-6 transition-all
                 bg-white border shadow-sm
                 dark:bg-[#101A47]"
          :class="canGenerate(tier.value)
            ? 'border-gray-100 dark:border-white/[0.05] hover:-translate-y-1 hover:shadow-lg'
            : 'border-gray-100 dark:border-white/[0.05] opacity-60'"
        >
          <!-- Mini preview -->
          <div class="flex justify-center mb-5">
            <div class="w-full max-w-sm aspect-[1.586/1] rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between p-5"
                 :style="{ background: tier.gradient, color: tier.textColor }">
              <div class="flex items-start justify-between">
                <i :class="tier.icon" class="text-lg"></i>
                <span class="text-[10px] uppercase tracking-wider font-bold opacity-70">Virtual</span>
              </div>
              <div>
                <p class="font-mono text-sm tracking-widest opacity-80 mb-3">•••• •••• •••• ••••</p>
                <div class="flex items-end justify-between">
                  <div>
                    <p class="text-[9px] uppercase opacity-60 mb-0.5">Card Holder</p>
                    <p class="text-xs font-semibold uppercase">{{ userName }}</p>
                  </div>
                  <p class="text-xs font-mono opacity-80">••/••</p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Title + tagline -->
          <h4 class="font-bold text-lg text-gray-800 dark:text-white mb-1">{{ tier.name }}</h4>
          <p class="text-xs text-gray-500 dark:text-white/40 mb-4">{{ tier.tagline }}</p>
  
          <!-- Perks -->
          <ul class="space-y-2 mb-5">
            <li v-for="(perk, i) in tier.perks" :key="i"
                class="flex items-start gap-2 text-xs text-gray-600 dark:text-white/60">
              <i class="bi bi-check-circle-fill text-emerald-500 mt-0.5 flex-shrink-0"></i>
              <span>{{ perk }}</span>
            </li>
          </ul>
  
          <!-- CTA -->
          <button
            @click="generate(tier.value)"
            :disabled="!canGenerate(tier.value) || store.state.isSubmitting"
            class="w-full py-3 rounded-xl font-bold text-sm transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   hover:shadow-lg hover:scale-[1.02]
                   inline-flex items-center justify-center gap-2"
            :style="canGenerate(tier.value)
              ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;'
              : 'background: #e5e7eb; color: #6b7280;'"
          >
            <span v-if="store.state.isSubmitting" class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
            <template v-if="hasCardOfTier(tier.value)">
              <i class="bi bi-check-circle"></i> Already Generated
            </template>
            <template v-else-if="!eligibility.eligible">
              <i class="bi bi-lock"></i> Locked
            </template>
            <template v-else>
              <i class="bi bi-magic"></i> Generate {{ tier.name }}
            </template>
          </button>
        </div>
      </div>
  
      <!-- ─────── CONFIRM DELETE MODAL ─────── -->
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
                Your <strong class="text-gray-800 dark:text-white">{{ tierMeta(deleteTarget.tier).name }}</strong>
                (•••• {{ deleteTarget.last4 }}) will be permanently cancelled.
                You can generate a new one of the same tier afterward.
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
  import { ref, computed, onMounted, reactive } from 'vue'
  import { useCardStore } from '~/stores/card'
  import { useAuthStore } from '~/stores/auth'
  import { CARD_TIERS, CARD_STATUS_META } from '~/composables/constants'
  
  definePageMeta({ layout: 'dashboard' })
  
  const store = useCardStore()
  const authStore = useAuthStore()
  
  const deleteTarget = ref(null)
  const toast = ref(null)
  
  // Per-card UI state
  const revealed = reactive({})
  const flipped = reactive({})
  // When a card is revealed, we fetch the full detail and cache it here
  const cardsWithRevealed = reactive({})
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const userName = computed(() => authStore.state.user?.name || 'Card Holder')
  
  const hasCards = computed(() => store.hasCards)
  
  const eligibility = computed(() => store.state.eligibility || {
    eligible: false,
    reason: '',
    balanceUSD: 0,
    requiredUSD: 5000,
    tiers: { gold: false, black: false },
  })
  
  const eligibilityProgress = computed(() => {
    const req = eligibility.value.requiredUSD || 5000
    const bal = eligibility.value.balanceUSD || 0
    return Math.min(100, Math.round((bal / req) * 100))
  })
  
  const canGenerate = (tierValue) => {
    if (hasCardOfTier(tierValue)) return false
    return store.canGenerateTier(tierValue)
  }
  
  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────
  const formatMoney = (n) =>
    Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  
  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  const tierMeta = (t) => CARD_TIERS.find((x) => x.value === t) || CARD_TIERS[0]
  const statusMeta = (s) => CARD_STATUS_META[s] || CARD_STATUS_META.active
  
  const hasCardOfTier = (tier) => store.hasCardOfTier(tier)
  
  const showToast = (message, type = 'success') => {
    toast.value = { message, type }
    setTimeout(() => (toast.value = null), 3000)
  }
  
  // ─────────────────────────────────────────────────────────────
  // REVEAL / FLIP (per-card)
  // ─────────────────────────────────────────────────────────────
  const toggleReveal = async (cardId) => {
    // If turning off, just flip the flag
    if (revealed[cardId]) {
      revealed[cardId] = false
      return
    }
  
    // If we don't have the full detail yet, fetch it
    if (!cardsWithRevealed[cardId]) {
      const res = await store.fetchCard(cardId)
      if (!res.success) {
        showToast(res.message || 'Could not load card details', 'error')
        return
      }
      cardsWithRevealed[cardId] = res.data?.card || store.state.current
    }
  
    revealed[cardId] = true
  }
  
  const flipCard = (cardId) => {
    flipped[cardId] = !flipped[cardId]
  }
  
  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────
  const generate = async (tier) => {
    const res = await store.generateCard({ tier })
    if (res.success) {
      showToast(`${tierMeta(tier).name} generated!`)
      // Cache the full detail from the response so reveal works immediately
      if (res.card) cardsWithRevealed[res.card._id] = res.card
      // Refresh eligibility (they now have this tier)
      store.fetchEligibility({ force: true })
    } else {
      showToast(res.message || 'Generation failed', 'error')
    }
  }
  
  const toggleFreeze = async (card) => {
    const res = await store.freezeCard(card._id)
    if (res.success) showToast(res.message || 'Updated')
    else showToast(res.message || 'Failed', 'error')
  }
  
  const confirmDelete = (card) => {
    deleteTarget.value = card
  }
  
  const doDelete = async () => {
    if (!deleteTarget.value) return
    const res = await store.deleteCard(deleteTarget.value._id)
    if (res.success) {
      showToast('Card cancelled')
      deleteTarget.value = null
      // Refresh eligibility (they can now generate that tier again)
      store.fetchEligibility({ force: true })
    } else {
      showToast(res.message || 'Failed', 'error')
    }
  }
  
  const refreshAll = async () => {
    await Promise.all([
      store.fetchEligibility({ force: true }),
      store.fetchMyCards({ force: true }),
    ])
  }
  
  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  onMounted(async () => {
    await Promise.all([
      store.fetchEligibility(),
      store.fetchMyCards(),
    ])
  })
  </script>