<script setup lang="ts">
import type { Extra } from '@/models/extra'
import http from '@/plugins/axios'
import { InputNumber, Select, Textarea } from 'primevue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/utils/error'

const ENDPOINT = 'extras'
const props = defineProps({
  mostrar: Boolean,
  extra: { type: Object as () => Extra, default: () => ({}) as Extra },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => { if (!value) emit('close') },
})

const extra = ref<Extra>({ ...props.extra })

watch(() => props.extra, (newVal) => { extra.value = { ...newVal } })

const tiposExtra = [
  { label: 'Servicio', value: 'SERVICIO' },
  { label: 'Actividad', value: 'ACTIVIDAD' },
  { label: 'Equipamiento', value: 'EQUIPAMIENTO' },
  { label: 'Alimentación', value: 'ALIMENTACION' },
  { label: 'Seguro', value: 'SEGURO' },
  { label: 'Entrada turística', value: 'ENTRADA_TURISTICA' },
  { label: 'Bebidas', value: 'BEBIDAS' },
  { label: 'Souvenir', value: 'SOUVENIR' },
  { label: 'Transporte adicional', value: 'TRANSPORTE_ADICIONAL' },
]

async function handleSave() {
  try {
    const body = {
      nombre: extra.value.nombre,
      descripcion: extra.value.descripcion,
      precio: extra.value.precio,
      tipo: extra.value.tipo,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${extra.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    extra.value = {} as Extra
    dialogVisible.value = false
  } catch (error: unknown) {
    alert(getApiErrorMessage(error, 'Error guardando extra'))
  }
}

watch(() => props.mostrar, (nuevo) => {
  if (nuevo) {
    if (props.extra?.id) extra.value = { ...props.extra }
    else extra.value = {} as Extra
  }
})
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialogVisible" :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Extra'" style="width: 38rem">
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label class="block font-bold mb-2">Nombre *</label>
          <InputText v-model="extra.nombre" class="w-full" maxlength="100" autofocus />
        </div>
        <div class="field col-12 md:col-6">
          <label class="block font-bold mb-2">Tipo *</label>
          <Select v-model="extra.tipo" :options="tiposExtra" optionLabel="label" optionValue="value" filter class="w-full" placeholder="Seleccione" />
        </div>
        <div class="field col-12 md:col-6">
          <label class="block font-bold mb-2">Precio *</label>
          <InputNumber v-model="extra.precio" class="w-full" :min="0" :minFractionDigits="2" :maxFractionDigits="2" />
        </div>
        <div class="field col-12">
          <label class="block font-bold mb-2">Descripción</label>
          <Textarea v-model="extra.descripcion" class="w-full" rows="3" />
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
