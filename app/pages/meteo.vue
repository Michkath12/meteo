<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Météo</h1>

    <input
      v-model="city"
      type="text"
      placeholder="Entrez une ville"
      class="border p-2 rounded mb-4"
    />

    <button @click="fetchWeather" class="bg-blue-500 text-white px-4 py-2 rounded">
      Chercher
    </button>

    <div v-if="weather" class="mt-6">
      <h2 class="text-xl font-semibold">{{ weather.name }}, {{ weather.sys.country }}</h2>
      <p>{{ weather.weather[0].description }}</p>
      <p>🌡 Température : {{ weather.main.temp }}°C</p>
      <p>💨 Vent : {{ weather.wind.speed }} m/s</p>
      <p>💧 Humidité : {{ weather.main.humidity }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWeather } from '~/composables/useWeather'

const city = ref('')
const weather = ref<any>(null)

const { getWeather } = useWeather()

const fetchWeather = async () => {
  if (!city.value) return
  const data = await getWeather(city.value)
  if (data) weather.value = data
}
</script>

<style scoped>

</style>
