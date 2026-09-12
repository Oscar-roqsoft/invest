<template>
    <header 
      id="main-navbar" 
      class="fixed top-0 left-0 right-0 z-[101] text-white transition-all duration-200"
      :class="{ 'main-navbar-scrolled': isScrolled }"
      style="background: linear-gradient(90deg, #020862 0%, #000832 100%);"
    >
      <div class="navbar-toolbar flex flex-col justify-center " :style="{ height: navbarHeight }">
        <!-- Top Section -->
        <div 
          class="navbar-section navbar-section-top overflow-hidden hidden xl:block "
          :style="{ height: isScrolled ? '0' : '3.8125rem', transform: isScrolled ? 'scaleY(0)' : 'scaleY(1)' }"
        >
          <div class="flex justify-between items-center h-full">
            <div class="flex items-center h-full">
              <!-- Left content -->
            </div>
            <div class="flex items-center gap-2 ">
              <a class="navbar-btn navbar-btn-gold-outlined" href="login">
                Login
              </a>
              <a class="navbar-btn navbar-btn-gold" href="signup">
                Register
              </a>
            </div>
          </div>
        </div>
  
        <!-- Bottom Section -->
        <div class="navbar-section navbar-section-bottom flex-1 flex items-center py-2 md:py-0">
          <div class="container-custom flex items-center justify-between w-full">
            <!-- Logo Desktop -->
            <div class="hidden md:block">
              <a href="#" class="navbar-logo block h-9 transition-all duration-200">
                <img 
                  loading="lazy" 
                  src="/logo1.png" 
                  alt="logos" 
                  class="h-full w-auto max-w-full"
                />
              </a>
            </div>
  
            <!-- Logo Mobile -->
            <div class=" md:hidden  flex justify-between">
              <a href="#" class="navbar-logo-mobile block w-full">
                <img 
                  loading="lazy" 
                  src="/logo1.png" 
                  alt="logos" 
                  class=" max-w-[70%]"
                />
              </a>
            </div>
  
            <!-- Navigation Links -->
            <div class="hidden lg:flex items-center">
              <ul class="navbar-link-list flex list-none gap-8">
                <li v-for="item in navItems" :key="item.name">
                  <a 
                    v-if="!item.hasDropdown" 
                    :href="item.href" 
                    class="navbar-link text-xs uppercase"
                  >
                    {{ item.name }}
                  </a>
                  <div v-else class="relative">
                    <a 
                      class="navbar-link text-xs uppercase cursor-pointer"
                      @click="toggleDropdown(item.name)"
                      @mouseenter="showDropdown(item.name)"
                    >
                      {{ item.name }}
                    </a>
                  </div>
                </li>
              </ul>
            </div>
  
            <!-- Mobile Actions -->
            <div class="flex items-center gap-2 lg:hidden">
              <!-- Mobile Auth Buttons (visible when not scrolled) -->
              <div class="flex items-center gap-2" :class="{ 'hidden': isScrolled }">
                <a class="navbar-btn navbar-btn-gold text-sm !px-3" href="signup">
                  Register
                </a>
                <a class="navbar-btn navbar-btn-gold-outlined text-sm !px-3" href="login">
                  Login
                </a>
              </div>
  
              <!-- Mobile Menu Toggle -->
              <button 
                class="text-3xl hover:text-gold-400 transition-colors"
                @click="toggleMobileMenu"
              >
                <i class="bi bi-list"></i>
              </button>
            </div>
  
            <!-- Desktop Right Actions -->
            <div class="hidden lg:flex items-center gap-2">
              <a class="navbar-link navbar-link-contact text-sm uppercase font-oswald" href="?a=support">
                Contact us
              </a>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Dropdown Details Panel -->
      <div 
        v-if="activeDropdown" 
        class="nav-details absolute top-full left-0 right-0 bg-primary-900 border-t border-b border-[#363d6b]"
        @mouseleave="hideDropdown"
      >
        <div class="container-custom py-4 flex">
          <div class="flex-1 px-4">
            <h2 class="text-4xl font-oswald uppercase mb-4">{{ activeDropdown }}</h2>
            <p class="text-lg leading-8">
              {{ getDropdownContent(activeDropdown) }}
            </p>
          </div>
          <div class="flex-1 px-4 text-center border-x border-[#363d6b]">
            <div class="nav-details-header text-2xl font-oswald uppercase py-1.5 border-b border-[#363d6b]">
              {{ activeDropdown }}
            </div>
            <ul class="list-none mt-6">
              <li v-for="link in getDropdownLinks(activeDropdown)" :key="link" class="mb-3">
                <a :href="link.href" class="navbar-link uppercase block leading-6">
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>
          <div class="flex-1 px-4 text-center">
            <div class="nav-details-header text-2xl font-oswald uppercase py-1.5 border-b border-[#363d6b]">
              OPEN AN ACCOUNT
            </div>
            <div class="mt-6">
              <a href="?a=signup">
                <!-- Banner image here -->
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  
    <!-- Mobile Side Menu -->
    <SideMenu :is-open="isMobileMenuOpen" @close="closeMobileMenu" />
  </template>
  
  <script setup>
  const isScrolled = ref(false)
  const isMobileMenuOpen = ref(false)
  const activeDropdown = ref(null)
  let dropdownTimeout = null
  
  const navbarHeight = computed(() => {
    return isScrolled.value ? '4rem' : '7.5rem'
  })
  
  const navItems = [
    { name: 'Home', href: '', hasDropdown: false },
    { name: 'About us', href: '#', hasDropdown: true },
    { name: 'Expert Investors', href: 'expert', hasDropdown: false },
    { name: 'Company', href: 'about', hasDropdown: false },
    { name: 'Contact Us', href: 'support', hasDropdown: false },
  ]
  
  const dropdownContent = {
    'About us': 'CoinSquare Wealth was Incorporated and established in Toronto, Canada. Since then, it has grown into one of the largest financial derivatives companies worldwide, with a current paid-up capital exceeding $322 million.'
  }
  
  const dropdownLinks = {
    'About us': [
      { name: 'Why CoinSquare Wealth', href: 'about' },
      { name: 'Expert Traders', href: 'expert' },
      { name: 'Contact Us', href: 'support' },
    ]
  }
  
  const getDropdownContent = (name) => dropdownContent[name] || ''
  const getDropdownLinks = (name) => dropdownLinks[name] || []
  
  const toggleDropdown = (name) => {
    if (activeDropdown.value === name) {
      activeDropdown.value = null
    } else {
      activeDropdown.value = name
    }
  }
  
  const showDropdown = (name) => {
    clearTimeout(dropdownTimeout)
    activeDropdown.value = name
  }
  
  const hideDropdown = () => {
    dropdownTimeout = setTimeout(() => {
      activeDropdown.value = null
    }, 300)
  }
  
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }
  
  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }
  
  onMounted(() => {
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }
    window.addEventListener('scroll', handleScroll)
    
    // Handle navbar height CSS variable
    const updateNavbarHeight = () => {
      document.documentElement.style.setProperty('--navbar-height', navbarHeight.value)
    }
    updateNavbarHeight()
    
    watch(navbarHeight, updateNavbarHeight)
  })
  </script>
  
  <style scoped>
  .navbar-toolbar {
    height: v-bind(navbarHeight);
    transition: height 200ms ease-in-out;
  }
  
  .navbar-section-top {
    transition: height 200ms ease-in-out, transform 200ms ease-in-out;
    transform-origin: top center;
  }
  
  .navbar-logo {
    transition: height 200ms ease-in-out;
  }
  
  .navbar-section-bottom {
    transition: padding 200ms ease-in-out;
  }
  </style>