<template>
    <DashboardLayout>
      <!-- Header -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-amber-500/10">
              <i class="bi bi-gear-fill text-amber-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Investment Plans</h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
                Manage the plans users see on the investment page
              </p>
            </div>
          </div>
  
          <div class="flex items-center gap-2">
            <button
              @click="seedDefaults"
              :disabled="store.state.isSeeding"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
                     bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
            >
              <span v-if="store.state.isSeeding" class="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
              <i v-else class="bi bi-cloud-download"></i>
              Seed Defaults
            </button>
            <NuxtLink
              to="/dashboard/admin/plans/new"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                     hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
            >
              <i class="bi bi-plus-circle"></i>
              New Plan
            </NuxtLink>
          </div>
        </div>
      </div>
  
      <!-- Stat cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05]">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Total Plans</p>
          <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ store.totalPlans }}</p>
        </div>
        <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05]">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Active</p>
          <p class="text-2xl font-bold text-emerald-500">{{ store.activePlans.length }}</p>
        </div>
        <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05]">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Inactive</p>
          <p class="text-2xl font-bold text-gray-500">{{ store.inactivePlans.length }}</p>
        </div>
        <div class="rounded-2xl p-4 bg-white border border-gray-100 shadow-sm dark:bg-[#101A47] dark:border-white/[0.05]">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Active Investments</p>
          <div v-if="store.state.isLoading && !store.state.statsLoaded"
               class="h-7 w-16 rounded bg-gray-200 dark:bg-white/[0.06] animate-pulse"></div>
          <p v-else class="text-2xl font-bold text-amber-500">
            {{ store.state.stats?.totals?.activeCount || 0 }}
          </p>
        </div>
      </div>
  
      <!-- Error -->
      <div
        v-if="store.state.error"
        class="mb-4 flex items-start gap-3 p-4 rounded-2xl
               bg-red-50 border border-red-200
               dark:bg-red-500/[0.08] dark:border-red-500/[0.15]"
      >
        <i class="bi bi-exclamation-circle-fill text-red-500 text-lg mt-0.5"></i>
        <p class="flex-1 text-sm text-red-700 dark:text-red-400">{{ store.state.error }}</p>
        <button @click="store.clearError()" class="text-red-500 hover:text-red-700">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
  
      <!-- Loading skeleton -->
      <div v-if="store.state.isLoading && !store.state.plansLoaded" class="space-y-3">
        <div
          v-for="i in 4"
          :key="i"
          class="rounded-2xl p-5 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse"
        >
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-white/[0.06]"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-white/[0.06] rounded w-1/4"></div>
              <div class="h-3 bg-gray-100 dark:bg-white/[0.04] rounded w-1/3"></div>
            </div>
            <div class="h-9 w-24 bg-gray-200 dark:bg-white/[0.06] rounded-xl"></div>
          </div>
        </div>
      </div>
  
      <!-- Empty -->
      <div
        v-else-if="!store.hasPlans"
        class="rounded-2xl p-12 text-center bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05]"
      >
        <i class="bi bi-inbox text-5xl text-gray-300 dark:text-white/20"></i>
        <p class="font-semibold text-gray-700 dark:text-white/70 mt-4">No plans yet</p>
        <p class="text-sm text-gray-500 dark:text-white/40 mt-1 mb-5">
          Create your first plan or seed the defaults to get started
        </p>
        <div class="flex justify-center gap-3">
          <button
            @click="seedDefaults"
            :disabled="store.state.isSeeding"
            class="px-5 py-2.5 rounded-xl font-semibold text-sm
                   bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                   hover:bg-gray-200 dark:hover:bg-white/[0.1] disabled:opacity-50"
          >
            <i class="bi bi-cloud-download mr-1"></i> Seed Defaults
          </button>
          <NuxtLink
            to="/dashboard/admin/plans/new"
            class="px-5 py-2.5 rounded-xl font-bold text-sm"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%); color: #020862;"
          >
            <i class="bi bi-plus-circle mr-1"></i> New Plan
          </NuxtLink>
        </div>
      </div>
  
      <!-- Plans list -->
      <div v-else class="space-y-3">
        <div
          v-for="plan in store.state.plans"
          :key="plan._id"
          class="rounded-2xl p-4 md:p-5 bg-white border border-gray-100 shadow-sm
                 dark:bg-[#101A47] dark:border-white/[0.05]
                 transition-all duration-200 hover:shadow-md"
          :class="!plan.isActive ? 'opacity-60' : ''"
        >
          <div class="flex flex-wrap items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl text-white"
              :style="{ background: plan.color || '#bb914a' }"
            >
              <i :class="plan.icon || 'bi bi-graph-up-arrow'"></i>
            </div>
  
            <div class="flex-1 min-w-[200px]">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <h4 class="font-bold text-lg text-gray-800 dark:text-white">{{ plan.name }}</h4>
                <span v-if="plan.isPopular" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">
                  <i class="bi bi-star-fill mr-1"></i>POPULAR
                </span>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  :class="plan.isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-white/40'"
                >
                  {{ plan.isActive ? 'ACTIVE' : 'INACTIVE' }}
                </span>
                <span class="text-xs text-gray-400 dark:text-white/30 font-mono">
                  /{{ plan.slug }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-white/40">{{ plan.description || '—' }}</p>
            </div>
  
            <div class="flex items-center gap-6">
              <div>
                <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40">Daily ROI</p>
                <p class="font-bold text-amber-500">{{ plan.dailyRoi }}%</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40">Duration</p>
                <p class="font-bold text-gray-800 dark:text-white">{{ plan.duration }}d</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40">Range</p>
                <p class="font-bold text-sm text-gray-800 dark:text-white">
                  ${{ formatMoney(plan.minAmount, 0) }} – ${{ formatMoney(plan.maxAmount, 0) }}
                </p>
              </div>
              <div class="hidden md:block">
                <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-white/40">Sort</p>
                <p class="font-bold text-gray-800 dark:text-white">{{ plan.sortOrder }}</p>
              </div>
            </div>
  
            <div class="flex items-center gap-2">
              <button
                @click="toggle(plan)"
                :disabled="store.state.isSubmitting"
                class="w-10 h-10 rounded-xl flex items-center justify-center transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
                :class="plan.isActive
                  ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'"
                :title="plan.isActive ? 'Deactivate' : 'Activate'"
              >
                <i :class="plan.isActive ? 'bi bi-pause-circle' : 'bi bi-play-circle'"></i>
              </button>
  
              <NuxtLink
                :to="`/dashboard/admin/plans/${plan._id}/edit`"
                class="w-10 h-10 rounded-xl flex items-center justify-center transition-all
                       bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                title="Edit"
              >
                <i class="bi bi-pencil-square"></i>
              </NuxtLink>
  
              <button
                @click="confirmDelete(plan)"
                :disabled="store.state.isSubmitting"
                class="w-10 h-10 rounded-xl flex items-center justify-center transition-all
                       bg-red-500/10 text-red-500 hover:bg-red-500/20
                       disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Delete confirm -->
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="deleteTarget"
          class="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="deleteTarget = null"
        >
          <div class="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl
                      bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">
            <div class="p-6 text-center">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                <i class="bi bi-exclamation-triangle-fill text-red-500 text-2xl"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2">Delete plan?</h3>
              <p class="text-sm text-gray-500 dark:text-white/50 mb-5">
                "<strong class="text-gray-800 dark:text-white">{{ deleteTarget.name }}</strong>"
                will be permanently deleted. You can't delete a plan with active investments.
              </p>
              <div class="flex gap-3">
                <button
                  @click="deleteTarget = null"
                  class="flex-1 py-2.5 rounded-xl font-semibold text-sm
                         bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70"
                >
                  Cancel
                </button>
                <button
                  @click="doDelete"
                  :disabled="store.state.isSubmitting"
                  class="flex-1 py-2.5 rounded-xl font-bold text-sm
                         bg-red-500 text-white hover:bg-red-600 disabled:opacity-50
                         inline-flex items-center justify-center gap-2"
                >
                  <span v-if="store.state.isSubmitting" class="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
  
      <!-- Toast -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div
          v-if="toast"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[600] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          :class="toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'"
        >
          <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'" class="text-white text-lg"></i>
          <span class="text-white text-sm font-bold">{{ toast.message }}</span>
        </div>
      </Transition>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useAdminInvestmentStore } from '~/stores/adminInvestment'
  
  definePageMeta({ layout: 'dashboard' })
  
  const store = useAdminInvestmentStore()
  const deleteTarget = ref(null)
  const toast = ref(null)
  
  const formatMoney = (n, decimals = 2) =>
    Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  
  const showToast = (message, type = 'success') => {
    toast.value = { message, type }
    setTimeout(() => (toast.value = null), 3000)
  }
  
  // ── actions ──
  const toggle = async (plan) => {
    const res = await store.togglePlan(plan._id)
    if (res.success) showToast(res.message || 'Plan updated')
    else showToast(res.message || 'Failed to update', 'error')
  }
  
  const confirmDelete = (plan) => { deleteTarget.value = plan }
  
  const doDelete = async () => {
    if (!deleteTarget.value) return
    const res = await store.deletePlan(deleteTarget.value._id)
    if (res.success) {
      showToast('Plan deleted')
      deleteTarget.value = null
    } else {
      showToast(res.message || 'Failed to delete', 'error')
    }
  }
  
  const seedDefaults = async () => {
    const res = await store.seedDefaults()
    if (res.success) showToast(`${res.created} plans created`)
    else showToast(res.message || 'Seeding failed', 'error')
  }
  
  // ── init ──
  onMounted(async () => {
    await Promise.all([
      store.fetchPlans(),
      store.fetchStats(),
    ])
  })
  </script>
  
  <style scoped>
  @media (max-width: 767px) {
    .stat-card { padding: 1rem; }
  }
  </style>