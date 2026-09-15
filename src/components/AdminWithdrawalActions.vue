<template>
    <div class="flex flex-wrap items-center gap-2" :class="compact ? '' : 'gap-3'">
      <!-- APPROVE -->
      <button
        v-if="actions.approve"
        @click="$emit('approve')"
        :disabled="disabled"
        class="inline-flex items-center gap-2 rounded-xl font-bold transition-all
               disabled:opacity-50 disabled:cursor-not-allowed
               hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02]"
        :class="compact
          ? 'px-3 py-2 text-xs bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
          : 'px-5 py-2.5 text-sm bg-emerald-500 text-white'"
      >
        <i class="bi bi-check-circle"></i> Approve
      </button>
  
      <!-- PROCESS -->
      <button
        v-if="actions.process"
        @click="$emit('process')"
        :disabled="disabled"
        class="inline-flex items-center gap-2 rounded-xl font-bold transition-all
               disabled:opacity-50 disabled:cursor-not-allowed
               hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]"
        :class="compact
          ? 'px-3 py-2 text-xs bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400'
          : 'px-5 py-2.5 text-sm bg-blue-500 text-white'"
      >
        <i class="bi bi-arrow-repeat"></i> Mark Processing
      </button>
  
      <!-- COMPLETE -->
      <button
        v-if="actions.complete"
        @click="$emit('complete')"
        :disabled="disabled"
        class="inline-flex items-center gap-2 rounded-xl font-bold transition-all
               disabled:opacity-50 disabled:cursor-not-allowed
               hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02]"
        :class="compact
          ? 'px-3 py-2 text-xs bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
          : 'px-5 py-2.5 text-sm bg-emerald-600 text-white'"
      >
        <i class="bi bi-check-all"></i> Complete
      </button>
  
      <!-- REJECT -->
      <button
        v-if="actions.reject"
        @click="$emit('reject')"
        :disabled="disabled"
        class="inline-flex items-center gap-2 rounded-xl font-bold transition-all
               disabled:opacity-50 disabled:cursor-not-allowed
               hover:shadow-lg hover:shadow-red-500/30 hover:scale-[1.02]"
        :class="compact
          ? 'px-3 py-2 text-xs bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400'
          : 'px-5 py-2.5 text-sm bg-red-500 text-white'"
      >
        <i class="bi bi-x-circle"></i> Reject
      </button>
  
      <!-- Terminal state -->
      <span
        v-if="!hasAnyAction"
        class="text-xs text-gray-400 dark:text-white/30 italic"
      >
        No actions available
      </span>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { WITHDRAWAL_TRANSITIONS } from '~/composables/constants'
  
  const props = defineProps({
    status: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    compact: { type: Boolean, default: false },
  })
  
  defineEmits(['approve', 'process', 'complete', 'reject'])
  
  const actions = computed(() =>
    WITHDRAWAL_TRANSITIONS[props.status] || {}
  )
  
  const hasAnyAction = computed(() =>
    Object.values(actions.value).some(Boolean)
  )
  </script>