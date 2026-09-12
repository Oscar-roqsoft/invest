<template>
  <div class="reset-password-page min-h-screen flex flex-col" style="background: #030f5c;">
    <!-- Loader Overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-[1000] bg-primary-900/80 flex flex-col items-center justify-center">
      <div class="candles-loader-wrapper flex flex-col items-center">
        <div class="candles-loader flex gap-2">
          <div 
            v-for="i in 4" 
            :key="i"
            class="candles-loader-candle w-3.5 rounded-xl bg-gold-500"
            :style="{ 
              animationDelay: (i - 1) * 0.25 + 's',
              height: i % 2 === 0 ? '28px' : '28px',
              transform: i % 2 === 0 ? 'translateY(-8px)' : 'translateY(8px)'
            }"
          ></div>
        </div>
        <div class="text-white/70 text-sm font-roboto mt-4">Processing Your Request…</div>
      </div>
    </div>

    <!-- Navigation Bar -->
    <header class="page-header h-auto auth-header py-3 px-4" style="background: rgba(3, 15, 92, 0.95); backdrop-filter: blur(10px);">
      <nav class="navbar navbar-auth flex justify-end items-center container mx-auto">
        <a href="?a=login" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 hover:text-gold-300 hover:bg-gold-500/20 transition-all duration-300 text-sm font-medium">
          <i class="bi bi-arrow-left"></i>
          Back to Login
        </a>
      </nav>
    </header>

    <main class="flex-1 flex items-center justify-center py-8 md:py-12">
      <div class="container max-w-md mx-auto px-4 sm:px-0">
        <div class="w-full">
          <!-- Logo -->
          <div class="text-center auth-logo mb-6">
            <img 
              src="/logo1.png" 
              alt="CoinSquare Wealth" 
              class="company_logo h-12 md:h-16 mx-auto"
            />
          </div>

          <!-- Auth Container -->
          <div class="auth-container rounded-2xl p-6 md:p-8" 
               style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(187, 145, 74, 0.15); backdrop-filter: blur(10px);">
            
            <!-- Title -->
            <div class="text-center mb-6">
              <div class="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                <i class="bi bi-key text-gold-400 text-3xl"></i>
              </div>
              <h3 class="text-white font-oswald font-bold text-2xl md:text-3xl uppercase">
                RESET PASSWORD
              </h3>
              <div class="w-16 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-3 rounded-full"></div>
              <p class="text-white/60 text-sm mt-3">
                Enter your new password to reset your account
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="error-message rounded-lg px-4 py-3 mb-4 text-sm"
                 style="background: rgba(220, 53, 69, 0.12); border: 1px solid rgba(220, 53, 69, 0.35); color: #ff8a8a;">
              <i class="bi bi-exclamation-triangle-fill mr-2"></i>
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="success-message rounded-lg px-4 py-3 mb-4 text-sm"
                 style="background: rgba(88, 189, 125, 0.12); border: 1px solid rgba(88, 189, 125, 0.35); color: #7fd8a3;">
              <i class="bi bi-check-circle-fill mr-2"></i>
              {{ successMessage }}
            </div>

            <!-- Reset Password Form -->
            <form @submit.prevent="handleResetPassword" class="space-y-4">
              <input type="hidden" name="a" value="reset_password">
              <input type="hidden" name="action" value="reset_password">
              <input type="hidden" name="token" :value="resetToken">

              <!-- New Password -->
              <div class="form-group">
                <label for="new_password" class="block text-white/80 text-sm font-medium mb-1.5">
                  New Password <sup class="text-red-400">*</sup>
                </label>
                <div class="relative">
                  <input 
                    :type="showNewPassword ? 'text' : 'password'"
                    id="new_password"
                    v-model="form.newPassword"
                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300 pr-12"
                    placeholder="Enter your new password"
                    required
                    minlength="8"
                  />
                  <button 
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-300"
                  >
                    <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <!-- Confirm New Password -->
              <div class="form-group">
                <label for="confirm_password" class="block text-white/80 text-sm font-medium mb-1.5">
                  Confirm New Password <sup class="text-red-400">*</sup>
                </label>
                <div class="relative">
                  <input 
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirm_password"
                    v-model="form.confirmPassword"
                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300 pr-12"
                    placeholder="Retype your new password"
                    required
                  />
                  <button 
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-300"
                  >
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <!-- Password Strength Indicator -->
              <div v-if="form.newPassword" class="password-strength">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-white/50 text-xs">Password Strength</span>
                  <span class="text-xs font-medium" :class="passwordStrengthClass">{{ passwordStrengthLabel }}</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: passwordStrengthPercentage + '%' }"
                    :class="passwordStrengthBarClass"
                  ></div>
                </div>
                <ul class="text-white/40 text-xs mt-2 space-y-1">
                  <li class="flex items-center gap-2" :class="{ 'text-green-400': form.newPassword.length >= 8 }">
                    <i :class="form.newPassword.length >= 8 ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                    At least 8 characters
                  </li>
                  <li class="flex items-center gap-2" :class="{ 'text-green-400': /[a-z]/.test(form.newPassword) }">
                    <i :class="/[a-z]/.test(form.newPassword) ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                    Contains lowercase letter
                  </li>
                  <li class="flex items-center gap-2" :class="{ 'text-green-400': /[A-Z]/.test(form.newPassword) }">
                    <i :class="/[A-Z]/.test(form.newPassword) ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                    Contains uppercase letter
                  </li>
                  <li class="flex items-center gap-2" :class="{ 'text-green-400': /[0-9]/.test(form.newPassword) || /[^a-zA-Z0-9]/.test(form.newPassword) }">
                    <i :class="/[0-9]/.test(form.newPassword) || /[^a-zA-Z0-9]/.test(form.newPassword) ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                    Contains number or special character
                  </li>
                </ul>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit" 
                class="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-primary-900 font-oswald font-bold text-base uppercase shadow-lg shadow-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                :disabled="isSubmitting"
              >
                <span v-if="!isSubmitting">Reset Password</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-primary-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting...
                </span>
              </button>
            </form>

            <!-- Back to Login Link -->
            <p class="text-center text-white/60 text-sm mt-6">
              <a href="?a=login" class="text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300">
                <i class="bi bi-box-arrow-in-right mr-1"></i>
                Back to Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="public-footer flex flex-col items-center justify-end py-6">
      <p class="text-white/40 text-xs text-center max-w-md px-4">
        Copyright © 2014-2026 CoinSquare Wealth. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'


definePageMeta({
    layout:'custom'
  })

const route = useRoute()
const isLoading = ref(false)
const isSubmitting = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const resetToken = ref('')

const form = ref({
  newPassword: '',
  confirmPassword: ''
})

// Get token from URL
onMounted(() => {
  resetToken.value = route.query.token || ''
  if (!resetToken.value) {
    errorMessage.value = 'Invalid or missing reset token. Please request a new password reset link.'
  }
})

// Password Strength
const passwordStrengthPercentage = computed(() => {
  const password = form.value.newPassword
  if (!password) return 0
  
  let score = 0
  if (password.length >= 8) score += 25
  if (/[a-z]/.test(password)) score += 25
  if (/[A-Z]/.test(password)) score += 25
  if (/[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password)) score += 25
  
  return score
})

const passwordStrengthLabel = computed(() => {
  const score = passwordStrengthPercentage.value
  if (score === 0) return ''
  if (score <= 25) return 'Weak'
  if (score <= 50) return 'Fair'
  if (score <= 75) return 'Good'
  return 'Strong'
})

const passwordStrengthClass = computed(() => {
  const score = passwordStrengthPercentage.value
  if (score === 0) return ''
  if (score <= 25) return 'text-red-400'
  if (score <= 50) return 'text-yellow-400'
  if (score <= 75) return 'text-blue-400'
  return 'text-green-400'
})

const passwordStrengthBarClass = computed(() => {
  const score = passwordStrengthPercentage.value
  if (score === 0) return ''
  if (score <= 25) return 'bg-red-400'
  if (score <= 50) return 'bg-yellow-400'
  if (score <= 75) return 'bg-blue-400'
  return 'bg-green-400'
})

const handleResetPassword = async () => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''

  // Validate token
  if (!resetToken.value) {
    errorMessage.value = 'Invalid reset token. Please request a new password reset link.'
    return
  }

  // Validate new password
  if (!form.value.newPassword.trim()) {
    errorMessage.value = 'Please enter a new password.'
    return
  }

  // Validate password length
  if (form.value.newPassword.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long.'
    return
  }

  // Validate confirm password
  if (form.value.newPassword !== form.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match. Please try again.'
    return
  }

  isSubmitting.value = true
  isLoading.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Simulate success
  successMessage.value = 'Your password has been reset successfully! You can now log in with your new password.'
  
  // Reset form
  form.value = {
    newPassword: '',
    confirmPassword: ''
  }

  isSubmitting.value = false
  isLoading.value = false

  // Redirect to login after 3 seconds
  setTimeout(() => {
    window.location.href = '?a=login'
  }, 3000)
}
</script>

<style scoped>
/* Candles Loader Animation */
.candles-loader-candle {
  animation: candlesLoader 1s ease-in-out infinite;
}

.candles-loader-candle:nth-child(2) {
  animation-delay: -0.75s;
}

.candles-loader-candle:nth-child(3) {
  animation-delay: -0.5s;
}

.candles-loader-candle:nth-child(4) {
  animation-delay: -0.25s;
}

@keyframes candlesLoader {
  0%, 100% {
    box-shadow: 0 0 0 #bb914a, 0 0 0 #bb914a;
  }
  50% {
    box-shadow: 0 -12px 0 #bb914a, 0 12px 0 #bb914a;
  }
}

/* Form input autofill styles */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.05) inset !important;
  -webkit-text-fill-color: white !important;
  border-color: rgba(187, 145, 74, 0.3) !important;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: "Oswald", sans-serif;
}

p, span, input, button, label {
  font-family: "Roboto Condensed", sans-serif;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .auth-container {
    padding: 1.5rem;
  }
}

/* Smooth transitions */
.auth-container {
  transition: all 0.3s ease;
}

.auth-container:hover {
  border-color: rgba(187, 145, 74, 0.3);
}

/* Loading overlay */
.overlay {
  background-color: rgba(1, 9, 50, 0.8);
  backdrop-filter: blur(5px);
}

/* Success/Error messages */
.success-message,
.error-message {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Password strength bar transition */
.password-strength .h-full {
  transition: width 0.5s ease, background-color 0.5s ease;
}

/* Password requirements list */
.password-strength ul li {
  transition: color 0.3s ease;
}

.password-strength ul li i {
  transition: color 0.3s ease;
}
</style>