
<template>
  <div>
    <Navbar />
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
    <Footer :weather="weather" />
  </div>
</template>



<script setup lang="ts">
import { ref, inject } from 'vue'
// On suppose que chaque page fournit la météo via provide('weather', ...)
const weather = inject('weather', null)
</script>