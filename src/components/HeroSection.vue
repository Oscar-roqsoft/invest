<template>
    <section id="heading-section" class="overflow-hidden bg-primary-900 min-h-screen pt-20 flex items-center relative">
      <div class="gh-heading-section relative w-full h-full">
        <!-- Background Video Container -->
        <div class="gh-background-video-wrapper absolute inset-0 w-full h-full overflow-hidden">
          <!-- Video Element - Shows on all devices -->
          <video 
            ref="videoRef"
            class="gh-background-video absolute w-full h-full object-cover"
            src="/bg.mp4"
            autoplay 
            muted 
            loop 
            playsinline 
            preload="auto"
          ></video>
          
          <!-- Fallback Image if video fails -->
          <div 
            class="gh-background-fallback absolute inset-0 w-full h-full bg-cover bg-center hidden"
            style="background-image: linear-gradient(135deg, #010C3E 0%, #000832 100%);"
          ></div>
          
          <!-- Overlay -->
          <div class="gh-background-video-overlay absolute inset-0 bg-gradient-to-b from-primary-900/70 via-primary-900/50 to-primary-900/80 pointer-events-none"></div>
        </div>
  
        <!-- Front Content -->
        <div class="gh-front-content relative z-10 pt-20  min-h-screen flex items-center">
          <div class="gh-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              <!-- Left Content - Main Text -->
              <div class="lg:col-span-7 xl:col-span-8">
                <div class="max-w-3xl mx-auto lg:mx-0">
                  <!-- Badge -->
                  <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6 md:mb-8">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                    </span>
                    <span class="text-gold-400 text-xs md:text-sm font-medium tracking-wider uppercase">Trusted by 10,000+ investors</span>
                  </div>
  
                  <!-- Main Heading -->
                  <h1 class="gh-title text-white font-oswald font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight mb-6 md:mb-8 text-center lg:text-left">
                    Smarter Investments Today,
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500">Built for Lasting Value</span> Tomorrow.
                  </h1>
                  
                  <!-- Description -->
                  <p class="board2 text-white/80 text-base sm:text-lg md:text-xl leading-relaxed mb-8 md:mb-10 text-center lg:text-left max-w-2xl">
                    CoinSquare Wealth is a forward-thinking investment firm built around spotting the right opportunities
                    early and turning them into lasting growth, guided by disciplined portfolio management and a deliberate 
                    approach to allocating capital.
                  </p>
                  
                  <!-- Buttons -->
                  <div class="board flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a class="gold-btn group flex items-center justify-center gap-2 px-8 py-3.5 md:px-10 md:py-4 text-sm md:text-base font-semibold rounded-xl transition-all duration-300" href="login">
                      <span>Login</span>
                      <i class="bi bi-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                    </a>
                    <a class="gold-btn-outline group flex items-center justify-center gap-2 px-8 py-3.5 md:px-10 md:py-4 text-sm md:text-base font-semibold rounded-xl border-2 border-gold-500/50 text-white hover:bg-gold-500 hover:text-primary-900 transition-all duration-300" href="register">
                      <span>Get Started</span>
                      <i class="bi bi-rocket-takeoff group-hover:rotate-12 transition-transform duration-300"></i>
                    </a>
                  </div>
  
                  <!-- Trust Indicators -->
                  <div class="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/10">
                    <div class="text-center lg:text-left">
                      <div class="text-2xl md:text-3xl font-bold text-gold-400">10K+</div>
                      <div class="text-xs md:text-sm text-white/50 uppercase tracking-wider">Active Investors</div>
                    </div>
                    <div class="text-center lg:text-left">
                      <div class="text-2xl md:text-3xl font-bold text-gold-400">$2B+</div>
                      <div class="text-xs md:text-sm text-white/50 uppercase tracking-wider">Trading Volume</div>
                    </div>
                    <div class="text-center lg:text-left">
                      <div class="text-2xl md:text-3xl font-bold text-gold-400">98%</div>
                      <div class="text-xs md:text-sm text-white/50 uppercase tracking-wider">Satisfaction Rate</div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Right Content - Tabs & Widget -->
              <div class="lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0">
                <div class="space-y-6">
                  <!-- Feature Tabs -->
                  <div class="grid grid-cols-2 gap-4">
                    <!-- Social Trading Tab -->
                    <div class="tabs-slide-wrapper">
                      <div class="tabs-slide bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center cursor-pointer hover:bg-white/10 hover:border-gold-500/30 transition-all duration-300 group">
                        <div class="tabs-slide-body">
                          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                            <img 
                              loading="lazy" 
                              class="tabs-slide-icon w-8 h-8"
                              src="/tab-mex-social-trading.svg"
                              alt="SOCIAL TRADING"
                            />
                          </div>
                          <div class="tabs-slide-title text-white font-oswald font-semibold text-xs md:text-sm uppercase tracking-wider">Social Trading</div>
                          <div class="tabs-slide-collapsible mt-2">
                            <div class="tabs-slide-content text-white/60 text-xs leading-relaxed">Profit from expert investors</div>
                          </div>
                        </div>
                      </div>
                    </div>
  
                    <!-- CoinSquare Wealth Tab -->
                    <div class="tabs-slide-wrapper">
                      <div class="tabs-slide bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center cursor-pointer hover:bg-white/10 hover:border-gold-500/30 transition-all duration-300 group">
                        <div class="tabs-slide-body">
                          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                            <img 
                              loading="lazy" 
                              class="tabs-slide-icon w-8 h-8"
                              src="/tab-mex-digital.svg"
                              alt="CoinSquare Wealth"
                            />
                          </div>
                          <div class="tabs-slide-title text-white font-oswald font-semibold text-xs md:text-sm uppercase tracking-wider">CoinSquare Wealth</div>
                          <div class="tabs-slide-collapsible mt-2">
                            <div class="tabs-slide-content text-white/60 text-xs leading-relaxed">Leverage up to 20x on packages</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- TradingView Widget -->
                  <div class="tradingview-widget-container w-full rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
                    <iframe 
                      scrolling="no" 
                      allowtransparency="true" 
                      frameborder="0"
                      src="https://www.tradingview-widget.com/embed-widget/ticker-tape/?locale=en#%7B%22symbols%22%3A%5B%7B%22proName%22%3A%22FOREXCOM%3ASPXUSD%22%2C%22title%22%3A%22S%26P%20500%22%7D%2C%7B%22proName%22%3A%22FOREXCOM%3ANSXUSD%22%2C%22title%22%3A%22US%20100%22%7D%2C%7B%22proName%22%3A%22FX_IDC%3AEURUSD%22%2C%22title%22%3A%22EUR%2FUSD%22%7D%2C%7B%22proName%22%3A%22BITSTAMP%3ABTCUSD%22%2C%22title%22%3A%22Bitcoin%22%7D%2C%7B%22proName%22%3A%22BITSTAMP%3AETHUSD%22%2C%22title%22%3A%22Ethereum%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22NASDAQ%3ATSLA%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22NASDAQ%3ANVDA%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22NASDAQ%3AAAPL%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22NASDAQ%3AAMZN%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22NASDAQ%3AMSFT%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22NASDAQ%3AGOOGL%22%7D%2C%7B%22description%22%3A%22%22%2C%22proName%22%3A%22TVC%3AGOLD%22%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%2C%22displayMode%22%3A%22compact%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A72%2C%22utm_source%22%3A%22veltrixholdingsltd.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22ticker-tape%22%2C%22page-uri%22%3A%22veltrixholdingsltd.com%2F%3Fa%3Dhome%22%7D"
                      title="ticker tape TradingView widget" 
                      lang="en"
                      class="w-full h-[72px] block"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  const videoRef = ref(null)
  
  // Video error handling - show fallback if video fails
  const handleVideoError = (event) => {
    console.warn('Video failed to load, using fallback:', event)
    const video = event.target
    if (video) {
      video.style.display = 'none'
      // Show fallback image
      const fallback = document.querySelector('.gh-background-fallback')
      if (fallback) {
        fallback.classList.remove('hidden')
      }
    }
  }
  
  // Check if video can play
  const handleCanPlay = () => {
    // Video loaded successfully
    const fallback = document.querySelector('.gh-background-fallback')
    if (fallback) {
      fallback.classList.add('hidden')
    }
  }
  
  onMounted(() => {
    // Add event listeners to video
    if (videoRef.value) {
      videoRef.value.addEventListener('error', handleVideoError)
      videoRef.value.addEventListener('canplay', handleCanPlay)
      
      // If video takes too long to load, show fallback after 3 seconds
      setTimeout(() => {
        if (videoRef.value && videoRef.value.readyState < 3) {
          videoRef.value.style.display = 'none'
          const fallback = document.querySelector('.gh-background-fallback')
          if (fallback) {
            fallback.classList.remove('hidden')
          }
        }
      }, 3000)
    }
  })
  
  onUnmounted(() => {
    if (videoRef.value) {
      videoRef.value.removeEventListener('error', handleVideoError)
      videoRef.value.removeEventListener('canplay', handleCanPlay)
    }
  })
  </script>
  
  <style scoped>
  /* Video Container - stays within hero section */
  .gh-background-video-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  /* Video Element - shows on all devices */
  .gh-background-video {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: translate(-50%, -50%);
    min-width: 100%;
    min-height: 100%;
  }
  
  /* Fallback Image */
  .gh-background-fallback {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  /* Overlay */
  .gh-background-video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;
  }
  
  /* Gold Button - Primary */
  .gold-btn {
    font-family: "Oswald", sans-serif;
    color: #020862;
    background: linear-gradient(135deg, #ffe098 0%, #ebbe64 25%, #bb914a 50%, #ebbe64 75%, #ffe098 100%);
    background-size: 200% auto;
    border: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(187, 145, 74, 0.3);
    text-decoration: none;
  }
  
  .gold-btn:hover {
    background-position: right center;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(187, 145, 74, 0.4);
    text-decoration: none;
  }
  
  /* Gold Button - Outline */
  .gold-btn-outline {
    font-family: "Oswald", sans-serif;
    color: white;
    background: transparent;
    border: 2px solid rgba(187, 145, 74, 0.5);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    text-decoration: none;
  }
  
  .gold-btn-outline:hover {
    background: linear-gradient(135deg, #bb914a, #ebbe64);
    color: #020862;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(187, 145, 74, 0.3);
    text-decoration: none;
  }
  
  /* Responsive adjustments */
  @media (max-width: 991px) {
    .board {
      display: flex;
      justify-content: center;
    }
    .board2 {
      text-align: center;
    }
  }
  
  @media (min-width: 992px) {
    .board {
      display: flex;
      justify-content: flex-start;
    }
    .board2 {
      text-align: left;
    }
  }
  
  /* Glassmorphism tabs */
  .tabs-slide {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  /* Ensure video fills container */
  .gh-heading-section {
    height: 100%;
    min-height: 100vh;
  }
  
  /* Mobile video fixes */
  @media (max-width: 1023px) {
    .gh-background-video-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      min-height: 100vh;
    }
    
    .gh-background-video {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  </style>