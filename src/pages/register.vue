<template>
  <div class="register-page min-h-screen flex flex-col" style="background: #030f5c;">
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
              <span class="text-green-400">https://</span>coinsquarewealth.org/?a=register
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
                ENROLL FOR AN ACCOUNT
              </h3>
              <div class="w-16 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-3 rounded-full"></div>
            </div>

            <!-- Login Link -->
            <p class="text-center text-white/60 text-sm mb-4">
              Already registered? 
              <NuxtLink to="/login" class="text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300">
                Login
              </NuxtLink>
            </p>

            <!-- Referral Banner -->
            <div v-if="referralCode" 
                 class="rounded-lg px-4 py-2 mb-4 text-xs flex items-center gap-2"
                 style="background: rgba(187, 145, 74, 0.1); border: 1px solid rgba(187, 145, 74, 0.2); color: #F5D77F;">
              <i class="bi bi-gift-fill"></i>
              <span>Signing up with referral code: <b>{{ referralCode }}</b></span>
            </div>

            <!-- Registration Form -->
            <form @submit.prevent="handleRegister" class="space-y-4">
              
              <!-- Full Name -->
              <div class="form-group">
                <label for="fullname" class="block text-white/80 text-sm font-medium mb-1.5">
                  Full Name <sup class="text-red-400">*</sup>
                </label>
                <input 
                  type="text" 
                  id="fullname"
                  v-model="form.fullname"
                  class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40
                   focus:border-gold-500/50 focus:outline-none transition-all duration-300
                  autofill:
                  "
                  placeholder="Full Name"
                  required
                  autocomplete="name"
                />
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="email" class="block text-white/80 text-sm font-medium mb-1.5">
                  E-mail Address <sup class="text-red-400">*</sup>
                </label>
                <input 
                  type="email" 
                  id="email"
                  v-model="form.email"
                  class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300"
                  placeholder="E-mail Address"
                  required
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
                    placeholder="Define Password"
                    required
                    minlength="8"
                    autocomplete="new-password"
                  />
                  <button 
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-300"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>

                <!-- Password Strength -->
                <div v-if="form.password" class="mt-2">
                  <div class="flex items-center gap-2 mb-1.5">
                    <div class="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-300"
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
                      class="flex items-center gap-1.5"
                      :class="req.met ? 'text-emerald-400' : 'text-white/30'"
                    >
                      <i :class="req.met ? 'bi bi-check-circle-fill' : 'bi bi-circle'" class="text-xs"></i>
                      {{ req.label }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="form-group">
                <label for="password2" class="block text-white/80 text-sm font-medium mb-1.5">
                  Confirm Password <sup class="text-red-400">*</sup>
                </label>
                <div class="relative">
                  <input 
                    :type="showPassword2 ? 'text' : 'password'"
                    id="password2"
                    v-model="form.password2"
                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300 pr-12"
                    placeholder="Retype Password"
                    required
                    autocomplete="new-password"
                  />
                  <button 
                    type="button"
                    @click="showPassword2 = !showPassword2"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-300"
                  >
                    <i :class="showPassword2 ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <p v-if="form.password2 && form.password !== form.password2" class="text-xs text-red-400 mt-1">
                  <i class="bi bi-exclamation-circle mr-1"></i>Passwords do not match
                </p>
                <p v-else-if="form.password2 && form.password === form.password2" class="text-xs text-emerald-400 mt-1">
                  <i class="bi bi-check-circle mr-1"></i>Passwords match
                </p>
              </div>

              <!-- Terms & Conditions -->
              <div class="form-bottom pt-2">
                <label class="flex items-start gap-2 text-white/60 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="form.agree"
                    class="w-4 h-4 rounded border-white/20 bg-white/10 text-gold-500 focus:ring-gold-500/50 focus:ring-offset-0 mt-0.5"
                    required
                  />
                  <span>
                    I agree with the 
                    <NuxtLink to="/terms" target="_blank" class="text-gold-400 hover:text-gold-300 transition-colors duration-300">
                      Terms and Conditions
                    </NuxtLink>
                  </span>
                </label>
              </div>

              <!-- Submit Button (with candle loader) -->
              <CandleButton
                type="submit"
                variant="gold"
                size="md"
                :loading="isSubmitting"
                :disabled="!canSubmit"
              >
                Sign Up
              </CandleButton>
            </form>
          </div>
        </div>
      </div>
    </main>

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
const showPassword2 = ref(false)

// Referral code from URL
const referralCode = ref((route.query.ref || '').toString().toUpperCase().trim())

// Form
const form = ref({
  fullname: '',
  email: '',
  password: '',
  password2: '',
  agree: false,
})

// Password strength
const passwordRequirements = computed(() => {
  const p = form.value.password
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
  if (met <= 1) return { label: 'Weak', width: '20%', color: 'bg-red-500', textColor: 'text-red-400' }
  if (met <= 2) return { label: 'Fair', width: '40%', color: 'bg-amber-500', textColor: 'text-amber-400' }
  if (met <= 3) return { label: 'Good', width: '60%', color: 'bg-blue-500', textColor: 'text-blue-400' }
  if (met <= 4) return { label: 'Strong', width: '80%', color: 'bg-emerald-500', textColor: 'text-emerald-400' }
  return { label: 'Very Strong', width: '100%', color: 'bg-emerald-500', textColor: 'text-emerald-400' }
})

const canSubmit = computed(() => {
  const f = form.value
  return (
    f.fullname.trim().length >= 2 &&
    f.email.trim().length > 0 &&
    f.password.length >= 8 &&
    f.password === f.password2 &&
    f.agree === true
  )
})

// ─────────────────────────────────────────────────────────────
// REGISTER HANDLER
// ─────────────────────────────────────────────────────────────
const handleRegister = async () => {
  // Client-side validation with toasts
  if (form.value.fullname.trim().length < 2) {
    toast.error('Please enter your full name')
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    toast.error('Please enter a valid email address')
    return
  }

  if (form.value.password.length < 8) {
    toast.error('Password must be at least 8 characters')
    return
  }

  if (!passwordRequirements.value.every((r) => r.met)) {
    toast.error('Password does not meet all requirements')
    return
  }

  if (form.value.password !== form.value.password2) {
    toast.error('Passwords do not match')
    return
  }

  if (!form.value.agree) {
    toast.error('You must agree to the Terms and Conditions')
    return
  }

  isSubmitting.value = true

  // Toast loading
  // const toastId = toast.loading('Creating your account...', {
  //   description: 'Please wait a moment',
  // })

  try {
    const res = await authStore.register({
      name: form.value.fullname.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
      referralCode: referralCode.value || undefined,
    })

    if (!res.success) {
      toast.error('Registration failed')
      return
    }

    toast.success('Account created! 🎉')

    // Redirect to OTP verification
    setTimeout(() => {
      router.push(`/verify-otp?email=${encodeURIComponent(form.value.email)}`)
    }, 800)
  } catch (err) {
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

h1, h2, h3, h4, h5, h6 {
  font-family: "Oswald", sans-serif;
}

p, span, input, button, label {
  font-family: "Roboto Condensed", sans-serif;
}

input[type="checkbox"] {
  accent-color: #bb914a;
  cursor: pointer;
}

.lock .icon {
  transition: transform 0.3s ease;
}

.lock:hover .icon {
  transform: scale(1.05);
}

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

.auth-container {
  transition: all 0.3s ease;
}

.auth-container:hover {
  border-color: rgba(187, 145, 74, 0.3);
}
</style>