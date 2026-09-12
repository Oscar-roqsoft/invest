<template>
    <div class="contact-page" style="background: #030f5c;">
      <section id="contact-section" class="pt-40 ">
        <div class="container max-w-4xl mx-auto px-4 md:px-6">
          <!-- Heading -->
          <div class="contact-heading text-center mb-8 md:mb-12">
            <span class="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs md:text-sm font-medium tracking-wider uppercase mb-4">
              Contact Us
            </span>
            <h1 class="text-gold-500 font-oswald font-bold uppercase text-3xl md:text-5xl lg:text-6xl leading-tight">
              GET IN TOUCH
            </h1>
            <div class="w-20 h-1 bg-gradient-to-r from-gold-500 to-gold-300 mx-auto mt-4 rounded-full"></div>
            <p class="text-white/80 text-base md:text-lg lg:text-xl leading-relaxed mt-6 font-roboto max-w-2xl mx-auto">
              Contact us with any questions or if you'd like more information about CoinSquare Wealth's products and services.
            </p>
          </div>
  
          <!-- Tab Navigation -->
          <div class="grid grid-cols-2 gap-3 md:gap-5 mb-6 md:mb-8">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              class="contact-tabs-item relative flex flex-col items-center justify-center p-4 md:p-6 rounded-xl transition-all duration-300 group"
              :class="activeTab === tab.id ? 'active bg-white text-primary-800 shadow-xl shadow-gold-500/10' : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'"
              @click="activeTab = tab.id"
            >
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-2 md:mb-3" 
                   :class="activeTab === tab.id ? 'bg-gold-500/10' : 'bg-white/5'">
                <svg v-html="tab.icon" class="w-6 h-6 md:w-8 md:h-8" :class="activeTab === tab.id ? 'text-gold-500' : 'text-gold-400/50'"></svg>
              </div>
              <span class="text-sm md:text-base font-medium font-roboto">{{ tab.label }}</span>
              <div v-if="activeTab === tab.id" 
                   class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
            </button>
          </div>
  
          <!-- Tab Content -->
          <div class="contact-tabs-content">
            <!-- Form Tab -->
            <div v-if="activeTab === 'form'" class="contact-form-card rounded-2xl p-6 md:p-8 lg:p-10" 
                 style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(187, 145, 74, 0.15); backdrop-filter: blur(10px);">
              <form @submit.prevent="handleSubmit" class="contact-form">
                <div class="space-y-5">
                  <div class="contact-input-group">
                    <label class="contact-input-label block text-white/80 text-sm font-medium mb-1.5">
                      Your Name <sup class="text-red-400">*</sup>
                    </label>
                    <input 
                      type="text" 
                      v-model="form.name" 
                      placeholder="Your full name" 
                      class="contact-input w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300"
                      required
                    >
                  </div>
  
                  <div class="contact-input-group">
                    <label class="contact-input-label block text-white/80 text-sm font-medium mb-1.5">
                      Your Email <sup class="text-red-400">*</sup>
                    </label>
                    <input 
                      type="email" 
                      v-model="form.email" 
                      placeholder="you@example.com" 
                      class="contact-input w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300"
                      required
                    >
                  </div>
  
                  <div class="contact-input-group">
                    <label class="contact-input-label block text-white/80 text-sm font-medium mb-1.5">
                      Message <sup class="text-red-400">*</sup>
                    </label>
                    <textarea 
                      v-model="form.message" 
                      rows="5" 
                      placeholder="How can we help?" 
                      class="contact-input w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:border-gold-500/50 focus:outline-none transition-all duration-300 resize-y min-h-[8rem]"
                      required
                    ></textarea>
                  </div>
  
                  <button 
                    type="submit" 
                    class="contact-submit-button w-full py-4 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-primary-900 font-oswald font-bold text-lg uppercase shadow-lg shadow-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/50 hover:scale-[1.02] transition-all duration-300"
                    :disabled="isSubmitting"
                  >
                    <span v-if="!isSubmitting">Send Message</span>
                    <span v-else class="flex items-center justify-center gap-2">
                      <svg class="animate-spin h-5 w-5 text-primary-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  </button>
                </div>
              </form>
            </div>
  
            <!-- Find Us Tab -->
            <div v-if="activeTab === 'find'" class="contact-phone-tab rounded-2xl p-6 md:p-8 lg:p-10 text-center"
                 style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(187, 145, 74, 0.15); backdrop-filter: blur(10px);">
              <div class="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                <i class="bi bi-geo-alt text-gold-400 text-3xl"></i>
              </div>
              <p class="text-white/80 text-base md:text-lg leading-relaxed font-roboto max-w-md mx-auto">
                Location: 304-371 Front St. Toronto, ON, Canada.
              </p>
              <!-- Map placeholder - uncomment when you have a map URL -->
              <!--
              <div class="mt-6 rounded-xl overflow-hidden border border-white/10">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8436.146411215903!2d-73.9691685184291!3d40.781649005836485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2589aaaa763a7%3A0x5e9b0bf60fed4cf9!2s225%20Central%20Park%20West%2C%20New%20York%2C%20NY%2010024!5e1!3m2!1sen!2sus!4v1612426792309!5m2!1sen!2sus" 
                  style="width: 100%" 
                  height="350" 
                  frameborder="0" 
                  allowfullscreen=""
                  class="rounded-xl"
                ></iframe>
              </div>
              -->
            </div>
  
            <!-- Email Us Tab -->
            <div v-if="activeTab === 'email'" class="contact-phone-tab rounded-2xl p-6 md:p-8 lg:p-10 text-center"
                 style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(187, 145, 74, 0.15); backdrop-filter: blur(10px);">
              <div class="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                <i class="bi bi-envelope text-gold-400 text-3xl"></i>
              </div>
              <p class="text-white/80 text-base md:text-lg leading-relaxed font-roboto">
                Reach us by mail if you need a quick-advice on general questions:
              </p>
              <a href="/cdn-cgi/l/email-protection#2d5e585d5d425f596d4e424445585a5e4a594e5c4e4a475f4305465b4e" 
                 class="support-center inline-block mt-6 text-gold-400 hover:text-gold-300 transition-colors duration-300">
                <div class="number text-2xl md:text-4xl font-light font-roboto">
                  <span class="__cf_email__">[email&#160;protected]</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Risk Disclosure -->
      <section class="risk-disclosure py-10 md:py-14" style="background: #030f5c; border-top: 1px solid rgba(187, 145, 74, 0.1);">
        <div class="container max-w-4xl mx-auto px-4 md:px-6">
          <div class="content">
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
  import { ref } from 'vue'
  
  const activeTab = ref('form')
  const isSubmitting = ref(false)
  
  const form = ref({
    name: '',
    email: '',
    message: ''
  })
  
  const tabs = [
    { 
      id: 'form', 
      label: 'Find Us',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
    },
    { 
      id: 'email', 
      label: 'Email Us',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
    }
  ]
  
  const handleSubmit = async () => {
    isSubmitting.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    isSubmitting.value = false
    // Reset form
    form.value = { name: '', email: '', message: '' }
    // Show success message (you can add a toast notification here)
  }
  </script>
  
  <style scoped>
  /* Container */
  .container {
    max-width: 66.5rem;
  }
  
  /* Tab styles */
  .contact-tabs-item {
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .contact-tabs-item.active {
    color: #03105F;
    background: white;
    box-shadow: 0 4px 20px rgba(187, 145, 74, 0.15);
  }
  
  .contact-tabs-item.active::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 8px solid white;
  }
  
  /* Form styles */
  .contact-input {
    transition: all 0.3s ease;
  }
  
  .contact-input:focus {
    border-color: rgba(187, 145, 74, 0.5);
    box-shadow: 0 0 0 3px rgba(187, 145, 74, 0.1);
  }
  
  /* Submit button */
  .contact-submit-button {
    transition: all 0.3s ease;
  }
  
  .contact-submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: "Oswald", sans-serif;
  }
  
  p, span, input, textarea, button {
    font-family: "Roboto Condensed", sans-serif;
  }
  
  /* Responsive container */
  @media (max-width: 767px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
  </style>