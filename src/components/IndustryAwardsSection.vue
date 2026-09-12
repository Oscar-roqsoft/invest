<template>
    <section id="industry-awards-section" class="py-12 md:py-16 bg-primary-700">
      <div class="industry-awards-container max-w-7xl mx-auto px-4 md:px-8">
        <!-- Header Content -->
        <div class="industry-awards-content bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 rounded-xl p-8 md:p-12 mb-8 md:mb-12">
          <h2 class="industry-awards-title text-3xl md:text-4xl lg:text-5xl font-oswald font-medium text-white text-center mb-4">
            You're in a Good Company
          </h2>
          <p class="industry-awards-description text-white text-base md:text-lg lg:text-xl text-center max-w-4xl mx-auto leading-relaxed">
            More than 2 million customers worldwide trust us and earn daily.
            <br><br>
            Your feedback helps us to improve our platform and provide you with the best experience tailored
            to your needs. View ratings and post your own suggestions. We appreciate your feedback!
          </p>
        </div>
  
        <!-- Testimonials Carousel -->
        <div class="swiper industry-awards-swiper relative overflow-hidden">
          <div class="swiper-wrapper">
            <div 
              v-for="testimonial in testimonials" 
              :key="testimonial.id"
              class="swiper-slide"
            >
              <div class="carder mx-auto testimonial-carder min-h-[360px] bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl cursor-pointer hover:shadow-2xl transition-shadow duration-300">
                <div class="flex flex-col md:flex-row">
                  <!-- Avatar Column -->
                  <div class="testimonial-avatar-col flex-shrink-0 flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-gold-100 to-gold-200 md:w-48 h-full">
                    <div class="avatar-img w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gold-500 shadow-lg">
                      <img 
                        :src="testimonial.avatar" 
                        :alt="testimonial.name"
                        class="w-full h-full object-cover"
                      >
                    </div>
                  </div>
                  
                  <!-- Text Column -->
                  <div class="testimonial-text-col flex-1 p-6 md:p-8">
                    <div class="testimonial-quote mb-4">
                      <div class="text-primary-800 text-base md:text-md leading-relaxed">
                        <i class="bi bi-quote text-gold-500 text-2xl opacity-50 mr-2"></i>
                        {{ testimonial.quote }}
                      </div>
                    </div>
                    <div class="testimonial-name border-t border-gray-200 pt-4">
                      <h4 class="text-lg md:text-xl font-bold text-primary-800">{{ testimonial.name }}</h4>
                      <p class="text-sm md:text-base text-gray-600">{{ testimonial.role }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Pagination -->
          <div class="industry-awards-pagination flex justify-center mt-6 gap-2"></div>
  
          <!-- Gradient Overlays -->
          <div class="industry-awards-swiper-gradient-overlay left absolute top-0 left-0 w-16 h-full pointer-events-none bg-gradient-to-r from-primary-700 to-transparent"></div>
          <div class="industry-awards-swiper-gradient-overlay right absolute top-0 right-0 w-16 h-full pointer-events-none bg-gradient-to-l from-primary-700 to-transparent"></div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import Swiper from 'swiper'
  import 'swiper/css'
  import 'swiper/css/pagination'
  
  const testimonials = [
    {
      id: 1,
      name: 'Kandace Stranger',
      role: 'Financial Analyst',
      avatar: '/testimonial/633554355c4c31664439349.jpg',
      quote: 'Investing has been a hobby of mine for the past decade. I\'ve experimented for fun but struggled to achieve consistent returns until I discovered CoinSquare Wealth. Their automated investing approach is clear, with well-defined entries and exits, making execution simple and effective.'
    },
    {
      id: 2,
      name: 'Linda Hornsby',
      role: 'Passive Investor',
      avatar: '/testimonial/633710898f5891664553097.jpg',
       quote: 'The automated investing bots exceeded my expectations. The platform makes investing straightforward and allows me to perform precise market analyses with ease.'
    },
  
    {
      id: 3,
      name: 'Walsh Aponi',
      role: 'Investor',
      avatar: '/testimonial/6332203ae66ae1664229434.jpg',
      quote: 'Investing is simple and accessible. You pay a small fee to leverage their funds, and the best part is their incredible user interface. I even use it to monitor markets when investing through other accounts. I\'ve been using the platform for a month now, and I absolutely love it!'
    },
    {
      id: 4,
      name: 'Chris Hulse',
      role: 'Investor',
      avatar: '/testimonial/63321dfd4ca661664228861.jpg',
      quote: 'Easy to use, with straightforward transactions. It\'s great for beginners who are new to the crypto and stock markets. I\'d suggest everyone give it a try.'
    },
    {
      id: 5,
      name: 'Joann Figueroa',
      role: 'Long term investor',
      avatar: '/testimonial/63321ce8172f41664228584.jpg',
      quote: 'I love this platform. They allow recurring daily investments in stocks, offer early entry into IPOs, and now support crypto too. I\'m excited to see what they do in the future.'
    },
    {
      id: 6,
      name: 'Paulo Castro Reis',
      role: 'Investor',
      avatar: '/testimonial/63321a2901c5c1664227881.jpg',
      quote: 'Why choose CoinSquare Wealth as a beginner investor? I\'ve been investing with CoinSquare Wealth for a while now, and my experience has been excellent. They take great care of newcomers, offering free training and unlimited demo accounts. All that\'s left is learning to use the platform effectively to start generating additional income.'
    }
  ]
  
  let swiperInstance = null
  
  onMounted(() => {
    // Initialize Swiper
    const swiperEl = document.querySelector('.industry-awards-swiper')
    if (swiperEl) {
      swiperInstance = new Swiper(swiperEl, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.industry-awards-pagination',
          clickable: true,
          bulletClass: 'swiper-pagination-bullet w-2 h-2 rounded-full bg-white/50 transition-all duration-300',
          bulletActiveClass: 'swiper-pagination-bullet-active w-8 bg-gold-500',
        },
        breakpoints: {
          768: {
            slidesPerView: 1.2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 1.5,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 2,
            spaceBetween: 30,
          }
        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
      })
    }
  })
  
  // Cleanup on component unmount
  onUnmounted(() => {
    if (swiperInstance) {
      swiperInstance.destroy()
    }
  })
  </script>
  
  <style scoped>
  .industry-awards-swiper {
    padding: 0.5rem 0;
  }
  
  .testimonial-carder {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .testimonial-carder:hover {
    transform: translateY(-4px);
  }
  
  /* Gradient overlays for carousel edges */
  .industry-awards-swiper-gradient-overlay {
    z-index: 2;
    display: none;
  }
  
  @media (min-width: 1024px) {
    .industry-awards-swiper-gradient-overlay {
      display: block;
    }
  }
  
  /* Custom pagination styling */
  :deep(.swiper-pagination-bullet) {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
    opacity: 1;
    margin: 0 0.25rem;
  }
  
  :deep(.swiper-pagination-bullet-active) {
    width: 2rem;
    background: #bb914a;
  }
  
  /* Animation for quote icon */
  .bi-quote {
    display: inline-block;
  }
  
  /* Responsive avatar */
  @media (max-width: 768px) {
    .testimonial-avatar-col {
      padding: 1.5rem 1.5rem 0.5rem;
    }
    
    .avatar-img {
      width: 4rem;
      height: 4rem;
    }
  }
  </style>