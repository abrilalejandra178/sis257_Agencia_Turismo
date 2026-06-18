<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'
import { getApiErrorMessage } from '@/utils/error'

const ENDPOINT = 'clientes'
const props = defineProps({
  mostrar: Boolean,
  cliente: { type: Object as () => Cliente, default: () => ({}) as Cliente },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => { if (!value) emit('close') },
})

const cliente = ref<Cliente>({ ...props.cliente })

watch(() => props.cliente, (newVal) => { cliente.value = { ...newVal } })

async function handleSave() {
  try {
    const body = {
      nombre: cliente.value.nombre,
      apellido: cliente.value.apellido,
      email: cliente.value.email,
      telefono: cliente.value.telefono,
      documento: cliente.value.documento,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${cliente.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar', { ...cliente.value })
    cliente.value = {} as Cliente
    dialogVisible.value = false
  } catch (error: unknown) {
    alert(getApiErrorMessage(error, 'Error guardando cliente'))
  }
}

watch(() => props.mostrar, (nuevo) => {
  if (nuevo) {
    if (props.cliente?.id) cliente.value = { ...props.cliente }
    else cliente.value = {} as Cliente
  }
})
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialogVisible" :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Cliente'"
      style="width: 30rem">
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label class="block font-bold mb-2">Nombre *</label>
          <InputText v-model="cliente.nombre" class="w-full" maxlength="50" autofocus />
        </div>
        <div class="field col-12 md:col-6">
          <label class="block font-bold mb-2">Apellido *</label>
          <InputText v-model="cliente.apellido" class="w-full" maxlength="50" />
        </div>
        <div class="field col-12 md:col-6">
          <label class="block font-bold mb-2">Email *</label>
          <InputText v-model="cliente.email" type="email" class="w-full" maxlength="100" />
        </div>
        <div class="field col-12 md:col-6">
          <label class="block font-bold mb-2">Teléfono</label>
          <InputText v-model="cliente.telefono" class="w-full" maxlength="20" />
        </div>
        <div class="field col-12 md:col-6">
          <label class="block font-bold mb-2">Documento</label>
          <InputText v-model="cliente.documento" class="w-full" maxlength="20" />
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
