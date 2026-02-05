<template>
  <div class="forecast-container">
    <!-- Header -->
    <div class="forecast-header">
      <div class="header-icon">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="header-title">Prévisions sur 5 jours</h3>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des prévisions...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="dailyForecasts.length > 0" class="forecast-grid">
      <div
        v-for="(day, index) in dailyForecasts"
        :key="day.date"
        class="forecast-card"
        :style="{ animationDelay: `${index * 80}ms` }"
      >
        <div class="card-header">
          <div class="date-wrapper">
            <span class="day-name">{{ day.dayName }}</span>
            <span class="date-number">{{ day.dateFormatted }}</span>
          </div>
        </div>

        <div class="weather-icon-container">
          <component :is="getWeatherIconComponent(day.condition)" class="weather-icon" />
        </div>

        <div class="temperature-section">
          <div class="temp-main">
            <span class="temp-value">{{ Math.round(day.temp) }}</span>
            <span class="temp-unit">°C</span>
          </div>
          <div class="temp-range">
            <span class="temp-min">{{ Math.round(day.tempMin) }}°</span>
            <span class="temp-separator">/</span>
            <span class="temp-max">{{ Math.round(day.tempMax) }}°</span>
          </div>
        </div>

        <p class="weather-description">{{ day.description }}</p>

        <div class="additional-info">
          <div class="info-item">
            <span>{{ Math.round(day.humidity) }}%</span>
          </div>
          <div class="info-item">
            <span>{{ day.windSpeed.toFixed(1) }} m/s</span>
          </div>
          <div v-if="day.pop !== undefined" class="info-item">
            <span>{{ Math.round(day.pop * 100) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>Aucune prévision disponible</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'

interface DailyForecast {
  date: string
  dayName: string
  dateFormatted: string
  temp: number
  tempMin: number
  tempMax: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  pop?: number
}

const props = defineProps<{
  cityName?: string
  lat?: number
  lon?: number
}>()

const loading = ref(false)
const error = ref('')
const forecastData = ref<any>(null)

/* ───────── FETCH FORECAST ───────── */
async function fetchForecast() {
  if (!props.cityName && (props.lat == null || props.lon == null)) {
    error.value = 'Veuillez fournir un nom de ville ou des coordonnées'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const params: any = {
      appid: '8d043095074d440b50496d98cf888ec9',
      units: 'metric',
      lang: 'fr'
    }

    if (props.cityName) {
      params.q = props.cityName
    } else {
      params.lat = props.lat
      params.lon = props.lon
    }

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/forecast',
      { params }
    )

    forecastData.value = response.data
  } catch (err) {
    error.value = 'Impossible de charger les prévisions'
  } finally {
    loading.value = false
  }
}

/* ───────── COMPUTED 5 DAYS ───────── */
const dailyForecasts = computed<DailyForecast[]>(() => {
  if (!forecastData.value?.list) return []

  const daysMap = new Map<string, any[]>()

  forecastData.value.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0]
    if (!daysMap.has(date)) daysMap.set(date, [])
    daysMap.get(date)!.push(item)
  })

  return Array.from(daysMap.entries())
    .slice(0, 5)
    .map(([date, items]) => {
      const temps = items.map(i => i.main.temp)
      const dateObj = new Date(date)

      return {
        date,
        dayName: dateObj.toLocaleDateString('fr-FR', { weekday: 'long' }),
        dateFormatted: dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        temp: temps.reduce((a, b) => a + b, 0) / temps.length,
        tempMin: Math.min(...temps),
        tempMax: Math.max(...temps),
        condition: items[0].weather[0].main,
        description: items[0].weather[0].description,
        humidity: items[0].main.humidity,
        windSpeed: items[0].wind.speed,
        pop: items[0].pop
      }
    })
})

/* ───────── ICON HELPER ───────── */
function getWeatherIconComponent(condition: string) {
  return 'div' // placeholder (tu peux brancher tes icônes ici)
}

/* ───────── WATCH ───────── */
watch(
  () => [props.cityName, props.lat, props.lon],
  fetchForecast,
  { immediate: true }
)
</script>

<style scoped>
.forecast-container {
  max-width: 90rem;
  margin: 2rem auto;
  padding: 0 1rem;
}

/* Header */
.forecast-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border-radius: 0.75rem;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

/* Loading / Error / Empty states */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #6b7280;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.error-state {
  color: #dc2626;
}

/* Forecast grid */
.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

/* Forecast card */
.forecast-card {
  background: linear-gradient(to bottom right, #ffffff, #f9fafb);
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  animation: slideUp 0.5s ease-out backwards;
  position: relative;
  overflow: hidden;
}

.forecast-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.forecast-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.forecast-card:hover::before {
  opacity: 1;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Card header */
.card-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.date-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.day-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  text-transform: capitalize;
}

.date-number {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: capitalize;
}

/* Weather icon */
.weather-icon-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.weather-icon {
  width: 5rem;
  height: 5rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

/* Temperature */
.temperature-section {
  text-align: center;
  margin: 1rem 0;
}

.temp-main {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.temp-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.temp-unit {
  font-size: 1.25rem;
  font-weight: 400;
  color: #6b7280;
  margin-top: 0.25rem;
}

.temp-range {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.temp-min {
  color: #3b82f6;
  font-weight: 600;
}

.temp-separator {
  color: #d1d5db;
}

.temp-max {
  color: #ef4444;
  font-weight: 600;
}

/* Description */
.weather-description {
  text-align: center;
  font-size: 0.95rem;
  color: #4b5563;
  text-transform: capitalize;
  margin: 1rem 0;
  font-weight: 500;
}

/* Additional info */
.additional-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 1024px) {
  .forecast-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 640px) {
  .forecast-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .forecast-card {
    padding: 1.25rem;
  }

  .header-title {
    font-size: 1.25rem;
  }

  .temp-value {
    font-size: 2rem;
  }
}
</style>