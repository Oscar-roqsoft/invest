<template>
    <section id="where-to-go-next" class="bg-[#F1F3F9] py-12 md:py-20">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <h2 class="section-heading-title text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-400 font-oswald font-medium text-2xl md:text-3xl lg:text-5xl text-center mx-auto w-fit">
          Where To Go Next
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 md:mt-12">
          <a 
            v-for="card in cards" 
            :key="card.title"
            href="#"
            class="where-to-go-next-card relative block no-underline pb-8 group"
          >
            <div class="where-to-go-next-card-body relative z-10">
              <div class="where-to-go-next-card-icon-wrapper w-[55%] relative mx-auto pt-[55%]">
                <img 
                  :src="card.icon" 
                  :alt="card.title"
                  class="absolute inset-0 w-full h-full max-w-full object-contain object-center"
                />
              </div>
              <div class="where-to-go-next-card-title text-gold-500 font-oswald font-medium uppercase tracking-wide text-sm md:text-base lg:text-xl text-center transition-all duration-300 group-hover:text-primary-800 group-hover:translate-y-4">
                {{ card.title }}
              </div>
            </div>
            <!-- Background overlay -->
            <div class="absolute inset-0 z-0 rounded-xl bg-white"></div>
            <div class="absolute inset-0 z-0 rounded-xl bg-gradient-to-r from-primary-800 to-primary-900 transition-all duration-300 group-hover:bottom-[22%] bottom-0"></div>
          </a>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const cards = [
    {
      title: 'Start Trading',
      icon: '/trading.svg'
    },
    {
      title: 'Deposit Funds',
      icon: '/deposit.svg'
    },
    {
      title: 'Learn & Grow',
      icon: '/learn.svg'
    }
  ]
  </script>
  
  <style scoped>
  .where-to-go-next-card:before,
  .where-to-go-next-card:after {
    content: "";
    position: absolute;
    z-index: 1;
    bottom: 0;
    top: 28%;
    left: 0;
    right: 0;
    border-radius: 1.25rem;
  }
  
  .where-to-go-next-card:before {
    background-color: white;
  }
  
  .where-to-go-next-card:after {
    background: linear-gradient(90deg, #020862 0%, #000832 100%);
    transition: bottom 300ms ease;
  }
  
  .where-to-go-next-card:hover:after {
    bottom: 22%;
  }
  
  /* RTL Support */
  :root[dir="rtl"] .where-to-go-next-card:after {
    background: linear-gradient(-90deg, #020862 0%, #000832 100%);
  }
  </style>