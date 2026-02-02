export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  if (!query.q) {
    return []
  }

  const data = await $fetch(
    'https://api.openweathermap.org/geo/1.0/direct',
    {
      params: {
        q: query.q,
        limit: 5,
        appid: '8d043095074d440b50496d98cf888ec9'
      }
    }
  )

  return data
})
