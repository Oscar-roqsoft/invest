<template>
    <div class="space-y-4 md:space-y-6">
      
      <!-- Security Score Card -->
      <div class="rounded-2xl p-6 relative overflow-hidden
                  bg-gradient-to-br from-emerald-500 to-emerald-600
                  shadow-lg shadow-emerald-500/30">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.1] rounded-full blur-2xl"></div>
        
        <div class="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <i class="bi bi-shield-shaded text-white text-2xl"></i>
              <span class="text-white/80 text-xs font-bold uppercase tracking-wider">Security Score</span>
            </div>
            <div class="text-4xl md:text-5xl font-bold text-white">75%</div>
            <p class="text-white/80 text-sm mt-1">Good - Enable 2FA to reach 100%</p>
          </div>
          <div class="relative w-24 h-24">
            <!-- Circular progress -->
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="8"/>
              <circle 
                cx="50" cy="50" r="42" 
                fill="none" 
                stroke="white" 
                stroke-width="8"
                stroke-linecap="round"
                stroke-dasharray="264"
                stroke-dashoffset="66"
                class="transition-all duration-1000"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <i class="bi bi-shield-fill-check text-white text-3xl"></i>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Change Password -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        
        <div class="flex items-center gap-3 mb-6">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                      bg-gold-500/10 dark:bg-amber-500/[0.08]">
            <i class="bi bi-key-fill text-amber-500 text-lg"></i>
          </div>
          <div>
            <h2 class="font-bold text-lg text-gray-800 dark:text-white">Change Password</h2>
            <p class="text-xs text-gray-400 dark:text-white/40">Update your account password</p>
          </div>
        </div>
  
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Current Password
            </label>
            <div class="relative">
              <input 
                :type="showCurrent ? 'text' : 'password'"
                v-model="password.current"
                placeholder="Enter current password"
                class="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all duration-200
                       bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                       dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
              >
              <button 
                @click="showCurrent = !showCurrent"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors"
              >
                <i :class="showCurrent ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              New Password
            </label>
            <div class="relative">
              <input 
                :type="showNew ? 'text' : 'password'"
                v-model="password.new"
                placeholder="Enter new password"
                class="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all duration-200
                       bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                       dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
              >
              <button 
                @click="showNew = !showNew"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors"
              >
                <i :class="showNew ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
  
            <!-- Password Strength -->
            <div v-if="password.new" class="mt-3">
              <div class="flex items-center gap-2 mb-2">
                <div class="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-500"
                    :class="passwordStrength.color"
                    :style="{ width: passwordStrength.width }"
                  ></div>
                </div>
                <span class="text-xs font-bold" :class="passwordStrength.textColor">
                  {{ passwordStrength.label }}
                </span>
              </div>
              <ul class="space-y-1 text-xs">
                <li 
                  v-for="req in passwordRequirements" 
                  :key="req.label"
                  class="flex items-center gap-2"
                  :class="req.met ? 'text-emerald-500' : 'text-gray-400 dark:text-white/30'"
                >
                  <i :class="req.met ? 'bi bi-check-circle-fill' : 'bi bi-circle'" class="text-xs"></i>
                  {{ req.label }}
                </li>
              </ul>
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Confirm New Password
            </label>
            <div class="relative">
              <input 
                :type="showConfirm ? 'text' : 'password'"
                v-model="password.confirm"
                placeholder="Retype new password"
                class="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all duration-200
                       bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                       dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
              >
              <button 
                @click="showConfirm = !showConfirm"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors"
              >
                <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <p v-if="password.confirm && password.new !== password.confirm" class="text-xs text-red-500 mt-2">
              <i class="bi bi-exclamation-circle mr-1"></i>Passwords do not match
            </p>
          </div>
  
          <div class="flex justify-end pt-2">
            <button 
              @click="updatePassword"
              :disabled="!canUpdatePassword || isUpdating"
              class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
            >
              {{ isUpdating ? 'Updating...' : 'Update Password' }}
            </button>
          </div>
        </div>
      </div>
  
      <!-- Two-Factor Authentication -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                        bg-amber-500/10 dark:bg-amber-500/[0.08]">
              <i class="bi bi-shield-lock-fill text-amber-500 text-lg"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-bold text-lg text-gray-800 dark:text-white">Two-Factor Authentication</h2>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 dark:bg-amber-500/[0.15] dark:text-amber-400">
                  Recommended
                </span>
              </div>
              <p class="text-xs text-gray-400 dark:text-white/40">Add an extra layer of security to your account</p>
            </div>
          </div>
          <button 
            @click="toggle2FA"
            class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none"
            :class="twoFactorEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/[0.1]'"
          >
            <span 
              class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 shadow-sm"
              :class="twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'"
            ></span>
          </button>
        </div>
  
        <div v-if="twoFactorEnabled" class="p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/[0.15]">
          <div class="flex items-start gap-3">
            <i class="bi bi-check-circle-fill text-emerald-500 text-lg flex-shrink-0 mt-0.5"></i>
            <div class="flex-1">
              <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1">2FA is Active</p>
              <p class="text-xs text-gray-600 dark:text-white/50 mb-3">
                Your account is protected with two-factor authentication via authenticator app.
              </p>
              <button class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                View Backup Codes
              </button>
            </div>
          </div>
        </div>
  
        <div v-else class="p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/[0.15]">
          <div class="flex items-start gap-3">
            <i class="bi bi-exclamation-triangle-fill text-amber-500 text-lg flex-shrink-0 mt-0.5"></i>
            <div class="flex-1">
              <p class="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">2FA is Disabled</p>
              <p class="text-xs text-gray-600 dark:text-white/50 mb-3">
                Enable 2FA to significantly improve your account security.
              </p>
              <button 
                @click="setup2FA"
                class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Setup 2FA Now →
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Active Sessions -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        
        <div class="flex items-center gap-3 mb-6">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                      bg-blue-500/10 dark:bg-blue-500/[0.08]">
            <i class="bi bi-display-fill text-blue-500 text-lg"></i>
          </div>
          <div>
            <h2 class="font-bold text-lg text-gray-800 dark:text-white">Active Sessions</h2>
            <p class="text-xs text-gray-400 dark:text-white/40">Devices currently signed in to your account</p>
          </div>
        </div>
  
        <div class="space-y-3">
          <div 
            v-for="session in sessions" 
            :key="session.id"
            class="flex items-center gap-4 p-4 rounded-xl
                   bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                        bg-white dark:bg-white/[0.06] border border-gray-100 dark:border-white/[0.06]">
              <i :class="session.icon" class="text-gray-600 dark:text-white/60 text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <p class="font-bold text-sm text-gray-800 dark:text-white truncate">
                  {{ session.device }}
                </p>
                <span v-if="session.current" class="px-2 py-0.5 rounded-full text-xs font-bold
                                                    bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/[0.15] dark:text-emerald-400">
                  Current
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-white/40 truncate">
                {{ session.location }} · {{ session.ip }}
              </p>
              <p class="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                {{ session.lastActive }}
              </p>
            </div>
            <button 
              v-if="!session.current"
              @click="revokeSession(session.id)"
              class="px-3 py-2 rounded-lg text-xs font-bold transition-colors
                     bg-red-50 text-red-600 hover:bg-red-100
                     dark:bg-red-500/[0.08] dark:text-red-400 dark:hover:bg-red-500/[0.15]"
            >
              Revoke
            </button>
          </div>
        </div>
  
        <button 
          @click="revokeAllSessions"
          class="w-full mt-4 py-3 rounded-xl text-sm font-bold transition-colors
                 text-red-600 hover:bg-red-50
                 dark:text-red-400 dark:hover:bg-red-500/[0.08]"
        >
          <i class="bi bi-box-arrow-right mr-1"></i>
          Sign Out All Other Sessions
        </button>
      </div>
  
      <!-- Danger Zone -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-red-500/[0.03] border border-red-500/[0.15]">
        
        <div class="flex items-center gap-3 mb-4">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                      bg-red-500/10 dark:bg-red-500/[0.15]">
            <i class="bi bi-exclamation-triangle-fill text-red-500 text-lg"></i>
          </div>
          <div>
            <h2 class="font-bold text-lg text-red-600 dark:text-red-400">Danger Zone</h2>
            <p class="text-xs text-gray-500 dark:text-white/40">Irreversible actions that affect your account</p>
          </div>
        </div>
  
        <div class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl
                    bg-white dark:bg-white/[0.03] border border-red-500/[0.15]">
          <div>
            <p class="font-bold text-sm text-gray-800 dark:text-white">Delete Account</p>
            <p class="text-xs text-gray-500 dark:text-white/40 mt-0.5">
              Permanently delete your account and all associated data
            </p>
          </div>
          <button 
            @click="confirmDelete"
            class="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
                   bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30"
          >
            <i class="bi bi-trash mr-1"></i> Delete Account
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const showCurrent = ref(false)
  const showNew = ref(false)
  const showConfirm = ref(false)
  const isUpdating = ref(false)
  const twoFactorEnabled = ref(false)
  
  const password = ref({
    current: '',
    new: '',
    confirm: ''
  })
  
  const passwordRequirements = computed(() => [
    { label: 'At least 8 characters', met: password.value.new.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password.value.new) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password.value.new) },
    { label: 'Contains a number', met: /[0-9]/.test(password.value.new) },
    { label: 'Contains special character', met: /[^a-zA-Z0-9]/.test(password.value.new) }
  ])
  
  const passwordStrength = computed(() => {
    const met = passwordRequirements.value.filter(r => r.met).length
    if (met <= 1) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500', width: '20%' }
    if (met <= 2) return { label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-500', width: '40%' }
    if (met <= 3) return { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-500', width: '60%' }
    if (met <= 4) return { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500', width: '80%' }
    return { label: 'Very Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500', width: '100%' }
  })
  
  const canUpdatePassword = computed(() => {
    return password.value.current &&
           password.value.new.length >= 8 &&
           password.value.new === password.value.confirm &&
           passwordRequirements.value.every(r => r.met)
  })
  
  const sessions = ref([
    {
      id: 1,
      device: 'Chrome on macOS',
      location: 'New York, US',
      ip: '192.168.1.1',
      lastActive: 'Active now',
      icon: 'bi bi-laptop',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, US',
      ip: '192.168.1.2',
      lastActive: '2 hours ago',
      icon: 'bi bi-phone',
      current: false
    },
    {
      id: 3,
      device: 'Firefox on Windows',
      location: 'Toronto, CA',
      ip: '203.0.113.5',
      lastActive: '3 days ago',
      icon: 'bi bi-display',
      current: false
    }
  ])
  
  const updatePassword = async () => {
    isUpdating.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))
    password.value = { current: '', new: '', confirm: '' }
    isUpdating.value = false
  }
  
  const toggle2FA = () => {
    twoFactorEnabled.value = !twoFactorEnabled.value
  }
  
  const setup2FA = () => {
    twoFactorEnabled.value = true
  }
  
  const revokeSession = (id) => {
    sessions.value = sessions.value.filter(s => s.id !== id)
  }
  
  const revokeAllSessions = () => {
    sessions.value = sessions.value.filter(s => s.current)
  }
  
  const confirmDelete = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Delete logic
    }
  }
  </script>