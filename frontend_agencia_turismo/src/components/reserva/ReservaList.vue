<script setup lang="ts">
import type { Reserva } from '@/models/reserva'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'reservas'
const reservas = ref<Reserva[]>([])
const emit = defineEmits(['edit'])
const reservaCancelar = ref<Reserva | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const motivoCancelacion = ref<string>('')
const busqueda = ref<string>('')

async function obtenerLista() {
  reservas.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(reserva: Reserva) {
  emit('edit', reserva)
}

function mostrarCancelarConfirm(reserva: Reserva) {
  reservaCancelar.value = reserva
  motivoCancelacion.value = ''
  mostrarConfirmDialog.value = true
}

async function cancelar() {
  if (!motivoCancelacion.value || motivoCancelacion.value.length < 5) {
    alert('El motivo es obligatorio y debe tener al menos 5 caracteres')
    return
  }
  await http.patch(`${ENDPOINT}/${reservaCancelar.value?.id}/cancelar`, { motivo: motivoCancelacion.value })
  obtenerLista()
  mostrarConfirmDialog.value = false
  motivoCancelacion.value = ''
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
    <div class="search-box">
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
          <span class="px-2 py-1 rounded-full text-xs font-semibold capitalize"
            :class="{
              'bg-green-100 text-green-700': data.estado === 'pagada',
              'bg-blue-100 text-blue-700': data.estado === 'confirmada',
              'bg-yellow-100 text-yellow-700': data.estado === 'pendiente',
              'bg-red-100 text-red-700': data.estado === 'cancelada',
              'bg-gray-100 text-gray-700': data.estado === 'completada',
            }">
            {{ data.estado }}
          </span>
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
          <button class="app-btn app-btn-secondary" title="Editar" @click="emitirEdicion(data)">
            <i class="pi pi-pencil"></i>
          </button>
          <button class="app-btn app-btn-danger" title="Cancelar" @click="mostrarCancelarConfirm(data)">
            <i class="pi pi-times-circle"></i>
          </button>
        </template>
      </Column>
      <template #empty>
        <div class="p-4 text-center text-gray-500">No se encontraron reservas.</div>
      </template>
    </DataTable>
    <Dialog v-model:visible="mostrarConfirmDialog" header="Cancelar Reserva" :style="{ width: '30rem' }">
      <p class="mb-2">¿Estás seguro de que deseas cancelar esta reserva?</p>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Motivo de cancelación *</label>
        <textarea v-model="motivoCancelacion" rows="3" class="w-full border rounded p-2" placeholder="Ingrese el motivo (mínimo 5 caracteres)"></textarea>
      </div>
      <div class="flex justify-end gap-2">
        <button type="button" class="app-btn app-btn-secondary" @click="mostrarConfirmDialog = false">Cerrar</button>
        <button type="button" class="app-btn app-btn-danger" @click="cancelar">Cancelar reserva</button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
