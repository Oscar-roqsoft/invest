<template>
    <section id="crypto-widget-section" class="bg-white py-12 md:py-20 px-4 md:px-6">
      <div class="crypto-widget-container max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <!-- Left - Widget Frame -->
        <div class="crypto-widget-col crypto-widget-frame flex-[2] min-w-0 w-full md:w-auto">
          <div class="rounded-lg overflow-hidden shadow-[0_4px_24px_rgba(3,16,95,0.12)]">
            <iframe 
              height="400" 
              width="100%"
              src="https://www.widgets.investing.com/top-cryptocurrencies?theme=darkTheme&roundedCorners=true"
              frameborder="0" 
              allowtransparency="true" 
              marginwidth="0" 
              marginheight="0"
              class="block w-full h-[400px] md:h-[400px]"
              loading="lazy"
            ></iframe>
          </div>
        </div>
  
        <!-- Right - Text Content -->
        <div class="crypto-widget-col crypto-widget-text flex-1 min-w-0 w-full md:w-auto">
          <h2 class="text-primary-800 font-oswald font-bold text-2xl md:text-3xl lg:text-4xl leading-tight mb-4 md:mb-6">
            Trade The Coins Of The Future
          </h2>
          
          <ul class="crypto-widget-list list-none m-0 p-0 mb-4 md:mb-8">
            <li 
              v-for="item in cryptoItems" 
              :key="item"
              class="flex items-center gap-2 md:gap-3 text-primary-800 text-sm md:text-lg font-semibold py-1 md:py-2"
            >
              <span class="flex-shrink-0 w-3 h-3 border-l-[3px] border-b-[3px] border-gold-500 -rotate-45 mt-[-0.2rem]"></span>
              {{ item }}
            </li>
          </ul>
  
          <a 
            href="?a=signup" 
            class="crypto-widget-cta inline-block text-gold-500 font-semibold text-sm md:text-base no-underline border-2 border-gold-500 rounded-full px-6 md:px-10 py-2 md:py-3 transition-all duration-200 hover:bg-gold-500 hover:text-white"
          >
            Register Now
          </a>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const cryptoItems = [
    'Plenty of Options',
    'No Hidden Fees',
    'Safety First',
    'Cryptos and Fiat Currencies'
  ]
  </script>