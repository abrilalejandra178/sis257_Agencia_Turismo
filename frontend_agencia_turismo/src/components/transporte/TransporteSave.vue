<script setup lang="ts">
import type { Transporte } from '@/models/transporte'
import http from '@/plugins/axios'
import { Textarea } from 'primevue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

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
  } catch (error: any) {
    alert(error?.response?.data?.message)
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
      <div class="flex items-center gap-4 mb-4">
        <label for="tipo" class="font-semibold w-3">Tipo</label>
        <Select
          id="tipo"
          v-model="transporte.tipo"
          :options="['Bus', 'Minibús', 'Auto', 'Camioneta', 'Bicicleta', 'Motocicleta', 'Avión', 'Barco']"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="empresa" class="font-semibold w-3">Empresa</label>
        <Select
          id="empresa"
          v-model="transporte.empresa"
          :options="['Trans Copacabana', 'Bolivia Bus', 'Flota Yungas', 'Trans Potosí', 'Turbus', 'Otra']"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="descripcion" class="font-semibold w-3">Descripción</label>
        <Textarea id="descripcion" v-model="transporte.descripcion" class="flex-auto" rows="3" maxlength="1000" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" @click="dialogVisible = false" />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>