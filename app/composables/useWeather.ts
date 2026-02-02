import axios from 'axios'

export const useWeather = () => {
  const config = useRuntimeConfig()

  // 🌆 Météo par ville 
  const getWeather = async (city: string) => {
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: city,
            appid: '8d043095074d440b50496d98cf888ec9',
            units: 'metric',
            lang: 'fr'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Erreur API météo (ville):', error)
      return null
    }
  }

  // 📍 Météo par position utilisateur (NOUVEAU)
  const getWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            lat,
            lon,
            appid: '8d043095074d440b50496d98cf888ec9',
            units: 'metric',
            lang: 'fr'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Erreur API météo (coords):', error)
      return null
    }
  }

  return {
    getWeather,
    getWeatherByCoords
  }
}
