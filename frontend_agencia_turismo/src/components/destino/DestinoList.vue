<script setup lang="ts">
import type { Destino } from '@/models/destino'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'destinos'
const destinos = ref<Destino[]>([])
const emit = defineEmits(['edit'])
const destinoDelete = ref<Destino | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  destinos.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(destino: Destino) {
  emit('edit', destino)
}

function mostrarEliminarConfirm(destino: Destino) {
  destinoDelete.value = destino
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${destinoDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const destinosFiltrados = computed(() => {
  return destinos.value.filter(
    (destino) =>
      destino.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      destino.ubicación.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o ubicación" />
      </InputGroup>
    </div>
    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Ubicación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(destino, index) in destinosFiltrados" :key="destino.id">
          <td>{{ index + 1 }}</td>
          <td>{{ destino.nombre }}</td>
          <td>{{ destino.descripción }}</td>
          <td>{{ destino.ubicación }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(destino)" />
            <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(destino)" />
          </td>
        </tr>
        <tr v-if="destinosFiltrados.length === 0">
          <td colspan="5">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>
    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>