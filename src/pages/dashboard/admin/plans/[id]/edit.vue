<template>
    <DashboardLayout>
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/dashboard/admin/plans"
            class="w-10 h-10 rounded-xl flex items-center justify-center
                   bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]"
          >
            <i class="bi bi-arrow-left text-gray-600 dark:text-white/60"></i>
          </NuxtLink>
          <div>
            <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Edit Plan</h1>
            <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
              Update plan details. Changes apply to future investments only.
            </p>
          </div>
        </div>
      </div>
  
      <div v-if="store.state.error"
           class="mb-4 flex items-start gap-3 p-4 rounded-2xl
                  bg-red-50 border border-red-200
                  dark:bg-red-500/[0.08] dark:border-red-500/[0.15]">
        <i class="bi bi-exclamation-circle-fill text-red-500 text-lg mt-0.5"></i>
        <p class="flex-1 text-sm text-red-700 dark:text-red-400">{{ store.state.error }}</p>
        <button @click="store.clearError()" class="text-red-500 hover:text-red-700">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
  
      <!-- Loading -->
      <div v-if="!initialPlan" class="space-y-3">
        <div
          v-for="i in 3"
          :key="i"
          class="rounded-2xl p-6 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse"
        >
          <div class="h-4 bg-gray-200 dark:bg-white/[0.06] rounded w-1/4 mb-4"></div>
          <div class="space-y-3">
            <div class="h-10 bg-gray-100 dark:bg-white/[0.04] rounded"></div>
            <div class="h-10 bg-gray-100 dark:bg-white/[0.04] rounded"></div>
          </div>
        </div>
      </div>
  
      <AdminPlanForm
        v-else
        :initial="initialPlan"
        submit-label="Save Changes"
        :submitting="store.state.isSubmitting"
        @cancel="navigateTo('/dashboard/admin/plans')"
        @submit="handleSubmit"
      />
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useAdminInvestmentStore } from '~/stores/adminInvestment'
  
  definePageMeta({ layout: 'dashboard' })
  
  const route = useRoute()
  const store = useAdminInvestmentStore()
  
  const initialPlan = ref(null)
  
  onMounted(async () => {
    store.clearError()
  
    // If plans already loaded, use local copy
    let plan = store.findPlanById(route.params.id)
  
    // Otherwise fetch
    if (!plan || !store.state.plansLoaded) {
      await store.fetchPlans()
      plan = store.findPlanById(route.params.id)
    }
  
    if (!plan) {
      // Plan doesn't exist or was deleted
      navigateTo('/dashboard/admin/plans')
      return
    }
  
    initialPlan.value = plan
  })
  
  const handleSubmit = async (payload) => {
    const res = await store.updatePlan(route.params.id, payload)
    if (res.success) {
      navigateTo('/dashboard/admin/plans')
    }
  }
  </script>