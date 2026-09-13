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
            <!-- Step Circle -->
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
  
            <!-- Connector Line -->
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
              <!-- Crypto Icon -->
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" :style="{ background: crypto.bgColor }">
                <img v-if="crypto.icon" :src="crypto.icon" :alt="crypto.name" class="w-8 h-8" />
                <span v-else class="text-2xl" v-html="crypto.emoji"></span>
              </div>
  
              <!-- Crypto Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-gray-800 dark:text-white">{{ crypto.symbol }}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-white/40">
                    {{ crypto.network }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 dark:text-white/40 truncate">{{ crypto.name }}</p>
              </div>
  
              <!-- Selected Checkmark -->
              <div 
                v-if="selectedCrypto?.symbol === crypto.symbol"
                class="w-6 h-6 rounded-full bg-gold-500 dark:bg-amber-500 flex items-center justify-center flex-shrink-0"
              >
                <i class="bi bi-check-lg text-white text-sm"></i>
              </div>
            </button>
          </div>
  
          <!-- Empty State -->
          <div v-if="filteredCryptos.length === 0" class="text-center py-12">
            <i class="bi bi-search text-5xl text-gray-300 dark:text-white/20"></i>
            <p class="text-gray-500 dark:text-white/40 mt-4">No cryptocurrencies found</p>
          </div>
  
          <!-- Continue Button -->
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
  
        <!-- STEP 2: Enter Amount & Network -->
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
              <p class="text-xs text-gray-500 dark:text-white/40">Choose your deposit amount and network</p>
            </div>
          </div>
  
          <!-- Selected Crypto Summary -->
          <div class="flex items-center gap-4 p-4 rounded-2xl mb-6
                      bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
            <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" :style="{ background: selectedCrypto?.bgColor }">
              <span class="text-2xl" v-html="selectedCrypto?.emoji"></span>
            </div>
            <div class="flex-1">
              <p class="text-xs text-gray-500 dark:text-white/40">Selected cryptocurrency</p>
              <p class="font-bold text-gray-800 dark:text-white">{{ selectedCrypto?.name }} ({{ selectedCrypto?.symbol }})</p>
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
                  <p class="text-xs text-gray-500 dark:text-white/40">{{ network.fee }}</p>
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
  
          <!-- Amount Input -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-3">
              Amount (USD)
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 font-semibold">$</span>
              <input 
                v-model="amount"
                type="number"
                placeholder="0.00"
                min="10"
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
                class="py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                       bg-gray-50 hover:bg-gold-500/10 border border-gray-100 hover:border-gold-300 text-gray-600 hover:text-gold-600
                       dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-white/60 dark:hover:text-amber-400 dark:hover:border-amber-500/30"
              >
                ${{ quick.toLocaleString() }}
              </button>
            </div>
  
            <p v-if="amount && amount < 10" class="text-xs text-red-500 mt-2">
              <i class="bi bi-exclamation-circle mr-1"></i>Minimum deposit is $10.00
            </p>
          </div>
  
          <!-- Conversion Preview -->
          <div v-if="amount && amount >= 10" class="p-4 rounded-xl mb-6
                                                   bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-gray-500 dark:text-white/40">You will send approximately</span>
              <span class="font-bold text-gray-800 dark:text-white">
                {{ cryptoAmount }} {{ selectedCrypto?.symbol }}
              </span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500 dark:text-white/40">Network fee</span>
              <span class="font-semibold text-gray-700 dark:text-white/70">
                {{ selectedNetwork?.feeAmount }} {{ selectedCrypto?.symbol }}
              </span>
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
              :disabled="!amount || amount < 10 || !selectedNetwork"
              class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
            >
              Continue <i class="bi bi-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
  
        <!-- STEP 3: Payment / Wallet Address -->
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
              <p class="text-xs text-gray-500 dark:text-white/40">Send {{ cryptoAmount }} {{ selectedCrypto?.symbol }} to the address below</p>
            </div>
          </div>
  
          <!-- Warning -->
          <div class="flex items-start gap-3 p-4 rounded-2xl mb-6
                      bg-amber-500/[0.06] border border-amber-500/[0.15]">
            <i class="bi bi-exclamation-triangle-fill text-amber-500 text-lg flex-shrink-0 mt-0.5"></i>
            <div class="text-sm">
              <p class="font-bold text-amber-500 mb-1">Important</p>
              <p class="text-gray-700 dark:text-white/70">
                Send only <strong>{{ selectedCrypto?.symbol }}</strong> via the <strong>{{ selectedNetwork?.name }}</strong> network. 
                Sending any other currency or network may result in permanent loss of funds.
              </p>
            </div>
          </div>
  
          <!-- QR Code & Address -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- QR Code -->
            <div class="flex flex-col items-center justify-center p-6 rounded-2xl
                        bg-white border-2 border-dashed border-gray-200
                        dark:bg-white/[0.03] dark:border-white/[0.08]">
              <div class="w-48 h-48 rounded-xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-4 relative overflow-hidden">
                <!-- Simple QR representation (replace with real QR code) -->
                <div class="grid grid-cols-8 gap-1 p-4">
                  <div v-for="i in 64" :key="i" 
                       class="w-3 h-3 rounded-sm"
                       :class="Math.random() > 0.5 ? 'bg-gray-800 dark:bg-white' : 'bg-transparent'"
                  ></div>
                </div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-14 h-14 rounded-full flex items-center justify-center shadow-xl" :style="{ background: selectedCrypto?.bgColor }">
                    <span class="text-2xl" v-html="selectedCrypto?.emoji"></span>
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-white/40 text-center">
                Scan with your wallet app
              </p>
            </div>
  
            <!-- Address & Amount -->
            <div class="flex flex-col justify-between">
              <!-- Wallet Address -->
              <div class="mb-4">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
                  Wallet Address
                </label>
                <div class="flex items-center gap-2 p-3 rounded-xl
                            bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
                  <code class="flex-1 text-xs md:text-sm font-mono text-gray-700 dark:text-white/80 truncate">
                    {{ walletAddress }}
                  </code>
                  <button 
                    @click="copyAddress"
                    class="px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200
                           bg-gold-500/10 text-gold-600 hover:bg-gold-500/20
                           dark:bg-amber-500/[0.1] dark:text-amber-400 dark:hover:bg-amber-500/[0.2]"
                  >
                    <i class="bi bi-copy"></i> Copy
                  </button>
                </div>
              </div>
  
              <!-- Amount to Send -->
              <div class="mb-4">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
                  Amount to Send
                </label>
                <div class="flex items-center gap-2 p-3 rounded-xl
                            bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
                  <span class="flex-1 font-bold text-gray-800 dark:text-white">
                    {{ cryptoAmount }} {{ selectedCrypto?.symbol }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-white/40">
                    ≈ ${{ amount }} USD
                  </span>
                </div>
              </div>
  
              <!-- Countdown Timer -->
              <div class="p-3 rounded-xl
                          bg-blue-50 dark:bg-blue-500/[0.08] border border-blue-200 dark:border-blue-500/[0.15]">
                <div class="flex items-center gap-2 text-sm">
                  <i class="bi bi-clock text-blue-500"></i>
                  <span class="text-blue-700 dark:text-blue-400 font-medium">
                    Expires in <span class="font-bold">{{ formatTime(timeLeft) }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Info Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
              <div class="flex items-center gap-2 mb-2">
                <i class="bi bi-lightning-charge-fill text-amber-500"></i>
                <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Speed</span>
              </div>
              <p class="text-sm text-gray-700 dark:text-white/70">10-30 minutes</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
              <div class="flex items-center gap-2 mb-2">
                <i class="bi bi-check-circle-fill text-emerald-500"></i>
                <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Confirmations</span>
              </div>
              <p class="text-sm text-gray-700 dark:text-white/70">2 required</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
              <div class="flex items-center gap-2 mb-2">
                <i class="bi bi-shield-check text-blue-500"></i>
                <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Security</span>
              </div>
              <p class="text-sm text-gray-700 dark:text-white/70">Fully encrypted</p>
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
              @click="markAsPaid"
              class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
                     hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%); background-size: 200% auto; color: white;"
            >
              <i class="bi bi-check-circle mr-1"></i> I've Sent the Payment
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
            Payment Submitted!
          </h3>
          <p class="text-gray-500 dark:text-white/40 max-w-md mx-auto mb-8">
            Your deposit of <strong class="text-amber-500">${{ amount }} USD</strong> 
            ({{ cryptoAmount }} {{ selectedCrypto?.symbol }}) is being processed. 
            You'll receive a confirmation once the network confirms the transaction.
          </p>
  
          <!-- Summary Card -->
          <div class="max-w-md mx-auto p-5 rounded-2xl mb-8 text-left
                      bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-white/40">Transaction ID</span>
                <span class="font-mono font-semibold text-gray-800 dark:text-white text-xs">#DEP-{{ Date.now() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-white/40">Cryptocurrency</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ selectedCrypto?.symbol }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-white/40">Network</span>
                <span class="font-semibold text-gray-800 dark:text-white">{{ selectedNetwork?.name }}</span>
              </div>
              <div class="flex justify-between text-sm pt-3 border-t border-gray-200 dark:border-white/[0.06]">
                <span class="text-gray-500 dark:text-white/40">Amount</span>
                <span class="font-bold text-lg text-amber-500">${{ amount }} USD</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-white/40">Status</span>
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-600 dark:bg-amber-500/[0.08] dark:text-amber-400">
                  <i class="bi bi-clock mr-1"></i>Pending
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
              @click="resetDeposit"
              class="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
            >
              <i class="bi bi-plus-circle mr-1"></i> Make Another Deposit
            </button>
          </div>
        </div>
      </Transition>
  
      <!-- Recent Deposits History -->
      <div v-if="currentStep === 1" class="mt-6 rounded-2xl overflow-hidden
                                            bg-white border border-gray-100 shadow-sm
                                            dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="flex items-center justify-between p-5 md:p-6">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                        bg-gold-500/10 dark:bg-blue-500/[0.08]">
              <i class="bi bi-clock-history text-blue-400 text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white">
                Recent Deposits
              </h3>
              <p class="text-xs text-gray-400 dark:text-white/40">
                Your last deposit transactions
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
                v-for="deposit in recentDeposits" 
                :key="deposit.id" 
                class="transition-colors duration-200 border-b
                       border-gray-100 hover:bg-gray-50
                       dark:border-white/[0.03] dark:hover:bg-white/[0.03]"
              >
                <td class="py-4 px-5 md:px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" :style="{ background: deposit.bgColor }">
                      <span class="text-xl" v-html="deposit.emoji"></span>
                    </div>
                    <div>
                      <span class="text-sm font-semibold block text-gray-800 dark:text-white/90">{{ deposit.symbol }}</span>
                      <span class="text-xs text-gray-400 dark:text-white/30">{{ deposit.network }}</span>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-5 md:px-6 text-sm font-bold text-gray-800 dark:text-white">
                  ${{ deposit.amount }}
                </td>
                <td class="py-4 px-5 md:px-6">
                  <span 
                    class="px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
                    :class="deposit.status === 'Completed' 
                      ? 'bg-green-50 text-green-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400'
                      : 'bg-yellow-50 text-yellow-600 dark:bg-amber-500/[0.08] dark:text-amber-400'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="deposit.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                    {{ deposit.status }}
                  </span>
                </td>
                <td class="py-4 px-5 md:px-6 text-sm text-gray-500 dark:text-white/30">
                  {{ deposit.date }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  
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
  const timeLeft = ref(1800) // 30 minutes in seconds
  let timerInterval = null
  
  const steps = [
    { id: 1, name: 'Select Crypto', icon: 'bi bi-currency-bitcoin' },
    { id: 2, name: 'Amount', icon: 'bi bi-cash-coin' },
    { id: 3, name: 'Payment', icon: 'bi bi-credit-card' },
    { id: 4, name: 'Confirm', icon: 'bi bi-check-circle' }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // CRYPTOCURRENCIES
  // ─────────────────────────────────────────────────────────────
  const cryptocurrencies = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      network: 'Bitcoin',
      emoji: '₿',
      bgColor: '#F7931A',
      networks: [
        { name: 'Bitcoin', fee: '~0.0002 BTC', feeAmount: '0.0002' },
        { name: 'Lightning', fee: '~0.00001 BTC', feeAmount: '0.00001' }
      ],
      price: 67420.50
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      network: 'ERC20',
      emoji: 'Ξ',
      bgColor: '#627EEA',
      networks: [
        { name: 'ERC20', fee: '~0.005 ETH', feeAmount: '0.005' },
        { name: 'Arbitrum', fee: '~0.0001 ETH', feeAmount: '0.0001' },
        { name: 'Optimism', fee: '~0.0001 ETH', feeAmount: '0.0001' }
      ],
      price: 3245.80
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      network: 'TRC20',
      emoji: '₮',
      bgColor: '#26A17B',
      networks: [
        { name: 'TRC20', fee: '~1 USDT', feeAmount: '1' },
        { name: 'ERC20', fee: '~5 USDT', feeAmount: '5' },
        { name: 'BEP20', fee: '~0.5 USDT', feeAmount: '0.5' }
      ],
      price: 1.00
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      network: 'ERC20',
      emoji: '$',
      bgColor: '#2775CA',
      networks: [
        { name: 'ERC20', fee: '~3 USDC', feeAmount: '3' },
        { name: 'Polygon', fee: '~0.1 USDC', feeAmount: '0.1' },
        { name: 'Solana', fee: '~0.01 USDC', feeAmount: '0.01' }
      ],
      price: 1.00
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      network: 'BEP20',
      emoji: '⬢',
      bgColor: '#F3BA2F',
      networks: [
        { name: 'BEP20', fee: '~0.001 BNB', feeAmount: '0.001' }
      ],
      price: 598.40
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      network: 'Solana',
      emoji: '◎',
      bgColor: '#14F195',
      networks: [
        { name: 'Solana', fee: '~0.00001 SOL', feeAmount: '0.00001' }
      ],
      price: 168.90
    },
    {
      symbol: 'XRP',
      name: 'Ripple',
      network: 'XRP Ledger',
      emoji: '✕',
      bgColor: '#23292F',
      networks: [
        { name: 'XRP Ledger', fee: '~0.00002 XRP', feeAmount: '0.00002' }
      ],
      price: 0.62
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      network: 'Cardano',
      emoji: '₳',
      bgColor: '#0033AD',
      networks: [
        { name: 'Cardano', fee: '~0.17 ADA', feeAmount: '0.17' }
      ],
      price: 0.45
    },
    {
      symbol: 'DOGE',
      name: 'Dogecoin',
      network: 'Dogecoin',
      emoji: 'Ð',
      bgColor: '#C2A633',
      networks: [
        { name: 'Dogecoin', fee: '~1 DOGE', feeAmount: '1' }
      ],
      price: 0.16
    },
    {
      symbol: 'TRX',
      name: 'TRON',
      network: 'TRC20',
      emoji: '⚡',
      bgColor: '#EF0027',
      networks: [
        { name: 'TRC20', fee: '~1 TRX', feeAmount: '1' }
      ],
      price: 0.13
    },
    {
      symbol: 'MATIC',
      name: 'Polygon',
      network: 'Polygon',
      emoji: '⬟',
      bgColor: '#8247E5',
      networks: [
        { name: 'Polygon', fee: '~0.01 MATIC', feeAmount: '0.01' },
        { name: 'ERC20', fee: '~5 MATIC', feeAmount: '5' }
      ],
      price: 0.89
    },
    {
      symbol: 'LTC',
      name: 'Litecoin',
      network: 'Litecoin',
      emoji: 'Ł',
      bgColor: '#BFBBBB',
      networks: [
        { name: 'Litecoin', fee: '~0.001 LTC', feeAmount: '0.001' }
      ],
      price: 85.30
    }
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
  
  const cryptoAmount = computed(() => {
    if (!amount.value || !selectedCrypto.value) return '0'
    const amountInCrypto = amount.value / selectedCrypto.value.price
    return amountInCrypto.toFixed(6)
  })
  
  const walletAddress = computed(() => {
    if (!selectedCrypto.value) return ''
    const addresses = {
      'BTC': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      'ETH': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      'USDT': 'TN9RRaXkCFtTXRso2GdTZxSxxwBqNvVvVv',
      'USDC': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      'BNB': 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
      'SOL': 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
      'XRP': 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      'ADA': 'addr1qxck9c9v0qmsf7z8vkwmj4dvgmm3h2gzs2w8d0x5jn6k5zjxhxhxvzn',
      'DOGE': 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L',
      'TRX': 'TN9RRaXkCFtTXRso2GdTZxSxxwBqNvVvVv',
      'MATIC': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      'LTC': 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    }
    return addresses[selectedCrypto.value.symbol] || '0x0000000000000000000000000000000000000000'
  })
  
  const recentDeposits = [
    { id: 1, symbol: 'BTC', network: 'Bitcoin', amount: '500.00', status: 'Completed', date: '2026-08-10', emoji: '₿', bgColor: '#F7931A' },
    { id: 2, symbol: 'ETH', network: 'ERC20', amount: '1,200.00', status: 'Completed', date: '2026-08-08', emoji: 'Ξ', bgColor: '#627EEA' },
    { id: 3, symbol: 'USDT', network: 'TRC20', amount: '800.00', status: 'Pending', date: '2026-08-06', emoji: '₮', bgColor: '#26A17B' },
    { id: 4, symbol: 'SOL', network: 'Solana', amount: '350.00', status: 'Completed', date: '2026-08-04', emoji: '◎', bgColor: '#14F195' }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // METHODS
  // ─────────────────────────────────────────────────────────────
  const selectCrypto = (crypto) => {
    selectedCrypto.value = crypto
    selectedNetwork.value = crypto.networks[0] // Auto-select first network
  }
  
  const nextStep = () => {
    if (currentStep.value < 4) {
      currentStep.value++
      if (currentStep.value === 3) {
        startTimer()
      }
    }
  }
  
  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
      if (currentStep.value < 3) {
        stopTimer()
      }
    }
  }
  
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress.value)
      // Show feedback - could add a toast here
    } catch (err) {
      // Fallback for older browsers
      const input = document.createElement('textarea')
      input.value = walletAddress.value
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
  }
  
  const markAsPaid = () => {
    stopTimer()
    currentStep.value = 4
  }
  
  const resetDeposit = () => {
    currentStep.value = 1
    selectedCrypto.value = null
    selectedNetwork.value = null
    amount.value = null
    searchQuery.value = ''
    timeLeft.value = 1800
  }
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const startTimer = () => {
    timeLeft.value = 1800
    stopTimer()
    timerInterval = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        stopTimer()
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
  // LIFECYCLE
  // ─────────────────────────────────────────────────────────────
  onUnmounted(() => {
    stopTimer()
  })
  </script>
  
  <style scoped>
  /* Smooth transitions for step changes */
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
  
  /* Scrollbar for crypto grid */
  .crypto-grid::-webkit-scrollbar {
    width: 6px;
  }
  
  .crypto-grid::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .crypto-grid::-webkit-scrollbar-thumb {
    background: rgba(187, 145, 74, 0.3);
    border-radius: 10px;
  }
  </style>