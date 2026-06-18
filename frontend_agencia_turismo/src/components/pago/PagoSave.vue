<script setup lang="ts">
import type { Pago } from '@/models/pago'
import type { Reserva } from '@/models/reserva'
import http from '@/plugins/axios'
import { InputNumber, Select } from 'primevue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'pagos'
const props = defineProps({
  mostrar: Boolean,
  pago: {
    type: Object as () => Pago,
    default: () => ({}) as Pago,
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

// CAMBIO (requisito #6): no se permite elegir una fecha de pago anterior a hoy
const fechaMinima = new Date().toISOString().slice(0, 10)

// Opciones de los selects, alineadas con los enums del backend (MetodoPago / EstadoPago)
const opcionesMetodoPago = [
  { label: 'Efectivo', value: 'efectivo' },
  { label: 'Tarjeta de crédito', value: 'tarjeta_credito' },
  { label: 'Tarjeta de débito', value: 'tarjeta_debito' },
  { label: 'Transferencia', value: 'transferencia' },
  { label: 'Cheque', value: 'cheque' },
]
const opcionesEstadoPago = [
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Procesando', value: 'procesando' },
  { label: 'Completado', value: 'completado' },
  { label: 'Fallido', value: 'fallido' },
  { label: 'Reembolsado', value: 'reembolsado' },
]

const reservas = ref<Reserva[]>([])
const pago = ref<Pago>({ ...props.pago })

// CAMBIO (requisito #5): monto que el cliente entrega físicamente (solo
// tiene sentido para pagos en efectivo). Se usa para calcular el cambio.
const montoRecibido = ref<number | null>(null)

watch(
  () => props.pago,
  (newVal) => {
    pago.value = { ...newVal }
    montoRecibido.value = newVal?.montoRecibido ?? null
  },
)

// CAMBIO (requisito #5): cambio/vuelto a entregar si el cliente paga con
// un monto más elevado que el monto a cobrar.
const cambioCalculado = computed(() => {
  const monto = Number(pago.value.monto) || 0
  const recibido = Number(montoRecibido.value) || 0
  if (recibido <= monto) return 0
  return recibido - monto
})

const faltaParaCubrir = computed(() => {
  const monto = Number(pago.value.monto) || 0
  const recibido = Number(montoRecibido.value) || 0
  if (!montoRecibido.value || recibido >= monto) return 0
  return monto - recibido
})

async function cargarDatos() {
  reservas.value = await http.get('reservas').then((res) => res.data)
}

async function handleSave() {
  try {
    const body = {
      monto: pago.value.monto,
      fechaPago: pago.value.fechaPago,
      metodoPago: pago.value.metodoPago,
      estadoPago: pago.value.estadoPago,
      idReserva: pago.value.idReserva,
      // CAMBIO (requisito #5): se envía el monto recibido para que el
      // backend calcule y guarde el cambio correspondiente.
      montoRecibido: montoRecibido.value || undefined,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${pago.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    pago.value = {} as Pago
    montoRecibido.value = null
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  async (nuevoValor) => {
    if (nuevoValor) {
      await cargarDatos()
      if (props.pago?.id) {
        pago.value = { ...props.pago }
        montoRecibido.value = props.pago.montoRecibido ?? null
      } else {
        pago.value = {} as Pago
        montoRecibido.value = null
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Pago'"
      style="width: 30rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="reserva" class="font-semibold w-4">Reserva</label>
        <Select
          id="reserva"
          v-model="pago.idReserva"
          :options="reservas"
          optionLabel="id"
          optionValue="id"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="monto" class="font-semibold w-4">Monto a cobrar</label>
        <InputNumber
          id="monto"
          v-model="pago.monto"
          class="flex-auto"
          :min="0"
          :minFractionDigits="2"
        />
      </div>

      <!-- CAMBIO (requisito #5): monto recibido del cliente y cálculo de cambio -->
      <div class="flex items-center gap-4 mb-2">
        <label for="montoRecibido" class="font-semibold w-4">Monto recibido</label>
        <InputNumber
          id="montoRecibido"
          v-model="montoRecibido"
          class="flex-auto"
          :min="0"
          :minFractionDigits="2"
          placeholder="Ej: si cobra Bs 100 y paga con Bs 150"
        />
      </div>
      <div v-if="cambioCalculado > 0" class="mb-4 text-sm font-semibold text-green-600">
        Cambio a entregar al cliente: Bs {{ cambioCalculado.toFixed(2) }}
      </div>
      <div v-else-if="faltaParaCubrir > 0" class="mb-4 text-sm font-semibold text-red-600">
        El monto recibido no cubre el total. Falta Bs {{ faltaParaCubrir.toFixed(2) }}
      </div>
      <div v-else class="mb-4"></div>

      <div class="flex items-center gap-4 mb-4">
        <label for="fechaPago" class="font-semibold w-4">Fecha Pago</label>
        <InputText
          id="fechaPago"
          v-model="pago.fechaPago as any"
          type="date"
          class="flex-auto"
          :min="fechaMinima"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="metodoPago" class="font-semibold w-4">Método Pago</label>
        <Select
          id="metodoPago"
          v-model="pago.metodoPago"
          :options="opcionesMetodoPago"
          optionLabel="label"
          optionValue="value"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="estadoPago" class="font-semibold w-4">Estado Pago</label>
        <Select
          id="estadoPago"
          v-model="pago.estadoPago"
          :options="opcionesEstadoPago"
          optionLabel="label"
          optionValue="value"
          class="flex-auto"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
