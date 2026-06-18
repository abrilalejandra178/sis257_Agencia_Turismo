<script setup lang="ts">
import type { Extra } from '@/models/extra'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'extras'
const extras = ref<Extra[]>([])
const emit = defineEmits(['edit'])
const extraDelete = ref<Extra | null>(null)
const mostrarConfirmDialog = ref(false)
const busqueda = ref('')

async function obtenerLista() {
  extras.value = await http.get(ENDPOINT).then((r) => r.data)
}

function emitirEdicion(ex: Extra) {
  emit('edit', ex)
}

function mostrarEliminarConfirm(ex: Extra) {
  extraDelete.value = ex
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.patch(`${ENDPOINT}/${extraDelete.value?.id}/eliminar`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const filtrados = computed(() => {
  return extras.value.filter(
    (ex) =>
      ex.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      ex.tipo.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

onMounted(() => obtenerLista())
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="search-box">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar extra..." />
      </InputGroup>
    </div>
    <DataTable :value="filtrados" paginator :rows="10" scrollable tableStyle="min-width: 50rem">
      <Column field="id" header="ID" sortable style="width: 80px" />
      <Column field="nombre" header="Nombre" sortable />
      <Column field="tipo" header="Tipo" sortable />
      <Column field="precio" header="Precio" sortable>
        <template #body="{ data }">Bs {{ Number(data.precio).toFixed(2) }}</template>
      </Column>
      <Column header="Acciones" style="min-width: 120px">
        <template #body="{ data }">
          <button class="app-btn app-btn-secondary" title="Editar" @click="emitirEdicion(data)">
            <i class="pi pi-pencil"></i>
          </button>
          <button class="app-btn app-btn-danger" title="Eliminar" @click="mostrarEliminarConfirm(data)">
            <i class="pi pi-trash"></i>
          </button>
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar" :style="{ width: '25rem' }">
      <p>¿Eliminar este extra?</p>
      <div class="flex justify-end gap-2">
        <button type="button" class="app-btn app-btn-secondary" @click="mostrarConfirmDialog = false">Cancelar</button>
        <button type="button" class="app-btn app-btn-danger" @click="eliminar">Eliminar</button>
      </div>
    </Dialog>
  </div>
</template>
