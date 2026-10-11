
<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="about-top-section relative z-10">
      <!-- Hero Background -->
      <div class="upper-section relative flex items-center">
        <div class="container-fluid relative z-10">
          <div class="heading text-center">
            <span
              class="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs md:text-sm font-medium tracking-wider uppercase mb-4"
            >
              About Us
            </span>

            <h1
              class="text-gold-500 font-oswald font-bold uppercase text-[clamp(1.75rem,7vw,3rem)] md:text-5xl lg:text-6xl leading-tight"
            >
              WHY BlockCapitalInvestment Wealth
            </h1>

            <div
              class="w-20 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"
            ></div>

            <p
              class="text-white/80 text-base md:text-xl leading-relaxed mt-6 md:mt-8 font-roboto max-w-3xl mx-auto"
            >
              Since our inception, we have established our authority in the
              world of investing. Along the way, we have pioneered and shaped
              the crypto and financial investment landscape, continually
              creating exceptional products, services, and platforms that
              empower investors to achieve consistent success.
            </p>
          </div>
        </div>
      </div>

      <!-- About Cards -->
      <div class="lower-section relative z-[9]">
        <div class="container-fluid">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            <div
              v-for="(card, index) in aboutCards"
              :key="index"
              class="about-card-item"
            >
              <div
                class="card rounded-2xl p-5 md:p-7 h-full relative overflow-hidden group"
              >
                <div
                  class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold-500 to-gold-300 rounded-l-2xl"
                ></div>

                <div
                  class="absolute -top-10 -right-10 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-all duration-500"
                ></div>

                <div class="relative z-10">
                  <div class="flex items-start gap-3 mb-4">
                    <div
                      class="number-box w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    >
                      <span
                        class="text-gold-500 font-oswald font-bold text-sm"
                      >
                        {{ String(index + 1).padStart(2, '0') }}
                      </span>
                    </div>

                    <h3
                      class="text-gold-400 font-oswald font-semibold uppercase text-base md:text-lg leading-relaxed flex-1 min-w-0"
                      v-html="card.title"
                    ></h3>
                  </div>

                  <p
                    class="text-white/70 text-sm md:text-base leading-relaxed"
                    v-html="card.description"
                  ></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Company History and Features -->
    <section class="multbank-group">
      <div class="container-fluid">
        <!-- Company History -->
        <div class="legacy-grid grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center pb-10 md:pb-14">
          <div class="lg:col-span-1">
            <span
              class="text-gold-400 text-sm font-medium uppercase tracking-wider block mb-3"
            >
              Our Legacy
            </span>

            <h2
              class="text-white font-oswald font-bold text-2xl md:text-4xl lg:text-5xl leading-tight uppercase"
            >
              Established in
              <span class="text-gold-500">2014</span>
            </h2>

            <div
              class="w-16 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mt-4 rounded-full"
            ></div>
          </div>

          <div class="lg:col-span-2 min-w-0">
            <div class="legacy-card rounded-2xl p-5 md:p-8 w-full">
              <div
                class="statistics-grid grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-8 mb-6"
              >
                <div class="stat-item stat-capital">
                  <div
                    class="text-2xl md:text-3xl font-bold text-gold-500"
                  >
                    $322M+
                  </div>
                  <div
                    class="text-white/50 text-xs uppercase tracking-wider mt-1"
                  >
                    Paid-up Capital
                  </div>
                </div>

                <div class="stat-item">
                  <div
                    class="text-2xl md:text-3xl font-bold text-gold-500"
                  >
                    1M+
                  </div>
                  <div
                    class="text-white/50 text-xs uppercase tracking-wider mt-1"
                  >
                    Investors
                  </div>
                </div>

                <div class="stat-item">
                  <div
                    class="text-2xl md:text-3xl font-bold text-gold-500"
                  >
                    100+
                  </div>
                  <div
                    class="text-white/50 text-xs uppercase tracking-wider mt-1"
                  >
                    Countries
                  </div>
                </div>
              </div>

              <p
                class="text-white/70 text-base md:text-lg leading-relaxed font-roboto"
              >
                BlockCapitalInvestment Wealth was established in 2014 and has
                evolved into a financial derivatives provider, with a stated
                paid-up capital of over $322 million. We serve an extensive
                client base of over 1,000,000 investors from across 100
                countries.
              </p>
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div
          class="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12"
        >
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card"
          >
            <div class="card rounded-2xl p-5 md:p-7 h-full group">
              <div class="flex items-start gap-4">
                <div
                  class="number-box w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <span
                    class="text-gold-400 font-oswald font-bold text-sm"
                  >
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                </div>

                <div class="flex-1 min-w-0">
                  <h3
                    class="text-gold-400 font-oswald font-semibold text-base md:text-lg uppercase leading-relaxed mb-2"
                  >
                    {{ feature.title }}
                  </h3>

                  <p
                    class="text-white/60 text-sm md:text-base leading-relaxed font-roboto"
                    v-html="feature.description"
                  ></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Customer Service -->
    <section class="customer-service relative">
      <!-- Customer Service Hero -->
      <div class="upper-section-1 relative flex items-center">
        <div class="customer-overlay absolute inset-0"></div>

        <div class="container-fluid relative z-10">
          <div class="heading text-center">
            <span
              class="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs md:text-sm font-medium tracking-wider uppercase mb-4"
            >
              Support
            </span>

            <h2
              class="text-white font-oswald font-bold uppercase text-[clamp(1.65rem,6vw,2.5rem)] md:text-5xl lg:text-6xl leading-tight"
            >
              Dedicated
              <span class="text-gold-500">Customer Service</span>
            </h2>

            <div
              class="w-20 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"
            ></div>

            <p
              class="text-white/80 text-base md:text-xl leading-relaxed mt-6 md:mt-8 font-roboto max-w-3xl mx-auto"
            >
              A team of well-trained and multilingual professionals is
              available 24 hours a day, with support in over 10 languages.
            </p>
          </div>
        </div>
      </div>

      <!-- Service Cards -->
      <div class="lower-section-1 relative z-[9]">
        <div class="container-fluid">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            <div
              v-for="(service, index) in services"
              :key="index"
              class="service-card"
            >
              <div
                class="card rounded-2xl p-6 md:p-8 h-full text-center group"
              >
                <div
                  class="service-icon w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                >
                  <img
                    :src="service.icon"
                    :alt="service.title"
                    loading="lazy"
                    class="w-8 h-8 object-contain"
                  />
                </div>

                <h3
                  class="text-gold-400 font-oswald font-semibold uppercase text-base mb-3"
                >
                  {{ service.title }}
                </h3>

                <p
                  class="text-white/70 text-sm md:text-base leading-relaxed font-roboto"
                >
                  {{ service.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="container-fluid">
        <div class="cta-content max-w-3xl mx-auto text-center">
          <span
            class="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs md:text-sm font-medium tracking-wider uppercase mb-4"
          >
            Get Started
          </span>

          <h2
            class="text-white font-oswald font-bold text-[clamp(1.65rem,6vw,2.5rem)] md:text-4xl lg:text-5xl uppercase leading-tight"
          >
            TRADE WITH
            <span class="text-gold-500">
              BlockCapitalInvestment Wealth
            </span>
            NOW
          </h2>

          <div
            class="w-20 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"
          ></div>

          <div class="flex justify-center mt-8 md:mt-10">
            <a
              href="?a=login"
              class="gold-button inline-flex items-center justify-center gap-2 px-6 md:px-14 py-4 md:py-5 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-primary-900 font-oswald font-bold text-base md:text-xl uppercase rounded-2xl shadow-lg shadow-gold-500/30"
            >
              <span>OPEN LIVE ACCOUNT</span>
              <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Risk Disclosure -->
    <section class="risk-disclosure">
      <div class="container-fluid">
        <div class="risk-content max-w-4xl mx-auto">
          <div class="flex items-start gap-3 mb-4">
            <div
              class="number-box w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <i class="bi bi-shield-check text-gold-400 text-xl"></i>
            </div>

            <p
              class="risk-disclosure__title text-gold-400 font-oswald text-xl md:text-2xl font-semibold"
            >
              We keep your information secured 24/7
            </p>
          </div>

          <div
            class="risk-disclosure__p text-white/60 text-sm md:text-base leading-relaxed"
          >
            <p>
              Your data is important! Protecting your information from
              unauthorised access and accidental disclosure is a top priority.
              BlockCapitalInvestment Wealth states that information security
              and data protection are central to its approach to serving
              clients.
            </p>

            <p class="mt-4">
              The company describes a multi-layered approach to security.
              Systems may include firewalls, malware identification programs,
              fraud detection systems, data loss prevention infrastructure,
              email filtering, virus controls and system redundancies,
              including network segmentation.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const aboutCards = [
  {
    title:
      'Heavily Regulated Across <span class="font-bold">5</span> Continents',
    description:
      'Closely supervised by over 10+ financial regulators worldwide across various jurisdictions, guaranteeing investor protection. Companies regulated by ASIC, AUSTRAC, BAFIN, CIMA, ESCA, FSC, FMA, MAS, TFG and VFSC. <span class="text-xs italic block mt-2 text-white/40">* Pertains exclusively to certain regulated asset management products.</span>',
  },
  {
    title: 'PAID-UP CAPITAL OF OVER US$ <span class="font-bold">322</span> MILLION',
    description:
      'Due to our accumulated paid-up capital, we are globally recognized as one of the largest online financial derivatives providers.',
  },
  {
    title: 'FULL ECN MODEL WITH SPREADS',
    description:
      'We follow a pure Non-Dealing Desk ECN trading structure with direct access to over 20 interbank trading prices without any conflict of interest.',
  },
  {
    title: 'MAXIMUM LEVERAGE UP TO <span class="font-bold">500:1</span>',
    description:
      'We provide high-leverage trading options, which can amplify both gains and losses. Our platform describes opportunities involving crypto assets, including Bitcoin and USDT.',
  },
]

const features = [
  {
    title: 'LUCRATIVE BROKERS PROGRAM',
    description:
      'We collaborate with professionals and partners through our Introducing Brokers Program, providing commission and rebate structures.',
  },
  {
    title: 'FUNDS WITHDRAWAL WITHIN 24 HOURS',
    description:
      'Funds withdrawal has been made easy and accessible for the benefit of our investors.',
  },
  {
    title: 'CUTTING-EDGE TRADING PLATFORMS',
    description:
      'Trading platforms designed to provide stability and enable real-time investing.',
  },
  {
    title: 'STATE OF THE ART PRODUCTS',
    description:
      'Explore crypto assets, including Bitcoin (BTC) and Tether (USDT), while understanding the risks associated with digital assets.',
  },
  {
    title: 'INSTANT AND RELIABLE EXECUTION',
    description:
      'Trading execution and platform features may vary by instrument and market conditions. Review the applicable terms and protections before trading.',
  },
  {
    title: 'SUPERIOR FINANCIAL SERVICES',
    description:
      'Multilingual customer support and trading-related services. Availability of MAM, PAMM, EA, VPS and API services depends on the provider and account.',
  },
  {
    title: 'SECURITY OF FUNDS',
    description:
      'Review the company’s regulatory status, client-money arrangements and applicable investor protections before depositing funds.',
  },
  {
    title: 'FINANCIAL PERFORMANCE',
    description:
      'Review independently verifiable financial and trading-performance information before relying on historical turnover or performance claims.',
  },
  {
    title: 'GLOBAL PRESENCE IN FINANCIAL HUBS',
    description:
      'The company describes an international client base and a global network of offices and affiliates.',
  },
]

const services = [
  {
    title: 'IT AND OPERATIONAL SUPPORT',
    icon: '/why-multibank/Group5630.svg',
    description:
      'IT and operational support including service desk, onboarding, configuration, and cash management.',
  },
  {
    title: 'SALES AND MARKET SUPPORT',
    icon: '/why-multibank/Group5621.svg',
    description:
      'Sales and market support including educational materials, videos, tutorials and seminars.',
  },
  {
    title: 'FUNDING METHODS',
    icon: '/why-multibank/Group5628.svg',
    description:
      'Information about available funding methods, including cryptocurrency where supported.',
  },
  {
    title: 'FINANCIAL NEWS',
    icon: '/why-multibank/Group5627.svg',
    description:
      'Real-time online financial news in multiple languages.',
  },
  {
    title: 'ACCOUNT OPENING',
    icon: '/why-multibank/Group5622.svg',
    description:
      'Account opening and funding services, subject to verification and applicable requirements.',
  },
  {
    title: 'REGULATORY SUPPORT',
    icon: '/why-multibank/Group5629.svg',
    description:
      'Regulatory, compliance and corporate support information.',
  },
]
</script>

<style scoped>
/* Main layout */
.about-page {
  width: 100%;
  min-width: 0;
  overflow-x: clip;
  background: #030f5c;
  color: #fff;
  box-sizing: border-box;
}

.about-page *,
.about-page *::before,
.about-page *::after {
  box-sizing: border-box;
}

.container-fluid {
  width: 100%;
  max-width: 100%;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 6rem);
}

.about-top-section {
  padding-top: 7rem;
}

.multbank-group,
.customer-service,
.cta-section,
.risk-disclosure {
  background: #030f5c;
}

.multbank-group {
  padding-top: 3rem;
  padding-bottom: 4rem;
}

.customer-service {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.cta-section {
  padding-top: 4rem;
  padding-bottom: 5rem;
}

.risk-disclosure {
  padding-top: 2.5rem;
  padding-bottom: 3.5rem;
  border-top: 1px solid rgba(187, 145, 74, 0.15);
}

/* Hero backgrounds */
.upper-section {
  min-height: 38.5rem;
  padding-block: 3rem;
  background-image: url('/why-multibank/mobile-header.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.upper-section-1 {
  min-height: 30rem;
  padding-block: 3rem;
  background-image: url('/why-multibank/Mask.html');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.customer-overlay {
  background: linear-gradient(
    180deg,
    rgba(3, 15, 92, 0.85) 0%,
    rgba(3, 15, 92, 0.6) 50%,
    rgba(3, 15, 92, 0.9) 100%
  );
}

.heading {
  width: 100%;
  max-width: 56.25rem;
  margin-inline: auto;
}

.heading h1,
.heading h2,
.cta-content h2 {
  overflow-wrap: anywhere;
  text-wrap: balance;
}

.heading p {
  max-width: 48rem;
  margin-inline: auto;
}

/* Cards */
.card,
.legacy-card {
  min-width: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(187, 145, 74, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.number-box,
.service-icon {
  background: rgba(187, 145, 74, 0.15);
}

.about-card-item,
.feature-card,
.service-card {
  height: 100%;
  min-width: 0;
}

.about-card-item h3,
.feature-card h3,
.service-card h3 {
  overflow-wrap: anywhere;
}

.about-card-item p,
.feature-card p,
.service-card p,
.legacy-card p,
.risk-disclosure__p {
  overflow-wrap: anywhere;
}

.legacy-grid {
  border-bottom: 1px solid rgba(187, 145, 74, 0.15);
}

.statistics-grid {
  min-width: 0;
}

.stat-item {
  min-width: 0;
}

.stat-item > div:first-child {
  overflow-wrap: anywhere;
}

.gold-button {
  width: auto;
  max-width: 100%;
  min-height: 3.5rem;
  white-space: normal;
  text-align: center;
  text-decoration: none;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.risk-disclosure__title {
  min-width: 0;
  line-height: 1.4;
}

/* Tablet */
@media (max-width: 1023px) {
  .about-top-section {
    padding-top: 6rem;
  }

  .upper-section {
    min-height: 32rem;
  }

  .upper-section-1 {
    min-height: 25rem;
  }

  .multbank-group {
    padding-top: 2rem;
    padding-bottom: 3rem;
  }

  .cta-section {
    padding-top: 3rem;
    padding-bottom: 3.5rem;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .container-fluid {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .about-top-section {
    padding-top: 5.5rem;
  }

  .upper-section {
    min-height: auto;
    padding-top: 3.5rem;
    padding-bottom: 4.5rem;
    background-image: url('/why-multibank/Mobile-Header.webp');
    background-size: cover;
    background-position: center;
  }

  .upper-section-1 {
    min-height: auto;
    padding-top: 3.5rem;
    padding-bottom: 4rem;
    background-image: url('/why-multibank/MaskGroup30.html');
    background-size: cover;
    background-position: center;
  }

  .heading h1 {
    font-size: clamp(1.75rem, 7vw, 2.5rem);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .heading h2 {
    font-size: clamp(1.65rem, 6vw, 2.3rem);
    line-height: 1.2;
  }

  .heading p {
    margin-top: 1.25rem;
    font-size: 0.95rem;
    line-height: 1.75;
  }

  /* Cards overlap the bottom of each hero slightly */
  .lower-section {
    margin-top: -1.5rem;
  }

  .lower-section-1 {
    margin-top: -1.5rem;
  }

  .about-card-item .card,
  .feature-card .card,
  .service-card .card {
    padding: 1.25rem;
    border-radius: 1rem;
  }

  .about-card-item h3 {
    font-size: 1rem;
    line-height: 1.5;
  }

  .about-card-item p,
  .feature-card p,
  .service-card p {
    font-size: 0.875rem;
    line-height: 1.75;
  }

  .multbank-group {
    padding-top: 2rem;
    padding-bottom: 2.5rem;
  }

  .multbank-group h2 {
    font-size: clamp(1.8rem, 7vw, 2.5rem);
    line-height: 1.2;
  }

  .legacy-grid {
    padding-bottom: 2rem;
    gap: 1.5rem;
  }

  .legacy-card {
    padding: 1.25rem;
    border-radius: 1rem;
  }

  .statistics-grid {
    gap: 1.25rem 0.75rem;
  }

  .stat-capital {
    grid-column: 1 / -1;
  }

  .stat-item > div:first-child {
    font-size: 1.4rem;
  }

  .stat-item > div:last-child {
    font-size: 0.65rem;
    line-height: 1.5;
  }

  .features-grid {
    margin-top: 2rem;
    gap: 1rem;
  }

  .feature-card .flex.items-start {
    gap: 0.75rem;
  }

  .customer-service {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .service-icon {
    width: 3.5rem;
    height: 3.5rem;
  }

  .service-icon img {
    width: 1.75rem;
    height: 1.75rem;
  }

  .cta-section {
    padding-top: 2.5rem;
    padding-bottom: 3rem;
  }

  .cta-content h2 {
    font-size: clamp(1.6rem, 6.5vw, 2.3rem);
    line-height: 1.25;
  }

  .cta-section .flex.justify-center {
    margin-top: 1.5rem;
  }

  .gold-button {
    width: 100%;
    max-width: 22rem;
    min-height: 3.5rem;
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
    line-height: 1.4;
    border-radius: 0.875rem;
  }

  .risk-disclosure {
    padding-top: 2rem;
    padding-bottom: 2.5rem;
  }

  .risk-disclosure__title {
    font-size: 1.1rem;
  }

  .risk-disclosure__p {
    font-size: 0.875rem;
    line-height: 1.8;
  }
}

/* Very small phones */
@media (max-width: 380px) {
  .container-fluid {
    padding-left: 0.875rem;
    padding-right: 0.875rem;
  }

  .about-top-section {
    padding-top: 5rem;
  }

  .heading h1 {
    font-size: 1.75rem;
  }

  .heading h2,
  .cta-content h2 {
    font-size: 1.55rem;
  }

  .about-card-item .flex.items-start {
    gap: 0.625rem;
  }

  .about-card-item .number-box,
  .feature-card .number-box {
    width: 2.25rem;
    height: 2.25rem;
  }

  .stat-item > div:first-child {
    font-size: 1.25rem;
  }
}

/* Desktop hover effects */
@media (hover: hover) and (pointer: fine) {
  .card:hover {
    transform: translateY(-4px);
    border-color: rgba(187, 145, 74, 0.35);
  }

  .gold-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(187, 145, 74, 0.25);
  }

  .service-card .card:hover .service-icon {
    transform: scale(1.05);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .card,
  .gold-button,
  .service-icon {
    transition: none;
  }
}
</style>