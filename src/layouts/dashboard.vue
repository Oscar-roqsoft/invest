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
        zIndex: 20,
      }"
    >
      <!-- Decorative Background -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
             :class="isDark ? 'bg-blue-500/[0.08]' : 'bg-white/10'"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
             :class="isDark ? 'bg-indigo-500/[0.06]' : 'bg-white/5'"></div>
        <div class="absolute inset-0 opacity-[0.02]"
             style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 40px 40px;"></div>
      </div>

      <div class="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <!-- Header -->
        <header class="header flex items-center justify-between mb-8 md:mb-10 gap-2">
          <!-- Mobile Burger -->
          <button
            class="header__burger md:hidden w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08]"
            @click="toggleMobileMenu"
            aria-label="Open Menu"
          >
            <svg class="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>

          <!-- Logo & Desktop Nav -->
          <div class="header__wrap flex items-center mr-auto">
            <NuxtLink :to="isAdmin ? '/dashboard/admin' : '/dashboard'" class="header__logo inline-flex w-32 mr-4 md:mr-10">
              <img src="/logo1.png" alt="CoinSquare Wealth" class="w-full" />
            </NuxtLink>

            <nav class="header__navigation hidden md:flex md:flex-row items-center">
              <NuxtLink
                v-for="link in primaryNavLinks"
                :key="link.name"
                :to="link.href"
                class="header__link flex items-center px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                :class="isLinkActive(link.href)
                  ? 'bg-white/[0.1] text-white backdrop-blur-sm border border-white/[0.08]'
                  : 'text-white/50 hover:text-white/90 hover:bg-white/[0.06]'"
              >
                <i v-if="link.icon" :class="link.icon" class="mr-1.5 text-sm opacity-80"></i>
                {{ link.name }}
              </NuxtLink>
            </nav>
          </div>

          <!-- Header Controls -->
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
                  <i v-if="isDark" key="sun" class="bi bi-sun-fill text-amber-400 text-lg md:text-xl"></i>
                  <i v-else key="moon" class="bi bi-moon-stars-fill text-blue-200 text-lg md:text-xl"></i>
                </Transition>
                <template #fallback>
                  <i class="bi bi-moon-stars-fill text-blue-200 text-lg md:text-xl"></i>
                </template>
              </ClientOnly>
            </button>

            <!-- Notifications -->
            <div class="notification relative">
              <button
                class="notification__button w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] relative"
                @click="goToTransactions"
              >
                <i class="bi bi-bell text-white/80 text-lg"></i>
                <span v-if="hasActivity"
                      class="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#1E40AF] animate-pulse"></span>
              </button>
            </div>

            <!-- User Avatar -->
            <div ref="dropdownRef" class="dropdown user-dropdown relative">
              <button
                class="header__avatar block w-10 h-10 md:w-12 md:h-12 rounded-full border-2 overflow-hidden cursor-pointer transition-all duration-300 relative"
                :class="isAdmin ? 'border-purple-400/50 hover:border-purple-300' : 'border-white/[0.15] hover:border-amber-500/60'"
                @click="toggleDropdown"
              >
                <img v-if="userAvatar" :src="userAvatar" alt="Profile" class="w-full h-full object-cover">
                <div v-else class="w-full h-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-amber-400 to-amber-600 text-primary-900">
                  {{ userInitials }}
                </div>
                <span v-if="isAdmin"
                      class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-purple-500 border-2 border-[#1E40AF] flex items-center justify-center">
                  <i class="bi bi-shield-fill-check text-white" style="font-size: 8px;"></i>
                </span>
              </button>

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
                  :class="isDark ? 'bg-[#0F1B4C]/95 border-white/[0.08] shadow-black/60' : 'bg-white border-gray-200 shadow-gray-300/50'"
                >
                  <!-- User Info -->
                  <div class="p-4 border-b" :class="isDark ? 'border-white/[0.06]' : 'border-gray-100'">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
                           :class="isAdmin ? 'border-purple-500/40' : isDark ? 'border-amber-500/30' : 'border-gold-500/50'">
                        <img v-if="userAvatar" :src="userAvatar" alt="Profile" class="w-full h-full object-cover">
                        <div v-else class="w-full h-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-amber-400 to-amber-600 text-primary-900">
                          {{ userInitials }}
                        </div>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-1.5">
                          <span class="block font-semibold truncate" :class="isDark ? 'text-white' : 'text-gray-800'">{{ userName }}</span>
                          <span v-if="isAdmin"
                                class="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-500 dark:text-purple-400">
                            Admin
                          </span>
                        </div>
                        <span class="text-sm truncate block" :class="isDark ? 'text-white/40' : 'text-gray-500'">{{ userEmail }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Menu -->
                  <div class="p-2">
                    <!-- ADMIN: Switch to user view -->
                    <!-- <NuxtLink
                      v-if="isAdmin"
                      to="/dashboard"
                      class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 mb-1
                             bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 hover:border-amber-500/40"
                      @click="isDropdownOpen = false"
                    >
                      <i class="bi bi-person-badge text-amber-500"></i>
                      <span class="font-semibold text-amber-500">View as User</span>
                      <i class="bi bi-arrow-right ml-auto text-amber-500 text-xs"></i>
                    </NuxtLink> -->

                    <!-- ADMIN: Admin panel shortcut -->
                    <!-- <NuxtLink
                      v-if="isAdmin"
                      to="/dashboard/admin"
                      class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 mb-1
                             bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40"
                      @click="isDropdownOpen = false"
                    >
                      <i class="bi bi-shield-lock-fill text-purple-500"></i>
                      <span class="font-semibold text-purple-500 dark:text-purple-400">Admin Panel</span>
                      <i class="bi bi-arrow-right ml-auto text-purple-500 text-xs"></i>
                    </NuxtLink> -->

                    <!-- Regular user (non-admin): Profile + Security -->
                    <template v-if="!isAdmin">
                      <NuxtLink
                        to="/dashboard/settings?tab=profile"
                        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200"
                        :class="isDark ? 'text-white/70 hover:text-white hover:bg-white/[0.04]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
                        @click="isDropdownOpen = false"
                      >
                        <i class="bi bi-person text-amber-500"></i>
                        <span>View Profile</span>
                      </NuxtLink>
                      <NuxtLink
                        to="/dashboard/settings?tab=security"
                        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200"
                        :class="isDark ? 'text-white/70 hover:text-white hover:bg-white/[0.04]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
                        @click="isDropdownOpen = false"
                      >
                        <i class="bi bi-shield-lock text-amber-500"></i>
                        <span>Security Setting</span>
                      </NuxtLink>
                    </template>
                  </div>

                  <!-- Logout -->
                  <div class="p-2 border-t" :class="isDark ? 'border-white/[0.06]' : 'border-gray-100'">
                    <button
                      @click="handleLogout"
                      class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200"
                      :class="isDark ? 'text-red-400 hover:text-red-300 hover:bg-red-500/[0.08]' : 'text-red-500 hover:text-red-600 hover:bg-red-50'"
                    >
                      <i class="bi bi-box-arrow-right"></i>
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </header>

        <!-- Page Title -->
        <div class="page__breadcrumbs">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="page__text">
              <div class="text-white/50 text-sm mb-1 font-medium">
                {{ isAdmin ? 'Admin console —' : 'Welcome back,' }}
              </div>
              <div class="flex items-center gap-2.5 flex-wrap">
                <div class="page__title text-white text-2xl md:text-3xl font-bold tracking-tight">
                  {{ isAdmin ? 'Management' : userName }} <span v-if="!isAdmin">👋</span>
                </div>
                <span v-if="isAdmin"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                             bg-gradient-to-r from-purple-500/30 to-pink-500/30
                             border border-purple-400/40 text-purple-200 backdrop-blur-sm">
                  <i class="bi bi-shield-fill-check"></i>
                  ADMIN
                </span>
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

        <!-- Tabs — full link list, role-dependent -->
        <div class="page__line overflow-x-auto scrollbar-hide border-b border-white/[0.08] mt-6">
          <div class="page__nav flex items-center gap-1 md:gap-2 whitespace-nowrap">
            <NuxtLink
              v-for="link in allNavLinks"
              :key="link.name"
              :to="link.href"
              class="page__link inline-flex items-center gap-2 px-4 md:px-5 py-3 rounded-t-xl text-sm font-medium transition-all duration-200"
              :class="isLinkActive(link.href)
                ? 'text-primary-900 font-semibold'
                : 'text-white/50 hover:text-white/90 hover:bg-white/[0.06]'"
              :style="isLinkActive(link.href)
                ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%); color: #020862;'
                : ''"
            >
              <i :class="link.icon || getLinkIcon(link.name)" class="text-base"></i>
              {{ link.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- Security Alert (only for regular users) -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="showSecurityAlert && !isAdmin"
            class="flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300
                   bg-yellow-50 border-yellow-200
                   dark:bg-amber-500/[0.06] dark:border-amber-500/[0.15]
                   absolute -bottom-32 left-0 mx-4 max-w-md"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                        bg-yellow-100 dark:bg-amber-500/[0.1]">
              <i class="bi bi-shield-exclamation text-amber-500 text-xl"></i>
            </div>
            <div class="flex-1 text-sm text-gray-700 dark:text-white/70">
              <b class="text-amber-500">Security Note:</b> please activate
              <NuxtLink
                to="/dashboard/settings?tab=security"
                class="font-semibold underline transition-colors duration-200
                       text-yellow-600 hover:text-yellow-700
                       dark:text-amber-400 dark:hover:text-amber-300"
              >
                Two Factor Authentication
              </NuxtLink>
              to keep your account safe.
            </div>
            <button
              @click="dismissSecurityAlert"
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
        <div class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
             :class="isDark ? 'bg-blue-500/[0.05]' : 'bg-blue-400/[0.07]'"></div>
        <div class="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl"
             :class="isDark ? 'bg-indigo-500/[0.04]' : 'bg-amber-400/[0.05]'"></div>
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
          <!-- Header -->
          <div class="flex items-center justify-between mb-8">
            <NuxtLink :to="isAdmin ? '/dashboard/admin' : '/dashboard'" class="inline-flex w-24">
              <img src="/logo1.png" alt="CoinSquare Wealth" class="w-full" />
            </NuxtLink>
            <button
              class="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
              style="background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%);"
              @click="toggleMobileMenu"
              aria-label="Close Menu"
            >
              <svg class="w-5 h-5 fill-primary-900" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          <!-- User Card -->
          <div class="flex items-center gap-3 p-3 rounded-xl mb-4 bg-white/[0.06] border border-white/[0.08]">
            <div class="w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
                 :class="isAdmin ? 'border-purple-400/60' : 'border-amber-500/40'">
              <img v-if="userAvatar" :src="userAvatar" alt="Profile" class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-amber-400 to-amber-600 text-primary-900">
                {{ userInitials }}
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5">
                <p class="font-bold text-sm text-white truncate">{{ userName }}</p>
                <span v-if="isAdmin"
                      class="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                             bg-purple-500/20 text-purple-200">
                  Admin
                </span>
              </div>
              <p class="text-xs text-white/40 truncate">{{ userEmail }}</p>
            </div>
          </div>

          <!-- Admin "View as User" quick action -->
          <NuxtLink
            v-if="isAdmin"
            to="/dashboard"
            class="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 text-sm font-semibold
                   bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-400/30
                   text-amber-200 hover:border-amber-400/60 transition-all"
            @click="isMobileMenuOpen = false"
          >
            <i class="bi bi-person-badge text-base"></i>
            <span>View as User</span>
            <i class="bi bi-arrow-right ml-auto text-xs opacity-70"></i>
          </NuxtLink>

          <!-- Nav Links -->
          <nav class="flex flex-col gap-1.5 flex-1">
            <NuxtLink
              v-for="link in allNavLinks"
              :key="link.name"
              :to="link.href"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              :class="isLinkActive(link.href)
                ? 'text-primary-900 shadow-lg shadow-amber-500/20'
                : 'text-white/60 hover:text-white hover:bg-white/[0.06]'"
              :style="isLinkActive(link.href)
                ? 'background: linear-gradient(135deg, #F5D77F 0%, #E6BB5C 100%);'
                : ''"
              @click="isMobileMenuOpen = false"
            >
              <i :class="link.icon || getLinkIcon(link.name)" class="text-base"></i>
              <span>{{ link.name }}</span>
            </NuxtLink>
          </nav>

          <div class="border-t border-white/[0.1] my-4"></div>

          <!-- Logout -->
          <button
            @click="handleLogout"
            class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold text-amber-400 hover:bg-white/[0.06] transition-all duration-200"
          >
            <i class="bi bi-box-arrow-right text-lg"></i>
            <span>Log Out</span>
          </button>

          <div class="text-center text-white/30 text-xs mt-4">
            © 2026 CoinSquare Wealth
          </div>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { toast } from 'vue-sonner'

// ─────────────────────────────────────────────────────────────
// STORES
// ─────────────────────────────────────────────────────────────
const authStore = useAuthStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// ─────────────────────────────────────────────────────────────
// ROLE
// ─────────────────────────────────────────────────────────────
const isAdmin = computed(() => authStore.isAdmin === true)

// ─────────────────────────────────────────────────────────────
// USER DATA
// ─────────────────────────────────────────────────────────────
const userName = computed(() => authStore.state.user?.name || 'User')
const userEmail = computed(() => authStore.state.user?.email || '')
const userAvatar = computed(() => authStore.state.user?.avatar || '')
const userInitials = computed(() => {
  if (!authStore.state.user?.name) return '?'
  return authStore.state.user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

// ─────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────
const isDark = ref(false)

const initTheme = () => {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem('theme')
  const html = document.documentElement
  if (stored === 'dark') {
    isDark.value = true
    html.classList.add('dark'); html.classList.remove('light'); html.setAttribute('data-theme', 'dark')
  } else {
    isDark.value = false
    html.classList.add('light'); html.classList.remove('dark'); html.setAttribute('data-theme', 'light')
  }
}

const toggleDark = () => {
  if (typeof window === 'undefined') return
  isDark.value = !isDark.value
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark'); html.classList.remove('light'); html.setAttribute('data-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.add('light'); html.classList.remove('dark'); html.setAttribute('data-theme', 'light')
    localStorage.setItem('theme', 'light')
  }
}

// ─────────────────────────────────────────────────────────────
// SECURITY ALERT
// ─────────────────────────────────────────────────────────────
const alertDismissed = ref(false)
const has2FA = computed(() => authStore.state.user?.twoFactorVerification === true)
const showSecurityAlert = computed(() =>
  !alertDismissed.value && !has2FA.value && authStore.state.isAuthenticated
)
const dismissSecurityAlert = () => { alertDismissed.value = true }

// ─────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────
const hasActivity = computed(() => authStore.state.isAuthenticated)
const goToTransactions = () => {
  router.push(isAdmin.value ? '/dashboard/admin/transactions' : '/dashboard/transactions')
}

// ─────────────────────────────────────────────────────────────
// UI STATE
// ─────────────────────────────────────────────────────────────
const isMobileMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

// ─────────────────────────────────────────────────────────────
// NAV CONFIG — user vs admin
// ─────────────────────────────────────────────────────────────
const USER_NAV = [
  { name: 'Dashboard',    href: '/dashboard',              icon: 'bi-speedometer2' },
  { name: 'Transactions', href: '/dashboard/transactions', icon: 'bi-clock-history' },
  { name: 'Deposit',      href: '/dashboard/deposit',      icon: 'bi-arrow-down-circle' },
  { name: 'Withdraw',     href: '/dashboard/withdraw',     icon: 'bi-arrow-up-circle' },
  { name: 'Referrals',    href: '/dashboard/referrals',    icon: 'bi-people' },
  { name: 'Plans',        href: '/dashboard/plans',        icon: 'bi-graph-up-arrow' },
  { name: 'Settings',     href: '/dashboard/settings',     icon: 'bi-gear' },
]

const ADMIN_NAV = [
  // { name: 'Overview',     href: '/dashboard/admin',                icon: 'bi-grid-1x2' },
  { name: 'Users',        href: '/dashboard/admin/users',          icon: 'bi-people' },
  // { name: 'KYC',          href: '/dashboard/admin/kyc',            icon: 'bi-shield-check' },
  { name: 'Deposits',     href: '/dashboard/admin/deposits',       icon: 'bi-arrow-down-circle' },
  { name: 'Withdrawals',  href: '/dashboard/admin/withdrawals',    icon: 'bi-arrow-up-circle' },
  // { name: 'Transactions', href: '/dashboard/admin/transactions',   icon: 'bi-clock-history' },
  { name: 'Plans',        href: '/dashboard/admin/plans',          icon: 'bi-graph-up-arrow' },
  { name: 'Investments',  href: '/dashboard/admin/investments',    icon: 'bi-briefcase' },
  { name: 'Wallets',      href: '/dashboard/admin/wallets',        icon: 'bi-wallet2' },
  { name: 'Referrals',    href: '/dashboard/admin/referrals',      icon: 'bi-share' },
]

/** The full list of links the current user should see (tabs + mobile sidebar) */
const allNavLinks = computed(() => (isAdmin.value ? ADMIN_NAV : USER_NAV))

/** The subset shown in the top desktop nav (space-constrained) */
const primaryNavLinks = computed(() => {
  if (isAdmin.value) {
    // Top 5 most-used admin links; the rest live in the tabs / sidebar
    return [
      ADMIN_NAV[0], // Overview
      ADMIN_NAV[1], // Users
      ADMIN_NAV[3], // Deposits
      ADMIN_NAV[4], // Withdrawals
      ADMIN_NAV[6], // Plans
    ]
  }
  // Users see 6 top links (Settings moved to dropdown only)
  return USER_NAV.filter((l) => l.name !== 'Settings')
})

// ─────────────────────────────────────────────────────────────
// ICON HELPERS (fallback for custom names)
// ─────────────────────────────────────────────────────────────
const iconMap = {
  Dashboard: 'bi-speedometer2',
  Transactions: 'bi-clock-history',
  Deposit: 'bi-arrow-down-circle',
  Withdraw: 'bi-arrow-up-circle',
  Referrals: 'bi-people',
  Settings: 'bi-gear',
  Support: 'bi-headset',
  Plans: 'bi-graph-up-arrow',
  Users: 'bi-people',
  KYC: 'bi-shield-check',
  Deposits: 'bi-arrow-down-circle',
  Withdrawals: 'bi-arrow-up-circle',
  Investments: 'bi-briefcase',
  Wallets: 'bi-wallet2',
  Overview: 'bi-grid-1x2',
}

const getLinkIcon = (name) => iconMap[name] || 'bi-circle'

// ─────────────────────────────────────────────────────────────
// ACTIVE LINK
// ─────────────────────────────────────────────────────────────
const isLinkActive = (href) => {
  if (href === '/dashboard') return route.path === '/dashboard' || route.path === '/dashboard/'
  if (href === '/dashboard/admin')     return route.path === '/dashboard/admin' || route.path === '/dashboard/admin/'
  return route.path.startsWith(href)
}

// ─────────────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────────────
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }
const toggleDropdown = () => { isDropdownOpen.value = !isDropdownOpen.value }

const handleLogout = async () => {
  isDropdownOpen.value = false
  isMobileMenuOpen.value = false
  const toastId = toast.loading('Logging out...')
  try {
    await authStore.logout()
    toast.success('Logged out', { id: toastId, description: 'See you soon!' })
  } catch (err) {
    toast.error('Logout failed', { id: toastId, description: err.message })
  }
}

// ─────────────────────────────────────────────────────────────
// WATCHERS
// ─────────────────────────────────────────────────────────────
watch(isMobileMenuOpen, (isOpen) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})

watch(() => route.path, () => {
  isDropdownOpen.value = false
  isMobileMenuOpen.value = false
})

// ─────────────────────────────────────────────────────────────
// CLICK OUTSIDE
// ─────────────────────────────────────────────────────────────
const handleClickOutside = (event) => {
  if (!event.target) return
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

const handleResize = () => {
  if (window.innerWidth >= 768 && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

// ─────────────────────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────────────────────
onMounted(async () => {
  initTheme()

  if (!authStore.state.user) {
    authStore.init()
  }

  // Only fetch if we have a token (avoid wiping session on blip)
  if (authStore.state.isAuthenticated && authStore.state.token) {
    authStore.fetchUser().catch(() => {})
  }

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
/* ——— keep your existing styles as-is ——— */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.header__navigation .header__link { position: relative; transition: all 0.2s ease; }
.header__navigation .header__link:not(:last-child) { margin-right: 6px; }

.page__nav .page__link { transition: all 0.2s ease; position: relative; }
.page__nav .page__link.router-link-active { box-shadow: 0 -4px 20px rgba(245, 215, 127, 0.3); }

.dropdown-menu { animation: slideDown 0.2s ease; }

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 767px) {
  .page__head {
    padding: 16px 0 50px;
    border-bottom-left-radius: 40px !important;
    border-bottom-right-radius: 40px !important;
  }
  .header { margin-bottom: 20px; }
  .header__logo { width: 100px; }
  .page__body { margin-top: -15px; }
}

.page__title { font-size: 20px; font-weight: 700; }
.page__breadcrumbs { margin-top: 12px; font-size: 14px; font-weight: 500; }
.page__line { margin-top: 24px; }

aside::-webkit-scrollbar { width: 4px; }
aside::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
aside::-webkit-scrollbar-thumb { background: rgba(245, 215, 127, 0.3); border-radius: 10px; }

.dashboard-page, .page__head, .page__body {
  transition: background-color 0.5s ease, background 0.5s ease;
}
</style>