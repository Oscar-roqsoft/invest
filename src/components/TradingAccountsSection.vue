<template>
  <section
    id="trading-accounts-section"
    class="py-16 md:py-24 bg-white relative overflow-hidden"
    ref="sectionRef"
  >
    <!-- Background Decorations -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
    </div>

    <div class="reviews-slider__container container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="wrapper">
        <!-- Section Header -->
        <div class="text-center mb-12 md:mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-4">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
            </span>
            <span class="text-gold-500 text-xs md:text-sm font-medium tracking-wider uppercase">Investment Plans</span>
          </div>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-900 mb-4">
            Choose Your
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">Investment Plan</span>
          </h2>
          <p class="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Select the perfect plan that matches your investment goals and start building your wealth today
          </p>
        </div>

        <!-- ░░ LOADING SKELETON ░░ -->
        <div
          v-if="store.state.isLoading && !store.state.plansLoaded"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          <div
            v-for="i in 4"
            :key="i"
            class="rounded-2xl p-6 md:p-8 bg-white border border-gray-200 shadow-lg animate-pulse"
          >
            <div class="w-16 h-16 rounded-2xl bg-gray-200 mx-auto mb-4"></div>
            <div class="h-6 w-32 bg-gray-200 rounded mx-auto mb-4"></div>
            <div class="h-12 w-24 bg-gray-100 rounded mx-auto mb-4"></div>
            <div class="h-3 w-full bg-gray-100 rounded mb-3"></div>
            <div class="h-3 w-2/3 bg-gray-100 rounded mb-6"></div>
            <div class="h-12 w-full bg-gray-200 rounded-xl"></div>
          </div>
        </div>

        <!-- ░░ EMPTY ░░ -->
        <div
          v-else-if="!store.state.isLoading && sortedPlans.length === 0"
          class="rounded-2xl p-12 text-center bg-white border border-gray-200 shadow-sm max-w-lg mx-auto"
        >
          <i class="bi bi-inbox text-5xl text-gray-300"></i>
          <p class="font-semibold text-gray-700 mt-4">No investment plans available</p>
          <p class="text-sm text-gray-500 mt-1">Please check back later</p>
        </div>

        <!-- ░░ INVESTMENT PACKAGES ░░ -->
        <div v-else class="mt-10 md:mt-14">
          <div class="pricing-table grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div
              v-for="(plan, index) in sortedPlans"
              :key="plan._id"
              class="pricing-box-2 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 hover:border-gold-500/30 group"
              :data-index="index"
            >
              <!-- Popular Badge -->
              <div v-if="plan.isPopular" class="absolute -top-3 left-1/2 -translate-x-1/2">
                <span class="inline-block px-4 py-1 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-semibold rounded-full shadow-lg shadow-gold-500/30">
                  Most Popular
                </span>
              </div>

              <!-- Plan Icon -->
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                :style="{ background: (plan.color || '#bb914a') + '20' }"
              >
                <i :class="plan.icon || 'bi bi-graph-up-arrow'" class="text-2xl" :style="{ color: plan.color || '#bb914a' }"></i>
              </div>

              <h2 class="text-xl md:text-2xl font-bold text-primary-900 text-center mb-2 tracking-wide">
                {{ plan.name }}
              </h2>

              <p v-if="plan.description" class="text-center text-xs text-gray-500 mb-3">
                {{ plan.description }}
              </p>

              <!-- ROI -->
              <div class="text-center mb-4">
                <span class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">
                  {{ plan.dailyRoi }}%
                </span>
                <span class="text-gray-500 text-sm font-medium"> Daily</span>
              </div>

              <div class="pricing-table-divider border-t border-gray-200 my-4"></div>

              <!-- Duration chip -->
              <div class="text-center mb-4">
                <span class="inline-block px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider
                             bg-gradient-to-r from-gold-500/10 to-gold-600/10 text-primary-900">
                  {{ plan.duration }} day{{ plan.duration === 1 ? '' : 's' }} plan
                </span>
                <p class="text-xs text-gray-500 mt-2">
                  Total ROI: <strong class="text-emerald-600">{{ planTotalRoi(plan) }}%</strong>
                </p>
              </div>

              <div class="pricing-table-divider border-t border-gray-200 my-4"></div>

              <!-- Details list -->
              <ul class="space-y-3 mb-5">
                <!-- Amount range -->
                <li class="flex items-center text-gray-600 text-sm md:text-base">
                  <i class="bi bi-cash-stack text-gold-500 mr-3 flex-shrink-0 text-sm"></i>
                  <span>
                    Min: <strong>${{ formatMoney(plan.minAmount, 0) }}</strong>
                    · Max:
                    <strong>${{ plan.maxAmount >= 1_000_000 ? '∞' : formatMoney(plan.maxAmount, 0) }}</strong>
                  </span>
                </li>

                <!-- Backend features (if any) -->
                <li
                  v-for="(feature, i) in (plan.features || []).slice(0, 3)"
                  :key="i"
                  class="flex items-start text-gray-600 text-sm md:text-base"
                >
                  <i class="bi bi-check-circle-fill text-gold-500 mr-3 flex-shrink-0 text-sm mt-0.5"></i>
                  <span>{{ feature }}</span>
                </li>

                <!-- Fallback feature if backend has none -->
                <li
                  v-if="!plan.features?.length"
                  class="flex items-start text-gray-600 text-sm md:text-base"
                >
                  <i class="bi bi-shield-check text-gold-500 mr-3 flex-shrink-0 text-sm mt-0.5"></i>
                  <span>Principal returned at end</span>
                </li>
                <li
                  v-if="!plan.features?.length"
                  class="flex items-start text-gray-600 text-sm md:text-base"
                >
                  <i class="bi bi-headset text-gold-500 mr-3 flex-shrink-0 text-sm mt-0.5"></i>
                  <span>24/7 active support</span>
                </li>
              </ul>

              <!-- CTA -->
              <NuxtLink
                :to="authStore.state.isAuthenticated
                  ? `/dashboard/plans/${plan.slug}`
                  : `/register?plan=${plan.slug}`"
                class="gold-btn block text-center text-sm md:text-base font-semibold"
              >
                {{ authStore.state.isAuthenticated ? 'Invest Now' : 'Get Started' }}
              </NuxtLink>

              <!-- Hover effect gradient -->
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useInvestmentStore } from '~/stores/investment'
import { useAuthStore } from '~/stores/auth'

// ─────────────────────────────────────────────────────────────
// STORES
// ─────────────────────────────────────────────────────────────
const store = useInvestmentStore()
const authStore = useAuthStore()

// ─────────────────────────────────────────────────────────────
// REFS
// ─────────────────────────────────────────────────────────────
const sectionRef = ref(null)

// ─────────────────────────────────────────────────────────────
// COMPUTED
// ─────────────────────────────────────────────────────────────
const sortedPlans = computed(() => store.sortedPlans)

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatMoney = (n, decimals = 2) =>
  Number(n || 0).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

const planTotalRoi = (plan) => {
  if (plan.totalRoi) return plan.totalRoi
  return Number((plan.dailyRoi * plan.duration).toFixed(2))
}

// ─────────────────────────────────────────────────────────────
// ANIMATIONS (CSS-based — no GSAP dependency)
// ─────────────────────────────────────────────────────────────
const animateCards = () => {
  if (!import.meta.client) return
  nextTick(() => {
    const cards = document.querySelectorAll('.pricing-box-2')
    cards.forEach((card, index) => {
      card.style.opacity = '0'
      card.style.transform = 'translateY(30px)'
      card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`
      requestAnimationFrame(() => {
        card.style.opacity = '1'
        card.style.transform = 'translateY(0)'
      })
    })
  })
}

let observer = null

onMounted(async () => {
  // Fetch plans from backend
  await store.fetchPlans()

  // Animate once loaded
  if (sortedPlans.value.length) {
    animateCards()
  }

  // Scroll-triggered re-animation (optional)
  if (import.meta.client && sectionRef.value) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCards()
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.gold-btn {
  font-family: "Oswald", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  color: #020862;
  border: none;
  background: linear-gradient(135deg, #ffe098 0%, #ebbe64 25%, #bb914a 50%, #ebbe64 75%, #ffe098 100%);
  background-size: 200% auto;
  transition: all 0.4s ease;
  padding: 0.75em 1.5em;
  border-radius: 0.75rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(187, 145, 74, 0.25);
}

.gold-btn:hover {
  background-position: right center;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 30px rgba(187, 145, 74, 0.35);
  text-decoration: none;
}

.pricing-box-2 {
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  will-change: transform, opacity;
}

.pricing-box-2::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(187, 145, 74, 0.03), transparent 70%);
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.pricing-box-2:hover::before {
  opacity: 1;
}

.pricing-box-2 .bi-check-circle-fill {
  transition: transform 0.3s ease;
}

.pricing-box-2:hover .bi-check-circle-fill {
  transform: scale(1.1);
}

@media (max-width: 640px) {
  .pricing-box-2 {
    padding: 1.5rem;
  }
}
</style>