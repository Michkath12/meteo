<template>
  <div class="relative w-full max-w-2xl mx-auto">
   
    <div class="relative">
      
      <!-- Search Input Container -->
      <div class="group relative flex items-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent focus-within:border-blue-500 focus-within:shadow-2xl overflow-hidden">
        
        <!-- Search Icon -->
        <div class="pl-5 pr-3">
          <svg 
            class="w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <!-- Input Field -->
        <input
          ref="searchInput"
          v-model="searchText"
          @input="handleSearchInput"
          @focus="showDropdown = true"
          type="text"
          :placeholder="placeholder"
          class="flex-1 py-4 px-2 outline-none text-gray-800 placeholder-gray-400 bg-transparent text-lg font-medium"
        />
        
        <!-- Clear Button -->
        <button
          v-if="searchText && !isSearching"
          @click="clearSelection"
          class="px-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          title="Effacer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Search Loading Indicator -->
        <div v-if="isSearching" class="px-4">
          <div class="relative">
            <div class="w-6 h-6 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
        
        <!-- Dropdown Arrow -->
        <button
          v-else
          @click="toggleDropdown"
          class="px-5 py-2 text-gray-400 hover:text-blue-500 transition-all duration-200 border-l-2 border-gray-100"
        >
          <svg 
            class="w-5 h-5 transition-transform duration-300" 
            :class="{ 'rotate-180': showDropdown }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <!-- Initial Loading State -->
      <transition name="fade">
        <div 
          v-if="loading" 
          class="absolute z-20 w-full mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          <div class="px-6 py-8 text-center">
            <div class="inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
            <p class="text-gray-600 font-medium">Chargement des données...</p>
          </div>
        </div>
      </transition>
      
      <!-- Dropdown with Suggestions -->
      <transition name="slide-fade">
        <div 
          v-if="showDropdown && !loading && filteredOptions.length > 0" 
          class="absolute z-20 w-full mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          <div class="max-h-96 overflow-y-auto custom-scrollbar">
            <div 
              v-for="(option, index) in filteredOptions" 
              :key="option.id"
              @click="selectOption(option)"
              class="group px-6 py-4 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-all duration-200"
              :class="{ 
                'bg-linear-to-r from-blue-50 to-indigo-50': selectedItem?.id === option.id,
                'animate-fade-in': index < 10
              }"
              :style="{ animationDelay: `${index * 30}ms` }"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-200">
                      {{ option.name }}
                    </h3>
                    <span 
                      v-if="selectedItem?.id === option.id"
                      class="inline-flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full"
                    >
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span v-if="option.state" class="font-medium">{{ option.state }}, </span>
                    <span>{{ option.country }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-xs text-gray-500">
                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg group-hover:bg-white transition-colors duration-200">
                      <span class="font-mono">{{ option.coord.lat.toFixed(4) }}°</span>
                    </span>
                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg group-hover:bg-white transition-colors duration-200">
                      <span class="font-mono">{{ option.coord.lon.toFixed(4) }}°</span>
                    </span>
                  </div>
                </div>
                <div class="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- No Results Message -->
      <transition name="fade">
        <div 
          v-if="showDropdown && !loading && !isSearching && searchText && filteredOptions.length === 0" 
          class="absolute z-20 w-full mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          <div class="px-6 py-8 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p class="text-gray-600 font-medium mb-1">Aucun résultat trouvé</p>
            <p class="text-gray-500 text-sm">pour "{{ searchText }}"</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Props
const props = defineProps({
  jsonUrl: {
    type: String,
    default: '/citylist.json'
  },
  placeholder: {
    type: String,
    default: 'Rechercher une ville...'
  },
  debounceDelay: {
    type: Number,
    default: 300
  },
  minSearchLength: {
    type: Number,
    default: 0
  }
})

// Émits
const emit = defineEmits(['select', 'search', 'clear'])

// Références
const searchInput = ref(null)
const searchText = ref('')
const showDropdown = ref(false)
const selectedItem = ref(null)
const cities = ref([])
const loading = ref(false)
const isSearching = ref(false)
const filteredOptions = ref([])
const debounceTimer = ref(null)

// Fonction pour normaliser le texte
const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// Fonction de filtrage asynchrone
const performAsyncFilter = async (searchTerm) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!searchTerm.trim()) {
        resolve(cities.value.slice(0, 50))
      } else {
        const normalizedSearch = normalizeText(searchTerm)
        const filtered = cities.value.filter(city => 
          normalizeText(city.name).includes(normalizedSearch) ||
          normalizeText(city.country).includes(normalizedSearch) ||
          (city.state && normalizeText(city.state).includes(normalizedSearch))
        )
        resolve(filtered.slice(0, 100))
      }
    }, 0) // Utiliser 0 pour permettre au thread principal de respirer
  })
}

// Fonction de debounce
const debouncedFilter = async (searchTerm) => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  if (props.minSearchLength > 0 && searchTerm.length > 0 && searchTerm.length < props.minSearchLength) {
    filteredOptions.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true

  debounceTimer.value = setTimeout(async () => {
    try {
      const results = await performAsyncFilter(searchTerm)
      filteredOptions.value = results
    } catch (error) {
      console.error('Erreur lors du filtrage:', error)
      filteredOptions.value = []
    } finally {
      isSearching.value = false
    }
  }, props.debounceDelay)
}

// Watcher
watch(searchText, (newValue) => {
  debouncedFilter(newValue)
})

// Chargement des données
const loadCities = async () => {
  loading.value = true
  try {
    const response = await fetch(props.jsonUrl)
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des données')
    }
    const data = await response.json()
    cities.value = Array.isArray(data) ? data : [data]
    filteredOptions.value = cities.value.slice(0, 50)
  } catch (error) {
    console.error('Erreur:', error)
    cities.value = []
    filteredOptions.value = []
  } finally {
    loading.value = false
  }
}

// Gestion de l'input
const handleSearchInput = () => {
  emit('search', searchText.value)
  showDropdown.value = true
}

// Sélection
const selectOption = (item) => {
  selectedItem.value = item
  searchText.value = item.name
  showDropdown.value = false
  emit('select', item)
}

// Toggle dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    searchInput.value?.focus()
  }
}

// Effacer
const clearSelection = () => {
  selectedItem.value = null
  searchText.value = ''
  filteredOptions.value = cities.value.slice(0, 50)
  emit('clear')
}

// Click outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showDropdown.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  loadCities()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})
</script>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
  opacity: 0;
}
</style>