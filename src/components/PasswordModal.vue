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
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
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
                         bg-gray-100 dark:bg-white/[0.06]
                         hover:bg-gray-200 dark:hover:bg-white/[0.12]
                         transition-colors"
                >
                  <i class="bi bi-x-lg text-gray-600 dark:text-white/60 text-sm"></i>
                </button>
  
                <div class="flex flex-col items-center text-center">
                  <div
                    class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    :class="iconBg"
                  >
                    <i :class="icon" class="text-3xl" :style="{ color: iconColor }"></i>
                  </div>
                  <h3 class="font-oswald font-bold text-xl text-gray-800 dark:text-white uppercase">
                    {{ title }}
                  </h3>
                  <p v-if="description" class="text-sm text-gray-500 dark:text-white/40 mt-2 max-w-xs">
                    {{ description }}
                  </p>
                </div>
              </div>
  
              <!-- Content -->
              <div class="px-6 pb-6">
                <slot />
  
                <!-- Password input -->
                <div class="mt-4">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
                    {{ passwordLabel }}
                  </label>
                  <div class="relative">
                    <input
                      ref="passwordInput"
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      :placeholder="passwordPlaceholder"
                      class="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none
                             bg-gray-50 border border-gray-200 text-gray-700
                             focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/10
                             dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
                             dark:focus:border-amber-500/50 dark:focus:ring-amber-500/10"
                      @keydown.enter="submit"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <p v-if="error" class="text-xs text-red-400 mt-2">
                    <i class="bi bi-exclamation-circle mr-1"></i>{{ error }}
                  </p>
                </div>
  
                <!-- Actions -->
                <div class="flex gap-3 mt-6">
                  <button
                    type="button"
                    @click="close"
                    :disabled="isSubmitting"
                    class="flex-1 py-3 rounded-xl font-semibold text-sm
                           text-gray-700 dark:text-white/70
                           bg-gray-100 dark:bg-white/[0.06]
                           hover:bg-gray-200 dark:hover:bg-white/[0.1]
                           transition-all duration-200
                           disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <CandleButton
                    type="button"
                    variant="gold"
                    size="md"
                    :loading="isSubmitting"
                    :disabled="!password"
                    @click="submit"
                    class="flex-1"
                  >
                    <i class="bi bi-check-lg"></i>
                    {{ confirmText }}
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
    title: { type: String, default: 'Confirm Action' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'bi bi-shield-lock-fill' },
    iconColor: { type: String, default: '#f59e0b' },
    iconBg: { type: String, default: 'bg-amber-500/10 dark:bg-amber-500/[0.08]' },
    passwordLabel: { type: String, default: 'Password' },
    passwordPlaceholder: { type: String, default: 'Enter your password' },
    confirmText: { type: String, default: 'Confirm' },
    isSubmitting: { type: Boolean, default: false },
  });
  
  const emit = defineEmits(['update:modelValue', 'confirm']);
  
  const password = ref('');
  const showPassword = ref(false);
  const error = ref('');
  const passwordInput = ref(null);
  
  watch(
    () => props.modelValue,
    (open) => {
      if (open) {
        password.value = '';
        error.value = '';
        showPassword.value = false;
        nextTick(() => passwordInput.value?.focus());
      }
    }
  );
  
  const close = () => {
    if (props.isSubmitting) return;
    emit('update:modelValue', false);
  };
  
  const submit = () => {
    if (!password.value) {
      error.value = 'Password is required';
      return;
    }
    error.value = '';
    emit('confirm', password.value);
  };
  
  const setError = (msg) => {
    error.value = msg;
  };
  
  defineExpose({ setError });
  </script>