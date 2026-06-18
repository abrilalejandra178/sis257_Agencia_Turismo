<script setup lang="ts">
import type { GuiaTuristico } from '@/models/guia-turistico'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { Rating, Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'

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
      calificación: guia.value.calificacion,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${guia.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    guia.value = {} as GuiaTuristico
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
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Guía Turístico'"
      style="width: 28rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText id="nombre" v-model="guia.nombre" class="flex-auto" autocomplete="off" maxlength="50" autofocus />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="apellido" class="font-semibold w-3">Apellido</label>
        <InputText id="apellido" v-model="guia.apellido" class="flex-auto" autocomplete="off" maxlength="50" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="teléfono" class="font-semibold w-3">Teléfono</label>
        <InputText id="teléfono" v-model="guia.teléfono" class="flex-auto" autocomplete="off" maxlength="8" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="teléfono" class="font-semibold w-3">Idioma</label>
        <!-- DESPUÉS idioma con Select: -->
        <Select
          id="idioma"
          v-model="guia.idioma"
          :options="['Español', 'Inglés', 'Francés', 'Portugués', 'Alemán', 'Italiano', 'Quechua', 'Aymara']"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="experiencia" class="font-semibold w-3">Experiencia</label>
        <Textarea id="experiencia" v-model="guia.experiencia" class="flex-auto" rows="3" maxlength="1000" />
      </div>
      <!-- CAMBIO (requisito #4): clasificación del guía con estrellas del 1 al 5 -->
      <div class="flex items-center gap-4 mb-4">
        <label for="calificación" class="font-semibold w-3">Calificación</label>
        <Rating id="calificación" v-model="guia.calificacion" :stars="5" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" @click="dialogVisible = false" />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>