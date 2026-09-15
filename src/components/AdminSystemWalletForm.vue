<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
  
      <!-- Currency + Basic -->
      <div class="rounded-2xl p-5 md:p-6 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Currency & Network</h3>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Currency *
            </label>
            <select
              v-model="form.currency"
              required
              class="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
              @change="onCurrencyChange"
            >
              <option value="" disabled>Select currency</option>
              <option v-for="c in SUPPORTED_CURRENCIES" :key="c.value" :value="c.value">
                {{ c.value }} — {{ c.name }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Display Name *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. Bitcoin"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Network *
            </label>
            <input
              v-model="form.network"
              type="text"
              required
              placeholder="e.g. TRC20"
              list="network-suggestions"
              class="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
            <datalist id="network-suggestions">
              <option v-for="n in networkSuggestions" :key="n" :value="n" />
            </datalist>
            <p class="text-xs text-gray-400 dark:text-white/30 mt-2">
              Suggested: {{ networkSuggestions.join(' · ') || '—' }}
            </p>
          </div>
  
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Sort Order
            </label>
            <input
              v-model.number="form.sortOrder"
              type="number"
              min="0"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
        </div>
      </div>
  
      <!-- Address -->
      <div class="rounded-2xl p-5 md:p-6 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-lg text-gray-800 dark:text-white">Deposit Address</h3>
          <span
            v-if="isPlaceholderAddress"
            class="px-2.5 py-1 rounded-full text-xs font-bold
                   bg-amber-500/10 text-amber-600 dark:text-amber-400"
          >
            <i class="bi bi-exclamation-triangle-fill mr-1"></i>Needs real address
          </span>
        </div>
  
        <textarea
          v-model="form.address"
          rows="2"
          required
          placeholder="Paste the wallet address users will deposit to"
          class="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none resize-none
                 bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                 dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
        ></textarea>
  
        <p class="text-xs text-gray-400 dark:text-white/30 mt-2">
          <i class="bi bi-info-circle mr-1"></i>
          Double-check the address — users will send real funds here.
        </p>
  
        <div
          v-if="form.isActive && isPlaceholderAddress"
          class="mt-3 flex items-start gap-3 p-3 rounded-xl
                 bg-red-50 border border-red-200
                 dark:bg-red-500/[0.06] dark:border-red-500/[0.15]"
        >
          <i class="bi bi-exclamation-triangle-fill text-red-500 mt-0.5"></i>
          <p class="text-xs text-red-700 dark:text-red-400">
            <strong>Do not activate this wallet</strong> with a placeholder address.
            Users could lose funds permanently.
          </p>
        </div>
      </div>
  
      <!-- Appearance -->
      <div class="rounded-2xl p-5 md:p-6 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Appearance</h3>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Emoji
            </label>
            <input
              v-model="form.emoji"
              type="text"
              maxlength="3"
              class="w-full px-4 py-3 rounded-xl text-2xl text-center outline-none
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Color
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.color"
                type="color"
                class="w-12 h-12 rounded-lg cursor-pointer border border-gray-200 dark:border-white/[0.06]"
              >
              <input
                v-model="form.color"
                type="text"
                class="flex-1 px-4 py-3 rounded-xl text-sm font-mono outline-none
                       bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                       dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
              >
            </div>
          </div>
        </div>
  
        <!-- Preview -->
        <div class="p-4 rounded-xl border border-gray-100 dark:border-white/[0.06]
                    bg-gray-50 dark:bg-white/[0.02]">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-3">
            Preview
          </p>
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white"
              :style="{ background: form.color || '#F7931A' }"
            >
              <span v-html="form.emoji || '₿'"></span>
            </div>
            <div>
              <p class="font-bold text-gray-800 dark:text-white">
                {{ form.currency || '—' }}
                <span class="text-xs font-normal text-gray-500 dark:text-white/40">· {{ form.network || '—' }}</span>
              </p>
              <p class="text-xs text-gray-500 dark:text-white/40">{{ form.name || 'Plan name' }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Settings -->
      <div class="rounded-2xl p-5 md:p-6 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Limits & Confirmations</h3>
  
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Min Deposit (USD)
            </label>
            <input
              v-model.number="form.minDeposit"
              type="number"
              min="0"
              step="1"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Required Confirmations
            </label>
            <input
              v-model.number="form.requiredConfirmations"
              type="number"
              min="1"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <div class="flex items-end">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="form.isActive"
                type="checkbox"
                class="w-5 h-5 rounded accent-emerald-500"
              >
              <span class="text-sm font-semibold text-gray-700 dark:text-white/80">
                Active (visible to users)
              </span>
            </label>
          </div>
        </div>
      </div>
  
      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          type="button"
          @click="$emit('cancel')"
          :disabled="submitting"
          class="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm
                 bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                 hover:bg-gray-200 dark:hover:bg-white/[0.1] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="!isValid || submitting"
          class="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]
                 inline-flex items-center justify-center gap-2"
          style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
        >
          <span v-if="submitting" class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
          {{ submitting ? 'Saving...' : submitLabel }}
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import {
    SUPPORTED_CURRENCIES,
    NETWORK_SUGGESTIONS,
    PLACEHOLDER_ADDRESS,
  } from '~/composables/constants'
  
  const props = defineProps({
    initial: { type: Object, default: () => ({}) },
    submitting: { type: Boolean, default: false },
    submitLabel: { type: String, default: 'Save Wallet' },
  })
  
  const emit = defineEmits(['submit', 'cancel'])
  
  // ── form state ──
  const form = ref(buildForm(props.initial))
  watch(() => props.initial, (v) => { form.value = buildForm(v) }, { deep: true })
  
  function buildForm(init) {
    return {
      currency: init.currency || '',
      name: init.name || '',
      network: init.network || '',
      address: init.address || '',
      emoji: init.emoji || '₿',
      color: init.color || '#F7931A',
      minDeposit: init.minDeposit ?? 20,
      requiredConfirmations: init.requiredConfirmations ?? 2,
      isActive: init.isActive ?? true,
      sortOrder: init.sortOrder ?? 0,
    }
  }
  
  // ── computed ──
  const networkSuggestions = computed(() =>
    NETWORK_SUGGESTIONS[form.value.currency] || []
  )
  
  const isPlaceholderAddress = computed(() =>
    !form.value.address || form.value.address === PLACEHOLDER_ADDRESS
  )
  
  const isValid = computed(() =>
    form.value.currency?.length > 0 &&
    form.value.name?.trim().length > 0 &&
    form.value.network?.trim().length > 0 &&
    form.value.address?.trim().length > 0 &&
    Number(form.value.minDeposit) >= 0 &&
    Number(form.value.requiredConfirmations) >= 1 &&
    // Prevent accidentally activating a placeholder
    !(form.value.isActive && isPlaceholderAddress.value)
  )
  
  // ── currency change → auto-fill name/emoji/color/network defaults ──
  const onCurrencyChange = () => {
    const meta = SUPPORTED_CURRENCIES.find((c) => c.value === form.value.currency)
    if (!meta) return
    if (!form.value.name) form.value.name = meta.name
    if (!form.value.network) form.value.network = meta.defaultNetwork
    if (!form.value.emoji || form.value.emoji === '₿') form.value.emoji = meta.emoji
    if (!form.value.color || form.value.color === '#F7931A') form.value.color = meta.color
  }
  
  // ── submit ──
  const handleSubmit = () => {
    if (!isValid.value) return
    const payload = { ...form.value }
    payload.currency = payload.currency.toUpperCase().trim()
    payload.name = payload.name.trim()
    payload.network = payload.network.trim()
    payload.address = payload.address.trim()
    emit('submit', payload)
  }
  </script>