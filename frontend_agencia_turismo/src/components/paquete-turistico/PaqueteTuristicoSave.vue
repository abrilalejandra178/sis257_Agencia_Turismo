<script setup lang="ts">
import type { PaqueteTuristico } from '@/models/paquete-turistico'
import type { Destino } from '@/models/destino'
import type { GuiaTuristico } from '@/models/guia-turistico'
import type { Transporte } from '@/models/transporte'
import http from '@/plugins/axios'
import { InputNumber, Select, Textarea } from 'primevue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'paquetes-turisticos'
const props = defineProps({
  mostrar: Boolean,
  paquete: {
    type: Object as () => PaqueteTuristico,
    default: () => ({}) as PaqueteTuristico,
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

const destinos = ref<Destino[]>([])
const guias = ref<GuiaTuristico[]>([])
const transportes = ref<Transporte[]>([])
const paquete = ref<PaqueteTuristico>({ ...props.paquete })

watch(
  () => props.paquete,
  (newVal) => {
    paquete.value = { ...newVal }
  },
)

async function cargarDatos() {
  destinos.value = await http.get('destinos').then((res) => res.data)
  guias.value = await http.get('guias-turisticos').then((res) => res.data)
  transportes.value = await http.get('transportes').then((res) => res.data)
}

async function handleSave() {
  try {
    const body = {
      nombre: paquete.value.nombre,
      descripción: paquete.value.descripción,
      precio: paquete.value.precio,
      duración: paquete.value.duración,
      capacidadMaxima: paquete.value.capacidadMaxima,
      incluyeHospedaje: paquete.value.incluyeHospedaje,
      incluyeAlimentación: paquete.value.incluyeAlimentación,
      idDestino: paquete.value.idDestino,
      idGuia: paquete.value.idGuia,
      idTransporte: paquete.value.idTransporte,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${paquete.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    paquete.value = {} as PaqueteTuristico
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
      if (props.paquete?.id) {
        paquete.value = { ...props.paquete }
      } else {
        paquete.value = {} as PaqueteTuristico
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Paquete Turístico'"
      style="width: 35rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-4">Nombre</label>
        <InputText
          id="nombre"
          v-model="paquete.nombre"
          class="flex-auto"
          maxlength="100"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="descripción" class="font-semibold w-4">Descripción</label>
        <Textarea id="descripción" v-model="paquete.descripción" class="flex-auto" rows="3" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="precio" class="font-semibold w-4">Precio</label>
        <InputNumber
          id="precio"
          v-model="paquete.precio"
          class="flex-auto"
          :min="0"
          :minFractionDigits="2"
          :maxFractionDigits="2"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="duración" class="font-semibold w-4">Duración</label>
        <InputText id="duración" v-model="paquete.duración" class="flex-auto" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="capacidadMaxima" class="font-semibold w-4">Capacidad Máx.</label>
        <InputNumber
          id="capacidadMaxima"
          v-model="paquete.capacidadMaxima"
          class="flex-auto"
          :min="1"
          showButtons
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="incluyeAlimentación" class="font-semibold w-4">Incluye Alimentación</label>
      <Select
          id="incluyeAlimentación"
           v-model="paquete.incluyeAlimentación"
          :options="['Desayuno', 'Almuerzo', 'Cena', 'Completa', 'No incluye']"
           class="flex-auto"
      />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="incluyeHospedaje" class="font-semibold w-4">Incluye Hospedaje</label>
      <Select
         id="incluyeHospedaje"
        v-model="paquete.incluyeHospedaje"
        :options="['Hotel 1★', 'Hotel 2★', 'Hotel 3★', 'Hostal', 'Camping', 'No incluye']"
        class="flex-auto"
      />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="destino" class="font-semibold w-4">Destino</label>
        <Select
          id="destino"
          v-model="paquete.idDestino"
          :options="destinos"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="guia" class="font-semibold w-4">Guía</label>
        <Select
          id="guia"
          v-model="paquete.idGuia"
          :options="guias"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="transporte" class="font-semibold w-4">Transporte</label>
        <Select
          id="transporte"
          v-model="paquete.idTransporte"
          :options="transportes"
          optionLabel="tipo"
          optionValue="id"
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
