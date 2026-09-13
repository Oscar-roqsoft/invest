<template>
  <div class="reset-password-page min-h-screen flex flex-col" style="background: #030f5c;">
    <!-- Navigation Bar -->
    <header class="page-header h-auto auth-header py-3 px-4" style="background: rgba(3, 15, 92, 0.95); backdrop-filter: blur(10px);">
      <nav class="navbar navbar-auth flex justify-end items-center container mx-auto">
        <NuxtLink to="/login" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 hover:text-gold-300 hover:bg-gold-500/20 transition-all duration-300 text-sm font-medium">
          <i class="bi bi-arrow-left"></i>
          Back to Login
        </NuxtLink>
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

            <!-- INVALID TOKEN STATE -->
            <Transition
              enter-active-class="transition-all duration-500"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
            >
              <div v-if="!resetToken" class="text-center">
                <div class="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
                  <i class="bi bi-shield-x text-red-400 text-4xl"></i>
                </div>
                <h3 class="text-white font-oswald font-bold text-2xl md:text-3xl uppercase mb-2">
                  INVALID LINK
                </h3>
                <div class="w-16 h-1 bg-gradient-to-r from-red-500 to-red-400 mx-auto mt-3 rounded-full"></div>
                <p class="text-white/60 text-sm mt-4 mb-6">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <NuxtLink 
                  to="/forgot-password"
                  class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300
                         hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
                  style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
                >
                  <i class="bi bi-arrow-clockwise"></i>
                  Request New Link
                </NuxtLink>
              </div>
            </Transition>

            <!-- SUCCESS STATE -->
            <Transition
              enter-active-class="transition-all duration-500"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
            >
              <div v-if="resetToken && isSuccess" class="text-center">
                <div class="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5 relative">
                  <div class="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
                  <i class="bi bi-check-circle-fill text-emerald-400 text-4xl relative"></i>
                </div>
                <h3 class="text-white font-oswald font-bold text-2xl md:text-3xl uppercase mb-2">
                  PASSWORD RESET!
                </h3>
                <div class="w-16 h-1 bg-gradient-to-r from-emerald-400 to-emerald-300 mx-auto mt-3 rounded-full"></div>
                <p class="text-white/70 text-sm mt-4 mb-2">
                  Your password has been successfully changed.
                </p>
                <p class="text-white/50 text-xs">
                  Redirecting you to login in <span class="text-gold-400 font-bold">{{ redirectCountdown }}</span>s...
                </p>

                <NuxtLink
                  to="/login"
                  class="mt-6 inline-flex items-center gap-1 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300
                         hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
                  style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
                >
                  <i class="bi bi-box-arrow-in-right"></i>
                  Go to Login Now
                </NuxtLink>
              </div>
            </Transition>

            <!-- FORM STATE -->
            <Transition
              enter-active-class="transition-all duration-500"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
            >
              <div v-if="resetToken && !isSuccess">
                <!-- Title -->
                <div class="text-center mb-6">
                  <div class="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                    <i class="bi bi-key-fill text-gold-400 text-3xl"></i>
                  </div>
                  <h3 class="text-white font-oswald font-bold text-2xl md:text-3xl uppercase">
                    RESET PASSWORD
                  </h3>
                  <div class="w-16 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-3 rounded-full"></div>
                  <p class="text-white/60 text-sm mt-3">
                    Enter your new password below
                  </p>
                </div>

                <!-- Form -->
                <form @submit.prevent="handleResetPassword" class="space-y-4">

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
                        autocomplete="new-password"
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

                  <!-- Confirm Password -->
                  <div class="form-group">
                    <label for="confirm_password" class="block text-white/80 text-sm font-medium mb-1.5">
                      Confirm Password <sup class="text-red-400">*</sup>
                    </label>
                    <div class="relative">
                      <input 
                        :type="showConfirmPassword ? 'text' : 'password'"
                        id="confirm_password"
                        v-model="form.confirmPassword"
                        class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300 pr-12"
                        placeholder="Retype your new password"
                        required
                        autocomplete="new-password"
                      />
                      <button 
                        type="button"
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-300"
                      >
                        <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                    <p v-if="form.confirmPassword && form.newPassword !== form.confirmPassword" class="text-xs text-red-400 mt-1">
                      <i class="bi bi-exclamation-circle mr-1"></i>Passwords do not match
                    </p>
                    <p v-else-if="form.confirmPassword && form.newPassword === form.confirmPassword" class="text-xs text-emerald-400 mt-1">
                      <i class="bi bi-check-circle mr-1"></i>Passwords match
                    </p>
                  </div>

                  <!-- Password Strength -->
                  <div v-if="form.newPassword">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          :class="passwordStrength.barColor"
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
                        class="flex items-center gap-1.5"
                        :class="req.met ? 'text-emerald-400' : 'text-white/30'"
                      >
                        <i :class="req.met ? 'bi bi-check-circle-fill' : 'bi bi-circle'" class="text-xs"></i>
                        {{ req.label }}
                      </li>
                    </ul>
                  </div>

                  <!-- Submit Button -->
                  <CandleButton
                    type="submit"
                    variant="gold"
                    size="md"
                    :loading="isSubmitting"
                    :disabled="!canSubmit"
                  >
                    <i class="bi bi-shield-check"></i>
                    Reset Password
                  </CandleButton>
                </form>

                <!-- Back to Login -->
                <p class="text-center text-white/60 text-sm mt-6">
                  <NuxtLink to="/login" class="text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300">
                    <i class="bi bi-box-arrow-in-right mr-1"></i>
                    Back to Login
                  </NuxtLink>
                </p>
              </div>
            </Transition>
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
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'custom',
  middleware: 'guest',
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// State
const resetToken = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const redirectCountdown = ref(5)
let redirectInterval = null

// Form
const form = ref({
  newPassword: '',
  confirmPassword: '',
})

// ─────────────────────────────────────────────────────────────
// PASSWORD REQUIREMENTS
// ─────────────────────────────────────────────────────────────
const passwordRequirements = computed(() => {
  const p = form.value.newPassword
  return [
    { label: 'At least 8 characters', met: p.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(p) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(p) },
    { label: 'Contains a number', met: /[0-9]/.test(p) },
    { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(p) },
  ]
})

const passwordStrength = computed(() => {
  const met = passwordRequirements.value.filter((r) => r.met).length
  if (met <= 1) return { label: 'Weak', width: '20%', barColor: 'bg-red-500', textColor: 'text-red-400' }
  if (met <= 2) return { label: 'Fair', width: '40%', barColor: 'bg-amber-500', textColor: 'text-amber-400' }
  if (met <= 3) return { label: 'Good', width: '60%', barColor: 'bg-blue-500', textColor: 'text-blue-400' }
  if (met <= 4) return { label: 'Strong', width: '80%', barColor: 'bg-emerald-500', textColor: 'text-emerald-400' }
  return { label: 'Very Strong', width: '100%', barColor: 'bg-emerald-500', textColor: 'text-emerald-400' }
})

const canSubmit = computed(() => {
  return (
    form.value.newPassword.length >= 8 &&
    passwordRequirements.value.every((r) => r.met) &&
    form.value.newPassword === form.value.confirmPassword
  )
})

// ─────────────────────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────────────────────
onMounted(() => {
  const token = (route.query.token || '').toString().trim()

  if (!token) {
    toast.error('Invalid reset link', {
      description: 'This link is missing or expired. Request a new one.',
    })
    return
  }

  resetToken.value = token
})

onUnmounted(() => {
  if (redirectInterval) clearInterval(redirectInterval)
})

// ─────────────────────────────────────────────────────────────
// START REDIRECT COUNTDOWN
// ─────────────────────────────────────────────────────────────
const startRedirectCountdown = () => {
  redirectCountdown.value = 5
  if (redirectInterval) clearInterval(redirectInterval)

  redirectInterval = setInterval(() => {
    redirectCountdown.value--
    if (redirectCountdown.value <= 0) {
      clearInterval(redirectInterval)
      router.push('/login')
    }
  }, 1000)
}

// ─────────────────────────────────────────────────────────────
// SUBMIT
// ─────────────────────────────────────────────────────────────
const handleResetPassword = async () => {
  // Validations with toasts
  if (!resetToken.value) {
    toast.error('Invalid reset token')
    return
  }

  if (form.value.newPassword.length < 8) {
    toast.error('Password must be at least 8 characters')
    return
  }

  if (!passwordRequirements.value.every((r) => r.met)) {
    toast.error('Password does not meet all requirements')
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    toast.error('Passwords do not match')
    return
  }

  isSubmitting.value = true

  const toastId = toast.loading('Resetting your password...', {
    description: 'Please wait a moment',
  })

  try {
    const res = await authStore.reset({
      token: resetToken.value,
      newPassword: form.value.newPassword,
    })

    if (!res.success) {
      toast.error('Reset failed', {
        id: toastId,
        description: res.message || 'This link may have expired. Please request a new one.',
      })
      return
    }

    // Success!
    toast.success('Password reset successfully! 🎉', {
      id: toastId,
      description: 'You can now log in with your new password.',
    })

    isSuccess.value = true
    startRedirectCountdown()
  } catch (err) {
    toast.error('Something went wrong', {
      id: toastId,
      description: err.message || 'Please try again.',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
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

/* Responsive */
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

/* Pulse animation */
@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.animate-ping {
  animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>