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
            <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">New Plan</h1>
            <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
              Create a new investment plan
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
  
      <AdminPlanForm
        submit-label="Create Plan"
        :submitting="store.state.isSubmitting"
        @cancel="navigateTo('/dashboard/admin/plans')"
        @submit="handleSubmit"
      />
    </DashboardLayout>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useAdminInvestmentStore } from '~/stores/adminInvestment'
  
  definePageMeta({ layout: 'dashboard' })
  
  const store = useAdminInvestmentStore()
  
  onMounted(() => store.clearError())
  
  const handleSubmit = async (payload) => {
    const res = await store.createPlan(payload)
    if (res.success) {
      navigateTo('/dashboard/admin/plans')
    }
  }
  </script>