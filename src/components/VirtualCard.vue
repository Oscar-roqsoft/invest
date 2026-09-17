<template>
    <div
      class="virtual-card-wrap relative select-none"
      :class="size === 'lg' ? 'max-w-md' : size === 'sm' ? 'max-w-xs' : 'max-w-sm'"
    >
      <!-- Flip container -->
      <div
        class="relative transition-transform duration-700"
        :style="{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
          aspectRatio: '1.586 / 1', // standard ISO/IEC 7810 ID-1 ratio
        }"
      >
        <!-- FRONT -->
        <div
          class="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl p-5 md:p-6 flex flex-col justify-between"
          :style="{
            background: tierMeta.gradient,
            backfaceVisibility: 'hidden',
            color: tierMeta.textColor,
          }"
        >
          <!-- Decorative noise -->
          <div class="absolute inset-0 opacity-[0.06] pointer-events-none"
               style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 16px 16px;"></div>
  
          <!-- Top row -->
          <div class="relative z-10 flex items-start justify-between">
            <div class="flex items-center gap-2">
              <i :class="tierMeta.icon" class="text-xl"></i>
              <span class="font-bold text-sm tracking-wide uppercase">{{ tierMeta.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                :class="tier === 'black'
                  ? 'bg-white/10 text-amber-300'
                  : 'bg-black/10 text-neutral-800'"
              >
                VIRTUAL
              </span>
              <span
                class="w-8 h-5 rounded-sm"
                :class="tier === 'gold' ? 'bg-neutral-800/70' : 'bg-neutral-700/60'"
              >
                <i class="bi bi-cpu text-[10px] opacity-60 block text-center text-amber-300" style="line-height: 1.25rem;"></i>
              </span>
            </div>
          </div>
  
          <!-- Middle: chip + number -->
          <div class="relative z-10">
            <div class="w-10 h-7 rounded-md mb-3 relative overflow-hidden"
                 :class="tier === 'gold' ? 'bg-gradient-to-br from-amber-200 to-amber-400' : 'bg-gradient-to-br from-neutral-300 to-neutral-500'">
              <div class="absolute inset-y-1 left-1/2 w-px bg-black/20"></div>
              <div class="absolute inset-x-1 top-1/2 h-px bg-black/20"></div>
            </div>
  
            <div class="font-mono text-base md:text-xl font-bold tracking-wider flex items-center gap-2 flex-wrap">
              <template v-if="reveal">
                <span>{{ displayNumber }}</span>
              </template>
              <template v-else>
                <span>{{ masked }}</span>
              </template>
  
              <button
                v-if="interactive"
                @click.stop="$emit('toggle-reveal')"
                class="ml-1 p-1 rounded-md transition-colors"
                :class="tier === 'black' ? 'hover:bg-white/10' : 'hover:bg-black/10'"
                :title="reveal ? 'Hide number' : 'Reveal number'"
              >
                <i :class="reveal ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-sm opacity-70"></i>
              </button>
            </div>
          </div>
  
          <!-- Bottom row -->
          <div class="relative z-10 flex items-end justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">Card Holder</p>
              <p class="font-semibold text-xs md:text-sm uppercase truncate">{{ cardholderName }}</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">Expires</p>
                <p class="font-mono font-semibold text-xs md:text-sm">{{ expiryDisplay }}</p>
              </div>
              <div v-if="interactive" class="text-right">
                <p class="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">CVV</p>
                <p class="font-mono font-semibold text-xs md:text-sm cursor-pointer"
                   @click.stop="$emit('flip')">
                  {{ flipped ? cvv : '•••' }}
                </p>
              </div>
            </div>
          </div>
  
          <!-- Status badge (frozen) -->
          <div
            v-if="status === 'frozen'"
            class="absolute inset-0 rounded-2xl bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <div class="text-center">
              <i class="bi bi-snow text-3xl text-white/80 block mb-1"></i>
              <p class="text-xs text-white/80 uppercase tracking-wider font-bold">Frozen</p>
            </div>
          </div>
  
          <div
            v-else-if="status === 'cancelled'"
            class="absolute inset-0 rounded-2xl bg-black/70 backdrop-blur-sm flex items-center justify-center"
          >
            <div class="text-center">
              <i class="bi bi-x-octagon text-3xl text-red-400 block mb-1"></i>
              <p class="text-xs text-red-300 uppercase tracking-wider font-bold">Cancelled</p>
            </div>
          </div>
  
          <div
            v-else-if="status === 'expired'"
            class="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <div class="text-center">
              <i class="bi bi-clock-history text-3xl text-amber-400 block mb-1"></i>
              <p class="text-xs text-amber-300 uppercase tracking-wider font-bold">Expired</p>
            </div>
          </div>
        </div>
  
        <!-- BACK (for flip-to-see-CVV) -->
        <div
          class="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          :style="{
            background: tierMeta.gradient,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }"
        >
          <div class="pt-5">
            <div class="h-10 bg-black/80"></div>
            <div class="p-5 md:p-6">
              <div class="flex items-center justify-between gap-3 mb-4">
                <div class="flex-1 h-8 rounded bg-white/90 flex items-center justify-end pr-3">
                  <span class="text-[10px] text-neutral-500 italic mr-2">authorized signature</span>
                </div>
                <div
                  class="min-w-[70px] h-8 rounded flex items-center justify-center font-mono font-bold text-neutral-900"
                  :class="tier === 'gold' ? 'bg-white' : 'bg-amber-300'"
                >
                  {{ cvv }}
                </div>
              </div>
              <p class="text-[10px] leading-relaxed" :style="{ color: tierMeta.textColor, opacity: 0.6 }">
                This is a virtual card for display purposes only. It cannot be used to make purchases.
                Keep card details private.
              </p>
              <button
                v-if="interactive"
                @click.stop="$emit('flip')"
                class="mt-3 text-[10px] uppercase tracking-wider font-bold opacity-70 hover:opacity-100 transition-opacity"
                :style="{ color: tierMeta.textColor }"
              >
                <i class="bi bi-arrow-counterclockwise mr-1"></i> Back to front
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { CARD_TIERS } from '~/composables/constants'
  
  const props = defineProps({
    card:           { type: Object, required: true },
    // interactive → shows reveal toggle + flip + CVV clickable
    interactive:    { type: Boolean, default: true },
    // reveal / flipped are controlled by the parent so the parent can choose policy
    reveal:         { type: Boolean, default: false },
    flipped:        { type: Boolean, default: false },
    size:           { type: String, default: 'md' }, // 'sm' | 'md' | 'lg'
  })
  
  defineEmits(['toggle-reveal', 'flip'])
  
  const tier = computed(() => props.card?.tier || 'gold')
  const tierMeta = computed(() =>
    CARD_TIERS.find((t) => t.value === tier.value) || CARD_TIERS[0]
  )
  
  const displayNumber = computed(() => {
    const n = props.card?.fullNumber
    if (!n) return props.card?.cardNumber || '•••• •••• •••• ••••'
    // insert spaces every 4 digits
    return String(n).replace(/(.{4})/g, '$1 ').trim()
  })
  
  const masked = computed(() =>
    props.card?.cardNumber || `•••• •••• •••• ${props.card?.last4 || '••••'}`
  )
  
  const cvv = computed(() => props.card?.cvv || '•••')
  
  const expiryDisplay = computed(() => {
    if (props.card?.expiryDisplay) return props.card.expiryDisplay
    const m = String(props.card?.expiryMonth || 1).padStart(2, '0')
    const y = String(props.card?.expiryYear || '').slice(-2)
    return `${m}/${y}`
  })
  
  const cardholderName = computed(() =>
    props.card?.cardholderName || 'CARD HOLDER'
  )
  
  const status = computed(() => props.card?.status || 'active')
  </script>
  
  <style scoped>
  .virtual-card-wrap :deep(.backface-hidden) {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  </style>