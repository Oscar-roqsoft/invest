<template>
  <DashboardLayout>
    <!-- Page Header -->
    <div class="mb-6 md:mb-8 mt-[70px]">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-gold-500/10 dark:bg-amber-500/[0.08]">
          <i class="bi bi-arrow-down-circle text-amber-500 text-lg"></i>
        </div>
        <div>
          <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Deposit Funds</h1>
          <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">Add funds to your account securely</p>
        </div>
      </div>
    </div>

    <!-- Global error -->
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="store.state.error"
        class="mb-4 flex items-start gap-3 p-4 rounded-2xl
               bg-red-50 border border-red-200
               dark:bg-red-500/[0.08] dark:border-red-500/[0.15]"
      >
        <i class="bi bi-exclamation-circle-fill text-red-500 text-lg mt-0.5"></i>
        <p class="flex-1 text-sm text-red-700 dark:text-red-400">{{ store.state.error }}</p>
        <button @click="store.clearError()" class="text-red-500 hover:text-red-700">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </Transition>

    <!-- Step Progress -->
    <div class="rounded-2xl p-5 md:p-6 mb-6
                bg-white border border-gray-100 shadow-sm
                dark:bg-[#101A47] dark:border-white/[0.05]">
      <div class="flex items-center justify-between">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex items-center flex-1"
          :class="{ 'flex-none': index === steps.length - 1 }"
        >
          <div class="flex flex-col items-center gap-2">
            <div
              class="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 relative"
              :class="[
                currentStep > step.id
                  ? 'bg-emerald-500 text-white'
                  : currentStep === step.id
                    ? 'text-primary-900 shadow-lg shadow-amber-500/30'
                    : 'bg-gray-100 dark:bg-white/[0.06] text-gray-400 dark:text-white/30'
              ]"
              :style="currentStep === step.id ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%);' : ''"
            >
              <i v-if="currentStep > step.id" class="bi bi-check-lg text-lg"></i>
              <i v-else :class="step.icon" class="text-lg"></i>
            </div>
            <span
              class="text-xs md:text-sm font-medium whitespace-nowrap"
              :class="currentStep >= step.id
                ? 'text-gray-800 dark:text-white'
                : 'text-gray-400 dark:text-white/30'"
            >
              {{ step.name }}
            </span>
          </div>

          <div
            v-if="index < steps.length - 1"
            class="flex-1 h-0.5 mx-2 md:mx-4 rounded-full transition-all duration-500"
            :class="currentStep > step.id
              ? 'bg-emerald-500'
              : 'bg-gray-200 dark:bg-white/[0.06]'"
          ></div>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-200 absolute"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-4"
      mode="out-in"
    >
      <!-- ═══════════════════════════════════════════════════════
           STEP 1: Select Cryptocurrency
           ═══════════════════════════════════════════════════════ -->
      <div
        v-if="currentStep === 1"
        key="step1"
        class="rounded-2xl p-5 md:p-8
               bg-white border border-gray-100 shadow-sm
               dark:bg-[#101A47] dark:border-white/[0.05]"
      >
        <h3 class="font-bold text-xl text-gray-800 dark:text-white mb-2">Select Cryptocurrency</h3>
        <p class="text-sm text-gray-500 dark:text-white/40 mb-6">Choose which cryptocurrency you want to deposit</p>

        <!-- Search -->
        <div class="relative mb-6">
          <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search cryptocurrency..."
            class="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
                   bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
          >
        </div>

        <!-- ░░ LOADING SKELETON ░░ -->
        <div
          v-if="store.state.isLoadingAddresses && !store.state.systemWalletsLoaded"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        >
          <div
            v-for="i in 6"
            :key="i"
            class="flex items-center gap-4 p-4 rounded-2xl border-2
                   border-gray-100 dark:border-white/[0.06]
                   bg-white dark:bg-white/[0.02] animate-pulse"
          >
            <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/[0.06]"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-white/[0.06] rounded w-2/3"></div>
              <div class="h-3 bg-gray-100 dark:bg-white/[0.04] rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- ░░ CRYPTO GRID ░░ -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        >
          <button
            v-for="crypto in filteredCryptos"
            :key="crypto._id || `${crypto.currency}-${crypto.network}`"
            @click="selectCrypto(crypto)"
            class="group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left"
            :class="isSelected(crypto)
              ? 'border-gold-500 bg-gold-500/[0.06] dark:border-amber-500 dark:bg-amber-500/[0.08] shadow-lg shadow-amber-500/10'
              : 'border-gray-100 dark:border-white/[0.06] hover:border-gold-300 dark:hover:border-blue-500/30 bg-white dark:bg-white/[0.02] hover:shadow-lg'"
          >
            <!-- Crypto Icon -->
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              :style="{ background: crypto.color || '#F7931A' }"
            >
              <span class="text-2xl text-white" v-html="crypto.emoji || '₿'"></span>
            </div>

            <!-- Crypto Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-800 dark:text-white">{{ crypto.currency }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-white/40">
                  {{ crypto.network }}
                </span>
              </div>
              <p class="text-sm text-gray-500 dark:text-white/40 truncate">{{ crypto.name }}</p>
            </div>

            <!-- Selected Check -->
            <div
              v-if="isSelected(crypto)"
              class="w-6 h-6 rounded-full bg-gold-500 dark:bg-amber-500 flex items-center justify-center flex-shrink-0"
            >
              <i class="bi bi-check-lg text-white text-sm"></i>
            </div>
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-if="!store.state.isLoadingAddresses && filteredCryptos.length === 0"
          class="text-center py-12"
        >
          <i class="bi bi-search text-5xl text-gray-300 dark:text-white/20"></i>
          <p class="text-gray-500 dark:text-white/40 mt-4">No cryptocurrencies found</p>
        </div>

        <!-- Continue -->
        <div class="flex justify-end mt-8 pt-6 border-t border-gray-100 dark:border-white/[0.06]">
          <button
            @click="nextStep"
            :disabled="!selectedCrypto"
            class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
          >
            Continue <i class="bi bi-arrow-right ml-1"></i>
          </button>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           STEP 2: Enter Amount
           ═══════════════════════════════════════════════════════ -->
      <div
        v-else-if="currentStep === 2"
        key="step2"
        class="rounded-2xl p-5 md:p-8
               bg-white border border-gray-100 shadow-sm
               dark:bg-[#101A47] dark:border-white/[0.05]"
      >
        <div class="flex items-center gap-3 mb-6">
          <button
            @click="prevStep"
            class="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors"
          >
            <i class="bi bi-arrow-left text-gray-600 dark:text-white/60"></i>
          </button>
          <div>
            <h3 class="font-bold text-xl text-gray-800 dark:text-white">Enter Amount</h3>
            <p class="text-xs text-gray-500 dark:text-white/40">Choose your deposit amount</p>
          </div>
        </div>

        <!-- Selected Crypto Summary -->
        <div class="flex items-center gap-4 p-4 rounded-2xl mb-6
                    bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            :style="{ background: selectedCrypto?.color || '#F7931A' }"
          >
            <span class="text-2xl text-white" v-html="selectedCrypto?.emoji || '₿'"></span>
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500 dark:text-white/40">Selected cryptocurrency</p>
            <p class="font-bold text-gray-800 dark:text-white">
              {{ selectedCrypto?.name }} ({{ selectedCrypto?.currency }})
            </p>
            <p class="text-xs text-gray-500 dark:text-white/40">{{ selectedCrypto?.network }}</p>
          </div>
          <button
            @click="currentStep = 1"
            class="text-amber-500 hover:text-amber-600 text-sm font-semibold"
          >
            Change
          </button>
        </div>

        <!-- Amount Input -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-3">
            Amount (USD)
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 font-semibold">$</span>
            <input
              v-model.number="amount"
              type="number"
              placeholder="0.00"
              :min="minUSD"
              class="w-full pl-9 pr-20 py-4 rounded-xl text-lg font-bold outline-none transition-all duration-200
                     bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-300 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/20 dark:focus:border-blue-500/40"
            >
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/40 text-sm font-semibold">
              USD
            </span>
          </div>

          <!-- Quick amounts -->
          <div class="grid grid-cols-4 gap-2 mt-3">
            <button
              v-for="quick in quickAmounts"
              :key="quick"
              @click="amount = quick"
              class="py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                     bg-gray-50 hover:bg-gold-500/10 border border-gray-100 hover:border-gold-300 text-gray-600 hover:text-gold-600
                     dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-white/60 dark:hover:text-amber-400 dark:hover:border-amber-500/30"
            >
              ${{ quick.toLocaleString() }}
            </button>
          </div>

          <p v-if="amount && amount < minUSD" class="text-xs text-red-500 mt-2">
            <i class="bi bi-exclamation-circle mr-1"></i>
            Minimum deposit for {{ selectedCrypto?.currency }} is ${{ minUSD.toFixed(2) }}
          </p>
        </div>

        <!-- Info note -->
        <div class="flex items-start gap-3 p-4 rounded-xl mb-6
                    bg-blue-50 dark:bg-blue-500/[0.06] border border-blue-200 dark:border-blue-500/[0.15]">
          <i class="bi bi-info-circle-fill text-blue-500 mt-0.5"></i>
          <p class="text-xs text-blue-700 dark:text-blue-300">
            The exact amount in {{ selectedCrypto?.currency }} will be calculated using the live market rate when you continue.
          </p>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-100 dark:border-white/[0.06]">
          <button
            @click="prevStep"
            class="px-6 py-3 rounded-xl font-semibold text-sm text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all duration-200"
          >
            <i class="bi bi-arrow-left mr-1"></i> Back
          </button>
          <button
            @click="nextStep"
            :disabled="!canContinueStep2 || store.state.isSubmitting"
            class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]
                   inline-flex items-center gap-2"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
          >
            <span
              v-if="store.state.isSubmitting"
              class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
            ></span>
            {{ store.state.isSubmitting ? 'Creating...' : 'Continue' }}
            <i v-if="!store.state.isSubmitting" class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           STEP 3: Payment
           ═══════════════════════════════════════════════════════ -->
      <div
        v-else-if="currentStep === 3"
        key="step3"
        class="rounded-2xl p-5 md:p-8
               bg-white border border-gray-100 shadow-sm
               dark:bg-[#101A47] dark:border-white/[0.05]"
      >
        <div class="flex items-center gap-3 mb-6">
          <button
            @click="prevStep"
            class="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors"
          >
            <i class="bi bi-arrow-left text-gray-600 dark:text-white/60"></i>
          </button>
          <div>
            <h3 class="font-bold text-xl text-gray-800 dark:text-white">Complete Payment</h3>
            <p class="text-xs text-gray-500 dark:text-white/40">
              Send {{ deposit?.amountCrypto }} {{ deposit?.currency }} to the address below
            </p>
          </div>
        </div>

        <!-- ░░ LOADING: creating deposit ░░ -->
        <div
          v-if="!deposit"
          class="flex flex-col items-center justify-center py-16 gap-4"
        >
          <div class="w-14 h-14 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
          <p class="text-sm text-gray-500 dark:text-white/40">Preparing your deposit address...</p>
        </div>

        <!-- ░░ DEPOSIT READY ░░ -->
        <template v-else>
          <!-- Warning -->
          <div class="flex items-start gap-3 p-4 rounded-2xl mb-6
                      bg-amber-500/[0.06] border border-amber-500/[0.15]">
            <i class="bi bi-exclamation-triangle-fill text-amber-500 text-lg flex-shrink-0 mt-0.5"></i>
            <div class="text-sm">
              <p class="font-bold text-amber-500 mb-1">Important</p>
              <p class="text-gray-700 dark:text-white/70">
                Send only <strong>{{ deposit.currency }}</strong> via the <strong>{{ deposit.network }}</strong> network.
                Sending any other currency or network may result in permanent loss of funds.
              </p>
            </div>
          </div>

          <!-- QR + Address -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- QR -->
            <div class="flex flex-col items-center justify-center p-6 rounded-2xl
                        bg-white border-2 border-dashed border-gray-200
                        dark:bg-white/[0.03] dark:border-white/[0.08]">
              <div class="w-48 h-48 rounded-xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-4 p-3">
                <img
                  v-if="qrDataUrl"
                  :src="qrDataUrl"
                  alt="Deposit address QR"
                  class="w-full h-full object-contain rounded-lg"
                >
                <div v-else class="animate-pulse w-full h-full bg-gray-200 dark:bg-white/[0.06] rounded-lg"></div>
              </div>
              <p class="text-xs text-gray-500 dark:text-white/40 text-center">Scan with your wallet app</p>
            </div>

            <!-- Address & Amount -->
            <div class="flex flex-col justify-between">
              <div class="mb-4">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
                  Wallet Address
                </label>
                <div class="flex items-center gap-2 p-3 rounded-xl
                            bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
                  <code class="flex-1 text-xs md:text-sm font-mono text-gray-700 dark:text-white/80 truncate">
                    {{ deposit.address }}
                  </code>
                  <button
                    @click="copyAddress"
                    class="px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200"
                    :class="copied
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-gold-500/10 text-gold-600 hover:bg-gold-500/20 dark:bg-amber-500/[0.1] dark:text-amber-400 dark:hover:bg-amber-500/[0.2]'"
                  >
                    <i :class="copied ? 'bi bi-check-lg' : 'bi bi-copy'"></i>
                    {{ copied ? 'Copied' : 'Copy' }}
                  </button>
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
                  Amount to Send
                </label>
                <div class="flex items-center gap-2 p-3 rounded-xl
                            bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
                  <span class="flex-1 font-bold text-gray-800 dark:text-white">
                    {{ deposit.amountCrypto }} {{ deposit.currency }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-white/40">
                    ≈ ${{ deposit.amountUSD }} USD
                  </span>
                </div>
              </div>

              <!-- Countdown -->
              <div
                class="p-3 rounded-xl border"
                :class="timeLeft < 300
                  ? 'bg-red-50 dark:bg-red-500/[0.08] border-red-200 dark:border-red-500/[0.15]'
                  : 'bg-blue-50 dark:bg-blue-500/[0.08] border-blue-200 dark:border-blue-500/[0.15]'"
              >
                <div class="flex items-center gap-2 text-sm">
                  <i :class="timeLeft < 300 ? 'bi bi-clock-history text-red-500' : 'bi bi-clock text-blue-500'"></i>
                  <span :class="timeLeft < 300 ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'" class="font-medium">
                    Expires in <span class="font-bold">{{ formatTime(timeLeft) }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Info cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
              <div class="flex items-center gap-2 mb-2">
                <i class="bi bi-lightning-charge-fill text-amber-500"></i>
                <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Speed</span>
              </div>
              <p class="text-sm text-gray-700 dark:text-white/70">10–30 minutes</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
              <div class="flex items-center gap-2 mb-2">
                <i class="bi bi-check-circle-fill text-emerald-500"></i>
                <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Confirmations</span>
              </div>
              <p class="text-sm text-gray-700 dark:text-white/70">{{ deposit.requiredConfirmations }} required</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
              <div class="flex items-center gap-2 mb-2">
                <i class="bi bi-shield-check text-blue-500"></i>
                <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Security</span>
              </div>
              <p class="text-sm text-gray-700 dark:text-white/70">Fully encrypted</p>
            </div>
          </div>

          <!-- TxHash input -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
              Transaction Hash <span class="text-xs font-normal text-gray-400">(optional — paste after sending)</span>
            </label>
            <input
              v-model="txHash"
              type="text"
              placeholder="e.g. 0xabc123..."
              class="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all
                     bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
            >
          </div>

          <!-- Navigation -->
          <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-100 dark:border-white/[0.06]">
            <button
              @click="handleCancel"
              :disabled="store.state.isSubmitting"
              class="px-6 py-3 rounded-xl font-semibold text-sm text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all duration-200 disabled:opacity-50"
            >
              <i class="bi bi-x-circle mr-1"></i> Cancel Deposit
            </button>
            <button
              @click="markAsPaid"
              :disabled="store.state.isSubmitting"
              class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                     hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02]
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     inline-flex items-center gap-2"
              style="background: linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%); background-size: 200% auto; color: white;"
            >
              <span
                v-if="store.state.isSubmitting"
                class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"
              ></span>
              {{ store.state.isSubmitting ? 'Submitting...' : "I've Sent the Payment" }}
              <i v-if="!store.state.isSubmitting" class="bi bi-check-circle"></i>
            </button>
          </div>
        </template>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           STEP 4: Success
           ═══════════════════════════════════════════════════════ -->
      <div
        v-else-if="currentStep === 4"
        key="step4"
        class="rounded-2xl p-8 md:p-12 text-center
               bg-white border border-gray-100 shadow-sm
               dark:bg-[#101A47] dark:border-white/[0.05]"
      >
        <div class="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center
                    bg-emerald-500/10 dark:bg-emerald-500/[0.15] relative">
          <div class="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
          <i class="bi bi-check-circle-fill text-emerald-500 text-5xl relative"></i>
        </div>

        <h3 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white mb-3">
          Payment Submitted!
        </h3>
        <p class="text-gray-500 dark:text-white/40 max-w-md mx-auto mb-8">
          Your deposit of <strong class="text-amber-500">${{ deposit?.amountUSD }} USD</strong>
          ({{ deposit?.amountCrypto }} {{ deposit?.currency }}) is being processed.
          You'll receive a confirmation once the network confirms the transaction.
        </p>

        <!-- Summary -->
        <div class="max-w-md mx-auto p-5 rounded-2xl mb-8 text-left
                    bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-white/40">Reference</span>
              <span class="font-mono font-semibold text-gray-800 dark:text-white text-xs">{{ deposit?.reference }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-white/40">Cryptocurrency</span>
              <span class="font-semibold text-gray-800 dark:text-white">{{ deposit?.currency }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-white/40">Network</span>
              <span class="font-semibold text-gray-800 dark:text-white">{{ deposit?.network }}</span>
            </div>
            <div class="flex justify-between text-sm pt-3 border-t border-gray-200 dark:border-white/[0.06]">
              <span class="text-gray-500 dark:text-white/40">Amount</span>
              <span class="font-bold text-lg text-amber-500">${{ deposit?.amountUSD }} USD</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-white/40">Status</span>
              <DepositStatusBadge :status="deposit?.status" />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink
            to="/transactions"
            class="px-6 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-white/80
                   bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]
                   transition-all duration-200 inline-flex items-center justify-center"
          >
            <i class="bi bi-clock-history mr-1"></i> View Transactions
          </NuxtLink>
          <button
            @click="resetDeposit"
            class="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
          >
            <i class="bi bi-plus-circle mr-1"></i> Make Another Deposit
          </button>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════════════════
         Recent Deposits History
         ═══════════════════════════════════════════════════════ -->
    <div
      v-if="currentStep === 1"
      class="mt-6 rounded-2xl overflow-hidden
             bg-white border border-gray-100 shadow-sm
             dark:bg-[#101A47] dark:border-white/[0.05]"
    >
      <div class="flex items-center justify-between p-5 md:p-6">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                      bg-gold-500/10 dark:bg-blue-500/[0.08]">
            <i class="bi bi-clock-history text-blue-400 text-lg"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-gray-800 dark:text-white">Recent Deposits</h3>
            <p class="text-xs text-gray-400 dark:text-white/40">Your last deposit transactions</p>
          </div>
        </div>
        <NuxtLink
          to="/transactions"
          class="text-xs md:text-sm font-semibold text-amber-500 hover:text-amber-600"
        >
          View all <i class="bi bi-arrow-right"></i>
        </NuxtLink>
      </div>

      <!-- ░░ SKELETON ░░ -->
      <div v-if="store.state.isLoading && !store.hasDeposits" class="px-5 md:px-6 pb-6 space-y-3">
        <div
          v-for="i in 4"
          :key="i"
          class="flex items-center gap-3 p-3 rounded-xl animate-pulse
                 bg-gray-50 dark:bg-white/[0.02]"
        >
          <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/[0.06]"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-gray-200 dark:bg-white/[0.06] rounded w-1/3"></div>
            <div class="h-2 bg-gray-100 dark:bg-white/[0.04] rounded w-1/4"></div>
          </div>
          <div class="h-6 w-20 bg-gray-200 dark:bg-white/[0.06] rounded-full"></div>
        </div>
      </div>

      <!-- ░░ EMPTY ░░ -->
      <div
        v-else-if="!store.state.isLoading && !store.hasDeposits"
        class="px-5 md:px-6 pb-10 pt-2 text-center"
      >
        <i class="bi bi-inbox text-4xl text-gray-300 dark:text-white/20"></i>
        <p class="text-sm text-gray-500 dark:text-white/40 mt-2">No deposits yet</p>
      </div>

      <!-- ░░ TABLE ░░ -->
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[600px]">
          <thead class="border-b border-gray-200 dark:border-white/[0.06]">
            <tr>
              <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/30">Crypto</th>
              <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/30">Amount</th>
              <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/30">Status</th>
              <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/30">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="d in recentDeposits"
              :key="d._id"
              class="transition-colors duration-200 border-b
                     border-gray-100 hover:bg-gray-50
                     dark:border-white/[0.03] dark:hover:bg-white/[0.03]"
            >
              <td class="py-4 px-5 md:px-6">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    :style="{ background: findMeta(d.currency)?.color || '#F7931A' }"
                  >
                    <span class="text-xl text-white" v-html="findMeta(d.currency)?.emoji || '₿'"></span>
                  </div>
                  <div>
                    <span class="text-sm font-semibold block text-gray-800 dark:text-white/90">{{ d.currency }}</span>
                    <span class="text-xs text-gray-400 dark:text-white/30">{{ d.network }}</span>
                  </div>
                </div>
              </td>
              <td class="py-4 px-5 md:px-6 text-sm font-bold text-gray-800 dark:text-white">
                ${{ formatAmount(d.amountUSD) }}
              </td>
              <td class="py-4 px-5 md:px-6">
                <DepositStatusBadge :status="d.status" />
              </td>
              <td class="py-4 px-5 md:px-6 text-sm text-gray-500 dark:text-white/30">
                {{ formatDate(d.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useDepositStore } from '~/stores/deposit'
import { useWalletStore } from '~/stores/wallet' 
import { DEPOSIT_RULES } from '~/composables/constants'

definePageMeta({ layout: 'dashboard' })

// ─────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────
const store = useDepositStore()
const walletsStore = useWalletStore()  

// ─────────────────────────────────────────────────────────────
// LOCAL STATE
// ─────────────────────────────────────────────────────────────
const currentStep = ref(1)
const searchQuery = ref('')
const selectedCrypto = ref(null)
const amount = ref(null)
const txHash = ref('')
const copied = ref(false)
const timeLeft = ref(DEPOSIT_RULES.EXPIRY_SECONDS)
const qrDataUrl = ref('')
let timerInterval = null

const steps = [
  { id: 1, name: 'Select Crypto', icon: 'bi bi-currency-bitcoin' },
  { id: 2, name: 'Amount',        icon: 'bi bi-cash-coin' },
  { id: 3, name: 'Payment',       icon: 'bi bi-credit-card' },
  { id: 4, name: 'Confirm',       icon: 'bi bi-check-circle' },
]

// ─────────────────────────────────────────────────────────────
// COMPUTED
// ─────────────────────────────────────────────────────────────

// ✅ NOW reads from systemWallets (new endpoint) instead of addresses
const availableCryptos = computed(() => walletsStore.state.systemWallets || [])

const filteredCryptos = computed(() => {
  const list = availableCryptos.value || []           // ← guard
  if (!searchQuery.value) return list
  const q = searchQuery.value.toLowerCase()
  return list.filter((c) =>                              // list is now guaranteed array
    (c.name || '').toLowerCase().includes(q) ||
    (c.currency || '').toLowerCase().includes(q) ||
    (c.network || '').toLowerCase().includes(q)
  )
})

const minUSD = computed(() =>
  Math.max(DEPOSIT_RULES.MIN_USD, selectedCrypto.value?.minDeposit || 0)
)

const quickAmounts = computed(() => {
  const base = minUSD.value
  if (base <= 100) return [100, 500, 1000, 5000]
  if (base <= 500) return [500, 1000, 2500, 5000]
  return [base, base * 2, base * 5, base * 10].map((n) => Math.ceil(n))
})

const canContinueStep2 = computed(
  () => amount.value && amount.value >= minUSD.value
)

const deposit = computed(() => store.state.current)

const recentDeposits = computed(() => store.state.deposits.slice(0, 5))

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const isSelected = (crypto) =>
  selectedCrypto.value?._id === crypto._id

// ✅ Uses systemWallets list for meta lookup (recent deposits table)
const findMeta = (currency) =>
walletsStore.state.systemWallets.find((a) => a.currency === currency)

const formatAmount = (n) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ─────────────────────────────────────────────────────────────
// STEPS
// ─────────────────────────────────────────────────────────────
const selectCrypto = (crypto) => {
  selectedCrypto.value = crypto
}

const nextStep = async () => {
  if (currentStep.value === 1) {
    if (!selectedCrypto.value) return
    currentStep.value = 2
    return
  }

  if (currentStep.value === 2) {
    if (!canContinueStep2.value) return
    const res = await store.createDeposit({
      currency: selectedCrypto.value.currency,
      network: selectedCrypto.value.network,
      amountUSD: amount.value,
    })

    if (!res.success) return

    currentStep.value = 3
    timeLeft.value = res.expiresIn || DEPOSIT_RULES.EXPIRY_SECONDS
    startTimer()
    await nextTick()
    await generateQR()
    return
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    if (currentStep.value < 3) stopTimer()
  }
}

// ─────────────────────────────────────────────────────────────
// QR
// ─────────────────────────────────────────────────────────────
const generateQR = async () => {
  qrDataUrl.value = ''
  if (!deposit.value?.address) return
  const data = encodeURIComponent(deposit.value.address)
  qrDataUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${data}`
}

// ─────────────────────────────────────────────────────────────
// COPY
// ─────────────────────────────────────────────────────────────
const copyAddress = async () => {
  if (!deposit.value?.address) return
  try {
    await navigator.clipboard.writeText(deposit.value.address)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    const el = document.createElement('textarea')
    el.value = deposit.value.address
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  }
}

// ─────────────────────────────────────────────────────────────
// SUBMIT TX HASH + SUCCESS
// ─────────────────────────────────────────────────────────────
const markAsPaid = async () => {
  if (!deposit.value?._id) return
  if (txHash.value?.trim()) {
    const res = await store.submitTxHash(deposit.value._id, txHash.value.trim())
    if (!res.success) return
  }
  stopTimer()
  currentStep.value = 4
  store.fetchMyDeposits({ page: 1 })
}

const handleCancel = async () => {
  if (!deposit.value?._id) return
  const res = await store.cancelDeposit(deposit.value._id)
  if (res.success) {
    stopTimer()
    store.clearCurrent()
    currentStep.value = 1
  }
}

const resetDeposit = () => {
  stopTimer()
  store.clearCurrent()
  currentStep.value = 1
  selectedCrypto.value = null
  amount.value = null
  txHash.value = ''
  searchQuery.value = ''
  timeLeft.value = DEPOSIT_RULES.EXPIRY_SECONDS
  qrDataUrl.value = ''
}

// ─────────────────────────────────────────────────────────────
// TIMER
// ─────────────────────────────────────────────────────────────
const startTimer = () => {
  stopTimer()
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      stopTimer()
      if (deposit.value?._id) store.fetchDeposit(deposit.value._id)
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// ─────────────────────────────────────────────────────────────
// WATCHERS
// ─────────────────────────────────────────────────────────────
watch(
  () => store.state.current?.status,
  (s) => {
    if (s && ['completed', 'failed', 'expired'].includes(s)) {
      stopTimer()
    }
  }
)

// ─────────────────────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────────────────────

// ✅ Now fetches systemWallets instead of addresses
onMounted(async () => {
  if (!walletsStore.state.systemWalletsLoaded) {
    await walletsStore.fetchSystemWallets()
  }
  store.fetchMyDeposits({ page: 1, limit: 5 })
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
@keyframes pulse-ring {
  0%   { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}
.animate-ping {
  animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>