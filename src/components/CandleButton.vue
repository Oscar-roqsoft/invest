<template>
    <button
      :type="type"
      :disabled="disabled || loading"
      :class="[
        'relative w-full rounded-xl font-oswald font-bold text-base uppercase transition-all duration-300',
        'disabled:opacity-70 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
      ]"
      @click="$emit('click', $event)"
    >
      <!-- Normal content -->
      <span v-if="!loading" class="flex items-center justify-center gap-2">
        <slot />
      </span>
  
      <!-- Candle loader -->
      <span v-else class="flex items-center justify-center">
        <span class="candles-loader flex gap-1.5">
          <span
            v-for="i in 4"
            :key="i"
            class="candles-loader-candle"
            :style="{
              animationDelay: (i - 1) * 0.15 + 's',
              height: '20px',
              width: '8px',
              borderRadius: '6px',
              background: '#bb914a',
              transform: i % 2 === 0 ? 'translateY(-4px)' : 'translateY(4px)',
            }"
          ></span>
        </span>
      </span>
    </button>
  </template>
  
  <script setup>
  defineProps({
    type: { type: String, default: 'button' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    variant: {
      type: String,
      default: 'gold',
      validator: (v) => ['gold', 'outline', 'dark'].includes(v),
    },
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['sm', 'md', 'lg'].includes(v),
    },
  })
  
  defineEmits(['click'])
  
  const sizeClasses = {
    sm: 'py-2.5 text-sm',
    md: 'py-3.5 text-base',
    lg: 'py-4 text-lg',
  }
  
  const variantClasses = {
    gold: 'bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-primary-900 shadow-lg shadow-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/50 hover:scale-[1.02]',
    outline: 'bg-transparent border-2 border-gold-500 text-gold-400 hover:bg-gold-500/10',
    dark: 'bg-white/10 text-white border border-white/10 hover:bg-white/20',
  }
  </script>
  
  <style scoped>
  .candles-loader-candle {
    animation: candlesLoader 1s ease-in-out infinite;
  }
  
  .candles-loader-candle:nth-child(2) {
    animation-delay: -0.75s;
  }
  
  .candles-loader-candle:nth-child(3) {
    animation-delay: -0.5s;
  }
  
  .candles-loader-candle:nth-child(4) {
    animation-delay: -0.25s;
  }
  
  @keyframes candlesLoader {
    0%, 100% {
      box-shadow: 0 0 0 #bb914a, 0 0 0 #bb914a;
    }
    50% {
      box-shadow: 0 -8px 0 #bb914a, 0 8px 0 #bb914a;
    }
  }
  </style>