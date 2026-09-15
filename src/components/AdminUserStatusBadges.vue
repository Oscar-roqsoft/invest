<template>
    <div class="flex flex-wrap items-center gap-1.5">
      <!-- Role -->
      <span
        v-if="user.role === 'admin'"
        class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400"
      >
        <i class="bi bi-shield-fill-check mr-1"></i>ADMIN
      </span>
  
      <!-- Verified -->
      <span
        v-if="user.isVerified"
        class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      >
        <i class="bi bi-patch-check-fill mr-1"></i>VERIFIED
      </span>
  
      <!-- KYC -->
      <span
        v-if="user.kyc?.status && user.kyc.status !== 'not_started'"
        class="px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1"
        :class="kycMeta.cls"
      >
        <span class="w-1.5 h-1.5 rounded-full" :class="kycMeta.dot"></span>
        KYC {{ kycMeta.label }}
      </span>
  
      <!-- Banned -->
      <span
        v-if="user.isBanned"
        class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400"
      >
        <i class="bi bi-slash-circle-fill mr-1"></i>BANNED
      </span>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { USER_KYC_STATUS_META } from '~/composables/constants'
  
  const props = defineProps({
    user: { type: Object, required: true },
  })
  
  const kycMeta = computed(() =>
    USER_KYC_STATUS_META[props.user.kyc?.status] ||
    USER_KYC_STATUS_META.not_started
  )
  </script>