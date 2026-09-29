<template>
    <div
      class="virtual-card-wrap relative select-none w-full"
      :class="sizeClass"
    >
      <!-- Flip container -->
      <div
        class="relative transition-transform duration-700 ease-out"
        :style="{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
          aspectRatio: '1.586 / 1',
        }"
      >
        <!-- ═══════════════════════════════════════════════
             FRONT
             ═══════════════════════════════════════════════ -->
        <div
          class="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl
                 flex flex-col justify-between p-5 md:p-6"
          :style="{
            background: tierMeta.gradient,
            backfaceVisibility: 'hidden',
            color: tierMeta.textColor,
          }"
        >
          <!-- Decorative holo pattern -->
          <div
            class="absolute inset-0 opacity-[0.08] pointer-events-none"
            style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 18px 18px;"
          ></div>
  
          <!-- Soft glow blob -->
          <div
            class="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            :style="{
              background: tier === 'gold'
                ? 'rgba(255,255,255,0.35)'
                : 'rgba(245,215,127,0.15)',
            }"
          ></div>
  
          <!-- Top row -->
          <div class="relative z-10 flex items-start justify-between">
            <div class="flex items-center gap-2">
              <i :class="tierMeta.icon" class="text-lg md:text-xl"></i>
              <span class="font-bold text-[11px] md:text-xs uppercase tracking-widest">
                {{ tierMeta.name }}
              </span>
            </div>
  
            <div class="flex items-center gap-2">
              <span
                class="text-[9px] md:text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest"
                :class="tier === 'gold'
                  ? 'bg-black/10 text-neutral-900/80'
                  : 'bg-white/10 text-amber-300/90'"
              >
                VIRTUAL
              </span>
  
              <!-- EMV chip -->
              <div
                class="w-9 h-6 rounded-md relative overflow-hidden"
                :class="tier === 'gold'
                  ? 'bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500'
                  : 'bg-gradient-to-br from-neutral-300 via-neutral-400 to-neutral-600'"
              >
                <div class="absolute inset-y-1 left-1/2 w-px bg-black/25"></div>
                <div class="absolute inset-x-1 top-1/2 h-px bg-black/25"></div>
                <div class="absolute inset-y-2 left-1/2 w-px bg-black/20"></div>
              </div>
            </div>
          </div>
  
          <!-- Middle: number -->
          <div class="relative z-10">
            <div
              class="font-mono text-base md:text-xl lg:text-2xl font-bold tracking-widest
                     flex items-center gap-2 flex-wrap leading-none"
            >
              <span class="tracking-[0.15em]">{{ displayNumber }}</span>
  
              <!-- Eye toggle -->
              <button
                v-if="interactive"
                type="button"
                @click.stop="$emit('toggle-reveal')"
                class="ml-1 p-1.5 rounded-lg transition-all backdrop-blur-sm"
                :class="tier === 'gold'
                  ? 'bg-black/10 hover:bg-black/20'
                  : 'bg-white/10 hover:bg-white/20'"
                :title="reveal ? 'Hide number' : 'Reveal number'"
              >
                <i :class="reveal ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-xs"></i>
              </button>
            </div>
  
            <!-- Chip + small label -->
            <p
              class="text-[9px] uppercase tracking-widest mt-1.5 opacity-60 font-semibold"
            >
              {{ reveal ? 'Full number visible' : 'Tap eye to reveal' }}
            </p>
          </div>
  
          <!-- Bottom row -->
          <div class="relative z-10 flex items-end justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[8px] md:text-[9px] uppercase tracking-widest opacity-60 mb-0.5 font-semibold">
                Card Holder
              </p>
              <p class="font-semibold text-xs md:text-sm uppercase truncate">
                {{ cardholderName }}
              </p>
            </div>
  
            <div class="flex items-center gap-4 flex-shrink-0">
              <div class="text-right">
                <p class="text-[8px] md:text-[9px] uppercase tracking-widest opacity-60 mb-0.5 font-semibold">
                  Expires
                </p>
                <p class="font-mono font-semibold text-xs md:text-sm leading-none">
                  {{ expiryDisplay }}
                </p>
              </div>
  
              <div v-if="interactive" class="text-right">
                <p class="text-[8px] md:text-[9px] uppercase tracking-widest opacity-60 mb-0.5 font-semibold">
                  CVV
                </p>
                <button
                  type="button"
                  @click.stop="$emit('flip')"
                  class="font-mono font-semibold text-xs md:text-sm leading-none transition-opacity hover:opacity-80"
                >
                  {{ flipped && reveal ? cvv : '•••' }}
                </button>
              </div>
            </div>
          </div>
  
          <!-- Status overlays -->
          <div
            v-if="status === 'frozen'"
            class="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <div class="text-center">
              <i class="bi bi-snow text-3xl text-white/90 block mb-1"></i>
              <p class="text-xs text-white/90 uppercase tracking-widest font-bold">Frozen</p>
            </div>
          </div>
  
          <div
            v-else-if="status === 'cancelled'"
            class="absolute inset-0 rounded-2xl bg-black/75 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <div class="text-center">
              <i class="bi bi-x-octagon text-3xl text-red-400 block mb-1"></i>
              <p class="text-xs text-red-300 uppercase tracking-widest font-bold">Cancelled</p>
            </div>
          </div>
  
          <div
            v-else-if="status === 'expired'"
            class="absolute inset-0 rounded-2xl bg-black/65 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <div class="text-center">
              <i class="bi bi-clock-history text-3xl text-amber-400 block mb-1"></i>
              <p class="text-xs text-amber-300 uppercase tracking-widest font-bold">Expired</p>
            </div>
          </div>
        </div>
  
        <!-- ═══════════════════════════════════════════════
             BACK (flip to reveal CVV)
             ═══════════════════════════════════════════════ -->
        <div
          class="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          :style="{
            background: tierMeta.gradient,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            color: tierMeta.textColor,
          }"
        >
          <!-- Magnetic stripe -->
          <div class="h-10 md:h-12 bg-black/85 mt-5 md:mt-6"></div>
  
          <div class="p-5 md:p-6">
            <!-- Signature strip + CVV -->
            <div class="flex items-center gap-3 mb-4">
              <div class="flex-1 h-8 rounded bg-white/95 flex items-center justify-end pr-3">
                <span class="text-[9px] text-neutral-500 italic">authorized signature</span>
              </div>
              <div
                class="min-w-[70px] h-8 rounded flex items-center justify-center
                       font-mono font-bold text-neutral-900 px-3"
                :class="tier === 'gold' ? 'bg-white' : 'bg-amber-300'"
              >
                {{ cvv }}
              </div>
            </div>
  
            <p class="text-[9px] md:text-[10px] leading-relaxed opacity-70 mb-3">
              This card is for <strong>display purposes only</strong> and cannot be used to make
              purchases. Keep your card details private.
            </p>
  
            <button
              v-if="interactive"
              type="button"
              @click.stop="$emit('flip')"
              class="text-[10px] uppercase tracking-widest font-bold opacity-70 hover:opacity-100 transition-opacity inline-flex items-center gap-1"
            >
              <i class="bi bi-arrow-counterclockwise"></i> Back to front
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { CARD_TIERS } from '~/composables/constants'
  
  const props = defineProps({
    card:        { type: Object, required: true },
    interactive: { type: Boolean, default: true },
    reveal:      { type: Boolean, default: false },
    flipped:     { type: Boolean, default: false },
    size:        { type: String, default: 'md' }, // 'sm' | 'md' | 'lg'
  })
  
  defineEmits(['toggle-reveal', 'flip'])
  
  const tier = computed(() => props.card?.tier || 'gold')
  
  const tierMeta = computed(() =>
    CARD_TIERS.find((t) => t.value === tier.value) || CARD_TIERS[0]
  )
  
  const displayNumber = computed(() => {
    const n = props.card?.fullNumber
    if (!props.reveal) {
      return props.card?.cardNumber || `•••• •••• •••• ${props.card?.last4 || '••••'}`
    }
    if (!n) {
      return props.card?.cardNumber || `•••• •••• •••• ${props.card?.last4 || '••••'}`
    }
    return String(n).replace(/(.{4})/g, '$1 ').trim()
  })
  
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
  
  const sizeClass = computed(() => {
    switch (props.size) {
      case 'sm': return 'max-w-[260px]'
      case 'lg': return 'max-w-[420px]'
      default:   return 'max-w-[380px]'
    }
  })
  </script>
  
  <style scoped>
  .virtual-card-wrap {
    perspective: 1400px;
  }
  </style>