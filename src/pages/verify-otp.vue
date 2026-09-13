<template>
  <div class="verify-otp-page min-h-screen flex flex-col" style="background: #030f5c;">
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
            
            <!-- Title -->
            <div class="text-center mb-6">
              <div class="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                <i class="bi bi-shield-shaded text-gold-400 text-3xl"></i>
              </div>
              <h3 class="text-white font-oswald font-bold text-2xl md:text-3xl uppercase">
                VERIFY YOUR IDENTITY
              </h3>
              <div class="w-16 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-3 rounded-full"></div>
              <p class="text-white/60 text-sm mt-3">
                Enter the 6-digit code sent to
              </p>
              <p v-if="email" class="text-gold-400 text-sm font-semibold mt-1">
                {{ email }}
              </p>
            </div>

            <!-- OTP Form -->
            <form @submit.prevent="handleVerify" class="space-y-6">
              
              <!-- OTP Input -->
              <div class="form-group">
                <label class="block text-white/80 text-sm font-medium mb-3 text-center">
                  Enter 6-digit verification code
                </label>
                
                <!-- OTP Input Fields -->
                <div class="flex gap-2 md:gap-3 justify-center">
                  <input 
                    v-for="i in 6" 
                    :key="i"
                    ref="otpInputs"
                    type="text"
                    inputmode="numeric"
                    maxlength="1"
                    v-model="otp[i-1]"
                    @input="handleOtpInput(i-1, $event)"
                    @keydown="handleOtpKeydown(i-1, $event)"
                    @paste="handleOtpPaste"
                    @focus="(e) => e.target.select()"
                    class="otp-input w-10 h-12 md:w-12 md:h-14 text-center text-white text-xl font-bold rounded-xl bg-white/10 border border-white/10 focus:border-gold-500/50 focus:outline-none transition-all duration-300"
                    :class="{ 
                      'border-gold-500/50 bg-gold-500/10': otp[i-1],
                      'animate-pulse': isVerifying
                    }"
                    :disabled="isVerifying"
                  />
                </div>
              </div>

              <!-- Timer / Resend -->
              <div class="text-center">
                <p v-if="timer > 0" class="text-white/50 text-sm">
                  Resend code in 
                  <span class="text-gold-400 font-medium tabular-nums">{{ formattedTimer }}</span>
                </p>
                <CandleButton
                  v-else
                  type="button"
                  variant="outline"
                  size="sm"
                  :loading="isResending"
                  @click="resendCode"
                  class="!w-auto !px-6"
                >
                  <i class="bi bi-arrow-clockwise"></i>
                  Resend Code
                </CandleButton>
              </div>

              <!-- Submit Button -->
              <CandleButton
                type="submit"
                variant="gold"
                size="md"
                :loading="isVerifying"
                :disabled="!isOtpComplete"
              >
                <i class="bi bi-shield-check"></i>
                Verify &amp; Login
              </CandleButton>
            </form>

            <!-- Alternative Methods -->
            <div class="mt-6 pt-6 border-t border-white/10">
              <p class="text-center text-white/40 text-xs mb-3">Didn't receive the code?</p>
              <div class="flex justify-center gap-4">
                <button 
                  type="button"
                  @click="useEmailMethod"
                  :disabled="isResending"
                  class="text-white/50 hover:text-gold-400 text-xs transition-colors duration-300 disabled:opacity-50"
                >
                  <i class="bi bi-envelope mr-1"></i>
                  Resend to Email
                </button>
              </div>
            </div>

            <!-- Back to Login Link -->
            <p class="text-center text-white/60 text-sm mt-6">
              <NuxtLink to="/login" class="text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300">
                <i class="bi bi-box-arrow-in-right mr-1"></i>
                Back to Login
              </NuxtLink>
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
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'custom',
  middleware: 'guest',
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// State
const email = ref((route.query.email || '').toString().trim())
const otp = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const isVerifying = ref(false)
const isResending = ref(false)

// Timer
const timer = ref(60)
let timerInterval = null

// Computed
const isOtpComplete = computed(() => otp.value.every((d) => d !== ''))
const otpCode = computed(() => otp.value.join(''))
const formattedTimer = computed(() => {
  const m = Math.floor(timer.value / 60)
  const s = timer.value % 60
  return `${m}:${String(s).padStart(2, '0')}`
})

// ─────────────────────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────────────────────
onMounted(() => {
  if (!email.value) {
    toast.error('No email provided', {
      description: 'Redirecting to register...',
    })
    return router.push('/register')
  }

  // Make sure the store knows which email we're verifying
  authStore.setPendingEmail(email.value)

  startTimer()

  // Focus first input
  setTimeout(() => {
    if (otpInputs.value?.[0]) {
      otpInputs.value[0].focus()
    }
  }, 400)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

// ─────────────────────────────────────────────────────────────
// TIMER
// ─────────────────────────────────────────────────────────────
const startTimer = () => {
  timer.value = 60
  if (timerInterval) clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }, 1000)
}

// ─────────────────────────────────────────────────────────────
// OTP INPUT HANDLERS
// ─────────────────────────────────────────────────────────────
const handleOtpInput = (index, event) => {
  const value = event.target.value

  // Only allow digits
  if (value && !/^\d$/.test(value)) {
    otp.value[index] = ''
    event.target.value = ''
    return
  }

  otp.value[index] = value

  // Auto-advance
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const handleOtpKeydown = (index, event) => {
  // Backspace on empty → go back
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
  // Arrow navigation
  if (event.key === 'ArrowLeft' && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const handleOtpPaste = (event) => {
  event.preventDefault()
  const pastedData = (event.clipboardData || window.clipboardData).getData('text')
  const digits = pastedData.replace(/\D/g, '').slice(0, 6)

  if (digits) {
    digits.split('').forEach((digit, i) => {
      otp.value[i] = digit
    })

    // Focus next empty input
    const nextIndex = Math.min(digits.length, 5)
    otpInputs.value[nextIndex]?.focus()
  }
}

// ─────────────────────────────────────────────────────────────
// VERIFY
// ─────────────────────────────────────────────────────────────
const handleVerify = async () => {
  if (!isOtpComplete.value) {
    toast.error('Please enter all 6 digits')
    return
  }

  isVerifying.value = true

  // const toastId = toast.loading('Verifying your code...', {
  //   description: 'Please wait',
  // })

  try {
    const res = await authStore.verifyOTP(otpCode.value)

    if (!res.success) {
      toast.error('Verification failed')

      // Clear OTP & refocus
      otp.value = ['', '', '', '', '', '']
      otpInputs.value?.[0]?.focus()

      return
    }

    toast.success('Email verified! 🎉')

    // Redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 700)
  } catch (err) {
   
  } finally {
    isVerifying.value = false
  }
}

// ─────────────────────────────────────────────────────────────
// RESEND
// ─────────────────────────────────────────────────────────────
const resendCode = async () => {
  if (timer.value > 0) return

  isResending.value = true

  // const toastId = toast.loading('Resending verification code...', {
  //   description: `Sending to ${email.value}`,
  // })

  try {
    const res = await authStore.resendOTP(email.value)

    if (!res.success) {
      toast.error('Could not resend')
      return
    }

    toast.success('Code resent!')

    startTimer()

    // Clear OTP and refocus
    otp.value = ['', '', '', '', '', '']
    otpInputs.value?.[0]?.focus()
  } catch (err) {
   
  } finally {
    isResending.value = false
  }
}

const useEmailMethod = () => {
  if (timer.value > 0) {
    toast.info('Please wait', {
      description: `You can resend in ${formattedTimer.value}`,
    })
    return
  }
  resendCode()
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

/* OTP inputs */
.otp-input {
  caret-color: #bb914a;
}

.otp-input:focus {
  box-shadow: 0 0 0 3px rgba(187, 145, 74, 0.15);
}

.otp-input:hover:not(:disabled) {
  border-color: rgba(187, 145, 74, 0.3);
}

/* Responsive */
@media (max-width: 576px) {
  .auth-container {
    padding: 1.5rem;
  }

  .otp-input {
    width: 2.5rem;
    height: 3rem;
    font-size: 1.125rem;
  }
}

/* Smooth transitions */
.auth-container {
  transition: all 0.3s ease;
}

.auth-container:hover {
  border-color: rgba(187, 145, 74, 0.3);
}
</style>