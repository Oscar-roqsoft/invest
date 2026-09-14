<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Header -->
    <div class="rounded-2xl p-5 md:p-6
                bg-white border border-gray-100 shadow-sm
                dark:bg-[#101A47] dark:border-white/[0.05]">
      
      <div class="flex items-center gap-3 mb-6">
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                    bg-gold-500/10 dark:bg-amber-500/[0.08]">
          <i class="bi bi-person-fill text-amber-500 text-lg"></i>
        </div>
        <div>
          <h2 class="font-bold text-lg text-gray-800 dark:text-white">Personal Information</h2>
          <p class="text-xs text-gray-400 dark:text-white/40">Update your personal details</p>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="isInitialLoading" class="space-y-4 animate-pulse">
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 rounded-full bg-gray-200 dark:bg-white/[0.06]"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-white/[0.06] rounded w-1/3"></div>
            <div class="h-3 bg-gray-200 dark:bg-white/[0.06] rounded w-1/2"></div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-5">
          <div class="h-12 bg-gray-200 dark:bg-white/[0.06] rounded-xl"></div>
          <div class="h-12 bg-gray-200 dark:bg-white/[0.06] rounded-xl"></div>
        </div>
      </div>

      <template v-else>
        <!-- Avatar Upload -->
        <div class="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-gray-100 dark:border-white/[0.06]">
          <div class="relative group">
            <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-gold-500/30 relative">
              <img 
                :src="avatarPreview || profile?.avatar || '/avatar.webp'" 
                alt="Profile"
                class="w-full h-full object-cover"
              >
              <div v-if="isUploadingAvatar" 
                   class="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div class="candles-loader flex gap-1">
                  <div v-for="i in 4" :key="i" class="candles-loader-candle-small"></div>
                </div>
              </div>
            </div>
            <label class="absolute inset-0 rounded-full flex items-center justify-center cursor-pointer bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <i class="bi bi-camera-fill text-white text-2xl"></i>
              <input type="file" accept="image/*" class="hidden" @change="handleAvatarChange">
            </label>
          </div>
          <div class="flex-1 text-center sm:text-left">
            <h3 class="font-bold text-gray-800 dark:text-white mb-1">Profile Photo</h3>
            <p class="text-sm text-gray-500 dark:text-white/40 mb-3">
              Upload a new photo. JPG or PNG, max 5MB.
            </p>
            <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
              <label class="px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200
                            bg-gray-100 text-gray-700 hover:bg-gray-200
                            dark:bg-white/[0.06] dark:text-white/80 dark:hover:bg-white/[0.1]">
                <i class="bi bi-upload mr-1"></i> Upload New
                <input type="file" accept="image/*" class="hidden" @change="handleAvatarChange">
              </label>
              <button 
                v-if="avatarPreview"
                @click="cancelAvatar"
                class="px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200
                       bg-red-50 text-red-600 hover:bg-red-100
                       dark:bg-red-500/[0.08] dark:text-red-400 dark:hover:bg-red-500/[0.15]"
              >
                <i class="bi bi-x-lg mr-1"></i> Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Form Fields -->
        <form @submit.prevent="handleSave" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Full Name <sup class="text-red-400">*</sup>
            </label>
            <input 
              v-model="form.name"
              type="text"
              required
              minlength="2"
              maxlength="60"
              placeholder="Your full name"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
          </div>

          <!-- Email (disabled) -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Email Address
            </label>
            <div class="relative">
              <input 
                :value="profile?.email"
                type="email"
                disabled
                class="w-full px-4 py-3 pr-24 rounded-xl text-sm outline-none
                       bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed
                       dark:bg-white/[0.02] dark:border-white/[0.06] dark:text-white/40"
              >
              <span 
                class="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-xs font-bold"
                :class="profile?.isVerified 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-amber-500/10 text-amber-500'"
              >
                <i :class="profile?.isVerified ? 'bi bi-check-circle-fill' : 'bi bi-clock-fill'" class="mr-1"></i>
                {{ profile?.isVerified ? 'Verified' : 'Unverified' }}
              </span>
            </div>
            <p class="text-xs text-gray-400 dark:text-white/30 mt-1">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Phone Number
            </label>
            <input 
              v-model="form.phone"
              type="tel"
              placeholder="+1 555 123-4567"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
          </div>

          <!-- Country — NEW DROPDOWN -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Country
            </label>
            <CountryDropdown v-model="form.country" />
          </div>

          <!-- City -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              City
            </label>
            <input 
              v-model="form.city"
              type="text"
              placeholder="e.g. London"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
          </div>

          <!-- Date of Birth -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Date of Birth
            </label>
            <input 
              v-model="form.dateOfBirth"
              type="date"
              :max="maxDateOfBirth"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
            <p class="text-xs text-gray-400 dark:text-white/30 mt-1">
              You must be 18 or older
            </p>
          </div>

          <!-- Address -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Residential Address
            </label>
            <input 
              v-model="form.address"
              type="text"
              placeholder="123 Main Street, Apt 4B"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
          </div>

          <!-- Gender -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Gender
            </label>
            <div class="flex flex-wrap gap-2">
              <label 
                v-for="g in genders" 
                :key="g.value"
                class="px-4 py-2 rounded-xl font-medium text-sm cursor-pointer transition-all duration-200"
                :class="form.gender === g.value 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 dark:bg-white/[0.04] dark:text-white/60 dark:border-white/[0.06]'"
              >
                <input type="radio" :value="g.value" v-model="form.gender" class="hidden">
                {{ g.label }}
              </label>
            </div>
          </div>

          <!-- Save -->
          <div class="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
            <button 
              type="button"
              @click="resetForm"
              :disabled="!hasChanges"
              class="px-6 py-3 rounded-xl font-semibold text-sm text-gray-700 dark:text-white/70
                     bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]
                     transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <CandleButton
              type="submit"
              variant="gold"
              size="md"
              :loading="store.state.isSubmitting"
              :disabled="!hasChanges"
            >
              <i class="bi bi-check-lg"></i>
              Save Changes
            </CandleButton>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue-sonner';
import CountryDropdown from '~/components/CountryDropdown.vue';

const store = useUserStore();
const authStore = useAuthStore();

const avatarPreview = ref(null);
const isInitialLoading = ref(true);

const isUploadingAvatar = computed(() => store.state.isUploadingAvatar);
const profile = computed(() => store.state.profile || authStore.state.user);

// Form — bio removed
const form = ref({
  name: '',
  phone: '',
  country: '',
  city: '',
  address: '',
  dateOfBirth: '',
  gender: '',
});

const initialForm = ref({});

const hasChanges = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(initialForm.value);
});

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const maxDateOfBirth = computed(() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split('T')[0];
});

// ─────────────────────────────────────────────────────────────
// LOAD PROFILE
// ─────────────────────────────────────────────────────────────
const loadFormFromProfile = () => {
  const p = store.state.profile || authStore.state.user;
  if (!p) return;

  form.value = {
    name: p.name || '',
    phone: p.phone || '',
    country: p.country || '',
    city: p.city || '',
    address: p.address || '',
    dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
    gender: p.gender || '',
  };

  initialForm.value = { ...form.value };
};

onMounted(async () => {
  loadFormFromProfile();

  const res = await store.fetchProfile();

  if (res.success) {
    loadFormFromProfile();
  } else {
    if (!store.state.profile && !authStore.state.user) {
      toast.error('Failed to load profile', { description: res.message });
    }
  }

  isInitialLoading.value = false;
});

const resetForm = () => {
  form.value = { ...initialForm.value };
  toast.info('Form reset');
};

// ─────────────────────────────────────────────────────────────
// AVATAR UPLOAD
// ─────────────────────────────────────────────────────────────
const handleAvatarChange = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast.error('File too large', { description: 'Maximum size is 5MB' });
    return;
  }

  if (!file.type.startsWith('image/')) {
    toast.error('Invalid file', { description: 'Only images are allowed' });
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    avatarPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);

  const toastId = toast.loading('Optimizing image...', {
    description: `${formatBytes(file.size)}`,
  });

  const res = await store.uploadAvatar(file, {
    onCompressProgress: (percent) => {
      toast.loading('Optimizing image...', {
        id: toastId,
        description: `Compressing: ${percent}%`,
      });
    },
    onUploadProgress: (percent) => {
      toast.loading('Uploading...', {
        id: toastId,
        description: `${percent}%`,
      });
    },
  });

  if (res.success) {
    let desc = 'Your new profile photo is live.';
    if (res.compression && res.compression.savings > 0) {
      desc = `Saved ${res.compression.savings}% (${formatBytes(res.compression.originalSize)} → ${formatBytes(res.compression.compressedSize)})`;
    }

    toast.success('Avatar updated! 🎉', { id: toastId, description: desc });
    avatarPreview.value = null;
  } else {
    toast.error('Upload failed', {
      id: toastId,
      description: res.message || 'Please try again.',
    });
  }
};

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const cancelAvatar = () => {
  avatarPreview.value = null;
};

// ─────────────────────────────────────────────────────────────
// SAVE
// ─────────────────────────────────────────────────────────────
const handleSave = async () => {
  if (form.value.name.trim().length < 2) {
    toast.error('Name must be at least 2 characters');
    return;
  }

  const payload = {};
  Object.keys(form.value).forEach((key) => {
    const value = form.value[key];
    if (value !== '' && value !== null && value !== undefined) {
      payload[key] = value;
    }
  });

  const toastId = toast.loading('Saving changes...');

  const res = await store.updateProfile(payload);

  if (res.success) {
    toast.success('Profile updated! 🎉', {
      id: toastId,
      description: 'Your changes have been saved.',
    });
    initialForm.value = { ...form.value };
  } else {
    toast.error('Update failed', {
      id: toastId,
      description: res.message || 'Please try again.',
    });
  }
};
</script>

<style scoped>
.candles-loader-candle-small {
  width: 4px;
  height: 16px;
  border-radius: 4px;
  background: #bb914a;
  animation: candleSmall 1s ease-in-out infinite;
}

.candles-loader-candle-small:nth-child(2) { animation-delay: -0.75s; }
.candles-loader-candle-small:nth-child(3) { animation-delay: -0.5s; }
.candles-loader-candle-small:nth-child(4) { animation-delay: -0.25s; }

@keyframes candleSmall {
  0%, 100% {
    box-shadow: 0 0 0 #bb914a, 0 0 0 #bb914a;
  }
  50% {
    box-shadow: 0 -6px 0 #bb914a, 0 6px 0 #bb914a;
  }
}
</style>