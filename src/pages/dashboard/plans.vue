<template>
    <DashboardLayout>
      <!-- Page Header -->
      <div class="mb-6 md:mb-8 mt-[70px]">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-gold-500/10 dark:bg-amber-500/[0.08]">
              <i class="bi bi-graph-up-arrow text-amber-500 text-lg"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Investment Plans</h1>
              <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">Choose a plan and start earning daily returns</p>
            </div>
          </div>
          <button 
            @click="showCalculator = !showCalculator"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                   bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
          >
            <i class="bi bi-calculator"></i>
            <span class="hidden sm:inline">ROI Calculator</span>
          </button>
        </div>
      </div>
  
      <!-- Portfolio Summary -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div 
          v-for="stat in portfolioStats" 
          :key="stat.label"
          class="rounded-2xl p-4 md:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                 bg-white border border-gray-100 shadow-sm
                 dark:bg-[#101A47] dark:border-white/[0.05]"
        >
          <div class="flex items-center gap-2 mb-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center" :style="{ background: stat.bgColor }">
              <i :class="stat.icon" :style="{ color: stat.iconColor }" class="text-sm"></i>
            </div>
            <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white/40">
              {{ stat.label }}
            </span>
          </div>
          <p class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{{ stat.value }}</p>
          <p v-if="stat.change" class="text-xs mt-1" :class="stat.changeColor">{{ stat.change }}</p>
        </div>
      </div>
  
      <!-- Active Investments Section -->
      <div v-if="activeInvestments.length > 0" class="mb-6 rounded-2xl overflow-hidden
                                                        bg-white border border-gray-100 shadow-sm
                                                        dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 dark:border-white/[0.06]">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                        bg-emerald-500/10 dark:bg-emerald-500/[0.08]">
              <i class="bi bi-briefcase-fill text-emerald-500 text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white">Active Investments</h3>
              <p class="text-xs text-gray-400 dark:text-white/40">Your currently running plans</p>
            </div>
          </div>
          <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/[0.15] dark:text-emerald-400">
            {{ activeInvestments.length }} Active
          </span>
        </div>
  
        <div class="p-4 md:p-6 space-y-4">
          <div 
            v-for="inv in activeInvestments" 
            :key="inv.id"
            class="rounded-2xl p-4 md:p-5
                   bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]"
          >
            <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-2xl"
                     :style="{ background: inv.bgColor, color: inv.textColor }">
                  <i :class="inv.icon"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h4 class="font-bold text-gray-800 dark:text-white">{{ inv.planName }}</h4>
                    <span class="px-2 py-0.5 rounded-full text-xs font-bold"
                          :class="inv.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/[0.15] dark:text-emerald-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-white/40'">
                      {{ inv.status === 'active' ? 'Active' : 'Completed' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-white/40">
                    Started {{ inv.startDate }} · Ends {{ inv.endDate }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-amber-500">+${{ inv.earned }}</div>
                <p class="text-xs text-gray-500 dark:text-white/40">Earned so far</p>
              </div>
            </div>
  
            <!-- Stats Row -->
            <div class="grid grid-cols-3 gap-3 mb-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-white/40 mb-0.5">Invested</p>
                <p class="font-bold text-sm text-gray-800 dark:text-white">${{ inv.amount }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-white/40 mb-0.5">Daily ROI</p>
                <p class="font-bold text-sm text-emerald-500">{{ inv.dailyRoi }}%</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-white/40 mb-0.5">Total ROI</p>
                <p class="font-bold text-sm text-amber-500">{{ inv.roi }}%</p>
              </div>
            </div>
  
            <!-- Progress Bar -->
            <div>
              <div class="flex items-center justify-between text-xs mb-2">
                <span class="text-gray-500 dark:text-white/40">Progress</span>
                <span class="font-bold text-gray-800 dark:text-white">{{ inv.progress }}%</span>
              </div>
              <div class="h-2 rounded-full bg-gray-200 dark:bg-white/[0.06] overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-1000"
                  :style="{ 
                    width: inv.progress + '%',
                    background: 'linear-gradient(90deg, #F5D77F 0%, #E6BB5C 50%, #D4A44A 100%)'
                  }"
                ></div>
              </div>
              <p class="text-xs text-gray-400 dark:text-white/30 mt-2">
                {{ inv.daysLeft }} days remaining · Next payout in {{ inv.nextPayout }}
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- ROI Calculator -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div 
          v-if="showCalculator"
          class="mb-6 rounded-2xl p-5 md:p-6
                 bg-gradient-to-br from-[#152155] via-[#101A47] to-[#0F1B4C]
                 border border-white/[0.06] shadow-2xl shadow-blue-900/40 relative overflow-hidden"
        >
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/[0.1] rounded-full blur-3xl"></div>
            <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/[0.08] rounded-full blur-3xl"></div>
          </div>
  
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-amber-500/[0.15]">
                  <i class="bi bi-calculator-fill text-amber-400 text-lg"></i>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-white">ROI Calculator</h3>
                  <p class="text-xs text-white/40">Estimate your returns before investing</p>
                </div>
              </div>
              <button 
                @click="showCalculator = false"
                class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
              >
                <i class="bi bi-x-lg text-white/40 text-sm"></i>
              </button>
            </div>
  
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Inputs -->
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                    Investment Amount
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-bold">$</span>
                    <input 
                      v-model.number="calcAmount"
                      type="number"
                      min="100"
                      class="w-full pl-9 pr-4 py-3 rounded-xl text-white font-bold outline-none
                             bg-white/[0.06] border border-white/[0.1] focus:border-amber-500/50
                             placeholder-white/20 transition-all"
                      placeholder="1000"
                    >
                  </div>
                  <div class="grid grid-cols-4 gap-1.5 mt-2">
                    <button 
                      v-for="amt in [500, 1000, 5000, 10000]" 
                      :key="amt"
                      @click="calcAmount = amt"
                      class="py-1.5 rounded-lg text-xs font-semibold transition-all
                             bg-white/[0.04] hover:bg-amber-500/[0.15] text-white/50 hover:text-amber-400"
                    >
                      ${{ amt >= 1000 ? (amt/1000) + 'k' : amt }}
                    </button>
                  </div>
                </div>
  
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                    Select Plan
                  </label>
                  <select 
                    v-model="calcPlan"
                    class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none cursor-pointer
                           bg-white/[0.06] border border-white/[0.1] focus:border-amber-500/50 transition-all"
                  >
                    <option v-for="plan in plans" :key="plan.id" :value="plan.id">
                      {{ plan.name }} - {{ plan.dailyRoi }}% daily
                    </option>
                  </select>
                </div>
              </div>
  
              <!-- Results -->
              <div class="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <div class="text-xs text-white/40 mb-1">Daily Return</div>
                  <div class="text-lg md:text-xl font-bold text-emerald-400">
                    +${{ calculatedDaily.toLocaleString() }}
                  </div>
                </div>
                <div class="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <div class="text-xs text-white/40 mb-1">Total Profit</div>
                  <div class="text-lg md:text-xl font-bold text-emerald-400">
                    +${{ calculatedProfit.toLocaleString() }}
                  </div>
                </div>
                <div class="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <div class="text-xs text-white/40 mb-1">Total Return</div>
                  <div class="text-lg md:text-xl font-bold text-amber-400">
                    ${{ calculatedTotal.toLocaleString() }}
                  </div>
                </div>
                <div class="p-4 rounded-xl bg-amber-500/[0.1] border border-amber-500/[0.2]">
                  <div class="text-xs text-amber-400/70 mb-1">ROI</div>
                  <div class="text-lg md:text-xl font-bold text-amber-400">
                    {{ calculatedRoi }}%
                  </div>
                </div>
  
                <!-- Chart Preview -->
                <div class="col-span-2 md:col-span-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold uppercase tracking-wider text-white/40">Growth Projection</span>
                    <span class="text-xs text-amber-400 font-bold">{{ calcPlanData.duration }} days</span>
                  </div>
                  <div class="flex items-end gap-1 h-20">
                    <div 
                      v-for="i in 20" 
                      :key="i"
                      class="flex-1 rounded-t transition-all duration-500"
                      :style="{ 
                        height: (10 + (i * 4.5)) + '%',
                        background: 'linear-gradient(180deg, #F5D77F 0%, #E6BB5C 50%, #D4A44A 100%)',
                        opacity: 0.4 + (i / 20) * 0.6
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
  
      <!-- Plans Grid -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-bold text-xl text-gray-800 dark:text-white">Investment Plans</h3>
            <p class="text-xs text-gray-500 dark:text-white/40">Pick a plan that suits your goals</p>
          </div>
          <div class="hidden md:flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/[0.04]">
            <button 
              v-for="view in ['grid', 'list']" 
              :key="view"
              @click="viewMode = view"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              :class="viewMode === view 
                ? 'bg-white dark:bg-white/[0.08] text-gray-800 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-white/40'"
            >
              <i :class="view === 'grid' ? 'bi bi-grid-fill' : 'bi bi-list-ul'"></i>
            </button>
          </div>
        </div>
  
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div 
            v-for="plan in plans" 
            :key="plan.id"
            class="relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden
                   bg-white border border-gray-100 shadow-sm
                   dark:bg-[#101A47] dark:border-white/[0.05]"
            :class="plan.popular ? 'ring-2 ring-amber-500/50' : ''"
          >
            <!-- Popular Badge -->
            <div 
              v-if="plan.popular"
              class="absolute top-0 right-0 px-3 py-1 rounded-bl-2xl text-xs font-bold
                     bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
            >
              <i class="bi bi-star-fill mr-1"></i>POPULAR
            </div>
  
            <!-- Icon -->
            <div 
              class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 font-bold text-2xl"
              :style="{ background: plan.bgColor, color: plan.textColor }"
            >
              <i :class="plan.icon"></i>
            </div>
  
            <!-- Name -->
            <h4 class="font-bold text-xl text-gray-800 dark:text-white mb-1">{{ plan.name }}</h4>
            <p class="text-xs text-gray-500 dark:text-white/40 mb-4">{{ plan.description }}</p>
  
            <!-- ROI -->
            <div class="mb-4 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
              <div class="flex items-baseline gap-1">
                <span class="text-3xl md:text-4xl font-bold text-amber-500">{{ plan.dailyRoi }}%</span>
                <span class="text-sm text-gray-500 dark:text-white/40">/ day</span>
              </div>
              <p class="text-xs text-gray-500 dark:text-white/40 mt-1">
                Total ROI: <strong class="text-gray-800 dark:text-white">{{ plan.totalRoi }}%</strong> over {{ plan.duration }} days
              </p>
            </div>
  
            <!-- Details -->
            <ul class="space-y-2.5 mb-5">
              <li 
                v-for="(feat, i) in plan.features" 
                :key="i"
                class="flex items-start gap-2 text-sm"
              >
                <i class="bi bi-check-circle-fill text-emerald-500 text-xs mt-0.5"></i>
                <span class="text-gray-600 dark:text-white/60">{{ feat }}</span>
              </li>
            </ul>
  
            <!-- Amount Range -->
            <div class="grid grid-cols-2 gap-2 mb-5 p-3 rounded-xl
                        bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
              <div>
                <p class="text-xs text-gray-500 dark:text-white/40">Min</p>
                <p class="font-bold text-sm text-gray-800 dark:text-white">${{ plan.min.toLocaleString() }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-white/40">Max</p>
                <p class="font-bold text-sm text-gray-800 dark:text-white">${{ plan.max.toLocaleString() }}</p>
              </div>
            </div>
  
            <!-- Invest Button -->
            <button 
              @click="openInvestModal(plan)"
              class="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
            >
              <i class="bi bi-rocket-takeoff-fill mr-1"></i>
              Invest Now
            </button>
          </div>
        </div>
  
        <!-- List View -->
        <div v-else class="space-y-3">
          <div 
            v-for="plan in plans" 
            :key="plan.id"
            class="rounded-2xl p-4 md:p-5 transition-all duration-300 hover:shadow-lg
                   bg-white border border-gray-100 shadow-sm
                   dark:bg-[#101A47] dark:border-white/[0.05]"
          >
            <div class="flex flex-wrap items-center gap-4">
              <div 
                class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-2xl"
                :style="{ background: plan.bgColor, color: plan.textColor }"
              >
                <i :class="plan.icon"></i>
              </div>
  
              <div class="flex-1 min-w-[200px]">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-bold text-lg text-gray-800 dark:text-white">{{ plan.name }}</h4>
                  <span v-if="plan.popular" class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500">
                    <i class="bi bi-star-fill mr-1"></i>Popular
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-white/40">{{ plan.description }}</p>
              </div>
  
              <div class="flex items-center gap-6">
                <div>
                  <p class="text-xs text-gray-500 dark:text-white/40">Daily ROI</p>
                  <p class="font-bold text-lg text-amber-500">{{ plan.dailyRoi }}%</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-white/40">Duration</p>
                  <p class="font-bold text-lg text-gray-800 dark:text-white">{{ plan.duration }}d</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-white/40">Range</p>
                  <p class="font-bold text-sm text-gray-800 dark:text-white">
                    ${{ plan.min.toLocaleString() }} - ${{ plan.max.toLocaleString() }}
                  </p>
                </div>
              </div>
  
              <button 
                @click="openInvestModal(plan)"
                class="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
                style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
              >
                Invest
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Recent Investment History -->
      <div class="rounded-2xl overflow-hidden
                  bg-white border border-gray-100 shadow-sm
                  dark:bg-[#101A47] dark:border-white/[0.05]">
        <div class="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 dark:border-white/[0.06]">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center
                        bg-blue-500/10 dark:bg-blue-500/[0.08]">
              <i class="bi bi-clock-history text-blue-400 text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white">Investment History</h3>
              <p class="text-xs text-gray-400 dark:text-white/40">Your completed investments</p>
            </div>
          </div>
        </div>
  
        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px]">
            <thead class="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01]">
              <tr>
                <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Plan</th>
                <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Invested</th>
                <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Profit</th>
                <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Status</th>
                <th class="text-left py-3 px-5 md:px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="h in investmentHistory" 
                :key="h.id"
                class="border-b border-gray-100 hover:bg-gray-50 dark:border-white/[0.03] dark:hover:bg-white/[0.03] transition-colors"
              >
                <td class="py-4 px-5 md:px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                         :style="{ background: h.bgColor, color: h.textColor }">
                      <i :class="h.icon"></i>
                    </div>
                    <span class="font-bold text-sm text-gray-800 dark:text-white">{{ h.planName }}</span>
                  </div>
                </td>
                <td class="py-4 px-5 md:px-6 font-bold text-sm text-gray-800 dark:text-white">
                  ${{ h.amount }}
                </td>
                <td class="py-4 px-5 md:px-6 font-bold text-sm text-emerald-500">
                  +${{ h.profit }}
                </td>
                <td class="py-4 px-5 md:px-6">
                  <span class="px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5
                               bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/[0.08] dark:text-emerald-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Completed
                  </span>
                </td>
                <td class="py-4 px-5 md:px-6 text-sm text-gray-500 dark:text-white/40">
                  {{ h.date }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Invest Modal -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="selectedPlan"
          class="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="closeModal"
        >
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
          >
            <div 
              class="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl
                     bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]"
            >
              <!-- Header -->
              <div 
                class="relative p-6 pb-8"
                :style="{ background: `linear-gradient(135deg, ${selectedPlan.bgColor}20, ${selectedPlan.bgColor}05)` }"
              >
                <button 
                  @click="closeModal"
                  class="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center
                         bg-white/80 dark:bg-white/[0.06] hover:bg-white dark:hover:bg-white/[0.12] z-10"
                >
                  <i class="bi bi-x-lg text-gray-600 dark:text-white/60 text-sm"></i>
                </button>
  
                <div class="flex items-center gap-4">
                  <div 
                    class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    :style="{ background: selectedPlan.bgColor, color: selectedPlan.textColor }"
                  >
                    <i :class="selectedPlan.icon"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-xl text-gray-800 dark:text-white">{{ selectedPlan.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-white/40">{{ selectedPlan.description }}</p>
                  </div>
                </div>
              </div>
  
              <!-- Body -->
              <div class="p-6 space-y-5">
                <!-- Amount Input -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-bold text-gray-700 dark:text-white/80">Investment Amount</label>
                    <span class="text-xs text-gray-500 dark:text-white/40">
                      ${{ selectedPlan.min.toLocaleString() }} - ${{ selectedPlan.max.toLocaleString() }}
                    </span>
                  </div>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-lg">$</span>
                    <input 
                      v-model.number="investAmount"
                      type="number"
                      :min="selectedPlan.min"
                      :max="selectedPlan.max"
                      class="w-full pl-10 pr-4 py-4 rounded-xl text-lg font-bold outline-none
                             bg-gray-50 border border-gray-200 text-gray-800 focus:border-gold-500/50
                             dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50"
                    >
                  </div>
                  <div class="grid grid-cols-4 gap-2 mt-3">
                    <button 
                      v-for="amt in quickAmounts" 
                      :key="amt"
                      @click="investAmount = amt"
                      class="py-2 rounded-lg text-xs font-bold transition-all
                             bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06]
                             text-gray-600 dark:text-white/60 hover:text-amber-500 hover:border-amber-500/30"
                    >
                      ${{ amt.toLocaleString() }}
                    </button>
                  </div>
                  <p v-if="investAmount && investAmount < selectedPlan.min" class="text-xs text-red-500 mt-2">
                    <i class="bi bi-exclamation-circle mr-1"></i>
                    Minimum investment is ${{ selectedPlan.min.toLocaleString() }}
                  </p>
                  <p v-if="investAmount && investAmount > selectedPlan.max" class="text-xs text-red-500 mt-2">
                    <i class="bi bi-exclamation-circle mr-1"></i>
                    Maximum investment is ${{ selectedPlan.max.toLocaleString() }}
                  </p>
                </div>
  
                <!-- Estimated Returns -->
                <div v-if="investAmount && isValidAmount" 
                     class="p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/[0.15]">
                  <div class="flex items-center gap-2 mb-3">
                    <i class="bi bi-graph-up-arrow text-amber-500"></i>
                    <span class="text-sm font-bold text-gray-800 dark:text-white">Estimated Returns</span>
                  </div>
                  <div class="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div class="text-xs text-gray-500 dark:text-white/40 mb-1">Daily</div>
                      <div class="font-bold text-emerald-500">+${{ estimatedDaily.toFixed(2) }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-white/40 mb-1">Total Profit</div>
                      <div class="font-bold text-emerald-500">+${{ estimatedProfit.toFixed(2) }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-white/40 mb-1">Total Return</div>
                      <div class="font-bold text-amber-500">${{ estimatedTotal.toFixed(2) }}</div>
                    </div>
                  </div>
                </div>
  
                <!-- Balance Check -->
                <div class="flex items-center justify-between p-3 rounded-xl
                            bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
                  <span class="text-sm text-gray-500 dark:text-white/40">Available Balance</span>
                  <span class="font-bold text-gray-800 dark:text-white">${{ walletBalance.toLocaleString() }}</span>
                </div>
  
                <!-- Warning if insufficient -->
                <div v-if="investAmount > walletBalance" 
                     class="p-3 rounded-xl bg-red-50 dark:bg-red-500/[0.06] border border-red-200 dark:border-red-500/[0.15]">
                  <div class="flex items-start gap-2 text-sm">
                    <i class="bi bi-exclamation-triangle-fill text-red-500 flex-shrink-0 mt-0.5"></i>
                    <div>
                      <p class="font-bold text-red-600 dark:text-red-400">Insufficient Balance</p>
                      <p class="text-xs text-gray-600 dark:text-white/50 mt-1">
                        You need an additional <strong>${{ (investAmount - walletBalance).toLocaleString() }}</strong>. 
                        <a href="?a=deposit" class="underline font-bold">Deposit funds</a>
                      </p>
                    </div>
                  </div>
                </div>
  
                <!-- Terms -->
                <label class="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="investTerms"
                    class="w-4 h-4 mt-0.5 rounded accent-amber-500"
                  >
                  <span class="text-xs text-gray-600 dark:text-white/50">
                    I understand that investments are locked for {{ selectedPlan.duration }} days and 
                    I agree to the <a href="#" class="text-amber-500 font-bold underline">investment terms</a>.
                  </span>
                </label>
              </div>
  
              <!-- Footer -->
              <div class="p-5 border-t border-gray-100 dark:border-white/[0.06] flex gap-3">
                <button 
                  @click="closeModal"
                  class="flex-1 py-3 rounded-xl font-semibold text-sm
                         bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                         hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  @click="confirmInvestment"
                  :disabled="!canInvest"
                  class="flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
                  style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); background-size: 200% auto; color: #020862;"
                >
                  <i class="bi bi-rocket-takeoff-fill mr-1"></i>
                  Confirm Investment
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
  
      <!-- Success Toast -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
      >
        <div 
          v-if="showSuccess"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[600] px-5 py-3 rounded-xl
                 bg-emerald-500 shadow-2xl flex items-center gap-3"
        >
          <i class="bi bi-check-circle-fill text-white text-lg"></i>
          <span class="text-white text-sm font-bold">Investment activated successfully!</span>
        </div>
      </Transition>
    </DashboardLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  
  definePageMeta({
    layout: 'dashboard'
  })
  
  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────
  const viewMode = ref('grid')
  const showCalculator = ref(false)
  const showSuccess = ref(false)
  const selectedPlan = ref(null)
  const investAmount = ref(null)
  const investTerms = ref(false)
  const walletBalance = ref(25847.50)
  
  // Calculator
  const calcAmount = ref(1000)
  const calcPlan = ref(2)
  
  // ─────────────────────────────────────────────────────────────
  // PLANS DATA
  // ─────────────────────────────────────────────────────────────
  const plans = [
    {
      id: 1,
      name: 'Starter',
      description: 'Perfect for beginners',
      dailyRoi: 1.0,
      totalRoi: 30,
      duration: 30,
      min: 100,
      max: 999,
      bgColor: '#3b82f6',
      textColor: 'white',
      icon: 'bi bi-rocket',
      popular: false,
      features: [
        'Earn 1.0% daily for 30 days',
        'Principal returned at end',
        'Standard support',
        'Withdraw anytime'
      ]
    },
    {
      id: 2,
      name: 'Growth',
      description: 'Best for growing portfolio',
      dailyRoi: 1.5,
      totalRoi: 60,
      duration: 40,
      min: 1000,
      max: 4999,
      bgColor: '#bb914a',
      textColor: '#020862',
      icon: 'bi bi-graph-up-arrow',
      popular: true,
      features: [
        'Earn 1.5% daily for 40 days',
        'Principal returned at end',
        'Priority support',
        'Withdraw anytime',
        '5% referral bonus'
      ]
    },
    {
      id: 3,
      name: 'Premium',
      description: 'For serious investors',
      dailyRoi: 2.0,
      totalRoi: 100,
      duration: 50,
      min: 5000,
      max: 19999,
      bgColor: '#8b5cf6',
      textColor: 'white',
      icon: 'bi bi-gem',
      popular: false,
      features: [
        'Earn 2.0% daily for 50 days',
        'Principal returned at end',
        'VIP support',
        'Withdraw anytime',
        '8% referral bonus',
        'Dedicated manager'
      ]
    },
    {
      id: 4,
      name: 'Elite',
      description: 'Maximum returns',
      dailyRoi: 2.5,
      totalRoi: 150,
      duration: 60,
      min: 20000,
      max: 100000,
      bgColor: '#ef4444',
      textColor: 'white',
      icon: 'bi bi-crown-fill',
      popular: false,
      features: [
        'Earn 2.5% daily for 60 days',
        'Principal returned at end',
        'VIP support 24/7',
        'Withdraw anytime',
        '10% referral bonus',
        'Dedicated account manager',
        'Exclusive trading signals'
      ]
    }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // PORTFOLIO STATS
  // ─────────────────────────────────────────────────────────────
  const portfolioStats = [
    {
      label: 'Total Invested',
      value: '$12,500',
      icon: 'bi bi-wallet2',
      iconColor: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.15)',
      change: '+$2,500 this month',
      changeColor: 'text-emerald-500'
    },
    {
      label: 'Total Earnings',
      value: '$3,847',
      icon: 'bi bi-cash-stack',
      iconColor: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      change: '+$425 this week',
      changeColor: 'text-emerald-500'
    },
    {
      label: 'Active Plans',
      value: '3',
      icon: 'bi bi-lightning-charge-fill',
      iconColor: '#bb914a',
      bgColor: 'rgba(187, 145, 74, 0.15)',
      change: 'All running',
      changeColor: 'text-amber-500'
    },
    {
      label: 'Avg. Daily ROI',
      value: '1.8%',
      icon: 'bi bi-graph-up',
      iconColor: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.15)',
      change: 'Good performance',
      changeColor: 'text-emerald-500'
    }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // ACTIVE INVESTMENTS
  // ─────────────────────────────────────────────────────────────
  const activeInvestments = [
    {
      id: 1,
      planName: 'Growth Plan',
      amount: '2,500.00',
      dailyRoi: 1.5,
      roi: 30,
      earned: '187.50',
      progress: 40,
      daysLeft: 24,
      startDate: 'Aug 1, 2026',
      endDate: 'Sep 10, 2026',
      nextPayout: '18h 32m',
      status: 'active',
      bgColor: '#bb914a',
      textColor: '#020862',
      icon: 'bi bi-graph-up-arrow'
    },
    {
      id: 2,
      planName: 'Premium Plan',
      amount: '5,000.00',
      dailyRoi: 2.0,
      roi: 40,
      earned: '400.00',
      progress: 40,
      daysLeft: 30,
      startDate: 'Aug 5, 2026',
      endDate: 'Sep 24, 2026',
      nextPayout: '2h 15m',
      status: 'active',
      bgColor: '#8b5cf6',
      textColor: 'white',
      icon: 'bi bi-gem'
    },
    {
      id: 3,
      planName: 'Starter Plan',
      amount: '500.00',
      dailyRoi: 1.0,
      roi: 30,
      earned: '45.00',
      progress: 30,
      daysLeft: 21,
      startDate: 'Aug 10, 2026',
      endDate: 'Sep 9, 2026',
      nextPayout: '5h 12m',
      status: 'active',
      bgColor: '#3b82f6',
      textColor: 'white',
      icon: 'bi bi-rocket'
    }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // INVESTMENT HISTORY
  // ─────────────────────────────────────────────────────────────
  const investmentHistory = [
    { id: 1, planName: 'Starter Plan', amount: '500.00', profit: '150.00', date: 'Jul 15, 2026', bgColor: '#3b82f6', textColor: 'white', icon: 'bi bi-rocket' },
    { id: 2, planName: 'Growth Plan', amount: '1,500.00', profit: '900.00', date: 'Jun 20, 2026', bgColor: '#bb914a', textColor: '#020862', icon: 'bi bi-graph-up-arrow' },
    { id: 3, planName: 'Premium Plan', amount: '3,000.00', profit: '3,000.00', date: 'May 12, 2026', bgColor: '#8b5cf6', textColor: 'white', icon: 'bi bi-gem' },
    { id: 4, planName: 'Starter Plan', amount: '250.00', profit: '75.00', date: 'Apr 8, 2026', bgColor: '#3b82f6', textColor: 'white', icon: 'bi bi-rocket' }
  ]
  
  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const calcPlanData = computed(() => plans.find(p => p.id === calcPlan.value) || plans[1])
  const calculatedDaily = computed(() => (calcAmount.value * calcPlanData.value.dailyRoi / 100))
  const calculatedProfit = computed(() => calculatedDaily.value * calcPlanData.value.duration)
  const calculatedTotal = computed(() => calcAmount.value + calculatedProfit.value)
  const calculatedRoi = computed(() => calcPlanData.value.totalRoi)
  
  const quickAmounts = computed(() => {
    if (!selectedPlan.value) return []
    const { min, max } = selectedPlan.value
    return [min, Math.round(min * 2.5), Math.round(min * 5), Math.min(Math.round(min * 10), max)]
  })
  
  const isValidAmount = computed(() => {
    if (!investAmount.value || !selectedPlan.value) return false
    return investAmount.value >= selectedPlan.value.min && 
           investAmount.value <= selectedPlan.value.max &&
           investAmount.value <= walletBalance.value
  })
  
  const estimatedDaily = computed(() => {
    if (!investAmount.value || !selectedPlan.value) return 0
    return investAmount.value * selectedPlan.value.dailyRoi / 100
  })
  
  const estimatedProfit = computed(() => {
    if (!selectedPlan.value) return 0
    return estimatedDaily.value * selectedPlan.value.duration
  })
  
  const estimatedTotal = computed(() => {
    if (!investAmount.value) return 0
    return investAmount.value + estimatedProfit.value
  })
  
  const canInvest = computed(() => {
    return isValidAmount.value && investTerms.value
  })
  
  // ─────────────────────────────────────────────────────────────
  // METHODS
  // ─────────────────────────────────────────────────────────────
  const openInvestModal = (plan) => {
    selectedPlan.value = plan
    investAmount.value = plan.min
    investTerms.value = false
  }
  
  const closeModal = () => {
    selectedPlan.value = null
    investAmount.value = null
    investTerms.value = false
  }
  
  const confirmInvestment = () => {
    if (!canInvest.value) return
    
    // Process investment
    walletBalance.value -= investAmount.value
    showSuccess.value = true
    closeModal()
    
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  }
  </script>
  
  <style scoped>
  /* Smooth transitions */
  .grid-enter-active, .grid-leave-active {
    transition: all 0.3s ease;
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
  
  /* Remove number spinners */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
  
  /* Checkbox */
  input[type="checkbox"] {
    accent-color: #bb914a;
    cursor: pointer;
  }
  </style>