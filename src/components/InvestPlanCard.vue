<template>
    <div
      class="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
             bg-white border border-gray-100 shadow-sm
             dark:bg-[#101A47] dark:border-white/[0.05]
             hover:border-gold-300 dark:hover:border-blue-500/30"
    >
      <!-- Popular badge -->
      <div
        v-if="plan.isPopular"
        class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
               shadow-lg"
        style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%); color: #020862;"
      >
        <i class="bi bi-star-fill mr-1"></i> Most Popular
      </div>
  
      <!-- Icon + Name -->
      <div class="flex items-start gap-3 mb-5">
        <div
          class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          :style="{ background: (plan.color || '#bb914a') + '20' }"
        >
          <i :class="plan.icon || 'bi bi-graph-up-arrow'" class="text-xl" :style="{ color: plan.color || '#bb914a' }"></i>
        </div>
        <div class="min-w-0">
          <h3 class="font-bold text-lg text-gray-800 dark:text-white truncate">{{ plan.name }}</h3>
          <p class="text-xs text-gray-500 dark:text-white/40 truncate">
            {{ plan.description || `${plan.duration} days plan` }}
          </p>
        </div>
      </div>
  
      <!-- Big ROI -->
      <div class="text-center py-5 mb-5 rounded-xl
                  bg-gradient-to-br from-gray-50 to-white
                  dark:from-white/[0.03] dark:to-transparent
                  border border-gray-100 dark:border-white/[0.04]">
        <div class="text-3xl md:text-4xl font-bold tracking-tight"
             style="background: linear-gradient(135deg, #E6BB5C 0%, #D4A44A 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          {{ plan.dailyRoi }}%
        </div>
        <div class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mt-1">
          Daily ROI
        </div>
        <div class="text-xs text-gray-500 dark:text-white/40 mt-2">
          {{ plan.duration }} days · <strong class="text-emerald-500">{{ totalRoi }}% total</strong>
        </div>
      </div>
  
      <!-- Details grid -->
      <div class="grid grid-cols-2 gap-3 mb-5">
        <div class="rounded-lg p-3 bg-gray-50 dark:bg-white/[0.03]">
          <div class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">Min</div>
          <div class="text-sm font-bold text-gray-800 dark:text-white">${{ formatMoney(plan.minAmount) }}</div>
        </div>
        <div class="rounded-lg p-3 bg-gray-50 dark:bg-white/[0.03]">
          <div class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40 font-bold mb-1">Max</div>
          <div class="text-sm font-bold text-gray-800 dark:text-white">${{ formatMoney(plan.maxAmount) }}</div>
        </div>
      </div>
  
      <!-- Features -->
      <ul v-if="plan.features?.length" class="space-y-2 mb-5">
        <li
          v-for="(f, i) in plan.features.slice(0, 3)"
          :key="i"
          class="flex items-start gap-2 text-xs text-gray-600 dark:text-white/60"
        >
          <i class="bi bi-check-circle-fill text-emerald-500 mt-0.5 flex-shrink-0"></i>
          <span>{{ f }}</span>
        </li>
      </ul>
  
      <!-- CTA -->
      <NuxtLink
        :to="`/invest/plans/${plan.slug}`"
        class="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2
               transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
        style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
      >
        Invest Now <i class="bi bi-arrow-right"></i>
      </NuxtLink>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    plan: { type: Object, required: true },
  });
  
  const totalRoi = computed(() => {
    if (props.plan.totalRoi) return props.plan.totalRoi;
    return parseFloat((props.plan.dailyRoi * props.plan.duration).toFixed(2));
  });
  
  const formatMoney = (n) =>
    Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
  </script>