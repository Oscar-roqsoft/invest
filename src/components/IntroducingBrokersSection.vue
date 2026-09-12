<template>
    <section id="ib-section" class="bg-primary-900 overflow-hidden">
      <!-- Content Wrapper -->
      <div class="ib-content-wrapper relative w-full">
        <!-- Background Image -->
        <div class="ib-section-bg relative w-full h-full top-0 lg:absolute lg:mt-0 -mt-8">
          <picture class="block w-full h-full">
            <source 
              media="(min-width: 1200px)"
              srcset="/bg-ib-section.png 2x"
              type="image/png"
            >
            <source 
              media="(min-width: 1200px)"
              srcset="/bg-ib-section.png 2x"
              type="image/webp"
            >
            <source 
              media="(max-width: 1199px)"
              srcset="/bg-ib-section.png 2x"
              type="image/png"
            >
            <img 
              src="/bg-ib-section.png" 
              alt="IB-icon"
              class="absolute bottom-0 w-full h-auto object-contain rtl:scale-x-[-1]"
            >
          </picture>
        </div>
  
        <!-- Content Container -->
        <div class="ib-section-container relative max-w-[102rem] mx-auto px-4 md:px-8 lg:px-16 pt-12 lg:pt-20 xl:pt-24 z-10">
          <div class="max-w-xl lg:max-w-2xl">
            <div class="ib-section-title font-oswald font-medium text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500">
              INTRODUCING EXPERT INVESTORS
            </div>
            
            <div class="content-heading text-white text-lg md:text-xl lg:text-2xl mt-3 md:mt-5 lg:mt-7">
              Increase your profits with our top-ends traders in the industry.
            </div>
            
            <div class="content-body text-white text-sm md:text-base lg:text-xl leading-relaxed mt-3 md:mt-4 lg:mt-6">
              CoinSquare Wealth is a forward-thinking investment company focused on identifying
              opportunities, driving strategic growth, and delivering sustainable long-term value through
              smart capital allocation and disciplined portfolio management.
            </div>
          </div>
        </div>
      </div>
  
      <!-- Ribbon / Stats Section -->
      <div class="ib-section-ribbon relative w-full bg-gradient-to-r from-primary-800 to-primary-900 py-3 md:py-8 px-4 md:px-8 lg:px-16 xl:px-52">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <div 
            v-for="stat in stats" 
            :key="stat.label"
            class="card flex flex-col items-center text-center py-3 md:py-8"
          >
            <div class="counter-wrapper flex">
              <h1 
                class="count font-oswald font-medium text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-400 uppercase m-0"
                :data-target="stat.target"
                ref="counterRefs"
              >
                0
              </h1>
              <h1 class="font-oswald font-medium text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-400 uppercase m-0">
                +
              </h1>
            </div>
            <h4 class="text-white text-xs md:text-sm lg:text-base font-medium uppercase m-0">
              {{ stat.label }}
            </h4>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { onMounted, onUnmounted, ref } from 'vue'
  
  const stats = [
    { target: 1000000, label: 'CoinSquare Wealth Trade clients' },
    { target: 20000, label: 'TRADING INSTRUMENTS' },
    { target: 30000, label: 'INTRODUCING BROKERS' },
    { target: 20, label: 'Offices & branches' }
  ]
  
  const counterRefs = ref([])
  let counted = false
  let scrollHandler = null
  
  const animateCounters = () => {
    const counters = document.querySelectorAll('.count')
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'))
      const duration = 2500
      const stepTime = 16 // ~60fps
      const steps = duration / stepTime
      let current = 0
      const increment = target / steps
      
      const updateCounter = () => {
        current += increment
        if (current < target) {
          counter.textContent = Math.floor(current)
          requestAnimationFrame(updateCounter)
        } else {
          counter.textContent = target.toLocaleString()
        }
      }
      updateCounter()
    })
  }
  
  const handleScroll = () => {
    const ribbon = document.querySelector('.ib-section-ribbon')
    if (!ribbon) return
    
    const rect = ribbon.getBoundingClientRect()
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0
    
    if (!counted && isVisible) {
      counted = true
      animateCounters()
    }
  }
  
  onMounted(() => {
    // Initialize counters on mount if visible
    setTimeout(() => {
      handleScroll()
    }, 500)
    
    // Add scroll listener
    scrollHandler = handleScroll
    window.addEventListener('scroll', scrollHandler)
    window.addEventListener('resize', handleScroll)
  })
  
  onUnmounted(() => {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
      window.removeEventListener('resize', handleScroll)
    }
  })
  </script>
  
  <style scoped>
  .ib-section-container {
    padding-top: 3.75rem;
  }
  
  @media (min-width: 1200px) {
    .ib-section-container {
      padding-top: 5.625rem;
    }
  }
  
  @media (min-width: 1600px) {
    .ib-section-container {
      padding-top: 6.4375rem;
    }
  }
  
  .ib-section-bg::before {
    content: '';
    float: left;
    padding-top: 46.875%;
  }
  
  .ib-section-bg::after {
    display: block;
    content: '';
    clear: both;
  }
  
  @media (min-width: 1200px) {
    .ib-section-content-wrapper::before {
      content: '';
      float: left;
      padding-top: 31.25%;
    }
    
    .ib-section-content-wrapper::after {
      display: block;
      content: '';
      clear: both;
    }
  }
  
  /* Counter animation */
  .count {
    transition: all 0.3s ease;
  }
  
  /* RTL support */
  :root[dir="rtl"] .ib-section-bg img {
    transform: scaleX(-1);
  }
  </style>