<script setup lang="ts">
import type { Reserva } from '@/models/reserva'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'reservas'
const reservas = ref<Reserva[]>([])
const emit = defineEmits(['edit'])
const reservaDelete = ref<Reserva | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  reservas.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(reserva: Reserva) {
  emit('edit', reserva)
}

function mostrarEliminarConfirm(reserva: Reserva) {
  reservaDelete.value = reserva
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${reservaDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const reservasFiltradas = computed(() => {
  return reservas.value.filter(
    (reserva) =>
      reserva.estado.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      reserva.usuario?.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por estado o usuario" />
      </InputGroup>
    </div>

    <div class="tabla-wrapper">
      <DataTable
        :value="reservasFiltradas"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 25]"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} a {last} de {totalRecords}"
        scrollable
        tableStyle="min-width: 50rem"
        class="reserva-table"
      >
        <template #paginatorstart>
          <Button type="button" icon="pi pi-refresh" text @click="obtenerLista" />
        </template>
        <Column field="usuario.nombre" header="Usuario" sortable />
        <Column field="paquetesTuristicos.nombre" header="Paquete" sortable />
        <Column field="fechaReserva" header="Fecha Reserva" sortable />
        <Column field="cantidadPersonas" header="Personas" sortable />
        <Column field="total" header="Total" sortable>
          <template #body="{ data }">{{ Number(data.total).toFixed(2) }}</template>
        </Column>
        <Column field="estado" header="Estado" sortable>
          <template #body="{ data }">
            <span :class="['estado-badge', `estado-${data.estado.toLowerCase()}`]">
              {{ data.estado }}
            </span>
          </template>
        </Column>
        <Column header="Acciones" style="min-width: 120px">
          <template #body="{ data }">
            <Button icon="pi pi-pencil" aria-label="Editar" text class="btn-edit" @click="emitirEdicion(data)" />
            <Button icon="pi pi-trash" aria-label="Eliminar" text class="btn-delete" @click="mostrarEliminarConfirm(data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
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

:deep(.p-datatable-thead > tr > th) {
  background-color: #1a7066 !important;
  color: #070606 !important;
  font-weight: 700;
  padding: 14px 16px;
  border: none !important;
}

:deep(.p-datatable-thead > tr > th .p-sortable-column-icon) {
  color: #292828 !important;
}

:deep(.p-datatable-tbody > tr) {
  background-color: #4e6161 !important;
  color: #352020 !important;
  transition: background-color 0.2s;
}

:deep(.p-datatable-tbody > tr:nth-child(even)) {
  background-color: #171818 !important;
}

:deep(.p-datatable-tbody > tr:hover) {
  background-color: #0d0e0d !important;
}

:deep(.p-datatable-tbody > tr > td) {
  padding: 12px 16px;
  border-bottom: 1px solid #0f0f0f !important;
  border-top: none !important;
}

:deep(.p-paginator) {
  background-color: #252525 !important;
  border-top: 1px solid #d0eeea !important;
  padding: 10px 16px;
}

:deep(.p-paginator .p-paginator-page.p-highlight) {
  background-color: #13a191 !important;
  color: #fff !important;
  border-radius: 6px;
}

:deep(.p-paginator .p-paginator-page:hover) {
  background-color: #0acaaa22 !important;
  border-radius: 6px;
}

:deep(.p-paginator .p-paginator-icon) {
  color: #13a191 !important;
}

:deep(.btn-edit .p-button-icon) {
  color: #13a191 !important;
}

:deep(.btn-delete .p-button-icon) {
  color: #e53e3e !important;
}

/* Badge de estado */
.estado-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: capitalize;
}

.estado-confirmada,
.estado-confirmado {
  background-color: #d4f7f0;
  color: #0a7a6e;
}

.estado-pendiente {
  background-color: #fff4d4;
  color: #a07000;
}

.estado-cancelada,
.estado-cancelado {
  background-color: #ffe0e0;
  color: #b00000;
}
</style>