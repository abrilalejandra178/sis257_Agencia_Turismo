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

// CAMBIO (requisito #1): lista editable de URLs de imágenes adicionales
// (galería) del destino. Cada elemento es solo el texto de la URL.
const imagenesGaleria = ref<string[]>([])

function sincronizarDesdeProp(valor: Destino) {
  destino.value = { ...valor }
  imagenesGaleria.value = (valor.imagenes ?? []).map((img) => img.url)
}

watch(
  () => props.destino,
  (newVal) => {
    sincronizarDesdeProp(newVal)
  },
)

function agregarImagen() {
  imagenesGaleria.value.push('')
}

function quitarImagen(index: number) {
  imagenesGaleria.value.splice(index, 1)
}

async function handleSave() {
  try {
    const body = {
      nombre: destino.value.nombre,
      descripción: destino.value.descripción,
      ubicación: destino.value.ubicación,
      imagen: destino.value.imagen,
      // Se filtran las URLs vacías antes de enviarlas
      imagenes: imagenesGaleria.value.filter((url) => url.trim() !== ''),
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${destino.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    destino.value = {} as Destino
    imagenesGaleria.value = []
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      sincronizarDesdeProp(props.destino?.id ? props.destino : ({} as Destino))
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Destino'"
      style="width: 32rem"
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
        <label for="imagen" class="font-semibold w-3">Imagen principal (URL)</label>
        <InputText id="imagen" v-model="destino.imagen" class="flex-auto" autocomplete="off" maxlength="1000" />
      </div>

      <!-- CAMBIO (requisito #1): galería de imágenes adicionales -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <label class="font-semibold">Imágenes adicionales (galería)</label>
          <Button type="button" label="Agregar imagen" icon="pi pi-plus" text size="small" @click="agregarImagen" />
        </div>
        <div v-if="imagenesGaleria.length === 0" class="text-sm text-gray-400 mb-2">
          No hay imágenes adicionales. Use "Agregar imagen" para sumar más fotos del destino.
        </div>
        <div
          v-for="(url, index) in imagenesGaleria"
          :key="index"
          class="flex items-center gap-2 mb-2"
        >
          <InputText
            v-model="imagenesGaleria[index]"
            class="flex-auto"
            placeholder="https://ejemplo.com/foto.jpg"
            maxlength="1000"
          />
          <Button type="button" icon="pi pi-trash" severity="danger" text @click="quitarImagen(index)" />
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" @click="dialogVisible = false" />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
