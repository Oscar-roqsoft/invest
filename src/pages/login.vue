<template>
  <div class="login-page min-h-screen flex flex-col" style="background: #030f5c;">
    <!-- Navigation Bar -->
    <header class="page-header h-auto auth-header py-3 px-4" style="background: rgba(3, 15, 92, 0.95); backdrop-filter: blur(10px);">
      <nav class="navbar navbar-auth flex justify-end items-center container mx-auto">
        <NuxtLink to="/" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 hover:text-gold-300 hover:bg-gold-500/20 transition-all duration-300 text-sm font-medium">
          <i class="bi bi-arrow-left"></i>
          Go Back
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

          <!-- Security Lock -->
          <div class="lock flex items-center gap-3 mx-auto mb-3 px-4 py-2 rounded-full" 
               style="background: rgba(88, 189, 125, 0.1); max-width: 368px;">
            <div class="icon w-9 h-9 min-w-[36px] rounded-full bg-green-500 flex items-center justify-center">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.00004 11.7578C7.67672 11.7578 7.41406 12.0205 7.41406 12.3438C7.41406 12.6671 7.67672 12.9298 8.00004 12.9298C8.32336 12.9298 8.58602 12.6671 8.58602 12.3438C8.58602 12.0205 8.32336 11.7578 8.00004 11.7578Z" fill="white"/>
                <path d="M11.5162 8.24219H4.2187C2.10011 8.24219 0.382568 9.95965 0.382568 12.0783C0.382568 15.6973 2.78413 19.0605 6.32241 19.8205C11.2508 20.8791 15.618 17.0922 15.618 12.344C15.618 10.0787 13.7816 8.24219 11.5162 8.24219ZM8.58628 13.9941V17.071C8.58628 17.3949 8.32417 17.657 8.0003 17.657C7.6764 17.657 7.41433 17.3949 7.41433 17.071V13.9941C6.73374 13.7514 6.24237 13.107 6.24237 12.3441C6.24237 11.3747 7.03093 10.5861 8.0003 10.5861C8.96968 10.5861 9.75823 11.3747 9.75823 12.3441C9.75823 13.107 9.26686 13.7513 8.58628 13.9941Z" fill="white"/>
                <path d="M8.00039 0C5.08223 0 2.72656 2.35562 2.72656 5.27383V7.3234C3.20102 7.17391 3.69582 7.07086 4.21898 7.07086H5.07051V5.27383C5.07051 3.65652 6.38309 2.34395 8.00039 2.34395C9.6177 2.34395 10.9303 3.65652 10.9303 5.27383V7.07082H11.5163C12.1356 7.07082 12.7216 7.19777 13.2742 7.3948V5.27383C13.2742 2.35844 10.9128 0 8.00039 0Z" fill="white"/>
              </svg>
            </div>
            <p class="text-white/70 text-xs font-bold mb-0">
              <span class="text-green-400">https://</span>coinsquarewealth.org/?a=login
            </p>
          </div>
          
          <p class="text-center text-white/50 text-xs mb-4">
            Kindly make sure you are on the same url above.
          </p>

          <!-- Auth Container -->
          <div class="auth-container rounded-2xl p-6 md:p-8" 
               style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(187, 145, 74, 0.15); backdrop-filter: blur(10px);">
            
            <!-- Title -->
            <div class="text-center mb-6">
              <h3 class="text-white font-oswald font-bold text-2xl md:text-3xl uppercase">
                LOGIN TO YOUR ACCOUNT
              </h3>
              <div class="w-16 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-3 rounded-full"></div>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="space-y-4">
              
              <!-- Email -->
              <div class="form-group">
                <label for="email" class="block text-white/80 text-sm font-medium mb-1.5">
                  Email <sup class="text-red-400">*</sup>
                </label>
                <input 
                  type="email" 
                  id="email"
                  v-model="form.email"
                  class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300"
                  placeholder="you@example.com"
                  required
                  autofocus
                  autocomplete="email"
                />
              </div>

              <!-- Password -->
              <div class="form-group">
                <label for="password" class="block text-white/80 text-sm font-medium mb-1.5">
                  Password <sup class="text-red-400">*</sup>
                </label>
                <div class="relative">
                  <input 
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="form.password"
                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300 pr-12"
                    placeholder="Enter your password"
                    required
                    autocomplete="current-password"
                  />
                  <button 
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-300"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="form.remember"
                    class="w-4 h-4 rounded border-white/20 bg-white/10 text-gold-500 focus:ring-gold-500/50 focus:ring-offset-0"
                  />
                  <span>Remember me</span>
                </label>
                <NuxtLink 
                  to="/forgot-password" 
                  class="text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors duration-300"
                >
                  Forgot password?
                </NuxtLink>
              </div>

              <!-- Submit Button -->
              <CandleButton
                type="submit"
                variant="gold"
                size="md"
                :loading="isSubmitting"
                :disabled="!canSubmit"
              >
                <i class="bi bi-box-arrow-in-right"></i>
                Login
              </CandleButton>
            </form>

            <!-- Register Link -->
            <p class="text-center text-white/60 text-sm mt-6">
              Don't have an account?
              <NuxtLink to="/register" class="text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300">
                Register Now
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
const isSubmitting = ref(false)
const showPassword = ref(false)

// Form
const form = ref({
  email: '',
  password: '',
  remember: false,
})

// Computed
const canSubmit = computed(() => {
  return form.value.email.trim().length > 0 && form.value.password.length > 0
})

// ─────────────────────────────────────────────────────────────
// HANDLE LOGIN
// ─────────────────────────────────────────────────────────────
const handleLogin = async () => {
  // Basic client validation
  if (!form.value.email.trim()) {
    toast.error('Please enter your email')
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    toast.error('Please enter a valid email address')
    return
  }

  if (!form.value.password) {
    toast.error('Please enter your password')
    return
  }

  isSubmitting.value = true

  const toastId = toast.loading('Signing you in...', {
    description: 'Verifying your credentials',
  })

  try {
    const res = await authStore.login({
      email: form.value.email.trim(),
      password: form.value.password,
    })

    if (!res.success) {
      toast.error('Login failed', {
        id: toastId,
        description: res.message || 'Invalid email or password.',
      })
      return
    }

    // Handle unverified account
    if (res.requiresVerification) {
      toast.warning('Email not verified', {
        id: toastId,
        description: 'Check your inbox for the verification code.',
      })

      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(form.value.email)}`)
      }, 800)
      return
    }

    // Success
    toast.success('Welcome back! 🎉', {
      id: toastId,
      description: 'Redirecting to your dashboard...',
    })

    // Redirect to intended page or dashboard
    const redirect = route.query.redirect || '/dashboard'
    setTimeout(() => {
      router.push(redirect.toString())
    }, 700)
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

/* Custom checkbox styling */
input[type="checkbox"] {
  accent-color: #bb914a;
  cursor: pointer;
}

/* Lock icon animation */
.lock .icon {
  transition: transform 0.3s ease;
}

.lock:hover .icon {
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .auth-container {
    padding: 1.5rem;
  }
  
  .lock {
    max-width: 100%;
    padding: 0.5rem 1rem;
  }
  
  .lock p {
    font-size: 10px;
    padding-left: 0.5rem;
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