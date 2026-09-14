<template>
    <div>
      <div class="flex items-center justify-between text-xs mb-1.5">
        <span class="font-medium text-gray-600 dark:text-white/50">{{ label }}</span>
        <span class="font-bold text-gray-800 dark:text-white">{{ Math.round(progress) }}%</span>
      </div>
      <div class="h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-white/[0.06]">
        <div
          class="h-full rounded-full transition-all duration-700"
          :style="{
            width: progress + '%',
            background: 'linear-gradient(90deg, #F5D77F 0%, #E6BB5C 50%, #D4A44A 100%)'
          }"
        ></div>
      </div>
      <p v-if="caption" class="text-xs text-gray-400 dark:text-white/30 mt-1.5">{{ caption }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    progress: { type: Number, default: 0 },
    label:    { type: String, default: 'Progress' },
    caption:  { type: String, default: '' },
  });
  </script>