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
  
          <!-- Tab Navigation -->
          <fieldset class="border-0 p-0">
            <div class="flex flex-wrap justify-center gap-3 md:gap-4">
              <label 
                v-for="tab in tabs" 
                :key="tab.key"
                class="cursor-pointer"
              >
                <input 
                  type="radio" 
                  name="radio" 
                  :value="tab.key"
                  v-model="activeTab"
                  @change="selectPlan(tab.key)"
                  class="hidden"
                >
                <span 
                  class="tab-button inline-block px-6 md:px-8 py-3 rounded-xl font-oswald text-sm md:text-base font-semibold transition-all duration-300"
                  :class="activeTab === tab.key 
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/30 scale-105' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-primary-900'"
                  ref="tabButtons"
                >
                  {{ tab.label }}
                </span>
              </label>
            </div>
          </fieldset>
  
          <!-- Investment Packages -->
          <div class="mt-10 md:mt-14">
            <div 
              v-for="tab in tabs" 
              :key="tab.key"
              class="price-tab"
              :class="[tab.key, { 'active': activeTab === tab.key }]"
              :style="{ display: activeTab === tab.key ? 'block' : 'none' }"
            >
              <div 
                class="pricing-table grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                ref="pricingGrid"
              >
                <div 
                  v-for="(plan, index) in getPlansForTab(tab.key)" 
                  :key="plan.name"
                  class="pricing-box-2 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 hover:border-gold-500/30 group"
                  :data-index="index"
                  ref="planCards"
                >
                  <!-- Popular Badge -->
                  <div v-if="plan.popular" class="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span class="inline-block px-4 py-1 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-semibold rounded-full shadow-lg shadow-gold-500/30">
                      Most Popular
                    </span>
                  </div>
  
                  <!-- Plan Icon -->
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500/10 to-gold-600/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <i :class="getPlanIcon(plan.name)" class="text-2xl text-gold-500"></i>
                  </div>
  
                  <h2 class="text-xl md:text-2xl font-bold text-primary-900 text-center mb-2 tracking-wide">
                    {{ plan.name }}
                  </h2>
                  
                  <div class="text-center mb-4">
                    <span class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">
                      {{ plan.roi }}%
                    </span>
                    <span class="text-gray-500 text-sm font-medium"> ROI</span>
                  </div>
  
                  <div class="pricing-table-divider border-t border-gray-200 my-4"></div>
  
                  <a 
                    class="gold-btn block text-center text-sm md:text-base font-semibold" 
                    href="/?a=signup"
                  >
                    {{ plan.duration }}
                  </a>
  
                  <div class="pricing-table-divider border-t border-gray-200 my-4"></div>
  
                  <ul class="space-y-3">
                    <li 
                      v-for="detail in plan.details" 
                      :key="detail"
                      class="flex items-center text-gray-600 text-sm md:text-base"
                    >
                      <i class="bi bi-check-circle-fill text-gold-500 mr-3 flex-shrink-0 text-sm"></i>
                      <span>{{ detail }}</span>
                    </li>
                  </ul>
  
                  <!-- Hover effect gradient -->
                  <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick, watch } from 'vue'
  import gsap from 'gsap'
  
  const activeTab = ref('weekly')
  const sectionRef = ref(null)
  const planCards = ref([])
  const pricingGrid = ref(null)
  const tabButtons = ref([])
  let animationTimeline = null
  let floatAnimations = []
  
  const tabs = [
    { key: 'weekly', label: 'INVESTMENT PACKAGES' },
  ]
  
  const plansData = {
    weekly: [
      {
        name: 'Stable Plan',
        roi: '3.00',
        duration: 'after 24 hours',
        popular: false,
        details: [
          'minimum: $50.00',
          'maximum: $4,999.00',
          '5% Ref Commission',
          '24/7 active support'
        ]
      },
      {
        name: 'Moderate Plan',
        roi: '5.00',
        duration: 'After 2 days',
        popular: false,
        details: [
          'minimum: $5,000.00',
          'maximum: $9,999.00',
          '5% Ref Commission',
          '24/7 active support'
        ]
      },
      {
        name: 'Golden Plan',
        roi: '10.00',
        duration: 'After 4 days',
        popular: true,
        details: [
          'minimum: $10,000.00',
          'maximum: $30,000.00',
          '5% Ref Commission',
          '24/7 active support'
        ]
      },
      {
        name: 'Exclusive Plan',
        roi: '15.00',
        duration: 'After 6 days',
        popular: false,
        details: [
          'minimum: $100,000.00',
          'maximum: ∞',
          '5% Ref Commission',
          '24/7 active support'
        ]
      }
    ]
  }
  
  const getPlansForTab = (tabKey) => {
    return plansData[tabKey] || []
  }
  
  const getPlanIcon = (name) => {
    const icons = {
      'Stable Plan': 'bi-shield-check',
      'Moderate Plan': 'bi-graph-up-arrow',
      'Golden Plan': 'bi-trophy',
      'Exclusive Plan': 'bi-diamond'
    }
    return icons[name] || 'bi-star'
  }
  
  const selectPlan = (plan) => {
    activeTab.value = plan
  }
  
  // Animate cards with GSAP
  const animateCards = () => {
    // Kill any existing animations
    if (animationTimeline) {
      animationTimeline.kill()
    }
    
    // Kill floating animations
    floatAnimations.forEach(anim => anim.kill())
    floatAnimations = []
  
    const cards = document.querySelectorAll('.pricing-box-2')
    if (cards.length === 0) return
  
    // Set initial state
    gsap.set(cards, { 
      opacity: 0, 
      y: 60, 
      scale: 0.9,
      clearProps: 'all'
    })
  
    // Create timeline for card entrance
    animationTimeline = gsap.timeline({
      defaults: {
        ease: 'power3.out',
        duration: 0.8
      }
    })
  
    // Animate each card with stagger
    animationTimeline.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: {
        amount: 0.4,
        from: 'start',
        ease: 'power3.out'
      },
      duration: 0.8,
      ease: 'power3.out'
    })
  
    // Add floating animation after entrance
    animationTimeline.call(() => {
      cards.forEach((card, index) => {
        const floatAnim = gsap.to(card, {
          y: -10,
          duration: 2 + (index * 0.2),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.15
        })
        floatAnimations.push(floatAnim)
      })
    }, [], '+=0.2')
  }
  
  // Animate tab buttons
  const animateTabs = () => {
    const buttons = document.querySelectorAll('.tab-button')
    if (buttons.length === 0) return
  
    gsap.from(buttons, {
      opacity: 0,
      y: -30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      clearProps: 'all'
    })
  }
  
  // Watch for tab changes
  watch(activeTab, () => {
    nextTick(() => {
      setTimeout(animateCards, 300)
    })
  })
  
  // Intersection Observer for scroll-triggered animation
  let observer = null
  
  onMounted(() => {
    // Initial animations
    nextTick(() => {
      animateTabs()
      // Wait a bit for cards to render before animating
      setTimeout(animateCards, 500)
    })
  
    // Set up Intersection Observer
    if (sectionRef.value) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Animate cards when section comes into view
            setTimeout(animateCards, 200)
            // Unobserve after animation triggers
            observer.unobserve(entry.target)
          }
        })
      }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      })
  
      observer.observe(sectionRef.value)
    }
  
    // Also trigger on page load if section is already visible
    setTimeout(() => {
      if (sectionRef.value) {
        const rect = sectionRef.value.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        if (isVisible) {
          animateCards()
        }
      }
    }, 1000)
  })
  
  // Cleanup
  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
    if (animationTimeline) {
      animationTimeline.kill()
    }
    floatAnimations.forEach(anim => anim.kill())
    floatAnimations = []
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
  
  /* Tab button styles */
  .tab-button {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
  }
  
  .tab-button::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #bb914a, #ebbe64);
    transition: all 0.3s ease;
    transform: translateX(-50%);
    border-radius: 2px;
  }
  
  .tab-button:hover::after {
    width: 60%;
  }
  
  .tab-button.bg-gradient-to-r::after {
    display: none;
  }
  
  /* Card hover effect */
  .pricing-box-2 .bi-check-circle-fill {
    transition: transform 0.3s ease;
  }
  
  .pricing-box-2:hover .bi-check-circle-fill {
    transform: scale(1.1);
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    .pricing-box-2 {
      padding: 1.5rem;
    }
    
    .tab-button {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
    }
  }
  </style>