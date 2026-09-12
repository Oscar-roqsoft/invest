<template>
    <div class="space-y-4 md:space-y-6">
      
      <!-- Email Notifications -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        
        <div class="flex items-center gap-3 mb-6">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                      bg-blue-500/10 dark:bg-blue-500/[0.08]">
            <i class="bi bi-envelope-fill text-blue-500 text-lg"></i>
          </div>
          <div>
            <h2 class="font-bold text-lg text-gray-800 dark:text-white">Email Notifications</h2>
            <p class="text-xs text-gray-400 dark:text-white/40">Choose what emails you want to receive</p>
          </div>
        </div>
  
        <div class="space-y-3">
          <div 
            v-for="notif in emailNotifications" 
            :key="notif.id"
            class="flex items-center justify-between gap-4 p-4 rounded-xl
                   bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]"
          >
            <div class="flex-1">
              <p class="font-bold text-sm text-gray-800 dark:text-white">{{ notif.title }}</p>
              <p class="text-xs text-gray-500 dark:text-white/40 mt-0.5">{{ notif.description }}</p>
            </div>
            <button 
              @click="notif.enabled = !notif.enabled"
              class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 flex-shrink-0 focus:outline-none"
              :class="notif.enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/[0.1]'"
            >
              <span 
                class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 shadow-sm"
                :class="notif.enabled ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Push Notifications -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        
        <div class="flex items-center gap-3 mb-6">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                      bg-amber-500/10 dark:bg-amber-500/[0.08]">
            <i class="bi bi-bell-fill text-amber-500 text-lg"></i>
          </div>
          <div>
            <h2 class="font-bold text-lg text-gray-800 dark:text-white">Push Notifications</h2>
            <p class="text-xs text-gray-400 dark:text-white/40">Browser and mobile push notifications</p>
          </div>
        </div>
  
        <div class="space-y-3">
          <div 
            v-for="notif in pushNotifications" 
            :key="notif.id"
            class="flex items-center justify-between gap-4 p-4 rounded-xl
                   bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]"
          >
            <div class="flex-1">
              <p class="font-bold text-sm text-gray-800 dark:text-white">{{ notif.title }}</p>
              <p class="text-xs text-gray-500 dark:text-white/40 mt-0.5">{{ notif.description }}</p>
            </div>
            <button 
              @click="notif.enabled = !notif.enabled"
              class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 flex-shrink-0 focus:outline-none"
              :class="notif.enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/[0.1]'"
            >
              <span 
                class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 shadow-sm"
                :class="notif.enabled ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Save -->
      <div class="flex justify-end">
        <button 
          @click="saveNotifications"
          class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
          style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
        >
          <i class="bi bi-check-lg mr-1"></i> Save Preferences
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const emailNotifications = ref([
    { id: 1, title: 'Transaction Confirmations', description: 'Get notified for every deposit, withdrawal, and trade', enabled: true },
    { id: 2, title: 'Security Alerts', description: 'Login from new device, password changes, and security updates', enabled: true },
    { id: 3, title: 'Marketing & Promotions', description: 'Special offers, bonuses, and product updates', enabled: false },
    { id: 4, title: 'Referral Commission', description: 'When someone you referred makes a deposit', enabled: true },
    { id: 5, title: 'Weekly Reports', description: 'Weekly summary of your portfolio performance', enabled: true }
  ])
  
  const pushNotifications = ref([
    { id: 1, title: 'Transaction Updates', description: 'Real-time updates on your transactions', enabled: true },
    { id: 2, title: 'Price Alerts', description: 'Notify when crypto prices hit your targets', enabled: false },
    { id: 3, title: 'Login Notifications', description: 'Alert on every account login', enabled: true },
    { id: 4, title: 'Marketing Messages', description: 'Product updates and special offers', enabled: false }
  ])
  
  const saveNotifications = () => {
    // Save logic
  }
  </script>