<template>
  <div class="forgot-password-page min-h-screen flex flex-col" style="background: #030f5c;">
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

            <!-- SUCCESS STATE -->
            <Transition
              enter-active-class="transition-all duration-500"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
            >
              <div v-if="isSuccess" class="text-center">
                <!-- Success Icon -->
                <div class="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5 relative">
                  <div class="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
                  <i class="bi bi-envelope-check-fill text-emerald-400 text-4xl relative"></i>
                </div>

                <h3 class="text-white font-oswald font-bold text-2xl md:text-3xl uppercase mb-2">
                  CHECK YOUR EMAIL
                </h3>
                <div class="w-16 h-1 bg-gradient-to-r from-emerald-400 to-emerald-300 mx-auto mt-3 rounded-full"></div>

                <p class="text-white/70 text-sm mt-4">
                  We've sent password reset instructions to:
                </p>
                <p class="text-gold-400 text-sm font-bold mt-1 break-all">
                  {{ submittedEmail }}
                </p>

                <div class="mt-6 p-4 rounded-xl text-left"
                     style="background: rgba(88, 189, 125, 0.08); border: 1px solid rgba(88, 189, 125, 0.2);">
                  <p class="text-white/60 text-xs mb-2">
                    <i class="bi bi-info-circle mr-1 text-emerald-400"></i>
                    <b class="text-white/80">Didn't receive it?</b>
                  </p>
                  <ul class="text-white/50 text-xs space-y-1.5 ml-5">
                    <li>• Check your spam or junk folder</li>
                    <li>• Make sure you entered the correct email</li>
                    <li>• The link expires in 1 hour</li>
                  </ul>
                </div>

                <!-- Resend Button -->
                <div class="mt-6 space-y-3">
                  <p v-if="timer > 0" class="text-white/40 text-xs">
                    Resend in <span class="text-gold-400 font-medium tabular-nums">{{ formattedTimer }}</span>
                  </p>
                  <CandleButton
                    v-else
                    type="button"
                    variant="outline"
                    size="sm"
                    :loading="isResending"
                    @click="handleResend"
                  >
                    <i class="bi bi-arrow-clockwise"></i>
                    Resend Email
                  </CandleButton>
                </div>

                <NuxtLink
                  to="/login"
                  class="mt-6 inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors duration-300"
                >
                  <i class="bi bi-arrow-left"></i>
                  Back to Login
                </NuxtLink>
              </div>
            </Transition>

            <!-- FORM STATE -->
            <Transition
              enter-active-class="transition-all duration-500"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
            >
              <div v-if="!isSuccess">
                <!-- Title -->
                <div class="text-center mb-6">
                  <div class="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                    <i class="bi bi-key-fill text-gold-400 text-3xl"></i>
                  </div>
                  <h3 class="text-white font-oswald font-bold text-2xl md:text-3xl uppercase">
                    FORGOT YOUR PASSWORD
                  </h3>
                  <div class="w-16 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-3 rounded-full"></div>
                  <p class="text-white/60 text-sm mt-3">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <!-- Form -->
                <form @submit.prevent="handleSubmit" class="space-y-4">

                  <!-- Email -->
                  <div class="form-group">
                    <label for="email" class="block text-white/80 text-sm font-medium mb-1.5">
                      Email Address <sup class="text-red-400">*</sup>
                    </label>
                    <div class="relative">
                      <i class="bi bi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-white/40"></i>
                      <input 
                        type="email" 
                        id="email"
                        v-model="form.email"
                        class="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300"
                        placeholder="you@example.com"
                        required
                        autofocus
                        autocomplete="email"
                      />
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <CandleButton
                    type="submit"
                    variant="gold"
                    size="md"
                    :loading="isSubmitting"
                    :disabled="!canSubmit"
                  >
                    <i class="bi bi-send-fill"></i>
                    Send Reset Link
                  </CandleButton>
                </form>

                <!-- Back to Login -->
                <p class="text-center text-white/60 text-sm mt-6">
                  Remembered your password?
                  <NuxtLink to="/login" class="text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300">
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

// State
const isSubmitting = ref(false)
const isResending = ref(false)
const isSuccess = ref(false)
const submittedEmail = ref('')

// Form
const form = ref({
  email: '',
})

// Resend timer
const timer = ref(60)
let timerInterval = null

// Computed
const canSubmit = computed(() => form.value.email.trim().length > 0)

const formattedTimer = computed(() => {
  const m = Math.floor(timer.value / 60)
  const s = timer.value % 60
  return `${m}:${String(s).padStart(2, '0')}`
})

// ─────────────────────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────────────────────
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
// SUBMIT
// ─────────────────────────────────────────────────────────────
const handleSubmit = async () => {
  // Validate
  if (!form.value.email.trim()) {
    toast.error('Please enter your email')
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    toast.error('Please enter a valid email address')
    return
  }

  isSubmitting.value = true

  const toastId = toast.loading('Sending reset link...', {
    description: 'This will only take a moment',
  })

  try {
    const res = await authStore.forgot({
      email: form.value.email.trim(),
    })

    if (!res.success) {
      toast.error('Request failed', {
        id: toastId,
        description: res.message || 'Something went wrong. Please try again.',
      })
      return
    }

    // Success!
    submittedEmail.value = form.value.email.trim()
    isSuccess.value = true
    startTimer()

    toast.success('Reset link sent! 📧', {
      id: toastId,
      description: 'Check your email inbox for instructions.',
    })
  } catch (err) {
    toast.error('Something went wrong', {
      id: toastId,
      description: err.message || 'Please try again.',
    })
  } finally {
    isSubmitting.value = false
  }
}

// ─────────────────────────────────────────────────────────────
// RESEND
// ─────────────────────────────────────────────────────────────
const handleResend = async () => {
  if (timer.value > 0) return

  isResending.value = true

  const toastId = toast.loading('Resending reset link...', {
    description: `Sending to ${submittedEmail.value}`,
  })

  try {
    const res = await authStore.forgot({
      email: submittedEmail.value,
    })

    if (!res.success) {
      toast.error('Could not resend', {
        id: toastId,
        description: res.message || 'Please try again.',
      })
      return
    }

    toast.success('Reset link resent!', {
      id: toastId,
      description: 'Check your email again.',
    })

    startTimer()
  } catch (err) {
    toast.error('Something went wrong', {
      id: toastId,
      description: err.message || 'Please try again.',
    })
  } finally {
    isResending.value = false
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

/* Pulse animation for success icon */
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