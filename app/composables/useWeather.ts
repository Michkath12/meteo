import axios from 'axios'

export const useWeather = () => {
  const config = useRuntimeConfig() // récupère la clé API

  const getWeather = async (city: string) => {
    console.log('apikey -----',config.openWeatherApiKey)
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            appid: '8d043095074d440b50496d98cf888ec9',
            units: 'metric', // pour avoir la température en °C
            lang: 'fr'       // pour les descriptions en français
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Erreur API météo:', error)
      return null
    }
  }

  return { getWeather }
}
