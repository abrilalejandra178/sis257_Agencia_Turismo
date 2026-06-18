<script setup lang="ts">
import type { PaqueteTuristico } from '@/models/paquete-turistico'
import type { Destino } from '@/models/destino'

defineProps<{
  paquetes: PaqueteTuristico[]
  cargando: boolean
}>()

function imagenDestino(destino?: Destino) {
  return destino?.imagenes?.length ? destino.imagenes[0] : '/images/destination-default.jpg'
}
</script>

<template>
  <section class="ftco-section">
    <div class="container">
      <div class="row justify-content-center pb-4">
        <div class="col-md-12 heading-section text-center ftco-animate">
          <span class="subheading">Destinos</span>
          <h2 class="mb-4">Tours disponibles</h2>
        </div>
      </div>
      <div v-if="cargando" class="text-center py-5">Cargando tours...</div>
      <div v-else-if="paquetes.length === 0" class="text-center py-5">No se encontraron tours.</div>
      <div v-else class="row tours-row">
        <div v-for="paquete in paquetes.slice(0, 6)" :key="paquete.id" class="col-md-4 ftco-animate tour-col">
          <div class="project-wrap">
            <a href="#" class="img" :style="{ backgroundImage: 'url(' + imagenDestino(paquete.destino) + ')' }">
              <span class="price">Bs {{ Number(paquete.precio).toFixed(2) }}/persona</span>
            </a>
            <div class="text p-4">
              <span class="days">{{ paquete.duración }}</span>
              <h3><a href="#">{{ paquete.nombre }}</a></h3>
              <p class="location"><span class="fa fa-map-marker"></span> {{ paquete.destino?.nombre || 'Bolivia' }}</p>
              <ul>
                <li><span class="flaticon-mountains"></span> Capacidad: {{ paquete.capacidadMaxima }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tours-row {
  display: flex;
  flex-wrap: wrap;
}

.tour-col {
  display: flex;
}

.project-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.project-wrap .text {
  flex: 1;
}
</style>
