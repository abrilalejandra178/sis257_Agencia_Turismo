<script setup lang="ts">
import type { GuiaTuristico } from '@/models/guia-turistico'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'guias-turisticos'
const guias = ref<GuiaTuristico[]>([])
const emit = defineEmits(['edit'])
const guiaDelete = ref<GuiaTuristico | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  guias.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(guia: GuiaTuristico) {
  emit('edit', guia)
}

function mostrarEliminarConfirm(guia: GuiaTuristico) {
  guiaDelete.value = guia
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${guiaDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const guiasFiltrados = computed(() => {
  return guias.value.filter(
    (guia) =>
      guia.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      guia.apellido.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <!-- Buscador -->
    <div class="col-7 pl-0 mt-3 mb-4">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o apellido" />
      </InputGroup>
    </div>

    <!-- Grid de Cards -->
    <div class="cards-grid">
      <div v-for="guia in guiasFiltrados" :key="guia.id" class="guia-card">
        <!-- Avatar / Imagen -->
        <div class="card-img-wrapper">
          <img v-if="guia.imagen" :src="guia.imagen" :alt="guia.nombre" class="card-img" />
          <div v-else class="card-img-placeholder">
            <i class="pi pi-user"></i>
          </div>
          <!-- Botones flotantes -->
          <div class="card-actions-overlay">
            <button class="action-btn edit-btn" @click="emitirEdicion(guia)" title="Editar">
              <i class="pi pi-pencil"></i>
            </button>
            <button
              class="action-btn delete-btn"
              @click="mostrarEliminarConfirm(guia)"
              title="Eliminar"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
          <!-- Badge calificación -->
          <div class="card-badge"><i class="pi pi-star-fill"></i> {{ guia.calificación }}</div>
        </div>

        <!-- Cuerpo -->
        <div class="card-body">
          <h3 class="card-title">{{ guia.nombre }} {{ guia.apellido }}</h3>

          <!-- Estrellas visuales basadas en calificación -->
          <div class="card-rating">
            <i
              v-for="n in 5"
              :key="n"
              :class="
                n <= Math.round(guia.calificación)
                  ? 'pi pi-star-fill star'
                  : 'pi pi-star star-empty'
              "
            ></i>
            <span class="rating-label">{{ guia.calificación }} / 5</span>
          </div>

          <div class="card-info">
            <span class="info-item"> <i class="pi pi-phone"></i> {{ guia.teléfono }} </span>
            <span class="info-item"> <i class="pi pi-comments"></i> {{ guia.idioma }} </span>
          </div>

          <div class="card-footer">
            <span class="card-location"> <i class="pi pi-id-card"></i> Guía Turístico </span>
            <button class="btn-discover" @click="emitirEdicion(guia)">Ver más</button>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-if="guiasFiltrados.length === 0" class="no-results">
        <i class="pi pi-search" style="font-size: 2rem; opacity: 0.4"></i>
        <p>No se encontraron resultados.</p>
      </div>
    </div>

    <!-- Dialog confirmación eliminar -->
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
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem 0;
}

.guia-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.guia-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Imagen */
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

.guia-card:hover .card-img {
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
  font-size: 4rem;
}

/* Botones flotantes */
.card-actions-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.guia-card:hover .card-actions-overlay {
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

/* Badge calificación */
.card-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #13a191;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-badge .pi {
  font-size: 0.75rem;
  color: #f5a623;
}

/* Cuerpo */
.card-body {
  padding: 1rem 1.2rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 0.4rem;
}

/* Estrellas */
.card-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 0.75rem;
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

/* Info teléfono e idioma */
.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.info-item {
  font-size: 0.85rem;
  color: #555;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-item .pi {
  color: #13a191;
  font-size: 0.85rem;
}

/* Footer */
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
