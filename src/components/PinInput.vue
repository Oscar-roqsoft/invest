<template>
    <div class="flex gap-2 justify-center">
      <input
        v-for="i in length"
        :key="i"
        :ref="(el) => (inputs[i - 1] = el)"
        :type="show ? 'text' : 'password'"
        inputmode="numeric"
        maxlength="1"
        :value="modelValue[i - 1] || ''"
        :disabled="disabled"
        class="w-12 h-14 text-center text-xl font-bold rounded-xl
               bg-gray-50 border-2 border-gray-200 text-gray-800
               focus:border-gold-500 focus:outline-none
               transition-all duration-200
               dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
               dark:focus:border-amber-500
               disabled:opacity-40 disabled:cursor-not-allowed"
        @input="handleInput(i - 1, $event)"
        @keydown="handleKeydown(i - 1, $event)"
        @paste="handlePaste"
      />
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    modelValue: { type: String, default: '' },
    length: { type: Number, default: 4 },
    disabled: { type: Boolean, default: false },
    show: { type: Boolean, default: false },
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const inputs = ref([]);
  
  const handleInput = (index, event) => {
    const value = event.target.value.replace(/\D/g, '');
  
    const arr = props.modelValue.padEnd(props.length, ' ').split('');
    arr[index] = value || ' ';
    emit('update:modelValue', arr.join('').trimEnd());
  
    if (value && index < props.length - 1) {
      inputs.value[index + 1]?.focus();
    }
  };
  
  const handleKeydown = (index, event) => {
    if (event.key === 'Backspace' && !props.modelValue[index] && index > 0) {
      inputs.value[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      inputs.value[index - 1]?.focus();
    }
    if (event.key === 'ArrowRight' && index < props.length - 1) {
      inputs.value[index + 1]?.focus();
    }
  };
  
  const handlePaste = (event) => {
    event.preventDefault();
    const digits = (event.clipboardData || window.clipboardData)
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, props.length);
  
    if (digits) {
      emit('update:modelValue', digits);
      const next = Math.min(digits.length, props.length - 1);
      nextTick(() => inputs.value[next]?.focus());
    }
  };
  </script>