<script setup lang="ts">
import type { Transporte } from '@/models/transporte'
import http from '@/plugins/axios'
import { Select, Textarea } from 'primevue'
import Dialog from 'primevue/dialog'
import { computed, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/utils/error'

const ENDPOINT = 'transportes'
const props = defineProps({
  mostrar: Boolean,
  transporte: {
    type: Object as () => Transporte,
    default: () => ({}) as Transporte,
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

const transporte = ref<Transporte>({ ...props.transporte })
watch(
  () => props.transporte,
  (newVal) => {
    transporte.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      tipo: transporte.value.tipo,
      empresa: transporte.value.empresa,
      descripcion: transporte.value.descripcion,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${transporte.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    transporte.value = {} as Transporte
    dialogVisible.value = false
  } catch (error: unknown) {
    alert(getApiErrorMessage(error, 'Error guardando transporte'))
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Transporte'"
      style="width: 28rem"
    >
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label for="tipo" class="block font-bold mb-2">Tipo *</label>
          <Select
            id="tipo"
            v-model="transporte.tipo"
            :options="[
              { label: 'Avión', value: 'AVION' },
              { label: 'Bus', value: 'BUS' },
              { label: 'Minibús', value: 'MINIBUS' },
              { label: 'Camioneta', value: 'CAMIONETA' },
              { label: 'Barco', value: 'BARCO' },
              { label: 'Tren', value: 'TREN' },
              { label: 'Privado', value: 'PRIVADO' },
              { label: 'Motorizado', value: 'MOTORIZADO' },
              { label: 'Bicicleta', value: 'BICICLETA' },
              { label: 'Caminata', value: 'CAMINATA' },
            ]"
            optionLabel="label"
            optionValue="value"
            filter
            class="w-full"
            placeholder="Seleccione tipo"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="empresa" class="block font-bold mb-2">Empresa</label>
          <Select
            id="empresa"
            v-model="transporte.empresa"
            :options="[
              { label: 'BOA', value: 'BOA' },
              { label: 'Trans Copacabana', value: 'TRANS_COPACABANA' },
              { label: 'Titicaca', value: 'TITICACA' },
              { label: 'Nueva Americana', value: 'NUEVA_AMERICANA' },
              { label: 'Viajes Oficial', value: 'VIAJES_OFICIAL' },
              { label: 'Cuestas', value: 'CUESTAS' },
              { label: 'Amazonas', value: 'AMAZONAS' },
              { label: 'Bolívar', value: 'BOLIVAR' },
              { label: 'El Salvador', value: 'EL_SALVADOR' },
              { label: 'Florida', value: 'FLORIDA' },
              { label: 'Panamericana', value: 'PANAMERICANA' },
              { label: 'Otro', value: 'OTRO' },
            ]"
            optionLabel="label"
            optionValue="value"
            filter
            class="w-full"
            placeholder="Seleccione empresa"
          />
        </div>
        <div class="field col-12">
          <label for="descripcion" class="block font-bold mb-2">Descripción</label>
          <Textarea id="descripcion" v-model="transporte.descripcion" class="w-full" rows="3" maxlength="1000" />
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