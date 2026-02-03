<template>
  <footer class="weather-footer">
   
    <div class="footer-content">
      
      <!-- Section informations météo -->
      <div class="footer-section" v-if="weather">
        <div class="weather-info">
          <h3 class="section-title">
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Informations météo
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Ville :</span>
              <span class="info-value">{{ weather.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Température :</span>
              <span class="info-value">{{ Math.round(weather.main?.temp) }}°C</span>
            </div>
            <div class="info-item">
              <span class="info-label">Conditions :</span>
              <span class="info-value">{{ weather.weather?.[0]?.description }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Humidité :</span>
              <span class="info-value">{{ weather.main?.humidity }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section liens rapides -->
      <div class="footer-section">
        <h3 class="section-title">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Navigation
        </h3>
        <ul class="link-list">
          <li><a href="#" class="footer-link" @click.prevent="scrollToTop">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7"/>
            </svg>
            Haut de page
          </a></li>
          <li><a href="#" class="footer-link" @click.prevent="refreshWeather">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Actualiser
          </a></li>
          <li><a href="#" class="footer-link" @click.prevent="toggleUnits">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            °C / °F
          </a></li>
        </ul>
      </div>

      <!-- Section sources -->
      <div class="footer-section">
        <h3 class="section-title">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
          </svg>
          Sources
        </h3>
        <div class="source-info">
          <p class="text-sm mb-2 text-white">Données météorologiques fournies par</p>
          <div class="flex items-center space-x-3">
            <div class="api-badge">OpenWeatherMap</div>
            <div class="api-badge">API</div>
          </div>
        </div>
      </div>

      <!-- Section contact/social -->
      <div class="footer-section">
        <h3 class="section-title">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
          </svg>
          Contact
        </h3>
        <div class="contact-info">
          <p class="text-sm mb-3 text-white">Pour toute question ou suggestion :</p>
          <div class="flex space-x-3">
            <a href="mailto:contact@meteo-app.fr" class="contact-link">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </a>
            <a href="https://github.com" target="_blank" class="contact-link">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" class="contact-link">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

    </div>

    <!-- Barre du bas -->
    <div class="footer-bottom">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <div class="flex items-center">
              <svg class="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
              </svg>
              <span class="text-lg font-semibold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Météo<span class="font-bold">App</span>
              </span>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm">Heure locale : {{ currentTime }}</span>
            <span class="text-sm">|</span>
            <span class="text-sm">Dernière mise à jour : {{ lastUpdate }}</span>
          </div>
          
          <div class="mt-4 md:mt-0">
            <p class="text-xs text-gray-400">
              © {{ currentYear }} MétéoApp. Tous droits réservés.
              <span class="block md:inline">Données météorologiques mises à jour en temps réel.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface WeatherData {
  name: string
  main?: {
    temp: number
    humidity: number
  }
  weather?: Array<{
    description: string
  }>
}

const props = defineProps<{
  weather: WeatherData | null
}>()

const emit = defineEmits<{
  refresh: []
  toggleUnits: []
}>()

// Références
const currentTime = ref('')
const lastUpdate = ref('')
const currentYear = new Date().getFullYear()

// Fonctions
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const refreshWeather = () => {
  emit('refresh')
  lastUpdate.value = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toggleUnits = () => {
  emit('toggleUnits')
}

// Mettre à jour l'heure
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  // Initialiser l'heure
  updateTime()
  lastUpdate.value = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
  
  // Mettre à jour l'heure toutes les secondes
  const timer = setInterval(updateTime, 1000)
  
  onUnmounted(() => {
    clearInterval(timer)
  })
})
</script>

<style scoped>
.weather-footer {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.98));
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  margin-top: auto;
  position: relative;
  z-index: 20;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section {
  padding: 0 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.info-grid {
  display: grid;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
}

.link-list {
  list-style: none;
  padding: 0;
}

.link-list li {
  margin-bottom: 0.5rem;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  color: #4b5563;
  transition: all 0.2s;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.footer-link:hover {
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
  transform: translateX(4px);
}

.source-info {
  padding: 0.5rem 0;
}

.api-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #2563eb;
  background-color: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 9999px;
  transition: all 0.2s;
}

.api-badge:hover {
  background-color: rgba(37, 99, 235, 0.15);
  transform: translateY(-1px);
}

.contact-info {
  padding: 0.5rem 0;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  color: #6b7280;
  background-color: rgba(243, 244, 246, 0.8);
  transition: all 0.3s;
}

.contact-link:hover {
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px) scale(1.1);
}

.footer-bottom {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(147, 197, 253, 0.05));
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  padding: 1rem 0;
}

/* Animations */
.footer-link,
.contact-link,
.api-badge {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-section {
    padding: 0;
    border-bottom: 1px solid rgba(229, 231, 235, 0.5);
    padding-bottom: 1.5rem;
  }
  
  .footer-section:last-child {
    border-bottom: none;
  }
  
  .footer-bottom .container {
    text-align: center;
  }
  
  .footer-bottom .flex {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .weather-footer {
    background: linear-gradient(to bottom, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
    border-top: 1px solid rgba(51, 65, 85, 0.8);
  }
  
  .section-title {
    color: #f1f5f9;
  }
  
  .info-label {
    color: #94a3b8;
  }
  
  .info-value {
    color: #e2e8f0;
  }
  
  .footer-link {
    color: #cbd5e1;
  }
  
  .footer-link:hover {
    color: #60a5fa;
    background-color: rgba(96, 165, 250, 0.1);
  }
  
  .api-badge {
    color: #93c5fd;
    background-color: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.3);
  }
  
  .contact-link {
    color: #94a3b8;
    background-color: rgba(51, 65, 85, 0.8);
  }
  
  .contact-link:hover {
    color: #60a5fa;
    background-color: rgba(96, 165, 250, 0.2);
  }
  
  .footer-bottom {
    background: linear-gradient(to right, rgba(30, 58, 138, 0.1), rgba(30, 64, 175, 0.1));
    border-top: 1px solid rgba(51, 65, 85, 0.8);
  }
}
</style>