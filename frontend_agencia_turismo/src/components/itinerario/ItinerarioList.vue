<script setup lang="ts">
import type { Itinerario } from '@/models/itinerario'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'itinerarios'
const itinerarios = ref<Itinerario[]>([])
const emit = defineEmits(['edit'])
const itinerarioDelete = ref<Itinerario | null>(null)
const mostrarConfirmDialog = ref(false)
const busqueda = ref('')

async function obtenerLista() {
  itinerarios.value = await http.get(ENDPOINT).then((r) => r.data)
}

function emitirEdicion(it: Itinerario) {
  emit('edit', it)
}

function mostrarEliminarConfirm(it: Itinerario) {
  itinerarioDelete.value = it
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.patch(`${ENDPOINT}/${itinerarioDelete.value?.id}/eliminar`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const filtrados = computed(() => {
  return itinerarios.value.filter(
    (it) =>
      it.titulo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      it.paquete?.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar itinerario..." />
      </InputGroup>
    </div>
    <DataTable :value="filtrados" paginator :rows="10" scrollable tableStyle="min-width: 50rem">
      <Column field="id" header="ID" sortable style="width: 80px" />
      <Column field="dia" header="Día" sortable />
      <Column field="titulo" header="Título" sortable />
      <Column field="paquete.nombre" header="Paquete" sortable />
      <Column field="horaInicio" header="Inicio" sortable />
      <Column field="horaFin" header="Fin" sortable />
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
      <p>¿Eliminar este itinerario?</p>
      <div class="flex justify-end gap-2">
        <button type="button" class="app-btn app-btn-secondary" @click="mostrarConfirmDialog = false">Cancelar</button>
        <button type="button" class="app-btn app-btn-danger" @click="eliminar">Eliminar</button>
      </div>
    </Dialog>
  </div>
</template>
