<template>
  <div class="p-8 mt-20">
    <SearchBar @select="onCitySelected" placeholder="Rechercher une ville..." />

    <p v-if="loading" class="mt-6">📍 Localisation en cours...</p>
    <p v-if="error" class="mt-6 text-red-500">{{ error }}</p>

    <div v-if="weather" class="mt-6">
      <WeatherCard :weather="weather" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWeather } from '~/composables/useWeather'
import WeatherCard from '~/components/WeatherCard.vue'
import SearchBar from '~/components/SearchBar.vue'

const weather = ref<any>(null)
const loading = ref(true)
const error = ref('')

const { getWeather, getWeatherByCoords } = useWeather()

// 📍 Météo automatique à l’arrivée
onMounted(() => {
  if (!navigator.geolocation) {
    error.value = 'La géolocalisation n’est pas supportée'
    loading.value = false
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      const data = await getWeatherByCoords(latitude, longitude)
      if (data) weather.value = data
      loading.value = false
    },
    () => {
      error.value = 'Autorisation de localisation refusée'
      loading.value = false
    }
  )
})

// 🔍 Recherche par ville
const onCitySelected = async (city: any) => {
  if (!city) return
  loading.value = true
  const data = await getWeather(city.name)
  if (data) weather.value = data
  loading.value = false
}
</script>
