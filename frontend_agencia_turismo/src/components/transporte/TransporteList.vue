<script setup lang="ts">
import type { Transporte } from '@/models/transporte'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
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
    <div class="search-box">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por tipo o empresa" />
      </InputGroup>
    </div>
    <DataTable
      :value="transportesFiltrados"
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
      <Column field="tipo" header="Tipo" sortable />
      <Column field="empresa" header="Empresa" sortable />
      <Column field="descripcion" header="Descripción" sortable />
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
        <div class="p-4 text-center text-gray-500">No se encontraron transportes.</div>
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
