<script setup lang="ts">
import type { Reserva } from '@/models/reserva'
import type { Usuario } from '@/models/usuario'
import type { PaqueteTuristico } from '@/models/paquete-turistico'
import http from '@/plugins/axios'
import { InputNumber, Select } from 'primevue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

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
const reserva = ref<Reserva>({ ...props.reserva })

watch(
  () => props.reserva,
  (newVal) => {
    reserva.value = { ...newVal }
  },
)

async function cargarDatos() {
  usuarios.value = await http.get('usuarios').then((res) => res.data)
  paquetes.value = await http.get('paquetes-turisticos').then((res) => res.data)
}

async function handleSave() {
  try {
    const body = {
      fechaReserva: reserva.value.fechaReserva,
      cantidadPersonas: reserva.value.cantidadPersonas,
      total: reserva.value.total,
      adelanto: reserva.value.adelanto,
      saldoPendiente: reserva.value.saldoPendiente,
      estado: reserva.value.estado,
      idUsuario: reserva.value.idUsuario,
      idPaquete: reserva.value.idPaquete,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${reserva.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    reserva.value = {} as Reserva
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
      if (props.reserva?.id) {
        reserva.value = { ...props.reserva }
      } else {
        reserva.value = {} as Reserva
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Reserva'"
      style="width: 32rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="usuario" class="font-semibold w-4">Usuario</label>
        <Select
          id="usuario"
          v-model="reserva.idUsuario"
          :options="usuarios"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="paquete" class="font-semibold w-4">Paquete</label>
        <Select
          id="paquete"
          v-model="reserva.idPaquete"
          :options="paquetes"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fechaReserva" class="font-semibold w-4">Fecha Reserva</label>
        <InputText id="fechaReserva" v-model="reserva.fechaReserva" type="date" class="flex-auto" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="cantidadPersonas" class="font-semibold w-4">Personas</label>
        <InputNumber
          id="cantidadPersonas"
          v-model="reserva.cantidadPersonas"
          class="flex-auto"
          :min="1"
          showButtons
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="total" class="font-semibold w-4">Total</label>
        <InputNumber
          id="total"
          v-model="reserva.total"
          class="flex-auto"
          :min="0"
          :minFractionDigits="2"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="adelanto" class="font-semibold w-4">Adelanto</label>
        <InputNumber
          id="adelanto"
          v-model="reserva.adelanto"
          class="flex-auto"
          :min="0"
          :minFractionDigits="2"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="saldoPendiente" class="font-semibold w-4">Saldo Pendiente</label>
        <InputNumber
          id="saldoPendiente"
          v-model="reserva.saldoPendiente"
          class="flex-auto"
          :min="0"
          :minFractionDigits="2"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="estado" class="font-semibold w-4">Estado</label>
        <InputText id="estado" v-model="reserva.estado" class="flex-auto" maxlength="50" />
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
