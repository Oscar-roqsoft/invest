<template>
    <div class="inline-flex items-center gap-2">
      <!-- Freeze / Unfreeze -->
      <button
        v-if="card.status === 'active' || card.status === 'frozen'"
        @click="$emit('freeze')"
        :disabled="disabled"
        class="rounded-xl flex items-center justify-center transition-all
               disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          compact ? 'w-9 h-9' : 'w-10 h-10',
          card.status === 'frozen'
            ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
            : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
        ]"
        :title="card.status === 'frozen' ? 'Unfreeze' : 'Freeze'"
      >
        <i :class="card.status === 'frozen' ? 'bi bi-play-circle' : 'bi bi-snow'"></i>
      </button>
  
      <!-- Cancel -->
      <button
        v-if="card.status !== 'cancelled'"
        @click="$emit('cancel')"
        :disabled="disabled"
        class="rounded-xl flex items-center justify-center transition-all
               bg-red-500/10 text-red-500 hover:bg-red-500/20
               disabled:opacity-50 disabled:cursor-not-allowed"
        :class="compact ? 'w-9 h-9' : 'w-10 h-10'"
        title="Cancel card"
      >
        <i class="bi bi-trash"></i>
      </button>
  
      <!-- Terminal -->
      <span
        v-if="card.status === 'cancelled' || card.status === 'expired'"
        class="text-xs text-gray-400 dark:text-white/30 italic"
      >
        No actions
      </span>
    </div>
  </template>
  
  <script setup>
  defineProps({
    card: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    compact: { type: Boolean, default: false },
  })
  
  defineEmits(['freeze', 'cancel'])
  </script>