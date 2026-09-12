<template>
    <div class="space-y-4 md:space-y-6">
      
      <!-- Saved Wallets -->
      <div class="rounded-2xl p-5 md:p-6
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                        bg-gold-500/10 dark:bg-amber-500/[0.08]">
              <i class="bi bi-wallet2 text-amber-500 text-lg"></i>
            </div>
            <div>
              <h2 class="font-bold text-lg text-gray-800 dark:text-white">Saved Wallets</h2>
              <p class="text-xs text-gray-400 dark:text-white/40">Manage your withdrawal addresses</p>
            </div>
          </div>
          <button 
            @click="showAddWallet = true"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
          >
            <i class="bi bi-plus-circle"></i>
            <span class="hidden sm:inline">Add Wallet</span>
          </button>
        </div>
  
        <div class="space-y-3">
          <div 
            v-for="wallet in savedWallets" 
            :key="wallet.id"
            class="flex items-center gap-4 p-4 rounded-xl
                   bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]"
          >
            <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold"
                 :style="{ background: wallet.bgColor, color: wallet.textColor }">
              <span class="text-2xl" v-html="wallet.emoji"></span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <p class="font-bold text-sm text-gray-800 dark:text-white">{{ wallet.symbol }}</p>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-white/40">
                  {{ wallet.network }}
                </span>
                <span v-if="wallet.primary" class="px-2 py-0.5 rounded-full text-xs font-bold
                                                    bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/[0.15] dark:text-emerald-400">
                  <i class="bi bi-star-fill mr-1"></i>Primary
                </span>
              </div>
              <p class="text-xs font-mono text-gray-500 dark:text-white/40 truncate">
                {{ wallet.address }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="copyAddress(wallet.address)"
                class="w-9 h-9 rounded-xl flex items-center justify-center transition-colors
                       bg-white dark:bg-white/[0.06] hover:bg-gray-100 dark:hover:bg-white/[0.1]
                       text-gray-500 dark:text-white/50"
                title="Copy"
              >
                <i class="bi bi-copy text-sm"></i>
              </button>
              <button 
                @click="deleteWallet(wallet.id)"
                class="w-9 h-9 rounded-xl flex items-center justify-center transition-colors
                       bg-white dark:bg-white/[0.06] hover:bg-red-50 dark:hover:bg-red-500/[0.1]
                       text-gray-500 hover:text-red-500 dark:text-white/50 dark:hover:text-red-400"
                title="Delete"
              >
                <i class="bi bi-trash text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add Wallet Modal -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div 
          v-if="showAddWallet"
          class="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="showAddWallet = false"
        >
          <div class="w-full max-w-md rounded-3xl overflow-hidden
                      bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">
            
            <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/[0.06]">
              <h3 class="font-bold text-lg text-gray-800 dark:text-white">Add New Wallet</h3>
              <button 
                @click="showAddWallet = false"
                class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/[0.06]"
              >
                <i class="bi bi-x-lg text-gray-500 dark:text-white/40 text-sm"></i>
              </button>
            </div>
  
            <div class="p-5 space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">Cryptocurrency</label>
                <select 
                  v-model="newWallet.symbol"
                  class="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer
                         bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                         dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT)</option>
                  <option value="USDC">USD Coin (USDC)</option>
                  <option value="SOL">Solana (SOL)</option>
                </select>
              </div>
  
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">Network</label>
                <select 
                  v-model="newWallet.network"
                  class="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer
                         bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                         dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
                >
                  <option value="Bitcoin">Bitcoin</option>
                  <option value="ERC20">ERC20</option>
                  <option value="TRC20">TRC20</option>
                  <option value="BEP20">BEP20</option>
                  <option value="Solana">Solana</option>
                </select>
              </div>
  
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">Wallet Address</label>
                <input 
                  v-model="newWallet.address"
                  type="text"
                  placeholder="Enter wallet address"
                  class="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none
                         bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                         dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
                >
              </div>
  
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">Label (optional)</label>
                <input 
                  v-model="newWallet.label"
                  type="text"
                  placeholder="e.g. My Binance Wallet"
                  class="w-full px-4 py-3 rounded-xl text-sm outline-none
                         bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                         dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
                >
              </div>
  
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="newWallet.primary"
                  class="w-4 h-4 rounded accent-amber-500"
                >
                <span class="text-sm text-gray-700 dark:text-white/70">Set as primary wallet</span>
              </label>
            </div>
  
            <div class="p-5 border-t border-gray-100 dark:border-white/[0.06] flex gap-3">
              <button 
                @click="showAddWallet = false"
                class="flex-1 py-3 rounded-xl font-semibold text-sm
                       bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                       hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors"
              >
                Cancel
              </button>
              <button 
                @click="addWallet"
                class="flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300
                       hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
                style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
              >
                Add Wallet
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const showAddWallet = ref(false)
  
  const savedWallets = ref([
    { 
      id: 1, 
      symbol: 'BTC', 
      network: 'Bitcoin', 
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      emoji: '₿',
      bgColor: '#F7931A',
      textColor: 'white',
      primary: true
    },
    { 
      id: 2, 
      symbol: 'ETH', 
      network: 'ERC20', 
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      emoji: 'Ξ',
      bgColor: '#627EEA',
      textColor: 'white',
      primary: false
    },
    { 
      id: 3, 
      symbol: 'USDT', 
      network: 'TRC20', 
      address: 'TN9RRaXkCFtTXRso2GdTZxSxxwBqNvVvVv',
      emoji: '₮',
      bgColor: '#26A17B',
      textColor: 'white',
      primary: false
    }
  ])
  
  const newWallet = ref({
    symbol: 'BTC',
    network: 'Bitcoin',
    address: '',
    label: '',
    primary: false
  })
  
  const copyAddress = async (address) => {
    try {
      await navigator.clipboard.writeText(address)
    } catch (err) {}
  }
  
  const deleteWallet = (id) => {
    if (confirm('Delete this wallet address?')) {
      savedWallets.value = savedWallets.value.filter(w => w.id !== id)
    }
  }
  
  const addWallet = () => {
    if (!newWallet.value.address) return
    
    const cryptos = {
      BTC: { emoji: '₿', bgColor: '#F7931A', textColor: 'white' },
      ETH: { emoji: 'Ξ', bgColor: '#627EEA', textColor: 'white' },
      USDT: { emoji: '₮', bgColor: '#26A17B', textColor: 'white' },
      USDC: { emoji: '$', bgColor: '#2775CA', textColor: 'white' },
      SOL: { emoji: '◎', bgColor: '#14F195', textColor: '#020862' }
    }
    
    const crypto = cryptos[newWallet.value.symbol]
    
    savedWallets.value.push({
      id: Date.now(),
      symbol: newWallet.value.symbol,
      network: newWallet.value.network,
      address: newWallet.value.address,
      emoji: crypto.emoji,
      bgColor: crypto.bgColor,
      textColor: crypto.textColor,
      primary: newWallet.value.primary
    })
    
    showAddWallet.value = false
    newWallet.value = { symbol: 'BTC', network: 'Bitcoin', address: '', label: '', primary: false }
  }
  </script>