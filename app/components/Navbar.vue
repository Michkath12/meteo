<template>
  <nav 
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm',
      isScrolled ? 'bg-white' : 'bg-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-18 lg:h-20">
        
        <!-- Logo -->
        
        <div class="flex items-center space-x-2">
        
          
        
          <NuxtLink to="/" class="text-blue-900 font-extrabold text-lg sm:text-xl lg:text-2xl hover:opacity-80 transition-opacity">
            La météo<span class="text-yellow-400 text-xl sm:text-xl lg:text-2xl">☀️</span>
          </NuxtLink>
        </div>


        <!-- Menu Desktop (caché sur mobile) -->
        <div class="hidden lg:flex items-center space-x-8 xl:space-x-10">
          <NuxtLink
            v-for="link in navLinks" 
            :key="link.path"
            :to="link.path"
            :class="[
              'text-base xl:text-lg font-semibold transition-all duration-300 relative group',
              'hover:scale-105',
              isHomePage ? (isScrolled ? 'text-gray-900' : 'text-black') : 'text-gray-900',
              isActive(link.path) && 'font-bold'
            ]"
          >
            {{ link.name }}
            <!-- Underline animation -->
            <span 
              :class="[
                'absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full',
                isHomePage ? (isScrolled ? 'bg-blue-400' : 'bg-white') : 'bg-blue-400'
              ]"
            ></span>
          </NuxtLink>
        </div>

        <!-- Bouton Connexion Desktop -->
        <div class="hidden lg:block">
          <button 
            :class="[
              'px-5 xl:px-6 py-2 xl:py-2.5 rounded-lg font-semibold text-sm xl:text-base',
              'transition-all duration-300 transform hover:scale-105 hover:shadow-lg',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              isHomePage && !isScrolled 
                ? 'bg-white text-gray-900 hover:bg-gray-100 focus:ring-white' 
                : 'bg-blue-400 text-white hover:bg-blue-700 focus:ring-blue-500'
            ]"
          >
            Connexion
          </button>
        </div>

        <!-- Burger Menu Button (visible sur mobile/tablette) -->
        <div class="lg:hidden">
          <button
            @click="toggleMenu"
            :class="[
              'p-2 rounded-lg transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              isHomePage && !isScrolled 
                ? 'text-white focus:ring-white hover:bg-white/10' 
                : 'text-gray-900 focus:ring-blue-500 hover:bg-gray-100'
            ]"
            aria-label="Toggle menu"
          >
            <!-- Icône Burger / Close -->
            <svg 
              class="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300" 
              :class="{ 'rotate-90': isMenuOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                v-if="!isMenuOpen"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Mobile/Tablette (Dropdown) -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div 
        v-show="isMenuOpen" 
        class="lg:hidden bg-white border-t border-gray-200 shadow-lg"
      >
        <div class="px-4 py-3 space-y-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            @click="closeMenu"
            :class="[
              'block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200',
              'hover:bg-gray-100 hover:pl-6',
              isActive(link.path) 
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                : 'text-gray-900'
            ]"
          >
            {{ link.name }}
          </NuxtLink>

          <!-- Bouton Connexion Mobile -->
          <button 
            class="w-full mt-4 px-4 py-3 bg-blue-400 text-white rounded-lg font-semibold text-base
                   hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Connexion
          </button>
        </div>
      </div>
    </transition>

    <!-- Overlay pour fermer le menu en cliquant à l'extérieur (mobile) -->
    <transition
      enter-active-class="transition-opacity ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-show="isMenuOpen" 
        @click="closeMenu"
        class="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        aria-hidden="true"
      ></div>
    </transition>
  </nav>
</template>

<script setup>
const route = useRoute()

const isScrolled = ref(false)
const isMenuOpen = ref(false)

const navLinks = [
  { name: 'À propos', path: '/propos' },
  { name: 'Météo', path: '/meteo' },
  { name: 'Prévision', path: '/previsions' }
]

const isHomePage = computed(() => route.path === '/')

const isActive = (path) => {
  return route.path === path
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  
  // Empêcher le scroll du body quand le menu est ouvert
  if (process.client) {
    if (isMenuOpen.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  if (process.client) {
    document.body.style.overflow = ''
  }
}

// Fermer le menu lors du changement de route
watch(() => route.path, () => {
  closeMenu()
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (process.client) {
    document.body.style.overflow = '' // Cleanup
  }
})
</script>

<style scoped>
/* Assurer que la navbar est au-dessus de tout */
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

/* Smooth scroll pour les liens */
a {
  scroll-behavior: smooth;
}

/* Animation du menu mobile */
.lg\:hidden > div {
  position: relative;
  z-index: 50;
}

/* Empêcher le retour à la ligne des liens */
a {
  white-space: nowrap;
}

/* Style pour les liens actifs */
.router-link-active {
  position: relative;
}

/* Amélioration de l'accessibilité */
button:focus-visible,
a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>