<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useHomeStore } from '@/stores/home'
import HeroSection from './home/HeroSection.vue'
import SearchSection from './home/SearchSection.vue'
import ServicesSection from './home/ServicesSection.vue'
import DestinationsSection from './home/DestinationsSection.vue'
import ToursSection from './home/ToursSection.vue'
import AboutSection from './home/AboutSection.vue'
import TestimonialsSection from './home/TestimonialsSection.vue'
import CtaSection from './home/CtaSection.vue'

const homeStore = useHomeStore()
const terminoBusqueda = ref('')

onMounted(async () => {
  await homeStore.cargarDatosHome()

  // Load main.js dynamically so jQuery initializes the carousel, height, and loader AFTER Vue renders the DOM.
  const script = document.createElement('script')
  script.src = '/js/main.js'
  script.async = true
  document.body.appendChild(script)
})

const paquetesMostrados = computed(() => {
  if (!terminoBusqueda.value) return homeStore.paquetes
  const q = terminoBusqueda.value.toLowerCase()
  return homeStore.paquetes.filter(
    (p) =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripción.toLowerCase().includes(q) ||
      p.destino?.nombre.toLowerCase().includes(q),
  )
})

function onBuscar(termino: string) {
  terminoBusqueda.value = termino
}
</script>

<template>
  <div>
    <HeroSection />
    <SearchSection @buscar="onBuscar" />
    <ServicesSection />
    <DestinationsSection :destinos="homeStore.destinos" :paquetes="homeStore.paquetes" :cargando="homeStore.cargando" />
    <ToursSection :paquetes="paquetesMostrados" :cargando="homeStore.cargando" />
    <AboutSection />
    <TestimonialsSection />
    <CtaSection />
  </div>
</template>

<style>
/* Any custom styles for homeview */
</style>
