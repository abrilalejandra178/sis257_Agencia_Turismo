<script setup lang="ts">
import type { Resena } from '@/models/resena'
import type { Usuario } from '@/models/usuario'
import type { PaqueteTuristico } from '@/models/paquete-turistico'
import http from '@/plugins/axios'
import { DatePicker, InputNumber, Select } from 'primevue'
import Dialog from 'primevue/dialog'
import { Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/utils/error'

const ENDPOINT = 'resenas'
const props = defineProps({
  mostrar: Boolean,
  resena: {
    type: Object as () => Resena,
    default: () => ({}) as Resena,
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
const resena = ref<Resena>({ ...props.resena })

function toDate(value: string | Date | undefined): Date {
  if (value instanceof Date) return value
  const fechaStr = value ?? ''
  const [y = 0, m = 1, d = 1] = (fechaStr.split('T')[0] || '').split('-').map(Number)
  return new Date(y, m - 1, d)
}

watch(
  () => props.resena,
  (newVal) => {
    resena.value = { ...newVal }
  },
)

async function cargarDatos() {
  usuarios.value = await http.get('usuarios').then((res) => res.data)
  paquetes.value = await http.get('paquetes-turisticos').then((res) => res.data)
}

async function handleSave() {
  try {
    const body = {
      comentario: resena.value.comentario,
      calificacion: resena.value.calificacion,
      fecha: resena.value.fecha,
      idUsuario: resena.value.idUsuario,
      idPaquete: resena.value.idPaquete,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${resena.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    resena.value = {} as Resena
    dialogVisible.value = false
  } catch (error: unknown) {
    alert(getApiErrorMessage(error, 'Error guardando reseña'))
  }
}

watch(
  () => props.mostrar,
  async (nuevoValor) => {
    if (nuevoValor) {
      await cargarDatos()
      if (props.resena?.id) {
        resena.value = { ...props.resena, fecha: toDate(props.resena.fecha) }
      } else {
        resena.value = { fecha: new Date() } as Resena
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Reseña'"
      style="width: 30rem"
    >
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="usuario" class="block font-bold mb-2">Usuario *</label>
          <Select
            id="usuario"
            v-model="resena.idUsuario"
            :options="usuarios"
            optionLabel="nombre"
            optionValue="id"
            filter
            class="w-full"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="paquete" class="block font-bold mb-2">Paquete *</label>
          <Select
            id="paquete"
            v-model="resena.idPaquete"
            :options="paquetes"
            optionLabel="nombre"
            optionValue="id"
            filter
            class="w-full"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="calificacion" class="block font-bold mb-2">Calificación *</label>
          <InputNumber
            id="calificacion"
            v-model="resena.calificacion"
            class="w-full"
            :min="1"
            :max="5"
            showButtons
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="fecha" class="block font-bold mb-2">Fecha *</label>
          <DatePicker id="fecha" v-model="resena.fecha" class="w-full" dateFormat="dd/mm/yy" />
        </div>
        <div class="field col-12">
          <label for="comentario" class="block font-bold mb-2">Comentario *</label>
          <Textarea
            id="comentario"
            v-model="resena.comentario"
            class="w-full"
            rows="3"
            maxlength="500"
          />
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
