<template>
    <section id="platforms-app-section" class="py-12 md:py-20 px-4 md:px-6 bg-[#0a0e27]">
      <div class="platforms-app-container max-w-6xl mx-auto">
        <h2 class="platforms-app-title text-white text-center font-oswald font-bold text-3xl md:text-4xl mb-8 md:mb-12">
          Powerful Platforms You Can Trust
        </h2>
        
        <div class="platforms-app-row flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          <!-- Left Column - Text -->
          <div class="platforms-app-col flex-1 min-w-0 w-full md:w-auto">
            <div class="platforms-app-text">
              <p class="text-white text-lg md:text-2xl font-bold font-oswald leading-relaxed mb-4 md:mb-8">
                Powerful platforms you can trust at CoinSquare Wealth, we offer a wide variety of platforms for traders of all levels!
              </p>
              <div class="platforms-app-buttons flex flex-wrap gap-2 md:gap-4">
                <a href="#" class="platforms-app-btn inline-flex bg-white rounded-3xl hover:opacity-80 transition-opacity">
                  <img src="/google.png" alt="Get it on Google Play" class="h-8 md:h-12 w-auto object-contain">
                </a>
                <a href="#" class="platforms-app-btn inline-flex bg-white rounded-3xl hover:opacity-80 transition-opacity">
                  <img src="/apple.png" alt="Download on the App Store" class="h-8 md:h-12 w-auto object-contain">
                </a>
              </div>
            </div>
          </div>
  
          <!-- Center Column - Mockup -->
          <div class="platforms-app-col platforms-app-mockup text-center flex-1 min-w-0 w-full md:w-auto">
            <img 
              src="/mockup.png" 
              alt="CoinSquare Wealth mobile app" 
              class="max-w-full h-auto w-36 md:w-64 mx-auto"
            >
          </div>
  
          <!-- Right Column - Features -->
          <div class="platforms-app-col platforms-app-features flex flex-col gap-3 md:gap-6 w-full md:w-auto">
            <div 
              v-for="feature in features" 
              :key="feature"
              class="platforms-app-feature text-white text-sm md:text-xl font-semibold font-oswald border-l-2 border-gold-500 pl-2 md:pl-4"
            >
              {{ feature }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const features = [
    'CoinSquare TradeGo',
    'CoinSquare WebTrader',
    'CoinSquare Social',
    'CoinSquare Options'
  ]
  </script>