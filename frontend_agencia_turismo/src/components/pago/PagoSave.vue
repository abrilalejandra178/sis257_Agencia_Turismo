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

const reservas = ref<Reserva[]>([])
const pago = ref<Pago>({ ...props.pago })

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
      } else {
        pago.value = {} as Pago
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
        <label for="monto" class="font-semibold w-4">Monto</label>
        <InputNumber
          id="monto"
          v-model="pago.monto"
          class="flex-auto"
          :min="0"
          :minFractionDigits="2"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fechaPago" class="font-semibold w-4">Fecha Pago</label>
        <InputText id="fechaPago" v-model="pago.fechaPago" type="date" class="flex-auto" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="metodoPago" class="font-semibold w-4">Método Pago</label>
        <InputText id="metodoPago" v-model="pago.metodoPago" class="flex-auto" maxlength="100" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="estadoPago" class="font-semibold w-4">Estado Pago</label>
        <InputText id="estadoPago" v-model="pago.estadoPago" class="flex-auto" maxlength="100" />
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
