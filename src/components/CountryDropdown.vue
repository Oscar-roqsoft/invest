<template>
    <div ref="rootRef" class="relative">
      <!-- Trigger Button -->
      <button
        type="button"
        @click="toggleDropdown"
        @keydown.enter.prevent="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
        @keydown.down.prevent="openAndFocusFirst"
        class="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-sm
               outline-none transition-all duration-200 text-left
               bg-gray-50 border border-gray-200 text-gray-700
               hover:border-gold-500/30
               focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/10
               dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
               dark:hover:border-amber-500/30 dark:focus:border-amber-500/50"
        :class="{ 'border-gold-500/50 ring-2 ring-gold-500/10 dark:border-amber-500/50 dark:ring-amber-500/10': isOpen }"
      >
        <span class="flex items-center gap-3 min-w-0">
          <template v-if="selectedCountry">
            <span class="text-xl leading-none">{{ selectedCountry.flag }}</span>
            <span class="truncate font-medium">{{ selectedCountry.name }}</span>
          </template>
          <template v-else>
            <span class="text-xl leading-none opacity-40">🌐</span>
            <span class="text-gray-400 dark:text-white/40">{{ placeholder }}</span>
          </template>
        </span>
  
        <i
          class="bi bi-chevron-down text-gray-400 dark:text-white/40 text-xs transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        ></i>
      </button>
  
      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-2 scale-95"
      >
        <div
          v-if="isOpen"
          class="absolute z-50 top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden
                 bg-white dark:bg-[#0F1B4C] shadow-2xl shadow-black/40
                 border border-gray-200 dark:border-white/[0.08]"
        >
          <!-- Search -->
          <div class="p-3 border-b border-gray-100 dark:border-white/[0.06]">
            <div class="relative">
              <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 text-sm"></i>
              <input
                ref="searchRef"
                v-model="searchQuery"
                type="text"
                placeholder="Search country..."
                @keydown.escape="closeDropdown"
                @keydown.down.prevent="moveHighlight(1)"
                @keydown.up.prevent="moveHighlight(-1)"
                @keydown.enter.prevent="selectHighlighted"
                class="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none
                       bg-gray-50 dark:bg-white/[0.04]
                       text-gray-700 dark:text-white
                       placeholder-gray-400 dark:placeholder-white/30
                       border border-transparent focus:border-gold-500/30 dark:focus:border-amber-500/30"
              >
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white/60"
              >
                <i class="bi bi-x-circle-fill text-xs"></i>
              </button>
            </div>
          </div>
  
          <!-- Options -->
          <div
            ref="listRef"
            class="max-h-72 overflow-y-auto py-2 custom-scrollbar"
          >
            <!-- No results -->
            <div v-if="filteredGroups.length === 0" class="py-8 text-center">
              <i class="bi bi-search text-gray-300 dark:text-white/20 text-2xl"></i>
              <p class="text-sm text-gray-400 dark:text-white/40 mt-2">No countries found</p>
            </div>
  
            <!-- Grouped options -->
            <template v-for="group in filteredGroups" :key="group.region">
              <!-- Region header -->
              <div class="px-4 py-1.5 flex items-center gap-2 sticky top-0 z-10
                          bg-white/95 dark:bg-[#0F1B4C]/95 backdrop-blur-sm">
                <span class="text-xs">{{ REGION_ICONS[group.region] || '🌐' }}</span>
                <span class="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-white/30">
                  {{ group.region }}
                </span>
                <div class="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]"></div>
              </div>
  
              <!-- Country items -->
              <button
                v-for="country in group.countries"
                :key="country.code"
                type="button"
                @click="selectCountry(country)"
                @mouseenter="highlightedIndex = getGlobalIndex(country)"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all duration-150"
                :class="[
                  highlightedIndex === getGlobalIndex(country)
                    ? 'bg-gold-500/10 dark:bg-amber-500/[0.08]'
                    : 'hover:bg-gray-50 dark:hover:bg-white/[0.04]',
                  selectedCountry?.code === country.code
                    ? 'text-gold-500 dark:text-amber-400 font-semibold'
                    : 'text-gray-700 dark:text-white/80',
                ]"
              >
                <span class="text-lg leading-none">{{ country.flag }}</span>
                <span class="flex-1 truncate">{{ country.name }}</span>
                <i
                  v-if="selectedCountry?.code === country.code"
                  class="bi bi-check-lg text-gold-500 dark:text-amber-400 text-sm"
                ></i>
              </button>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup>
  import {
    COUNTRIES,
    COUNTRIES_BY_REGION,
    REGION_ORDER,
    REGION_ICONS,
  } from '~/composables/constants/countries';
  
  const props = defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Select country' },
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const rootRef = ref(null);
  const searchRef = ref(null);
  const listRef = ref(null);
  const isOpen = ref(false);
  const searchQuery = ref('');
  const highlightedIndex = ref(-1);
  
  // Find the selected country object by name (we store by name in the form)
  const selectedCountry = computed(() =>
    COUNTRIES.find((c) => c.name === props.modelValue) || null
  );
  
  // Filter groups by search
  const filteredGroups = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
  
    // If no search, return all groups in order
    if (!q) {
      return REGION_ORDER
        .filter((region) => COUNTRIES_BY_REGION[region])
        .map((region) => ({
          region,
          countries: COUNTRIES_BY_REGION[region],
        }));
    }
  
    // If searching, filter countries
    const matched = COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  
    // Regroup by region
    const grouped = matched.reduce((acc, c) => {
      if (!acc[c.region]) acc[c.region] = [];
      acc[c.region].push(c);
      return acc;
    }, {});
  
    return REGION_ORDER
      .filter((region) => grouped[region]?.length)
      .map((region) => ({
        region,
        countries: grouped[region],
      }));
  });
  
  // Flat list for keyboard nav
  const flatFiltered = computed(() =>
    filteredGroups.value.flatMap((g) => g.countries)
  );
  
  // Get the global index of a country in the filtered list
  const getGlobalIndex = (country) =>
    flatFiltered.value.findIndex((c) => c.code === country.code);
  
  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      nextTick(() => searchRef.value?.focus());
    }
  };
  
  const closeDropdown = () => {
    isOpen.value = false;
    searchQuery.value = '';
    highlightedIndex.value = -1;
  };
  
  const selectCountry = (country) => {
    emit('update:modelValue', country.name);
    closeDropdown();
  };
  
  const openAndFocusFirst = () => {
    isOpen.value = true;
    nextTick(() => {
      searchRef.value?.focus();
      highlightedIndex.value = 0;
    });
  };
  
  const moveHighlight = (direction) => {
    const max = flatFiltered.value.length - 1;
    if (max < 0) return;
  
    let next = highlightedIndex.value + direction;
  
    if (next < 0) next = max;
    if (next > max) next = 0;
  
    highlightedIndex.value = next;
  
    // Scroll into view
    nextTick(() => {
      const el = listRef.value?.querySelector(
        `[data-index="${next}"]`
      );
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  };
  
  const selectHighlighted = () => {
    const c = flatFiltered.value[highlightedIndex.value];
    if (c) selectCountry(c);
  };
  
  // ─────────────────────────────────────────────────────────────
  // CLICK OUTSIDE
  // ─────────────────────────────────────────────────────────────
  const handleClickOutside = (e) => {
    if (rootRef.value && !rootRef.value.contains(e.target)) {
      closeDropdown();
    }
  };
  
  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
  });
  
  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });
  
  // Reset highlight when search changes
  watch(searchQuery, () => {
    highlightedIndex.value = 0;
  });
  </script>
  
  <style scoped>
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(187, 145, 74, 0.25);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(187, 145, 74, 0.45);
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(187, 145, 74, 0.25) transparent;
  }
  </style>