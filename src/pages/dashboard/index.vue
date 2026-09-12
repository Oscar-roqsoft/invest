<template>
    <DashboardLayout>
      <!-- Dashboard Content -->
      <div class="dashboard-content space-y-6 mt-20">
  
        <!-- Main Balance Card -->
        <div 
          class="rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-500 hover:shadow-2xl
                 bg-white shadow-xl shadow-gray-200/50 border border-gray-100
                 dark:bg-gradient-to-br dark:from-[#152155] dark:via-[#101A47] dark:to-[#0F1B4C] 
                 dark:border-white/[0.06] dark:shadow-2xl dark:shadow-blue-900/40"
        >
          <!-- Decorative Elements -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute -top-20 -right-20 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl dark:hidden"></div>
            <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl dark:hidden"></div>
            
            <div class="hidden dark:block absolute -top-20 -right-20 w-64 h-64 bg-blue-500/[0.15] rounded-full blur-3xl"></div>
            <div class="hidden dark:block absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/[0.12] rounded-full blur-3xl"></div>
            <div class="hidden dark:block absolute inset-0 opacity-[0.02]" style="background-image: radial-gradient(circle, #F5D77F 1px, transparent 1px); background-size: 24px 24px;"></div>
          </div>
  
          <div class="relative z-10">
            <div class="flex flex-wrap items-start justify-between gap-6 mb-8">
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center
                              bg-gold-500/10 dark:bg-amber-500/[0.12]">
                    <i class="bi bi-wallet2 text-amber-500 text-sm"></i>
                  </div>
                  <span class="text-sm font-medium uppercase tracking-wider
                               text-gray-500 dark:text-white/40">
                    Total Balance
                  </span>
                </div>
                <div class="text-4xl md:text-5xl font-bold tracking-tight transition-colors duration-500
                            text-gray-900 dark:text-white">
                  $0.00
                </div>
                <div class="mt-2 text-sm text-gray-400 dark:text-white/30">
                  Available for withdrawal
                </div>
              </div>
              
              <!-- Mini Stats -->
              <div class="flex gap-8 md:gap-12">
                <div>
                  <div class="text-xs uppercase tracking-wider mb-1 text-gray-500 dark:text-white/40">
                    Earnings
                  </div>
                  <div class="text-amber-500 font-bold text-xl">$0.00</div>
                </div>
                <div>
                  <div class="text-xs uppercase tracking-wider mb-1 text-gray-500 dark:text-white/40">
                    Deposits
                  </div>
                  <div class="font-bold text-xl text-gray-800 dark:text-white">
                    $0.00
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row gap-3">
              <a 
                href="?a=withdraw" 
                class="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-300 border backdrop-blur-sm
                       bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200
                       dark:bg-white/[0.04] dark:text-white/90 dark:hover:bg-white/[0.08] dark:border-white/[0.06]"
              >
                <i class="bi bi-arrow-up-right"></i>
                <span>Withdraw Funds</span>
              </a>
              <a 
                href="?a=deposit" 
                class="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
                style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
                @mouseenter="(e) => e.currentTarget.style.backgroundPosition = 'right center'"
                @mouseleave="(e) => e.currentTarget.style.backgroundPosition = 'left center'"
              >
                <i class="bi bi-plus-circle"></i>
                <span>Deposit Funds</span>
              </a>
            </div>
          </div>
        </div>
  
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div 
            v-for="stat in stats" 
            :key="stat.label" 
            class="stat-card rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                   bg-white border border-gray-100 hover:border-gold-300 shadow-sm
                   dark:bg-[#101A47] dark:border-white/[0.05] dark:hover:border-blue-500/30 dark:hover:shadow-blue-900/30"
          >
            <div class="flex items-start justify-between mb-4">
              <div 
                class="w-12 h-12 rounded-2xl flex items-center justify-center"
                :style="{ background: stat.bgColor }"
              >
                <i :class="stat.icon" :style="{ color: stat.iconColor }" class="text-xl"></i>
              </div>
              <span 
                class="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-0.5"
                :class="stat.change.startsWith('+') 
                  ? 'text-green-600 bg-green-500/10 dark:text-emerald-400 dark:bg-emerald-500/[0.08]'
                  : 'text-red-500 bg-red-500/10 dark:text-red-400 dark:bg-red-500/[0.08]'"
              >
                <i :class="stat.change.startsWith('+') ? 'bi bi-arrow-up-short' : 'bi bi-arrow-down-short'"></i>
                {{ stat.change }}
              </span>
            </div>
            <p class="text-xs uppercase tracking-wider mb-2 font-medium text-gray-500 dark:text-white/40">
              {{ stat.label }}
            </p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ stat.value }}
            </p>
          </div>
        </div>
  
        <!-- Referral Link & User Info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <!-- Referral Link -->
          <div class="rounded-2xl p-6 md:p-8 transition-all duration-300
                      bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                          bg-gold-500/10 dark:bg-amber-500/[0.08]">
                <i class="bi bi-share-fill text-amber-500 text-lg"></i>
              </div>
              <div>
                <h4 class="font-bold text-lg text-gray-800 dark:text-white">
                  Referral Program
                </h4>
                <p class="text-xs text-gray-400 dark:text-white/40">
                  Earn 5% on every referral
                </p>
              </div>
            </div>
            
            <p class="text-sm mb-4 text-gray-600 dark:text-white/60">
              Share your link and earn a <strong class="text-amber-500">5% bonus</strong> when someone signs up!
            </p>
            
            <div class="flex gap-2 mb-3">
              <input 
                type="text" 
                readonly 
                id="ref_cop" 
                class="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 font-mono
                       bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                       dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/60 dark:focus:border-blue-500/40"
                :value="referralLink"
              >
              <button 
                class="px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
                style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
                @click="copyReferralLink"
              >
                <i class="bi bi-copy mr-2"></i> Copy
              </button>
            </div>
            
            <p class="text-xs text-gray-400 dark:text-white/30">
              Every successful referral gives you <strong class="text-amber-500">5%</strong> of their initial investment.
            </p>
          </div>
  
          <!-- User Info -->
          <div class="rounded-2xl p-6 md:p-8 transition-all duration-300
                      bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                          bg-gold-500/10 dark:bg-blue-500/[0.08]">
                <i class="bi bi-person-circle text-blue-400 text-lg"></i>
              </div>
              <div>
                <h4 class="font-bold text-lg text-gray-800 dark:text-white">
                  Account Information
                </h4>
                <p class="text-xs text-gray-400 dark:text-white/40">
                  Your account details
                </p>
              </div>
            </div>
            
            <div class="space-y-1">
              <div 
                v-for="info in accountInfo" 
                :key="info.label"
                class="flex justify-between items-center py-3 border-b last:border-0
                       border-gray-100 dark:border-white/[0.04]"
              >
                <span class="text-sm text-gray-500 dark:text-white/40">
                  {{ info.label }}
                </span>
                <span class="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {{ info.value }}
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Charts / Activity Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <!-- Portfolio Chart -->
          <div class="lg:col-span-2 rounded-2xl p-5 md:p-6 transition-all duration-300
                      bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                            bg-gold-500/10 dark:bg-blue-500/[0.08]">
                  <i class="bi bi-graph-up-arrow text-blue-400 text-lg"></i>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-gray-800 dark:text-white">
                    Portfolio Performance
                  </h3>
                  <p class="text-xs text-gray-400 dark:text-white/40">
                    Last 12 months
                  </p>
                </div>
              </div>
              <span class="text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1
                           bg-green-50 text-green-600
                           dark:bg-emerald-500/[0.08] dark:text-emerald-400">
                <i class="bi bi-arrow-up-short"></i>
                +12.5%
              </span>
            </div>
            
            <div class="h-56 flex items-end gap-1.5 md:gap-2">
              <div 
                v-for="(value, index) in chartData" 
                :key="index" 
                class="flex-1 rounded-t-lg transition-all duration-500 cursor-pointer group relative"
                :style="{ 
                  height: value + '%',
                  background: 'linear-gradient(180deg, #F5D77F 0%, #E6BB5C 50%, #D4A44A 100%)',
                  opacity: 0.7
                }"
                @mouseenter="(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scaleY(1.02)'; }"
                @mouseleave="(e) => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.transform = 'scaleY(1)'; }"
              >
                <div class="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  <div class="px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-lg
                              bg-gray-900 text-white
                              dark:bg-white dark:text-gray-800">
                    {{ labels[index] }}: ${{ value }}k
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-end gap-1.5 md:gap-2 mt-3">
              <div 
                v-for="(label, index) in labels" 
                :key="index" 
                class="flex-1 text-center text-xs font-medium text-gray-400 dark:text-white/30"
              >
                {{ label }}
              </div>
            </div>
          </div>
  
          <!-- Quick Stats -->
          <div class="rounded-2xl p-5 md:p-6 transition-all duration-300
                      bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                          bg-gold-500/10 dark:bg-blue-500/[0.08]">
                <i class="bi bi-bar-chart-fill text-blue-400 text-lg"></i>
              </div>
              <div>
                <h3 class="font-bold text-lg text-gray-800 dark:text-white">
                  Quick Stats
                </h3>
                <p class="text-xs text-gray-400 dark:text-white/40">
                  Overview
                </p>
              </div>
            </div>
            
            <div class="space-y-3">
              <div 
                v-for="stat in quickStats" 
                :key="stat.label" 
                class="flex items-center justify-between p-3.5 rounded-xl transition-all duration-200
                       bg-gray-50 hover:bg-gray-100 border border-gray-100
                       dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:border-white/[0.04]"
              >
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span class="text-sm font-medium text-gray-600 dark:text-white/50">
                    {{ stat.label }}
                  </span>
                </div>
                <span class="font-bold text-sm text-gray-800 dark:text-white">
                  {{ stat.value }}
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Recent Transactions -->
        <div class="rounded-2xl transition-all duration-300 overflow-hidden
                    bg-white border border-gray-100 shadow-sm
                    dark:bg-[#101A47] dark:border-white/[0.05]">
          <div class="flex items-center justify-between p-5 md:p-6">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                          bg-gold-500/10 dark:bg-blue-500/[0.08]">
                <i class="bi bi-clock-history text-blue-400 text-lg"></i>
              </div>
              <div>
                <h3 class="font-bold text-lg text-gray-800 dark:text-white">
                  Recent Transactions
                </h3>
                <p class="text-xs text-gray-400 dark:text-white/40">
                  Your latest activity
                </p>
              </div>
            </div>
            <a 
              href="?a=history" 
              class="text-amber-500 text-sm font-semibold hover:text-amber-400 transition-colors duration-200 flex items-center gap-1 group"
            >
              View All 
              <i class="bi bi-arrow-right group-hover:translate-x-1 transition-transform duration-200"></i>
            </a>
          </div>
  
          <div class="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar">
            <table class="w-full min-w-[600px]">
              <thead 
                class="sticky top-0 z-10 backdrop-blur-md
                       bg-white/95 dark:bg-[#101A47]/95"
              >
                <tr class="border-b border-gray-200 dark:border-white/[0.06]">
                  <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/30">Type</th>
                  <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/30">Amount</th>
                  <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/30">Status</th>
                  <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/30">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="tx in transactions" 
                  :key="tx.id" 
                  class="transition-colors duration-200 border-b
                         border-gray-100 hover:bg-gray-50
                         dark:border-white/[0.03] dark:hover:bg-white/[0.03]"
                >
                  <td class="py-4 px-5 md:px-6">
                    <div class="flex items-center gap-3">
                      <div 
                        class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        :class="tx.type === 'Deposit' 
                          ? 'bg-green-50 dark:bg-emerald-500/[0.08]' 
                          : tx.type === 'Withdrawal' 
                            ? 'bg-red-50 dark:bg-red-500/[0.08]' 
                            : 'bg-blue-50 dark:bg-blue-500/[0.08]'"
                      >
                        <i 
                          :class="tx.type === 'Deposit' 
                            ? 'bi bi-arrow-down-circle text-emerald-500' 
                            : tx.type === 'Withdrawal' 
                              ? 'bi bi-arrow-up-circle text-red-500' 
                              : 'bi bi-graph-up-arrow text-blue-500'"
                          class="text-lg"
                        ></i>
                      </div>
                      <div>
                        <span class="text-sm font-semibold block whitespace-nowrap text-gray-800 dark:text-white/90">
                          {{ tx.type }}
                        </span>
                        <span class="text-xs text-gray-400 dark:text-white/30">
                          Transaction #{{ tx.id }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-5 md:px-6 text-sm font-bold whitespace-nowrap text-gray-800 dark:text-white">
                    ${{ tx.amount }}
                  </td>
                  <td class="py-4 px-5 md:px-6">
                    <span 
                      class="px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap"
                      :class="tx.status === 'Completed' 
                        ? 'bg-green-50 text-green-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400'
                        : 'bg-yellow-50 text-yellow-600 dark:bg-amber-500/[0.08] dark:text-amber-400'"
                    >
                      <span 
                        class="w-1.5 h-1.5 rounded-full"
                        :class="tx.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'"
                      ></span>
                      {{ tx.status }}
                    </span>
                  </td>
                  <td class="py-4 px-5 md:px-6 text-sm whitespace-nowrap text-gray-500 dark:text-white/30">
                    {{ tx.date }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div class="flex items-center justify-between px-5 md:px-6 py-3 border-t
                      border-gray-100 bg-gray-50
                      dark:border-white/[0.06] dark:bg-white/[0.01]">
            <span class="text-xs text-gray-500 dark:text-white/30">
              Showing {{ transactions.length }} of {{ transactions.length }} transactions
            </span>
            <div class="flex items-center gap-1">
              <button 
                class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200
                       hover:bg-gray-200 text-gray-400
                       dark:hover:bg-white/[0.06] dark:text-white/30"
                disabled
              >
                <i class="bi bi-chevron-left text-xs"></i>
              </button>
              <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                           bg-gold-500 text-white
                           dark:bg-blue-500">
                1
              </span>
              <button 
                class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200
                       hover:bg-gray-200 text-gray-400
                       dark:hover:bg-white/[0.06] dark:text-white/30"
              >
                <i class="bi bi-chevron-right text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  definePageMeta({
    layout: 'dashboard'
  })
  
  const showSecurityAlert = ref(true)
  const referralLink = ref('https://coinsquarewealth.org/?ref=john')
  
  const accountInfo = [
    { label: 'User', value: 'john' },
    { label: 'Registration Date', value: 'Sep-9-2026' },
    { label: 'Last Access', value: 'Sep-9-2026 09:40:13 AM' },
    { label: 'Pending Withdrawal', value: '$0.00' }
  ]
  
  const stats = [
    { 
      label: 'Total Balance', 
      value: '$25,847.50', 
      icon: 'bi bi-wallet2', 
      change: '+12.5%',
      bgColor: 'rgba(187, 145, 74, 0.15)',
      iconColor: '#bb914a'
    },
    { 
      label: 'Total Deposits', 
      value: '$32,100.00', 
      icon: 'bi bi-arrow-down-circle', 
      change: '+8.2%',
      bgColor: 'rgba(34, 197, 94, 0.15)',
      iconColor: '#22c55e'
    },
    { 
      label: 'Total Withdrawals', 
      value: '$6,252.50', 
      icon: 'bi bi-arrow-up-circle', 
      change: '-2.1%',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      iconColor: '#ef4444'
    }, 
    { 
      label: 'Active Investments', 
      value: '14', 
      icon: 'bi bi-graph-up-arrow', 
      change: '+3',
      bgColor: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#3b82f6'
    }
  ]
  
  const quickStats = [
    { label: 'Active Deposits', value: '$0.00' },
    { label: 'Total Earnings', value: '$0.00' },
    { label: 'Total Deposits', value: '$0.00' },
    { label: 'Total Withdrawals', value: '$0.00' }
  ]
  
  const chartData = [45, 62, 78, 55, 85, 92, 70, 88, 65, 95, 80, 75]
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const transactions = [
    { id: 1, type: 'Deposit', amount: '5,000.00', status: 'Completed', date: '2026-08-10' },
    { id: 2, type: 'Withdrawal', amount: '1,200.00', status: 'Pending', date: '2026-08-09' },
    { id: 3, type: 'Investment', amount: '2,500.00', status: 'Completed', date: '2026-08-08' },
    { id: 4, type: 'Deposit', amount: '3,000.00', status: 'Completed', date: '2026-08-07' },
    { id: 5, type: 'Withdrawal', amount: '500.00', status: 'Completed', date: '2026-08-06' },
    { id: 6, type: 'Deposit', amount: '1,500.00', status: 'Completed', date: '2026-08-05' },
    { id: 7, type: 'Investment', amount: '3,500.00', status: 'Completed', date: '2026-08-04' },
    { id: 8, type: 'Withdrawal', amount: '800.00', status: 'Pending', date: '2026-08-03' }
  ]
  
  const copyReferralLink = () => {
    const input = document.getElementById('ref_cop')
    if (input) {
      input.select()
      document.execCommand('copy')
      const btn = input.nextElementSibling
      if (btn) {
        const originalText = btn.innerHTML
        btn.innerHTML = '<i class="bi bi-check-circle mr-2"></i> Copied!'
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        btn.style.color = 'white'
        setTimeout(() => {
          btn.innerHTML = originalText
          btn.style.background = 'linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%)'
          btn.style.color = '#020862'
        }, 3000)
      }
    }
  }
  </script>
  
  <style scoped>
  .stat-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(96, 165, 250, 0.3);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(96, 165, 250, 0.5);
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(96, 165, 250, 0.3) transparent;
  }
  
  table {
    border-collapse: separate;
    border-spacing: 0;
  }
  
  tbody tr:last-child {
    border-bottom: none !important;
  }
  
  @media (max-width: 767px) {
    .stat-card {
      padding: 1rem;
    }
  }
  </style>