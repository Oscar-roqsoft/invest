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
          class="fixed inset-0 z-[800] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
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
                <div class="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4
                            bg-red-500/10">
                  <i class="bi bi-shield-exclamation text-red-500 text-2xl"></i>
                </div>
                <h3 class="font-bold text-xl text-gray-800 dark:text-white">View Decrypted Data</h3>
                <p class="text-sm text-gray-500 dark:text-white/40 mt-1">
                  You are about to reveal sensitive recovery data
                </p>
              </div>
  
              <!-- Body -->
              <div class="px-6 space-y-4">
                <!-- Warning -->
                <div class="p-3 rounded-xl bg-red-50 border border-red-200
                            dark:bg-red-500/[0.06] dark:border-red-500/[0.15]">
                  <div class="flex items-start gap-2">
                    <i class="bi bi-exclamation-triangle-fill text-red-500 mt-0.5"></i>
                    <p class="text-xs text-red-700 dark:text-red-400">
                      This action is logged. The user will see that this wallet was viewed by an admin,
                      and the reason you enter here will be recorded against the wallet.
                    </p>
                  </div>
                </div>
  
                <!-- Wallet preview -->
                <div v-if="wallet" class="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03]
                                          border border-gray-100 dark:border-white/[0.06]">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm text-white flex-shrink-0"
                         :style="{ background: wallet.color || '#F7931A' }">
                      <span v-html="wallet.emoji || '₿'"></span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-sm text-gray-800 dark:text-white">
                        {{ wallet.coin }} · {{ wallet.network }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-white/40 truncate">
                        {{ wallet.user?.name || '' }} · {{ wallet.type }}
                      </p>
                    </div>
                  </div>
                </div>
  
                <!-- Reason -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider
                                text-gray-500 dark:text-white/40 mb-2">
                    Reason for viewing *
                  </label>
                  <textarea
                    v-model="reason"
                    rows="3"
                    maxlength="500"
                    placeholder="e.g. User reported lost seed phrase — ticket #12345"
                    :disabled="loading"
                    class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none
                           bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400
                           focus:border-amber-500/50
                           dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
                           dark:placeholder-white/30 dark:focus:border-amber-500/50
                           disabled:opacity-60"
                  ></textarea>
                  <p class="text-[11px] text-gray-400 dark:text-white/30 mt-1 text-right">
                    {{ reason.length }}/500
                  </p>
                </div>
  
                <p v-if="error" class="text-xs text-red-500">
                  <i class="bi bi-exclamation-circle mr-1"></i>{{ error }}
                </p>
              </div>
  
              <!-- Footer -->
              <div class="p-5 border-t border-gray-100 dark:border-white/[0.06]
                          bg-gray-50 dark:bg-white/[0.01] flex gap-3 mt-6">
                <button
                  @click="close"
                  :disabled="loading"
                  class="flex-1 py-3 rounded-xl font-semibold text-sm
                         bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                         disabled:opacity-50"
                >Cancel</button>
                <button
                  @click="submit"
                  :disabled="!reason.trim() || loading"
                  class="flex-1 py-3 rounded-xl font-bold text-sm text-white
                         bg-red-500 hover:bg-red-600
                         disabled:opacity-50 disabled:cursor-not-allowed
                         inline-flex items-center justify-center gap-2"
                >
                  <span v-if="loading" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  {{ loading ? 'Decrypting...' : 'Reveal Data' }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    open: { type: Boolean, default: false },
    wallet: { type: Object, default: null },
    loading: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' },
  })
  
  const emit = defineEmits(['close', 'submit'])
  
  const reason = ref('')
  const error = ref('')
  
  watch(() => props.open, (v) => {
    if (v) {
      reason.value = ''
      error.value = ''
    }
  })
  
  watch(() => props.errorMessage, (msg) => { error.value = msg || '' })
  
  const submit = () => {
    if (!reason.value.trim() || props.loading) return
    emit('submit', reason.value.trim())
  }
  
  const close = () => {
    if (props.loading) return
    emit('close')
  }
  </script>