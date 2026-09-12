<template>
    <DashboardLayout>
      <!-- Page Header -->
      <div class="my-6 md:mb-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-gold-500/10 dark:bg-blue-500/[0.08]">
              <i class="bi bi-clock-history text-amber-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Transactions</h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">View and manage all your transactions</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="exportTransactions"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                     bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
            >
              <i class="bi bi-download"></i>
              <span class="hidden sm:inline">Export</span>
            </button>
            <a 
              href="?a=deposit"
              class="flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
            >
              <i class="bi bi-plus-circle"></i>
              <span class="hidden sm:inline">New Deposit</span>
            </a>
          </div>
        </div>
      </div>
  
      <!-- Stats Overview -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div 
          v-for="stat in overviewStats" 
          :key="stat.label"
          class="rounded-2xl p-4 md:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                 bg-white border border-gray-100 shadow-sm
                 dark:bg-[#101A47] dark:border-white/[0.05]"
        >
          <div class="flex items-center gap-2 mb-3">
            <div 
              class="w-8 h-8 rounded-lg flex items-center justify-center"
              :style="{ background: stat.bgColor }"
            >
              <i :class="stat.icon" :style="{ color: stat.iconColor }" class="text-sm"></i>
            </div>
            <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white/40">
              {{ stat.label }}
            </span>
          </div>
          <p class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            {{ stat.value }}
          </p>
          <p v-if="stat.change" class="text-xs mt-1" :class="stat.changeColor">
            {{ stat.change }}
          </p>
        </div>
      </div>
  
      <!-- Main Transactions Card -->
      <div class="rounded-2xl overflow-hidden
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        
        <!-- Tabs -->
        <div class="border-b border-gray-100 dark:border-white/[0.06]">
          <div class="flex overflow-x-auto scrollbar-hide">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="relative flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all duration-200"
              :class="activeTab === tab.id 
                ? 'text-amber-500 dark:text-amber-400' 
                : 'text-gray-500 dark:text-white/40 hover:text-gray-800 dark:hover:text-white/70'"
            >
              <i :class="tab.icon" class="text-base"></i>
              {{ tab.name }}
              <span 
                v-if="tab.count"
                class="ml-1 px-2 py-0.5 rounded-full text-xs font-bold"
                :class="activeTab === tab.id 
                  ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/[0.15] dark:text-amber-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-white/40'"
              >
                {{ tab.count }}
              </span>
              <!-- Active indicator -->
              <div 
                v-if="activeTab === tab.id"
                class="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style="background: linear-gradient(90deg, #F5D77F 0%, #E6BB5C 100%);"
              ></div>
            </button>
          </div>
        </div>
  
        <!-- Filters Bar -->
        <div class="p-4 md:p-5 border-b border-gray-100 dark:border-white/[0.06]">
          <div class="flex flex-col md:flex-row gap-3">
            <!-- Search -->
            <div class="relative flex-1">
              <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 text-sm"></i>
              <input 
                v-model="searchQuery"
                type="text"
                placeholder="Search by ID, crypto, or amount..."
                class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200
                       bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:border-gold-500/50
                       dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:placeholder-white/30 dark:focus:border-blue-500/40"
              >
            </div>
  
            <!-- Status Filter -->
            <select 
              v-model="statusFilter"
              class="px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 cursor-pointer
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
  
            <!-- Date Range Filter -->
            <select 
              v-model="dateFilter"
              class="px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 cursor-pointer
                     bg-gray-50 border border-gray-200 text-gray-700 focus:border-gold-500/50
                     dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-blue-500/40"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
  
            <!-- Clear Filters -->
            <button 
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                     bg-red-50 text-red-600 hover:bg-red-100 border border-red-200
                     dark:bg-red-500/[0.08] dark:text-red-400 dark:hover:bg-red-500/[0.15] dark:border-red-500/[0.15]"
            >
              <i class="bi bi-x-circle"></i>
              <span>Clear</span>
            </button>
          </div>
        </div>
  
        <!-- Transactions Table -->
        <div v-if="filteredTransactions.length > 0">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[800px]">
              <thead class="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01]">
                <tr>
                  <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Transaction</th>
                  <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Type</th>
                  <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Amount</th>
                  <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Status</th>
                  <th class="text-left py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Date</th>
                  <th class="text-right py-4 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="tx in paginatedTransactions" 
                  :key="tx.id" 
                  class="transition-colors duration-200 border-b
                         border-gray-100 hover:bg-gray-50
                         dark:border-white/[0.03] dark:hover:bg-white/[0.03]"
                >
                  <!-- Transaction ID + Crypto -->
                  <td class="py-4 px-5 md:px-6">
                    <div class="flex items-center gap-3">
                      <div 
                        class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg"
                        :style="{ background: tx.cryptoBgColor, color: tx.cryptoTextColor || 'white' }"
                      >
                        <span v-html="tx.cryptoEmoji"></span>
                      </div>
                      <div class="min-w-0">
                        <span class="text-sm font-bold block text-gray-800 dark:text-white">
                          {{ tx.crypto }}
                        </span>
                        <span class="text-xs text-gray-400 dark:text-white/30 font-mono">
                          #{{ tx.id }}
                        </span>
                      </div>
                    </div>
                  </td>
  
                  <!-- Type -->
                  <td class="py-4 px-5 md:px-6">
                    <div class="flex items-center gap-2">
                      <div 
                        class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        :class="tx.type === 'Deposit' 
                          ? 'bg-green-50 dark:bg-emerald-500/[0.08]' 
                          : 'bg-red-50 dark:bg-red-500/[0.08]'"
                      >
                        <i 
                          :class="tx.type === 'Deposit' 
                            ? 'bi bi-arrow-down-circle text-emerald-500 text-sm' 
                            : 'bi bi-arrow-up-circle text-red-500 text-sm'"
                        ></i>
                      </div>
                      <span 
                        class="text-sm font-semibold"
                        :class="tx.type === 'Deposit' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-red-600 dark:text-red-400'"
                      >
                        {{ tx.type }}
                      </span>
                    </div>
                  </td>
  
                  <!-- Amount -->
                  <td class="py-4 px-5 md:px-6">
                    <div>
                      <span 
                        class="text-sm font-bold block"
                        :class="tx.type === 'Deposit' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-red-600 dark:text-red-400'"
                      >
                        {{ tx.type === 'Deposit' ? '+' : '-' }}${{ tx.amount }}
                      </span>
                      <span class="text-xs text-gray-400 dark:text-white/30">
                        ≈ {{ tx.cryptoAmount }} {{ tx.crypto }}
                      </span>
                    </div>
                  </td>
  
                  <!-- Status -->
                  <td class="py-4 px-5 md:px-6">
                    <span 
                      class="px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap"
                      :class="{
                        'bg-green-50 text-green-600 dark:bg-emerald-500/[0.08] dark:text-emerald-400': tx.status === 'Completed',
                        'bg-yellow-50 text-yellow-600 dark:bg-amber-500/[0.08] dark:text-amber-400': tx.status === 'Pending',
                        'bg-red-50 text-red-600 dark:bg-red-500/[0.08] dark:text-red-400': tx.status === 'Failed'
                      }"
                    >
                      <span 
                        class="w-1.5 h-1.5 rounded-full"
                        :class="{
                          'bg-emerald-500': tx.status === 'Completed',
                          'bg-amber-500': tx.status === 'Pending',
                          'bg-red-500': tx.status === 'Failed'
                        }"
                      ></span>
                      {{ tx.status }}
                    </span>
                  </td>
  
                  <!-- Date -->
                  <td class="py-4 px-5 md:px-6">
                    <div class="text-sm text-gray-700 dark:text-white/70 font-medium whitespace-nowrap">
                      {{ tx.date }}
                    </div>
                    <div class="text-xs text-gray-400 dark:text-white/30">
                      {{ tx.time }}
                    </div>
                  </td>
  
                  <!-- Action -->
                  <td class="py-4 px-5 md:px-6 text-right">
                    <button 
                      @click="viewDetails(tx)"
                      class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ml-auto
                             bg-gray-50 hover:bg-gold-500/10 text-gray-500 hover:text-gold-600
                             dark:bg-white/[0.04] dark:hover:bg-amber-500/[0.1] dark:text-white/40 dark:hover:text-amber-400"
                      title="View Details"
                    >
                      <i class="bi bi-eye text-sm"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Pagination -->
          <div class="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-5 border-t
                      border-gray-100 bg-gray-50/50
                      dark:border-white/[0.06] dark:bg-white/[0.01]">
            <div class="text-xs text-gray-500 dark:text-white/40">
              Showing <strong class="text-gray-800 dark:text-white">{{ startIndex + 1 }}</strong> 
              to <strong class="text-gray-800 dark:text-white">{{ endIndex }}</strong> 
              of <strong class="text-gray-800 dark:text-white">{{ filteredTransactions.length }}</strong> transactions
            </div>
            
            <div class="flex items-center gap-1">
              <button 
                @click="prevPage"
                :disabled="currentPage === 1"
                class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed
                       hover:bg-gray-200 text-gray-600 dark:text-white/50
                       dark:hover:bg-white/[0.06]"
              >
                <i class="bi bi-chevron-left text-sm"></i>
              </button>
              
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="currentPage = page"
                class="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200"
                :class="currentPage === page 
                  ? 'text-primary-900 shadow-md shadow-amber-500/20' 
                  : 'text-gray-600 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/[0.06]'"
                :style="currentPage === page ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%);' : ''"
              >
                {{ page }}
              </button>
              
              <button 
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed
                       hover:bg-gray-200 text-gray-600 dark:text-white/50
                       dark:hover:bg-white/[0.06]"
              >
                <i class="bi bi-chevron-right text-sm"></i>
              </button>
            </div>
          </div>
        </div>
  
        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-16 px-4">
          <div class="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-4">
            <i class="bi bi-inbox text-4xl text-gray-300 dark:text-white/20"></i>
          </div>
          <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2">No transactions found</h3>
          <p class="text-sm text-gray-500 dark:text-white/40 text-center max-w-sm mb-6">
            {{ hasActiveFilters 
              ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
              : 'You don\'t have any transactions yet. Start by making your first deposit.' }}
          </p>
          <button 
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="px-6 py-3 rounded-xl font-bold text-sm text-gray-700 dark:text-white/80
                   bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1]
                   transition-all duration-200"
          >
            <i class="bi bi-arrow-clockwise mr-1"></i> Clear Filters
          </button>
          <a 
            v-else
            href="?a=deposit"
            class="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
          >
            <i class="bi bi-plus-circle mr-1"></i> Make a Deposit
          </a>
        </div>
      </div>
  
      <!-- Transaction Details Modal -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="selectedTransaction"
          class="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="selectedTransaction = null"
        >
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
          >
            <div 
              class="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl
                     bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]"
            >
              <!-- Header -->
              <div class="relative p-6 pb-8
                          bg-gradient-to-br from-gray-50 to-gray-100
                          dark:from-white/[0.03] dark:to-white/[0.01]">
                <button 
                  @click="selectedTransaction = null"
                  class="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center
                         bg-white/80 dark:bg-white/[0.06] hover:bg-white dark:hover:bg-white/[0.12]
                         transition-colors duration-200 z-10"
                >
                  <i class="bi bi-x-lg text-gray-600 dark:text-white/60 text-sm"></i>
                </button>
                
                <div class="flex flex-col items-center text-center">
                  <div 
                    class="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 font-bold text-2xl"
                    :style="{ background: selectedTransaction.cryptoBgColor, color: selectedTransaction.cryptoTextColor || 'white' }"
                  >
                    <span v-html="selectedTransaction.cryptoEmoji"></span>
                  </div>
                  <span 
                    class="text-2xl font-bold"
                    :class="selectedTransaction.type === 'Deposit' 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'"
                  >
                    {{ selectedTransaction.type === 'Deposit' ? '+' : '-' }}${{ selectedTransaction.amount }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-white/40 mt-1">
                    ≈ {{ selectedTransaction.cryptoAmount }} {{ selectedTransaction.crypto }}
                  </span>
                </div>
              </div>
  
              <!-- Details -->
              <div class="p-6 space-y-1">
                <div 
                  v-for="detail in getTransactionDetails(selectedTransaction)" 
                  :key="detail.label"
                  class="flex justify-between items-center py-3 border-b last:border-0
                         border-gray-100 dark:border-white/[0.04]"
                >
                  <span class="text-sm text-gray-500 dark:text-white/40">{{ detail.label }}</span>
                  <span 
                    class="text-sm font-semibold text-gray-800 dark:text-white/90 text-right ml-4"
                    :class="detail.class"
                    v-html="detail.value"
                  ></span>
                </div>
              </div>
  
              <!-- Actions -->
              <div class="p-4 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.01]">
                <button 
                  @click="selectedTransaction = null"
                  class="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300"
                  style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
                >
                  Close
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  
  definePageMeta({
    layout: 'dashboard'
  })
  
  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────
  const activeTab = ref('all')
  const searchQuery = ref('')
  const statusFilter = ref('all')
  const dateFilter = ref('all')
  const currentPage = ref(1)
  const itemsPerPage = 8
  const selectedTransaction = ref(null)
  
  // ─────────────────────────────────────────────────────────────
  // TABS
  // ─────────────────────────────────────────────────────────────
  const tabs = computed(() => [
    { id: 'all', name: 'All', icon: 'bi bi-list-ul', count: allTransactions.length },
    { id: 'deposits', name: 'Deposits', icon: 'bi bi-arrow-down-circle', count: allTransactions.filter(t => t.type === 'Deposit').length },
    { id: 'withdrawals', name: 'Withdrawals', icon: 'bi bi-arrow-up-circle', count: allTransactions.filter(t => t.type === 'Withdrawal').length },
    { id: 'pending', name: 'Pending', icon: 'bi bi-clock-history', count: allTransactions.filter(t => t.status === 'Pending').length }
  ])
  
  // ─────────────────────────────────────────────────────────────
  // OVERVIEW STATS
  // ─────────────────────────────────────────────────────────────
  const overviewStats = [
    { 
      label: 'Total Deposits', 
      value: '$12,500.00', 
      icon: 'bi bi-arrow-down-circle', 
      iconColor: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      change: '+12.5% this month',
      changeColor: 'text-emerald-500'
    },
    { 
      label: 'Total Withdrawals', 
      value: '$3,850.00', 
      icon: 'bi bi-arrow-up-circle', 
      iconColor: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      change: '-2.1% this month',
      changeColor: 'text-red-500'
    },
    { 
      label: 'Net Balance', 
      value: '$8,650.00', 
      icon: 'bi bi-wallet2', 
      iconColor: '#bb914a',
      bgColor: 'rgba(187, 145, 74, 0.15)',
      change: '+8.2% this month',
      changeColor: 'text-emerald-500'
    },
    { 
      label: 'Pending', 
      value: '$1,200.00', 
      icon: 'bi bi-clock-history', 
      iconColor: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.15)',
      change: '2 transactions',
      changeColor: 'text-amber-500'
    }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // TRANSACTIONS DATA
  // ─────────────────────────────────────────────────────────────
  const allTransactions = [
    { 
      id: 'DEP-20260810-001', 
      type: 'Deposit', 
      crypto: 'BTC', 
      cryptoEmoji: '₿',
      cryptoBgColor: '#F7931A',
      cryptoTextColor: 'white',
      amount: '5,000.00', 
      cryptoAmount: '0.074158', 
      status: 'Completed', 
      date: 'Aug 10, 2026', 
      time: '14:32 PM',
      network: 'Bitcoin',
      walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      txHash: '0x4a8f7b2c9d3e1f6a8b4c2d5e9f1a3b7c'
    },
    { 
      id: 'WTH-20260809-002', 
      type: 'Withdrawal', 
      crypto: 'USDT', 
      cryptoEmoji: '₮',
      cryptoBgColor: '#26A17B',
      cryptoTextColor: 'white',
      amount: '1,200.00', 
      cryptoAmount: '1,200.00', 
      status: 'Pending', 
      date: 'Aug 9, 2026', 
      time: '09:15 AM',
      network: 'TRC20',
      walletAddress: 'TN9RRaXkCFtTXRso2GdTZxSxxwBqNvVvVv',
      txHash: 'Pending confirmation'
    },
    { 
      id: 'DEP-20260808-003', 
      type: 'Deposit', 
      crypto: 'ETH', 
      cryptoEmoji: 'Ξ',
      cryptoBgColor: '#627EEA',
      cryptoTextColor: 'white',
      amount: '2,500.00', 
      cryptoAmount: '0.770227', 
      status: 'Completed', 
      date: 'Aug 8, 2026', 
      time: '18:45 PM',
      network: 'ERC20',
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      txHash: '0x7c2e1a8b3d4f9e6c5a1b2d7e8f3c4a9b'
    },
    { 
      id: 'DEP-20260807-004', 
      type: 'Deposit', 
      crypto: 'SOL', 
      cryptoEmoji: '◎',
      cryptoBgColor: '#14F195',
      cryptoTextColor: '#020862',
      amount: '3,000.00', 
      cryptoAmount: '17.761398', 
      status: 'Completed', 
      date: 'Aug 7, 2026', 
      time: '11:20 AM',
      network: 'Solana',
      walletAddress: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
      txHash: '4xY9dKpNwZr3sT7mQbVfLcHjR2eA8nE5uK6gW1oP'
    },
    { 
      id: 'WTH-20260806-005', 
      type: 'Withdrawal', 
      crypto: 'BTC', 
      cryptoEmoji: '₿',
      cryptoBgColor: '#F7931A',
      cryptoTextColor: 'white',
      amount: '500.00', 
      cryptoAmount: '0.007416', 
      status: 'Completed', 
      date: 'Aug 6, 2026', 
      time: '16:10 PM',
      network: 'Bitcoin',
      walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      txHash: '0x8d3f5e2a9c1b4f7e6a2d5c8b3e9f1a4b'
    },
    { 
      id: 'DEP-20260805-006', 
      type: 'Deposit', 
      crypto: 'USDC', 
      cryptoEmoji: '$',
      cryptoBgColor: '#2775CA',
      cryptoTextColor: 'white',
      amount: '1,500.00', 
      cryptoAmount: '1,500.00', 
      status: 'Completed', 
      date: 'Aug 5, 2026', 
      time: '08:30 AM',
      network: 'Polygon',
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      txHash: '0x2b7c9f1a4d6e8b3c5a7e9f2d4b6c8a1e'
    },
    { 
      id: 'WTH-20260804-007', 
      type: 'Withdrawal', 
      crypto: 'ETH', 
      cryptoEmoji: 'Ξ',
      cryptoBgColor: '#627EEA',
      cryptoTextColor: 'white',
      amount: '800.00', 
      cryptoAmount: '0.246473', 
      status: 'Pending', 
      date: 'Aug 4, 2026', 
      time: '13:55 PM',
      network: 'ERC20',
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      txHash: 'Pending confirmation'
    },
    { 
      id: 'DEP-20260803-008', 
      type: 'Deposit', 
      crypto: 'BNB', 
      cryptoEmoji: '⬢',
      cryptoBgColor: '#F3BA2F',
      cryptoTextColor: '#020862',
      amount: '350.00', 
      cryptoAmount: '0.584890', 
      status: 'Completed', 
      date: 'Aug 3, 2026', 
      time: '20:12 PM',
      network: 'BEP20',
      walletAddress: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
      txHash: '0x5e8a1c4f7b9d2e6a3c5f8b1d4e7a9c2f'
    },
    { 
      id: 'WTH-20260802-009', 
      type: 'Withdrawal', 
      crypto: 'USDT', 
      cryptoEmoji: '₮',
      cryptoBgColor: '#26A17B',
      cryptoTextColor: 'white',
      amount: '450.00', 
      cryptoAmount: '450.00', 
      status: 'Failed', 
      date: 'Aug 2, 2026', 
      time: '10:40 AM',
      network: 'TRC20',
      walletAddress: 'TN9RRaXkCFtTXRso2GdTZxSxxwBqNvVvVv',
      txHash: 'Failed - insufficient network fee'
    },
    { 
      id: 'DEP-20260801-010', 
      type: 'Deposit', 
      crypto: 'XRP', 
      cryptoEmoji: '✕',
      cryptoBgColor: '#23292F',
      cryptoTextColor: 'white',
      amount: '1,000.00', 
      cryptoAmount: '1,612.903226', 
      status: 'Completed', 
      date: 'Aug 1, 2026', 
      time: '15:22 PM',
      network: 'XRP Ledger',
      walletAddress: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      txHash: '0x1a4b7c9e2f5d8a3b6c9e1f4d7a2b5c8e'
    },
    { 
      id: 'DEP-20260731-011', 
      type: 'Deposit', 
      crypto: 'ADA', 
      cryptoEmoji: '₳',
      cryptoBgColor: '#0033AD',
      cryptoTextColor: 'white',
      amount: '750.00', 
      cryptoAmount: '1,666.666667', 
      status: 'Completed', 
      date: 'Jul 31, 2026', 
      time: '12:15 PM',
      network: 'Cardano',
      walletAddress: 'addr1qxck9c9v0qmsf7z8vkwmj4dvgmm3h2gzs2w8d0x5jn6k5zjxhxhxvzn',
      txHash: '0x9c2f5a8b1d4e7a3c6b9e2f5d8a1b4c7e'
    },
    { 
      id: 'WTH-20260730-012', 
      type: 'Withdrawal', 
      crypto: 'SOL', 
      cryptoEmoji: '◎',
      cryptoBgColor: '#14F195',
      cryptoTextColor: '#020862',
      amount: '300.00', 
      cryptoAmount: '1.776183', 
      status: 'Completed', 
      date: 'Jul 30, 2026', 
      time: '09:00 AM',
      network: 'Solana',
      walletAddress: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
      txHash: '5yZ1cKpNwAr4tT8mQcVfLdHjS2eB9nF6uK7gW2oP'
    }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const filteredTransactions = computed(() => {
    let filtered = [...allTransactions]
  
    // Filter by tab
    if (activeTab.value === 'deposits') {
      filtered = filtered.filter(t => t.type === 'Deposit')
    } else if (activeTab.value === 'withdrawals') {
      filtered = filtered.filter(t => t.type === 'Withdrawal')
    } else if (activeTab.value === 'pending') {
      filtered = filtered.filter(t => t.status === 'Pending')
    }
  
    // Filter by search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(query) ||
        t.crypto.toLowerCase().includes(query) ||
        t.amount.toLowerCase().includes(query) ||
        t.status.toLowerCase().includes(query)
      )
    }
  
    // Filter by status
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter.value)
    }
  
    // Filter by date (mock filtering - in real app, use actual dates)
    if (dateFilter.value === 'today') {
      filtered = filtered.slice(0, 2)
    } else if (dateFilter.value === 'week') {
      filtered = filtered.slice(0, 8)
    } else if (dateFilter.value === 'month') {
      filtered = filtered.slice(0, 12)
    }
  
    return filtered
  })
  
  const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage))
  
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
  const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredTransactions.value.length))
  
  const paginatedTransactions = computed(() => {
    return filteredTransactions.value.slice(startIndex.value, endIndex.value)
  })
  
  const visiblePages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentPage.value
    
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
      } else if (current >= total - 2) {
        for (let i = total - 3; i <= total; i++) pages.push(i)
      } else {
        for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      }
    }
    
    return pages
  })
  
  const hasActiveFilters = computed(() => {
    return searchQuery.value || statusFilter.value !== 'all' || dateFilter.value !== 'all'
  })
  
  // ─────────────────────────────────────────────────────────────
  // METHODS
  // ─────────────────────────────────────────────────────────────
  const clearFilters = () => {
    searchQuery.value = ''
    statusFilter.value = 'all'
    dateFilter.value = 'all'
    currentPage.value = 1
  }
  
  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
  }
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
  }
  
  const viewDetails = (tx) => {
    selectedTransaction.value = tx
  }
  
  const getTransactionDetails = (tx) => {
    const statusClass = tx.status === 'Completed' 
      ? 'text-emerald-500' 
      : tx.status === 'Pending' 
        ? 'text-amber-500' 
        : 'text-red-500'
  
    return [
      { label: 'Transaction ID', value: `<span class="font-mono text-xs">${tx.id}</span>` },
      { label: 'Type', value: tx.type, class: tx.type === 'Deposit' ? 'text-emerald-500' : 'text-red-500' },
      { label: 'Cryptocurrency', value: tx.crypto },
      { label: 'Network', value: tx.network },
      { label: 'Amount (USD)', value: `$${tx.amount}` },
      { label: 'Crypto Amount', value: `${tx.cryptoAmount} ${tx.crypto}` },
      { label: 'Status', value: tx.status, class: statusClass },
      { label: 'Date & Time', value: `${tx.date} · ${tx.time}` },
      { label: 'Wallet Address', value: `<span class="font-mono text-xs">${tx.walletAddress.slice(0, 12)}...${tx.walletAddress.slice(-8)}</span>` },
      { label: 'Transaction Hash', value: `<span class="font-mono text-xs">${tx.txHash}</span>` }
    ]
  }
  
  const exportTransactions = () => {
    // In a real app, this would generate a CSV or PDF
    const csv = [
      ['ID', 'Type', 'Crypto', 'Amount', 'Status', 'Date'].join(','),
      ...filteredTransactions.value.map(t => 
        [t.id, t.type, t.crypto, t.amount, t.status, t.date].join(',')
      )
    ].join('\n')
  
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }
  
  // ─────────────────────────────────────────────────────────────
  // WATCHERS
  // ─────────────────────────────────────────────────────────────
  watch([activeTab, searchQuery, statusFilter, dateFilter], () => {
    currentPage.value = 1
  })
  </script>
  
  <style scoped>
  /* Hide scrollbar */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Table hover */
  tbody tr {
    transition: all 0.2s ease;
  }
  
  /* Remove number input spinners */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  /* Smooth scrolling for tables */
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
  
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