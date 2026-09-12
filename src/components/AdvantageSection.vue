<template>
    <section 
      id="advantage-section" 
      class="overflow-hidden bg-primary-900 py-16 md:py-24 relative"
      ref="sectionRef"
    >
      <!-- Background Decorations -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/3 rounded-full blur-3xl"></div>
      </div>
  
      <div class="advantage-section-wrapper flex flex-col justify-center max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-8 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-12 md:mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-4">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
            </span>
            <span class="text-gold-400 text-xs md:text-sm font-medium tracking-wider uppercase">Why Choose Us</span>
          </div>
          
          <h2 class="advantage-section-title font-oswald font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white">
            CoinSquare Wealth 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500">ADVANTAGES</span>
          </h2>
          <p class="text-white/60 text-base md:text-lg mt-4 max-w-2xl mx-auto">
            Discover why thousands of investors trust us with their financial future
          </p>
        </div>
  
        <!-- Swiper Carousel -->
        <div class="advantage-section-cards relative mt-8 md:mt-12">
          <swiper-container
            ref="swiperRef"
            class="advantage-swiper"
            :slides-per-view="1"
            :space-between="30"
            :autoplay="{
              delay: 4000,
              disableOnInteraction: false,
            }"
            :pagination="{
              el: '.advantage-card-pagination',
              clickable: true,
            }"
            :breakpoints="{
              768: { slidesPerView: 1.5, spaceBetween: 30 },
              992: { slidesPerView: 2.5, spaceBetween: 30 },
              1200: { slidesPerView: 3.5, spaceBetween: 25 },
              1400: { slidesPerView: 4, spaceBetween: 30 }
            }"
            @swiper="onSwiper"
          >
            <swiper-slide v-for="(advantage, index) in advantages" :key="index">
              <div 
                class="advantage-card bg-primary-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-primary-700/50 transition-all duration-500 group h-full hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/10"
                :data-index="index"
                ref="cardRefs"
              >
                <!-- Icon -->
                <div class="card-icon-wrapper mb-6">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-gold-500/20">
                    <img 
                      loading="lazy" 
                      :src="advantage.image" 
                      :alt="advantage.title"
                      class="w-10 h-10 object-contain"
                    />
                  </div>
                </div>
                
                <!-- Title -->
                <h3 class="card-title text-lg md:text-xl font-oswald font-bold text-white text-center mb-3 group-hover:text-gold-400 transition-colors duration-300">
                  {{ advantage.title }}
                </h3>
                
                <!-- Description -->
                <p class="card-description text-white/60 text-sm md:text-base text-center leading-relaxed mb-4">
                  {{ advantage.description }}
                </p>
  
                <!-- Features List -->
                <ul class="space-y-2.5 mt-4 pt-4 border-t border-white/10">
                  <li 
                    v-for="item in advantage.items.slice(0, 4)" 
                    :key="item" 
                    class="flex items-start text-white/70 text-xs md:text-sm gap-2.5 hover:text-white transition-colors duration-300"
                  >
                    <i class="bi bi-check-circle-fill text-gold-400 mt-0.5 flex-shrink-0 text-xs"></i>
                    <span class="leading-relaxed">{{ item }}</span>
                  </li>
                </ul>
  
                <!-- View More Link -->
                <div class="mt-4 text-center">
                  <span class="inline-flex items-center gap-2 text-gold-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:gap-3 cursor-pointer">
                    Learn More
                    <i class="bi bi-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-300"></i>
                  </span>
                </div>
  
                <!-- Hover Gradient Overlay -->
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </swiper-slide>
          </swiper-container>
  
          <!-- Pagination -->
          <div class="advantage-card-pagination flex justify-center mt-8 gap-2"></div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  import { register } from 'swiper/element/bundle'
  import gsap from 'gsap'
  
  // Register Swiper web components
  register()
  
  const swiperRef = ref(null)
  const sectionRef = ref(null)
  const cardRefs = ref([])
  let animationTimeline = null
  let floatAnimations = []
  let observer = null
  
  const advantages = [
    {
      title: 'REGULATIONS AND SECURITY OF FUNDS',
      description: 'CoinSquare Wealth is comprised of several entities that are regulated by 11+ regulators across 5 continents.',
      image: '/advantages/adv-regulations.png',
      items: [
        '11+ regulators across 5 continents',
        '55+ Awards including Best Global Broker 2021',
        'Fully segregated client accounts',
        'Settlement facility for institutional customers',
        'Guaranteed withdrawals within 24-hours'
      ]
    },
    {
      title: 'STATE-OF-THE-ART PRODUCTS',
      description: 'Trade over 20,000 instruments including forex, metals, shares, indices, commodities & cryptocurrencies.',
      image: '/advantages/adv-products.png',
      items: [
        'Invest in crypto assets using BTC and USDT',
        'Ultra-competitive spreads on crypto assets',
        'Up to 500:1 leverage',
        'Social investing option',
        'Access free automated investment tools'
      ]
    },
    {
      title: 'CUTTING-EDGE TRADING PLATFORMS',
      description: 'Award winning MT4 desktop and mobile platforms with instant nano second execution.',
      image: '/advantages/adv-platforms.png',
      items: [
        'MT4 desktop and mobile platforms',
        'Pure Non-Dealing Desk ECN processing',
        'State-of-the-art technology',
        'Up to 5 levels of market depth',
        'Negative balance protection'
      ]
    },
    {
      title: 'UNPARALLELED FINANCIAL SERVICES',
      description: 'Dedicated multilingual 24/7 customer service with industry-leading support.',
      image: '/advantages/adv-services.png',
      items: [
        'Multilingual 24/7 customer service',
        'Trading Credit Lines available',
        'Regulated in 11+ Jurisdictions',
        'Withdrawals within 24 hours',
        '20% Deposit bonus offers'
      ]
    }
  ]
  
  const onSwiper = (swiper) => {
    swiperRef.value = swiper
  }
  
  // Animate cards with GSAP
  const animateCards = () => {
    const cards = document.querySelectorAll('.advantage-card')
    if (cards.length === 0) return
  
    // Kill existing animations
    if (animationTimeline) {
      animationTimeline.kill()
    }
    floatAnimations.forEach(anim => anim.kill())
    floatAnimations = []
  
    // Set initial state
    gsap.set(cards, {
      opacity: 0,
      y: 50,
      scale: 0.9
    })
  
    // Create timeline
    animationTimeline = gsap.timeline({
      defaults: {
        ease: 'power3.out',
        duration: 0.8
      }
    })
  
    // Animate cards with stagger
    animationTimeline.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: {
        amount: 0.4,
        from: 'start',
        ease: 'power3.out'
      }
    })
  
    // Add floating animation after entrance
    animationTimeline.call(() => {
      cards.forEach((card, index) => {
        const floatAnim = gsap.to(card, {
          y: -8,
          duration: 2.5 + (index * 0.15),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.15
        })
        floatAnimations.push(floatAnim)
      })
    }, [], '+=0.2')
  }
  
  // Animate section title
  const animateTitle = () => {
    const title = document.querySelector('.advantage-section-title')
    if (!title) return
  
    gsap.from(title, {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'back.out(1.7)',
      clearProps: 'all'
    })
  }
  
  onMounted(() => {
    nextTick(() => {
      animateTitle()
      // Wait for Swiper to initialize
      setTimeout(animateCards, 800)
    })
  
    // Set up Intersection Observer for scroll-triggered animation
    if (sectionRef.value) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCards()
            observer.unobserve(entry.target)
          }
        })
      }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      })
  
      observer.observe(sectionRef.value)
    }
  
    // Check if already visible on load
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
  /* Card Styles */
  .advantage-card {
    position: relative;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, opacity;
    height: 100%;
    min-height: 380px;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  .advantage-card:hover {
    transform: translateY(-8px);
  }
  
  /* Icon wrapper */
  .card-icon-wrapper {
    transition: all 0.3s ease;
  }
  
  .advantage-card:hover .card-icon-wrapper {
    transform: translateY(-4px);
  }
  
  /* List items */
  .advantage-card ul li {
    transition: all 0.3s ease;
  }
  
  .advantage-card:hover ul li {
    color: #ffffff;
  }
  
  /* Swiper Styles */
  .advantage-swiper {
    padding: 0.5rem 0.25rem;
  }
  
  /* Pagination */
  .advantage-card-pagination .swiper-pagination-bullet {
    width: 0.5rem;
    height: 0.5rem;
    opacity: 0.3;
    border-radius: 9999px;
    background: #bb914a;
    transition: all 0.3s ease;
  }
  
  .advantage-card-pagination .swiper-pagination-bullet-active {
    width: 2rem;
    opacity: 1;
    background: #bb914a;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .advantage-card {
      min-height: 320px;
      padding: 1.5rem;
    }
  }
  
  /* Animation keyframes */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .advantage-card.visible {
    animation: fadeInUp 0.6s ease forwards;
  }
  
  /* Swiper slide transition */
  .swiper-slide {
    height: auto;
  }
  
  /* Custom scrollbar for list if needed */
  .advantage-card ul {
    flex: 1;
  }
  
  /* View more link */
  .advantage-card .bi-arrow-right {
    transition: transform 0.3s ease;
  }
  
  .advantage-card:hover .bi-arrow-right {
    transform: translateX(4px);
  }
  
  /* Glassmorphism effect */
  .advantage-card {
    background: rgba(1, 12, 62, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  /* Border glow on hover */
  .advantage-card:hover {
    border-color: rgba(187, 145, 74, 0.4);
    box-shadow: 0 20px 60px rgba(187, 145, 74, 0.08);
  }
  </style>