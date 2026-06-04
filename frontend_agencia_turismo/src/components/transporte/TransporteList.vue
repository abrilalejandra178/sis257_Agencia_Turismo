<script setup lang="ts">
import type { Transporte } from '@/models/transporte'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'transportes'
const transportes = ref<Transporte[]>([])
const emit = defineEmits(['edit'])
const transporteDelete = ref<Transporte | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  transportes.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(transporte: Transporte) {
  emit('edit', transporte)
}

function mostrarEliminarConfirm(transporte: Transporte) {
  transporteDelete.value = transporte
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${transporteDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

// Ícono según tipo de transporte
function iconoTipo(tipo: string): string {
  const t = tipo.toLowerCase()
  if (t.includes('bus') || t.includes('autobus')) return 'pi pi-send'
  if (t.includes('avion') || t.includes('aéreo') || t.includes('aereo')) return 'pi pi-send'
  if (t.includes('barco') || t.includes('lancha') || t.includes('ferry')) return 'pi pi-send'
  if (t.includes('tren')) return 'pi pi-send'
  if (t.includes('auto') || t.includes('carro') || t.includes('taxi')) return 'pi pi-car'
  return 'pi pi-truck'
}

const transportesFiltrados = computed(() => {
  return transportes.value.filter(
    (transporte) =>
      transporte.tipo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      transporte.empresa.toLowerCase().includes(busqueda.value.toLowerCase()),
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por tipo o empresa" />
      </InputGroup>
    </div>

    <!-- Grid de Cards -->
    <div class="cards-grid">
      <div v-for="transporte in transportesFiltrados" :key="transporte.id" class="transporte-card">
        <!-- Imagen / Placeholder -->
        <div class="card-img-wrapper">
          <img
            v-if="transporte.imagen"
            :src="transporte.imagen"
            :alt="transporte.tipo"
            class="card-img"
          />
          <div v-else class="card-img-placeholder">
            <i :class="iconoTipo(transporte.tipo)"></i>
          </div>
          <!-- Botones flotantes -->
          <div class="card-actions-overlay">
            <button class="action-btn edit-btn" @click="emitirEdicion(transporte)" title="Editar">
              <i class="pi pi-pencil"></i>
            </button>
            <button
              class="action-btn delete-btn"
              @click="mostrarEliminarConfirm(transporte)"
              title="Eliminar"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
          <!-- Badge tipo -->
          <div class="card-badge">
            <i :class="iconoTipo(transporte.tipo)"></i> {{ transporte.tipo }}
          </div>
        </div>

        <!-- Cuerpo -->
        <div class="card-body">
          <h3 class="card-title">{{ transporte.empresa }}</h3>

          <p class="card-desc">{{ transporte.descripcion }}</p>

          <div class="card-footer">
            <span class="card-location">
              <i class="pi pi-building"></i> {{ transporte.empresa }}
            </span>
            <button class="btn-discover" @click="emitirEdicion(transporte)">Ver más</button>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-if="transportesFiltrados.length === 0" class="no-results">
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

.transporte-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.transporte-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-img-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
  background: #e0e0e0;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.transporte-card:hover .card-img {
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

.card-actions-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.transporte-card:hover .card-actions-overlay {
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
  gap: 5px;
}

.card-body {
  padding: 1rem 1.2rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 0.5rem;
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
