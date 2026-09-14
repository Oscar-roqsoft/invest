<template>
  <DashboardLayout>
    <!-- ═══════════════════ HEADER ═══════════════════ -->
    <div class="mb-6 md:mb-8 mt-[70px]">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-gold-500/10 dark:bg-amber-500/[0.08]">
            <i class="bi bi-graph-up-arrow text-amber-500 text-lg"></i>
          </div>
          <div>
            <h1 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">Investment Plans</h1>
            <p class="text-xs md:text-sm text-gray-500 dark:text-white/40">
              Choose a plan and start earning daily returns
            </p>
          </div>
        </div>
        <button
          @click="showCalculator = !showCalculator"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
                 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
                 dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.08]"
        >
          <i class="bi bi-calculator"></i>
          <span class="hidden sm:inline">ROI Calculator</span>
        </button>
      </div>
    </div>

    <!-- ═══════════════════ PORTFOLIO STATS ═══════════════════ -->
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
        <div v-if="stat.loading" class="h-7 w-24 rounded bg-gray-200 dark:bg-white/[0.06] animate-pulse"></div>
        <p v-else class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{{ stat.value }}</p>
        <p v-if="stat.change" class="text-xs mt-1" :class="stat.changeColor">{{ stat.change }}</p>
      </div>
    </div>

    <!-- ═══════════════════ ACTIVE INVESTMENTS ═══════════════════ -->
    <div
      v-if="store.state.isLoading && !store.state.activeLoaded"
      class="mb-6 rounded-2xl p-6 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05]"
    >
      <div class="flex items-center gap-3 mb-5">
        <div class="w-11 h-11 rounded-2xl bg-gray-200 dark:bg-white/[0.06] animate-pulse"></div>
        <div class="h-4 w-40 rounded bg-gray-200 dark:bg-white/[0.06] animate-pulse"></div>
      </div>
      <div class="space-y-4">
        <div
          v-for="i in 2"
          :key="i"
          class="rounded-2xl p-5 bg-gray-50 dark:bg-white/[0.02] animate-pulse"
        >
          <div class="h-5 w-40 bg-gray-200 dark:bg-white/[0.06] rounded mb-3"></div>
          <div class="h-3 w-64 bg-gray-100 dark:bg-white/[0.04] rounded mb-4"></div>
          <div class="h-2 w-full bg-gray-100 dark:bg-white/[0.04] rounded"></div>
        </div>
      </div>
    </div>

    <div
      v-else-if="hasActive"
      class="mb-6 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm
             dark:bg-[#101A47] dark:border-white/[0.05]"
    >
      <div class="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 dark:border-white/[0.06]">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-emerald-500/10 dark:bg-emerald-500/[0.08]">
            <i class="bi bi-briefcase-fill text-emerald-500 text-lg"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-gray-800 dark:text-white">Active Investments</h3>
            <p class="text-xs text-gray-400 dark:text-white/40">
              {{ activeInvestments.length }} active · ${{ formatMoney(store.totalActiveInvested) }} invested
            </p>
          </div>
        </div>
        <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/[0.15] dark:text-emerald-400">
          {{ activeInvestments.length }} Active
        </span>
      </div>

      <div class="p-4 md:p-6 space-y-4">
        <div
          v-for="inv in activeInvestments"
          :key="inv._id"
          class="rounded-2xl p-4 md:p-5 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]"
        >
          <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xl"
                :style="{ background: planMeta(inv.planSlug).color }"
              >
                <i :class="planMeta(inv.planSlug).icon"></i>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-bold text-gray-800 dark:text-white">{{ inv.planName }}</h4>
                  <InvestmentStatusBadge :status="inv.status" />
                </div>
                <p class="text-xs text-gray-500 dark:text-white/40">
                  Started {{ formatDate(inv.startDate) }} · Ends {{ formatDate(inv.endDate) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-amber-500">+${{ formatMoney(inv.earned) }}</div>
              <p class="text-xs text-gray-500 dark:text-white/40">Earned so far</p>
            </div>
          </div>

          <!-- Stats row -->
          <div class="grid grid-cols-3 gap-3 mb-4">
            <div>
              <p class="text-xs text-gray-500 dark:text-white/40 mb-0.5">Invested</p>
              <p class="font-bold text-sm text-gray-800 dark:text-white">${{ formatMoney(inv.amount) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-white/40 mb-0.5">Daily ROI</p>
              <p class="font-bold text-sm text-emerald-500">{{ inv.dailyRoi }}%</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-white/40 mb-0.5">Total ROI</p>
              <p class="font-bold text-sm text-amber-500">{{ inv.totalRoi }}%</p>
            </div>
          </div>

          <!-- Progress -->
          <InvestmentProgressBar
            :progress="estimateProgress(inv)"
            label="Progress"
            :caption="`${daysLeft(inv)} days remaining`"
          />
        </div>
      </div>
    </div>

    <!-- ═══════════════════ ROI CALCULATOR ═══════════════════ -->
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
              class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06]"
            >
              <i class="bi bi-x-lg text-white/40 text-sm"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  v-model="calcPlanId"
                  class="w-full px-4 py-3 rounded-xl text-white text-sm outline-none cursor-pointer
                         bg-white/[0.06] border border-white/[0.1] focus:border-amber-500/50 transition-all"
                >
                  <option v-for="plan in sortedPlans" :key="plan._id" :value="plan._id">
                    {{ plan.name }} — {{ plan.dailyRoi }}% daily
                  </option>
                </select>
              </div>
            </div>

            <div class="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div class="text-xs text-white/40 mb-1">Daily Return</div>
                <div class="text-lg md:text-xl font-bold text-emerald-400">+${{ calcResults.daily.toLocaleString() }}</div>
              </div>
              <div class="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div class="text-xs text-white/40 mb-1">Total Profit</div>
                <div class="text-lg md:text-xl font-bold text-emerald-400">+${{ calcResults.profit.toLocaleString() }}</div>
              </div>
              <div class="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div class="text-xs text-white/40 mb-1">Total Return</div>
                <div class="text-lg md:text-xl font-bold text-amber-400">${{ calcResults.total.toLocaleString() }}</div>
              </div>
              <div class="p-4 rounded-xl bg-amber-500/[0.1] border border-amber-500/[0.2]">
                <div class="text-xs text-amber-400/70 mb-1">ROI</div>
                <div class="text-lg md:text-xl font-bold text-amber-400">{{ calcResults.roi }}%</div>
              </div>

              <div class="col-span-2 md:col-span-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-bold uppercase tracking-wider text-white/40">Growth Projection</span>
                  <span class="text-xs text-amber-400 font-bold">{{ calcPlanData?.duration }} days</span>
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

    <!-- ═══════════════════ PLANS GRID/LIST ═══════════════════ -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-bold text-xl text-gray-800 dark:text-white">Investment Plans</h3>
          <p class="text-xs text-gray-500 dark:text-white/40">Pick a plan that suits your goals</p>
        </div>
        <div class="hidden md:flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/[0.04]">
          <button
            v-for="v in ['grid', 'list']"
            :key="v"
            @click="viewMode = v"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            :class="viewMode === v
              ? 'bg-white dark:bg-white/[0.08] text-gray-800 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-white/40'"
          >
            <i :class="v === 'grid' ? 'bi bi-grid-fill' : 'bi bi-list-ul'"></i>
          </button>
        </div>
      </div>

      <!-- ░░ LOADING ░░ -->
      <div v-if="store.state.isLoading && !store.state.plansLoaded"
           class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="i in 4"
          :key="i"
          class="rounded-2xl p-5 bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05] animate-pulse"
        >
          <div class="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-white/[0.06] mb-4"></div>
          <div class="h-5 w-24 bg-gray-200 dark:bg-white/[0.06] rounded mb-2"></div>
          <div class="h-3 w-32 bg-gray-100 dark:bg-white/[0.04] rounded mb-4"></div>
          <div class="h-20 bg-gray-100 dark:bg-white/[0.04] rounded mb-4"></div>
          <div class="h-11 bg-gray-200 dark:bg-white/[0.06] rounded-xl"></div>
        </div>
      </div>

      <!-- ░░ EMPTY ░░ -->
      <div v-else-if="!store.state.isLoading && sortedPlans.length === 0"
           class="rounded-2xl p-12 text-center bg-white border border-gray-100 dark:bg-[#101A47] dark:border-white/[0.05]">
        <i class="bi bi-inbox text-5xl text-gray-300 dark:text-white/20"></i>
        <p class="font-semibold text-gray-700 dark:text-white/70 mt-4">No investment plans available</p>
      </div>

      <!-- ░░ GRID ░░ -->
      <div
        v-else-if="viewMode === 'grid'"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <div
          v-for="plan in sortedPlans"
          :key="plan._id"
          class="relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden
                 bg-white border border-gray-100 shadow-sm
                 dark:bg-[#101A47] dark:border-white/[0.05]"
          :class="plan.isPopular ? 'ring-2 ring-amber-500/50' : ''"
        >
          <div
            v-if="plan.isPopular"
            class="absolute top-0 right-0 px-3 py-1 rounded-bl-2xl text-xs font-bold
                   bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
          >
            <i class="bi bi-star-fill mr-1"></i>POPULAR
          </div>

          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl text-white"
            :style="{ background: plan.color || '#bb914a' }"
          >
            <i :class="plan.icon || 'bi bi-graph-up-arrow'"></i>
          </div>

          <h4 class="font-bold text-xl text-gray-800 dark:text-white mb-1">{{ plan.name }}</h4>
          <p class="text-xs text-gray-500 dark:text-white/40 mb-4">{{ plan.description || `${plan.duration}-day plan` }}</p>

          <div class="mb-4 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div class="flex items-baseline gap-1">
              <span class="text-3xl md:text-4xl font-bold text-amber-500">{{ plan.dailyRoi }}%</span>
              <span class="text-sm text-gray-500 dark:text-white/40">/ day</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-white/40 mt-1">
              Total ROI: <strong class="text-gray-800 dark:text-white">{{ planTotalRoi(plan) }}%</strong> over {{ plan.duration }} days
            </p>
          </div>

          <ul v-if="plan.features?.length" class="space-y-2.5 mb-5">
            <li
              v-for="(feat, i) in plan.features"
              :key="i"
              class="flex items-start gap-2 text-sm"
            >
              <i class="bi bi-check-circle-fill text-emerald-500 text-xs mt-0.5"></i>
              <span class="text-gray-600 dark:text-white/60">{{ feat }}</span>
            </li>
          </ul>

          <div class="grid grid-cols-2 gap-2 mb-5 p-3 rounded-xl
                      bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
            <div>
              <p class="text-xs text-gray-500 dark:text-white/40">Min</p>
              <p class="font-bold text-sm text-gray-800 dark:text-white">${{ formatMoney(plan.minAmount, 0) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-white/40">Max</p>
              <p class="font-bold text-sm text-gray-800 dark:text-white">${{ formatMoney(plan.maxAmount, 0) }}</p>
            </div>
          </div>

          <button
            @click="openInvestModal(plan)"
            class="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
            style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
          >
            <i class="bi bi-rocket-takeoff-fill mr-1"></i> Invest Now
          </button>
        </div>
      </div>

      <!-- ░░ LIST ░░ -->
      <div v-else class="space-y-3">
        <div
          v-for="plan in sortedPlans"
          :key="plan._id"
          class="rounded-2xl p-4 md:p-5 transition-all duration-300 hover:shadow-lg
                 bg-white border border-gray-100 shadow-sm
                 dark:bg-[#101A47] dark:border-white/[0.05]"
        >
          <div class="flex flex-wrap items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl text-white"
              :style="{ background: plan.color || '#bb914a' }"
            >
              <i :class="plan.icon || 'bi bi-graph-up-arrow'"></i>
            </div>

            <div class="flex-1 min-w-[200px]">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-bold text-lg text-gray-800 dark:text-white">{{ plan.name }}</h4>
                <span v-if="plan.isPopular" class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500">
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
                  ${{ formatMoney(plan.minAmount, 0) }} - ${{ formatMoney(plan.maxAmount, 0) }}
                </p>
              </div>
            </div>

            <button
              @click="openInvestModal(plan)"
              class="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
            >
              Invest
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════ HISTORY ═══════════════════ -->
    <div class="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm
                dark:bg-[#101A47] dark:border-white/[0.05]">
      <div class="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 dark:border-white/[0.06]">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/[0.08]">
            <i class="bi bi-clock-history text-blue-400 text-lg"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-gray-800 dark:text-white">Investment History</h3>
            <p class="text-xs text-gray-400 dark:text-white/40">Your completed investments</p>
          </div>
        </div>
        <NuxtLink to="/invest/my" class="text-amber-500 text-sm font-semibold hover:text-amber-400 inline-flex items-center gap-1 group">
          View All <i class="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </NuxtLink>
      </div>

      <!-- ░░ SKELETON ░░ -->
      <div v-if="store.state.isLoading && !store.state.investments.length" class="p-5 md:p-6 space-y-3">
        <div
          v-for="i in 4"
          :key="i"
          class="flex items-center gap-3 p-4 rounded-xl animate-pulse bg-gray-50 dark:bg-white/[0.02]"
        >
          <div class="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/[0.06]"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3.5 bg-gray-200 dark:bg-white/[0.06] rounded w-1/4"></div>
            <div class="h-2.5 bg-gray-100 dark:bg-white/[0.04] rounded w-1/3"></div>
          </div>
          <div class="h-4 w-16 bg-gray-200 dark:bg-white/[0.06] rounded"></div>
        </div>
      </div>

      <!-- ░░ EMPTY ░░ -->
      <div v-else-if="!completedInvestments.length" class="py-12 text-center">
        <i class="bi bi-inbox text-4xl text-gray-300 dark:text-white/20"></i>
        <p class="text-sm text-gray-500 dark:text-white/40 mt-3">No completed investments yet</p>
      </div>

      <!-- ░░ TABLE ░░ -->
      <div v-else class="overflow-x-auto">
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
              v-for="inv in completedInvestments"
              :key="inv._id"
              class="border-b border-gray-100 hover:bg-gray-50 dark:border-white/[0.03] dark:hover:bg-white/[0.03] transition-colors"
            >
              <td class="py-4 px-5 md:px-6">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                    :style="{ background: planMeta(inv.planSlug).color }"
                  >
                    <i :class="planMeta(inv.planSlug).icon"></i>
                  </div>
                  <span class="font-bold text-sm text-gray-800 dark:text-white">{{ inv.planName }}</span>
                </div>
              </td>
              <td class="py-4 px-5 md:px-6 font-bold text-sm text-gray-800 dark:text-white">
                ${{ formatMoney(inv.amount) }}
              </td>
              <td class="py-4 px-5 md:px-6 font-bold text-sm text-emerald-500">
                +${{ formatMoney(inv.earned) }}
              </td>
              <td class="py-4 px-5 md:px-6">
                <InvestmentStatusBadge :status="inv.status" />
              </td>
              <td class="py-4 px-5 md:px-6 text-sm text-gray-500 dark:text-white/40">
                {{ formatDate(inv.completedAt || inv.endDate) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══════════════════ INVEST MODAL ═══════════════════ -->
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
          <div class="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl
                      bg-white dark:bg-[#101A47] border border-gray-100 dark:border-white/[0.06]">
            <!-- Header -->
            <div
              class="relative p-6 pb-8"
              :style="{ background: `linear-gradient(135deg, ${(selectedPlan.color || '#bb914a')}20, ${(selectedPlan.color || '#bb914a')}05)` }"
            >
              <button
                @click="closeModal"
                :disabled="store.state.isSubmitting"
                class="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center
                       bg-white/80 dark:bg-white/[0.06] hover:bg-white dark:hover:bg-white/[0.12] z-10
                       disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="bi bi-x-lg text-gray-600 dark:text-white/60 text-sm"></i>
              </button>

              <div class="flex items-center gap-4">
                <div
                  class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 text-white"
                  :style="{ background: selectedPlan.color || '#bb914a' }"
                >
                  <i :class="selectedPlan.icon || 'bi bi-graph-up-arrow'"></i>
                </div>
                <div>
                  <h3 class="font-bold text-xl text-gray-800 dark:text-white">{{ selectedPlan.name }}</h3>
                  <p class="text-sm text-gray-500 dark:text-white/40">{{ selectedPlan.description }}</p>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-5">
              <!-- Amount -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-bold text-gray-700 dark:text-white/80">Investment Amount</label>
                  <span class="text-xs text-gray-500 dark:text-white/40">
                    ${{ formatMoney(selectedPlan.minAmount, 0) }} - ${{ formatMoney(selectedPlan.maxAmount, 0) }}
                  </span>
                </div>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-lg">$</span>
                  <input
                    v-model.number="investAmount"
                    type="number"
                    :min="selectedPlan.minAmount"
                    :max="selectedPlan.maxAmount"
                    :disabled="store.state.isSubmitting"
                    class="w-full pl-10 pr-4 py-4 rounded-xl text-lg font-bold outline-none
                           bg-gray-50 border border-gray-200 text-gray-800 focus:border-gold-500/50
                           dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white dark:focus:border-amber-500/50
                           disabled:opacity-60"
                  >
                </div>
                <div class="grid grid-cols-4 gap-2 mt-3">
                  <button
                    v-for="amt in quickAmounts"
                    :key="amt"
                    @click="investAmount = amt"
                    :disabled="store.state.isSubmitting"
                    class="py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50
                           bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06]
                           text-gray-600 dark:text-white/60 hover:text-amber-500 hover:border-amber-500/30"
                  >
                    ${{ formatMoney(amt, 0) }}
                  </button>
                </div>
                <p v-if="investAmount && investAmount < selectedPlan.minAmount" class="text-xs text-red-500 mt-2">
                  <i class="bi bi-exclamation-circle mr-1"></i>
                  Minimum investment is ${{ formatMoney(selectedPlan.minAmount, 0) }}
                </p>
                <p v-else-if="investAmount && investAmount > selectedPlan.maxAmount" class="text-xs text-red-500 mt-2">
                  <i class="bi bi-exclamation-circle mr-1"></i>
                  Maximum investment is ${{ formatMoney(selectedPlan.maxAmount, 0) }}
                </p>
              </div>

              <!-- Estimated returns -->
              <div v-if="isValidAmount"
                   class="p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/[0.15]">
                <div class="flex items-center gap-2 mb-3">
                  <i class="bi bi-graph-up-arrow text-amber-500"></i>
                  <span class="text-sm font-bold text-gray-800 dark:text-white">Estimated Returns</span>
                  <span v-if="store.state.isPreviewing" class="ml-auto text-xs text-amber-500">
                    <i class="bi bi-arrow-repeat animate-spin inline-block"></i>
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div class="text-xs text-gray-500 dark:text-white/40 mb-1">Daily</div>
                    <div class="font-bold text-emerald-500">+${{ formatMoney(estimatedDaily) }}</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500 dark:text-white/40 mb-1">Total Profit</div>
                    <div class="font-bold text-emerald-500">+${{ formatMoney(estimatedProfit) }}</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500 dark:text-white/40 mb-1">Total Return</div>
                    <div class="font-bold text-amber-500">${{ formatMoney(estimatedTotal) }}</div>
                  </div>
                </div>
              </div>

              <!-- Balance -->
              <div class="flex items-center justify-between p-3 rounded-xl
                          bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
                <span class="text-sm text-gray-500 dark:text-white/40">Available Balance</span>
                <div v-if="walletStore.state.isLoadingBalances && !walletStore.state.balancesLoaded"
                     class="h-5 w-20 bg-gray-200 dark:bg-white/[0.06] rounded animate-pulse"></div>
                <span v-else class="font-bold text-gray-800 dark:text-white">${{ formatMoney(walletStore.availableUSD) }}</span>
              </div>

              <!-- Insufficient -->
              <div v-if="investAmount > walletStore.availableUSD"
                   class="p-3 rounded-xl bg-red-50 dark:bg-red-500/[0.06] border border-red-200 dark:border-red-500/[0.15]">
                <div class="flex items-start gap-2 text-sm">
                  <i class="bi bi-exclamation-triangle-fill text-red-500 flex-shrink-0 mt-0.5"></i>
                  <div>
                    <p class="font-bold text-red-600 dark:text-red-400">Insufficient Balance</p>
                    <p class="text-xs text-gray-600 dark:text-white/50 mt-1">
                      You need an additional
                      <strong>${{ formatMoney(investAmount - walletStore.availableUSD) }}</strong>.
                      <NuxtLink to="/deposit" class="underline font-bold">Deposit funds</NuxtLink>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Terms -->
              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="investTerms"
                  :disabled="store.state.isSubmitting"
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
                :disabled="store.state.isSubmitting"
                class="flex-1 py-3 rounded-xl font-semibold text-sm
                       bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70
                       hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors
                       disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                @click="openPinModal"
                :disabled="!canInvest || store.state.isSubmitting"
                class="flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]
                       inline-flex items-center justify-center gap-2"
                style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 25%, #D4A44A 50%, #E6BB5C 75%, #F5D77F 100%); color: #020862;"
              >
                <span v-if="store.state.isSubmitting" class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
                {{ store.state.isSubmitting ? 'Processing...' : 'Confirm Investment' }}
                <i v-if="!store.state.isSubmitting" class="bi bi-rocket-takeoff-fill"></i>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- ═══════════════════ PIN MODAL ═══════════════════ -->
    <PinModal
      :open="pinOpen"
      :loading="store.state.isSubmitting"
      :error-message="pinError"
      :attempts-left="3 - pinAttempts"
      @close="closePinModal"
      @submit="handlePinSubmit"
    />

    <!-- ═══════════════════ SUCCESS TOAST ═══════════════════ -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
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
import { useInvestmentStore } from '~/stores/investment'
import { useWalletStore } from '~/stores/wallet'

definePageMeta({ layout: 'dashboard' })

// ─────────────────────────────────────────────────────────────
// STORES
// ─────────────────────────────────────────────────────────────
const store = useInvestmentStore()
const walletStore = useWalletStore()

// ─────────────────────────────────────────────────────────────
// LOCAL UI STATE
// ─────────────────────────────────────────────────────────────
const viewMode = ref('grid')
const showCalculator = ref(false)
const showSuccess = ref(false)

// Calculator
const calcAmount = ref(1000)
const calcPlanId = ref(null)

// Invest modal
const selectedPlan = ref(null)
const investAmount = ref(null)
const investTerms = ref(false)

// PIN
const pinOpen = ref(false)
const pinError = ref('')
const pinAttempts = ref(0)

// ─────────────────────────────────────────────────────────────
// COMPUTED — data
// ─────────────────────────────────────────────────────────────
const sortedPlans = computed(() => store.sortedPlans)
const activeInvestments = computed(() => store.state.activeInvestments)
const hasActive = computed(() => store.hasActive)
const completedInvestments = computed(() =>
  store.state.investments.filter((i) => i.status === 'completed').slice(0, 5)
)

// ─────────────────────────────────────────────────────────────
// PORTFOLIO STATS
// ─────────────────────────────────────────────────────────────
const portfolioStats = computed(() => {
  const w = walletStore.state.stats || {}
  const loading = walletStore.state.isLoadingStats && !walletStore.state.statsLoaded

  return [
    {
      label: 'Total Invested',
      value: `$${formatMoney(store.state.activeInvestments.reduce((s, i) => s + (i.amount || 0), 0), 0)}`,
      icon: 'bi bi-wallet2',
      iconColor: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.15)',
      loading: store.state.isLoading && !store.state.activeLoaded,
    },
    {
      label: 'Total Earnings',
      value: `$${formatMoney(w.totalEarnings, 0)}`,
      icon: 'bi bi-cash-stack',
      iconColor: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      loading,
    },
    {
      label: 'Active Plans',
      value: `${store.state.activeInvestments.length}`,
      icon: 'bi bi-lightning-charge-fill',
      iconColor: '#bb914a',
      bgColor: 'rgba(187, 145, 74, 0.15)',
      loading: store.state.isLoading && !store.state.activeLoaded,
    },
    {
      label: 'Avg. Daily ROI',
      value: avgDailyRoi.value ? `${avgDailyRoi.value.toFixed(2)}%` : '—',
      icon: 'bi bi-graph-up',
      iconColor: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.15)',
      loading: store.state.isLoading && !store.state.activeLoaded,
    },
  ]
})

const avgDailyRoi = computed(() => {
  const list = store.state.activeInvestments
  if (!list.length) return 0
  return list.reduce((s, i) => s + (i.dailyRoi || 0), 0) / list.length
})

// ─────────────────────────────────────────────────────────────
// ROI CALCULATOR
// ─────────────────────────────────────────────────────────────
const calcPlanData = computed(() =>
  sortedPlans.value.find((p) => p._id === calcPlanId.value) || sortedPlans.value[0] || null
)

const calcResults = computed(() => {
  const plan = calcPlanData.value
  const amount = calcAmount.value || 0
  if (!plan) return { daily: 0, profit: 0, total: 0, roi: 0 }

  const daily = amount * (plan.dailyRoi / 100)
  const profit = daily * plan.duration
  const total = amount + profit
  return {
    daily: round2(daily),
    profit: round2(profit),
    total: round2(total),
    roi: round2(plan.dailyRoi * plan.duration),
  }
})

// ─────────────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────────────
const quickAmounts = computed(() => {
  if (!selectedPlan.value) return []
  const { minAmount, maxAmount } = selectedPlan.value
  return [
    minAmount,
    Math.round(minAmount * 2.5),
    Math.round(minAmount * 5),
    Math.min(Math.round(minAmount * 10), maxAmount),
  ]
})

const isValidAmount = computed(() => {
  if (!investAmount.value || !selectedPlan.value) return false
  return investAmount.value >= selectedPlan.value.minAmount &&
         investAmount.value <= selectedPlan.value.maxAmount &&
         investAmount.value <= walletStore.availableUSD
})

const canInvest = computed(() => isValidAmount.value && investTerms.value)

const estimatedDaily = computed(() => {
  if (!isValidAmount.value) return 0
  return round2(investAmount.value * selectedPlan.value.dailyRoi / 100)
})
const estimatedProfit = computed(() => {
  if (!isValidAmount.value) return 0
  return round2(estimatedDaily.value * selectedPlan.value.duration)
})
const estimatedTotal = computed(() => {
  if (!isValidAmount.value) return 0
  return round2(investAmount.value + estimatedProfit.value)
})

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatMoney = (n, decimals = 2) =>
  Number(n || 0).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const planTotalRoi = (plan) =>
  plan.totalRoi || round2(plan.dailyRoi * plan.duration)

const planMeta = (slug) => {
  const plan = sortedPlans.value.find((p) => p.slug === slug)
  return {
    color: plan?.color || '#bb914a',
    icon: plan?.icon || 'bi bi-graph-up-arrow',
  }
}

const estimateProgress = (inv) => {
  if (inv.progress != null) return inv.progress
  const start = new Date(inv.startDate).getTime()
  const end = new Date(inv.endDate).getTime()
  const now = Date.now()
  if (!start || !end || end <= start) return 0
  return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
}

const daysLeft = (inv) => {
  if (inv.daysLeft != null) return inv.daysLeft
  const end = new Date(inv.endDate).getTime()
  if (!end) return 0
  return Math.max(Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24)), 0)
}

// ─────────────────────────────────────────────────────────────
// MODAL ACTIONS
// ─────────────────────────────────────────────────────────────
const openInvestModal = (plan) => {
  selectedPlan.value = plan
  investAmount.value = plan.minAmount
  investTerms.value = false
  pinError.value = ''
  store.clearPreview()
}

const closeModal = () => {
  if (store.state.isSubmitting) return
  selectedPlan.value = null
  investAmount.value = null
  investTerms.value = false
  store.clearPreview()
}

// ─────────────────────────────────────────────────────────────
// PIN FLOW
// ─────────────────────────────────────────────────────────────
const openPinModal = () => {
  if (!canInvest.value) return
  pinError.value = ''
  pinAttempts.value = 0
  pinOpen.value = true
}

const closePinModal = () => {
  if (store.state.isSubmitting) return
  pinOpen.value = false
  pinError.value = ''
}

const handlePinSubmit = async (pin) => {
  pinError.value = ''

  // Optional: ask backend to confirm the numbers right before creating.
  // This catches stale prices/plan changes.
  const preview = await store.previewInvestment({
    planId: selectedPlan.value._id,
    amount: investAmount.value,
  })
  if (!preview.success) {
    pinError.value = preview.message || 'Unable to verify investment'
    pinAttempts.value += 1
    if (pinAttempts.value >= 3) {
      setTimeout(closePinModal, 1500)
    }
    return
  }

  const res = await store.createInvestment({
    planId: selectedPlan.value._id,
    amount: investAmount.value,
    pin,   // will be ignored until backend enforces; safe to send
  })

  if (res.success) {
    pinOpen.value = false
    closeModal()
    showSuccess.value = true
    setTimeout(() => (showSuccess.value = false), 3000)

    // Refresh wallet to reflect the new balance
    walletStore.fetchBalances({ force: true })
    return
  }

  pinError.value = res.message || 'Investment failed'
  pinAttempts.value += 1
  if (pinAttempts.value >= 3) {
    setTimeout(closePinModal, 1500)
  }
}

// ─────────────────────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    store.fetchPlans(),             // cached 10 min
    store.fetchActiveInvestments(), // cached 30 s
    store.fetchMyInvestments({ page: 1, limit: 20 }), // cached 30 s
    walletStore.fetchBalances(),
    walletStore.fetchStats(),
  ])

  // Default calculator plan = most popular or first
  if (sortedPlans.value.length) {
    calcPlanId.value = (store.popularPlan || sortedPlans.value[0])._id
  }
})
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(187, 145, 74, 0.3);
  border-radius: 10px;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; appearance: textfield; }

input[type="checkbox"] { accent-color: #bb914a; cursor: pointer; }

@keyframes spin-slow {
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin-slow 1s linear infinite; }
</style>