<template>
  <div class="relative min-h-screen">
    <!-- 🌤 Background météo -->
    <Background :weather="weather" class="z-0 fixed inset-0" />

    <!-- 📦 Contenu -->
    <div class="relative z-10 p-4 md:p-8 pt-20 md:pt-24">

      <SearchBar
        @select="onCitySelected"
        placeholder="Rechercher une ville..."
        class="max-w-md mx-auto"
      />

      <div v-if="loading" class="mt-8 text-center">
        <p class="text-lg">📍 Chargement...</p>
      </div>

      <div v-if="error" class="mt-8 text-center">
        <p class="text-red-500 bg-red-50 p-4 rounded-lg inline-block">
          {{ error }}
        </p>
      </div>

      <div v-if="weather" class="mt-8">
        <!-- ✅ on passe le nom de la ville -->
        <WeatherCard
          :weather="weather"
          :city-name="selectedCity"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWeather } from '~/composables/useWeather'
import WeatherCard from '~/components/WeatherCard.vue'
import SearchBar from '~/components/SearchBar.vue'
import Background from '~/components/Background.vue'

const weather = ref<any>(null)
const loading = ref(true)
const error = ref('')
const selectedCity = ref<string | null>(null)

const { getWeather, getWeatherByCoords } = useWeather()

// 📍 météo automatique à l’arrivée
onMounted(() => {
  if (!navigator.geolocation) {
    error.value = "La géolocalisation n'est pas supportée"
    loading.value = false
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords
        const data = await getWeatherByCoords(latitude, longitude)
        if (data) {
          weather.value = data
          selectedCity.value = null // position actuelle
        }
      } catch {
        error.value = 'Erreur lors de la récupération des données météo'
      } finally {
        loading.value = false
      }
    },
    () => {
      error.value = 'Autorisation de localisation refusée'
      loading.value = false
    }
  )
})

// 🔍 recherche par ville
const onCitySelected = async (city: any) => {
  if (!city) return

  loading.value = true
  error.value = ''

  try {
    const data = await getWeather(city.name)
    if (data) {
      weather.value = data
      selectedCity.value = city.name // ✅ très important
    } else {
      error.value = 'Ville non trouvée'
    }
  } catch {
    error.value = 'Erreur lors de la recherche'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
.fixed {
  position: fixed;
}
.inset-0 {
  inset: 0;
}
</style>
