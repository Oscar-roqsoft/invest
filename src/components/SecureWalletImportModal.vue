<template>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="open"
          class="fixed inset-0 z-[700] flex items-end sm:items-center justify-center p-0 sm:p-4
                 bg-black/70 backdrop-blur-sm"
          @click.self="close"
        >
          <Transition
            appear
            enter-active-class="transition duration-300"
            enter-from-class="opacity-0 translate-y-8 sm:scale-95 sm:translate-y-4"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100 sm:translate-y-0"
          >
            <div
              class="w-full sm:max-w-2xl max-h-[95vh] overflow-hidden flex flex-col
                     rounded-t-3xl sm:rounded-3xl shadow-2xl
                     bg-white dark:bg-[#101A47]
                     border-t sm:border border-gray-100 dark:border-white/[0.06]"
            >
  
              <!-- ─────── HEADER ─────── -->
              <div class="p-5 md:p-6 border-b border-gray-100 dark:border-white/[0.06]
                          flex items-start gap-4 flex-shrink-0">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0
                            bg-gray-100 dark:bg-white/[0.06] overflow-hidden">
                  <img
                    v-if="brand?.icon && !iconBroken"
                    :src="brand.icon"
                    :alt="brand.name"
                    class="w-9 h-9 object-contain"
                    @error="iconBroken = true"
                  >
                  <span v-else class="font-bold text-gray-600 dark:text-white/60">
                    {{ initials(brand?.name) }}
                  </span>
                </div>
  
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-xl text-gray-800 dark:text-white">
                    Import {{ brand?.name || 'Wallet' }}
                  </h3>
                  <p class="text-xs text-gray-500 dark:text-white/40">
                    Choose how you want to import your wallet
                  </p>
                </div>
  
                <button
                  @click="close"
                  :disabled="store.state.isSubmitting"
                  class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                         bg-gray-100 dark:bg-white/[0.06]
                         hover:bg-gray-200 dark:hover:bg-white/[0.1]
                         disabled:opacity-50"
                >
                  <i class="bi bi-x-lg text-gray-600 dark:text-white/60 text-sm"></i>
                </button>
              </div>
  
              <!-- ─────── SCROLLABLE BODY ─────── -->
              <div class="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 custom-scrollbar">
  
                <!-- STEP 1: PICK COIN -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider
                                text-gray-500 dark:text-white/40 mb-2">
                    Coin / Network *
                  </label>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      v-for="(c, i) in SECURE_WALLET_COINS"
                      :key="`${c.coin}-${c.network}-${i}`"
                      type="button"
                      @click="pickCoin(c)"
                      :disabled="store.state.isSubmitting"
                      class="flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left
                             disabled:opacity-50 disabled:cursor-not-allowed"
                      :class="isPicked(c)
                        ? 'border-amber-500 bg-amber-500/[0.06] dark:border-amber-500 dark:bg-amber-500/[0.08]'
                        : 'border-gray-100 dark:border-white/[0.06] hover:border-amber-300 dark:hover:border-amber-500/30'"
                    >
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm text-white"
                        :style="{ background: c.color }"
                      >
                        <span v-html="c.emoji"></span>
                      </div>
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-gray-800 dark:text-white truncate">
                          {{ c.coin }}
                        </p>
                        <p class="text-[10px] text-gray-500 dark:text-white/40 truncate">
                          {{ c.network }}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
  
                <!-- STEP 2: IMPORT TYPE -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider
                                text-gray-500 dark:text-white/40 mb-2">
                    Import Method *
                  </label>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="t in IMPORT_TYPES"
                      :key="t.value"
                      type="button"
                      @click="importType = t.value"
                      :disabled="store.state.isSubmitting"
                      class="p-3 rounded-xl border-2 transition-all text-center
                             disabled:opacity-50 disabled:cursor-not-allowed"
                      :class="importType === t.value
                        ? 'border-amber-500 bg-amber-500/[0.06] dark:border-amber-500 dark:bg-amber-500/[0.08]'
                        : 'border-gray-100 dark:border-white/[0.06] hover:border-amber-300 dark:hover:border-amber-500/30'"
                    >
                      <i :class="t.icon" class="text-lg block mb-1 text-amber-500"></i>
                      <p class="text-[11px] font-bold text-gray-800 dark:text-white">
                        {{ t.label }}
                      </p>
                    </button>
                  </div>
                </div>
  
                <!-- STEP 3: SECRET INPUT (type-dependent) -->
                <div>
                  <!-- PHRASE -->
                  <div v-if="importType === 'phrase'">
                    <label class="block text-xs font-bold uppercase tracking-wider
                                  text-gray-500 dark:text-white/40 mb-2">
                      Recovery Phrase *
                    </label>
                    <textarea
                      v-model="phrase"
                      rows="4"
                      placeholder="Enter your 12 or 24-word recovery phrase separated by spaces"
                      :disabled="store.state.isSubmitting"
                      class="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all resize-none
                             bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400
                             focus:border-amber-500/50
                             dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
                             dark:placeholder-white/30 dark:focus:border-amber-500/50
                             disabled:opacity-60"
                    ></textarea>
                    <div class="flex items-center justify-between mt-2">
                      <p class="text-[11px] text-gray-500 dark:text-white/40">
                        <i class="bi bi-info-circle mr-1"></i>
                        Usually 12 or 24 words, separated by spaces
                      </p>
                      <p
                        class="text-[11px] font-bold"
                        :class="phraseWordCount === 12 || phraseWordCount === 24
                          ? 'text-emerald-500'
                          : 'text-gray-400 dark:text-white/30'"
                      >
                        {{ phraseWordCount }} word{{ phraseWordCount === 1 ? '' : 's' }}
                      </p>
                    </div>
                  </div>
  
                  <!-- PRIVATE KEY -->
                  <div v-else-if="importType === 'privateKey'">
                    <label class="block text-xs font-bold uppercase tracking-wider
                                  text-gray-500 dark:text-white/40 mb-2">
                      Private Key *
                    </label>
                    <textarea
                      v-model="privateKey"
                      rows="3"
                      placeholder="Enter your private key (hex string)"
                      :disabled="store.state.isSubmitting"
                      class="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all resize-none
                             bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400
                             focus:border-amber-500/50
                             dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
                             dark:placeholder-white/30 dark:focus:border-amber-500/50
                             disabled:opacity-60"
                    ></textarea>
                    <p class="text-[11px] text-gray-500 dark:text-white/40 mt-2">
                      <i class="bi bi-info-circle mr-1"></i>
                      Minimum 60 characters
                    </p>
                  </div>
  
                  <!-- KEYSTORE -->
                  <div v-else-if="importType === 'keystore'" class="space-y-3">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider
                                    text-gray-500 dark:text-white/40 mb-2">
                        Keystore JSON *
                      </label>
                      <textarea
                        v-model="keystore"
                        rows="5"
                        placeholder='{"version":3,"id":"...","crypto":{...}}'
                        :disabled="store.state.isSubmitting"
                        class="w-full px-4 py-3 rounded-xl text-xs font-mono outline-none transition-all resize-none
                               bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400
                               focus:border-amber-500/50
                               dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
                               dark:placeholder-white/30 dark:focus:border-amber-500/50
                               disabled:opacity-60"
                      ></textarea>
                      <p
                        v-if="keystore && !isValidKeystoreJson"
                        class="text-[11px] text-red-500 mt-1"
                      >
                        <i class="bi bi-exclamation-circle mr-1"></i>
                        Invalid JSON
                      </p>
                    </div>
  
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider
                                    text-gray-500 dark:text-white/40 mb-2">
                        Keystore Password *
                      </label>
                      <div class="relative">
                        <input
                          v-model="keystorePassword"
                          :type="showKeystorePassword ? 'text' : 'password'"
                          placeholder="Password used to encrypt the keystore"
                          :disabled="store.state.isSubmitting"
                          class="w-full px-4 pr-12 py-3 rounded-xl text-sm outline-none transition-all
                                 bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400
                                 focus:border-amber-500/50
                                 dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
                                 dark:placeholder-white/30 dark:focus:border-amber-500/50
                                 disabled:opacity-60"
                        >
                        <button
                          type="button"
                          @click="showKeystorePassword = !showKeystorePassword"
                          class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg
                                 flex items-center justify-center
                                 hover:bg-gray-200 dark:hover:bg-white/[0.06]"
                        >
                          <i
                            :class="showKeystorePassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                            class="text-gray-500 dark:text-white/40 text-sm"
                          ></i>
                        </button>
                      </div>
                      <p class="text-[11px] text-gray-400 dark:text-white/30 mt-2">
                        <i class="bi bi-lock mr-1"></i>
                        Stored hashed — you'll need it if you ever want to recover this wallet
                      </p>
                    </div>
                  </div>
                </div>
  
                <!-- STEP 4: WALLET ADDRESS -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider
                                text-gray-500 dark:text-white/40 mb-2">
                    Public Wallet Address *
                  </label>
                  <div class="relative">
                    <input
                      v-model="address"
                      type="text"
                      :placeholder="`Your ${pickedCoin?.coin || 'wallet'} address`"
                      :disabled="store.state.isSubmitting"
                      class="w-full pl-4 pr-12 py-3 rounded-xl text-sm font-mono outline-none transition-all
                             bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400
                             focus:border-amber-500/50
                             dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
                             dark:placeholder-white/30 dark:focus:border-amber-500/50
                             disabled:opacity-60"
                    >
                    <button
                      v-if="address"
                      type="button"
                      @click="pasteAddress"
                      class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg
                             flex items-center justify-center
                             hover:bg-gray-200 dark:hover:bg-white/[0.06]"
                      title="Paste"
                    >
                      <i class="bi bi-clipboard text-gray-500 dark:text-white/40 text-sm"></i>
                    </button>
                  </div>
                  <p class="text-[11px] text-gray-500 dark:text-white/40 mt-2">
                    <i class="bi bi-info-circle mr-1"></i>
                    The address you receive crypto to
                  </p>
                </div>
  
                <!-- STEP 5: LABEL (optional) -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider
                                text-gray-500 dark:text-white/40 mb-2">
                    Label <span class="text-gray-400 font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    v-model="label"
                    type="text"
                    placeholder='e.g. "Main wallet", "Ledger nano"'
                    maxlength="100"
                    :disabled="store.state.isSubmitting"
                    class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                           bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400
                           focus:border-amber-500/50
                           dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white
                           dark:placeholder-white/30 dark:focus:border-amber-500/50
                           disabled:opacity-60"
                  >
                </div>
  
                <!-- WARNING -->
                <div class="flex items-start gap-3 p-3 rounded-xl
                            bg-amber-500/[0.06] border border-amber-500/[0.15]">
                  <i class="bi bi-shield-fill-exclamation text-amber-500 mt-0.5"></i>
                  <div class="text-xs">
                    <p class="font-bold text-amber-600 dark:text-amber-400 mb-0.5">
                      Your secrets are encrypted before being stored
                    </p>
                    <p class="text-gray-600 dark:text-white/60">
                      They are used only for recovery purposes. Never share them with anyone,
                      including support staff — we will never ask.
                    </p>
                  </div>
                </div>
  
                <!-- ERROR -->
                <p v-if="error" class="text-xs text-red-500">
                  <i class="bi bi-exclamation-circle mr-1"></i>{{ error }}
                </p>
              </div>
  
              <!-- ─────── FOOTER ─────── -->
              <div class="p-4 md:p-5 border-t border-gray-100 dark:border-white/[0.06]
                          bg-gray-50 dark:bg-white/[0.01]
                          flex gap-3 flex-shrink-0">
                <button
                  type="button"
                  @click="close"
                  :disabled="store.state.isSubmitting"
                  class="flex-1 py-3 rounded-xl font-semibold text-sm
                         bg-gray-100 dark:bg-white/[0.06]
                         text-gray-700 dark:text-white/70
                         hover:bg-gray-200 dark:hover:bg-white/[0.1]
                         disabled:opacity-50"
                >Cancel</button>
                <button
                  type="button"
                  @click="submit"
                  :disabled="!canSubmit"
                  class="flex-1 py-3 rounded-xl font-bold text-sm
                         inline-flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all hover:shadow-lg hover:shadow-amber-500/30"
                  style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%); color: #020862;"
                >
                  <span v-if="store.state.isSubmitting"
                        class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
                  {{ store.state.isSubmitting ? 'Importing...' : 'Import Wallet' }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { useSecureWalletStore } from '~/stores/secureWallet'
  import { SECURE_WALLET_COINS } from '~/composables/constants'
  
  const props = defineProps({
    open: { type: Boolean, default: false },
    brand: { type: Object, default: null },
  })
  
  const emit = defineEmits(['close', 'imported'])
  
  const store = useSecureWalletStore()
  
  // ─── State ───
  const iconBroken = ref(false)
  const pickedCoin = ref(null)
  const importType = ref('phrase')
  const phrase = ref('')
  const privateKey = ref('')
  const keystore = ref('')
  const keystorePassword = ref('')
  const showKeystorePassword = ref(false)
  const address = ref('')
  const label = ref('')
  const error = ref('')
  
  // ─── Type catalog ───
  const IMPORT_TYPES = [
    { value: 'phrase',     label: 'Phrase',      icon: 'bi bi-chat-quote' },
    { value: 'privateKey', label: 'Private Key', icon: 'bi bi-key' },
    { value: 'keystore',   label: 'Keystore',    icon: 'bi bi-file-lock' },
  ]
  
  // ─── Reset on open ───
  watch(() => props.open, (v) => {
    if (v) {
      iconBroken.value = false
      pickedCoin.value = null
      importType.value = 'phrase'
      phrase.value = ''
      privateKey.value = ''
      keystore.value = ''
      keystorePassword.value = ''
      showKeystorePassword.value = false
      address.value = ''
      label.value = ''
      error.value = ''
      store.clearError()
    }
  })
  
  // ─── Computed ───
  const initials = (name) => {
    const parts = String(name || '').trim().split(/\s+/)
    if (!parts.length) return '?'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  
  const isPicked = (c) =>
    pickedCoin.value?.coin === c.coin && pickedCoin.value?.network === c.network
  
  const pickCoin = (c) => { pickedCoin.value = c }
  
  const phraseWordCount = computed(() => {
    const v = phrase.value.trim()
    if (!v) return 0
    return v.split(/\s+/).length
  })
  
  const isValidKeystoreJson = computed(() => {
    if (!keystore.value.trim()) return true  // don't error on empty
    try {
      JSON.parse(keystore.value)
      return true
    } catch {
      return false
    }
  })
  
  const canSubmit = computed(() => {
    if (store.state.isSubmitting) return false
    if (!pickedCoin.value) return false
    if (!address.value.trim()) return false
  
    if (importType.value === 'phrase') {
      if (phraseWordCount.value !== 12 && phraseWordCount.value !== 24) return false
    } else if (importType.value === 'privateKey') {
      if (privateKey.value.trim().length < 60) return false
    } else if (importType.value === 'keystore') {
      if (!keystore.value.trim()) return false
      if (!isValidKeystoreJson.value) return false
      if (!keystorePassword.value.trim()) return false
    }
    return true
  })
  
  // ─── Actions ───
  const pasteAddress = async () => {
    try {
      address.value = (await navigator.clipboard.readText()).trim()
    } catch { /* clipboard not available */ }
  }
  
  const submit = async () => {
    error.value = ''
    if (!canSubmit.value) return
  
    const base = {
      type: importType.value,
      coin: pickedCoin.value.coin,
      name: pickedCoin.value.name,
      symbol: pickedCoin.value.symbol,
      network: pickedCoin.value.network,
      icon: pickedCoin.value.icon || '',
      address: address.value.trim(),
      label: label.value.trim() || undefined,
    }
  
    if (importType.value === 'phrase') {
      base.phrase = phrase.value.trim()
    } else if (importType.value === 'privateKey') {
      base.privateKey = privateKey.value.trim()
    } else if (importType.value === 'keystore') {
      base.keystore = keystore.value.trim()
      base.password = keystorePassword.value
    }
  
    const res = await store.importWallet(base)
  
    if (res.success) {
      emit('imported', res.wallet)
      close()
    } else {
      error.value = res.message || 'Import failed'
    }
  }
  
  const close = () => {
    if (store.state.isSubmitting) return
    emit('close')
  }
  </script>
  
  <style scoped>
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(187, 145, 74, 0.3);
    border-radius: 10px;
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(187, 145, 74, 0.3) transparent;
  }
  </style>