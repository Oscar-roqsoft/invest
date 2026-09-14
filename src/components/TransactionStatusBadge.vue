<template>
    <span
      class="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap"
      :class="classes"
    >
      <span class="w-1.5 h-1.5 rounded-full" :class="dotClasses"></span>
      {{ label }}
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    status: { type: String, default: 'pending' },
  });
  
  const MAP = {
    pending:    { label: 'Pending',    cls: 'bg-amber-50 text-amber-600 dark:bg-amber-500/[0.08] dark:text-amber-400',       dot: 'bg-amber-500' },
    confirming: { label: 'Confirming', cls: 'bg-blue-50 text-blue-600 dark:bg-blue-500/[0.08] dark:text-blue-400',           dot: 'bg-blue-500' },
    completed:  { label: 'Completed',  cls: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400', dot: 'bg-emerald-500' },
    failed:     { label: 'Failed',     cls: 'bg-red-50 text-red-600 dark:bg-red-500/[0.08] dark:text-red-400',               dot: 'bg-red-500' },
    cancelled:  { label: 'Cancelled',  cls: 'bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-white/50',             dot: 'bg-gray-400' },
    expired:    { label: 'Expired',    cls: 'bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-white/50',             dot: 'bg-gray-400' },
  };
  
  const entry = computed(() => MAP[props.status] || MAP.pending);
  const label = computed(() => entry.value.label);
  const classes = computed(() => entry.value.cls);
  const dotClasses = computed(() => entry.value.dot);
  </script>