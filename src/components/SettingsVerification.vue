<template>
  <div class="space-y-4 md:space-y-6">

    <!-- ⭐ KYC Status Banner -->
    <div
      class="rounded-2xl p-6 relative overflow-hidden shadow-lg"
      :class="bannerClasses"
    >
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.1] rounded-full blur-2xl"></div>

      <div class="relative z-10">
        <div class="flex items-center gap-2 mb-2">
          <i :class="bannerIcon" class="text-white text-2xl"></i>
          <span class="text-white/80 text-xs font-bold uppercase tracking-wider">
            Identity Verification
          </span>
        </div>

        <div class="text-3xl md:text-4xl font-bold text-white mb-2">
          {{ bannerTitle }}
        </div>
        <p class="text-white/80 text-sm">{{ bannerMessage }}</p>

        <!-- Progress Bar (only for not_started / pending) -->
        <div v-if="kycStatus !== 'approved'" class="mt-4 h-2 rounded-full bg-white/[0.2] overflow-hidden">
          <div
            class="h-full rounded-full bg-white transition-all duration-1000"
            :style="{ width: kycProgress + '%' }"
          ></div>
        </div>

        <div class="mt-4 flex items-center gap-2 text-white/80 text-xs">
          <i class="bi bi-info-circle"></i>
          <span>{{ bannerHint }}</span>
        </div>
      </div>
    </div>

    <!-- ⭐ KYC Submission Form -->
    <div
      v-if="kycStatus === 'not_started' || kycStatus === 'rejected'"
      class="rounded-2xl p-5 md:p-6
             bg-white border border-gray-100 shadow-sm
             dark:bg-[#101A47] dark:border-white/[0.05]"
    >
      <div class="flex items-center gap-3 mb-6">
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                    bg-amber-500/10 dark:bg-amber-500/[0.08]">
          <i class="bi bi-person-vcard-fill text-amber-500 text-lg"></i>
        </div>
        <div>
          <h2 class="font-bold text-lg text-gray-800 dark:text-white">
            Submit Identity Documents
          </h2>
          <p class="text-xs text-gray-400 dark:text-white/40">
            We'll review within 24-48 hours
          </p>
        </div>
      </div>

      <!-- Rejection Notice -->
      <div
        v-if="kycStatus === 'rejected' && profile?.kyc?.rejectionReason"
        class="mb-5 p-4 rounded-xl flex items-start gap-3"
        style="background: rgba(220, 53, 69, 0.08); border: 1px solid rgba(220, 53, 69, 0.2);"
      >
        <i class="bi bi-exclamation-triangle-fill text-red-500 text-lg flex-shrink-0 mt-0.5"></i>
        <div>
          <p class="font-bold text-red-600 dark:text-red-400 text-sm mb-1">
            Previous submission rejected
          </p>
          <p class="text-xs text-gray-600 dark:text-white/60">
            {{ profile.kyc.rejectionReason }}
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmitKYC" class="space-y-5">

        <!-- Document Type -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
            Document Type <sup class="text-red-400">*</sup>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label
              v-for="doc in documentTypes"
              :key="doc.value"
              class="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200"
              :class="kycForm.documentType === doc.value
                ? 'border-amber-500 bg-amber-500/[0.06]'
                : 'border-gray-200 dark:border-white/[0.06] hover:border-amber-500/40 bg-gray-50 dark:bg-white/[0.03]'"
            >
              <input
                type="radio"
                :value="doc.value"
                v-model="kycForm.documentType"
                class="hidden"
                required
              >
              <i :class="doc.icon" class="text-lg text-amber-500"></i>
              <span class="text-sm font-medium text-gray-700 dark:text-white/80">
                {{ doc.label }}
              </span>
            </label>
          </div>
        </div>

        <!-- Document Number -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
            Document Number <sup class="text-red-400">*</sup>
          </label>
          <input
            v-model="kycForm.documentNumber"
            type="text"
            required
            placeholder="e.g. AB1234567"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none
                   bg-gray-50 border border-gray-200 text-gray-700
                   focus:border-gold-500/50
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
                   dark:focus:border-amber-500/50 uppercase"
          >
        </div>

        <!-- Upload Document -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
            Upload Document <sup class="text-red-400">*</sup>
          </label>

          <div
            class="relative rounded-2xl border-2 border-dashed transition-all duration-300 p-6 text-center cursor-pointer"
            :class="[
              isDraggingDocument
                ? 'border-amber-500 bg-amber-500/[0.05]'
                : 'border-gray-300 dark:border-white/[0.1] hover:border-amber-500/50',
              documentFile ? 'bg-gray-50 dark:bg-white/[0.03]' : '',
            ]"
            @dragover.prevent="isDraggingDocument = true"
            @dragleave.prevent="isDraggingDocument = false"
            @drop.prevent="handleDocumentDrop"
            @click="$refs.documentInput.click()"
          >
            <input
              ref="documentInput"
              type="file"
              accept="image/*,application/pdf"
              class="hidden"
              @change="handleDocumentChange"
            >

            <template v-if="!documentFile">
              <div class="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                <i class="bi bi-cloud-upload text-amber-500 text-2xl"></i>
              </div>
              <p class="font-bold text-sm text-gray-800 dark:text-white mb-1">
                Click or drag your document here
              </p>
              <p class="text-xs text-gray-500 dark:text-white/40">
                PNG, JPG or PDF — max 5MB
              </p>
            </template>

            <template v-else>
              <div v-if="documentPreview" class="mb-3">
                <img
                  v-if="documentPreview !== 'pdf'"
                  :src="documentPreview"
                  class="max-h-40 mx-auto rounded-lg shadow-lg"
                >
                <div v-else class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
                  <i class="bi bi-file-earmark-pdf text-red-500 text-2xl"></i>
                </div>
              </div>
              <p class="text-sm font-semibold text-gray-700 dark:text-white/80 truncate">
                {{ documentFile.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-white/40 mt-1">
                {{ formatBytes(documentFile.size) }}
              </p>
              <button
                type="button"
                class="mt-3 text-xs text-red-500 hover:text-red-400"
                @click.stop="clearDocument"
              >
                <i class="bi bi-x-circle mr-1"></i> Remove
              </button>
            </template>
          </div>
        </div>

        <!-- Upload Selfie -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
            Selfie with Document <sup class="text-red-400">*</sup>
          </label>

          <div
            class="relative rounded-2xl border-2 border-dashed transition-all duration-300 p-6 text-center cursor-pointer"
            :class="[
              isDraggingSelfie
                ? 'border-amber-500 bg-amber-500/[0.05]'
                : 'border-gray-300 dark:border-white/[0.1] hover:border-amber-500/50',
              selfieFile ? 'bg-gray-50 dark:bg-white/[0.03]' : '',
            ]"
            @dragover.prevent="isDraggingSelfie = true"
            @dragleave.prevent="isDraggingSelfie = false"
            @drop.prevent="handleSelfieDrop"
            @click="$refs.selfieInput.click()"
          >
            <input
              ref="selfieInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleSelfieChange"
            >

            <template v-if="!selfieFile">
              <div class="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                <i class="bi bi-person-bounding-box text-amber-500 text-2xl"></i>
              </div>
              <p class="font-bold text-sm text-gray-800 dark:text-white mb-1">
                Click or drag your selfie here
              </p>
              <p class="text-xs text-gray-500 dark:text-white/40">
                Hold your ID next to your face — PNG or JPG, max 5MB
              </p>
            </template>

            <template v-else>
              <div class="mb-3">
                <img
                  :src="selfiePreview"
                  class="max-h-40 mx-auto rounded-lg shadow-lg"
                >
              </div>
              <p class="text-sm font-semibold text-gray-700 dark:text-white/80 truncate">
                {{ selfieFile.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-white/40 mt-1">
                {{ formatBytes(selfieFile.size) }}
              </p>
              <button
                type="button"
                class="mt-3 text-xs text-red-500 hover:text-red-400"
                @click.stop="clearSelfie"
              >
                <i class="bi bi-x-circle mr-1"></i> Remove
              </button>
            </template>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-white/[0.06]">
          <CandleButton
            type="submit"
            variant="gold"
            size="md"
            :loading="store.state.isSubmitting"
            :disabled="!canSubmit"
          >
            <i class="bi bi-shield-check"></i>
            Submit for Review
          </CandleButton>
        </div>
      </form>
    </div>

    <!-- ⭐ Pending Review State -->
    <div
      v-else-if="kycStatus === 'pending'"
      class="rounded-2xl p-8 text-center
             bg-white border border-gray-100 shadow-sm
             dark:bg-[#101A47] dark:border-white/[0.05]"
    >
      <div class="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4 relative">
        <div class="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div>
        <i class="bi bi-hourglass-split text-amber-500 text-4xl relative"></i>
      </div>

      <h3 class="font-oswald font-bold text-xl text-gray-800 dark:text-white uppercase mb-2">
        Verification In Review
      </h3>
      <p class="text-sm text-gray-500 dark:text-white/40 max-w-md mx-auto mb-6">
        Your documents have been submitted and are under review.
        This typically takes 24-48 hours. You'll receive an email once it's approved.
      </p>

      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full
                  bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold">
        <i class="bi bi-clock-fill"></i>
        Submitted {{ formattedSubmittedAt }}
      </div>
    </div>

    <!-- ⭐ Approved State -->
    <div
      v-else-if="kycStatus === 'approved'"
      class="rounded-2xl p-8 text-center
             bg-white border border-gray-100 shadow-sm
             dark:bg-[#101A47] dark:border-white/[0.05]"
    >
      <div class="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 relative">
        <div class="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
        <i class="bi bi-patch-check-fill text-emerald-500 text-4xl relative"></i>
      </div>

      <h3 class="font-oswald font-bold text-xl text-gray-800 dark:text-white uppercase mb-2">
        Fully Verified ✅
      </h3>
      <p class="text-sm text-gray-500 dark:text-white/40 max-w-md mx-auto mb-6">
        Your identity has been verified. You now have full access to all platform features.
      </p>

      <!-- Verified Benefits -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
        <div
          v-for="benefit in approvedBenefits"
          :key="benefit"
          class="flex items-start gap-2 p-3 rounded-xl
                 bg-emerald-500/[0.06] border border-emerald-500/15"
        >
          <i class="bi bi-check-circle-fill text-emerald-500 mt-0.5 flex-shrink-0"></i>
          <span class="text-xs text-gray-700 dark:text-white/70">{{ benefit }}</span>
        </div>
      </div>

      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-6
               bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold"
      >
        <i class="bi bi-check-circle-fill"></i>
        Approved {{ formattedApprovedAt }}
      </div>
    </div>

    <!-- Why Verify? -->
    <div
      v-if="kycStatus !== 'approved'"
      class="rounded-2xl p-5 md:p-6
             bg-amber-500/[0.04] border border-amber-500/[0.15]"
    >
      <div class="flex items-start gap-3">
        <i class="bi bi-lightbulb-fill text-amber-500 text-lg flex-shrink-0 mt-0.5"></i>
        <div>
          <h4 class="font-bold text-sm text-amber-600 dark:text-amber-400 mb-3">
            Why Verify Your Account?
          </h4>
          <ul class="space-y-2 text-xs text-gray-600 dark:text-white/50">
            <li v-for="reason in whyVerify" :key="reason" class="flex items-start gap-2">
              <i class="bi bi-check-circle-fill text-emerald-500 mt-0.5"></i>
              <span>{{ reason }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue-sonner'

const store = useUserStore()
const authStore = useAuthStore()

// ─────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────
const profile = computed(() => store.state.profile || authStore.state.user)

// KYC status: 'not_started' | 'pending' | 'approved' | 'rejected'
const kycStatus = computed(() => profile.value?.kyc?.status || 'not_started')

// ─────────────────────────────────────────────────────────────
// KYC FORM
// ─────────────────────────────────────────────────────────────
const kycForm = ref({
  documentType: '',
  documentNumber: '',
})

const documentTypes = [
  { value: 'passport', label: 'Passport', icon: 'bi bi-journal-bookmark-fill' },
  { value: 'national_id', label: 'National ID', icon: 'bi bi-person-vcard-fill' },
  { value: 'drivers_license', label: "Driver's License", icon: 'bi bi-car-front-fill' },
]

// Files
const documentFile = ref(null)
const documentPreview = ref(null)
const selfieFile = ref(null)
const selfiePreview = ref(null)

// Drag state
const isDraggingDocument = ref(false)
const isDraggingSelfie = ref(false)

const canSubmit = computed(() => {
  return (
    kycForm.value.documentType &&
    kycForm.value.documentNumber.trim().length > 0 &&
    documentFile.value &&
    selfieFile.value
  )
})

// ─────────────────────────────────────────────────────────────
// FILE HANDLING
// ─────────────────────────────────────────────────────────────
const setDocumentFile = (file) => {
  if (!file) return

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    toast.error('File too large', { description: 'Maximum size is 5MB' })
    return
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  if (!validTypes.includes(file.type)) {
    toast.error('Invalid file type', { description: 'Only PNG, JPG, or PDF' })
    return
  }

  documentFile.value = file

  // Preview
  if (file.type === 'application/pdf') {
    documentPreview.value = 'pdf'
  } else {
    const reader = new FileReader()
    reader.onload = (e) => { documentPreview.value = e.target.result }
    reader.readAsDataURL(file)
  }
}

const setSelfieFile = (file) => {
  if (!file) return

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    toast.error('File too large', { description: 'Maximum size is 5MB' })
    return
  }

  if (!file.type.startsWith('image/')) {
    toast.error('Invalid file', { description: 'Selfie must be an image' })
    return
  }

  selfieFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => { selfiePreview.value = e.target.result }
  reader.readAsDataURL(file)
}

const handleDocumentChange = (e) => {
  setDocumentFile(e.target.files?.[0])
}

const handleSelfieChange = (e) => {
  setSelfieFile(e.target.files?.[0])
}

const handleDocumentDrop = (e) => {
  isDraggingDocument.value = false
  setDocumentFile(e.dataTransfer.files?.[0])
}

const handleSelfieDrop = (e) => {
  isDraggingSelfie.value = false
  setSelfieFile(e.dataTransfer.files?.[0])
}

const clearDocument = () => {
  documentFile.value = null
  documentPreview.value = null
}

const clearSelfie = () => {
  selfieFile.value = null
  selfiePreview.value = null
}

// ─────────────────────────────────────────────────────────────
// SUBMIT KYC
// ─────────────────────────────────────────────────────────────
const isUploading = ref(false)

const handleSubmitKYC = async () => {
  if (!canSubmit.value) return

  isUploading.value = true

  const toastId = toast.loading('Uploading documents...', {
    description: 'This may take a moment',
  })

  try {
    // ⭐ Upload document
    toast.loading('Uploading document...', { id: toastId, description: '1 of 2' })

    const docRes = await store.uploadFile(documentFile.value, {
      type: 'kyc_document',
      fieldName: 'image',
      compress: true,
      compressionOptions: {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        initialQuality: 0.9,
      },
    })

    if (!docRes.success) {
      toast.error('Document upload failed', { id: toastId, description: docRes.message })
      return
    }

    // ⭐ Upload selfie
    toast.loading('Uploading selfie...', { id: toastId, description: '2 of 2' })

    const selfieRes = await store.uploadFile(selfieFile.value, {
      type: 'kyc_selfie',
      fieldName: 'image',
      compress: true,
      compressionOptions: {
        maxSizeMB: 1,
        maxWidthOrHeight: 1280,
        initialQuality: 0.85,
      },
    })

    if (!selfieRes.success) {
      toast.error('Selfie upload failed', { id: toastId, description: selfieRes.message })
      return
    }

    // ⭐ Submit to backend
    toast.loading('Submitting for review...', { id: toastId, description: '' })

    const submitRes = await store.submitKYC({
      documentType: kycForm.value.documentType,
      documentNumber: kycForm.value.documentNumber,
      documentUrl: docRes.url,
      selfieUrl: selfieRes.url,
    })

    if (!submitRes.success) {
      toast.error('Submission failed', { id: toastId, description: submitRes.message })
      return
    }

    // Success!
    toast.success('KYC submitted! 📄', {
      id: toastId,
      description: 'We\'ll review within 24-48 hours.',
    })

    // Reset form
    resetForm()

    // Refresh profile to show pending state
    await store.fetchProfile()
  } catch (err) {
    toast.error('Something went wrong', {
      id: toastId,
      description: err.message || 'Please try again.',
    })
  } finally {
    isUploading.value = false
  }
}

const resetForm = () => {
  kycForm.value = { documentType: '', documentNumber: '' }
  clearDocument()
  clearSelfie()
}

// ─────────────────────────────────────────────────────────────
// BANNER CONTENT (dynamic per status)
// ─────────────────────────────────────────────────────────────
const bannerClasses = computed(() => {
  switch (kycStatus.value) {
    case 'approved':
      return 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30'
    case 'pending':
      return 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/30'
    case 'rejected':
      return 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30'
    default:
      return 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30'
  }
})

const bannerIcon = computed(() => {
  switch (kycStatus.value) {
    case 'approved': return 'bi bi-patch-check-fill'
    case 'pending': return 'bi bi-hourglass-split'
    case 'rejected': return 'bi bi-x-circle-fill'
    default: return 'bi bi-shield-check'
  }
})

const bannerTitle = computed(() => {
  switch (kycStatus.value) {
    case 'approved': return 'VERIFIED'
    case 'pending': return 'IN REVIEW'
    case 'rejected': return 'RESUBMIT'
    default: return 'NOT VERIFIED'
  }
})

const bannerMessage = computed(() => {
  switch (kycStatus.value) {
    case 'approved':
      return 'Your identity has been verified. All features unlocked.'
    case 'pending':
      return 'We\'re reviewing your documents. This takes 24-48 hours.'
    case 'rejected':
      return 'Your previous submission was rejected. Please resubmit.'
    default:
      return 'Verify your identity to unlock all features.'
  }
})

const bannerHint = computed(() => {
  switch (kycStatus.value) {
    case 'approved': return 'Thank you for completing verification'
    case 'pending': return 'You will receive an email once approved'
    case 'rejected': return 'Check the reason below and resubmit'
    default: return 'Takes about 2 minutes to complete'
  }
})

const kycProgress = computed(() => {
  switch (kycStatus.value) {
    case 'approved': return 100
    case 'pending': return 75
    case 'rejected': return 25
    default: return 0
  }
})

const approvedBenefits = [
  'Higher withdrawal limits',
  'Advanced trading features',
  'Enhanced account security',
  'Faster transaction processing',
]

const whyVerify = [
  'Unlock higher withdrawal limits ($50,000/day)',
  'Access advanced trading features and tools',
  'Enhanced account security and fraud protection',
  'Faster transaction processing times',
  'Priority customer support',
]

// ─────────────────────────────────────────────────────────────
// FORMATTING
// ─────────────────────────────────────────────────────────────
const formattedSubmittedAt = computed(() => {
  const d = profile.value?.kyc?.submittedAt
  if (!d) return 'recently'
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

const formattedApprovedAt = computed(() => {
  const d = profile.value?.kyc?.reviewedAt
  if (!d) return 'recently'
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// ─────────────────────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────────────────────
onMounted(async () => {
  // Fetch fresh profile so KYC status is accurate
  await store.fetchProfile()
})
</script>