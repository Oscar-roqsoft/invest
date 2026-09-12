<template>
    <div class="verify-otp-page min-h-screen flex flex-col" style="background: #030f5c;">
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
          <div class="text-white/70 text-sm font-roboto mt-4">Verifying Your Code…</div>
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
                  <i class="bi bi-shield-shaded text-gold-400 text-3xl"></i>
                </div>
                <h3 class="text-white font-oswald font-bold text-2xl md:text-3xl uppercase">
                  VERIFY YOUR IDENTITY
                </h3>
                <div class="w-16 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-3 rounded-full"></div>
                <p class="text-white/60 text-sm mt-3">
                  Enter the 6-digit code sent to your email or authenticator app
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
  
              <!-- OTP Form -->
              <form @submit.prevent="handleVerify" class="space-y-6">
                <input type="hidden" name="a" value="verify_otp">
                <input type="hidden" name="action" value="verify">
                <input type="hidden" name="user_id" :value="userId">
  
                <!-- OTP Input -->
                <div class="form-group">
                  <label for="otp" class="block text-white/80 text-sm font-medium mb-3 text-center">
                    Enter 6-digit verification code
                  </label>
                  
                  <!-- OTP Input Fields -->
                  <div class="flex gap-2 md:gap-3 justify-center">
                    <input 
                      v-for="i in 6" 
                      :key="i"
                      ref="otpInputs"
                      type="text"
                      maxlength="1"
                      v-model="otp[i-1]"
                      @input="handleOtpInput(i-1, $event)"
                      @keydown="handleOtpKeydown(i-1, $event)"
                      @paste="handleOtpPaste"
                      class="w-10 h-12 md:w-12 md:h-14 text-center text-white text-xl font-bold rounded-xl bg-white/10 border border-white/10 focus:border-gold-500/50 focus:outline-none transition-all duration-300"
                      :class="{ 'border-gold-500/50 bg-gold-500/10': otp[i-1] }"
                      autofocus
                      required
                    />
                  </div>
                </div>
  
                <!-- Timer / Resend -->
                <div class="text-center">
                  <p v-if="timer > 0" class="text-white/50 text-sm">
                    Resend code in <span class="text-gold-400 font-medium">{{ timer }}</span> seconds
                  </p>
                  <button 
                    v-else
                    type="button"
                    @click="resendCode"
                    class="text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors duration-300"
                  >
                    <i class="bi bi-arrow-clockwise mr-1"></i>
                    Resend Verification Code
                  </button>
                </div>
  
                <!-- Submit Button -->
                <button 
                  type="submit" 
                  class="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-primary-900 font-oswald font-bold text-base uppercase shadow-lg shadow-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  :disabled="isSubmitting || !isOtpComplete"
                >
                  <span v-if="!isSubmitting">Verify &amp; Login</span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-primary-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                </button>
              </form>
  
              <!-- Alternative Methods -->
              <div class="mt-6 pt-6 border-t border-white/10">
                <p class="text-center text-white/40 text-xs mb-3">Having trouble receiving the code?</p>
                <div class="flex justify-center gap-4">
                  <button 
                    type="button"
                    @click="useEmailMethod"
                    class="text-white/50 hover:text-gold-400 text-xs transition-colors duration-300"
                  >
                    <i class="bi bi-envelope mr-1"></i>
                    Send via Email
                  </button>
                  <button 
                    type="button"
                    @click="useSmsMethod"
                    class="text-white/50 hover:text-gold-400 text-xs transition-colors duration-300"
                  >
                    <i class="bi bi-phone mr-1"></i>
                    Send via SMS
                  </button>
                </div>
              </div>
  
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
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  definePageMeta({
    layout:'custom'
  })
  
  const route = useRoute()
  const router = useRouter()
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  const userId = ref('')
  const timer = ref(60)
  let timerInterval = null
  
  // OTP values (6 digits)
  const otp = ref(['', '', '', '', '', ''])
  const otpInputs = ref([])
  
  // Check if OTP is complete
  const isOtpComplete = computed(() => {
    return otp.value.every(digit => digit !== '')
  })
  
  // Get user ID from URL
  onMounted(() => {
    userId.value = route.query.user_id || route.query.id || ''
    if (!userId.value) {
      errorMessage.value = 'Invalid session. Please login again.'
    }
    
    // Start timer
    startTimer()
    
    // Focus first input
    setTimeout(() => {
      if (otpInputs.value && otpInputs.value[0]) {
        otpInputs.value[0].focus()
      }
    }, 500)
  })
  
  // Cleanup timer
  onUnmounted(() => {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
  })
  
  // Start timer
  const startTimer = () => {
    timer.value = 60
    if (timerInterval) {
      clearInterval(timerInterval)
    }
    timerInterval = setInterval(() => {
      timer.value--
      if (timer.value <= 0) {
        clearInterval(timerInterval)
        timerInterval = null
      }
    }, 1000)
  }
  
  // Handle OTP input
  const handleOtpInput = (index, event) => {
    const value = event.target.value
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      event.target.value = ''
      return
    }
    
    otp.value[index] = value
    
    // Auto-advance to next input
    if (value && index < 5) {
      const nextInput = otpInputs.value[index + 1]
      if (nextInput) {
        nextInput.focus()
      }
    }
  }
  
  // Handle OTP keydown (backspace)
  const handleOtpKeydown = (index, event) => {
    if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
      const prevInput = otpInputs.value[index - 1]
      if (prevInput) {
        prevInput.focus()
        prevInput.select()
      }
    }
  }
  
  // Handle OTP paste
  const handleOtpPaste = (event) => {
    event.preventDefault()
    const pastedData = (event.clipboardData || window.clipboardData).getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, 6)
    
    if (digits) {
      for (let i = 0; i < digits.length && i < 6; i++) {
        otp.value[i] = digits[i]
      }
      // Focus the next empty input or the last input
      const nextIndex = Math.min(digits.length, 5)
      const nextInput = otpInputs.value[nextIndex]
      if (nextInput) {
        nextInput.focus()
      }
    }
  }
  
  // Resend code
  const resendCode = async () => {
    if (timer.value > 0) return
    
    try {
      isLoading.value = true
      // Simulate API call to resend code
      await new Promise(resolve => setTimeout(resolve, 1500))
      startTimer()
      successMessage.value = 'Verification code has been resent to your email.'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } catch (error) {
      errorMessage.value = 'Failed to resend code. Please try again.'
    } finally {
      isLoading.value = false
    }
  }
  
  // Alternative methods
  const useEmailMethod = () => {
    successMessage.value = 'Verification code sent to your email address.'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    startTimer()
  }
  
  const useSmsMethod = () => {
    successMessage.value = 'Verification code sent to your phone number.'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    startTimer()
  }
  
  // Submit OTP
  const handleVerify = async () => {
    if (!isOtpComplete.value) {
      errorMessage.value = 'Please enter all 6 digits of the verification code.'
      return
    }
  
    errorMessage.value = ''
    successMessage.value = ''
    isSubmitting.value = true
    isLoading.value = true
  
    const otpCode = otp.value.join('')
    
    // Simulate API verification
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate verification (for demo purposes)
    if (otpCode === '123456') {
      successMessage.value = 'Verification successful! Redirecting to dashboard...'
      isSubmitting.value = false
      isLoading.value = false
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else {
      errorMessage.value = 'Invalid verification code. Please try again.'
      isSubmitting.value = false
      isLoading.value = false
      
      // Clear OTP
      otp.value = ['', '', '', '', '', '']
      if (otpInputs.value && otpInputs.value[0]) {
        otpInputs.value[0].focus()
      }
    }
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
    
    .otp-input {
      width: 2.5rem;
      height: 3rem;
      font-size: 1rem;
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
  
  /* OTP input focus ring */
  .otp-input:focus {
    box-shadow: 0 0 0 3px rgba(187, 145, 74, 0.2);
  }
  
  /* OTP input hover */
  .otp-input:hover {
    border-color: rgba(187, 145, 74, 0.3);
  }
  
  /* Counter animation */
  .timer {
    transition: color 0.3s ease;
  }
  </style>