<template>
    <div class="space-y-4 md:space-y-6">
      
      <!-- Verification Progress -->
      <div class="rounded-2xl p-6 relative overflow-hidden
                  bg-gradient-to-br from-blue-500 to-blue-600
                  shadow-lg shadow-blue-500/30">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.1] rounded-full blur-2xl"></div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-2 mb-2">
            <i class="bi bi-patch-check-fill text-white text-2xl"></i>
            <span class="text-white/80 text-xs font-bold uppercase tracking-wider">Account Verification</span>
          </div>
          <div class="text-4xl md:text-5xl font-bold text-white mb-2">75%</div>
          <p class="text-white/80 text-sm">Complete verification to unlock all features</p>
  
          <!-- Progress Bar -->
          <div class="mt-4 h-2 rounded-full bg-white/[0.2] overflow-hidden">
            <div class="h-full rounded-full bg-white transition-all duration-1000" style="width: 75%"></div>
          </div>
  
          <div class="mt-4 flex items-center gap-2 text-white/80 text-xs">
            <i class="bi bi-info-circle"></i>
            <span>Complete remaining steps to verify your account</span>
          </div>
        </div>
      </div>
  
      <!-- Verification Steps -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        
        <h2 class="font-bold text-lg text-gray-800 dark:text-white mb-6">Verification Steps</h2>
  
        <div class="space-y-4">
          <div 
            v-for="(step) in verificationSteps" 
            :key="step.id"
            class="flex items-start gap-4 p-4 rounded-xl transition-all
                   bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]"
          >
            <!-- Step Icon -->
            <div 
              class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg"
              :class="step.status === 'completed' 
                ? 'bg-emerald-500 text-white' 
                : step.status === 'pending'
                  ? 'text-primary-900 shadow-lg shadow-amber-500/20'
                  : 'bg-gray-200 dark:bg-white/[0.06] text-gray-400 dark:text-white/30'"
              :style="step.status === 'pending' ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%);' : ''"
            >
              <i v-if="step.status === 'completed'" class="bi bi-check-lg"></i>
              <i v-else :class="step.icon"></i>
            </div>
  
            <!-- Step Info -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <p class="font-bold text-sm text-gray-800 dark:text-white">{{ step.title }}</p>
                <span 
                  class="px-2 py-0.5 rounded-full text-xs font-bold"
                  :class="{
                    'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/[0.15] dark:text-emerald-400': step.status === 'completed',
                    'bg-amber-500/10 text-amber-500 dark:bg-amber-500/[0.15] dark:text-amber-400': step.status === 'pending',
                    'bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-white/40': step.status === 'not-started'
                  }"
                >
                  <i v-if="step.status === 'completed'" class="bi bi-check-circle-fill mr-1"></i>
                  <i v-else-if="step.status === 'pending'" class="bi bi-clock-fill mr-1"></i>
                  {{ step.status === 'completed' ? 'Completed' : step.status === 'pending' ? 'In Review' : 'Not Started' }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-white/40 mb-3">{{ step.description }}</p>
  
              <!-- Action Button -->
              <button 
                v-if="step.status === 'not-started'"
                @click="startStep(step)"
                class="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
                style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
              >
                <i class="bi bi-arrow-right mr-1"></i>
                Start Verification
              </button>
  
              <button 
                v-else-if="step.status === 'pending'"
                class="px-4 py-2 rounded-lg text-xs font-bold
                       bg-gray-200 dark:bg-white/[0.06] text-gray-500 dark:text-white/40 cursor-not-allowed"
                disabled
              >
                <i class="bi bi-hourglass-split mr-1"></i>
                Awaiting Review
              </button>
  
              <div 
                v-else
                class="text-xs font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-1"
              >
                <i class="bi bi-check-circle-fill"></i>
                {{ step.completedDate }}
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Why Verify? -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-amber-500/[0.04] border border-amber-500/[0.15]">
        <div class="flex items-start gap-3">
          <i class="bi bi-lightbulb-fill text-amber-500 text-lg flex-shrink-0 mt-0.5"></i>
          <div>
            <h4 class="font-bold text-sm text-amber-600 dark:text-amber-400 mb-3">Why Verify Your Account?</h4>
            <ul class="space-y-2 text-xs text-gray-600 dark:text-white/50">
              <li class="flex items-start gap-2">
                <i class="bi bi-check-circle-fill text-emerald-500 mt-0.5"></i>
                <span>Unlock higher withdrawal limits ($50,000/day)</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="bi bi-check-circle-fill text-emerald-500 mt-0.5"></i>
                <span>Access advanced trading features and tools</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="bi bi-check-circle-fill text-emerald-500 mt-0.5"></i>
                <span>Enhanced account security and fraud protection</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="bi bi-check-circle-fill text-emerald-500 mt-0.5"></i>
                <span>Faster transaction processing times</span>
              </li>
              <li class="flex items-start gap-2">
                <i class="bi bi-check-circle-fill text-emerald-500 mt-0.5"></i>
                <span>Priority customer support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const verificationSteps = ref([
    {
      id: 1,
      title: 'Email Verification',
      description: 'Verify your email address to secure your account',
      status: 'completed',
      completedDate: 'Completed on Aug 5, 2026',
      icon: 'bi bi-envelope-fill'
    },
    {
      id: 2,
      title: 'Phone Verification',
      description: 'Add and verify your phone number for two-factor authentication',
      status: 'completed',
      completedDate: 'Completed on Aug 6, 2026',
      icon: 'bi bi-phone-fill'
    },
    {
      id: 3,
      title: 'Identity Verification (KYC)',
      description: 'Upload a government-issued ID to verify your identity',
      status: 'pending',
      icon: 'bi bi-person-vcard-fill'
    },
    {
      id: 4,
      title: 'Address Verification',
      description: 'Provide a utility bill or bank statement to verify your address',
      status: 'not-started',
      icon: 'bi bi-house-fill'
    },
    {
      id: 5,
      title: 'Enhanced Verification',
      description: 'Complete advanced verification for higher transaction limits',
      status: 'not-started',
      icon: 'bi bi-shield-fill-check'
    }
  ])
  
  const startStep = (step) => {
    // Handle step verification
    console.log('Starting:', step.title)
  }
  </script>