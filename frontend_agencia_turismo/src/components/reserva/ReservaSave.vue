<script setup lang="ts">
import type { Reserva } from '@/models/reserva'
import type { Usuario } from '@/models/usuario'
import type { PaqueteTuristico } from '@/models/paquete-turistico'
import type { Extra } from '@/models/extra'
import http from '@/plugins/axios'
import { DatePicker, InputNumber, InputText, MultiSelect, Select } from 'primevue'
import Dialog from 'primevue/dialog'
import { computed, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/utils/error'

function calcularTotal() {
  const paquete = paquetes.value.find((p) => p.id === reserva.value.idPaquete)
  const base = paquete && reserva.value.cantidadPersonas
    ? Number(paquete.precio) * reserva.value.cantidadPersonas
    : 0
  const extrasTotal = reserva.value.extras?.reduce((sum, e) => sum + Number(e.precio), 0) ?? 0
  reserva.value.total = base + extrasTotal
}

const ENDPOINT = 'reservas'
const props = defineProps({
  mostrar: Boolean,
  reserva: {
    type: Object as () => Reserva,
    default: () => ({}) as Reserva,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const usuarios = ref<Usuario[]>([])
const paquetes = ref<PaqueteTuristico[]>([])
const extras = ref<Extra[]>([])
const reserva = ref<Reserva>({ ...props.reserva })

const estadosReserva = [
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Confirmada', value: 'confirmada' },
  { label: 'Pagada', value: 'pagada' },
  { label: 'En progreso', value: 'en_progreso' },
  { label: 'Completada', value: 'completada' },
  { label: 'Cancelada', value: 'cancelada' },
  { label: 'No show', value: 'no_show' },
]

watch(
  () => props.reserva,
  (newVal) => {
    reserva.value = { ...newVal }
  },
)

async function cargarDatos() {
  usuarios.value = await http.get('usuarios').then((res) => res.data)
  paquetes.value = await http.get('paquetes-turisticos').then((res) => res.data)
  extras.value = await http.get('extras').then((res) => res.data)
}

async function handleSave() {
  try {
    const body = {
      nombreCliente: reserva.value.nombreCliente,
      fechaReserva: reserva.value.fechaReserva,
      fechaViaje: reserva.value.fechaViaje,
      cantidadPersonas: reserva.value.cantidadPersonas,
      total: reserva.value.total,
      estado: reserva.value.estado,
      idUsuario: reserva.value.idUsuario,
      idPaquete: reserva.value.idPaquete,
      idsExtras: reserva.value.idsExtras ?? reserva.value.extras?.map((e) => e.id) ?? [],
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${reserva.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    reserva.value = {} as Reserva
    dialogVisible.value = false
  } catch (error: unknown) {
    alert(getApiErrorMessage(error, 'Error guardando reserva'))
  }
}

watch(
  () => props.mostrar,
  async (nuevoValor) => {
    if (nuevoValor) {
      await cargarDatos()
      if (props.reserva?.id) {
        reserva.value = { ...props.reserva }
        reserva.value.idsExtras =
          props.reserva.idsExtras ?? props.reserva.extras?.map((e) => e.id) ?? []
      } else {
        reserva.value = {} as Reserva
      }
    }
  },
)

watch(
  () => [reserva.value.idPaquete, reserva.value.cantidadPersonas],
  () => calcularTotal(),
  { immediate: true },
)

watch(
  () => reserva.value.idsExtras,
  (nuevosIds) => {
    reserva.value.extras = extras.value.filter((e) => nuevosIds?.includes(e.id))
    calcularTotal()
  },
  { deep: true },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialogVisible" :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Reserva'"
      style="width: 32rem">
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="usuario" class="block font-bold mb-2">Usuario *</label>
          <Select id="usuario" v-model="reserva.idUsuario" :options="usuarios" optionLabel="nombre" optionValue="id"
            filter class="w-full" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="paquete" class="block font-bold mb-2">Paquete *</label>
          <Select id="paquete" v-model="reserva.idPaquete" :options="paquetes" optionLabel="nombre" optionValue="id"
            filter class="w-full" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="nombreCliente" class="block font-bold mb-2">Nombre Cliente *</label>
          <InputText id="nombreCliente" v-model="reserva.nombreCliente" class="w-full" maxlength="100" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="cantidadPersonas" class="block font-bold mb-2">Personas *</label>
          <InputNumber id="cantidadPersonas" v-model="reserva.cantidadPersonas" class="w-full" :min="1" showButtons />
        </div>
        <div class="field col-12 md:col-6">
          <label for="fechaReserva" class="block font-bold mb-2">Fecha Reserva *</label>
          <DatePicker id="fechaReserva" v-model="reserva.fechaReserva" class="w-full" dateFormat="dd/mm/yy" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="fechaViaje" class="block font-bold mb-2">Fecha Viaje</label>
          <DatePicker id="fechaViaje" v-model="reserva.fechaViaje" class="w-full" dateFormat="dd/mm/yy"
            :minDate="new Date()" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="estado" class="block font-bold mb-2">Estado *</label>
          <Select id="estado" v-model="reserva.estado" :options="estadosReserva" optionLabel="label" optionValue="value"
            filter placeholder="Seleccione estado" class="w-full" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="extras" class="block font-bold mb-2">Extras</label>
          <MultiSelect id="extras" v-model="reserva.idsExtras" :options="extras" optionLabel="nombre" optionValue="id"
            filter class="w-full" placeholder="Seleccione extras" display="chip" />
        </div>
        <div class="field col-12 bg-gray-50 p-4 border-round border-1 border-gray-200 mt-2">
          <label for="total" class="block font-bold text-gray-800 mb-2">Total Calculado</label>
          <InputNumber id="total" v-model="reserva.total" class="w-full" :min="0" :minFractionDigits="2" disabled />
        </div>
      </div>
      <div class="flex justify-content-end gap-2 mt-4">
        <button type="button" class="app-btn app-btn-secondary" @click="dialogVisible = false">
          <i class="pi pi-times"></i> Cancelar
        </button>
        <button type="button" class="app-btn app-btn-primary" @click="handleSave">
          <i class="pi pi-save"></i> Guardar
        </button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
