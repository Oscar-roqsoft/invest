<template>
    <div class="space-y-4 md:space-y-6">
      <!-- Personal Information Card -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        
        <div class="flex items-center gap-3 mb-6">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                      bg-gold-500/10 dark:bg-amber-500/[0.08]">
            <i class="bi bi-person-fill text-amber-500 text-lg"></i>
          </div>
          <div>
            <h2 class="font-bold text-lg text-gray-800 dark:text-white">Personal Information</h2>
            <p class="text-xs text-gray-400 dark:text-white/40">Update your personal details</p>
          </div>
        </div>
  
        <!-- Avatar Upload -->
        <div class="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-gray-100 dark:border-white/[0.06]">
          <div class="relative group">
            <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-gold-500/30 relative">
              <img :src="avatarPreview || '/profile.jpg'" alt="Profile" class="w-full h-full object-cover">
            </div>
            <label class="absolute inset-0 rounded-full flex items-center justify-center cursor-pointer bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <i class="bi bi-camera-fill text-white text-2xl"></i>
              <input type="file" accept="image/*" class="hidden" @change="handleAvatarChange">
            </label>
          </div>
          <div class="flex-1 text-center sm:text-left">
            <h3 class="font-bold text-gray-800 dark:text-white mb-1">Profile Photo</h3>
            <p class="text-sm text-gray-500 dark:text-white/40 mb-3">
              Upload a new photo or drag and drop. JPG or PNG, max 5MB.
            </p>
            <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
              <label class="px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200
                            bg-gray-100 text-gray-700 hover:bg-gray-200
                            dark:bg-white/[0.06] dark:text-white/80 dark:hover:bg-white/[0.1]">
                <i class="bi bi-upload mr-1"></i> Upload New
                <input type="file" accept="image/*" class="hidden" @change="handleAvatarChange">
              </label>
              <button 
                v-if="avatarPreview"
                @click="removeAvatar"
                class="px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200
                       bg-red-50 text-red-600 hover:bg-red-100
                       dark:bg-red-500/[0.08] dark:text-red-400 dark:hover:bg-red-500/[0.15]"
              >
                <i class="bi bi-trash mr-1"></i> Remove
              </button>
            </div>
          </div>
        </div>
  
        <!-- Form Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              First Name
            </label>
            <input 
              v-model="profile.firstName"
              type="text"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
          </div>
  
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Last Name
            </label>
            <input 
              v-model="profile.lastName"
              type="text"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
          </div>
  
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Email Address
            </label>
            <div class="relative">
              <input 
                v-model="profile.email"
                type="email"
                class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
                       bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                       dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
              >
              <span class="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-xs font-bold
                           bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/[0.15] dark:text-emerald-400">
                <i class="bi bi-check-circle-fill mr-1"></i>Verified
              </span>
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Phone Number
            </label>
            <div class="relative">
              <input 
                v-model="profile.phone"
                type="tel"
                class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
                       bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                       dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
              >
              <span class="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-xs font-bold
                           bg-amber-500/10 text-amber-500 dark:bg-amber-500/[0.15] dark:text-amber-400">
                <i class="bi bi-clock-fill mr-1"></i>Pending
              </span>
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Country
            </label>
            <select 
              v-model="profile.country"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 cursor-pointer
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
              <option value="US">🇺🇸 United States</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="UK">🇬🇧 United Kingdom</option>
              <option value="AU">🇦🇺 Australia</option>
              <option value="DE">🇩🇪 Germany</option>
              <option value="FR">🇫🇷 France</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Date of Birth
            </label>
            <input 
              v-model="profile.dob"
              type="date"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
          </div>
        </div>
  
        <!-- Bio -->
        <div class="mt-4 md:mt-5">
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
            Bio
          </label>
          <textarea 
            v-model="profile.bio"
            rows="4"
            placeholder="Tell us a bit about yourself..."
            class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-y
                   bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
          ></textarea>
          <p class="text-xs text-gray-400 dark:text-white/30 mt-1">
            {{ profile.bio.length }}/200 characters
          </p>
        </div>
  
        <!-- Save Button -->
        <div class="flex flex-wrap gap-3 justify-end mt-6 pt-6 border-t border-gray-100 dark:border-white/[0.06]">
          <button 
            @click="resetProfile"
            class="px-6 py-3 rounded-xl font-semibold text-sm text-gray-700 dark:text-white/70
                   bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]
                   transition-all duration-200"
          >
            Cancel
          </button>
          <button 
            @click="saveProfile"
            :disabled="isSaving"
            class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
          >
            <i v-if="isSaving" class="bi bi-arrow-clockwise animate-spin mr-1"></i>
            <i v-else class="bi bi-check-lg mr-1"></i>
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const avatarPreview = ref(null)
  const isSaving = ref(false)
  
  const profile = ref({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    country: 'US',
    dob: '1990-01-15',
    bio: 'Passionate investor with 5+ years of experience in cryptocurrency and traditional markets.'
  })
  
  const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        avatarPreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  
  const removeAvatar = () => {
    avatarPreview.value = null
  }
  
  const saveProfile = async () => {
    isSaving.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))
    isSaving.value = false
  }
  
  const resetProfile = () => {
    // Reset logic
  }
  </script>