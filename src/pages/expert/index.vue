<template>
    <div class="expert-investors-page" style="background: #030f5c;">
      <!-- Hero Header Section -->
      <section id="rating-header" class="relative overflow-hidden pt-24" style="background: linear-gradient(180deg, #05137D 0%, #00073C 67%, #030f5c 100%);">
        <!-- Background Globe -->
        <div class="header-image absolute w-[54%] h-[50%] top-[12%] right-[5%] lg:right-[5%] bg-no-repeat bg-contain" 
             style="background-image: url('/newfront/img-globebg.png'); background-position: 92% 32%;">
        </div>
        
        <div class="content-div relative z-10 py-12 md:py-16 lg:py-20">
          <div class="container-fluid px-4 md:px-12 lg:px-16 xl:px-24">
            <div class="grid grid-cols-1 lg:grid-cols-7 gap-8">
              <div class="lg:col-span-7 xl:col-span-7">
                <span class="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs md:text-sm font-medium tracking-wider uppercase mb-4">
                  Expert Investors
                </span>
                <h1 class="text-gold-500 font-oswald font-bold uppercase text-3xl md:text-5xl lg:text-6xl leading-tight">
                  EXPERT INVESTORS
                </h1>
                <div class="w-16 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mt-4 rounded-full"></div>
                <p class="text-white/80 text-base md:text-lg lg:text-xl leading-relaxed mt-6 max-w-2xl font-roboto">
                  sample.com rates investors based on their performance, allowing you to follow and replicate the strategies of top crypto experts. Choose your preferred investor and copy their positions to maximize your profits!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Leaderboard Section -->
      <section class="leaderboard-section py-8 md:py-12" style="background: #030f5c;">
        <div class="container-fluid px-4 md:px-12 lg:px-16 xl:px-24">
          <!-- Section Header -->
          <div class="text-center mb-10 md:mb-14">
            <span class="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs md:text-sm font-medium tracking-wider uppercase mb-4">
              Top Performers
            </span>
            <h2 class="text-white font-oswald font-bold text-2xl md:text-4xl lg:text-5xl uppercase">
              Meet Our <span class="text-gold-500">Expert Investors</span>
            </h2>
            <div class="w-20 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"></div>
          </div>
  
          <!-- Traders Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" id="leaderboard">
            <div v-for="(trader, index) in traders" :key="index" 
                 class="traders-col">
              <div class="card rounded-2xl p-6 md:p-8 h-full transition-all duration-300 hover:-translate-y-2 group" 
                   style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(187, 145, 74, 0.15); backdrop-filter: blur(10px);">
                <!-- First Row - Avatar & Name -->
                <div class="flex items-center gap-4 mb-4">
                  <div class="flex-shrink-0 relative">
                    <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-500/30 group-hover:border-gold-500 transition-all duration-300">
                      <img :src="trader.avatar" :alt="trader.name" class="w-full h-full object-cover">
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-800 border-2 border-gold-500/30 flex items-center justify-center overflow-hidden">
                      <span class="text-xs font-bold text-gold-500">{{ trader.winRate }}%</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-gold-400 font-oswald font-semibold text-lg md:text-xl uppercase leading-tight">
                      {{ trader.name }}
                    </h4>
                    <p class="text-white/50 text-sm font-roboto">
                      Average Win Rate: {{ trader.winRate }}%
                    </p>
                  </div>
                </div>
  
                <!-- Second Row - Testimonial -->
                <div class="mt-4 pt-4 border-t border-white/10">
                  <div class="text-white/70 text-sm md:text-base leading-relaxed font-roboto italic">
                    <i class="bi bi-quote text-gold-500/50 mr-2"></i>
                    {{ trader.testimonial }}
                  </div>
                </div>
  
                <!-- Hover Overlay -->
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
          </div>
  
          <!-- More Investors CTA -->
          <div class="text-center mt-12 md:mt-16">
            <div class="inline-block px-6 py-3 rounded-full bg-gold-500/10 border border-gold-500/20">
              <span class="text-gold-400 font-oswald font-semibold text-xl md:text-2xl uppercase">
                +1933 MORE INVESTORS
              </span>
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
              *Your data is Important! Therefore protecting your information from unauthorised access and accidental disclosure is a top priority. sample.com pursues information security with the same commitment to excellence that we apply to understanding our clients financial needs. We work hard to protect your information. sample.com information security and data protection is driven by the same commitment to excellence that we apply to understanding the financial needs of our clients.
              <br><br>
              At sample.com, we employ a multi-layered approach to security. Among the systems we use to protect information are firewalls, malware identification programs, fraud detection systems, data loss prevention infrastructure, email filtering, virus controls and system redundancies, including network segmentation.
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  const traders = [
    {
      name: 'Gary (mystic Mac)',
      avatar: '/newfront/1.jpg',
      winRate: 94,
      testimonial: 'Having invested with CoinSquare Wealth for several years, I\'ve experienced exceptional platform reliability and powerful automated tools. The clear strategies and insightful market analysis make it easy to maximize returns. Following and sharing my positions has not only grown my portfolio but also helped other investors achieve consistent success.'
    },
    {
      name: 'Rodney Steve',
      avatar: '/newfront/3.jpg',
      winRate: 87,
      testimonial: 'CoinSquare Wealth has transformed the way I invest. With automated strategies and a transparent platform, I can execute trades confidently and efficiently. The community of expert investors provides valuable insights, and copying successful strategies has consistently improved my returns. It\'s been a game-changer for growing my investment portfolio.'
    },
    {
      name: 'Theresa Williams',
      avatar: '/newfront/4.jpg',
      winRate: 82,
      testimonial: 'My experience with CoinSquare Wealth has been outstanding. The platform\'s advanced tools and clear investment strategies allow me to make informed decisions with ease. I enjoy sharing my positions and seeing other investors benefit, while consistently growing my own portfolio. It\'s the ideal environment for both learning and earning.'
    },
    {
      name: 'Ishaan Sandhir',
      avatar: '/newfront/5.jpg',
      winRate: 91,
      testimonial: 'Investing through CoinSquare Wealth has made managing my portfolio simpler and more effective. The automated systems, detailed market analysis, and ability to follow expert strategies have helped me achieve steady returns. It\'s a reliable platform where my experience as an investor is both supported and rewarded.'
    },
    {
      name: 'Sarah Sniper',
      avatar: '/newfront/6.jpg',
      winRate: 98,
      testimonial: 'Being an investor on CoinSquare Wealth has been extremely rewarding. The platform\'s automated strategies, transparent performance metrics, and supportive community make it easy to invest intelligently. Following top investors\' positions has enhanced my portfolio growth and given me confidence in executing high-quality investment decisions every day.'
    },
    {
      name: 'Champ W. (The trading Champ)',
      avatar: '/newfront/7.jpg',
      winRate: 90,
      testimonial: 'CoinSquare Wealth combines innovation and simplicity in investing. The automated tools and expert-driven strategies allow me to optimize returns without stress. I can monitor my performance, replicate successful positions, and continuously refine my approach. It\'s the perfect platform for both seasoned and aspiring investors seeking consistent growth.'
    }
  ]
  </script>
  
  <style scoped>
  /* Header Image - Background Globe */
  .header-image {
    pointer-events: none;
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    .header-image {
      width: 79%;
      height: 40%;
      top: 5%;
      background-position: 92% 49% !important;
    }
  }
  
  /* Card hover effects */
  .card {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .card:hover {
    border-color: rgba(187, 145, 74, 0.3);
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
  
  /* Avatar image */
  .avatar-img img {
    transition: transform 0.3s ease;
  }
  
  .group:hover .avatar-img img {
    transform: scale(1.05);
  }
  </style>