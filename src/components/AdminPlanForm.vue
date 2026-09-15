<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
  
      <!-- Basic info -->
      <div class="rounded-2xl p-5 md:p-6 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Basic Information</h3>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Plan Name *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. Growth"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Slug
              <span class="normal-case font-normal text-gray-400 dark:text-white/30 ml-1">
                (auto-generated from name if empty)
              </span>
            </label>
            <input
              v-model="form.slug"
              type="text"
              placeholder="growth"
              class="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <div class="md:col-span-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="2"
              placeholder="Short description shown on the plan card"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            ></textarea>
          </div>
        </div>
      </div>
  
      <!-- Returns -->
      <div class="rounded-2xl p-5 md:p-6 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Returns & Duration</h3>
  
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Daily ROI (%) *
            </label>
            <input
              v-model.number="form.dailyRoi"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Duration (days) *
            </label>
            <input
              v-model.number="form.duration"
              type="number"
              min="1"
              required
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Total ROI
            </label>
            <div class="w-full px-4 py-3 rounded-xl text-sm font-bold
                        bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
              {{ computedRoi }}%
            </div>
          </div>
        </div>
      </div>
  
      <!-- Amount range -->
      <div class="rounded-2xl p-5 md:p-6 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Investment Range (USD)</h3>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Minimum Amount *
            </label>
            <input
              v-model.number="form.minAmount"
              type="number"
              min="0"
              required
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Maximum Amount *
            </label>
            <input
              v-model.number="form.maxAmount"
              type="number"
              min="0"
              required
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
        </div>
  
        <p v-if="minMaxInvalid" class="text-xs text-red-500 mt-3">
          <i class="bi bi-exclamation-circle mr-1"></i>
          Min amount cannot be greater than max amount
        </p>
      </div>
  
      <!-- Appearance -->
      <div class="rounded-2xl p-5 md:p-6 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Appearance</h3>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Icon
            </label>
            <select
              v-model="form.icon"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
              <option v-for="o in PLAN_ICON_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
          </div>
  
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Color
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="c in PLAN_COLOR_OPTIONS"
                :key="c.value"
                type="button"
                @click="form.color = c.value"
                class="w-10 h-10 rounded-xl border-2 transition-all"
                :class="form.color === c.value
                  ? 'border-amber-500 scale-110 shadow-lg'
                  : 'border-transparent hover:scale-105'"
                :style="{ background: c.value }"
                :title="c.label"
              ></button>
            </div>
          </div>
        </div>
  
        <!-- Preview -->
        <div class="mt-5 p-4 rounded-xl border border-gray-100 dark:border-white/[0.06]
                    bg-gray-50 dark:bg-white/[0.02]">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-3">
            Preview
          </p>
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl text-white"
              :style="{ background: form.color || '#bb914a' }"
            >
              <i :class="form.icon || 'bi bi-graph-up-arrow'"></i>
            </div>
            <div>
              <p class="font-bold text-gray-800 dark:text-white">{{ form.name || 'Plan Name' }}</p>
              <p class="text-xs text-gray-500 dark:text-white/40">
                {{ form.dailyRoi || 0 }}% daily · {{ form.duration || 0 }}d · {{ computedRoi }}% total
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Features -->
      <div class="rounded-2xl p-5 md:p-6 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-lg text-gray-800 dark:text-white">Features</h3>
          <button
            type="button"
            @click="addFeature"
            class="px-3 py-1.5 rounded-lg text-xs font-bold
                   bg-amber-500/10 text-amber-600 hover:bg-amber-500/20
                   dark:bg-amber-500/[0.1] dark:text-amber-400 dark:hover:bg-amber-500/[0.2]"
          >
            <i class="bi bi-plus-circle mr-1"></i> Add
          </button>
        </div>
  
        <div class="space-y-2">
          <div
            v-for="(feat, i) in form.features"
            :key="i"
            class="flex items-center gap-2"
          >
            <input
              v-model="form.features[i]"
              type="text"
              placeholder="e.g. Earn 1.5% daily for 40 days"
              class="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
            <button
              type="button"
              @click="removeFeature(i)"
              class="w-9 h-9 rounded-lg flex items-center justify-center
                     bg-red-500/10 text-red-500 hover:bg-red-500/20 flex-shrink-0"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
  
          <p v-if="!form.features.length" class="text-xs text-gray-500 dark:text-white/40 text-center py-3">
            No features yet. Click "Add" to create one.
          </p>
        </div>
      </div>
  
      <!-- Settings -->
      <div class="rounded-2xl p-5 md:p-6 bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-5">Settings</h3>
  
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
              Sort Order
            </label>
            <input
              v-model.number="form.sortOrder"
              type="number"
              min="0"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none
                     bg-gray-50 border border-gray-200 text-gray-800 focus:border-amber-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
            >
          </div>
  
          <div class="flex items-end">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="form.isPopular"
                type="checkbox"
                class="w-5 h-5 rounded accent-amber-500"
              >
              <span class="text-sm font-semibold text-gray-700 dark:text-white/80">
                Mark as popular
              </span>
            </label>
          </div>
  
          <div class="flex items-end">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="form.isActive"
                type="checkbox"
                class="w-5 h-5 rounded accent-emerald-500"
              >
              <span class="text-sm font-semibold text-gray-700 dark:text-white/80">
                Active
              </span>
            </label>
          </div>
        </div>
      </div>
  
      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          type="button"
          @click="$emit('cancel')"
          :disabled="submitting"
          class="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm
                 bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                 hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="!isValid || submitting"
          class="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]
                 inline-flex items-center justify-center gap-2"
          style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
        >
          <span v-if="submitting" class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
          {{ submitting ? 'Saving...' : submitLabel }}
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { PLAN_ICON_OPTIONS, PLAN_COLOR_OPTIONS } from '~/composables/constants'
  
  const props = defineProps({
    initial: { type: Object, default: () => ({}) },
    submitting: { type: Boolean, default: false },
    submitLabel: { type: String, default: 'Save Plan' },
  })
  
  const emit = defineEmits(['submit', 'cancel'])
  
  // ── form state ──
  const form = ref(buildForm(props.initial))
  
  // ── rebuild when the parent hands us a new initial (edit page loads async) ──
  watch(() => props.initial, (v) => { form.value = buildForm(v) }, { deep: true })
  
  function buildForm(init) {
    return {
      name: init.name || '',
      slug: init.slug || '',
      description: init.description || '',
      dailyRoi: init.dailyRoi ?? 1,
      duration: init.duration ?? 30,
      minAmount: init.minAmount ?? 100,
      maxAmount: init.maxAmount ?? 1000,
      features: Array.isArray(init.features) ? [...init.features] : [],
      icon: init.icon || 'bi bi-graph-up-arrow',
      color: init.color || '#bb914a',
      isPopular: !!init.isPopular,
      isActive: init.isActive !== false,
      sortOrder: init.sortOrder ?? 0,
    }
  }
  
  // ── computed ──
  const computedRoi = computed(() =>
    (Number(form.value.dailyRoi || 0) * Number(form.value.duration || 0)).toFixed(2)
  )
  
  const minMaxInvalid = computed(() =>
    Number(form.value.minAmount || 0) > Number(form.value.maxAmount || 0)
  )
  
  const isValid = computed(() =>
    form.value.name?.trim().length > 0 &&
    Number(form.value.dailyRoi) > 0 &&
    Number(form.value.duration) > 0 &&
    Number(form.value.minAmount) >= 0 &&
    Number(form.value.maxAmount) > 0 &&
    !minMaxInvalid.value
  )
  
  // ── features ──
  const addFeature = () => form.value.features.push('')
  const removeFeature = (i) => form.value.features.splice(i, 1)
  
  // ── submit ──
  const handleSubmit = () => {
    if (!isValid.value) return
    const payload = { ...form.value }
    payload.features = payload.features.map((f) => f.trim()).filter(Boolean)
    // slug: send undefined if empty so backend auto-generates
    if (!payload.slug?.trim()) delete payload.slug
    emit('submit', payload)
  }
  </script>