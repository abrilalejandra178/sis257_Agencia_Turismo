<script setup lang="ts">
import type { Destino } from '@/models/destino'
import http from '@/plugins/axios'
import { Textarea } from 'primevue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'destinos'
const props = defineProps({
  mostrar: Boolean,
  destino: {
    type: Object as () => Destino,
    default: () => ({}) as Destino,
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

const destino = ref<Destino>({ ...props.destino })
const imagenesTexto = ref('')

watch(
  () => props.destino,
  (newVal) => {
    destino.value = {...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: destino.value.nombre,
      descripción: destino.value.descripción,
      ubicación: destino.value.ubicación,
      imagenes: imagenesTexto.value
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url !== '')
        .map((url) => ({ urlImagen: url })),
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${destino.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Destino'"
      style="width: 28rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText id="nombre" v-model="destino.nombre" class="flex-auto" autocomplete="off" maxlength="50" autofocus />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="descripción" class="font-semibold w-3">Descripción</label>
        <Textarea id="descripción" v-model="destino.descripción" class="flex-auto" rows="3" maxlength="1000" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="ubicación" class="font-semibold w-3">Ubicación</label>
        <InputText id="ubicación" v-model="destino.ubicación" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
      <label class="font-semibold w-3">Imágenes</label>
      <Textarea v-model="imagenesTexto" placeholder="Una URL por línea" rows="4" class="flex-auto"/>
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" @click="dialogVisible = false" />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>