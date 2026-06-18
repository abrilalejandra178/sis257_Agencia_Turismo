<script setup lang="ts">
import type { Pago } from '@/models/pago'
import type { Reserva } from '@/models/reserva'
import http from '@/plugins/axios'
import { DatePicker, InputNumber, Select } from 'primevue'
import Dialog from 'primevue/dialog'
import { computed, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/utils/error'

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

const reservas = ref<Reserva[]>([])
const pago = ref<Pago>({ ...props.pago })

function toDate(value: string | Date | undefined): Date {
  if (value instanceof Date) return value
  const fechaStr = value ?? ''
  const [y = 0, m = 1, d = 1] = (fechaStr.split('T')[0] || '').split('-').map(Number)
  return new Date(y, m - 1, d)
}

const metodosPago = [
  { label: 'Efectivo', value: 'efectivo' },
  { label: 'Tarjeta de crédito', value: 'tarjeta_credito' },
  { label: 'Tarjeta de débito', value: 'tarjeta_debito' },
  { label: 'Transferencia', value: 'transferencia' },
  { label: 'Depósito bancario', value: 'deposito_bancario' },
  { label: 'Cheque', value: 'cheque' },
  { label: 'Tigo Money', value: 'tigo_money' },
  { label: 'QR', value: 'qr' },
  { label: 'PayPal', value: 'paypal' },
]

const estadosPago = [
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Procesando', value: 'procesando' },
  { label: 'Completado', value: 'completado' },
  { label: 'Fallido', value: 'fallido' },
  { label: 'Reembolsado', value: 'reembolsado' },
  { label: 'Anulado', value: 'anulado' },
  { label: 'Pendiente reembolso', value: 'pendiente_reembolso' },
]

watch(
  () => props.pago,
  (newVal) => {
    pago.value = { ...newVal }
  },
)

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
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${pago.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    pago.value = {} as Pago
    dialogVisible.value = false
  } catch (error: unknown) {
    alert(getApiErrorMessage(error, 'Error guardando pago'))
  }
}

watch(
  () => props.mostrar,
  async (nuevoValor) => {
    if (nuevoValor) {
      await cargarDatos()
      if (props.pago?.id) {
        pago.value = { ...props.pago, fechaPago: toDate(props.pago.fechaPago) }
      } else {
        pago.value = { fechaPago: new Date() } as Pago
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
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="reserva" class="block font-bold mb-2">Reserva *</label>
          <Select
            id="reserva"
            v-model="pago.idReserva"
            :options="reservas"
            optionLabel="id"
            optionValue="id"
            filter
            class="w-full"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="monto" class="block font-bold mb-2">Monto *</label>
          <InputNumber
            id="monto"
            v-model="pago.monto"
            class="w-full"
            :min="0"
            :minFractionDigits="2"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="fechaPago" class="block font-bold mb-2">Fecha Pago *</label>
          <DatePicker id="fechaPago" v-model="pago.fechaPago" class="w-full" dateFormat="dd/mm/yy" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="metodoPago" class="block font-bold mb-2">Método Pago *</label>
          <Select
            id="metodoPago"
            v-model="pago.metodoPago"
            :options="metodosPago"
            optionLabel="label"
            optionValue="value"
            filter
            class="w-full"
            placeholder="Seleccione método"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="estadoPago" class="block font-bold mb-2">Estado Pago *</label>
          <Select
            id="estadoPago"
            v-model="pago.estadoPago"
            :options="estadosPago"
            optionLabel="label"
            optionValue="value"
            filter
            class="w-full"
            placeholder="Seleccione estado"
          />
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
