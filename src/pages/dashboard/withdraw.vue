<template>
    <DashboardLayout>
      <!-- Page Header -->
      <div class="mb-6 md:mb-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-red-500/10 dark:bg-red-500/[0.08]">
              <i class="bi bi-arrow-up-circle text-red-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Withdraw Funds</h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">Withdraw your funds securely to your crypto wallet</p>
            </div>
          </div>
          <a 
            href="?a=history"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                   bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
          >
            <i class="bi bi-clock-history"></i>
            <span class="hidden sm:inline">View History</span>
          </a>
        </div>
      </div>
  
      <!-- Available Balance Card -->
      <div class="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden
                  bg-white border border-gray-100 shadow-xl shadow-gray-200/50
                  dark:bg-gradient-to-br dark:from-[#152155] dark:via-[#101A47] dark:to-[#0F1B4C]
                  dark:border-white/[0.06] dark:shadow-2xl dark:shadow-blue-900/40">
        
        <!-- Decorative Elements -->
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
                <span class="text-sm font-medium uppercase tracking-wider
                             text-gray-500 dark:text-white/40">
                  Available Balance
                </span>
              </div>
              <div class="text-4xl md:text-5xl font-bold tracking-tight
                          text-gray-900 dark:text-white">
                $25,847.50
              </div>
              <div class="mt-2 flex items-center gap-4 text-sm">
                <span class="text-gray-500 dark:text-white/40">
                  Withdrawable: <strong class="text-gray-800 dark:text-white">$25,847.50</strong>
                </span>
              </div>
            </div>
            
            <div class="flex gap-6 md:gap-10">
              <div>
                <div class="text-xs uppercase tracking-wider mb-1 text-gray-500 dark:text-white/40">
                  Pending
                </div>
                <div class="text-amber-500 font-bold text-xl">$1,200</div>
              </div>
              <div>
                <div class="text-xs uppercase tracking-wider mb-1 text-gray-500 dark:text-white/40">
                  Total Withdrawn
                </div>
                <div class="font-bold text-xl text-gray-800 dark:text-white">$6,252</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
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
        <!-- STEP 1: Select Cryptocurrency -->
        <div 
          v-if="currentStep === 1" 
          key="step1"
          class="rounded-2xl p-5 md:p-8
                 bg-white border border-gray-100 shadow-sm
                 dark:bg-[#101A47] dark:border-white/[0.05]"
        >
          <h3 class="font-bold text-xl text-gray-800 dark:text-white mb-2">Select Cryptocurrency</h3>
          <p class="text-sm text-gray-500 dark:text-white/40 mb-6">Choose which cryptocurrency you want to withdraw</p>
  
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
  
          <!-- Crypto Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <button 
              v-for="crypto in filteredCryptos" 
              :key="crypto.symbol"
              @click="selectCrypto(crypto)"
              class="group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left"
              :class="selectedCrypto?.symbol === crypto.symbol
                ? 'border-gold-500 bg-gold-500/[0.06] dark:border-amber-500 dark:bg-amber-500/[0.08] shadow-lg shadow-amber-500/10'
                : 'border-gray-100 dark:border-white/[0.06] hover:border-gold-300 dark:hover:border-blue-500/30 bg-white dark:bg-white/[0.02] hover:shadow-lg'"
            >
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" :style="{ background: crypto.bgColor, color: crypto.textColor }">
                <span class="text-2xl" v-html="crypto.emoji"></span>
              </div>
  
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-gray-800 dark:text-white">{{ crypto.symbol }}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-white/40">
                    {{ crypto.network }}
                  </span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <p class="text-sm text-gray-500 dark:text-white/40">{{ crypto.name }}</p>
                  <p class="text-xs font-bold text-amber-500">${{ formatBalance(crypto.balance) }}</p>
                </div>
              </div>
  
              <div 
                v-if="selectedCrypto?.symbol === crypto.symbol"
                class="w-6 h-6 rounded-full bg-gold-500 dark:bg-amber-500 flex items-center justify-center flex-shrink-0"
              >
                <i class="bi bi-check-lg text-white text-sm"></i>
              </div>
            </button>
          </div>
  
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
  
        <!-- STEP 2: Enter Amount & Wallet -->
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
              <h3 class="font-bold text-xl text-gray-800 dark:text-white">Withdrawal Details</h3>
              <p class="text-xs text-gray-500 dark:text-white/40">Enter the amount and your wallet address</p>
            </div>
          </div>
  
          <!-- Selected Crypto Summary -->
          <div class="flex items-center gap-4 p-4 rounded-2xl mb-6
                      bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
            <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" :style="{ background: selectedCrypto?.bgColor, color: selectedCrypto?.textColor }">
              <span class="text-2xl" v-html="selectedCrypto?.emoji"></span>
            </div>
            <div class="flex-1">
              <p class="text-xs text-gray-500 dark:text-white/40">Available balance</p>
              <p class="font-bold text-gray-800 dark:text-white">
                {{ selectedCrypto?.balance }} {{ selectedCrypto?.symbol }}
                <span class="text-sm font-normal text-gray-500 dark:text-white/40">≈ ${{ formatBalance(selectedCrypto?.balanceUsd) }}</span>
              </p>
            </div>
            <button @click="currentStep = 1" class="text-amber-500 hover:text-amber-600 text-sm font-semibold">Change</button>
          </div>
  
          <!-- Network Selection -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-3">
              Select Network
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                v-for="network in selectedCrypto?.networks" 
                :key="network.name"
                @click="selectedNetwork = network"
                class="flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left"
                :class="selectedNetwork?.name === network.name
                  ? 'border-gold-500 bg-gold-500/[0.06] dark:border-amber-500 dark:bg-amber-500/[0.08]'
                  : 'border-gray-100 dark:border-white/[0.06] hover:border-gold-300 dark:hover:border-blue-500/30'"
              >
                <div>
                  <p class="font-semibold text-sm text-gray-800 dark:text-white">{{ network.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-white/40">Fee: {{ network.fee }}</p>
                </div>
                <div 
                  v-if="selectedNetwork?.name === network.name"
                  class="w-5 h-5 rounded-full bg-gold-500 dark:bg-amber-500 flex items-center justify-center"
                >
                  <i class="bi bi-check-lg text-white text-xs"></i>
                </div>
              </button>
            </div>
          </div>
  
          <!-- Wallet Address -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-3">
              Your {{ selectedCrypto?.symbol }} Wallet Address
            </label>
            <div class="relative">
              <i class="bi bi-wallet2 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"></i>
              <input 
                v-model="walletAddress"
                type="text"
                :placeholder="`Enter your ${selectedCrypto?.symbol} wallet address`"
                class="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm font-mono outline-none transition-all duration-200
                       bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                       dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
              >
              <button 
                v-if="walletAddress"
                @click="pasteAddress"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center
                       hover:bg-gray-200 dark:hover:bg-white/[0.06] transition-colors"
                title="Paste"
              >
                <i class="bi bi-clipboard text-gray-500 dark:text-white/40 text-sm"></i>
              </button>
            </div>
            <p class="text-xs text-gray-400 dark:text-white/30 mt-2">
              <i class="bi bi-info-circle mr-1"></i>
              Double-check your address. Withdrawals cannot be reversed.
            </p>
          </div>
  
          <!-- Amount Input -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-semibold text-gray-700 dark:text-white/80">
                Amount to Withdraw (USD)
              </label>
              <button 
                @click="withdrawMax"
                class="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors"
              >
                MAX
              </button>
            </div>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 font-semibold">$</span>
              <input 
                v-model="amount"
                type="number"
                placeholder="0.00"
                min="20"
                :max="maxWithdrawal"
                class="w-full pl-9 pr-20 py-4 rounded-xl text-lg font-bold outline-none transition-all duration-200
                       bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-300 focus:border-gold-500/50
                       dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/20 dark:focus:border-blue-500/40"
              >
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/40 text-sm font-semibold">
                USD
              </span>
            </div>
  
            <!-- Quick Amount Buttons -->
            <div class="grid grid-cols-4 gap-2 mt-3">
              <button 
                v-for="quick in [100, 500, 1000, 5000]" 
                :key="quick"
                @click="amount = quick"
                :disabled="quick > maxWithdrawal"
                class="py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                       bg-gray-50 hover:bg-red-500/10 border border-gray-100 hover:border-red-300 text-gray-600 hover:text-red-600
                       dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-white/60 dark:hover:text-red-400 dark:hover:border-red-500/30"
              >
                ${{ quick.toLocaleString() }}
              </button>
            </div>
  
            <p v-if="amount && amount < 20" class="text-xs text-red-500 mt-2">
              <i class="bi bi-exclamation-circle mr-1"></i>Minimum withdrawal is $20.00
            </p>
            <p v-if="amount && amount > maxWithdrawal" class="text-xs text-red-500 mt-2">
              <i class="bi bi-exclamation-circle mr-1"></i>Amount exceeds available balance
            </p>
          </div>
  
          <!-- Fee & Total Breakdown -->
          <div v-if="amount && amount >= 20 && amount <= maxWithdrawal" class="p-4 rounded-xl mb-6
                                                                                  bg-gray-50 dark:bg-white/[0.03] 
                                                                                  border border-gray-100 dark:border-white/[0.06]">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-white/40">Withdrawal amount</span>
                <span class="font-semibold text-gray-800 dark:text-white">${{ formatAmount(amount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-white/40">Network fee ({{ selectedNetwork?.fee }})</span>
                <span class="font-semibold text-red-500">-${{ networkFee }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-white/40">Processing fee (1%)</span>
                <span class="font-semibold text-red-500">-${{ processingFee }}</span>
              </div>
              <div class="border-t border-gray-200 dark:border-white/[0.06] pt-2 flex justify-between">
                <span class="font-bold text-gray-800 dark:text-white">You will receive</span>
                <div class="text-right">
                  <div class="font-bold text-lg text-amber-500">${{ netAmount }}</div>
                  <div class="text-xs text-gray-500 dark:text-white/40">
                    ≈ {{ netCryptoAmount }} {{ selectedCrypto?.symbol }}
                  </div>
                </div>
              </div>
            </div>
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
              :disabled="!isStep2Valid"
              class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
            >
              Review <i class="bi bi-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
  
        <!-- STEP 3: Review & Confirm -->
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
              </p>
            </div>
          </div>
  
          <!-- Withdrawal Summary Card -->
          <div class="p-6 rounded-2xl mb-6
                      bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
            
            <!-- Crypto Header -->
            <div class="flex flex-col items-center text-center pb-6 border-b border-gray-200 dark:border-white/[0.06] mb-6">
              <div class="w-16 h-16 rounded-full flex items-center justify-center mb-3" :style="{ background: selectedCrypto?.bgColor, color: selectedCrypto?.textColor }">
                <span class="text-3xl" v-html="selectedCrypto?.emoji"></span>
              </div>
              <div class="text-3xl font-bold text-gray-900 dark:text-white">
                ${{ netAmount }}
              </div>
              <div class="text-sm text-gray-500 dark:text-white/40 mt-1">
                ≈ {{ netCryptoAmount }} {{ selectedCrypto?.symbol }}
              </div>
            </div>
  
            <!-- Details -->
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
                >
                  {{ detail.value }}
                </span>
              </div>
            </div>
          </div>
  
          <!-- Confirmation Checkbox -->
          <label class="flex items-start gap-3 p-4 rounded-xl cursor-pointer mb-6
                        bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]"
                 :class="confirmChecked ? 'border-gold-500/30 dark:border-amber-500/30' : ''">
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
              class="px-6 py-3 rounded-xl font-semibold text-sm text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all duration-200"
            >
              <i class="bi bi-arrow-left mr-1"></i> Back
            </button>
            <button 
              @click="submitWithdrawal"
              :disabled="!confirmChecked"
              class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     hover:shadow-lg hover:shadow-red-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); background-size: 200% auto; color: white;"
            >
              <i class="bi bi-check-circle mr-1"></i> Confirm Withdrawal
            </button>
          </div>
        </div>
  
        <!-- STEP 4: Success -->
        <div 
          v-else-if="currentStep === 4" 
          key="step4"
          class="rounded-2xl p-8 md:p-12 text-center
                 bg-white border border-gray-100 shadow-sm
                 dark:bg-[#101A47] dark:border-white/[0.05]"
        >
          <!-- Success Icon -->
          <div class="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center
                      bg-emerald-500/10 dark:bg-emerald-500/[0.15] relative">
            <div class="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
            <i class="bi bi-check-circle-fill text-emerald-500 text-5xl relative"></i>
          </div>
  
          <h3 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white mb-3">
            Withdrawal Submitted!
          </h3>
          <p class="text-gray-500 dark:text-white/40 max-w-md mx-auto mb-8">
            Your withdrawal of <strong class="text-amber-500">${{ netAmount }}</strong> 
            ({{ netCryptoAmount }} {{ selectedCrypto?.symbol }}) has been submitted successfully. 
            It will be processed within 24 hours.
          </p>
  
          <!-- Summary Card -->
          <div class="max-w-md mx-auto p-5 rounded-2xl mb-8 text-left
                      bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-white/40">Withdrawal ID</span>
                <span class="font-mono font-semibold text-gray-800 dark:text-white text-xs">#WTH-{{ Date.now() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-white/40">Cryptocurrency</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ selectedCrypto?.symbol }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-white/40">Network</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ selectedNetwork?.name }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-white/40">Wallet</span>
                <span class="font-mono font-semibold text-gray-800 dark:text-white text-xs">
                  {{ truncateAddress(walletAddress) }}
                </span>
              </div>
              <div class="flex justify-between text-sm pt-3 border-t border-gray-200 dark:border-white/[0.06]">
                <span class="text-gray-500 dark:text-white/40">Amount</span>
                <span class="font-bold text-lg text-amber-500">${{ netAmount }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-white/40">Status</span>
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-600 dark:bg-amber-500/[0.08] dark:text-amber-400">
                  <i class="bi bi-clock mr-1"></i>Processing
                </span>
              </div>
            </div>
          </div>
  
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="?a=history"
              class="px-6 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-white/80
                     bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]
                     transition-all duration-200"
            >
              <i class="bi bi-clock-history mr-1"></i> View Transactions
            </a>
            <button 
              @click="resetWithdrawal"
              class="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
            >
              <i class="bi bi-plus-circle mr-1"></i> New Withdrawal
            </button>
          </div>
        </div>
      </Transition>
  
      <!-- Recent Withdrawals (shown only on step 1) -->
      <div v-if="currentStep === 1" class="mt-6 rounded-2xl overflow-hidden
                                            bg-white border border-gray-100 shadow-sm
                                            dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="flex items-center justify-between p-5 md:p-6">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                        bg-red-500/10 dark:bg-red-500/[0.08]">
              <i class="bi bi-clock-history text-red-400 text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white">
                Recent Withdrawals
              </h3>
              <p class="text-xs text-gray-400 dark:text-white/40">
                Your last withdrawal transactions
              </p>
            </div>
          </div>
        </div>
  
        <div class="overflow-x-auto">
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
                v-for="withdrawal in recentWithdrawals" 
                :key="withdrawal.id" 
                class="transition-colors duration-200 border-b
                       border-gray-100 hover:bg-gray-50
                       dark:border-white/[0.03] dark:hover:bg-white/[0.03]"
              >
                <td class="py-4 px-5 md:px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
                         :style="{ background: withdrawal.bgColor, color: withdrawal.textColor }">
                      <span class="text-xl" v-html="withdrawal.emoji"></span>
                    </div>
                    <div>
                      <span class="text-sm font-semibold block text-gray-800 dark:text-white/90">{{ withdrawal.symbol }}</span>
                      <span class="text-xs text-gray-400 dark:text-white/30">{{ withdrawal.network }}</span>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-5 md:px-6 text-sm font-bold text-red-500">
                  -${{ withdrawal.amount }}
                </td>
                <td class="py-4 px-5 md:px-6">
                  <span 
                    class="px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
                    :class="withdrawal.status === 'Completed' 
                      ? 'bg-green-50 text-green-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400'
                      : withdrawal.status === 'Pending'
                        ? 'bg-yellow-50 text-yellow-600 dark:bg-amber-500/[0.08] dark:text-amber-400'
                        : 'bg-red-50 text-red-600 dark:bg-red-500/[0.08] dark:text-red-400'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="{
                      'bg-emerald-500': withdrawal.status === 'Completed',
                      'bg-amber-500': withdrawal.status === 'Pending',
                      'bg-red-500': withdrawal.status === 'Failed'
                    }"></span>
                    {{ withdrawal.status }}
                  </span>
                </td>
                <td class="py-4 px-5 md:px-6 text-sm text-gray-500 dark:text-white/30">
                  {{ withdrawal.date }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, computed, onUnmounted } from 'vue'
  
  definePageMeta({
    layout: 'dashboard'
  })
  
  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────
  const currentStep = ref(1)
  const searchQuery = ref('')
  const selectedCrypto = ref(null)
  const selectedNetwork = ref(null)
  const amount = ref(null)
  const walletAddress = ref('')
  const confirmChecked = ref(false)
  
  const steps = [
    { id: 1, name: 'Select Crypto', icon: 'bi bi-currency-bitcoin' },
    { id: 2, name: 'Details', icon: 'bi bi-wallet2' },
    { id: 3, name: 'Review', icon: 'bi bi-shield-check' },
    { id: 4, name: 'Confirm', icon: 'bi bi-check-circle' }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // CRYPTOCURRENCIES WITH BALANCES
  // ─────────────────────────────────────────────────────────────
  const cryptocurrencies = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      network: 'Bitcoin',
      emoji: '₿',
      bgColor: '#F7931A',
      textColor: 'white',
      balance: 0.156842,
      balanceUsd: 10574.30,
      price: 67420.50,
      networks: [
        { name: 'Bitcoin', fee: '0.0002 BTC (~$13.48)', feeUsd: 13.48 },
        { name: 'Lightning', fee: '0.00001 BTC (~$0.67)', feeUsd: 0.67 }
      ]
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      network: 'ERC20',
      emoji: 'Ξ',
      bgColor: '#627EEA',
      textColor: 'white',
      balance: 2.847392,
      balanceUsd: 9240.85,
      price: 3245.80,
      networks: [
        { name: 'ERC20', fee: '0.005 ETH (~$16.23)', feeUsd: 16.23 },
        { name: 'Arbitrum', fee: '0.0001 ETH (~$0.32)', feeUsd: 0.32 },
        { name: 'Optimism', fee: '0.0001 ETH (~$0.32)', feeUsd: 0.32 }
      ]
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      network: 'TRC20',
      emoji: '₮',
      bgColor: '#26A17B',
      textColor: 'white',
      balance: 3856.20,
      balanceUsd: 3856.20,
      price: 1.00,
      networks: [
        { name: 'TRC20', fee: '1 USDT (~$1.00)', feeUsd: 1.00 },
        { name: 'ERC20', fee: '5 USDT (~$5.00)', feeUsd: 5.00 },
        { name: 'BEP20', fee: '0.5 USDT (~$0.50)', feeUsd: 0.50 }
      ]
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      network: 'ERC20',
      emoji: '$',
      bgColor: '#2775CA',
      textColor: 'white',
      balance: 1204.75,
      balanceUsd: 1204.75,
      price: 1.00,
      networks: [
        { name: 'ERC20', fee: '3 USDC (~$3.00)', feeUsd: 3.00 },
        { name: 'Polygon', fee: '0.1 USDC (~$0.10)', feeUsd: 0.10 },
        { name: 'Solana', fee: '0.01 USDC (~$0.01)', feeUsd: 0.01 }
      ]
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      network: 'BEP20',
      emoji: '⬢',
      bgColor: '#F3BA2F',
      textColor: '#020862',
      balance: 0.8426,
      balanceUsd: 504.14,
      price: 598.40,
      networks: [
        { name: 'BEP20', fee: '0.001 BNB (~$0.60)', feeUsd: 0.60 }
      ]
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      network: 'Solana',
      emoji: '◎',
      bgColor: '#14F195',
      textColor: '#020862',
      balance: 12.4589,
      balanceUsd: 2104.75,
      price: 168.90,
      networks: [
        { name: 'Solana', fee: '0.00001 SOL (~$0.002)', feeUsd: 0.002 }
      ]
    },
    {
      symbol: 'XRP',
      name: 'Ripple',
      network: 'XRP Ledger',
      emoji: '✕',
      bgColor: '#23292F',
      textColor: 'white',
      balance: 1520.80,
      balanceUsd: 942.90,
      price: 0.62,
      networks: [
        { name: 'XRP Ledger', fee: '0.00002 XRP (~$0.001)', feeUsd: 0.001 }
      ]
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      network: 'Cardano',
      emoji: '₳',
      bgColor: '#0033AD',
      textColor: 'white',
      balance: 850.00,
      balanceUsd: 382.50,
      price: 0.45,
      networks: [
        { name: 'Cardano', fee: '0.17 ADA (~$0.08)', feeUsd: 0.08 }
      ]
    },
    {
      symbol: 'DOGE',
      name: 'Dogecoin',
      network: 'Dogecoin',
      emoji: 'Ð',
      bgColor: '#C2A633',
      textColor: 'white',
      balance: 2500.00,
      balanceUsd: 400.00,
      price: 0.16,
      networks: [
        { name: 'Dogecoin', fee: '1 DOGE (~$0.16)', feeUsd: 0.16 }
      ]
    },
    {
      symbol: 'TRX',
      name: 'TRON',
      network: 'TRC20',
      emoji: '⚡',
      bgColor: '#EF0027',
      textColor: 'white',
      balance: 3850.00,
      balanceUsd: 500.50,
      price: 0.13,
      networks: [
        { name: 'TRC20', fee: '1 TRX (~$0.13)', feeUsd: 0.13 }
      ]
    },
    {
      symbol: 'MATIC',
      name: 'Polygon',
      network: 'Polygon',
      emoji: '⬟',
      bgColor: '#8247E5',
      textColor: 'white',
      balance: 425.60,
      balanceUsd: 378.78,
      price: 0.89,
      networks: [
        { name: 'Polygon', fee: '0.01 MATIC (~$0.009)', feeUsd: 0.009 },
        { name: 'ERC20', fee: '5 MATIC (~$4.45)', feeUsd: 4.45 }
      ]
    },
    {
      symbol: 'LTC',
      name: 'Litecoin',
      network: 'Litecoin',
      emoji: 'Ł',
      bgColor: '#BFBBBB',
      textColor: '#020862',
      balance: 3.2568,
      balanceUsd: 277.85,
      price: 85.30,
      networks: [
        { name: 'Litecoin', fee: '0.001 LTC (~$0.09)', feeUsd: 0.09 }
      ]
    }
  ]
  
  const recentWithdrawals = [
    { id: 1, symbol: 'BTC', network: 'Bitcoin', amount: '500.00', status: 'Completed', date: '2026-08-06', emoji: '₿', bgColor: '#F7931A', textColor: 'white' },
    { id: 2, symbol: 'ETH', network: 'ERC20', amount: '800.00', status: 'Pending', date: '2026-08-04', emoji: 'Ξ', bgColor: '#627EEA', textColor: 'white' },
    { id: 3, symbol: 'USDT', network: 'TRC20', amount: '450.00', status: 'Failed', date: '2026-08-02', emoji: '₮', bgColor: '#26A17B', textColor: 'white' },
    { id: 4, symbol: 'SOL', network: 'Solana', amount: '300.00', status: 'Completed', date: '2026-07-30', emoji: '◎', bgColor: '#14F195', textColor: '#020862' }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const filteredCryptos = computed(() => {
    if (!searchQuery.value) return cryptocurrencies
    const query = searchQuery.value.toLowerCase()
    return cryptocurrencies.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.symbol.toLowerCase().includes(query)
    )
  })
  
  const maxWithdrawal = computed(() => {
    if (!selectedCrypto.value) return 0
    return selectedCrypto.value.balanceUsd
  })
  
  const networkFee = computed(() => {
    return selectedNetwork.value?.feeUsd || 0
  })
  
  const processingFee = computed(() => {
    if (!amount.value) return 0
    return (amount.value * 0.01).toFixed(2)
  })
  
  const netAmount = computed(() => {
    if (!amount.value) return '0.00'
    return (amount.value - networkFee.value - parseFloat(processingFee.value)).toFixed(2)
  })
  
  const netCryptoAmount = computed(() => {
    if (!netAmount.value || !selectedCrypto.value) return '0'
    return (parseFloat(netAmount.value) / selectedCrypto.value.price).toFixed(6)
  })
  
  const isStep2Valid = computed(() => {
    return walletAddress.value.length > 10 &&
           amount.value >= 20 &&
           amount.value <= maxWithdrawal.value &&
           selectedNetwork.value
  })
  
  const withdrawalSummary = computed(() => [
    { label: 'Cryptocurrency', value: `${selectedCrypto.value?.name} (${selectedCrypto.value?.symbol})` },
    { label: 'Network', value: selectedNetwork.value?.name },
    { label: 'Withdrawal Amount', value: `$${formatAmount(amount.value)}` },
    { label: 'Network Fee', value: `-$${networkFee.value}`, class: 'text-red-500' },
    { label: 'Processing Fee (1%)', value: `-$${processingFee.value}`, class: 'text-red-500' },
    { label: 'You Receive', value: `$${netAmount.value}`, class: 'text-amber-500' },
    { label: 'Wallet Address', value: truncateAddress(walletAddress.value) },
    { label: 'Estimated Time', value: 'Within 24 hours' }
  ])
  
  // ─────────────────────────────────────────────────────────────
  // METHODS
  // ─────────────────────────────────────────────────────────────
  const selectCrypto = (crypto) => {
    selectedCrypto.value = crypto
    selectedNetwork.value = crypto.networks[0]
  }
  
  const nextStep = () => {
    if (currentStep.value < 4) {
      currentStep.value++
    }
  }
  
  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }
  
  const withdrawMax = () => {
    if (maxWithdrawal.value > 0) {
      amount.value = maxWithdrawal.value
    }
  }
  
  const pasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText()
      walletAddress.value = text
    } catch (err) {
      // Clipboard API not available
    }
  }
  
  const submitWithdrawal = () => {
    currentStep.value = 4
  }
  
  const resetWithdrawal = () => {
    currentStep.value = 1
    selectedCrypto.value = null
    selectedNetwork.value = null
    amount.value = null
    walletAddress.value = ''
    searchQuery.value = ''
    confirmChecked.value = false
  }
  
  const formatBalance = (val) => {
    if (!val) return '0.00'
    return parseFloat(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  
  const formatAmount = (val) => {
    if (!val) return '0.00'
    return parseFloat(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  
  const truncateAddress = (addr) => {
    if (!addr) return ''
    if (addr.length <= 20) return addr
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`
  }
  </script>
  
  <style scoped>
  /* Smooth transitions */
  .step-transition-enter-active,
  .step-transition-leave-active {
    transition: all 0.3s ease;
  }
  
  .step-transition-enter-from {
    opacity: 0;
    transform: translateX(20px);
  }
  
  .step-transition-leave-to {
    opacity: 0;
    transform: translateX(-20px);
  }
  
  /* Remove number input spinners */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
  
  /* Pulse animation for success */
  @keyframes pulse-ring {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(1.4);
      opacity: 0;
    }
  }
  
  .animate-ping {
    animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  /* Checkbox styling */
  input[type="checkbox"] {
    accent-color: #bb914a;
    cursor: pointer;
  }
  
  /* Table scrollbar */
  .overflow-x-auto::-webkit-scrollbar {
    height: 6px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: rgba(187, 145, 74, 0.3);
    border-radius: 10px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(187, 145, 74, 0.5);
  }
  </style>