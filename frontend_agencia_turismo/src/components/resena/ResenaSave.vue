<script setup lang="ts">
import type { Resena } from '@/models/resena'
import type { Usuario } from '@/models/usuario'
import type { PaqueteTuristico } from '@/models/paquete-turistico'
import http from '@/plugins/axios'
import { InputNumber, Select } from 'primevue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'

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
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  async (nuevoValor) => {
    if (nuevoValor) {
      await cargarDatos()
      if (props.resena?.id) {
        resena.value = { ...props.resena }
      } else {
        resena.value = {} as Resena
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
      <div class="flex items-center gap-4 mb-4">
        <label for="usuario" class="font-semibold w-4">Usuario</label>
        <Select
          id="usuario"
          v-model="resena.idUsuario"
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
          v-model="resena.idPaquete"
          :options="paquetes"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="comentario" class="font-semibold w-4">Comentario</label>
        <Textarea
          id="comentario"
          v-model="resena.comentario"
          class="flex-auto"
          rows="3"
          maxlength="500"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="calificacion" class="font-semibold w-4">Calificación</label>
        <InputNumber
          id="calificacion"
          v-model="resena.calificacion"
          class="flex-auto"
          :min="1"
          :max="5"
          showButtons
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fecha" class="font-semibold w-4">Fecha</label>
        <InputText id="fecha" v-model="resena.fecha" type="date" class="flex-auto" />
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
