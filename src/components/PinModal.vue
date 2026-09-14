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
            <div
              class="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl
                     bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]"
              :class="shake ? 'animate-shake' : ''"
            >
              <!-- Header -->
              <div class="p-6 pb-4 text-center">
                <div class="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4
                            bg-amber-500/10">
                  <i class="bi bi-shield-lock text-amber-500 text-2xl"></i>
                </div>
                <h3 class="font-bold text-xl text-gray-800 dark:text-white">Enter Your PIN</h3>
                <p class="text-sm text-gray-500 dark:text-white/40 mt-1">
                  Confirm this withdrawal with your 4-digit PIN
                </p>
              </div>
  
              <!-- PIN dots -->
              <div class="flex justify-center gap-3 mb-4 px-6">
                <div
                  v-for="i in PIN_LENGTH"
                  :key="i"
                  class="w-12 h-12 rounded-xl flex items-center justify-center
                         border-2 transition-all duration-200"
                  :class="[
                    digits.length >= i
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-gray-200 dark:border-white/[0.08]',
                    error ? 'border-red-500 bg-red-500/10' : ''
                  ]"
                >
                  <div
                    v-if="digits.length >= i"
                    class="w-3 h-3 rounded-full"
                    :class="error ? 'bg-red-500' : 'bg-amber-500'"
                  ></div>
                </div>
              </div>
  
              <!-- Hidden input (captures keyboard + mobile) -->
              <input
                ref="inputEl"
                v-model="pin"
                type="tel"
                inputmode="numeric"
                maxlength="6"
                autocomplete="one-time-code"
                class="sr-only"
                @input="onInput"
              >
  
              <!-- Error -->
              <p v-if="error" class="text-center text-sm text-red-500 px-6 mb-3">
                {{ error }}
                <span v-if="attemptsLeft > 0" class="block text-xs text-red-400 mt-1">
                  {{ attemptsLeft }} attempt{{ attemptsLeft === 1 ? '' : 's' }} remaining
                </span>
              </p>
  
              <!-- Numeric keypad -->
              <div class="grid grid-cols-3 gap-2 p-6 pt-2">
                <button
                  v-for="n in [1,2,3,4,5,6,7,8,9]"
                  :key="n"
                  @click="press(String(n))"
                  class="h-14 rounded-xl text-lg font-bold
                         bg-gray-50 hover:bg-amber-500/10
                         text-gray-800 hover:text-amber-600
                         dark:bg-white/[0.04] dark:text-white dark:hover:bg-amber-500/[0.1] dark:hover:text-amber-400
                         transition-all duration-150 active:scale-95"
                >
                  {{ n }}
                </button>
                <button
                  @click="clear"
                  class="h-14 rounded-xl text-sm font-bold
                         bg-gray-50 text-gray-500 hover:bg-gray-100
                         dark:bg-white/[0.04] dark:text-white/50 dark:hover:bg-white/[0.08]
                         transition-all active:scale-95"
                >
                  CLR
                </button>
                <button
                  @click="press('0')"
                  class="h-14 rounded-xl text-lg font-bold
                         bg-gray-50 hover:bg-amber-500/10
                         text-gray-800 hover:text-amber-600
                         dark:bg-white/[0.04] dark:text-white dark:hover:bg-amber-500/[0.1] dark:hover:text-amber-400
                         transition-all active:scale-95"
                >
                  0
                </button>
                <button
                  @click="backspace"
                  class="h-14 rounded-xl flex items-center justify-center
                         bg-gray-50 text-gray-500 hover:bg-gray-100
                         dark:bg-white/[0.04] dark:text-white/50 dark:hover:bg-white/[0.08]
                         transition-all active:scale-95"
                >
                  <i class="bi bi-backspace"></i>
                </button>
              </div>
  
              <!-- Actions -->
              <div class="p-4 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.01]
                          flex gap-3">
                <button
                  @click="close"
                  class="flex-1 py-3 rounded-xl font-bold text-sm
                         bg-gray-100 text-gray-700 hover:bg-gray-200
                         dark:bg-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.1]"
                >
                  Cancel
                </button>
                <button
                  @click="submit"
                  :disabled="digits.length !== PIN_LENGTH || loading"
                  class="flex-1 py-3 rounded-xl font-bold text-sm
                         inline-flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all hover:shadow-lg hover:shadow-emerald-500/20"
                  style="background: linear-gradient(135deg, #34d399 0%, #10b981 100%); color: white;"
                >
                  <span
                    v-if="loading"
                    class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"
                  ></span>
                  {{ loading ? 'Verifying...' : 'Confirm' }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, computed, watch, nextTick } from 'vue';
  import { WITHDRAWAL_RULES } from '~/composables/constants';
  
  const PIN_LENGTH = WITHDRAWAL_RULES.PIN_LENGTH;
  
  const props = defineProps({
    open: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' },
    attemptsLeft: { type: Number, default: WITHDRAWAL_RULES.PIN_MAX_ATTEMPTS },
  });
  
  const emit = defineEmits(['close', 'submit']);
  
  const pin = ref('');
  const error = ref('');
  const shake = ref(false);
  const inputEl = ref(null);
  
  const digits = computed(() => pin.value.split(''));
  
  watch(() => props.open, async (v) => {
    if (v) {
      pin.value = '';
      error.value = '';
      await nextTick();
      inputEl.value?.focus();
    }
  });
  
  watch(() => props.errorMessage, (msg) => {
    if (!msg) return;
    error.value = msg;
    shake.value = true;
    pin.value = '';
    setTimeout(() => { shake.value = false; }, 500);
  });
  
  const press = (d) => {
    error.value = '';
    if (pin.value.length >= PIN_LENGTH) return;
    pin.value += d;
    if (pin.value.length === PIN_LENGTH) {
      // Auto-submit on 4th digit
      setTimeout(submit, 150);
    }
  };
  
  const backspace = () => {
    pin.value = pin.value.slice(0, -1);
    error.value = '';
  };
  
  const clear = () => {
    pin.value = '';
    error.value = '';
  };
  
  const onInput = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH);
    pin.value = v;
  };
  
  const submit = () => {
    if (pin.value.length !== PIN_LENGTH || props.loading) return;
    emit('submit', pin.value);
  };
  
  const close = () => {
    if (props.loading) return;
    pin.value = '';
    error.value = '';
    emit('close');
  };
  </script>
  
  <style scoped>
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
  .animate-shake {
    animation: shake 0.4s ease-in-out;
  }
  .sr-only {
    position: absolute;
    width: 1px; height: 1px; padding: 0;
    margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }
  </style>