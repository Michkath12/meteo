<template>
  <div class="relative max-w-md mx-auto">
    <input
      v-model="search"
      type="text"
      placeholder="Rechercher une ville"
      class="w-full p-3 border rounded-lg"
    />

    <ul
      v-if="results.length"
      class="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow"
    >
      <li
        v-for="(city, index) in results"
        :key="index"
        class="p-2 hover:bg-gray-100 cursor-pointer"
        @click="selectCity(city)"
      >
        {{ city.name }}, {{ city.country }}
      </li>
    </ul>
  </div>
</template>


<script setup>
import { ref, watch } from 'vue'

const search = ref('')
const results = ref([])
let timeout = null

const selectCity = (city) => {
  search.value = `${city.name}, ${city.country}`
  results.value = []
}

watch(search, (value) => {
  if (timeout) clearTimeout(timeout)

  if (value.length < 2) {
    results.value = []
    return
  }

  timeout = setTimeout(async () => {
    try {
      const data = await $fetch('~/api/geocoding', {
        query: { q: value }
      })

      results.value = data || []
    } catch (e) {
      results.value = []
    }
  }, 400)
})
</script>

