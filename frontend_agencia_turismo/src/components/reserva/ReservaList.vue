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
    <div class="col-9 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por estado o usuario" />
      </InputGroup>
    </div>
    <DataTable
      :value="reservasFiltradas"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 25]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} a {last} de {totalRecords}"
      scrollable
      tableStyle="min-width: 50rem"
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
      <Column field="estado" header="Estado" sortable />
      <Column header="Acciones" style="min-width: 120px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
          <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(data)" />
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>