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
  import { computed } from 'vue'
  import { REFERRAL_ADMIN_STATUS_META } from '~/composables/constants'
  
  const props = defineProps({
    status: { type: String, default: 'credited' },
  })
  
  const meta = computed(() =>
    REFERRAL_ADMIN_STATUS_META[props.status] ||
    REFERRAL_ADMIN_STATUS_META.credited
  )
  </script>