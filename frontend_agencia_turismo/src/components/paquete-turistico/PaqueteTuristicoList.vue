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
    <div class="col-9 pl-0 mt-3 mb-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o destino" />
      </InputGroup>
    </div>

    <div class="tabla-wrapper">
      <DataTable
        :value="paquetesFiltrados"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 25]"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} a {last} de {totalRecords}"
        scrollable
        tableStyle="min-width: 50rem"
        class="paquete-table"
      >
        <template #paginatorstart>
          <Button type="button" icon="pi pi-refresh" text @click="obtenerLista" />
        </template>
        <Column field="nombre" header="Nombre" sortable />
        <Column field="destino.nombre" header="Destino" sortable />
        <Column field="guia.nombre" header="Guía" sortable />
        <Column field="transporte.tipo" header="Transporte" sortable />
        <Column field="precio" header="Precio" sortable>
          <template #body="{ data }">{{ Number(data.precio).toFixed(2) }}</template>
        </Column>
        <Column field="duración" header="Duración" sortable />
        <Column field="capacidadMaxima" header="Capacidad" sortable />
        <Column header="Acciones" style="min-width: 120px">
          <template #body="{ data }">
            <Button
              icon="pi pi-pencil"
              aria-label="Editar"
              text
              class="btn-edit"
              @click="emitirEdicion(data)"
            />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              class="btn-delete"
              @click="mostrarEliminarConfirm(data)"
            />
          </template>
        </Column>
      </DataTable>
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
.tabla-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* Encabezado de columnas */
:deep(.p-datatable-thead > tr > th) {
  background-color: #35776f !important;
  color: #070707 !important;
  font-weight: 700;
  padding: 14px 16px;
  border: none !important;
}

/* Ícono de ordenamiento */
:deep(.p-datatable-thead > tr > th .p-sortable-column-icon) {
  color: #0c0c0c !important;
}

/* Filas */
:deep(.p-datatable-tbody > tr) {
  background-color: #444747 !important;
  color: #0c0a0a !important;
  transition: background-color 0.2s;
}

:deep(.p-datatable-tbody > tr:nth-child(even)) {
  background-color: #080808 !important;
}

:deep(.p-datatable-tbody > tr:hover) {
  background-color: #0b0c0c !important;
}

:deep(.p-datatable-tbody > tr > td) {
  padding: 12px 16px;
  border-bottom: 1px solid #0c0c0c !important;
  border-top: none !important;
}

/* Paginador */
:deep(.p-paginator) {
  background-color: #1d1d1d !important;
  border-top: 1px solid #d0eeea !important;
  padding: 10px 16px;
}

:deep(.p-paginator .p-paginator-page.p-highlight) {
  background-color: #13a191 !important;
  color: #202020 !important;
  border-radius: 6px;
}

:deep(.p-paginator .p-paginator-page:hover) {
  background-color: #0acaaa22 !important;
  border-radius: 6px;
}

:deep(.p-paginator .p-paginator-icon) {
  color: #13a191 !important;
}

/* Botones de acción */
:deep(.btn-edit .p-button-icon) {
  color: #13a191 !important;
}

:deep(.btn-delete .p-button-icon) {
  color: #e53e3e !important;
}
</style>
