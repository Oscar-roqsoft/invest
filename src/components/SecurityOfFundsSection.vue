<template>
    <section id="security-of-funds-section" class="bg-white py-10 md:py-16 lg:py-20">
      <div class="security-of-funds-wrapper max-w-[102rem] mx-auto px-4 md:px-8 lg:px-12 flex flex-col-reverse lg:flex-row justify-between lg:justify-evenly xl:justify-between">
        <!-- Left Column - Image -->
        <div class="left-div flex items-center w-full lg:w-[40%] mt-4 lg:mt-0">
          <div class="security-of-funds-img w-full text-center lg:text-left">
            <picture>
              <source
                srcset="/mfx-security-of-funds.png 2x"
                type="image/png"
              >
              <source
                srcset="/mfx-security-of-funds.png 2x"
                type="image/png"
              >
              <source
                srcset="/mfx-security-of-funds.png"
                type="image/png"
              >
              <img 
                src="/mfx-security-of-funds.png"
                alt="Security-icon"
                type="image/png"
                class="w-[94%] md:w-1/2 lg:w-full h-auto mx-auto lg:mx-0"
              >
            </picture>
          </div>
        </div>
  
        <!-- Right Column - Content -->
        <div class="right-div flex flex-col justify-center w-full lg:w-[46%]">
          <div class="security-of-funds-title font-oswald font-medium text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-400">
            SECURITY OF FUNDS
          </div>
          
          <div class="security-of-funds-heading text-primary-800 font-oswald text-xl md:text-2xl lg:text-3xl font-medium mt-1 md:mt-2">
            $1 MILLION EXCESS LOSS INSURANCE PER ACCOUNT
          </div>
          
          <div class="security-of-funds-body text-primary-800 text-sm md:text-base lg:text-xl leading-relaxed mt-1 md:mt-3 lg:mt-5">
            Our partners have grown along with CoinSquare Wealth in the past two decades, and our
            latest entity, MCT Atlantic, is taking our success a step further by offering unparalleled
            security to our traders. MCT Atlantic has taken out an insurance policy with Lloyd's of
            London, the world's leading insurance market, that protects clients' funds for up to
            USD$1 million per account.
          </div>
  
          <!-- Learn More Link -->
          <a 
            href="#" 
            class="security-learn-more relative w-fit mt-4 md:mt-6 lg:mt-12 no-underline group"
          >
            <span class="security-link text-gold-500 uppercase font-oswald text-lg md:text-xl transition-colors duration-300 group-hover:text-primary-800">
              Learn More
            </span>
            <svg 
              class="security-arrow absolute h-6 top-1/2 -translate-y-1/2 transition-all duration-300 group-hover:filter group-hover:brightness-[0.08] group-hover:saturate-[52] group-hover:hue-rotate-[235deg]"
              :class="dir === 'ltr' ? 'right-[-5%] group-hover:right-[-15%]' : 'left-[-5%] group-hover:left-[-15%]'"
              xmlns="http://www.w3.org/2000/svg" 
              width="1em" 
              height="1em" 
              viewBox="0 0 16 16"
            >
              <path 
                fill="currentColor" 
                d="M5.854 4.146a.5.5 0 0 1 0 .708L3.207 7.5H12.5a.5.5 0 0 1 0 1H3.207l2.647 2.646a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { useRuntimeConfig } from '#app'
  
  // Detect RTL direction
  const dir = ref('ltr')
  
  onMounted(() => {
    const htmlDir = document.documentElement.dir || 'ltr'
    dir.value = htmlDir
  })
  </script>
  
  <style scoped>
  .security-learn-more .security-arrow {
    transition: all 0.3s ease;
  }
  
  /* RTL Support */
  :root[dir="rtl"] .security-learn-more .security-arrow {
    transform: translate(50%, -50%) scaleX(-1);
  }
  
  :root[dir="rtl"] .security-learn-more .security-arrow {
    left: -5%;
  }
  
  :root[dir="rtl"] .security-learn-more:hover .security-arrow {
    left: -15%;
  }
  </style>