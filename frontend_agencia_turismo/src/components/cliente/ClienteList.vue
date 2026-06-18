<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'clientes'
const clientes = ref<Cliente[]>([])
const emit = defineEmits(['edit'])
const clienteDelete = ref<Cliente | null>(null)
const mostrarConfirmDialog = ref(false)
const busqueda = ref('')

async function obtenerLista() {
  clientes.value = await http.get(ENDPOINT).then((r) => r.data)
}

function emitirEdicion(cliente: Cliente) {
  emit('edit', cliente)
}

function mostrarEliminarConfirm(cliente: Cliente) {
  clienteDelete.value = cliente
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.patch(`${ENDPOINT}/${clienteDelete.value?.id}/eliminar`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const clientesFiltrados = computed(() => {
  return clientes.value.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      c.apellido.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      c.email.toLowerCase().includes(busqueda.value.toLowerCase()),
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar cliente..." />
      </InputGroup>
    </div>
    <DataTable :value="clientesFiltrados" paginator :rows="10" scrollable tableStyle="min-width: 50rem">
      <Column field="id" header="ID" sortable style="width: 80px" />
      <Column field="nombre" header="Nombre" sortable />
      <Column field="apellido" header="Apellido" sortable />
      <Column field="email" header="Email" sortable />
      <Column field="telefono" header="Teléfono" sortable />
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
      <p>¿Eliminar este cliente?</p>
      <div class="flex justify-end gap-2">
        <button type="button" class="app-btn app-btn-secondary" @click="mostrarConfirmDialog = false">Cancelar</button>
        <button type="button" class="app-btn app-btn-danger" @click="eliminar">Eliminar</button>
      </div>
    </Dialog>
  </div>
</template>
