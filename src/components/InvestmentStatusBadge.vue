<template>
    <span
      class="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap"
      :class="meta.cls"
    >
      <span class="w-1.5 h-1.5 rounded-full" :class="meta.dot"></span>
      {{ meta.label }}
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { INVESTMENT_STATUS_META } from '~/composables/constants';
  
  const props = defineProps({
    status: { type: String, default: 'active' },
  });
  
  const meta = computed(() =>
    INVESTMENT_STATUS_META[props.status] || INVESTMENT_STATUS_META.active
  );
  </script>