<script setup lang="ts">
import type { Destino } from '@/models/destino'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'destinos'
const destinos = ref<Destino[]>([])
const emit = defineEmits(['edit'])
const destinoDelete = ref<Destino | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')
const destinoGaleria = ref<Destino | null>(null)
const mostrarGaleria = ref(false)

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

function abrirGaleria(destino: Destino) {
  destinoGaleria.value = destino
  mostrarGaleria.value = true
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
    <div class="search-box">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o ubicación" />
      </InputGroup>
    </div>
    <DataTable
      :value="destinosFiltrados"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} a {last} de {totalRecords}"
      scrollable
      tableStyle="min-width: 50rem"
    >
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text @click="obtenerLista" />
      </template>
      <Column field="id" header="ID" sortable style="width: 80px" />
      <Column field="nombre" header="Nombre" sortable />
      <Column field="descripción" header="Descripción" sortable />
      <Column field="ubicación" header="Ubicación" sortable />
      <Column header="Imágenes" style="min-width: 150px">
        <template #body="{ data }">
          <div v-if="data.imagenes?.length" class="flex align-items-center gap-2">
            <img
              :src="data.imagenes[0]"
              alt="Destino"
              class="thumb-img"
              @click="abrirGaleria(data)"
            />
            <button
              v-if="data.imagenes.length > 1"
              class="app-btn app-btn-secondary badge-btn"
              title="Ver galería completa"
              @click="abrirGaleria(data)"
            >
              <i class="pi pi-images"></i>&nbsp;+{{ data.imagenes.length - 1 }}
            </button>
          </div>
          <span v-else class="text-gray-400">—</span>
        </template>
      </Column>
      <Column header="Acciones" style="min-width: 120px">
        <template #body="{ data }">
          <button class="app-btn app-btn-secondary" title="Editar" @click="emitirEdicion(data)">
            <i class="pi pi-pencil"></i>
          </button>
          <button class="app-btn app-btn-danger" title="Eliminar" @click="mostrarEliminarConfirm(data)">
            <i class="pi pi-trash"></i>
          </button>
        </template>
      </Column>
      <template #empty>
        <div class="p-4 text-center text-gray-500">No se encontraron destinos.</div>
      </template>
    </DataTable>

    <!-- Galería de imágenes -->
    <Dialog
      v-model:visible="mostrarGaleria"
      :header="(destinoGaleria?.nombre ?? '') + ' — Galería'"
      :style="{ width: '55rem' }"
      modal
    >
      <div v-if="destinoGaleria?.imagenes?.length" class="galeria-grid">
        <div v-for="(url, idx) in destinoGaleria.imagenes" :key="idx" class="galeria-item">
          <img :src="url" :alt="'Imagen ' + (idx + 1)" class="galeria-img" />
          <span class="galeria-num">{{ idx + 1 }}</span>
        </div>
      </div>
      <div v-else class="text-center text-gray-400 py-4">Sin imágenes disponibles.</div>
    </Dialog>

    <!-- Confirmar eliminación -->
    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <button type="button" class="app-btn app-btn-secondary" @click="mostrarConfirmDialog = false">Cancelar</button>
        <button type="button" class="app-btn app-btn-danger" @click="eliminar">Eliminar</button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.thumb-img {
  width: 64px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s;
}
.thumb-img:hover { transform: scale(1.08); }

.badge-btn {
  padding: 4px 8px;
  font-size: 0.75rem;
}

.galeria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  padding: 4px 0;
}

.galeria-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.galeria-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.galeria-img:hover { transform: scale(1.05); }

.galeria-num {
  position: absolute;
  bottom: 6px;
  right: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: 20px;
}
</style>
