<template>
    <div>
      <HeroSection />
      <ProductsSection />
      
      <!-- Video Section -->
      <VideoSection />
      
      <!-- Platforms App Section -->
      <PlatformsAppSection />
      
      <!-- Crypto Widget Section -->
      <!-- <CryptoWidgetSection /> -->
      
      <!-- Trading Accounts / Investment Plans Section -->
      <TradingAccountsSection />
      
      <!-- Introducing Brokers Section -->
      <IntroducingBrokersSection />
      
      <!-- Advantage Section -->
      <AdvantageSection />
      
      <!-- Security of Funds Section -->
      <SecurityOfFundsSection />
      
      <!-- Live Statistics Section -->
      <LiveStatisticsSection />
      
    
      
      <!-- Features -->
      <section id="features" class="py-16 bg-primary-800">
        <div class="container-custom">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Us</span>
            </h2>
            <p class="text-gray-400 max-w-2xl mx-auto">
              We provide cutting-edge tools and expert guidance to help you make informed investment decisions.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="feature in features" :key="feature.title" 
                 class="text-center bg-primary-700 p-6 rounded-2xl shadow-lg border border-primary-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div class="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">{{ feature.icon }}</span>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">{{ feature.title }}</h3>
              <p class="text-gray-400 text-sm">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

        <!-- Industry Awards / Testimonials Section -->
        <IndustryAwardsSection />

            <!-- Crypto Widget Section -->
      <CryptoWidgetSection2 />

          <!-- Risk Disclosure Section -->
    <RiskDisclosureSection />
  
     
    </div>
  </template>
  
  <script setup>
  const features = [
    { icon: '📊', title: 'Smart Analytics', description: 'AI-powered insights to make better investment decisions.' },
    { icon: '🔒', title: 'Secure Platform', description: 'Bank-grade security to protect your investments and data.' },
    { icon: '⚡', title: 'Fast Execution', description: 'Lightning-fast trade execution with minimal latency.' },
    { icon: '🎯', title: 'Expert Guidance', description: 'Access to professional advisors and investment experts.' }
  ]
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Tech Entrepreneur',
      quote: 'InvestPro has completely transformed my approach to investing. The AI-powered insights are invaluable!'
    },
    {
      name: 'Michael Chen',
      role: 'Financial Analyst',
      quote: 'The platform is incredibly intuitive and the returns have exceeded my expectations.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Small Business Owner',
      quote: 'I never thought investing could be this easy. InvestPro made it accessible for everyone.'
    }
  ]
  </script>