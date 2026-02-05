<template>
  <div class="weather-card-container">
    <!-- Header avec heure locale -->
    <div class="time-badge">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ localTime }}</span>
    </div>

    <!-- Carte principale -->
    <div class="weather-card">
      <!-- En-tête avec gradient -->
      <div class="weather-header">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h2 class="location-title">
              {{ weather?.name || 'Ville inconnue' }}
            </h2>
            <p class="location-country" v-if="weather?.sys?.country">
              <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ weather.sys.country }}
            </p>
          </div>
          
          <!-- Icône météo principale -->
          <div class="weather-icon-main" v-if="weather?.weather?.[0]?.main">
            <component :is="getWeatherIconComponent(weather.weather[0].main)" class="weather-svg-icon" />
          </div>
        </div>

        <!-- Température principale -->
        <div class="temperature-main" v-if="weather?.main">
          <div class="flex items-baseline gap-2">
            <span class="text-6xl font-bold text-gray-900">{{ Math.round(weather.main.temp) }}</span>
            <span class="text-3xl font-light text-gray-500">°C</span>
          </div>
          <p class="weather-description">{{ weather.weather?.[0]?.description || 'N/A' }}</p>
          <div class="feels-like">
            Ressenti {{ Math.round(weather.main.feels_like) }}°C
          </div>
        </div>
      </div>

      <!-- Séparateur -->
      <div class="divider"></div>

      <!-- Informations détaillées -->
      <div class="weather-details" v-if="weather?.main">
        <!-- Température Min/Max -->
        <div class="detail-card highlight">
          <div class="detail-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="detail-content">
            <p class="detail-label">Min / Max</p>
            <p class="detail-value">
              <span class="text-blue-600">{{ Math.round(weather.main.temp_min) }}°</span>
              <span class="mx-1 text-gray-400">/</span>
              <span class="text-red-600">{{ Math.round(weather.main.temp_max) }}°</span>
            </p>
          </div>
        </div>

        <!-- Vent -->
        <div class="detail-card" v-if="weather?.wind">
          <div class="detail-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div class="detail-content">
            <p class="detail-label">Vent</p>
            <p class="detail-value">{{ weather.wind.speed }} m/s</p>
            <p class="detail-sub" v-if="weather.wind?.deg !== undefined">{{ getWindDirection(weather.wind.deg) }}</p>
          </div>
        </div>

        <!-- Humidité -->
        <div class="detail-card" v-if="weather?.main?.humidity !== undefined">
          <div class="detail-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <div class="detail-content">
            <p class="detail-label">Humidité</p>
            <p class="detail-value">{{ weather.main.humidity }}%</p>
          </div>
        </div>

        <!-- Pression -->
        <div class="detail-card" v-if="weather?.main?.pressure !== undefined">
          <div class="detail-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="detail-content">
            <p class="detail-label">Pression</p>
            <p class="detail-value">{{ weather.main.pressure }} hPa</p>
          </div>
        </div>

        <!-- Visibilité -->
        <div class="detail-card" v-if="weather?.visibility">
          <div class="detail-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div class="detail-content">
            <p class="detail-label">Visibilité</p>
            <p class="detail-value">{{ (weather.visibility / 1000).toFixed(1) }} km</p>
          </div>
        </div>

        <!-- Nuages -->
        <div class="detail-card" v-if="weather?.clouds?.all !== undefined">
          <div class="detail-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <div class="detail-content">
            <p class="detail-label">Couverture</p>
            <p class="detail-value">{{ weather.clouds.all }}%</p>
          </div>
        </div>
      </div>

      <!-- Séparateur -->
      <div class="divider"></div>

      <!-- Lever/Coucher du soleil -->
      <div class="sun-times" v-if="weather?.sys">
        <div class="sun-card">
          <div class="sun-icon sunrise">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p class="sun-label">Lever du soleil</p>
            <p class="sun-time">{{ formatTime(weather.sys.sunrise) }}</p>
          </div>
        </div>

        <div class="sun-divider"></div>

        <div class="sun-card">
          <div class="sun-icon sunset">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <div>
            <p class="sun-label">Coucher du soleil</p>
            <p class="sun-time">{{ formatTime(weather.sys.sunset) }}</p>
          </div>
        </div>
      </div>

      <!-- Bouton Voir les Prévisions -->
      <div class="forecast-button-container">
        <NuxtLink 
          :to="{ path: '/previsions', query: { city: weather?.name } }" 
          class="forecast-button"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Voir les prévisions sur 5 jours</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

interface WeatherData {
  name: string
  dt: number
  timezone: number
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
  }>
  wind: {
    speed: number
    deg?: number
  }
  visibility?: number
  clouds?: {
    all: number
  }
}

const props = defineProps<{
  weather: WeatherData | null
}>()

const localTime = computed(() => {
  if (!props.weather?.dt || !props.weather?.timezone) return '--:--'
  
  const utcSeconds = props.weather.dt + props.weather.timezone
  const date = new Date(utcSeconds * 1000)

  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  })
})

// Fonction pour formater le temps
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

// Composants d'icônes SVG pour chaque type de météo
const SunIcon: Component = {
  template: `
    <svg class="w-20 h-20 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" class="animate-pulse"/>
      <path d="M12 1v6m0 10v6m11-11h-6m-10 0H1m17.66-5.66l-4.24 4.24M9.58 14.42l-4.24 4.24m12.02 0l-4.24-4.24M9.58 9.58L5.34 5.34"/>
    </svg>
  `
}

const CloudIcon: Component = {
  template: `
    <svg class="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  `
}

const RainIcon: Component = {
  template: `
    <svg class="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 19v2m4-2v2m4-2v2" class="animate-pulse"/>
    </svg>
  `
}

const ThunderstormIcon: Component = {
  template: `
    <svg class="w-20 h-20 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" fill="#eab308" d="M13 10l-3 6h3l-1 4 4-7h-3l1-3z" class="animate-pulse"/>
    </svg>
  `
}

const SnowIcon: Component = {
  template: `
    <svg class="w-20 h-20 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
      <circle cx="8" cy="19" r="0.5" fill="currentColor" class="animate-bounce"/>
      <circle cx="12" cy="20" r="0.5" fill="currentColor" class="animate-bounce" style="animation-delay: 0.1s"/>
      <circle cx="16" cy="19" r="0.5" fill="currentColor" class="animate-bounce" style="animation-delay: 0.2s"/>
    </svg>
  `
}

const MistIcon: Component = {
  template: `
    <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 8h12M4 12h16M4 16h10" opacity="0.6"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 10h14M4 14h12" opacity="0.4"/>
    </svg>
  `
}

const DrizzleIcon: Component = {
  template: `
    <svg class="w-20 h-20 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 19v1m4-1v1m4-1v1" class="animate-pulse" opacity="0.7"/>
    </svg>
  `
}

// Fonction pour obtenir le bon composant d'icône
const getWeatherIconComponent = (condition?: string) => {
  if (!condition) return CloudIcon
  
  const iconMap: Record<string, Component> = {
    'Clear': SunIcon,
    'Clouds': CloudIcon,
    'Rain': RainIcon,
    'Drizzle': DrizzleIcon,
    'Thunderstorm': ThunderstormIcon,
    'Snow': SnowIcon,
    'Mist': MistIcon,
    'Smoke': MistIcon,
    'Haze': MistIcon,
    'Dust': MistIcon,
    'Fog': MistIcon,
    'Sand': MistIcon,
    'Ash': MistIcon,
  }
  
  return iconMap[condition] || CloudIcon
}

// Obtenir la direction du vent
const getWindDirection = (deg?: number): string => {
  if (deg === undefined) return ''
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  const index = Math.round(deg / 45) % 8
  return directions[index] || 'N'
}
</script>

<style scoped>
.weather-card-container {
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
}

.time-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border-radius: 9999px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
}

.weather-card {
  background: linear-gradient(to bottom right, #ffffff, #f9fafb);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 1.5rem;
  overflow: hidden;
  border: 1px solid #f3f4f6;
  transition: all 0.3s;
}

.weather-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
}

.weather-header {
  padding: 2rem;
  background: linear-gradient(to bottom right, #eff6ff, #e0e7ff);
}

.location-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.location-country {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.weather-icon-main {
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.weather-svg-icon {
  display: block;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.temperature-main {
  margin-top: 1.5rem;
}

.weather-description {
  font-size: 1.125rem;
  color: #374151;
  text-transform: capitalize;
  margin-top: 0.5rem;
  font-weight: 500;
}

.feels-like {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.75rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  color: #4b5563;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e5e7eb, transparent);
  margin: 1.5rem 0;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 0 2rem 1.5rem;
}

.detail-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #f3f4f6;
  transition: all 0.2s;
}

.detail-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-color: #bfdbfe;
  transform: translateY(-0.25rem);
}

.detail-card.highlight {
  background: linear-gradient(to bottom right, #eff6ff, #e0e7ff);
  border-color: #bfdbfe;
}

.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(to bottom right, #3b82f6, #4f46e5);
  color: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.detail-content {
  flex: 1;
  min-width: 0;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
}

.detail-sub {
  font-size: 0.75rem;
  color: #4b5563;
  margin-top: 0.125rem;
}

.sun-times {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0 2rem 2rem;
}

.sun-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.sun-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.sun-icon.sunrise {
  background: linear-gradient(to bottom right, #fb923c, #eab308);
  color: #ffffff;
}

.sun-icon.sunset {
  background: linear-gradient(to bottom right, #a855f7, #ec4899);
  color: #ffffff;
}

.sun-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.sun-time {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.sun-divider {
  width: 1px;
  height: 3rem;
  background: linear-gradient(to bottom, transparent, #d1d5db, transparent);
}

/* Bouton Prévisions */
.forecast-button-container {
  padding: 0 2rem 2rem;
}

.forecast-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  text-decoration: none;
}

.forecast-button:hover {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.forecast-button:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 1024px) {
  .weather-details {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .weather-details {
    grid-template-columns: 1fr;
  }
  
  .location-title {
    font-size: 1.5rem;
  }
  
  .weather-header {
    padding: 1.5rem;
  }
  
  .weather-details,
  .sun-times {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .forecast-button-container {
    padding: 0 1.5rem 1.5rem;
  }
  
  .forecast-button {
    font-size: 0.9rem;
    padding: 0.875rem 1.25rem;
  }
}
</style>