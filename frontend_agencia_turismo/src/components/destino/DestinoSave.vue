<script setup lang="ts">
import type { Destino } from '@/models/destino'
import http from '@/plugins/axios'
import { InputChips, Textarea } from 'primevue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/utils/error'

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
watch(
  () => props.destino,
  (newVal) => {
    destino.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: destino.value.nombre,
      descripción: destino.value.descripción,
      ubicación: destino.value.ubicación,
      imagenes: destino.value.imagenes || [],
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${destino.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    destino.value = {} as Destino
    dialogVisible.value = false
  } catch (error: unknown) {
    alert(getApiErrorMessage(error, 'Error guardando destino'))
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
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="nombre" class="block font-bold mb-2">Nombre *</label>
          <InputText id="nombre" v-model="destino.nombre" class="w-full" autocomplete="off" maxlength="50" autofocus />
        </div>
        <div class="field col-12 md:col-6">
          <label for="ubicación" class="block font-bold mb-2">Ubicación</label>
          <InputText id="ubicación" v-model="destino.ubicación" class="w-full" autocomplete="off" />
        </div>
        <div class="field col-12">
          <label for="descripción" class="block font-bold mb-2">Descripción *</label>
          <Textarea id="descripción" v-model="destino.descripción" class="w-full" rows="3" maxlength="1000" />
        </div>
        <div class="field col-12">
          <label for="imagenes" class="block font-bold mb-2">Imágenes (URLs)</label>
          <InputChips
            id="imagenes"
            v-model="destino.imagenes"
            class="w-full"
            separator=","
            placeholder="Ingrese URL y presione Enter"
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