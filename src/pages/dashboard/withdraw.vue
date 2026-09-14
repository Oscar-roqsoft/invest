<template>
  <DashboardLayout>
    <!-- ─────── HEADER ─────── -->
    <div class="mb-6 md:mb-8 mt-[70px]">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-red-500/10 dark:bg-red-500/[0.08]">
            <i class="bi bi-arrow-up-circle text-red-500 text-lg"></i>
          </div>
          <div>
            <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Withdraw Funds</h1>
            <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
              Withdraw your funds securely to your crypto wallet
            </p>
          </div>
        </div>
        <NuxtLink
          to="/transactions"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                 dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
        >
          <i class="bi bi-clock-history"></i>
          <span class="hidden sm:inline">View History</span>
        </NuxtLink>
      </div>
    </div>

    <!-- ─────── BALANCE CARD ─────── -->
    <div class="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden
                bg-white border border-gray-100 shadow-xl shadow-gray-200/50
                dark:bg-gradient-to-br dark:from-[#152155] dark:via-[#101A47] dark:to-[#0F1B4C]
                dark:border-white/[0.06] dark:shadow-2xl dark:shadow-blue-900/40">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-red-400/10 rounded-full blur-3xl dark:hidden"></div>
        <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl dark:hidden"></div>
        <div class="hidden dark:block absolute -top-20 -right-20 w-64 h-64 bg-red-500/[0.12] rounded-full blur-3xl"></div>
        <div class="hidden dark:block absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/[0.1] rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10">
        <div class="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center
                          bg-gold-500/10 dark:bg-amber-500/[0.12]">
                <i class="bi bi-wallet2 text-amber-500 text-sm"></i>
              </div>
              <span class="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-white/40">
                Available Balance
              </span>
            </div>

            <div v-if="balanceLoading" class="h-12 w-64 rounded-lg bg-gray-200 dark:bg-white/[0.06] animate-pulse"></div>
            <div v-else class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              ${{ formatMoney(balance) }}
            </div>

            <div class="mt-2 flex items-center gap-4 text-sm">
              <span class="text-gray-500 dark:text-white/40">
                Withdrawable:
                <strong class="text-gray-800 dark:text-white">${{ formatMoney(balance) }}</strong>
              </span>
            </div>
          </div>

          <div class="flex gap-6 md:gap-10">
            <div>
              <div class="text-xs uppercase tracking-wider mb-1 text-gray-500 dark:text-white/40">Pending</div>
              <div class="text-amber-500 font-bold text-xl">${{ formatMoney(pendingTotal) }}</div>
            </div>
            <div>
              <div class="text-xs uppercase tracking-wider mb-1 text-gray-500 dark:text-white/40">Total Withdrawn</div>
              <div class="font-bold text-xl text-gray-800 dark:text-white">${{ formatMoney(totalWithdrawn) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─────── Global error ─────── -->
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

    <!-- ─────── STEP PROGRESS ─────── -->
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
              class="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
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
              :class="currentStep >= step.id ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-white/30'"
            >{{ step.name }}</span>
          </div>

          <div
            v-if="index < steps.length - 1"
            class="flex-1 h-0.5 mx-2 md:mx-4 rounded-full transition-all duration-500"
            :class="currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-white/[0.06]'"
          ></div>
        </div>
      </div>
    </div>

    <!-- ─────── STEPS ─────── -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-200 absolute"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-4"
      mode="out-in"
    >
      <!-- ════════════ STEP 1: Select Crypto ════════════ -->
      <div
        v-if="currentStep === 1"
        key="step1"
        class="rounded-2xl p-5 md:p-8
               bg-white border border-gray-100 shadow-sm
               dark:bg-[#101A47] dark:border-white/[0.05]"
      >
        <h3 class="font-bold text-xl text-gray-800 dark:text-white mb-2">Select Cryptocurrency</h3>
        <p class="text-sm text-gray-500 dark:text-white/40 mb-6">Choose which cryptocurrency you want to withdraw</p>

        <div class="relative mb-6">
          <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search cryptocurrency..."
            class="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all
                   bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
          >
        </div>

        <!-- ░░ SKELETON ░░ -->
        <div v-if="store.state.isLoading && !addressesLoaded" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div
            v-for="i in 6"
            :key="i"
            class="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 dark:border-white/[0.06] animate-pulse"
          >
            <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/[0.06]"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-white/[0.06] rounded w-2/3"></div>
              <div class="h-3 bg-gray-100 dark:bg-white/[0.04] rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- ░░ GRID ░░ -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <button
            v-for="c in filteredCryptos"
            :key="c._id || `${c.currency}-${c.network}`"
            @click="selectCrypto(c)"
            class="group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left"
            :class="selectedAddress?._id === c._id
              ? 'border-gold-500 bg-gold-500/[0.06] dark:border-amber-500 dark:bg-amber-500/[0.08] shadow-lg shadow-amber-500/10'
              : 'border-gray-100 dark:border-white/[0.06] hover:border-gold-300 dark:hover:border-blue-500/30 bg-white dark:bg-white/[0.02] hover:shadow-lg'"
          >
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white"
              :style="{ background: c.color || '#F7931A' }"
            >
              <span class="text-2xl" v-html="c.emoji || '₿'"></span>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-800 dark:text-white">{{ c.currency }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-white/40">
                  {{ c.network }}
                </span>
              </div>
              <p class="text-sm text-gray-500 dark:text-white/40">{{ c.name }}</p>
            </div>

            <div v-if="selectedAddress?._id === c._id" class="w-6 h-6 rounded-full bg-gold-500 dark:bg-amber-500 flex items-center justify-center flex-shrink-0">
              <i class="bi bi-check-lg text-white text-sm"></i>
            </div>
          </button>
        </div>

        <div v-if="!store.state.isLoading && filteredCryptos.length === 0" class="text-center py-12">
          <i class="bi bi-search text-5xl text-gray-300 dark:text-white/20"></i>
          <p class="text-gray-500 dark:text-white/40 mt-4">No cryptocurrencies found</p>
        </div>

        <div class="flex justify-end mt-8 pt-6 border-t border-gray-100 dark:border-white/[0.06]">
          <button
            @click="nextStep"
            :disabled="!selectedAddress"
            class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
          >
            Continue <i class="bi bi-arrow-right ml-1"></i>
          </button>
        </div>
      </div>

      <!-- ════════════ STEP 2: Amount + Address ════════════ -->
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
            class="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]"
          >
            <i class="bi bi-arrow-left text-gray-600 dark:text-white/60"></i>
          </button>
          <div>
            <h3 class="font-bold text-xl text-gray-800 dark:text-white">Withdrawal Details</h3>
            <p class="text-xs text-gray-500 dark:text-white/40">Enter the amount and your wallet address</p>
          </div>
        </div>

        <!-- Selected crypto summary -->
        <div class="flex items-center gap-4 p-4 rounded-2xl mb-6
                    bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white"
            :style="{ background: selectedAddress?.color || '#F7931A' }"
          >
            <span class="text-2xl" v-html="selectedAddress?.emoji || '₿'"></span>
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500 dark:text-white/40">Selected currency</p>
            <p class="font-bold text-gray-800 dark:text-white">
              {{ selectedAddress?.name }} ({{ selectedAddress?.currency }})
            </p>
            <p class="text-xs text-gray-500 dark:text-white/40">{{ selectedAddress?.network }}</p>
          </div>
          <button @click="currentStep = 1" class="text-amber-500 hover:text-amber-600 text-sm font-semibold">Change</button>
        </div>

        <!-- Address -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-3">
            Your {{ selectedAddress?.currency }} Wallet Address
          </label>
          <div class="relative">
            <i class="bi bi-wallet2 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"></i>
            <input
              v-model="address"
              type="text"
              :placeholder="`Enter your ${selectedAddress?.currency} wallet address`"
              class="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm font-mono outline-none transition-all
                     bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
            >
            <button
              v-if="address"
              @click="pasteAddress"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center
                     hover:bg-gray-200 dark:hover:bg-white/[0.06]"
              title="Paste"
            >
              <i class="bi bi-clipboard text-gray-500 dark:text-white/40 text-sm"></i>
            </button>
          </div>

          <!-- Saved wallets -->
          <div v-if="savedWalletsForSelected.length" class="mt-3">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">Saved wallets</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="w in savedWalletsForSelected"
                :key="w._id"
                @click="address = w.address; saveAddress = false"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                       bg-gray-50 border border-gray-100 text-gray-600 hover:border-gold-300 hover:text-gold-600
                       dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-white/60 dark:hover:border-amber-500/30 dark:hover:text-amber-400"
              >
                {{ w.label || shortAddress(w.address) }}
              </button>
            </div>
          </div>

          <label class="flex items-center gap-2 mt-3 cursor-pointer">
            <input v-model="saveAddress" type="checkbox" class="accent-amber-500">
            <span class="text-xs text-gray-600 dark:text-white/50">Save this address for future withdrawals</span>
          </label>

          <p class="text-xs text-gray-400 dark:text-white/30 mt-2">
            <i class="bi bi-info-circle mr-1"></i>
            Double-check your address. Withdrawals cannot be reversed.
          </p>
        </div>

        <!-- Amount -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80">Amount (USD)</label>
            <button @click="withdrawMax" class="text-xs font-bold text-amber-500 hover:text-amber-600">MAX</button>
          </div>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 font-semibold">$</span>
            <input
              v-model.number="amount"
              type="number"
              placeholder="0.00"
              :min="minWithdraw"
              :max="maxWithdrawal"
              class="w-full pl-9 pr-20 py-4 rounded-xl text-lg font-bold outline-none transition-all
                     bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-300 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/20 dark:focus:border-blue-500/40"
            >
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/40 text-sm font-semibold">USD</span>
          </div>

          <div class="grid grid-cols-4 gap-2 mt-3">
            <button
              v-for="q in quickAmounts"
              :key="q"
              @click="amount = q"
              :disabled="q > maxWithdrawal"
              class="py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed
                     bg-gray-50 hover:bg-red-500/10 border border-gray-100 hover:border-red-300 text-gray-600 hover:text-red-600
                     dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-white/60 dark:hover:text-red-400 dark:hover:border-red-500/30"
            >
              ${{ q.toLocaleString() }}
            </button>
          </div>

          <p v-if="amount && amount < minWithdraw" class="text-xs text-red-500 mt-2">
            <i class="bi bi-exclamation-circle mr-1"></i>Minimum withdrawal is ${{ minWithdraw.toFixed(2) }}
          </p>
          <p v-else-if="amount && amount > maxWithdrawal" class="text-xs text-red-500 mt-2">
            <i class="bi bi-exclamation-circle mr-1"></i>Amount exceeds available balance
          </p>
        </div>

        <!-- Fee preview -->
        <div class="p-4 rounded-xl mb-6 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
          <!-- loading -->
          <div v-if="store.state.isPreviewing" class="space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-white/[0.06] rounded w-2/3 animate-pulse"></div>
            <div class="h-4 bg-gray-100 dark:bg-white/[0.04] rounded w-1/2 animate-pulse"></div>
            <div class="h-6 bg-gray-200 dark:bg-white/[0.06] rounded w-1/3 animate-pulse"></div>
          </div>

          <!-- preview -->
          <div v-else-if="preview" class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-white/40">Withdrawal amount</span>
              <span class="font-semibold text-gray-800 dark:text-white">${{ formatMoney(preview.amountUSD) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-white/40">Network fee</span>
              <span class="font-semibold text-red-500">-${{ formatMoney(preview.networkFeeUSD) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-white/40">Processing fee</span>
              <span class="font-semibold text-red-500">-${{ formatMoney(preview.processingFeeUSD) }}</span>
            </div>
            <div class="border-t border-gray-200 dark:border-white/[0.06] pt-2 flex justify-between">
              <span class="font-bold text-gray-800 dark:text-white">You will receive</span>
              <div class="text-right">
                <div class="font-bold text-lg text-amber-500">${{ formatMoney(preview.netAmountUSD) }}</div>
                <div class="text-xs text-gray-500 dark:text-white/40">
                  ≈ {{ preview.netAmountCrypto }} {{ preview.currency }}
                </div>
              </div>
            </div>
          </div>

          <!-- prompt -->
          <p v-else class="text-xs text-gray-500 dark:text-white/40 text-center py-2">
            Enter an amount to see the fee breakdown
          </p>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-100 dark:border-white/[0.06]">
          <button
            @click="prevStep"
            class="px-6 py-3 rounded-xl font-semibold text-sm text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
          >
            <i class="bi bi-arrow-left mr-1"></i> Back
          </button>
          <button
            @click="nextStep"
            :disabled="!isStep2Valid"
            class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
          >
            Review <i class="bi bi-arrow-right ml-1"></i>
          </button>
        </div>
      </div>

      <!-- ════════════ STEP 3: Review ════════════ -->
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
            class="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]"
          >
            <i class="bi bi-arrow-left text-gray-600 dark:text-white/60"></i>
          </button>
          <div>
            <h3 class="font-bold text-xl text-gray-800 dark:text-white">Review Withdrawal</h3>
            <p class="text-xs text-gray-500 dark:text-white/40">Please verify all details before confirming</p>
          </div>
        </div>

        <!-- Warning -->
        <div class="flex items-start gap-3 p-4 rounded-2xl mb-6
                    bg-amber-500/[0.06] border border-amber-500/[0.15]">
          <i class="bi bi-exclamation-triangle-fill text-amber-500 text-lg flex-shrink-0 mt-0.5"></i>
          <div class="text-sm">
            <p class="font-bold text-amber-500 mb-1">Final Confirmation</p>
            <p class="text-gray-700 dark:text-white/70">
              Withdrawals are processed within 24 hours and cannot be reversed once sent to the blockchain.
              You'll be asked for your PIN.
            </p>
          </div>
        </div>

        <!-- Summary -->
        <div class="p-6 rounded-2xl mb-6
                    bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
          <div class="flex flex-col items-center text-center pb-6 border-b border-gray-200 dark:border-white/[0.06] mb-6">
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center mb-3 text-white"
              :style="{ background: selectedAddress?.color || '#F7931A' }"
            >
              <span class="text-3xl" v-html="selectedAddress?.emoji || '₿'"></span>
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white">
              ${{ formatMoney(preview?.netAmountUSD) }}
            </div>
            <div class="text-sm text-gray-500 dark:text-white/40 mt-1">
              ≈ {{ preview?.netAmountCrypto }} {{ preview?.currency }}
            </div>
          </div>

          <div class="space-y-1">
            <div
              v-for="detail in withdrawalSummary"
              :key="detail.label"
              class="flex justify-between items-center py-3 border-b last:border-0 border-gray-200 dark:border-white/[0.04]"
            >
              <span class="text-sm text-gray-500 dark:text-white/40">{{ detail.label }}</span>
              <span
                class="text-sm font-semibold text-gray-800 dark:text-white/90 text-right ml-4 truncate max-w-[200px]"
                :class="detail.class"
              >{{ detail.value }}</span>
            </div>
          </div>
        </div>

        <!-- Confirmation checkbox -->
        <label
          class="flex items-start gap-3 p-4 rounded-xl cursor-pointer mb-6
                 bg-gray-50 dark:bg-white/[0.03] border transition-colors"
          :class="confirmChecked
            ? 'border-gold-500/30 dark:border-amber-500/30'
            : 'border-gray-100 dark:border-white/[0.06]'"
        >
          <input
            type="checkbox"
            v-model="confirmChecked"
            class="w-5 h-5 mt-0.5 rounded border-gray-300 text-amber-500 focus:ring-amber-500/30 dark:bg-white/[0.06] dark:border-white/[0.1]"
          >
          <span class="text-sm text-gray-700 dark:text-white/70">
            I confirm that the wallet address is correct and I understand that
            <strong>withdrawals cannot be reversed</strong>. I accept the network and processing fees.
          </span>
        </label>

        <!-- Navigation -->
        <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-100 dark:border-white/[0.06]">
          <button
            @click="prevStep"
            class="px-6 py-3 rounded-xl font-semibold text-sm text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
          >
            <i class="bi bi-arrow-left mr-1"></i> Back
          </button>
          <button
            @click="openPinModal"
            :disabled="!confirmChecked"
            class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   hover:shadow-lg hover:shadow-red-500/30 hover:scale-[1.02]
                   inline-flex items-center gap-2"
            style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white;"
          >
            <i class="bi bi-shield-lock"></i> Confirm Withdrawal
          </button>
        </div>
      </div>

      <!-- ════════════ STEP 4: Success ════════════ -->
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
          Withdrawal Submitted!
        </h3>
        <p class="text-gray-500 dark:text-white/40 max-w-md mx-auto mb-8">
          Your withdrawal of <strong class="text-amber-500">${{ formatMoney(preview?.netAmountUSD) }}</strong>
          ({{ preview?.netAmountCrypto }} {{ preview?.currency }}) has been submitted.
          It will be processed within 24 hours.
        </p>

        <!-- Summary -->
        <div class="max-w-md mx-auto p-5 rounded-2xl mb-8 text-left
                    bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-white/40">Reference</span>
              <span class="font-mono font-semibold text-gray-800 dark:text-white text-xs">
                {{ store.state.current?.reference }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-white/40">Currency</span>
              <span class="font-semibold text-gray-800 dark:text-white">{{ store.state.current?.currency }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-white/40">Network</span>
              <span class="font-semibold text-gray-800 dark:text-white">{{ store.state.current?.network }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-white/40">Wallet</span>
              <span class="font-mono font-semibold text-gray-800 dark:text-white text-xs">
                {{ shortAddress(store.state.current?.address) }}
              </span>
            </div>
            <div class="flex justify-between text-sm pt-3 border-t border-gray-200 dark:border-white/[0.06]">
              <span class="text-gray-500 dark:text-white/40">Net Amount</span>
              <span class="font-bold text-lg text-amber-500">${{ formatMoney(store.state.current?.netAmountUSD) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-white/40">Status</span>
              <WithdrawalStatusBadge :status="store.state.current?.status" />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink
            to="/transactions"
            class="px-6 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-white/80
                   bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]
                   inline-flex items-center justify-center gap-2"
          >
            <i class="bi bi-clock-history"></i> View Transactions
          </NuxtLink>
          <button
            @click="resetWithdrawal"
            class="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
          >
            <i class="bi bi-plus-circle mr-1"></i> New Withdrawal
          </button>
        </div>
      </div>
    </Transition>

    <!-- ─────── RECENT WITHDRAWALS ─────── -->
    <div
      v-if="currentStep === 1"
      class="mt-6 rounded-2xl overflow-hidden
             bg-white border border-gray-100 shadow-sm
             dark:bg-[#101A47] dark:border-white/[0.05]"
    >
      <div class="flex items-center justify-between p-5 md:p-6">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-red-500/10 dark:bg-red-500/[0.08]">
            <i class="bi bi-clock-history text-red-400 text-lg"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-gray-800 dark:text-white">Recent Withdrawals</h3>
            <p class="text-xs text-gray-400 dark:text-white/40">Your last withdrawal transactions</p>
          </div>
        </div>
        <NuxtLink to="/transactions" class="text-xs md:text-sm font-semibold text-amber-500 hover:text-amber-600">
          View all <i class="bi bi-arrow-right"></i>
        </NuxtLink>
      </div>

      <!-- Skeleton -->
      <div v-if="store.state.isLoading && !store.hasWithdrawals" class="px-5 md:px-6 pb-6 space-y-3">
        <div
          v-for="i in 3"
          :key="i"
          class="flex items-center gap-3 p-3 rounded-xl animate-pulse bg-gray-50 dark:bg-white/[0.02]"
        >
          <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/[0.06]"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-gray-200 dark:bg-white/[0.06] rounded w-1/3"></div>
            <div class="h-2 bg-gray-100 dark:bg-white/[0.04] rounded w-1/4"></div>
          </div>
          <div class="h-6 w-20 bg-gray-200 dark:bg-white/[0.06] rounded-full"></div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!store.state.isLoading && !store.hasWithdrawals" class="px-5 md:px-6 pb-10 pt-2 text-center">
        <i class="bi bi-inbox text-4xl text-gray-300 dark:text-white/20"></i>
        <p class="text-sm text-gray-500 dark:text-white/40 mt-2">No withdrawals yet</p>
      </div>

      <!-- Table -->
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
              v-for="w in recentWithdrawals"
              :key="w._id"
              class="transition-colors duration-200 border-b
                     border-gray-100 hover:bg-gray-50
                     dark:border-white/[0.03] dark:hover:bg-white/[0.03]"
            >
              <td class="py-4 px-5 md:px-6">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                    :style="{ background: currencyMeta(w.currency).color }"
                  >
                    <span class="text-xl" v-html="currencyMeta(w.currency).emoji"></span>
                  </div>
                  <div>
                    <span class="text-sm font-semibold block text-gray-800 dark:text-white/90">{{ w.currency }}</span>
                    <span class="text-xs text-gray-400 dark:text-white/30">{{ w.network }}</span>
                  </div>
                </div>
              </td>
              <td class="py-4 px-5 md:px-6 text-sm font-bold text-red-500">
                -${{ formatMoney(w.amountUSD) }}
              </td>
              <td class="py-4 px-5 md:px-6">
                <WithdrawalStatusBadge :status="w.status" />
              </td>
              <td class="py-4 px-5 md:px-6 text-sm text-gray-500 dark:text-white/30">
                {{ formatDate(w.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ─────── PIN MODAL ─────── -->
    <PinModal
      :open="pinOpen"
      :loading="store.state.isSubmitting"
      :error-message="pinError"
      :attempts-left="maxAttempts - store.state.pinAttempts"
      @close="closePinModal"
      @submit="handlePinSubmit"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useWithdrawalStore } from '~/stores/withdrawal'
import { useDepositStore } from '~/stores/deposit'         // reuse cached addresses
import { useWalletStore } from '~/stores/wallet'           // if you have one; else remove
import { WITHDRAWAL_RULES, CURRENCY_META } from '~/composables/constants'

definePageMeta({ layout: 'dashboard' })

// ─────────────────────────────────────────────────────────────
// STORES
// ─────────────────────────────────────────────────────────────
const store = useWithdrawalStore()
const depositStore = useDepositStore()

// ─────────────────────────────────────────────────────────────
// LOCAL UI STATE
// ─────────────────────────────────────────────────────────────
const currentStep = ref(1)
const searchQuery = ref('')
const selectedAddress = ref(null)     // a wallet from /wallet/addresses
const address = ref('')
const amount = ref(null)
const saveAddress = ref(false)
const confirmChecked = ref(false)

// PIN
const pinOpen = ref(false)
const pinError = ref('')
const maxAttempts = WITHDRAWAL_RULES.PIN_MAX_ATTEMPTS

// Balance
const balance = ref(0)
const balanceLoading = ref(true)

// Saved wallets for the selected currency
const savedWallets = ref([])

// ─────────────────────────────────────────────────────────────
// STEPS
// ─────────────────────────────────────────────────────────────
const steps = [
  { id: 1, name: 'Select Crypto', icon: 'bi bi-currency-bitcoin' },
  { id: 2, name: 'Details',       icon: 'bi bi-wallet2' },
  { id: 3, name: 'Review',        icon: 'bi bi-shield-check' },
  { id: 4, name: 'Confirm',       icon: 'bi bi-check-circle' },
]

// ─────────────────────────────────────────────────────────────
// COMPUTED
// ─────────────────────────────────────────────────────────────
const addressesLoaded = computed(() => depositStore.state.addressesLoaded)
const availableAddresses = computed(() => depositStore.activeAddresses)

const filteredCryptos = computed(() => {
  if (!searchQuery.value) return availableAddresses.value
  const q = searchQuery.value.toLowerCase()
  return availableAddresses.value.filter((c) =>
    (c.name || '').toLowerCase().includes(q) ||
    (c.currency || '').toLowerCase().includes(q) ||
    (c.network || '').toLowerCase().includes(q)
  )
})

const minWithdraw = computed(() =>
  Math.max(WITHDRAWAL_RULES.MIN_USD, selectedAddress.value?.minDeposit || 0)
)
const maxWithdrawal = computed(() => balance.value)

const quickAmounts = computed(() => {
  const base = [100, 500, 1000, 5000]
  return base.filter((q) => q <= balance.value || q === base[0])
})

const savedWalletsForSelected = computed(() =>
  savedWallets.value.filter((w) => w.currency === selectedAddress.value?.currency)
)

const preview = computed(() => store.state.preview)

const isStep2Valid = computed(() =>
  address.value.length > 10 &&
  amount.value >= minWithdraw.value &&
  amount.value <= maxWithdrawal.value
)

const withdrawalSummary = computed(() => [
  { label: 'Cryptocurrency', value: `${selectedAddress.value?.name} (${selectedAddress.value?.currency})` },
  { label: 'Network',        value: selectedAddress.value?.network },
  { label: 'Withdrawal Amount', value: `$${formatMoney(preview.value?.amountUSD)}` },
  { label: 'Network Fee',    value: `-$${formatMoney(preview.value?.networkFeeUSD)}`, class: 'text-red-500' },
  { label: 'Processing Fee', value: `-$${formatMoney(preview.value?.processingFeeUSD)}`, class: 'text-red-500' },
  { label: 'You Receive',    value: `$${formatMoney(preview.value?.netAmountUSD)}`, class: 'text-amber-500' },
  { label: 'Wallet Address', value: shortAddress(address.value) },
  { label: 'Estimated Time', value: 'Within 24 hours' },
])

const pendingTotal = computed(() =>
  store.state.withdrawals
    .filter((w) => w.status === 'pending')
    .reduce((sum, w) => sum + (w.amountUSD || 0), 0)
)

const totalWithdrawn = computed(() =>
  store.state.withdrawals
    .filter((w) => w.status === 'completed')
    .reduce((sum, w) => sum + (w.amountUSD || 0), 0)
)

const recentWithdrawals = computed(() => store.state.withdrawals.slice(0, 5))

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatMoney = (n) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const shortAddress = (a) => {
  if (!a) return ''
  if (a.length <= 20) return a
  return `${a.slice(0, 10)}…${a.slice(-8)}`
}

const currencyMeta = (c) =>
  CURRENCY_META[c] || { color: '#888', emoji: '?', name: c }

// ─────────────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────────────
const selectCrypto = (c) => {
  selectedAddress.value = c
  address.value = ''
  amount.value = null
  store.clearPreview()
}

const nextStep = async () => {
  if (currentStep.value === 1) {
    if (!selectedAddress.value) return
    currentStep.value = 2
    return
  }

  if (currentStep.value === 2) {
    if (!isStep2Valid.value) return
    // Fetch fee preview before showing review
    await store.previewFee({
      currency: selectedAddress.value.currency,
      amountUSD: amount.value,
    })
    if (!store.state.preview) return
    currentStep.value = 3
    return
  }

  if (currentStep.value === 3) {
    // handled by openPinModal()
    return
  }
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const withdrawMax = () => {
  if (maxWithdrawal.value > 0) amount.value = maxWithdrawal.value
}

const pasteAddress = async () => {
  try {
    const text = await navigator.clipboard.readText()
    address.value = text
  } catch { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────
// PIN FLOW
// ─────────────────────────────────────────────────────────────
const openPinModal = () => {
  if (!confirmChecked.value) return
  store.resetPinAttempts()
  pinError.value = ''
  pinOpen.value = true
}

const closePinModal = () => {
  if (store.state.isSubmitting) return
  pinOpen.value = false
  pinError.value = ''
}

const handlePinSubmit = async (pin) => {
  pinError.value = ''

  const res = await store.createWithdrawal({
    currency: selectedAddress.value.currency,
    network: selectedAddress.value.network,
    amountUSD: amount.value,
    address: address.value.trim(),
    saveAddress: saveAddress.value,
    pin,
  })

  if (res.success) {
    pinOpen.value = false
    currentStep.value = 4
    refreshBalance()
    return
  }

  // error
  pinError.value = res.message || 'Invalid PIN'
  if (store.state.isPinLocked) {
    setTimeout(() => { pinOpen.value = false }, 1800)
  }
}

// ─────────────────────────────────────────────────────────────
// BALANCE
// ─────────────────────────────────────────────────────────────
const refreshBalance = async () => {
  try {
    const requests = useWalletRequests()
    const res = await requests.getBalances()
    if (res.success) {
      balance.value = res.data?.balances?.USD || 0
    }
  } catch { /* ignore */ } finally {
    balanceLoading.value = false
  }
}

const loadSavedWallets = async () => {
  try {
    const requests = useWalletRequests()
    const res = await requests.getSavedWallets()
    if (res.success) savedWallets.value = res.data?.wallets || []
  } catch { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────
// RESET
// ─────────────────────────────────────────────────────────────
const resetWithdrawal = () => {
  currentStep.value = 1
  selectedAddress.value = null
  address.value = ''
  amount.value = null
  searchQuery.value = ''
  confirmChecked.value = false
  store.clearPreview()
  store.clearCurrent()
  store.resetPinAttempts()
}

// ─────────────────────────────────────────────────────────────
// WATCHERS
// ─────────────────────────────────────────────────────────────

// Auto-preview fee when amount stabilises on step 2
let previewTimer = null
watch(amount, (v) => {
  if (currentStep.value !== 2) return
  clearTimeout(previewTimer)
  if (!v || v < minWithdraw.value || v > maxWithdrawal.value) {
    store.clearPreview()
    return
  }
  previewTimer = setTimeout(() => {
    store.previewFee({ currency: selectedAddress.value.currency, amountUSD: v })
  }, 500)
})

// ─────────────────────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────────────────────
onMounted(async () => {
  // Reuse deposit store's cached addresses (5-min TTL)
  if (!depositStore.state.addressesLoaded) {
    await depositStore.fetchAddresses()
  }
  refreshBalance()
  loadSavedWallets()
  store.fetchMyWithdrawals({ page: 1, limit: 5 })
})

onUnmounted(() => {
  store.stopPolling()
  store.clearPreview()
})
</script>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; appearance: textfield; }

@keyframes pulse-ring {
  0%   { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}
.animate-ping { animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

input[type="checkbox"] { accent-color: #bb914a; cursor: pointer; }

.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: rgba(187, 145, 74, 0.3); border-radius: 10px; }
.overflow-x-auto::-webkit-scrollbar-thumb:hover { background: rgba(187, 145, 74, 0.5); }
</style>