<template>
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="modelValue"
          class="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="close"
        >
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
          >
            <div
              v-if="modelValue"
              class="w-full max-w-md rounded-3xl overflow-hidden
                     bg-white dark:bg-[#0F1B4C]
                     border border-gray-100 dark:border-white/[0.06]
                     shadow-2xl shadow-black/40"
            >
              <!-- Header -->
              <div class="relative p-6 pb-4">
                <button
                  @click="close"
                  class="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center
                         bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.12]"
                >
                  <i class="bi bi-x-lg text-gray-600 dark:text-white/60 text-sm"></i>
                </button>
  
                <div class="flex flex-col items-center text-center">
                  <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4
                              bg-amber-500/10 dark:bg-amber-500/[0.08]">
                    <i class="bi bi-shield-lock-fill text-amber-500 text-3xl"></i>
                  </div>
                  <h3 class="font-oswald font-bold text-xl text-gray-800 dark:text-white uppercase">
                    {{ mode === 'set' ? 'Set Transaction PIN' : 'Change Transaction PIN' }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-white/40 mt-2 max-w-xs">
                    {{ mode === 'set'
                      ? 'Choose a 4-6 digit PIN to secure your transactions.'
                      : 'Enter your current PIN and choose a new one.' }}
                  </p>
                </div>
              </div>
  
              <!-- Content -->
              <div class="px-6 pb-6 space-y-4">
                <!-- Current PIN (change mode only) -->
                <div v-if="mode === 'change'">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
                    Current PIN
                  </label>
                  <PinInput
                    ref="currentPinRef"
                    v-model="currentPin"
                    :length="pinLength"
                  />
                </div>
  
                <!-- New PIN -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
                    {{ mode === 'set' ? 'New PIN' : 'New PIN' }}
                  </label>
                  <PinInput
                    ref="newPinRef"
                    v-model="newPin"
                    :length="pinLength"
                  />
                </div>
  
                <!-- Confirm PIN -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
                    Confirm PIN
                  </label>
                  <PinInput
                    ref="confirmPinRef"
                    v-model="confirmPin"
                    :length="pinLength"
                  />
                  <p v-if="confirmPin && newPin !== confirmPin" class="text-xs text-red-400 mt-2">
                    <i class="bi bi-exclamation-circle mr-1"></i>PINs do not match
                  </p>
                </div>
  
                <!-- Password -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
                    Account Password
                  </label>
                  <div class="relative">
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Enter your account password"
                      class="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none
                             bg-gray-50 border border-gray-200 text-gray-700
                             focus:border-gold-500/50
                             dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
                             dark:focus:border-amber-500/50"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>
  
                <p v-if="error" class="text-xs text-red-400">
                  <i class="bi bi-exclamation-circle mr-1"></i>{{ error }}
                </p>
  
                <!-- Actions -->
                <div class="flex gap-3 pt-2">
                  <button
                    type="button"
                    @click="close"
                    :disabled="isSubmitting"
                    class="flex-1 py-3 rounded-xl font-semibold text-sm
                           text-gray-700 dark:text-white/70
                           bg-gray-100 dark:bg-white/[0.06]
                           hover:bg-gray-200 dark:hover:bg-white/[0.1]
                           disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <CandleButton
                    type="button"
                    variant="gold"
                    size="md"
                    :loading="isSubmitting"
                    :disabled="!canSubmit"
                    @click="submit"
                    class="flex-1"
                  >
                    <i class="bi bi-shield-check"></i>
                    {{ mode === 'set' ? 'Set PIN' : 'Update PIN' }}
                  </CandleButton>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  const props = defineProps({
    modelValue: { type: Boolean, default: false },
    mode: { type: String, default: 'set' }, // 'set' | 'change'
    pinLength: { type: Number, default: 4 },
    isSubmitting: { type: Boolean, default: false },
  });
  
  const emit = defineEmits(['update:modelValue', 'submit']);
  
  const currentPin = ref('');
  const newPin = ref('');
  const confirmPin = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const error = ref('');
  
  const currentPinRef = ref(null);
  const newPinRef = ref(null);
  
  const canSubmit = computed(() => {
    const base = password.value.length > 0 && newPin.value.length === props.pinLength && newPin.value === confirmPin.value;
    if (props.mode === 'change') {
      return base && currentPin.value.length === props.pinLength;
    }
    return base;
  });
  
  watch(
    () => props.modelValue,
    (open) => {
      if (open) {
        currentPin.value = '';
        newPin.value = '';
        confirmPin.value = '';
        password.value = '';
        error.value = '';
      }
    }
  );
  
  const close = () => {
    if (props.isSubmitting) return;
    emit('update:modelValue', false);
  };
  
  const submit = () => {
    if (!canSubmit.value) return;
    error.value = '';
    emit('submit', {
      currentPin: currentPin.value,
      newPin: newPin.value,
      password: password.value,
    });
  };
  
  const setError = (msg) => {
    error.value = msg;
  };
  
  const reset = () => {
    currentPin.value = '';
    newPin.value = '';
    confirmPin.value = '';
    password.value = '';
  };
  
  defineExpose({ setError, reset });
  </script>