<template>
    <section id="crypto-widget-section" class="py-12 md:py-20 px-4 md:px-6 bg-white">
      <div class="crypto-widget-container max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <!-- Left - Widget Frame -->
        <div class="crypto-widget-col crypto-widget-frame flex-[2] min-w-0 w-full md:w-auto">
          <div class="rounded-lg overflow-hidden shadow-[0_4px_24px_rgba(3,16,95,0.12)]">
            <!-- TradingView Widget -->
            <div class="tradingview-widget-container" style="width: 100%; height: 400px;">
              <iframe 
                scrolling="no" 
                allowtransparency="true" 
                frameborder="0"
                src="https://www.tradingview-widget.com/embed-widget/screener/?locale=en#%7B%22width%22%3A%22100%25%22%2C%22height%22%3A400%2C%22defaultColumn%22%3A%22overview%22%2C%22screener_type%22%3A%22crypto_mkt%22%2C%22displayCurrency%22%3A%22USD%22%2C%22colorTheme%22%3A%22light%22%2C%22locale%22%3A%22en%22%7D"
                title="Crypto Screener TradingView widget"
                lang="en"
                class="w-full h-[400px] block"
              ></iframe>
            </div>
          </div>
        </div>
  
        <!-- Right - Text Content -->
        <div class="crypto-widget-col crypto-widget-text flex-1 min-w-0 w-full md:w-auto">
          <h2 class="text-primary-800 font-oswald font-bold text-2xl md:text-4xl leading-tight mb-4 md:mb-6">
            Real-Time Crypto Market Data
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
            href="#" 
            class="crypto-widget-cta inline-block text-gold-500 font-semibold text-sm md:text-base no-underline border-2 border-gold-500 rounded-full px-4 md:px-10 py-2 md:py-3 transition-all duration-200 hover:bg-gold-500 hover:text-white"
          >
            Start Trading Now
          </a>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const cryptoItems = [
    'Live prices for Bitcoin, Ethereum, and 100+ assets',
    'Advanced charting with 100+ indicators',
    'Market depth and order book analytics'
  ]
  </script>