<script setup lang="ts">
import type { PaqueteTuristico } from '@/models/paquete-turistico'
import type { Destino } from '@/models/destino'
import type { Extra } from '@/models/extra'
import type { GuiaTuristico } from '@/models/guia-turistico'
import type { Transporte } from '@/models/transporte'
import http from '@/plugins/axios'
import { InputNumber, MultiSelect, Select, Textarea } from 'primevue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/utils/error'

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
const extras = ref<Extra[]>([])
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
  extras.value = await http.get('extras').then((res) => res.data)
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
      idsExtras: paquete.value.idsExtras ?? paquete.value.extras?.map((e) => e.id) ?? [],
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${paquete.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    paquete.value = {} as PaqueteTuristico
    dialogVisible.value = false
  } catch (error: unknown) {
    alert(getApiErrorMessage(error, 'Error guardando paquete turístico'))
  }
}

watch(
  () => props.mostrar,
  async (nuevoValor) => {
    if (nuevoValor) {
      await cargarDatos()
      if (props.paquete?.id) {
        paquete.value = { ...props.paquete }
        paquete.value.idsExtras =
          props.paquete.idsExtras ?? props.paquete.extras?.map((e) => e.id) ?? []
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
      style="width: 45rem"
    >
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="nombre" class="block font-bold mb-2">Nombre *</label>
          <InputText
            id="nombre"
            v-model="paquete.nombre"
            class="w-full"
            maxlength="50"
            autofocus
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="precio" class="block font-bold mb-2">Precio *</label>
          <InputNumber
            id="precio"
            v-model="paquete.precio"
            class="w-full"
            :min="0"
            :minFractionDigits="2"
            :maxFractionDigits="2"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="duración" class="block font-bold mb-2">Duración</label>
          <InputText id="duración" v-model="paquete.duración" class="w-full" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="capacidadMaxima" class="block font-bold mb-2">Capacidad Máx.</label>
          <InputNumber
            id="capacidadMaxima"
            v-model="paquete.capacidadMaxima"
            class="w-full"
            :min="1"
            showButtons
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="incluyeHospedaje" class="block font-bold mb-2">Hospedaje</label>
          <InputText id="incluyeHospedaje" v-model="paquete.incluyeHospedaje" class="w-full" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="incluyeAlimentación" class="block font-bold mb-2">Alimentación</label>
          <Select
            id="incluyeAlimentación"
            v-model="paquete.incluyeAlimentación"
            :options="[
              { label: 'Ninguna', value: 'NINGUNA' },
              { label: 'Desayuno', value: 'DESAYUNO' },
              { label: 'Almuerzo', value: 'ALMUERZO' },
              { label: 'Cena', value: 'CENA' },
              { label: 'Media pensión', value: 'MEDIA_PENSION' },
              { label: 'Pensión completa', value: 'PENSION_COMPLETA' },
              { label: 'Todo incluido', value: 'TODO_INCLUIDO' },
            ]"
            optionLabel="label"
            optionValue="value"
            filter
            class="w-full"
            placeholder="Seleccione alimentación"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="destino" class="block font-bold mb-2">Destino</label>
          <Select
            id="destino"
            v-model="paquete.idDestino"
            :options="destinos"
            optionLabel="nombre"
            optionValue="id"
            filter
            class="w-full"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="guia" class="block font-bold mb-2">Guía</label>
          <Select
            id="guia"
            v-model="paquete.idGuia"
            :options="guias"
            optionLabel="nombre"
            optionValue="id"
            filter
            class="w-full"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="transporte" class="block font-bold mb-2">Transporte</label>
          <Select
            id="transporte"
            v-model="paquete.idTransporte"
            :options="transportes"
            optionLabel="tipo"
            optionValue="id"
            filter
            class="w-full"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="extras" class="block font-bold mb-2">Extras</label>
          <MultiSelect
            id="extras"
            v-model="paquete.idsExtras"
            :options="extras"
            optionLabel="nombre"
            optionValue="id"
            filter
            class="w-full"
            placeholder="Seleccione extras"
            display="chip"
          />
        </div>
        <div class="field col-12">
          <label for="descripción" class="block font-bold mb-2">Descripción *</label>
          <Textarea id="descripción" v-model="paquete.descripción" class="w-full" rows="3" />
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-6">
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
