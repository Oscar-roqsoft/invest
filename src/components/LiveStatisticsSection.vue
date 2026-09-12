<template>
    <section id="live-statistics-section" class="bg-primary-900 py-12 md:py-16 px-4 md:px-6">
      <div class="live-stats-container max-w-6xl mx-auto">
        <h2 class="live-stats-title text-center text-gold-500 font-oswald uppercase font-medium text-2xl md:text-3xl lg:text-4xl mb-8 md:mb-10">
          Live Statistics
        </h2>
        
        <div class="live-stats-row flex flex-wrap gap-4 md:gap-6">
          <!-- Last Deposits -->
          <div class="live-stats-col flex-1 min-w-[280px] md:min-w-[320px]">
            <div class="live-stats-card bg-white/5 border border-gold-500/35 rounded-xl overflow-hidden h-full">
              <h3 class="m-0 px-4 md:px-6 py-4 bg-gold-500/12 border-b border-gold-500/35 text-gold-500 font-oswald uppercase text-base md:text-lg font-medium">
                Last Deposits
              </h3>
              <div class="live-stats-table-wrap max-h-[21rem] overflow-y-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr>
                      <th class="text-left px-4 md:px-6 py-2 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">User</th>
                      <th class="text-left px-4 md:px-6 py-2 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">Amount</th>
                      <th class="text-left px-4 md:px-6 py-2 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="deposit in deposits" :key="deposit.id" class="border-b border-white/5 last:border-none">
                      <td class="px-4 md:px-6 py-2.5 text-sm text-gray-200 whitespace-nowrap">{{ deposit.user }}</td>
                      <td class="px-4 md:px-6 py-2.5 text-sm text-green-400 font-semibold whitespace-nowrap">${{ deposit.amount }}</td>
                      <td class="px-4 md:px-6 py-2.5 whitespace-nowrap">
                        <img 
                          :src="deposit.icon" 
                          alt="status" 
                          class="inline-block align-middle"
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
  
          <!-- Last Withdrawals -->
          <div class="live-stats-col flex-1 min-w-[280px] md:min-w-[320px]">
            <div class="live-stats-card bg-white/5 border border-gold-500/35 rounded-xl overflow-hidden h-full">
              <h3 class="m-0 px-4 md:px-6 py-4 bg-gold-500/12 border-b border-gold-500/35 text-gold-500 font-oswald uppercase text-base md:text-lg font-medium">
                Last Withdrawals
              </h3>
              <div class="live-stats-table-wrap max-h-[21rem] overflow-y-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr>
                      <th class="text-left px-4 md:px-6 py-2 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">User</th>
                      <th class="text-left px-4 md:px-6 py-2 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">Amount</th>
                      <th class="text-left px-4 md:px-6 py-2 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="withdrawal in withdrawals" :key="withdrawal.id" class="border-b border-white/5 last:border-none">
                      <td class="px-4 md:px-6 py-2.5 text-sm text-gray-200 whitespace-nowrap">{{ withdrawal.user }}</td>
                      <td class="px-4 md:px-6 py-2.5 text-sm text-green-400 font-semibold whitespace-nowrap">${{ withdrawal.amount }}</td>
                      <td class="px-4 md:px-6 py-2.5 whitespace-nowrap">
                        <img 
                          :src="withdrawal.icon" 
                          alt="status" 
                          class="inline-block align-middle"
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  // Sample data - in a real application, this would come from an API
  const deposits = [
    { id: 1, user: 'Pourabasi', amount: '50.00', icon: '/images/1002.gif?test=1' },
    { id: 2, user: 'Maryam69', amount: '500.00', icon: '/images/1004.gif?test=1' },
    { id: 3, user: 'Pourabasi', amount: '56.00', icon: '/images/1002.gif?test=1' },
    { id: 4, user: 'Reza', amount: '845.00', icon: '/images/1002.gif?test=1' },
    { id: 5, user: 'Pourabasi', amount: '54.68', icon: '/images/1002.gif?test=1' },
    { id: 6, user: 'Avafarah55', amount: '500.00', icon: '/images/1000.gif?test=1' },
    { id: 7, user: 'Pourabasi', amount: '53.00', icon: '/images/1002.gif?test=1' },
    { id: 8, user: 'Jonathan54', amount: '500.00', icon: '/images/1004.gif?test=1' },
    { id: 9, user: 'Pourabasi', amount: '51.54', icon: '/images/1002.gif?test=1' },
    { id: 10, user: 'Pourabasi', amount: '50.00', icon: '/images/1002.gif?test=1' }
  ]
  
  const withdrawals = [
    { id: 1, user: 'Pourabasi', amount: '8.00', icon: '/images/1002.gif?test=1' },
    { id: 2, user: 'Avafarah55', amount: '515.00', icon: '/images/1004.gif?test=1' },
    { id: 3, user: 'Avafarah55', amount: '400.00', icon: '/images/1004.gif?test=1' },
    { id: 4, user: 'Fariba1', amount: '400.00', icon: '/images/1004.gif?test=1' },
    { id: 5, user: 'Nahid', amount: '400.00', icon: '/images/1004.gif?test=1' },
    { id: 6, user: 'Megan', amount: '207.00', icon: '/images/1000.gif?test=1' },
    { id: 7, user: 'Mohammed', amount: '1000.00', icon: '/images/1004.gif?test=1' },
    { id: 8, user: 'Pourabasi', amount: '3.00', icon: '/images/1002.gif?test=1' },
    { id: 9, user: 'Maryam69', amount: '103.00', icon: '/images/1004.gif?test=1' },
    { id: 10, user: 'Gauthier', amount: '452.00', icon: '/images/1004.gif?test=1' }
  ]
  </script>
  
  <style scoped>
  .live-stats-table-wrap {
    max-height: 21rem;
    overflow-y: auto;
  }
  
  /* Custom scrollbar styling */
  .live-stats-table-wrap::-webkit-scrollbar {
    width: 6px;
  }
  
  .live-stats-table-wrap::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  .live-stats-table-wrap::-webkit-scrollbar-thumb {
    background: rgba(187, 145, 74, 0.4);
    border-radius: 3px;
  }
  
  .live-stats-table-wrap::-webkit-scrollbar-thumb:hover {
    background: rgba(187, 145, 74, 0.6);
  }
  
  /* Firefox scrollbar */
  .live-stats-table-wrap {
    scrollbar-width: thin;
    scrollbar-color: rgba(187, 145, 74, 0.4) rgba(255, 255, 255, 0.05);
  }
  
  /* Hover effect on rows */
  .live-stats-card tbody tr:hover {
    background: rgba(187, 145, 74, 0.08);
    transition: background 0.2s ease;
  }
  
  /* Amount color */
  .live-stats-amount {
    color: #4fd68a;
    font-weight: 600;
  }
  </style>