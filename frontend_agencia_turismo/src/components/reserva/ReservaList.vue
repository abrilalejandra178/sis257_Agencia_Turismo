<script setup lang="ts">
import type { Reserva } from '@/models/reserva'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText, Textarea } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'reservas'
const reservas = ref<Reserva[]>([])
const emit = defineEmits(['edit'])
const reservaDelete = ref<Reserva | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

// CAMBIO (requisito #2): motivo de baja que se debe indicar al eliminar
const motivoBaja = ref<string>('')

async function obtenerLista() {
  reservas.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(reserva: Reserva) {
  emit('edit', reserva)
}

function mostrarEliminarConfirm(reserva: Reserva) {
  reservaDelete.value = reserva
  motivoBaja.value = ''
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  // CAMBIO (requisito #2): se exige el motivo antes de dar de baja la reserva
  if (!motivoBaja.value.trim()) {
    alert('Debe indicar el motivo de la baja/cancelación')
    return
  }
  await http.delete(`${ENDPOINT}/${reservaDelete.value?.id}`, {
    data: { motivo: motivoBaja.value.trim() },
  })
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const reservasFiltradas = computed(() => {
  return reservas.value.filter(
    (reserva) =>
      reserva.estado.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      reserva.nombreCliente?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      reserva.paquetesTuristicos?.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function formatoFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-ES')
}

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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por cliente, paquete o estado" />
      </InputGroup>
    </div>
    <DataTable
      :value="reservasFiltradas"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} a {last} de {totalRecords}"
      scrollable
      tableStyle="min-width: 60rem"
    >
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text @click="obtenerLista" />
      </template>
      <Column field="id" header="#" sortable style="width: 60px" />
      <Column field="nombreCliente" header="Cliente" sortable />
      <Column field="paquetesTuristicos.nombre" header="Paquete" sortable />
      <Column field="cantidadPersonas" header="Personas" sortable style="width: 100px" />
      <Column field="total" header="Total" sortable>
        <template #body="{ data }">Bs {{ Number(data.total).toFixed(2) }}</template>
      </Column>
      <Column field="estado" header="Estado" sortable>
        <template #body="{ data }">
          <span
            class="px-2 py-1 rounded-full text-xs font-semibold capitalize"
            :title="data.estado === 'cancelada' ? data.motivoCancelacion : ''"
            :class="{
              'bg-green-100 text-green-700': data.estado === 'pagada',
              'bg-blue-100 text-blue-700': data.estado === 'confirmada',
              'bg-yellow-100 text-yellow-700': data.estado === 'pendiente',
              'bg-orange-100 text-orange-700': data.estado === 'adelantado',
              'bg-red-100 text-red-700': data.estado === 'cancelada',
              'bg-gray-100 text-gray-700': data.estado === 'completada',
            }"
          >
            {{ data.estado }}
          </span>
          <!-- CAMBIO (requisito #2): se muestra el motivo de la cancelación -->
          <i
            v-if="data.estado === 'cancelada' && data.motivoCancelacion"
            class="pi pi-info-circle ml-1 text-gray-400"
            :title="data.motivoCancelacion"
          ></i>
        </template>
      </Column>
      <Column field="fechaReserva" header="Fecha Reserva" sortable>
        <template #body="{ data }">{{ formatoFecha(data.fechaReserva) }}</template>
      </Column>
      <Column field="fechaViaje" header="Fecha Viaje" sortable>
        <template #body="{ data }">{{ data.fechaViaje ? formatoFecha(data.fechaViaje) : '—' }}</template>
      </Column>
      <Column field="usuario.nombre" header="Registrado por" sortable />
      <Column header="Acciones" style="min-width: 120px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
          <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(data)" />
        </template>
      </Column>
      <template #empty>
        <div class="p-4 text-center text-gray-500">No se encontraron reservas.</div>
      </template>
    </DataTable>
    <!-- CAMBIO (requisito #2): se solicita el motivo antes de dar de baja la reserva -->
    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación / Baja" :style="{ width: '28rem' }">
      <p>¿Estás seguro de que deseas dar de baja esta reserva?</p>
      <div class="mb-2">
        <label for="motivoBaja" class="font-semibold block mb-2">Motivo de la baja/cancelación *</label>
        <Textarea
          id="motivoBaja"
          v-model="motivoBaja"
          class="w-full"
          rows="3"
          maxlength="255"
          placeholder="Ej: el cliente canceló el viaje, error en el registro, etc."
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
