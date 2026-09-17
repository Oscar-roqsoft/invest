<template>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="open"
          class="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          @click.self="close"
        >
          <Transition
            appear
            enter-active-class="transition duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
          >
            <div class="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl
                        bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">
  
              <!-- Header -->
              <div class="p-6 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/10">
                    <i class="bi bi-magic text-amber-500 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-xl text-gray-800 dark:text-white">Generate Card for User</h3>
                    <p class="text-sm text-gray-500 dark:text-white/40">
                      Admin bypasses the $5,000 balance requirement
                    </p>
                  </div>
                  <button
                    @click="close"
                    :disabled="store.state.isSubmitting"
                    class="w-9 h-9 rounded-full flex items-center justify-center
                           bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]
                           disabled:opacity-50"
                  >
                    <i class="bi bi-x-lg text-gray-600 dark:text-white/60 text-sm"></i>
                  </button>
                </div>
              </div>
  
              <!-- Body -->
              <div class="p-6 space-y-5">
  
                <!-- STEP 1: pick a user -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
                    Select User *
                  </label>
  
                  <!-- Selected user chip -->
                  <div
                    v-if="selectedUser"
                    class="flex items-center gap-3 p-3 rounded-xl mb-2
                           bg-emerald-50 border border-emerald-200
                           dark:bg-emerald-500/[0.06] dark:border-emerald-500/[0.15]"
                  >
                    <div class="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {{ initials(selectedUser) }}
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-sm text-gray-800 dark:text-white truncate">
                        {{ selectedUser.name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-white/40 truncate">
                        {{ selectedUser.email }}
                      </p>
                    </div>
                    <button
                      type="button"
                      @click="clearUser"
                      :disabled="store.state.isSubmitting"
                      class="w-7 h-7 rounded-full flex items-center justify-center
                             hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400
                             disabled:opacity-50"
                    >
                      <i class="bi bi-x-lg text-xs"></i>
                    </button>
                  </div>
  
                  <!-- Search box -->
                  <div v-else class="relative">
                    <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"></i>
                    <input
                      v-model="userSearch"
                      @input="debouncedSearch"
                      type="text"
                      placeholder="Search user by name or email..."
                      class="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all
                             bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                             dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
                    >
  
                    <!-- Dropdown results -->
                    <div
                      v-if="userResults.length"
                      class="absolute left-0 right-0 top-full mt-2 max-h-64 overflow-y-auto
                             rounded-xl shadow-2xl z-10
                             bg-white dark:bg-[#0F1B4C] border border-gray-100 dark:border-white/[0.08]"
                    >
                      <button
                        v-for="u in userResults"
                        :key="u._id"
                        type="button"
                        @click="pickUser(u)"
                        class="w-full flex items-center gap-3 px-4 py-3 text-left
                               hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors
                               border-b border-gray-100 dark:border-white/[0.04] last:border-0"
                      >
                        <div class="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <span class="text-xs font-bold text-amber-600 dark:text-amber-400">
                            {{ initials(u) }}
                          </span>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-bold text-sm text-gray-800 dark:text-white truncate">
                            {{ u.name || '—' }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-white/40 truncate">{{ u.email }}</p>
                        </div>
                        <span
                          class="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          :class="u.isBanned
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'"
                        >
                          {{ u.isBanned ? 'Banned' : 'Active' }}
                        </span>
                      </button>
                    </div>
  
                    <!-- Loading state -->
                    <div
                      v-if="searchingUsers"
                      class="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <span class="w-4 h-4 block rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></span>
                    </div>
                  </div>
  
                  <!-- Hint -->
                  <p v-if="!selectedUser && !userResults.length && userSearch.length >= 2 && !searchingUsers"
                     class="text-xs text-gray-400 dark:text-white/30 mt-2">
                    No users found
                  </p>
                </div>
  
                <!-- STEP 2: choose tier -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
                    Card Tier *
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      v-for="t in CARD_TIERS"
                      :key="t.value"
                      type="button"
                      @click="tier = t.value"
                      :disabled="!!selectedUser && userHasTier(t.value)"
                      class="relative p-4 rounded-xl border-2 transition-all text-left
                             disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:hover:border-gray-100 dark:disabled:hover:border-white/[0.06]"
                      :class="tier === t.value && !userHasTier(t.value)
                        ? 'border-amber-500 bg-amber-500/5'
                        : 'border-gray-100 dark:border-white/[0.06] hover:border-amber-300'"
                    >
                      <!-- Mini visual -->
                      <div
                        class="aspect-[1.586/1] rounded-lg mb-3 flex items-center justify-center"
                        :style="{ background: t.gradient, color: t.textColor }"
                      >
                        <i :class="t.icon" class="text-xl"></i>
                      </div>
                      <p class="font-bold text-sm text-gray-800 dark:text-white">{{ t.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-white/40">{{ t.tagline }}</p>
  
                      <!-- Already has badge -->
                      <span
                        v-if="selectedUser && userHasTier(t.value)"
                        class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold
                               bg-gray-200 text-gray-600 dark:bg-white/[0.08] dark:text-white/60"
                      >
                        Has it
                      </span>
  
                      <!-- Selected check -->
                      <div
                        v-if="tier === t.value && !userHasTier(t.value)"
                        class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-lg"
                      >
                        <i class="bi bi-check-lg text-white text-xs"></i>
                      </div>
                    </button>
                  </div>
                </div>
  
                <!-- Warning -->
                <div
                  v-if="selectedUser && !userMeetsBalance"
                  class="p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/[0.15]"
                >
                  <div class="flex items-start gap-2">
                    <i class="bi bi-shield-fill-exclamation text-amber-500 mt-0.5"></i>
                    <div class="text-xs">
                      <p class="font-bold text-amber-600 dark:text-amber-400 mb-0.5">
                        User doesn't meet the balance requirement
                      </p>
                      <p class="text-gray-600 dark:text-white/60">
                        {{ selectedUser.name }} has
                        <strong>${{ formatMoney(selectedUser.balances?.USD) }}</strong> —
                        below the $5,000 threshold. You're overriding this as admin.
                      </p>
                    </div>
                  </div>
                </div>
  
                <!-- Error -->
                <p v-if="error" class="text-xs text-red-500">
                  <i class="bi bi-exclamation-circle mr-1"></i>{{ error }}
                </p>
              </div>
  
              <!-- Footer -->
              <div class="p-5 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.01]
                          flex gap-3">
                <button
                  @click="close"
                  :disabled="store.state.isSubmitting"
                  class="flex-1 py-3 rounded-xl font-semibold text-sm
                         bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                         disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  @click="submit"
                  :disabled="!canSubmit"
                  class="flex-1 py-3 rounded-xl font-bold text-sm
                         inline-flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all hover:shadow-lg"
                  style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%); color: #020862;"
                >
                  <span v-if="store.state.isSubmitting"
                        class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
                  {{ store.state.isSubmitting ? 'Generating...' : 'Generate Card' }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { useAdminCardStore } from '~/stores/adminCard'
  import { useAdminUserStore } from '~/stores/adminUser'
  import { CARD_TIERS } from '~/composables/constants'
  
  const props = defineProps({
    open: { type: Boolean, default: false },
  })
  
  const emit = defineEmits(['close', 'generated'])
  
  const store = useAdminCardStore()
  const userStore = useAdminUserStore()
  
  // ── State ──
  const userSearch = ref('')
  const userResults = ref([])
  const searchingUsers = ref(false)
  const selectedUser = ref(null)
  const tier = ref('gold')
  const error = ref('')
  
  // ── Reset on open ──
  watch(() => props.open, (v) => {
    if (v) {
      userSearch.value = ''
      userResults.value = []
      selectedUser.value = null
      tier.value = 'gold'
      error.value = ''
      store.clearError()
    }
  })
  
  // ── User search (debounced) ──
  let searchTimer = null
  const debouncedSearch = () => {
    clearTimeout(searchTimer)
    error.value = ''
    if (userSearch.value.trim().length < 2) {
      userResults.value = []
      return
    }
    searchTimer = setTimeout(runSearch, 350)
  }
  
  const runSearch = async () => {
    searchingUsers.value = true
    try {
      // Reuse admin user store's fetchUsers with a small limit
      const res = await userStore.fetchUsers({
        search: userSearch.value.trim(),
        page: 1,
        limit: 8,
      })
      userResults.value = res.success ? (userStore.state.users || []) : []
    } finally {
      searchingUsers.value = false
    }
  }
  
  const pickUser = (u) => {
    selectedUser.value = u
    userResults.value = []
    userSearch.value = ''
  }
  
  const clearUser = () => {
    selectedUser.value = null
    userSearch.value = ''
    userResults.value = []
  }
  
  // ── Helpers ──
  const initials = (user) => {
    const n = user?.name || user?.email || ''
    return n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?'
  }
  
  const formatMoney = (n) =>
    Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  
  const userMeetsBalance = computed(() =>
    Number(selectedUser.value?.balances?.USD || 0) >= 5000
  )
  
  // A user "has" a tier if their existing cards (from admin store cache) include it.
  // We rely on the backend to reject duplicates anyway — this is UI convenience.
  const userHasTier = (tierValue) => {
    if (!selectedUser.value) return false
    // We don't have the user's cards loaded here; check via backend on submit.
    // Optimistic default: allow picking; backend enforces one-per-tier.
    return false
  }
  
  // ── Submit ──
  const canSubmit = computed(() =>
    !!selectedUser.value && !!tier.value && !store.state.isSubmitting
  )
  
  const submit = async () => {
    error.value = ''
    if (!selectedUser.value) {
      error.value = 'Please select a user first'
      return
    }
  
    const res = await store.generateForUser({
      userId: selectedUser.value._id,
      tier: tier.value,
    })
  
    if (res.success) {
      emit('generated', res.card)
      close()
    } else {
      error.value = res.message || 'Failed to generate card'
    }
  }
  
  const close = () => {
    if (store.state.isSubmitting) return
    emit('close')
  }
  </script>