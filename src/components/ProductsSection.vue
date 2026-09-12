<template>
    <section id="our-products-section" class="py-16 md:py-24 lg:py-32 bg-primary-900 relative overflow-hidden">
      <!-- Background Decorations -->
      <div class="products-bg-candles absolute inset-0 opacity-10 pointer-events-none">
        <!-- Animated floating elements -->
        <div class="floating-element absolute top-10 left-10 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div class="floating-element absolute bottom-10 right-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div class="floating-element absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/3 rounded-full blur-3xl"></div>
      </div>
      
      <div class="products-wrapper container-custom relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="w-full">
          <!-- Section Header -->
          <div class="text-center mb-12 md:mb-16 lg:mb-20">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-4 md:mb-6">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
              </span>
              <span class="text-gold-400 text-xs md:text-sm font-medium tracking-wider uppercase">Investment Solutions</span>
            </div>
  
            <h2 class="product-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              Smart Investments.
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500">Stronger Future.</span>
            </h2>
            
            <p class="section-subtitle text-white/60 text-base md:text-lg lg:text-xl max-w-3xl mx-auto">
              Discover how our innovative investment solutions can help you build lasting wealth
            </p>
          </div>
          
          <!-- Content -->
          <div class="max-w-4xl mx-auto">
            <div class="products-content bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 lg:p-10 mb-10 md:mb-12">
              <p class="products-paragraph text-white/80 text-sm sm:text-base md:text-lg leading-relaxed text-center">
                Replicate the investment moves of other investors in real time, automatically. Social trading
                can be extremely beneficial when it comes to trading financial markets. We put your investments
                in new highly remunerative innovative projects, which offers great returns along. Today our company 
                has a professional team to develop a business.
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/10">
                <div class="text-center">
                  <div class="text-2xl md:text-3xl font-bold text-gold-400">10K+</div>
                  <div class="text-xs md:text-sm text-white/50 uppercase tracking-wider">Active Traders</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl md:text-3xl font-bold text-gold-400">$2B+</div>
                  <div class="text-xs md:text-sm text-white/50 uppercase tracking-wider">Trading Volume</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl md:text-3xl font-bold text-gold-400">98%</div>
                  <div class="text-xs md:text-sm text-white/50 uppercase tracking-wider">Client Satisfaction</div>
                </div>
              </div>
            </div>
  
            <p class="products-paragraph text-white/70 text-sm sm:text-base leading-relaxed text-center max-w-3xl mx-auto">
              CoinSquare Wealth is a dynamic investment company committed to identifying and nurturing
              high-potential opportunities across diverse sectors. With a focus on long-term value creation,
              the company strategically invests in innovative businesses and emerging markets.
            </p>
            
            <p class="products-paragraph text-white/70 text-sm sm:text-base leading-relaxed text-center max-w-3xl mx-auto mt-4">
              Leveraging deep industry insight and financial expertise, CoinSquare Wealth supports portfolio
              growth through smart capital allocation and active management. Its disciplined approach ensures
              sustainable returns while managing risk effectively.
            </p>
          </div>
  
          <!-- Product Buttons -->
          <div class="products-buttons grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-10 md:mt-12 max-w-5xl mx-auto">
            <a 
              class="products-button-wrapper group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 text-center hover:bg-white/10 hover:border-gold-500/30 transition-all duration-300 cursor-pointer"
              href="/coinsquare.pdf" 
              target="_blank" 
              rel="noopener"
              @click.prevent="openPdfModal('/coinsquare.pdf')"
            >
              <!-- Icon -->
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <i class="bi bi-file-pdf text-gold-400 text-2xl"></i>
              </div>
              <div class="products-button text-gold-400 font-oswald text-base md:text-lg font-semibold group-hover:text-gold-300 transition-colors">
                Registration Certificate
              </div>
              <div class="products-button-desc text-white/50 text-xs md:text-sm mt-2 leading-relaxed">
                Click to view specifications
              </div>
              <div class="mt-4 inline-flex items-center gap-2 text-gold-400/50 text-sm group-hover:text-gold-400 transition-colors">
                <span>View Document</span>
                <i class="bi bi-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
              </div>
            </a>
  
            <a 
              class="products-button-wrapper group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 text-center hover:bg-white/10 hover:border-gold-500/30 transition-all duration-300"
              href="https://www.ciro.ca/coinsquare-capital-markets-ltd" 
              target="_blank"
            >
              <!-- Icon -->
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <i class="bi bi-building text-gold-400 text-2xl"></i>
              </div>
              <div class="products-button text-gold-400 font-oswald text-base md:text-lg font-semibold group-hover:text-gold-300 transition-colors">
                Company Information
              </div>
              <div class="products-button-desc text-white/50 text-xs md:text-sm mt-2 leading-relaxed">
                Click to view specifications
              </div>
              <div class="mt-4 inline-flex items-center gap-2 text-gold-400/50 text-sm group-hover:text-gold-400 transition-colors">
                <span>Learn More</span>
                <i class="bi bi-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
              </div>
            </a>
  
            <!-- Add more product buttons as needed -->
            <a 
              class="products-button-wrapper group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 text-center hover:bg-white/10 hover:border-gold-500/30 transition-all duration-300"
              href="?a=signup"
            >
              <!-- Icon -->
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <i class="bi bi-rocket-takeoff text-gold-400 text-2xl"></i>
              </div>
              <div class="products-button text-gold-400 font-oswald text-base md:text-lg font-semibold group-hover:text-gold-300 transition-colors">
                Get Started Today
              </div>
              <div class="products-button-desc text-white/50 text-xs md:text-sm mt-2 leading-relaxed">
                Begin your investment journey
              </div>
              <div class="mt-4 inline-flex items-center gap-2 text-gold-400/50 text-sm group-hover:text-gold-400 transition-colors">
                <span>Start Now</span>
                <i class="bi bi-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
              </div>
            </a>
          </div>
        </div>
      </div>
  
      <!-- PDF Modal -->
      <div 
        v-if="isPdfModalOpen" 
        class="pdf-modal fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
        @click.self="closePdfModal"
      >
        <div class="pdf-modal-container relative w-full max-w-4xl h-full max-h-[85vh] md:max-h-[42rem] bg-primary-800 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-primary-800/95">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center">
                <i class="bi bi-file-pdf text-gold-400"></i>
              </div>
              <span class="text-white font-medium">Document Preview</span>
            </div>
            <button 
              type="button" 
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 flex items-center justify-center text-xl backdrop-blur-sm"
              @click="closePdfModal"
              aria-label="Close"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          
          <iframe 
            id="pdf-modal-frame" 
            class="pdf-modal-frame w-full h-full border-none bg-white"
            :src="pdfUrl" 
            title="Document preview"
          ></iframe>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const isPdfModalOpen = ref(false)
  const pdfUrl = ref('')
  
  const openPdfModal = (url) => {
    pdfUrl.value = url
    isPdfModalOpen.value = true
    document.body.style.overflow = 'hidden'
  }
  
  const closePdfModal = () => {
    isPdfModalOpen.value = false
    pdfUrl.value = ''
    document.body.style.overflow = ''
  }
  
  onMounted(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closePdfModal()
    }
    document.addEventListener('keydown', handleEscape)
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
    })
  })
  </script>
  
  <style scoped>
  .products-bg-candles {
    background-image: 
      radial-gradient(circle at 10% 30%, rgba(187, 145, 74, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 90% 70%, rgba(187, 145, 74, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(187, 145, 74, 0.04) 0%, transparent 70%);
  }
  
  .floating-element {
    animation: float 20s ease-in-out infinite;
  }
  
  .floating-element:nth-child(2) {
    animation-delay: -7s;
  }
  
  .floating-element:nth-child(3) {
    animation-delay: -14s;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -30px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }
  
  /* Glassmorphism card styles */
  .products-button-wrapper {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .products-button-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(187, 145, 74, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
    border-radius: 1rem;
  }
  
  .products-button-wrapper:hover::before {
    opacity: 1;
  }
  
  /* Content glass card */
  .products-content {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }
  
  .products-content:hover {
    border-color: rgba(187, 145, 74, 0.2);
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    .products-button-wrapper {
      padding: 1.5rem 1rem;
    }
  }
  
  /* Modal styling */
  .pdf-modal {
    animation: fadeIn 0.3s ease;
  }
  
  .pdf-modal-container {
    animation: slideUp 0.4s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  /* Custom scrollbar for modal */
  .pdf-modal-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .pdf-modal-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .pdf-modal-container::-webkit-scrollbar-thumb {
    background: rgba(187, 145, 74, 0.4);
    border-radius: 10px;
  }
  
  .pdf-modal-container::-webkit-scrollbar-thumb:hover {
    background: rgba(187, 145, 74, 0.6);
  }
  </style>