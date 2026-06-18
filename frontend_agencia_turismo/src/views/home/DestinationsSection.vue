<script setup lang="ts">
import type { Destino } from '@/models/destino'
import type { PaqueteTuristico } from '@/models/paquete-turistico'
import { onMounted, onUnmounted, reactive } from 'vue'

const props = defineProps<{
  destinos: Destino[]
  paquetes: PaqueteTuristico[]
  cargando: boolean
}>()

// Track current image index per destino id
const currentIndexMap = reactive<Record<number, number>>({})
let intervalId: ReturnType<typeof setInterval> | null = null

function getIndex(id: number): number {
  return currentIndexMap[id] ?? 0
}

function navImagen(destino: Destino, dir: number) {
  const total = destino.imagenes?.length ?? 1
  const current = getIndex(destino.id)
  currentIndexMap[destino.id] = (current + dir + total) % total
}

function setIndex(destino: Destino, i: number) {
  currentIndexMap[destino.id] = i
}

function contarToursPorDestino(idDestino: number) {
  return props.paquetes.filter((p) => p.destino?.id === idDestino).length
}

onMounted(() => {
  // Auto-advance all multi-image destinos every 4 seconds
  intervalId = setInterval(() => {
    props.destinos.forEach((d) => {
      if ((d.imagenes?.length ?? 0) > 1) navImagen(d, 1)
    })
  }, 4000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <section id="destinos" class="ftco-section ftco-select-destination" style="background-color: #f8f9fa;">
    <div class="container">
      <div class="row justify-content-center pb-4">
        <div class="col-md-12 heading-section text-center">
          <span class="subheading">Lugares de Pacific</span>
          <h2 class="mb-4">Selecciona tu destino</h2>
        </div>
      </div>
    </div>
    <div class="container">
      <div v-if="cargando" class="text-center py-5">Cargando destinos...</div>
      <div v-else-if="destinos.length === 0" class="text-center py-5">No hay destinos disponibles.</div>
      <div v-else class="row">
        <div v-for="destino in destinos.slice(0, 8)" :key="destino.id" class="col-md-4 col-lg-3 mb-3">
          <div class="project-destination">
            <!-- Image slideshow: all stacked, only active is visible -->
            <div class="dest-imgs">
              <img
                v-for="(url, i) in (destino.imagenes?.length ? destino.imagenes : ['/images/destination-default.jpg'])"
                :key="i"
                :src="url"
                :alt="destino.nombre"
                :class="['dest-slide', { active: i === getIndex(destino.id) }]"
              />
            </div>

            <!-- Prev / Next arrows (only if multiple images) -->
            <template v-if="(destino.imagenes?.length ?? 0) > 1">
              <button class="dest-nav dest-prev" @click.prevent="navImagen(destino, -1)">
                <i class="pi pi-chevron-left"></i>
              </button>
              <button class="dest-nav dest-next" @click.prevent="navImagen(destino, 1)">
                <i class="pi pi-chevron-right"></i>
              </button>
              <!-- Dot indicators -->
              <div class="dest-dots">
                <span
                  v-for="(_, i) in destino.imagenes"
                  :key="i"
                  :class="['dest-dot', { active: i === getIndex(destino.id) }]"
                  @click="setIndex(destino, i)"
                />
              </div>
            </template>

            <!-- Name / tours overlay -->
            <div class="dest-text">
              <h3>{{ destino.nombre }}</h3>
              <span>{{ contarToursPorDestino(destino.id) }} Tours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ftco-select-destination {
  padding-top: 5rem;
  padding-bottom: 4rem;
}

.project-destination {
  position: relative;
  height: 250px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Image stack */
.dest-imgs {
  position: absolute;
  inset: 0;
}

.dest-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.7s ease;
}

.dest-slide.active {
  opacity: 1;
}

/* Navigation arrows */
.dest-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: background 0.2s;
}
.dest-nav:hover {
  background: rgba(0, 0, 0, 0.7);
}
.dest-prev { left: 8px; }
.dest-next { right: 8px; }

/* Dots */
.dest-dots {
  position: absolute;
  bottom: 38px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  z-index: 10;
}

.dest-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.dest-dot.active {
  background: #fff;
  transform: scale(1.35);
}

/* Text overlay */
.dest-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  padding: 12px 14px 10px;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
}

.dest-text h3 {
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 2px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
}

.dest-text span {
  color: rgba(255,255,255,0.85);
  font-size: 0.8rem;
}
</style>
