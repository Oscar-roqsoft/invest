<template>
    <DashboardLayout>
      <!-- Page Header -->
      <div class="mb-6 md:mb-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-gold-500/10 dark:bg-amber-500/[0.08]">
              <i class="bi bi-people-fill text-amber-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Referral Program</h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">Invite friends and earn 5% commission on every deposit</p>
            </div>
          </div>
          <button 
            @click="shareReferral"
            class="flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
          >
            <i class="bi bi-share-fill"></i>
            <span class="hidden sm:inline">Share Link</span>
          </button>
        </div>
      </div>
  
      <!-- Referral Banner -->
      <div class="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden
                  bg-gradient-to-br from-[#020862] via-[#0A1033] to-[#0F1B4C]
                  border border-white/[0.06] shadow-2xl shadow-blue-900/40">
        
        <!-- Decorative Elements -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/[0.15] rounded-full blur-3xl"></div>
          <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/[0.12] rounded-full blur-3xl"></div>
          <div class="absolute inset-0 opacity-[0.02]" style="background-image: radial-gradient(circle, #F5D77F 1px, transparent 1px); background-size: 24px 24px;"></div>
        </div>
  
        <div class="relative z-10">
          <div class="flex flex-wrap items-center justify-between gap-6">
            <div class="max-w-xl">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/[0.1] border border-amber-500/[0.2] mb-4">
                <i class="bi bi-star-fill text-amber-400 text-xs"></i>
                <span class="text-amber-400 text-xs font-bold uppercase tracking-wider">Earn 5% Commission</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
                Invite Friends, <span class="text-amber-400">Earn Rewards</span>
              </h2>
              <p class="text-white/60 text-sm md:text-base mb-4">
                Share your unique referral link with friends and earn 5% commission on every deposit they make — forever!
              </p>
              
              <!-- Referral Link -->
              <div class="flex gap-2">
                <div class="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.1] backdrop-blur-sm">
                  <i class="bi bi-link-45deg text-amber-400 flex-shrink-0"></i>
                  <input 
                    type="text"
                    readonly
                    id="referral_link"
                    :value="referralLink"
                    class="flex-1 bg-transparent border-none outline-none text-white text-sm font-mono truncate"
                  >
                </div>
                <button 
                  @click="copyReferralLink"
                  class="px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
                  style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
                >
                  <i class="bi bi-copy mr-1"></i>
                  <span class="hidden sm:inline">Copy</span>
                </button>
              </div>
            </div>
  
            <!-- Referral Code Display -->
            <div class="flex flex-col items-center">
              <div class="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 opacity-[0.05]" style="background-image: radial-gradient(circle, #F5D77F 1px, transparent 1px); background-size: 12px 12px;"></div>
                <span class="text-xs uppercase tracking-wider text-white/40 mb-1 relative">Your Code</span>
                <span class="text-2xl md:text-3xl font-bold text-amber-400 font-mono relative">{{ referralCode }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div 
          v-for="stat in referralStats" 
          :key="stat.label"
          class="rounded-2xl p-4 md:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                 bg-white border border-gray-100 shadow-sm
                 dark:bg-[#101A47] dark:border-white/[0.05]"
        >
          <div class="flex items-center gap-2 mb-3">
            <div 
              class="w-9 h-9 rounded-xl flex items-center justify-center"
              :style="{ background: stat.bgColor }"
            >
              <i :class="stat.icon" :style="{ color: stat.iconColor }" class="text-sm"></i>
            </div>
            <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white/40">
              {{ stat.label }}
            </span>
          </div>
          <p class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            {{ stat.value }}
          </p>
          <p v-if="stat.change" class="text-xs mt-1 flex items-center gap-1" :class="stat.changeColor">
            <i :class="stat.changeIcon" class="text-xs"></i>
            {{ stat.change }}
          </p>
        </div>
      </div>
  
      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        <!-- Referral Link & Share Card -->
        <div class="lg:col-span-2 space-y-4 md:space-y-6">
          
          <!-- How It Works -->
          <div class="rounded-2xl p-5 md:p-6
                      bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                          bg-gold-500/10 dark:bg-amber-500/[0.08]">
                <i class="bi bi-info-circle text-amber-500 text-lg"></i>
              </div>
              <div>
                <h3 class="font-bold text-lg text-gray-800 dark:text-white">How It Works</h3>
                <p class="text-xs text-gray-400 dark:text-white/40">Start earning in 3 easy steps</p>
              </div>
            </div>
  
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                v-for="(step, index) in howItWorks" 
                :key="step.title"
                class="relative p-4 rounded-xl transition-all duration-200
                       bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]"
              >
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                       :style="`background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%); color: #020862;`">
                    {{ index + 1 }}
                  </div>
                  <i :class="step.icon" class="text-amber-500 text-lg"></i>
                </div>
                <h4 class="font-bold text-sm text-gray-800 dark:text-white mb-1">{{ step.title }}</h4>
                <p class="text-xs text-gray-500 dark:text-white/40 leading-relaxed">{{ step.description }}</p>
              </div>
            </div>
          </div>
  
          <!-- Referred Users Table -->
          <div class="rounded-2xl overflow-hidden
                      bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            
            <!-- Header -->
            <div class="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 dark:border-white/[0.06]">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                            bg-gold-500/10 dark:bg-blue-500/[0.08]">
                  <i class="bi bi-people-fill text-blue-400 text-lg"></i>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-gray-800 dark:text-white">Your Referrals</h3>
                  <p class="text-xs text-gray-400 dark:text-white/40">People who joined using your link</p>
                </div>
              </div>
              <div class="hidden md:flex items-center gap-2">
                <select 
                  v-model="statusFilter"
                  class="px-3 py-2 rounded-lg text-xs outline-none transition-all duration-200 cursor-pointer
                         bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                         dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
  
            <!-- Referrals List -->
            <div v-if="filteredReferrals.length > 0" class="overflow-x-auto">
              <table class="w-full min-w-[700px]">
                <thead class="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01]">
                  <tr>
                    <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">User</th>
                    <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Joined</th>
                    <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Total Invested</th>
                    <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Your Commission</th>
                    <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="referral in filteredReferrals" 
                    :key="referral.id" 
                    class="transition-colors duration-200 border-b
                           border-gray-100 hover:bg-gray-50
                           dark:border-white/[0.03] dark:hover:bg-white/[0.03]"
                  >
                    <td class="py-4 px-5 md:px-6">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                             :style="{ background: referral.bgColor, color: referral.textColor }">
                          {{ referral.avatar }}
                        </div>
                        <div class="min-w-0">
                          <span class="text-sm font-semibold block text-gray-800 dark:text-white truncate">
                            {{ referral.name }}
                          </span>
                          <span class="text-xs text-gray-400 dark:text-white/30 truncate">
                            {{ referral.email }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-5 md:px-6">
                      <div class="text-sm text-gray-700 dark:text-white/70 whitespace-nowrap">
                        {{ referral.joined }}
                      </div>
                    </td>
                    <td class="py-4 px-5 md:px-6">
                      <div class="text-sm font-bold text-gray-800 dark:text-white">
                        ${{ referral.invested }}
                      </div>
                    </td>
                    <td class="py-4 px-5 md:px-6">
                      <div class="text-sm font-bold text-amber-500">
                        +${{ referral.commission }}
                      </div>
                    </td>
                    <td class="py-4 px-5 md:px-6">
                      <span 
                        class="px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap"
                        :class="{
                          'bg-green-50 text-green-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400': referral.status === 'Active',
                          'bg-yellow-50 text-yellow-600 dark:bg-amber-500/[0.08] dark:text-amber-400': referral.status === 'Pending',
                          'bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-white/40': referral.status === 'Inactive'
                        }"
                      >
                        <span 
                          class="w-1.5 h-1.5 rounded-full"
                          :class="{
                            'bg-emerald-500': referral.status === 'Active',
                            'bg-amber-500': referral.status === 'Pending',
                            'bg-gray-400': referral.status === 'Inactive'
                          }"
                        ></span>
                        {{ referral.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center py-16 px-4">
              <div class="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-4">
                <i class="bi bi-people text-4xl text-gray-300 dark:text-white/20"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2">No referrals yet</h3>
              <p class="text-sm text-gray-500 dark:text-white/40 text-center max-w-sm mb-6">
                {{ statusFilter !== 'all' 
                  ? 'No referrals match your filter. Try changing the status filter.'
                  : 'Start sharing your referral link to earn commission on every deposit your friends make.' }}
              </p>
              <button 
                v-if="statusFilter !== 'all'"
                @click="statusFilter = 'all'"
                class="px-6 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-white/80
                       bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]
                       transition-all duration-200"
              >
                <i class="bi bi-arrow-clockwise mr-1"></i> Clear Filter
              </button>
            </div>
          </div>
        </div>
  
        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-4 md:space-y-6">
          
          <!-- Commission Card -->
          <div class="rounded-2xl p-6 relative overflow-hidden
                      bg-gradient-to-br from-emerald-500 to-emerald-600
                      shadow-lg shadow-emerald-500/30">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/[0.1] rounded-full blur-2xl"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-10 h-10 rounded-xl bg-white/[0.15] flex items-center justify-center backdrop-blur-sm">
                  <i class="bi bi-cash-stack text-white text-lg"></i>
                </div>
                <span class="text-white/80 text-xs font-bold uppercase tracking-wider">Total Earned</span>
              </div>
              <div class="text-3xl md:text-4xl font-bold text-white mb-2">
                $1,842.50
              </div>
              <div class="flex items-center gap-2 text-white/80 text-sm">
                <i class="bi bi-arrow-up-short"></i>
                <span>+$125.30 this month</span>
              </div>
  
              <!-- Available vs Pending -->
              <div class="mt-6 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                <div>
                  <div class="text-white/60 text-xs uppercase tracking-wider mb-1">Available</div>
                  <div class="text-white font-bold text-lg">$1,542.50</div>
                </div>
                <div>
                  <div class="text-white/60 text-xs uppercase tracking-wider mb-1">Pending</div>
                  <div class="text-white font-bold text-lg">$300.00</div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Referral Milestones -->
          <div class="rounded-2xl p-5 md:p-6
                      bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                          bg-amber-500/10 dark:bg-amber-500/[0.08]">
                <i class="bi bi-trophy-fill text-amber-500 text-lg"></i>
              </div>
              <div>
                <h3 class="font-bold text-lg text-gray-800 dark:text-white">Milestones</h3>
                <p class="text-xs text-gray-400 dark:text-white/40">Unlock bonus rewards</p>
              </div>
            </div>
  
            <div class="space-y-4">
              <div 
                v-for="milestone in milestones" 
                :key="milestone.count"
                class="flex items-center gap-3"
              >
                <!-- Progress Circle -->
                <div 
                  class="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs relative"
                  :class="milestone.unlocked 
                    ? 'text-primary-900' 
                    : 'bg-gray-100 dark:bg-white/[0.04] text-gray-400 dark:text-white/30'"
                  :style="milestone.unlocked ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%);' : ''"
                >
                  <i v-if="milestone.unlocked" class="bi bi-check-lg text-base"></i>
                  <span v-else>{{ milestone.count }}</span>
                </div>
  
                <!-- Info -->
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-bold text-gray-800 dark:text-white">
                      {{ milestone.count }} Referrals
                    </span>
                    <span 
                      class="text-xs font-bold"
                      :class="milestone.unlocked ? 'text-amber-500' : 'text-gray-400 dark:text-white/30'"
                    >
                      {{ milestone.reward }}
                    </span>
                  </div>
                  <div class="h-1.5 rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-500"
                      :style="{ 
                        width: `${Math.min((currentReferralCount / milestone.count) * 100, 100)}%`,
                        background: milestone.unlocked 
                          ? 'linear-gradient(90deg, #F5D77F 0%, #E6BB5C 100%)' 
                          : 'linear-gradient(90deg, #94a3b8 0%, #64748b 100%)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Share Buttons -->
          <div class="rounded-2xl p-5 md:p-6
                      bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                          bg-blue-500/10 dark:bg-blue-500/[0.08]">
                <i class="bi bi-share-fill text-blue-400 text-lg"></i>
              </div>
              <div>
                <h3 class="font-bold text-lg text-gray-800 dark:text-white">Share</h3>
                <p class="text-xs text-gray-400 dark:text-white/40">Spread the word</p>
              </div>
            </div>
  
            <div class="grid grid-cols-2 gap-2">
              <button 
                v-for="social in shareOptions" 
                :key="social.name"
                @click="shareTo(social)"
                class="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-xs transition-all duration-200
                       bg-gray-50 hover:bg-gray-100 border border-gray-100
                       dark:bg-white/[0.03] dark:border-white/[0.06] dark:hover:bg-white/[0.06]"
                :style="`color: ${social.color};`"
              >
                <i :class="social.icon" class="text-base"></i>
                <span>{{ social.name }}</span>
              </button>
            </div>
          </div>
  
          <!-- Referral Terms -->
          <div class="rounded-2xl p-5 md:p-6
                      bg-amber-500/[0.04] border border-amber-500/[0.15]
                      dark:bg-amber-500/[0.04] dark:border-amber-500/[0.15]">
            <div class="flex items-start gap-3">
              <i class="bi bi-info-circle text-amber-500 text-lg flex-shrink-0 mt-0.5"></i>
              <div>
                <h4 class="font-bold text-sm text-amber-600 dark:text-amber-400 mb-2">Referral Terms</h4>
                <ul class="text-xs text-gray-600 dark:text-white/50 space-y-1.5">
                  <li class="flex items-start gap-2">
                    <span class="text-amber-500 mt-1">•</span>
                    <span>You earn 5% commission on every deposit your referrals make</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-amber-500 mt-1">•</span>
                    <span>Commissions are credited instantly and can be withdrawn anytime</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-amber-500 mt-1">•</span>
                    <span>Self-referrals are not permitted and will be rejected</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-amber-500 mt-1">•</span>
                    <span>Referral rewards are subject to fraud prevention checks</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Copy Toast Notification -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-95"
      >
        <div 
          v-if="showToast"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[600] px-5 py-3 rounded-xl
                 bg-gray-900 dark:bg-white shadow-2xl flex items-center gap-3"
        >
          <i class="bi bi-check-circle-fill text-emerald-500 text-lg"></i>
          <span class="text-white dark:text-gray-900 text-sm font-medium">{{ toastMessage }}</span>
        </div>
      </Transition>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  definePageMeta({
    layout: 'dashboard'
  })
  
  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────
  const statusFilter = ref('all')
  const showToast = ref(false)
  const toastMessage = ref('')
  const referralCode = ref('JOHN2026')
  const currentReferralCount = ref(8)
  
  const referralLink = computed(() => `https://coinsquarewealth.org/?ref=${referralCode.value.toLowerCase()}`)
  
  // ─────────────────────────────────────────────────────────────
  // STATS
  // ─────────────────────────────────────────────────────────────
  const referralStats = [
    { 
      label: 'Total Referrals', 
      value: '8', 
      icon: 'bi bi-people-fill', 
      iconColor: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.15)',
      change: '+2 this month',
      changeColor: 'text-emerald-500',
      changeIcon: 'bi bi-arrow-up-short'
    },
    { 
      label: 'Active Referrals', 
      value: '6', 
      icon: 'bi bi-person-check-fill', 
      iconColor: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      change: '75% active rate',
      changeColor: 'text-emerald-500',
      changeIcon: 'bi bi-check-circle'
    },
    { 
      label: 'Total Commission', 
      value: '$1,842.50', 
      icon: 'bi bi-cash-stack', 
      iconColor: '#bb914a',
      bgColor: 'rgba(187, 145, 74, 0.15)',
      change: '+$125.30 this month',
      changeColor: 'text-emerald-500',
      changeIcon: 'bi bi-arrow-up-short'
    },
    { 
      label: 'Pending Payout', 
      value: '$300.00', 
      icon: 'bi bi-clock-history', 
      iconColor: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.15)',
      change: 'Processing',
      changeColor: 'text-amber-500',
      changeIcon: 'bi bi-clock'
    }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // HOW IT WORKS
  // ─────────────────────────────────────────────────────────────
  const howItWorks = [
    {
      title: 'Share Your Link',
      description: 'Send your unique referral link to friends via social media, email, or messaging apps.',
      icon: 'bi bi-share-fill'
    },
    {
      title: 'Friend Signs Up',
      description: 'When your friend registers using your link, they become part of your referral network.',
      icon: 'bi bi-person-plus-fill'
    },
    {
      title: 'Earn 5% Forever',
      description: 'Get 5% commission on every deposit your referred friend makes — for life!',
      icon: 'bi bi-cash-coin'
    }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // REFERRALS DATA
  // ─────────────────────────────────────────────────────────────
  const referrals = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j***@gmail.com',
      avatar: 'SJ',
      bgColor: '#F7931A',
      textColor: 'white',
      joined: 'Aug 10, 2026',
      invested: '5,500.00',
      commission: '275.00',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c***@outlook.com',
      avatar: 'MC',
      bgColor: '#627EEA',
      textColor: 'white',
      joined: 'Aug 8, 2026',
      invested: '3,200.00',
      commission: '160.00',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.r***@yahoo.com',
      avatar: 'ER',
      bgColor: '#26A17B',
      textColor: 'white',
      joined: 'Aug 5, 2026',
      invested: '1,800.00',
      commission: '90.00',
      status: 'Active'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.k***@gmail.com',
      avatar: 'DK',
      bgColor: '#14F195',
      textColor: '#020862',
      joined: 'Aug 2, 2026',
      invested: '2,500.00',
      commission: '125.00',
      status: 'Pending'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa.a***@proton.me',
      avatar: 'LA',
      bgColor: '#F3BA2F',
      textColor: '#020862',
      joined: 'Jul 30, 2026',
      invested: '4,800.00',
      commission: '240.00',
      status: 'Active'
    },
    {
      id: 6,
      name: 'Ahmed Hassan',
      email: 'ahmed.h***@gmail.com',
      avatar: 'AH',
      bgColor: '#EF0027',
      textColor: 'white',
      joined: 'Jul 28, 2026',
      invested: '1,200.00',
      commission: '60.00',
      status: 'Inactive'
    },
    {
      id: 7,
      name: 'Maria Silva',
      email: 'maria.s***@gmail.com',
      avatar: 'MS',
      bgColor: '#8247E5',
      textColor: 'white',
      joined: 'Jul 25, 2026',
      invested: '3,500.00',
      commission: '175.00',
      status: 'Active'
    },
    {
      id: 8,
      name: 'James Wilson',
      email: 'james.w***@icloud.com',
      avatar: 'JW',
      bgColor: '#0033AD',
      textColor: 'white',
      joined: 'Jul 22, 2026',
      invested: '2,100.00',
      commission: '105.00',
      status: 'Pending'
    }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // MILESTONES
  // ─────────────────────────────────────────────────────────────
  const milestones = [
    { count: 5, reward: '$50 Bonus', unlocked: true },
    { count: 10, reward: '$150 Bonus', unlocked: false },
    { count: 25, reward: '$500 Bonus', unlocked: false },
    { count: 50, reward: '$1,500 Bonus', unlocked: false }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // SHARE OPTIONS
  // ─────────────────────────────────────────────────────────────
  const shareOptions = [
    { name: 'Twitter', icon: 'bi bi-twitter-x', color: '#000000', url: 'https://twitter.com/intent/tweet?text=Join%20me%20on%20CoinSquare%20Wealth&url=' },
    { name: 'Facebook', icon: 'bi bi-facebook', color: '#1877F2', url: 'https://www.facebook.com/sharer/sharer.php?u=' },
    { name: 'WhatsApp', icon: 'bi bi-whatsapp', color: '#25D366', url: 'https://wa.me/?text=Join%20me%20on%20CoinSquare%20Wealth%20' },
    { name: 'Telegram', icon: 'bi bi-telegram', color: '#0088CC', url: 'https://t.me/share/url?url=' },
    { name: 'LinkedIn', icon: 'bi bi-linkedin', color: '#0A66C2', url: 'https://www.linkedin.com/sharing/share-offsite/?url=' },
    { name: 'Email', icon: 'bi bi-envelope-fill', color: '#EA4335', url: 'mailto:?subject=Join CoinSquare Wealth&body=' }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const filteredReferrals = computed(() => {
    if (statusFilter.value === 'all') return referrals
    return referrals.filter(r => r.status === statusFilter.value)
  })
  
  // ─────────────────────────────────────────────────────────────
  // METHODS
  // ─────────────────────────────────────────────────────────────
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink.value)
      showToastMessage('Referral link copied to clipboard!')
    } catch (err) {
      // Fallback
      const input = document.getElementById('referral_link')
      if (input) {
        input.select()
        document.execCommand('copy')
        showToastMessage('Referral link copied to clipboard!')
      }
    }
  }
  
  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join CoinSquare Wealth',
        text: 'Start investing with CoinSquare Wealth. Use my referral link to get started!',
        url: referralLink.value
      }).catch(() => {})
    } else {
      copyReferralLink()
    }
  }
  
  const shareTo = (social) => {
    const shareUrl = social.url + encodeURIComponent(referralLink.value)
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }
  
  const showToastMessage = (message) => {
    toastMessage.value = message
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
  </script>
  
  <style scoped>
  /* Smooth transitions */
  .smooth-transition {
    transition: all 0.3s ease;
  }
  
  /* Table scrollbar */
  .overflow-x-auto::-webkit-scrollbar {
    height: 6px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: rgba(187, 145, 74, 0.3);
    border-radius: 10px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(187, 145, 74, 0.5);
  }
  
  /* Select styling */
  select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  
  .dark select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-opacity='0.4' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  }
  </style>