<template>
    <div class="register-page min-h-screen flex flex-col" style="background: #030f5c;">
      <!-- Loader Overlay -->
      <div v-if="isLoading" class="fixed inset-0 z-[1000] bg-primary-900/70 flex flex-col items-center justify-center">
        <div class="candles-loader flex gap-2">
          <div 
            v-for="i in 4" 
            :key="i"
            class="candles-loader-candle w-3.5 rounded-xl bg-gold-500"
            :style="{ 
              animationDelay: (i - 1) * 0.25 + 's',
              height: i === 1 ? '28px' : i === 2 ? '28px' : i === 3 ? '28px' : '28px',
              transform: i % 2 === 0 ? 'translateY(-8px)' : 'translateY(8px)'
            }"
          ></div>
        </div>
        <div class="text-white text-sm font-roboto mt-4">Verifying Your Email Address…</div>
      </div>
  
      <!-- Navigation Bar -->
      <header class="page-header h-auto auth-header py-3 px-4" style="background: rgba(3, 15, 92, 0.95); backdrop-filter: blur(10px);">
        <nav class="navbar navbar-auth flex justify-end items-center container mx-auto">
          <a href="/" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 hover:text-gold-300 hover:bg-gold-500/20 transition-all duration-300 text-sm font-medium">
            <i class="bi bi-arrow-left"></i>
            Go Back
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
                <span class="text-green-400">https://</span>coinsquarewealth.org/?a=signup
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
                <a href="login" class="text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300">
                  Login
                </a>
              </p>
  
              <!-- Error Message -->
              <div v-if="errorMessage" class="error-message rounded-lg px-4 py-3 mb-4 text-sm"
                   style="background: rgba(220, 53, 69, 0.12); border: 1px solid rgba(220, 53, 69, 0.35); color: #ff8a8a;">
                <i class="bi bi-exclamation-triangle-fill mr-2"></i>
                {{ errorMessage }}
              </div>
  
              <!-- Success Message -->
              <div v-if="successMessage" class="success-message rounded-lg px-4 py-3 mb-4 text-sm"
                   style="background: rgba(40, 167, 69, 0.12); border: 1px solid rgba(40, 167, 69, 0.35); color: #58bd7d;">
                <i class="bi bi-check-circle-fill mr-2"></i>
                {{ successMessage }}
              </div>
  
              <!-- Registration Form -->
              <form @submit.prevent="handleRegister" class="space-y-4">
                <input type="hidden" name="a" value="signup">
                <input type="hidden" name="action" value="signup">
  
                <!-- Full Name -->
                <div class="form-group">
                  <label for="fullname" class="block text-white/80 text-sm font-medium mb-1.5">
                    Full Name <sup class="text-red-400">*</sup>
                  </label>
                  <input 
                    type="text" 
                    id="fullname"
                    v-model="form.fullname"
                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300"
                    placeholder="Full Name"
                    required
                  />
                </div>
  
                <!-- Username -->
                <div class="form-group">
                  <label for="username" class="block text-white/80 text-sm font-medium mb-1.5">
                    Username <sup class="text-red-400">*</sup>
                  </label>
                  <input 
                    type="text" 
                    id="username"
                    v-model="form.username"
                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300"
                    placeholder="Username"
                    required
                    pattern="[A-Za-z0-9_\-]+"
                    title="Use English letters and digits only"
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
                    />
                    <button 
                      type="button"
                      @click="showPassword2 = !showPassword2"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-300"
                    >
                      <i :class="showPassword2 ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
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
                    <span>I agree with <a href="?a=rules" class="text-gold-400 hover:text-gold-300 transition-colors duration-300">Terms and conditions</a></span>
                  </label>
                </div>
  
                <!-- Submit Button -->
                <button 
                  type="submit" 
                  class="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-primary-900 font-oswald font-bold text-base uppercase shadow-lg shadow-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  :disabled="isSubmitting"
                >
                  <span v-if="!isSubmitting">Sign Up</span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-primary-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                </button>
              </form>
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
  import { ref } from 'vue'
  definePageMeta({
    layout:'custom'
  })
  
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const showPassword = ref(false)
  const showPassword2 = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  
  const form = ref({
    fullname: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    agree: false
  })
  
  const handleRegister = async () => {
    // Clear previous messages
    errorMessage.value = ''
    successMessage.value = ''
  
    // Validate password match
    if (form.value.password !== form.value.password2) {
      errorMessage.value = 'Passwords do not match. Please try again.'
      return
    }
  
    // Validate username format
    if (!/^[A-Za-z0-9_\-]+$/.test(form.value.username)) {
      errorMessage.value = 'Username should use English letters and digits only.'
      return
    }
  
    // Validate terms agreement
    if (!form.value.agree) {
      errorMessage.value = 'You must agree to the Terms and Conditions.'
      return
    }
  
    isSubmitting.value = true
    isLoading.value = true
  
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
  
    // Simulate success
    successMessage.value = 'Account created successfully! Please check your email to verify your account.'
    
    // Reset form
    form.value = {
      fullname: '',
      username: '',
      email: '',
      password: '',
      password2: '',
      agree: false
    }
  
    isSubmitting.value = false
    isLoading.value = false
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
  
  /* Loading overlay */
  .overlay {
    background-color: rgba(1, 9, 50, 0.8);
    backdrop-filter: blur(5px);
  }
  </style>