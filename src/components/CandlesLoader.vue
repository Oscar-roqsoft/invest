<template>
    <div v-if="visible" class="candles-loader-overlay fixed inset-0 z-[1000] bg-primary-900/70 flex items-center justify-center">
      <div class="candles-loader inline-flex py-5">
        <div 
          v-for="i in 4" 
          :key="i"
          class="candles-loader-candle w-3.5 rounded-xl bg-gold-500"
          :style="{ 
            animationDelay: (i - 1) * 0.25 + 's',
            height: i === 1 ? '28px' : i === 2 ? '28px' : i === 3 ? '28px' : '28px',
            transform: i % 2 === 0 ? 'translateY(-8px)' : 'translateY(8px)'
          }"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  })
  </script>
  
  <style scoped>
  .candles-loader-candle {
    margin-right: 8px;
    animation: candlesLoader 1s ease-in-out infinite;
  }
  
  .candles-loader-candle:last-of-type {
    margin-right: 0;
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
      box-shadow: 0 -12px 0 #bb914a, 0 12px 0 #bb914a;
    }
  }
  </style>