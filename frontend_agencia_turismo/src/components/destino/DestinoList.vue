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

// CAMBIO (requisito #1): estado para mostrar la galería de imágenes de un destino
const mostrarGaleria = ref<boolean>(false)
const destinoGaleria = ref<Destino | null>(null)

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

function abrirGaleria(destino: Destino) {
  destinoGaleria.value = destino
  mostrarGaleria.value = true
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
    <div class="mb-4">
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
      <Column header="Imágenes" sortable>
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <img v-if="data.imagen" :src="data.imagen" alt="Destino" style="width:80px;height:60px;object-fit:cover;border-radius:4px;" />
            <span v-else class="text-gray-400">—</span>
            <Button
              v-if="data.imagenes?.length"
              type="button"
              :label="`+${data.imagenes.length} foto${data.imagenes.length > 1 ? 's' : ''}`"
              icon="pi pi-images"
              text
              size="small"
              @click="abrirGaleria(data)"
            />
          </div>

        </template>
      </Column>
      <Column header="Acciones" style="min-width: 120px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
          <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(data)" />
        </template>
      </Column>
      <template #empty>
        <div class="p-4 text-center text-gray-500">No se encontraron destinos.</div>
      </template>
    </DataTable>
    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>

    <!-- CAMBIO (requisito #1): galería con todas las imágenes del destino -->
    <Dialog v-model:visible="mostrarGaleria" :header="`Galería: ${destinoGaleria?.nombre ?? ''}`" :style="{ width: '40rem' }">
      <div class="flex flex-wrap gap-3">
        <img
          v-if="destinoGaleria?.imagen"
          :src="destinoGaleria.imagen"
          alt="Imagen principal"
          style="width:160px;height:120px;object-fit:cover;border-radius:6px;"
        />
        <img
          v-for="img in destinoGaleria?.imagenes ?? []"
          :key="img.id ?? img.url"
          :src="img.url"
          alt="Imagen del destino"
          style="width:160px;height:120px;object-fit:cover;border-radius:6px;"
        />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
