<template>
    <Teleport to="body">
      <!-- Overlay -->
      <div 
        v-if="isOpen"
        id="side-menu-overlay"
        class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        @click="$emit('close')"
      ></div>
  
      <!-- Side Menu -->
      <aside 
        id="side-menu"
        class="fixed top-0 bottom-0 z-[200] w-[320px] max-w-[90vw] bg-gradient-to-b from-primary-900 to-primary-800 text-white overflow-y-auto transition-all duration-300 ease-out"
        :class="[
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
          'right-0 shadow-2xl shadow-black/50'
        ]"
      >
        <div class="relative min-h-full flex flex-col">
          <!-- Decorative gradient line at top -->
          <div class="h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600"></div>
  
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30">
                <span class="text-primary-900 font-bold text-xl">$</span>
              </div>
              <span class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                CoinSquare
              </span>
            </div>
            <button 
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 flex items-center justify-center text-xl backdrop-blur-sm"
              @click="$emit('close')"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
  
          <!-- Menu List -->
          <div class="flex-1 overflow-y-auto py-4 px-3">
            <div v-for="item in menuItems" :key="item.name" class="mb-1">
              <!-- Main Menu Item with Dropdown -->
              <button 
                v-if="item.hasDropdown"
                class="menu-item-btn flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/10 active:bg-white/20 group"
                :class="isOpenItem(item.name) ? 'bg-white/10' : ''"
                @click="toggleItem(item.name)"
              >
                <span class="flex items-center gap-3">
                  <i :class="getIcon(item.name)" class="text-gold-400 text-lg w-6"></i>
                  {{ item.name }}
                </span>
                <i 
                  class="bi bi-chevron-down text-gold-400 transition-all duration-300 text-sm"
                  :class="{ 'rotate-180': isOpenItem(item.name) }"
                ></i>
              </button>
              
              <!-- Simple Link (no dropdown) -->
              <a 
                v-else
                :href="item.href"
                class="menu-item-btn flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/10 active:bg-white/20"
              >
                <span class="flex items-center gap-3">
                  <i :class="getIcon(item.name)" class="text-gold-400 text-lg w-6"></i>
                  {{ item.name }}
                </span>
              </a>
  
              <!-- Dropdown Links -->
              <div 
                v-if="item.hasDropdown && item.links"
                class="menu-item-links overflow-hidden transition-all duration-300 ease-in-out ml-4"
                :style="{ 
                  maxHeight: isOpenItem(item.name) ? item.links.length * 48 + 'px' : '0',
                  opacity: isOpenItem(item.name) ? 1 : 0
                }"
              >
                <a 
                  v-for="link in item.links" 
                  :key="link.name"
                  :href="link.href"
                  class="block px-4 py-2.5 ml-4 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 border-l-2 border-transparent hover:border-gold-400"
                >
                  <span class="flex items-center gap-3">
                    <span class="w-1.5 h-1.5 rounded-full bg-gold-400/50"></span>
                    {{ link.name }}
                  </span>
                </a>
              </div>
            </div>
          </div>
  
          <!-- Professional Footer Section -->
          <div class="border-t border-white/10 bg-white/5 backdrop-blur-sm">
            <!-- Quick Stats -->
            <div class="grid grid-cols-3 gap-1 p-4 border-b border-white/5">
              <div class="text-center">
                <div class="text-lg font-bold text-gold-400">10K+</div>
                <div class="text-[10px] text-white/50 uppercase tracking-wider">Investors</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-gold-400">$2B+</div>
                <div class="text-[10px] text-white/50 uppercase tracking-wider">Volume</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-gold-400">98%</div>
                <div class="text-[10px] text-white/50 uppercase tracking-wider">Satisfaction</div>
              </div>
            </div>
  
            <!-- Quick Actions -->
            <div class="p-4 space-y-2">
              <a 
                href="signup" 
                class="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-primary-900 font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span class="flex items-center gap-2">
                  <i class="bi bi-person-plus"></i>
                  Open Account
                </span>
                <i class="bi bi-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
              </a>
              
              <div class="flex gap-2">
                <a 
                  href="login" 
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white/80 text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:text-white border border-white/10"
                >
                  <i class="bi bi-box-arrow-in-right"></i>
                  Login
                </a>
                <a 
                  href="support" 
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white/80 text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:text-white border border-white/10"
                >
                  <i class="bi bi-headset"></i>
                  Help
                </a>
              </div>
  
              <!-- Social Links -->
              <div class="flex justify-center gap-4 pt-3">
                <a 
                  v-for="social in socialLinks" 
                  :key="social.name"
                  :href="social.href"
                  class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-gold-400 flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-gold-400/30"
                >
                  <i :class="social.icon" class="text-sm"></i>
                </a>
              </div>
            </div>
          </div>
  
          <!-- Footer -->
          <div class="text-center py-3 text-[10px] text-white/30 border-t border-white/5">
            <span>© 2026 CoinSquare Wealth. All rights reserved.</span>
          </div>
        </div>
      </aside>
    </Teleport>
  </template>
  
  <script setup>
  defineProps({
    isOpen: {
      type: Boolean,
      required: true
    }
  })
  
  defineEmits(['close'])
  
  const openItems = ref([])
  
  // Navigation items matching the navbar
  const navItems = [
    { name: 'Home', href: '', hasDropdown: false },
    { name: 'About us', href: '#', hasDropdown: true },
    { name: 'Expert Investors', href: 'expert', hasDropdown: false },
    { name: 'Company', href: 'about', hasDropdown: false },
    { name: 'Contact Us', href: 'support', hasDropdown: false },
  ]
  
  // Build menu items with dropdown links
  const menuItems = navItems.map(item => {
    if (item.name === 'About us') {
      return {
        ...item,
        links: [
          { name: 'Why CoinSquare Wealth', href: 'about' },
          { name: 'Regulations', href: 'regulations' },
          { name: 'Expert Traders', href: 'expert' },
          { name: 'Career', href: 'career' },
        ]
      }
    }
    return { ...item, links: null }
  })
  
  const socialLinks = [
    { name: 'Twitter', href: '#', icon: 'bi-twitter' },
    { name: 'LinkedIn', href: '#', icon: 'bi-linkedin' },
    { name: 'YouTube', href: '#', icon: 'bi-youtube' },
    { name: 'Instagram', href: '#', icon: 'bi-instagram' },
  ]
  
  // Icon mapping for menu items
  const iconMap = {
    'Home': 'bi-house-door',
    'About us': 'bi-info-circle',
    'Expert Investors': 'bi-people',
    'Company': 'bi-building',
    'Contact Us': 'bi-envelope',
  }
  
  const getIcon = (name) => {
    return iconMap[name] || 'bi-circle'
  }
  
  const toggleItem = (name) => {
    const index = openItems.value.indexOf(name)
    if (index > -1) {
      openItems.value.splice(index, 1)
    } else {
      openItems.value.push(name)
    }
  }
  
  const isOpenItem = (name) => openItems.value.includes(name)
  </script>
  
  <style scoped>
  #side-menu {
    scroll-behavior: smooth;
  }
  
  #side-menu::-webkit-scrollbar {
    width: 4px;
  }
  
  #side-menu::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  #side-menu::-webkit-scrollbar-thumb {
    background: rgba(187, 145, 74, 0.4);
    border-radius: 10px;
  }
  
  #side-menu::-webkit-scrollbar-thumb:hover {
    background: rgba(187, 145, 74, 0.6);
  }
  
  .menu-item-btn {
    position: relative;
    overflow: hidden;
  }
  
  .menu-item-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(187, 145, 74, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 12px;
  }
  
  .menu-item-btn:hover::before {
    opacity: 1;
  }
  
  /* Social icon hover effect */
  .social-link {
    transition: all 0.3s ease;
  }
  
  .social-link:hover {
    transform: translateY(-2px);
  }
  </style>