<template>
    <div 
      class="dashboard-page min-h-screen flex flex-col transition-colors duration-500"
      :class="isDark ? 'bg-[#0A1033]' : 'bg-[#F7F8FC]'"
    >
      <!-- Page Head -->
      <div 
        class="page__head relative transition-all duration-500"
        :style="{ 
          background: isDark 
            ? 'linear-gradient(135deg, #0F1B4C 0%, #0A1033 50%, #060B26 100%)' 
            : 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #1E3A8A 100%)',
          borderBottomLeftRadius: '60px', 
          borderBottomRightRadius: '60px', 
          padding: '21px 0 77px',
          boxShadow: isDark 
            ? '0 4px 40px rgba(6, 11, 38, 0.6)' 
            : '0 4px 40px rgba(30, 58, 138, 0.15)',
          zIndex: 20
        }"
      >
        <!-- Decorative Background Elements -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            class="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
            :class="isDark ? 'bg-blue-500/[0.08]' : 'bg-white/10'"
          ></div>
          <div 
            class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
            :class="isDark ? 'bg-indigo-500/[0.06]' : 'bg-white/5'"
          ></div>
          <div 
            class="absolute inset-0 opacity-[0.02]"
            style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 40px 40px;"
          ></div>
        </div>
  
        <div class="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <!-- Header -->
          <header class="header flex items-center justify-between mb-8 md:mb-10">
            <!-- Burger Menu (Mobile) -->
            <button 
              class="header__burger md:hidden w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08]"
              @click="toggleMobileMenu"
              aria-label="Open Menu"
            >
              <svg class="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
  
            <!-- Logo & Desktop Navigation -->
            <div class="header__wrap flex items-center mr-auto">
              <a href="?a=home" class="header__logo inline-flex w-32 mr-4 md:mr-16">
                <img src="/logo1.png" alt="CoinSquare Wealth" class="w-full" />
              </a>
              
              <nav class="header__navigation hidden md:flex md:flex-row">
                <a 
                  v-for="link in navLinks" 
                  :key="link.name"
                  :href="link.href"
                  class="header__link flex items-center px-4 py-2 rounded-xl text-sm md:text-base font-semibold transition-all duration-200"
                  :class="link.active 
                    ? 'bg-white/[0.1] text-white backdrop-blur-sm border border-white/[0.08]' 
                    : 'text-white/50 hover:text-white/90 hover:bg-white/[0.06]'"
                >
                  {{ link.name }}
                </a>
              </nav>
            </div>
  
            <!-- Header Controls - High z-index so dropdown floats above -->
            <div class="header__control flex items-center gap-2 md:gap-4 relative z-[100]">
              <!-- Theme Toggle -->
              <button
                @click="toggleDark()"
                class="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden backdrop-blur-sm bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08]"
                :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              >
                <ClientOnly>
                  <Transition
                    enter-active-class="transition-all duration-300"
                    enter-from-class="opacity-0 rotate-90 scale-50"
                    enter-to-class="opacity-100 rotate-0 scale-100"
                    leave-active-class="transition-all duration-300 absolute"
                    leave-from-class="opacity-100 rotate-0 scale-100"
                    leave-to-class="opacity-0 -rotate-90 scale-50"
                    mode="out-in"
                  >
                    <i 
                      v-if="isDark" 
                      key="sun"
                      class="bi bi-sun-fill text-amber-400 text-lg md:text-xl"
                    ></i>
                    <i 
                      v-else 
                      key="moon"
                      class="bi bi-moon-stars-fill text-blue-200 text-lg md:text-xl"
                    ></i>
                  </Transition>
                  <template #fallback>
                    <i class="bi bi-moon-stars-fill text-blue-200 text-lg md:text-xl"></i>
                  </template>
                </ClientOnly>
              </button>
  
              <!-- Notifications -->
              <div class="notification relative">
                <button 
                  class="notification__button w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08]"
                >
                  <i class="bi bi-bell text-white/80 text-lg"></i>
                  <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#1E40AF] animate-pulse"></span>
                </button>
              </div>
  
              <!-- User Avatar -->
              <div class="dropdown user-dropdown relative">
                <a 
                  class="header__avatar block w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/[0.15] hover:border-amber-500/60 overflow-hidden cursor-pointer transition-all duration-300"
                  @click="toggleDropdown"
                >
                  <img src="/profile.jpg" alt="Profile" class="w-full h-full object-cover" />
                </a>
                
                <!-- Dropdown Menu -->
                <Transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="opacity-0 translate-y-2 scale-95"
                  enter-to-class="opacity-100 translate-y-0 scale-100"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="opacity-100 translate-y-0 scale-100"
                  leave-to-class="opacity-0 translate-y-2 scale-95"
                >
                  <div 
                    v-if="isDropdownOpen" 
                    class="dropdown-menu absolute right-0 top-14 w-64 rounded-2xl shadow-2xl overflow-hidden z-[999] border backdrop-blur-xl"
                    :class="isDark 
                      ? 'bg-[#0F1B4C]/95 border-white/[0.08] shadow-black/60' 
                      : 'bg-white border-gray-200 shadow-gray-300/50'"
                  >
                    <div 
                      class="p-4 border-b"
                      :class="isDark ? 'border-white/[0.06]' : 'border-gray-100'"
                    >
                      <div class="flex items-center gap-3">
                        <div 
                          class="w-12 h-12 rounded-full overflow-hidden border-2"
                          :class="isDark ? 'border-amber-500/30' : 'border-gold-500/50'"
                        >
                          <img src="/profile.jpg" alt="Profile" class="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span 
                            class="block font-semibold"
                            :class="isDark ? 'text-white' : 'text-gray-800'"
                          >
                            {{ username }}
                          </span>
                          <span 
                            class="text-sm"
                            :class="isDark ? 'text-white/40' : 'text-gray-500'"
                          >
                            john@example.com
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="p-2">
                      <a 
                        href="?a=edit_account" 
                        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200"
                        :class="isDark 
                          ? 'text-white/70 hover:text-white hover:bg-white/[0.04]' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
                      >
                        <i class="bi bi-person text-amber-500"></i>
                        <span>View Profile</span>
                      </a>
                      <a 
                        href="?a=security" 
                        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200"
                        :class="isDark 
                          ? 'text-white/70 hover:text-white hover:bg-white/[0.04]' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
                      >
                        <i class="bi bi-shield-lock text-amber-500"></i>
                        <span>Security Setting</span>
                      </a>
                    </div>
                    <div 
                      class="p-2 border-t"
                      :class="isDark ? 'border-white/[0.06]' : 'border-gray-100'"
                    >
                      <a 
                        href="?a=logout" 
                        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200"
                        :class="isDark 
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-500/[0.08]' 
                          : 'text-red-500 hover:text-red-600 hover:bg-red-50'"
                      >
                        <i class="bi bi-box-arrow-right"></i>
                        <span>Log Out</span>
                      </a>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </header>
  
          <!-- Page Title & Status -->
          <div class="page__breadcrumbs">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="page__text">
                <div class="text-white/50 text-sm mb-1 font-medium">Welcome back,</div>
                <div class="page__title text-white text-2xl md:text-3xl font-bold tracking-tight">
                  {{ username }} 👋
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border bg-white/[0.06] border-white/[0.08]">
                  <span class="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                  <span class="text-white/80 text-sm font-medium">Account Active</span>
                </span>
              </div>
            </div>
          </div>
  
          <!-- Tabs Navigation -->
          <div class="page__line overflow-x-auto scrollbar-hide border-b border-white/[0.08] mt-6">
            <div class="page__nav flex items-center gap-1 md:gap-2 whitespace-nowrap">
              <a 
                v-for="link in tabLinks" 
                :key="link.name"
                :href="link.href"
                class="page__link inline-flex items-center gap-2 px-4 md:px-6 py-3 rounded-t-xl text-sm font-medium transition-all duration-200"
                :class="link.active 
                  ? 'text-primary-900 font-semibold' 
                  : 'text-white/50 hover:text-white/90 hover:bg-white/[0.06]'"
                :style="link.active ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%); color: #020862;' : ''"
              >
                <i :class="getLinkIcon(link.name)" class="text-base"></i>
                {{ link.name }}
              </a>
            </div>
          </div>

            <!-- Security Alert -->
                <Transition
                    enter-active-class="transition-all duration-300"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                >
                    <div 
                    v-if="showSecurityAlert" 
                    class="flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300
                            bg-yellow-50 border-yellow-200
                            dark:bg-amber-500/[0.06] dark:border-amber-500/[0.15]
                            absolute -bottom-32 left-0 mx-4"
                    >
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                                bg-yellow-100 dark:bg-amber-500/[0.1]">
                        <i class="bi bi-shield-exclamation text-amber-500 text-xl"></i>
                    </div>
                    <div class="flex-1 text-sm text-gray-700 dark:text-white/70">
                        <b class="text-amber-500">Security Note:</b> please activate 
                        <a 
                        href="?a=security" 
                        class="font-semibold underline transition-colors duration-200
                                text-yellow-600 hover:text-yellow-700
                                dark:text-amber-400 dark:hover:text-amber-300"
                        >
                        Two Factor Authentication
                        </a> 
                        to keep your account safe.
                    </div>
                    <button 
                        @click="showSecurityAlert = false"
                        class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200
                            hover:bg-gray-200 text-gray-400
                            dark:hover:bg-white/[0.06] dark:text-white/40"
                    >
                        <i class="bi bi-x-lg text-sm"></i>
                    </button>
                    </div>
                </Transition>
        </div>
      </div>
  
      <!-- Page Body -->
      <div 
        class="page__body flex-1 -mt-5 pb-12 transition-colors duration-500 relative"
        :class="isDark ? 'bg-[#0A1033]' : 'bg-[#F7F8FC]'"
        style="position: relative;"
      >
        <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div 
            class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
            :class="isDark ? 'bg-blue-500/[0.05]' : 'bg-blue-400/[0.07]'"
          ></div>
          <div 
            class="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl"
            :class="isDark ? 'bg-indigo-500/[0.04]' : 'bg-amber-400/[0.05]'"
          ></div>
        </div>
  
        <div class="container max-w-7xl mx-auto px-4 md:px-6 relative z-[1]">
          <slot />
        </div>
      </div>
  
      <!-- Mobile Side Menu Overlay -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="isMobileMenuOpen"
          class="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm md:hidden"
          @click="toggleMobileMenu"
        ></div>
      </Transition>
  
      <!-- Slide-out Menu Panel -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <aside
          v-if="isMobileMenuOpen"
          class="fixed top-0 left-0 bottom-0 z-[210] w-[292px] max-w-[85vw] md:hidden overflow-y-auto"
          style="background: linear-gradient(180deg, #1E3A8A 0%, #1E40AF 100%); box-shadow: 4px 0 24px rgba(0, 0, 0, 0.6);"
        >
          <div class="flex flex-col h-full p-6">
            <div class="flex items-center justify-between mb-8">
              <a href="?a=home" class="inline-flex w-24">
                <img src="/logo1.png" alt="CoinSquare Wealth" class="w-full" />
              </a>
              <button 
                class="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%);"
                @click="toggleMobileMenu"
                aria-label="Close Menu"
              >
                <svg class="w-5 h-5 fill-primary-900" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
  
            <nav class="flex flex-col gap-2 flex-1">
              <a 
                v-for="link in navLinks" 
                :key="link.name"
                :href="link.href"
                class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200"
                :class="link.active 
                  ? 'text-primary-900 shadow-lg shadow-amber-500/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/[0.06]'"
                :style="link.active ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%);' : ''"
                @click="isMobileMenuOpen = false"
              >
                <i :class="getLinkIcon(link.name)" class="text-lg"></i>
                <span>{{ link.name }}</span>
              </a>
            </nav>
  
            <div class="border-t border-white/[0.1] my-4"></div>
  
            <a 
              href="?a=logout" 
              class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold text-amber-400 hover:bg-white/[0.06] transition-all duration-200"
            >
              <i class="bi bi-box-arrow-right text-lg"></i>
              <span>Log Out</span>
            </a>
  
            <div class="text-center text-white/30 text-xs mt-4">
              © 2026 CoinSquare Wealth
            </div>
          </div>
        </aside>
      </Transition>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  
  // ─────────────────────────────────────────────────────────────
  // THEME STATE
  // ─────────────────────────────────────────────────────────────
  const isDark = ref(false)
  const showSecurityAlert = ref(true)
  
  const initTheme = () => {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem('theme')
    const html = document.documentElement
    
    if (stored === 'dark') {
      isDark.value = true
      html.classList.add('dark')
      html.classList.remove('light')
      html.setAttribute('data-theme', 'dark')
    } else {
      isDark.value = false
      html.classList.add('light')
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
    }
  }
  
  const toggleDark = () => {
    if (typeof window === 'undefined') return
    
    isDark.value = !isDark.value
    const html = document.documentElement
    
    if (isDark.value) {
      html.classList.add('dark')
      html.classList.remove('light')
      html.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }
  
  // ─────────────────────────────────────────────────────────────
  // UI STATE
  // ─────────────────────────────────────────────────────────────
  const isMobileMenuOpen = ref(false)
  const isDropdownOpen = ref(false)
  const username = ref('john')
  
  const navLinks = [
    { name: 'Dashboard', href: '?a=account', active: true },
    { name: 'Transactions', href: '?a=history', active: false },
    { name: 'Deposit', href: '?a=deposit', active: false },
    { name: 'Withdraw', href: '?a=withdraw', active: false },
    { name: 'Referrals', href: '?a=referals', active: false },
    { name: 'Settings', href: '?a=edit_account', active: false }
  ]
  
  const tabLinks = [
    { name: 'Dashboard', href: '?a=account', active: true },
    { name: 'Deposit', href: '?a=deposit', active: false },
    { name: 'Withdraw', href: '?a=withdraw', active: false },
    { name: 'Transactions', href: '?a=history', active: false },
    { name: 'Referrals', href: '?a=referals', active: false },
    { name: 'Support', href: '?a=support', active: false }
  ]
  
  const iconMap = {
    'Dashboard': 'bi-speedometer2',
    'Transactions': 'bi-clock-history',
    'Deposit': 'bi-arrow-down-circle',
    'Withdraw': 'bi-arrow-up-circle',
    'Referrals': 'bi-people',
    'Settings': 'bi-gear',
    'Support': 'bi-headset'
  }
  
  const getLinkIcon = (name) => iconMap[name] || 'bi-circle'
  
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }
  
  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
  }
  
  watch(isMobileMenuOpen, (isOpen) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  })
  
  const handleClickOutside = (event) => {
    const dropdown = document.querySelector('.user-dropdown')
    if (dropdown && !dropdown.contains(event.target)) {
      isDropdownOpen.value = false
    }
  }
  
  const handleResize = () => {
    if (window.innerWidth >= 768 && isMobileMenuOpen.value) {
      isMobileMenuOpen.value = false
    }
  }
  
  onMounted(() => {
    initTheme()
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', handleResize)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', handleResize)
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  })
  </script>
  
  <style scoped>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .header__navigation .header__link {
    position: relative;
    transition: all 0.2s ease;
  }
  
  .header__navigation .header__link:not(:last-child) {
    margin-right: 6px;
  }
  
  .page__nav .page__link {
    transition: all 0.2s ease;
    position: relative;
  }
  
  .page__nav .page__link.active {
    box-shadow: 0 -4px 20px rgba(245, 215, 127, 0.3);
  }
  
  .dropdown-menu {
    animation: slideDown 0.2s ease;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 767px) {
    .page__head {
      padding: 16px 0 50px;
      border-bottom-left-radius: 40px !important;
      border-bottom-right-radius: 40px !important;
    }
    .header {
      margin-bottom: 20px;
    }
    .header__logo {
      width: 100px;
    }
    .page__body {
      margin-top: -15px;
    }
  }
  
  .page__title {
    font-size: 20px;
    font-weight: 700;
  }
  
  .page__breadcrumbs {
    margin-top: 12px;
    font-size: 14px;
    font-weight: 500;
  }
  
  .page__line {
    margin-top: 24px;
  }
  
  aside::-webkit-scrollbar {
    width: 4px;
  }
  
  aside::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  aside::-webkit-scrollbar-thumb {
    background: rgba(245, 215, 127, 0.3);
    border-radius: 10px;
  }
  
  .dashboard-page,
  .page__head,
  .page__body {
    transition: background-color 0.5s ease, background 0.5s ease;
  }
  </style>