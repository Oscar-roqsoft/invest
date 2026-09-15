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
            <div class="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl
                        bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">
  
              <!-- Header -->
              <div class="p-6 pb-4 text-center">
                <div
                  class="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
                  :class="headerColor"
                >
                  <i :class="icon" class="text-2xl"></i>
                </div>
                <h3 class="font-bold text-xl text-gray-800 dark:text-white">{{ title }}</h3>
                <p v-if="subtitle" class="text-sm text-gray-500 dark:text-white/40 mt-1">{{ subtitle }}</p>
              </div>
  
              <!-- Body -->
              <div class="px-6 space-y-4">
                <!-- Optional amount preview -->
                <div v-if="withdrawal" class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03]
                                                border border-gray-100 dark:border-white/[0.06]">
                  <div class="flex items-center justify-between text-sm mb-2">
                    <span class="text-gray-500 dark:text-white/40">Reference</span>
                    <span class="font-mono font-bold text-gray-800 dark:text-white">{{ withdrawal.reference }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm mb-2">
                    <span class="text-gray-500 dark:text-white/40">Amount</span>
                    <span class="font-bold text-gray-800 dark:text-white">${{ formatMoney(withdrawal.amountUSD) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 dark:text-white/40">To</span>
                    <span class="font-mono text-xs text-gray-700 dark:text-white/70 truncate max-w-[60%]">
                      {{ withdrawal.address }}
                    </span>
                  </div>
                </div>
  
                <!-- txHash (process / complete) -->
                <div v-if="showTxHash">
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
                    Transaction Hash
                    <span v-if="txHashRequired" class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="txHash"
                    type="text"
                    placeholder="e.g. 0xabc123..."
                    class="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none
                           bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                           dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
                  >
                </div>
  
                <!-- reason (reject) / note (others) -->
                <div v-if="showReason">
                  <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
                    {{ reasonLabel }}
                    <span v-if="reasonRequired" class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="reason"
                    rows="3"
                    :placeholder="reasonPlaceholder"
                    class="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none
                           bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                           dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
                  ></textarea>
                </div>
  
                <!-- Error -->
                <p v-if="error" class="text-xs text-red-500">
                  <i class="bi bi-exclamation-circle mr-1"></i>{{ error }}
                </p>
              </div>
  
              <!-- Footer -->
              <div class="p-5 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.01]
                          flex gap-3 mt-6">
                <button
                  @click="close"
                  :disabled="loading"
                  class="flex-1 py-3 rounded-xl font-semibold text-sm
                         bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                         hover:bg-gray-200 dark:hover:bg-white/[0.1] disabled:opacity-50"
                >Cancel</button>
                <button
                  @click="submit"
                  :disabled="!isValid || loading"
                  class="flex-1 py-3 rounded-xl font-bold text-sm
                         inline-flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all hover:shadow-lg"
                  :class="submitColor"
                >
                  <span v-if="loading" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  {{ loading ? 'Working...' : submitLabel }}
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
  
  const props = defineProps({
    open: { type: Boolean, default: false },
    title: { type: String, default: 'Confirm action' },
    subtitle: { type: String, default: '' },
    icon: { type: String, default: 'bi bi-shield-check' },
    headerColor: { type: String, default: 'bg-amber-500/10 text-amber-500' },
    submitLabel: { type: String, default: 'Confirm' },
    submitColor: { type: String, default: 'bg-emerald-500 text-white hover:bg-emerald-600' },
    loading: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' },
  
    withdrawal: { type: Object, default: null },
  
    showTxHash: { type: Boolean, default: false },
    txHashRequired: { type: Boolean, default: false },
  
    showReason: { type: Boolean, default: true },
    reasonRequired: { type: Boolean, default: false },
    reasonLabel: { type: String, default: 'Admin Note (optional)' },
    reasonPlaceholder: { type: String, default: 'Add an internal note...' },
  })
  
  const emit = defineEmits(['close', 'submit'])
  
  const txHash = ref('')
  const reason = ref('')
  const error = ref('')
  
  watch(() => props.open, (v) => {
    if (v) { txHash.value = ''; reason.value = ''; error.value = ''; }
  })
  
  watch(() => props.errorMessage, (msg) => { error.value = msg || '' })
  
  const isValid = computed(() => {
    if (props.txHashRequired && !txHash.value.trim()) return false
    if (props.reasonRequired && !reason.value.trim()) return false
    return true
  })
  
  const submit = () => {
    if (!isValid.value || props.loading) return
    emit('submit', {
      txHash: txHash.value.trim() || undefined,
      reason: reason.value.trim() || undefined,
      note: reason.value.trim() || undefined,
    })
  }
  
  const close = () => {
    if (props.loading) return
    emit('close')
  }
  
  const formatMoney = (n) =>
    Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  </script>