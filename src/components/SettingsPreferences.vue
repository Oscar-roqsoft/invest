<template>
    <div class="space-y-4 md:space-y-6">
      
      <!-- Appearance -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        
        <div class="flex items-center gap-3 mb-6">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                      bg-purple-500/10 dark:bg-purple-500/[0.08]">
            <i class="bi bi-palette-fill text-purple-500 text-lg"></i>
          </div>
          <div>
            <h2 class="font-bold text-lg text-gray-800 dark:text-white">Appearance</h2>
            <p class="text-xs text-gray-400 dark:text-white/40">Customize how the app looks</p>
          </div>
        </div>
  
        <!-- Theme Selector -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-3">Theme</label>
          <div class="grid grid-cols-3 gap-3">
            <button 
              v-for="theme in themes" 
              :key="theme.id"
              @click="selectedTheme = theme.id"
              class="p-4 rounded-xl border-2 transition-all duration-200"
              :class="selectedTheme === theme.id
                ? 'border-gold-500 dark:border-amber-500 bg-gold-500/[0.04]'
                : 'border-gray-100 dark:border-white/[0.06] hover:border-gold-300 dark:hover:border-blue-500/30'"
            >
              <div class="w-full h-16 rounded-lg mb-3 border border-gray-100 dark:border-white/[0.06]"
                   :style="{ background: theme.preview }">
                <div class="flex items-center justify-center h-full">
                  <i :class="theme.icon" class="text-2xl opacity-30"></i>
                </div>
              </div>
              <p class="text-sm font-bold text-center text-gray-800 dark:text-white">{{ theme.name }}</p>
              <p class="text-xs text-center text-gray-500 dark:text-white/40 mt-0.5">{{ theme.description }}</p>
            </button>
          </div>
        </div>
  
        <!-- Accent Color -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-3">Accent Color</label>
          <div class="flex flex-wrap gap-3">
            <button 
              v-for="color in accentColors" 
              :key="color.id"
              @click="selectedAccent = color.id"
              class="w-12 h-12 rounded-full transition-all duration-200 relative flex items-center justify-center"
              :style="{ background: color.value }"
              :title="color.name"
            >
              <i v-if="selectedAccent === color.id" class="bi bi-check-lg text-white text-lg font-bold drop-shadow"></i>
            </button>
          </div>
        </div>
  
        <!-- Language -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">Language</label>
          <select 
            v-model="selectedLanguage"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer
                   bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
          >
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="pt">🇵🇹 Português</option>
            <option value="ar">🇸🇦 العربية</option>
            <option value="zh">🇨🇳 中文</option>
          </select>
        </div>
      </div>
  
      <!-- Regional Settings -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        
        <div class="flex items-center gap-3 mb-6">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                      bg-blue-500/10 dark:bg-blue-500/[0.08]">
            <i class="bi bi-globe text-blue-500 text-lg"></i>
          </div>
          <div>
            <h2 class="font-bold text-lg text-gray-800 dark:text-white">Regional</h2>
            <p class="text-xs text-gray-400 dark:text-white/40">Currency and timezone preferences</p>
          </div>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">Currency</label>
            <select 
              v-model="selectedCurrency"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
              <option value="USD">$ USD - US Dollar</option>
              <option value="EUR">€ EUR - Euro</option>
              <option value="GBP">£ GBP - British Pound</option>
              <option value="JPY">¥ JPY - Japanese Yen</option>
              <option value="NGN">₦ NGN - Nigerian Naira</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">Timezone</label>
            <select 
              v-model="selectedTimezone"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
              <option value="UTC-8">UTC-8 - Pacific Time</option>
              <option value="UTC-5">UTC-5 - Eastern Time</option>
              <option value="UTC+0">UTC+0 - London</option>
              <option value="UTC+1">UTC+1 - Paris</option>
              <option value="UTC+8">UTC+8 - Singapore</option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- Trading Preferences -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        
        <div class="flex items-center gap-3 mb-6">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                      bg-emerald-500/10 dark:bg-emerald-500/[0.08]">
            <i class="bi bi-graph-up-arrow text-emerald-500 text-lg"></i>
          </div>
          <div>
            <h2 class="font-bold text-lg text-gray-800 dark:text-white">Trading Preferences</h2>
            <p class="text-xs text-gray-400 dark:text-white/40">Default settings for your trades</p>
          </div>
        </div>
  
        <div class="space-y-3">
          <div 
            v-for="pref in tradingPrefs" 
            :key="pref.id"
            class="flex items-center justify-between gap-4 p-4 rounded-xl
                   bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]"
          >
            <div class="flex-1">
              <p class="font-bold text-sm text-gray-800 dark:text-white">{{ pref.title }}</p>
              <p class="text-xs text-gray-500 dark:text-white/40 mt-0.5">{{ pref.description }}</p>
            </div>
            <button 
              @click="pref.enabled = !pref.enabled"
              class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 flex-shrink-0"
              :class="pref.enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/[0.1]'"
            >
              <span 
                class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 shadow-sm"
                :class="pref.enabled ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Save -->
      <div class="flex justify-end">
        <button 
          @click="savePreferences"
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
  
  const selectedTheme = ref('auto')
  const selectedAccent = ref('gold')
  const selectedLanguage = ref('en')
  const selectedCurrency = ref('USD')
  const selectedTimezone = ref('UTC+0')
  
  const themes = [
    { id: 'light', name: 'Light', description: 'Bright & clean', icon: 'bi bi-sun-fill', preview: 'linear-gradient(135deg, #ffffff 0%, #f7f8fc 100%)' },
    { id: 'dark', name: 'Dark', description: 'Easy on eyes', icon: 'bi bi-moon-stars-fill', preview: 'linear-gradient(135deg, #1E3A8A 0%, #0A1033 100%)' },
    { id: 'auto', name: 'Auto', description: 'System default', icon: 'bi bi-circle-half', preview: 'linear-gradient(135deg, #ffffff 50%, #0A1033 50%)' }
  ]
  
  const accentColors = [
    { id: 'gold', name: 'Gold', value: 'linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%)' },
    { id: 'blue', name: 'Blue', value: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' },
    { id: 'purple', name: 'Purple', value: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' },
    { id: 'emerald', name: 'Emerald', value: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' },
    { id: 'red', name: 'Red', value: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)' },
    { id: 'pink', name: 'Pink', value: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)' }
  ]
  
  const tradingPrefs = ref([
    { id: 1, title: 'Confirm Before Trade', description: 'Show confirmation dialog before executing a trade', enabled: true },
    { id: 2, title: 'Sound Effects', description: 'Play sounds for trade executions and notifications', enabled: false },
    { id: 3, title: 'Show Balances in Crypto', description: 'Display portfolio values primarily in crypto', enabled: true },
    { id: 4, title: 'Two-Step Withdrawal', description: 'Require email confirmation for large withdrawals', enabled: true }
  ])
  
  const savePreferences = () => {
    // Save logic
  }
  </script>