<template>
  <Background :weather="weather" class="z-0 fixed inset-0" />
  <SearchBar class="mt-40" @select="handleCitySelect" :search-text="cityName || ''" />
  <div class="p-6 pt-24">
    <PrevisionCards
      v-if="cityName"
      :city-name="cityName"
    />
    <PrevisionCards
      v-else-if="lat !== null && lon !== null"
      :lat="lat"
      :lon="lon"
    />
    <p v-else class="text-center text-gray-500">
      Aucune ville ou localisation fournie pour les prévisions
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, provide } from 'vue'
import { useRoute, useRouter } from '#imports'
import PrevisionCards from '~/components/PrevisionCards.vue'
import Background from '~/components/Background.vue'
import { useWeather } from '~/composables/useWeather'

const route = useRoute()
const router = useRouter()
const cityName = ref<string | null>(null)
const lat = ref<number|null>(null)
const lon = ref<number|null>(null)
const weather = ref<any>(null)
const { getWeather, getWeatherByCoords } = useWeather()

async function updateWeather() {
  if (cityName.value) {
    weather.value = await getWeather(cityName.value)
  } else if (lat.value !== null && lon.value !== null) {
    weather.value = await getWeatherByCoords(lat.value, lon.value)
  } else {
    weather.value = null
  }
  provide('weather', weather.value)
}

onMounted(() => {
  const city = route.query.city
  if (typeof city === 'string') {
    cityName.value = city
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        lat.value = position.coords.latitude
        lon.value = position.coords.longitude
      },
      () => {
        // Erreur ou refus de géolocalisation
      }
    )
  }
})

watch([cityName, lat, lon], updateWeather, { immediate: true })

function handleCitySelect(city: any) {
  cityName.value = city.name
  lat.value = null
  lon.value = null
  router.replace({ query: { ...route.query, city: city.name } })
}
</script>


