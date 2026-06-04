<script setup lang="ts">
import type { Destino } from '@/models/destino'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'destinos'
const destinos = ref<Destino[]>([])
const emit = defineEmits(['edit'])
const destinoDelete = ref<Destino | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  destinos.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(destino: Destino) {
  emit('edit', destino)
}

function mostrarEliminarConfirm(destino: Destino) {
  destinoDelete.value = destino
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${destinoDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const destinosFiltrados = computed(() => {
  return destinos.value.filter(
    (destino) =>
      destino.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      destino.ubicación.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3 mb-4">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o ubicación" />
      </InputGroup>
    </div>

    <div class="cards-grid">
      <div v-for="destino in destinosFiltrados" :key="destino.id" class="tour-card">
        <div class="card-img-wrapper">
          <img v-if="destino.imagen" :src="destino.imagen" :alt="destino.nombre" class="card-img" />
          <div v-else class="card-img-placeholder">
            <i class="pi pi-map-marker"></i>
          </div>
          <div class="card-actions-overlay">
            <button class="action-btn edit-btn" @click="emitirEdicion(destino)" title="Editar">
              <i class="pi pi-pencil"></i>
            </button>
            <button
              class="action-btn delete-btn"
              @click="mostrarEliminarConfirm(destino)"
              title="Eliminar"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>

        <div class="card-body">
          <h3 class="card-title">{{ destino.nombre }}</h3>

          <div class="card-rating">
            <i class="pi pi-star-fill star"></i>
            <i class="pi pi-star-fill star"></i>
            <i class="pi pi-star-fill star"></i>
            <i class="pi pi-star-fill star"></i>
            <i class="pi pi-star star-empty"></i>
            <span class="rating-label">Rating</span>
          </div>

          <p class="card-desc">{{ destino.descripción }}</p>

          <div class="card-footer">
            <span class="card-location">
              <i class="pi pi-map-marker"></i> {{ destino.ubicación }}
            </span>
            <button class="btn-discover" @click="emitirEdicion(destino)">Ver más</button>
          </div>
        </div>
      </div>

      <div v-if="destinosFiltrados.length === 0" class="no-results">
        <i class="pi pi-search" style="font-size: 2rem; opacity: 0.4"></i>
        <p>No se encontraron resultados.</p>
      </div>
    </div>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" severity="danger" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem 0;
}
.tour-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.tour-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.card-img-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #e0e0e0;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.tour-card:hover .card-img {
  transform: scale(1.05);
}
.card-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0acaaa22, #13a19122);
  color: #13a191;
  font-size: 3rem;
}
.card-actions-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.tour-card:hover .card-actions-overlay {
  opacity: 1;
}
.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: background 0.2s;
}
.edit-btn {
  background: #fff;
  color: #13a191;
}
.edit-btn:hover {
  background: #0acaaa;
  color: #fff;
}
.delete-btn {
  background: #fff;
  color: #e53e3e;
}
.delete-btn:hover {
  background: #e53e3e;
  color: #fff;
}
.card-body {
  padding: 1rem 1.2rem;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 0.4rem;
}
.card-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 0.6rem;
}
.star {
  color: #f5a623;
  font-size: 0.85rem;
}
.star-empty {
  color: #ccc;
  font-size: 0.85rem;
}
.rating-label {
  font-size: 0.78rem;
  color: #999;
  margin-left: 6px;
}
.card-desc {
  font-size: 0.88rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f0f0f0;
  padding-top: 0.75rem;
}
.card-location {
  font-size: 0.82rem;
  color: #777;
  display: flex;
  align-items: center;
  gap: 4px;
}
.card-location .pi {
  color: #13a191;
}
.btn-discover {
  background: #13a191;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-discover:hover {
  background: #0acaaa;
}
.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #aaa;
}
</style>
