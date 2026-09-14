<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Security Score -->
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
          <div class="text-4xl md:text-5xl font-bold text-white">{{ security.score }}%</div>
          <p class="text-white/80 text-sm mt-1">{{ securityMessage }}</p>
        </div>
        <div class="w-24 h-24 relative">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="8"/>
            <circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="white" 
              stroke-width="8"
              stroke-linecap="round"
              :stroke-dasharray="264"
              :stroke-dashoffset="264 - (264 * security.score / 100)"
              class="transition-all duration-1000"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <i class="bi bi-shield-fill-check text-white text-3xl"></i>
          </div>
        </div>
      </div>

      <!-- Quick status badges -->
      <div class="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-3">
        <div class="flex flex-col items-center text-center">
          <i :class="security.isVerified ? 'bi bi-check-circle-fill' : 'bi bi-circle'" class="text-white/80 text-lg mb-1"></i>
          <span class="text-white/80 text-[10px] uppercase tracking-wider font-bold">Email</span>
        </div>
        <div class="flex flex-col items-center text-center">
          <i :class="security.isPinSet ? 'bi bi-check-circle-fill' : 'bi bi-circle'" class="text-white/80 text-lg mb-1"></i>
          <span class="text-white/80 text-[10px] uppercase tracking-wider font-bold">PIN</span>
        </div>
        <div class="flex flex-col items-center text-center">
          <i :class="security.twoFactorVerification ? 'bi bi-check-circle-fill' : 'bi bi-circle'" class="text-white/80 text-lg mb-1"></i>
          <span class="text-white/80 text-[10px] uppercase tracking-wider font-bold">2FA</span>
        </div>
      </div>
    </div>

    <!-- ⭐ TRANSACTION PIN -->
    <div class="rounded-2xl p-5 md:p-6
                bg-white border border-gray-100 shadow-sm
                dark:bg-[#101A47] dark:border-white/[0.05]">
      
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                      bg-amber-500/10 dark:bg-amber-500/[0.08]">
            <i class="bi bi-123 text-amber-500 text-lg"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-bold text-lg text-gray-800 dark:text-white">Transaction PIN</h2>
              <span v-if="!security.isPinSet"
                    class="px-2 py-0.5 rounded-full text-xs font-bold
                           bg-amber-500/10 text-amber-500 dark:bg-amber-500/[0.15] dark:text-amber-400">
                Recommended
              </span>
              <span v-else
                    class="px-2 py-0.5 rounded-full text-xs font-bold
                           bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/[0.15] dark:text-emerald-400">
                <i class="bi bi-check-circle-fill mr-1"></i>Active
              </span>
            </div>
            <p class="text-xs text-gray-400 dark:text-white/40">
              {{ security.isPinSet
                ? 'Your transactions are protected with a PIN'
                : 'Secure withdrawals and transfers with a 4-digit PIN' }}
            </p>
          </div>
        </div>

        <button
          @click="openPinModal"
          class="px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300
                 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
          style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
        >
          <i :class="security.isPinSet ? 'bi bi-pencil-square' : 'bi bi-plus-circle'" class="mr-1"></i>
          {{ security.isPinSet ? 'Change PIN' : 'Set PIN' }}
        </button>
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

      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <!-- Current Password -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
            Current Password
          </label>
          <div class="relative">
            <input 
              :type="showCurrent ? 'text' : 'password'"
              v-model="passwordForm.currentPassword"
              required
              class="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
            <button type="button" @click="showCurrent = !showCurrent"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40">
              <i :class="showCurrent ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
            New Password
          </label>
          <div class="relative">
            <input 
              :type="showNew ? 'text' : 'password'"
              v-model="passwordForm.newPassword"
              required
              minlength="8"
              class="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
            <button type="button" @click="showNew = !showNew"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40">
              <i :class="showNew ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>

          <div v-if="passwordForm.newPassword" class="mt-2">
            <div class="flex items-center gap-2 mb-1">
              <div class="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500"
                     :class="strength.barColor"
                     :style="{ width: strength.width }"></div>
              </div>
              <span class="text-xs font-bold" :class="strength.textColor">
                {{ strength.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Confirm -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
            Confirm New Password
          </label>
          <div class="relative">
            <input 
              :type="showConfirm ? 'text' : 'password'"
              v-model="passwordForm.confirmPassword"
              required
              class="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
            <button type="button" @click="showConfirm = !showConfirm"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40">
              <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <p v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword"
             class="text-xs text-red-400 mt-1">
            <i class="bi bi-exclamation-circle mr-1"></i>Passwords do not match
          </p>
        </div>

        <div class="flex justify-end pt-2">
          <CandleButton
            type="submit"
            variant="gold"
            size="sm"
            :loading="store.state.isSubmitting"
            :disabled="!canChangePassword"
          >
            <i class="bi bi-shield-check"></i>
            Update Password
          </CandleButton>
        </div>
      </form>
    </div>

    <!-- Two-Factor Authentication -->
    <div class="rounded-2xl p-5 md:p-6
                bg-white border border-gray-100 shadow-sm
                dark:bg-[#101A47] dark:border-white/[0.05]">
      
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                      bg-amber-500/10 dark:bg-amber-500/[0.08]">
            <i class="bi bi-shield-lock-fill text-amber-500 text-lg"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-bold text-lg text-gray-800 dark:text-white">Two-Factor Authentication</h2>
              <span v-if="!security.twoFactorVerification" 
                    class="px-2 py-0.5 rounded-full text-xs font-bold 
                           bg-amber-500/10 text-amber-500 dark:bg-amber-500/[0.15] dark:text-amber-400">
                Recommended
              </span>
            </div>
            <p class="text-xs text-gray-400 dark:text-white/40">
              {{ security.twoFactorVerification 
                ? 'Your account is protected with 2FA' 
                : 'Add an extra layer of security' }}
            </p>
          </div>
        </div>
        <button 
          @click="open2FAModal"
          class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 flex-shrink-0"
          :class="security.twoFactorVerification ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/[0.1]'"
        >
          <span 
            class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 shadow-sm"
            :class="security.twoFactorVerification ? 'translate-x-6' : 'translate-x-1'"
          ></span>
        </button>
      </div>
    </div>

    <!-- ⭐ PIN Setup Modal -->
    <PinSetupModal
      v-model="showPinModal"
      :mode="security.isPinSet ? 'change' : 'set'"
      :pin-length="4"
      :is-submitting="isPinSubmitting"
      ref="pinModalRef"
      @submit="handlePinSubmit"
    />

    <!-- ⭐ 2FA Confirmation Modal -->
    <PasswordModal
      v-model="show2FAModal"
      :title="security.twoFactorVerification ? 'Disable 2FA' : 'Enable 2FA'"
      :description="security.twoFactorVerification 
        ? 'Confirm your password to disable two-factor authentication'
        : 'Confirm your password to enable two-factor authentication'"
      :icon="security.twoFactorVerification ? 'bi bi-shield-x' : 'bi bi-shield-check'"
      :icon-color="security.twoFactorVerification ? '#ef4444' : '#10b981'"
      :icon-bg="security.twoFactorVerification ? 'bg-red-500/10 dark:bg-red-500/[0.08]' : 'bg-emerald-500/10 dark:bg-emerald-500/[0.08]'"
      :confirm-text="security.twoFactorVerification ? 'Disable 2FA' : 'Enable 2FA'"
      :is-submitting="is2FASubmitting"
      ref="twoFAModalRef"
      @confirm="handle2FAConfirm"
    />
  </div>
</template>

<script setup>
import { toast } from 'vue-sonner'

const store = useUserStore()

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

// PIN modal
const showPinModal = ref(false)
const isPinSubmitting = ref(false)
const pinModalRef = ref(null)

// 2FA modal
const show2FAModal = ref(false)
const is2FASubmitting = ref(false)
const twoFAModalRef = ref(null)

const security = computed(() => store.state.security)

const securityMessage = computed(() => {
  const s = security.value.score
  if (s >= 90) return 'Excellent - Your account is highly secure'
  if (s >= 70) return 'Good - Enable remaining features for max security'
  if (s >= 40) return 'Fair - Consider adding more security features'
  return 'Low - Please improve your account security'
})

const passwordRequirements = computed(() => {
  const p = passwordForm.value.newPassword
  return [
    { label: '8+ chars', met: p.length >= 8 },
    { label: 'Uppercase', met: /[A-Z]/.test(p) },
    { label: 'Lowercase', met: /[a-z]/.test(p) },
    { label: 'Number', met: /[0-9]/.test(p) },
    { label: 'Special char', met: /[^A-Za-z0-9]/.test(p) },
  ]
})

const strength = computed(() => {
  const met = passwordRequirements.value.filter((r) => r.met).length
  if (met <= 1) return { label: 'Weak', width: '20%', barColor: 'bg-red-500', textColor: 'text-red-400' }
  if (met <= 2) return { label: 'Fair', width: '40%', barColor: 'bg-amber-500', textColor: 'text-amber-400' }
  if (met <= 3) return { label: 'Good', width: '60%', barColor: 'bg-blue-500', textColor: 'text-blue-400' }
  if (met <= 4) return { label: 'Strong', width: '80%', barColor: 'bg-emerald-500', textColor: 'text-emerald-400' }
  return { label: 'Very Strong', width: '100%', barColor: 'bg-emerald-500', textColor: 'text-emerald-400' }
})

const canChangePassword = computed(() => {
  return (
    passwordForm.value.currentPassword.length > 0 &&
    passwordForm.value.newPassword.length >= 8 &&
    passwordRequirements.value.every((r) => r.met) &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword !== passwordForm.value.currentPassword
  )
})

onMounted(async () => {
  await store.fetchSecurity()
})

// ─────────────────────────────────────────────────────────────
// CHANGE PASSWORD
// ─────────────────────────────────────────────────────────────
const handleChangePassword = async () => {
  const toastId = toast.loading('Updating password...')

  const res = await store.changePassword({
    currentPassword: passwordForm.value.currentPassword,
    newPassword: passwordForm.value.newPassword,
  })

  if (res.success) {
    toast.success('Password updated! 🔒', {
      id: toastId,
      description: 'Use your new password next time you log in.',
    })
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } else {
    toast.error('Update failed', {
      id: toastId,
      description: res.message || 'Please check your current password.',
    })
  }
}

// ─────────────────────────────────────────────────────────────
// PIN
// ─────────────────────────────────────────────────────────────
const openPinModal = () => {
  showPinModal.value = true
}

const handlePinSubmit = async ({ currentPin, newPin, password }) => {
  isPinSubmitting.value = true

  const toastId = toast.loading(
    security.value.isPinSet ? 'Updating PIN...' : 'Setting up PIN...'
  )

  try {
    const res = security.value.isPinSet
      ? await store.changePin({ currentPin, newPin, password })
      : await store.setPin({ pin: newPin, password })

    if (res.success) {
      toast.success(
        security.value.isPinSet ? 'PIN updated! 🔐' : 'PIN set successfully! 🔐',
        {
          id: toastId,
          description: 'Your transactions are now protected.',
        }
      )
      showPinModal.value = false
      await store.fetchSecurity()
    } else {
      toast.error('Failed', {
        id: toastId,
        description: res.message || 'Please check your PIN and password.',
      })
      pinModalRef.value?.setError(res.message)
    }
  } catch (err) {
    toast.error('Something went wrong', {
      id: toastId,
      description: err.message,
    })
  } finally {
    isPinSubmitting.value = false
  }
}

// ─────────────────────────────────────────────────────────────
// 2FA
// ─────────────────────────────────────────────────────────────
const open2FAModal = () => {
  show2FAModal.value = true
}

const handle2FAConfirm = async (password) => {
  is2FASubmitting.value = true

  const enabling = !security.value.twoFactorVerification
  const toastId = toast.loading(enabling ? 'Enabling 2FA...' : 'Disabling 2FA...')

  try {
    const res = await store.toggle2FA(enabling, password)

    if (res.success) {
      toast.success(enabling ? '2FA enabled! 🛡️' : '2FA disabled', {
        id: toastId,
        description: enabling
          ? 'Your account now has an extra layer of security.'
          : 'You can re-enable it anytime.',
      })
      show2FAModal.value = false
      await store.fetchSecurity()
    } else {
      toast.error('Failed', {
        id: toastId,
        description: res.message || 'Incorrect password.',
      })
      twoFAModalRef.value?.setError(res.message)
    }
  } catch (err) {
    toast.error('Something went wrong', {
      id: toastId,
      description: err.message,
    })
  } finally {
    is2FASubmitting.value = false
  }
}
</script>