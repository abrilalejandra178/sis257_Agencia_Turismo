<script setup lang="ts">
import type { PaqueteTuristico } from '@/models/paquete-turistico'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'paquetes-turisticos'
const paquetes = ref<PaqueteTuristico[]>([])
const emit = defineEmits(['edit'])
const paqueteDelete = ref<PaqueteTuristico | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  paquetes.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(paquete: PaqueteTuristico) {
  emit('edit', paquete)
}

function mostrarEliminarConfirm(paquete: PaqueteTuristico) {
  paqueteDelete.value = paquete
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${paqueteDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const paquetesFiltrados = computed(() => {
  return paquetes.value.filter(
    (paquete) =>
      paquete.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      paquete.destino?.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o destino" />
      </InputGroup>
    </div>
    <DataTable :value="paquetesFiltrados" paginator :rows="10" :rowsPerPageOptions="[5, 10, 25]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} a {last} de {totalRecords}" scrollable tableStyle="min-width: 60rem">
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text @click="obtenerLista" />
      </template>
      <Column field="id" header="#" sortable style="width: 60px" />
      <Column field="nombre" header="Nombre" sortable />
      <Column field="destino.nombre" header="Destino" sortable />
      <Column field="guia.nombre" header="Guía" sortable>
        <template #body="{ data }">{{ data.guia?.nombre }} {{ data.guia?.apellido }}</template>
      </Column>
      <Column field="transporte.tipo" header="Transporte" sortable />
      <Column field="precio" header="Precio" sortable>
        <template #body="{ data }">Bs {{ Number(data.precio).toFixed(2) }}</template>
      </Column>
      <Column field="duración" header="Duración" sortable />
      <Column field="capacidadMaxima" header="Capacidad" sortable style="width: 100px" />
      <Column field="incluyeHospedaje" header="Hospedaje" sortable>
        <template #body="{ data }">
          <span
            :class="!data.incluyeHospedaje || data.incluyeHospedaje?.toLowerCase() === 'no' || data.incluyeHospedaje?.toLowerCase() === 'ninguno' ? 'text-gray-400' : 'text-gray-800'">
            {{ data.incluyeHospedaje || 'Ninguno' }}
          </span>
        </template>
      </Column>
      <Column field="incluyeAlimentación" header="Alimentación" sortable>
        <template #body="{ data }">
          <span
            :class="!data.incluyeAlimentación || data.incluyeAlimentación === 'NINGUNA' ? 'text-gray-400' : 'text-gray-800'">
            {{data.incluyeAlimentación ? data.incluyeAlimentación.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c:
              string) =>
              c.toUpperCase()) : 'Ninguna' }}
          </span>
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
        <div class="p-4 text-center text-gray-500">No se encontraron paquetes.</div>
      </template>
    </DataTable>
    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <button type="button" class="app-btn app-btn-secondary" @click="mostrarConfirmDialog = false">Cancelar</button>
        <button type="button" class="app-btn app-btn-danger" @click="eliminar">Eliminar</button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
