<template>
  <div class="relative w-full">
   
    <div class="relative">
      
      <div class="flex items-center border border-gray-300 rounded-lg bg-white">
        
        <div class="pl-3 pr-2">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        
        <input
          ref="searchInput"
          v-model="searchText"
          @input="handleSearchInput"
          @focus="showDropdown = true"
          type="text"
          :placeholder="placeholder"
          class="w-full py-3 px-2 outline-none text-gray-700 placeholder-gray-400"
        />
        
        <!-- Indicateur de recherche en cours -->
        <div v-if="isSearching" class="pr-3 pl-2">
          <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <!-- Flèche du select -->
        <button
          v-else
          @click="toggleDropdown"
          class="pr-3 pl-2 border-l border-gray-300 text-gray-400 hover:text-gray-600"
        >
          <svg 
            class="w-5 h-5 transition-transform duration-200" 
            :class="{ 'rotate-180': showDropdown }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <!-- Loading indicator initial -->
      <div 
        v-if="loading" 
        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
      >
        <div class="px-4 py-3 text-gray-500 text-center">
          Chargement des données...
        </div>
      </div>
      
      <!-- Dropdown avec suggestions -->
      <div 
        v-if="showDropdown && !loading && filteredOptions.length > 0" 
        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      >
        <div 
          v-for="option in filteredOptions" 
          :key="option.id"
          @click="selectOption(option)"
          class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
          :class="{ 'bg-blue-50': selectedItem?.id === option.id }"
        >
          <div class="font-medium text-gray-900">{{ option.name }}</div>
          <div class="text-sm text-gray-600">
            <span v-if="option.state">{{ option.state }}, </span>
            <span>{{ option.country }}</span>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            Lat: {{ option.coord.lat.toFixed(4) }}, Lon: {{ option.coord.lon.toFixed(4) }}
          </div>
        </div>
      </div>
      
      <!-- Message si aucun résultat -->
      <div 
        v-if="showDropdown && !loading && !isSearching && searchText && filteredOptions.length === 0" 
        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
      >
        <div class="px-4 py-3 text-gray-500 text-center">
          Aucun résultat pour "{{ searchText }}"
        </div>
      </div>
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
    default: 300 // Délai en millisecondes avant de lancer la recherche
  },
  minSearchLength: {
    type: Number,
    default: 0 // Nombre minimum de caractères avant de filtrer (0 = pas de minimum)
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

// Fonction pour normaliser le texte (enlever les accents)
const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// Fonction de filtrage asynchrone
const performAsyncFilter = async (searchTerm) => {
  return new Promise((resolve) => {
    // Simuler un traitement asynchrone (utile pour de grandes listes)
    setTimeout(() => {
      if (!searchTerm.trim()) {
        // Si pas de recherche, retourner les 50 premiers
        resolve(cities.value.slice(0, 50))
      } else {
        const normalizedSearch = normalizeText(searchTerm)
        const filtered = cities.value.filter(city => 
          normalizeText(city.name).includes(normalizedSearch) ||
          normalizeText(city.country).includes(normalizedSearch) ||
          (city.state && normalizeText(city.state).includes(normalizedSearch))
        )
        // Limiter les résultats pour les performances
        resolve(filtered.slice(0, 100))
      }
    }, 0) // Utiliser 0 pour permettre au thread principal de respirer
  })
}

// Fonction de debounce pour le filtrage
const debouncedFilter = async (searchTerm) => {
  // Annuler le timer précédent s'il existe
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  // Vérifier la longueur minimale de recherche
  if (props.minSearchLength > 0 && searchTerm.length > 0 && searchTerm.length < props.minSearchLength) {
    filteredOptions.value = []
    isSearching.value = false
    return
  }

  // Indiquer que la recherche est en cours
  isSearching.value = true

  // Créer un nouveau timer
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

// Watcher pour le texte de recherche
watch(searchText, (newValue) => {
  debouncedFilter(newValue)
})

// Chargement des données JSON
const loadCities = async () => {
  loading.value = true
  try {
    const response = await fetch(props.jsonUrl)
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des données')
    }
    const data = await response.json()
    cities.value = Array.isArray(data) ? data : [data]
    
    // Initialiser les options filtrées avec les premières villes
    filteredOptions.value = cities.value.slice(0, 50)
  } catch (error) {
    console.error('Erreur:', error)
    cities.value = []
    filteredOptions.value = []
  } finally {
    loading.value = false
  }
}

// Gestion de l'input de recherche
const handleSearchInput = () => {
  emit('search', searchText.value)
  showDropdown.value = true
}

// Sélection d'une option
const selectOption = (item) => {
  selectedItem.value = item
  searchText.value = item.name
  showDropdown.value = false
  emit('select', item)
}

// Toggle du dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    searchInput.value?.focus()
  }
}

// Effacer la sélection
const clearSelection = () => {
  selectedItem.value = null
  searchText.value = ''
  emit('clear')
}

// Fermer le dropdown en cliquant à l'extérieur
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showDropdown.value = false
  }
}

// Écouteur d'événement pour clic extérieur
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  loadCities()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  // Nettoyer le timer si le composant est démonté
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})
</script>