<script setup lang="ts">
import type { Itinerario } from '@/models/itinerario'
import type { PaqueteTuristico } from '@/models/paquete-turistico'
import http from '@/plugins/axios'
import { InputNumber, Select } from 'primevue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/utils/error'

const ENDPOINT = 'itinerarios'
const props = defineProps({
  mostrar: Boolean,
  itinerario: { type: Object as () => Itinerario, default: () => ({}) as Itinerario },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => { if (!value) emit('close') },
})

const paquetes = ref<PaqueteTuristico[]>([])
const itinerario = ref<Itinerario>({ ...props.itinerario })

watch(() => props.itinerario, (newVal) => { itinerario.value = { ...newVal } })

async function cargarDatos() {
  paquetes.value = await http.get('paquetes-turisticos').then((r) => r.data)
}

async function handleSave() {
  try {
    const body = {
      dia: itinerario.value.dia,
      titulo: itinerario.value.titulo,
      descripcion: itinerario.value.descripcion,
      horaInicio: itinerario.value.horaInicio,
      horaFin: itinerario.value.horaFin,
      idPaquete: itinerario.value.idPaquete,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${itinerario.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    itinerario.value = {} as Itinerario
    dialogVisible.value = false
  } catch (error: unknown) {
    alert(getApiErrorMessage(error, 'Error guardando itinerario'))
  }
}

watch(() => props.mostrar, async (nuevo) => {
  if (nuevo) {
    await cargarDatos()
    if (props.itinerario?.id) itinerario.value = { ...props.itinerario }
    else itinerario.value = {} as Itinerario
  }
})
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialogVisible" :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Itinerario'" style="width: 32rem">
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label class="block font-bold mb-2">Día *</label>
          <InputNumber v-model="itinerario.dia" class="w-full" :min="1" showButtons />
        </div>
        <div class="field col-12 md:col-6">
          <label class="block font-bold mb-2">Paquete *</label>
          <Select v-model="itinerario.idPaquete" :options="paquetes" optionLabel="nombre" optionValue="id" filter class="w-full" placeholder="Seleccione" />
        </div>
        <div class="field col-12 md:col-6">
          <label class="block font-bold mb-2">Hora Inicio</label>
          <InputText v-model="itinerario.horaInicio" class="w-full" placeholder="08:00" maxlength="10" />
        </div>
        <div class="field col-12 md:col-6">
          <label class="block font-bold mb-2">Hora Fin</label>
          <InputText v-model="itinerario.horaFin" class="w-full" placeholder="12:00" maxlength="10" />
        </div>
        <div class="field col-12">
          <label class="block font-bold mb-2">Título *</label>
          <InputText v-model="itinerario.titulo" class="w-full" maxlength="100" />
        </div>
        <div class="field col-12">
          <label class="block font-bold mb-2">Descripción</label>
          <Textarea v-model="itinerario.descripcion" class="w-full" rows="3" />
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
