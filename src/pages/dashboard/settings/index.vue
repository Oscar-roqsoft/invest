<template>
    <DashboardLayout>
      <!-- Page Header -->
      <div class="mb-6 md:mb-8">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-gold-500/10 dark:bg-amber-500/[0.08]">
            <i class="bi bi-gear-fill text-amber-500 text-lg"></i>
          </div>
          <div>
            <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Settings</h1>
            <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">Manage your account preferences and security</p>
          </div>
        </div>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <div class="rounded-2xl p-3 md:p-4 sticky top-24
                      bg-white border border-gray-100 shadow-sm
                      dark:bg-[#101A47] dark:border-white/[0.05]">
            
            <!-- Profile Card -->
            <div class="flex items-center gap-3 p-3 mb-3 rounded-xl
                        bg-gray-50 dark:bg-white/[0.03]">
              <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold-500/30">
                <img src="/profile.jpg" alt="Profile" class="w-full h-full object-cover">
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-bold text-sm text-gray-800 dark:text-white truncate">john</p>
                <p class="text-xs text-gray-500 dark:text-white/40 truncate">john@example.com</p>
              </div>
            </div>
  
            <!-- Navigation -->
            <nav class="space-y-1">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                :class="activeTab === tab.id 
                  ? 'text-primary-900 shadow-md shadow-amber-500/20' 
                  : 'text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.04] hover:text-gray-800 dark:hover:text-white'"
                :style="activeTab === tab.id ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%);' : ''"
              >
                <i :class="tab.icon" class="text-base"></i>
                <span>{{ tab.name }}</span>
                <i v-if="tab.badge" class="bi bi-exclamation-circle-fill ml-auto text-xs text-amber-500"></i>
              </button>
            </nav>
  
            <!-- Logout -->
            <div class="mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
              <a 
                href="?a=logout"
                class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors
                       text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/[0.08]"
              >
                <i class="bi bi-box-arrow-right text-base"></i>
                <span>Log Out</span>
              </a>
            </div>
          </div>
        </div>
  
        <!-- Content Area -->
        <div class="lg:col-span-3">
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 translate-x-4"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-200 absolute"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-4"
            mode="out-in"
          >
            <!-- Profile Tab -->
            <div 
              v-if="activeTab === 'profile'" 
              key="profile"
              class="space-y-4 md:space-y-6"
            >
              <SettingsProfile />
            </div>
  
            <!-- Security Tab -->
            <div 
              v-else-if="activeTab === 'security'" 
              key="security"
              class="space-y-4 md:space-y-6"
            >
              <SettingsSecurity />
            </div>
  
            <!-- Notifications Tab -->
            <div 
              v-else-if="activeTab === 'notifications'" 
              key="notifications"
              class="space-y-4 md:space-y-6"
            >
              <SettingsNotifications />
            </div>
  
            <!-- Payment Methods Tab -->
            <div 
              v-else-if="activeTab === 'payment'" 
              key="payment"
              class="space-y-4 md:space-y-6"
            >
              <SettingsPayment />
            </div>
  
            <!-- Preferences Tab -->
            <div 
              v-else-if="activeTab === 'preferences'" 
              key="preferences"
              class="space-y-4 md:space-y-6"
            >
              <SettingsPreferences />
            </div>
  
            <!-- Verification Tab -->
            <div 
              v-else-if="activeTab === 'verification'" 
              key="verification"
              class="space-y-4 md:space-y-6"
            >
              <SettingsVerification />
            </div>
          </Transition>
        </div>
      </div>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  
  // Import sub-components
 
  definePageMeta({
    layout: 'dashboard'
  })
  
  const route = useRoute()
  const router = useRouter()
  
  const tabs = [
    { id: 'profile', name: 'Profile', icon: 'bi bi-person-fill' },
    { id: 'security', name: 'Security', icon: 'bi bi-shield-lock-fill' },
    { id: 'notifications', name: 'Notifications', icon: 'bi bi-bell-fill' },
    { id: 'payment', name: 'Payment Methods', icon: 'bi bi-credit-card-fill' },
    { id: 'preferences', name: 'Preferences', icon: 'bi bi-sliders' },
    { id: 'verification', name: 'Verification', icon: 'bi bi-patch-check-fill', badge: true }
  ]
  
  const activeTab = ref('profile')
  
  // Sync tab with query param
  onMounted(() => {
    if (route.query.tab && tabs.find(t => t.id === route.query.tab)) {
      activeTab.value = route.query.tab
    }
  })
  
  // Watch for active tab changes
  import { watch } from 'vue'
  watch(activeTab, (newTab) => {
    router.replace({ query: { tab: newTab } })
  })
  </script>
  
  <style scoped>
  .sticky {
    position: sticky;
    top: 6rem;
  }
  </style>