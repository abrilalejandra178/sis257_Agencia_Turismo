<script setup lang="ts">
import type { Transporte } from '@/models/transporte'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'transportes'
const transportes = ref<Transporte[]>([])
const emit = defineEmits(['edit'])
const transporteDelete = ref<Transporte | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  transportes.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(transporte: Transporte) {
  emit('edit', transporte)
}

function mostrarEliminarConfirm(transporte: Transporte) {
  transporteDelete.value = transporte
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${transporteDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const transportesFiltrados = computed(() => {
  return transportes.value.filter(
    (transporte) =>
      transporte.tipo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      transporte.empresa.toLowerCase().includes(busqueda.value.toLowerCase()),
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por tipo o empresa" />
      </InputGroup>
    </div>
    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Tipo</th>
          <th>Empresa</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transporte, index) in transportesFiltrados" :key="transporte.id">
          <td>{{ index + 1 }}</td>
          <td>{{ transporte.tipo }}</td>
          <td>{{ transporte.empresa }}</td>
          <td>{{ transporte.descripcion }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(transporte)" />
            <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(transporte)" />
          </td>
        </tr>
        <tr v-if="transportesFiltrados.length === 0">
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