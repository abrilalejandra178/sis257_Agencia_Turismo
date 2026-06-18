<script setup lang="ts">
import type { GuiaTuristico } from '@/models/guia-turistico'
import http from '@/plugins/axios'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { MultiSelect, Rating, Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/utils/error'

const ENDPOINT = 'guias-turisticos'
const props = defineProps({
  mostrar: Boolean,
  guia: {
    type: Object as () => GuiaTuristico,
    default: () => ({}) as GuiaTuristico,
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

const guia = ref<GuiaTuristico>({ ...props.guia })
watch(
  () => props.guia,
  (newVal) => {
    guia.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: guia.value.nombre,
      apellido: guia.value.apellido,
      teléfono: guia.value.teléfono,
      idioma: guia.value.idioma,
      experiencia: guia.value.experiencia,
      calificación: guia.value.calificación,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${guia.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    guia.value = {} as GuiaTuristico
    dialogVisible.value = false
  } catch (error: unknown) {
    alert(getApiErrorMessage(error, 'Error guardando guía turístico'))
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialogVisible" :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Guía Turístico'"
      style="width: 28rem">
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="nombre" class="block font-bold mb-2">Nombre *</label>
          <InputText id="nombre" v-model="guia.nombre" class="w-full" autocomplete="off" maxlength="50" autofocus />
        </div>
        <div class="field col-12 md:col-6">
          <label for="apellido" class="block font-bold mb-2">Apellido *</label>
          <InputText id="apellido" v-model="guia.apellido" class="w-full" autocomplete="off" maxlength="50" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="teléfono" class="block font-bold mb-2">Teléfono</label>
          <InputText id="teléfono" v-model="guia.teléfono" class="w-full" autocomplete="off" maxlength="8" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="idioma" class="block font-bold mb-2">Idioma</label>
          <MultiSelect id="idioma" v-model="guia.idioma"
            :options="['Español', 'Inglés', 'Francés', 'Alemán', 'Portugués', 'Quechua', 'Aymara', 'Italiano', 'Chino']"
            filter class="w-full" placeholder="Seleccione idiomas" display="chip" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="calificación" class="block font-bold mb-2">Calificación</label>
          <Rating id="calificación" v-model="guia.calificación" :stars="5" :cancel="false" />
        </div>
        <div class="field col-12">
          <label for="experiencia" class="block font-bold mb-2">Experiencia</label>
          <Textarea id="experiencia" v-model="guia.experiencia" class="w-full" rows="3" maxlength="1000" />
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