<template>
  <div class="about-page" style="background: #030f5c;">
    <!-- Hero Section -->
    <section class="about-top-section relative z-10 pt-28">
      <!-- Upper Section with Background -->
      <div class="upper-section min-h-[39.5rem] md:min-h-[30rem] lg:min-h-[38.5rem] bg-cover bg-center bg-no-repeat flex items-center relative" 
           style="background-image: url('/why-multibank/mobile-header.webp');">
        <!-- <div class="absolute inset-0" style="background: linear-gradient(180deg, rgba(3, 15, 92, 0.85) 0%, rgba(3, 15, 92, 0.60) 50%, rgba(3, 15, 92, 0.90) 100%);"></div> -->
        <div class="container-fluid px-4 md:px-12 lg:px-16 xl:px-24 relative z-10">
          <div class="row text-center">
            <div class="col-12">
              <div class="heading max-w-[56.25rem] mx-auto">
                <span class="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs md:text-sm font-medium tracking-wider uppercase mb-4">
                  About Us
                </span>
                <h1 class="text-gold-500 font-oswald font-bold uppercase text-3xl md:text-5xl lg:text-6xl leading-tight md:leading-[4.375rem]">
                  WHY CoinSquare Wealth
                </h1>
                <div class="w-20 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"></div>
                <p class="text-white/80 text-base md:text-xl leading-relaxed mt-6 md:mt-8 font-roboto max-w-3xl mx-auto">
                  Since our inception, we have established our authority in the world of investing. Along the way, we have pioneered and shaped the crypto and financial investment landscape, continually creating exceptional products, services, and platforms that empower investors to achieve consistent success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lower Section - Cards -->
      <div class="lower-section relative -top-8 md:-top-20 lg:-top-24 z-[9]">
        <div class="container-fluid px-4 md:px-12 lg:px-16 xl:px-24">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div v-for="(card, index) in aboutCards" :key="index" class="about-card-item">
              <div class="card rounded-2xl p-6 md:p-8 h-full transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(187, 145, 74, 0.15); backdrop-filter: blur(10px);">
                <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold-500 to-gold-300 rounded-l-2xl"></div>
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-all duration-500"></div>
                <div class="relative z-10">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background: rgba(187, 145, 74, 0.15);">
                      <span class="text-gold-500 font-oswald font-bold text-sm">{{ String(index + 1).padStart(2, '0') }}</span>
                    </div>
                    <h4 class="text-gold-400 font-oswald font-semibold uppercase text-lg md:text-xl leading-relaxed flex-1" 
                        v-html="card.title">
                    </h4>
                  </div>
                  <p class="text-white/70 text-sm md:text-base leading-relaxed pl-13" 
                     v-html="card.description">
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CoinSquare Wealth Established Section -->
    <section class="multbank-group py-12 md:py-16" style="background: #030f5c;">
      <div class="container-fluid px-4 md:px-12 lg:px-16 xl:px-24">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center pb-10 md:pb-14" style="border-bottom: 1px solid rgba(187, 145, 74, 0.1);">
          <div class="lg:col-span-1">
            <span class="text-gold-400 text-sm font-medium uppercase tracking-wider block mb-3">Our Legacy</span>
            <h2 class="text-white font-oswald font-bold text-2xl md:text-4xl lg:text-5xl leading-tight uppercase">
              Established in <span class="text-gold-500">2014</span>
            </h2>
            <div class="w-16 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mt-4 rounded-full"></div>
          </div>
          <div class="lg:col-span-2 flex items-center">
            <div class="rounded-2xl p-6 md:p-8 w-full" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(187, 145, 74, 0.1); backdrop-filter: blur(10px);">
              <div class="flex flex-wrap gap-6 md:gap-10 mb-4">
                <div>
                  <div class="text-2xl md:text-3xl font-bold text-gold-500">$322M+</div>
                  <div class="text-white/50 text-xs uppercase tracking-wider">Paid-up Capital</div>
                </div>
                <div>
                  <div class="text-2xl md:text-3xl font-bold text-gold-500">1M+</div>
                  <div class="text-white/50 text-xs uppercase tracking-wider">Investors</div>
                </div>
                <div>
                  <div class="text-2xl md:text-3xl font-bold text-gold-500">100+</div>
                  <div class="text-white/50 text-xs uppercase tracking-wider">Countries</div>
                </div>
              </div>
              <p class="text-white/70 text-base md:text-lg leading-relaxed font-roboto">
                CoinSquare Wealth was established, we have evolved into one of the largest financial derivatives providers worldwide, with a current paid-up capital of over $322 million. We service an extensive client-base of over 1,000,000+ investors from across 100 countries.
              </p>
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
          <div v-for="(feature, index) in features" :key="index" class="feature-card">
            <div class="card rounded-2xl p-5 md:p-7 h-full transition-all duration-300 hover:-translate-y-1 group" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(187, 145, 74, 0.1); backdrop-filter: blur(10px);">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300" style="background: rgba(187, 145, 74, 0.15);">
                  <span class="text-gold-400 font-oswald font-bold text-sm">{{ String(index + 1).padStart(2, '0') }}</span>
                </div>
                <div class="flex-1">
                  <h5 class="text-gold-400 font-oswald font-semibold text-base md:text-lg uppercase leading-relaxed mb-2">
                    {{ feature.title }}
                  </h5>
                  <p class="text-white/60 text-sm md:text-base leading-relaxed font-roboto" 
                     v-html="feature.description">
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Customer Service Section -->
    <section class="customer-service py-12 md:py-16 relative" style="background: #030f5c;">
      <div class="upper-section-1 min-h-[20rem] md:min-h-[25rem] lg:min-h-[30rem] bg-cover bg-center bg-no-repeat flex items-center relative"
           style="background-image: url('/why-multibank/Mask.html');">
        <div class="absolute inset-0" style="background: linear-gradient(180deg, rgba(3, 15, 92, 0.85) 0%, rgba(3, 15, 92, 0.60) 50%, rgba(3, 15, 92, 0.90) 100%);"></div>
        <div class="container-fluid px-4 md:px-12 lg:px-16 xl:px-24 relative z-10">
          <div class="row text-center">
            <div class="col-12">
              <div class="heading">
                <span class="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs md:text-sm font-medium tracking-wider uppercase mb-4">
                  Support
                </span>
                <h2 class="text-white font-oswald font-bold uppercase text-3xl md:text-5xl lg:text-6xl leading-tight">
                  Dedicated <span class="text-gold-500">Customer Service</span>
                </h2>
                <div class="w-20 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"></div>
                <p class="text-white/80 text-base md:text-xl leading-relaxed mt-6 md:mt-8 font-roboto max-w-3xl mx-auto">
                  A team of well-trained and multilingual professionals is available 24-hours who are fluent in over 10 languages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Cards -->
      <div class="lower-section-1 relative -top-8 md:-top-12 lg:-top-16">
        <div class="container-fluid px-4 md:px-12 lg:px-16 xl:px-24">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div v-for="(service, index) in services" :key="index" class="service-card">
              <div class="card rounded-2xl p-6 md:p-8 h-full text-center transition-all duration-300 hover:-translate-y-1 group" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(187, 145, 74, 0.1); backdrop-filter: blur(10px);">
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110" style="background: rgba(187, 145, 74, 0.15);">
                  <img :src="service.icon" :alt="service.title" class="w-8 h-8 object-contain">
                </div>
                <p class="text-white/70 text-sm md:text-base leading-relaxed font-roboto">
                  {{ service.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-12 md:py-20" style="background: #030f5c;">
      <div class="container-fluid px-4 md:px-12 lg:px-16 xl:px-24">
        <div class="max-w-3xl mx-auto text-center">
          <span class="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs md:text-sm font-medium tracking-wider uppercase mb-4">
            Get Started
          </span>
          <h2 class="text-white font-oswald font-bold text-2xl md:text-4xl lg:text-5xl uppercase">
            TRADE WITH <span class="text-gold-500">CoinSquare Wealth</span> NOW
          </h2>
          <div class="w-20 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"></div>
          <div class="flex justify-center mt-8 md:mt-10">
            <a href="?a=login" class="gold-button inline-block px-10 md:px-14 py-4 md:py-5 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-primary-900 font-oswald font-bold text-base md:text-xl uppercase rounded-2xl shadow-lg shadow-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/50 hover:scale-[1.03] transition-all duration-300">
              OPEN LIVE ACCOUNT
              <i class="bi bi-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Risk Disclosure -->
    <section class="risk-disclosure py-10 md:py-14" style="background: #030f5c; border-top: 1px solid rgba(187, 145, 74, 0.1);">
      <div class="container-fluid px-4 md:px-12 lg:px-16 xl:px-24">
        <div class="content max-w-4xl mx-auto">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background: rgba(187, 145, 74, 0.15);">
              <i class="bi bi-shield-check text-gold-400 text-xl"></i>
            </div>
            <p class="risk-disclosure__title text-gold-400 font-oswald text-xl md:text-2xl font-semibold">
              We keep your information secured 24/7
            </p>
          </div>
          <div class="risk-disclosure__p text-white/60 text-sm md:text-base leading-relaxed pl-0 md:pl-14">
            *Your data is Important! Therefore protecting your information from unauthorised access and accidental disclosure is a top priority. CoinSquare Wealth pursues information security with the same commitment to excellence that we apply to understanding our clients financial needs. We work hard to protect your information. CoinSquare Wealth information security and data protection is driven by the same commitment to excellence that we apply to understanding the financial needs of our clients.
            <br><br>
            At CoinSquare Wealth, we employ a multi-layered approach to security. Among the systems we use to protect information are firewalls, malware identification programs, fraud detection systems, data loss prevention infrastructure, email filtering, virus controls and system redundancies, including network segmentation.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const aboutCards = [
  {
    title: 'Heavily Regulated Across <span class="font-bold">5</span> Continents',
    description: 'Closely supervised by over 10+ financial regulators worldwide across various jurisdictions, guaranteeing investor protection. Companies regulated by ASIC, AUSTRAC, BAFIN, CIMA, ESCA, FSC, FMA, MAS, TFG and VFSC. <span class="text-xs italic block mt-1 text-white/40">* pertains exclusively to certain regulated asset management products</span>'
  },
  {
    title: 'PAID-UP CAPITAL OF OVER US$ <span class="font-bold">322</span> MILLION',
    description: 'Due to our accumulated paid-up capital, we are globally recognized as one of the largest online financial derivatives providers.'
  },
  {
    title: 'FULL ECN MODEL WITH SPREADS',
    description: 'We follow a pure Non-Dealing Desk ECN trading structure with direct access to over 20 interbank trading prices without any conflict of interest.'
  },
  {
    title: 'MAXIMUM LEVERAGE UP TO <span class="font-bold">500:1</span>',
    description: 'We provide one of the highest leverage options in the market, allowing investors to amplify their returns. Our platform specializes in crypto assets, including Bitcoin and USDT, offering flexible and powerful opportunities for growth.'
  }
]

const features = [
  {
    title: '1. LUCRATIVE BROKERS PROGRAM',
    description: 'We collaborate with professionals and partners through our Introducing Brokers Program, providing them with commission and rebate structures unheard of in the industry.'
  },
  {
    title: '2. FUNDS WITHDRAWAL WITHIN 24 HOURS',
    description: 'Funds withdrawal has been made easy and accessible for the benefit of our investors.'
  },
  {
    title: '3. CUTTING-EDGE TRADING PLATFORMS',
    description: 'State-of-the-art trading platforms that are designed and developed to provide stability and enable real-time investing.'
  },
  {
    title: '4. STATE OF THE ART PRODUCTS',
    description: 'Invest in a wide range of crypto assets, including Bitcoin (BTC) and Tether (USDT), for secure and flexible growth opportunities.'
  },
  {
    title: '5. Instant and Reliable Nano-Second Execution',
    description: 'Zero commission investing on crypto assets.<br>Negative balance protection to safeguard your funds.<br>No delays, no rejections, and full support for automated strategies.'
  },
  {
    title: '6. SUPERIOR FINANCIAL SERVICES',
    description: 'Proficient Multilingual 24/7 Customer Service. <br/>Free MAM, PAMM, EA, VPS and API.'
  },
  {
    title: '7. SECURITY OF FUNDS',
    description: 'Since our companies are heavily regulated, we are expected to uphold strict rules and obligations, allowing clients the highest level of funds security.'
  },
  {
    title: '8. RECORD-BREAKING FINANCIAL PERFORMANCE',
    description: 'With a turnover of over US$ 5+ Trillion in 2020 (exceeding the 2019 annual turnover of US$ 1.9 trillion), we deliver results that instill confidence.'
  },
  {
    title: '9. GLOBAL PRESENCE IN LEADING FINANCIAL HUBS',
    description: 'We serve an international demographic of clients in collaboration with affiliates from our 20+ offices located within the financial centers of the world.'
  }
]

const services = [
  {
    icon: '/why-multibank/Group5630.svg',
    description: 'IT and operational support including service desk, onboarding, configuration, and cash management.'
  },
  {
    icon: '/why-multibank/Group5621.svg',
    description: 'Sales and market support including educational materials, videos, tutorials and seminars.'
  },
  {
    icon: '/why-multibank/Group5628.svg',
    description: 'Funding methods including: Crypto.'
  },
  {
    icon: '/why-multibank/Group5627.svg',
    description: 'Real-time online financial news in multiple languages.'
  },
  {
    icon: '/why-multibank/Group5622.svg',
    description: 'Around the clock, quick account opening and funding available.'
  },
  {
    icon: '/why-multibank/Group5629.svg',
    description: 'Regulatory and corporate support.'
  }
]
</script>

<style scoped>
/* Card hover effects */
.card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gold button hover */
.gold-button {
  transition: all 0.3s ease;
}

.gold-button:hover {
  transform: translateY(-2px);
}

/* Mobile background image fix */
@media (max-width: 768px) {
  .upper-section {
    background-image: url('/why-multibank/Mobile-Header.webp') !important;
    background-size: cover !important;
    background-position: bottom !important;
    min-height: 27rem;
  }
}

@media (max-width: 767px) {
  .upper-section-1 {
    min-height: 21.6875rem;
    background-image: url('/why-multibank/MaskGroup30.html') !important;
    background-size: cover !important;
    background-position: bottom !important;
  }
}

/* Container fluid responsive */
.container-fluid {
  padding-left: 9.375rem !important;
  padding-right: 9.375rem !important;
}

@media (max-width: 1440px) {
  .container-fluid {
    padding-left: 4rem !important;
    padding-right: 4rem !important;
  }
}

@media (max-width: 1200px) {
  .container-fluid {
    padding-left: 3rem !important;
    padding-right: 3rem !important;
  }
}

@media (max-width: 767px) {
  .container-fluid {
    padding-left: 2rem !important;
    padding-right: 2rem !important;
  }
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: "Oswald", sans-serif;
}

p {
  font-family: "Roboto Condensed", sans-serif;
}
</style>