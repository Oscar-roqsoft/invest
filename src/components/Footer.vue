<template>
    <footer class="section footer bg-primary-800">
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8">
        <div class="content footer__in">
          <!-- Contact Info -->
          <div class="footer-contact-info text-gray-400 text-sm leading-6 my-2 mb-5">
            <p class="m-0">
              <span class="text-gold-500">Email:</span>
              <a href="/cdn-cgi/l/email-protection#a5d6d0d5d5cad7d1e5c6cacccbd6d4d0c4d7c0d2c0c4c9d1cd8bcad7c2" class="text-gray-400 no-underline hover:text-gold-400 transition-colors">
                <span class="__cf_email__" data-cfemail="33404643435c414733505c5a5d4042445043514351565b435f1d5c4154">[email&#160;protected]</span>
              </a>
            </p>
            <p class="m-0">
              <span class="text-gold-500">Registered Office Address:</span>
              304-371 Front St. Toronto, ON, Canada
            </p>
          </div>
  
          <!-- Footer Navigation -->
          <ul class="footer-nav flex flex-wrap gap-4 md:gap-8 list-none p-0 m-0 mb-4">
            <li v-for="link in footerNav" :key="link.name" class="footer-nav__item">
              <a :href="link.href" class="footer-nav__link text-gray-400 hover:text-gold-400 transition-colors text-sm md:text-base no-underline">
                {{ link.name }}
              </a>
            </li>
          </ul>
  
          <!-- Socket / Bottom Section -->
          <div class="socket flex flex-col md:flex-row items-center justify-between pt-4 border-t border-primary-700">
            <a href="?a=home" class="socket__logo logo mb-4 md:mb-0">
              <!-- <img 
                id="site-logo" 
                src="assets/images/logoIcon/logo.png" 
                alt="CoinSquare Wealth" 
                height="30" 
                class="h-[30px] w-auto"
              /> -->
            </a>
            <div class="socket__copyright">
              <div class="plus-21">
                <p class="text-gray-400 text-sm m-0">
                  Copyright &copy;2026 CoinSquare Wealth
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  const footerNav = [
    { name: 'Home', href: '?a=home' },
    { name: 'About', href: '?a=about' },
    { name: 'Contacts', href: '?a=support' },
  ]
  </script>