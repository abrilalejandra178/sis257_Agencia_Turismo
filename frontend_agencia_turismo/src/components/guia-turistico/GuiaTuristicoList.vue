<script setup lang="ts">
import type { GuiaTuristico } from '@/models/guia-turistico'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'guias-turisticos'
const guias = ref<GuiaTuristico[]>([])
const emit = defineEmits(['edit'])
const guiaDelete = ref<GuiaTuristico | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  guias.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(guia: GuiaTuristico) {
  emit('edit', guia)
}

function mostrarEliminarConfirm(guia: GuiaTuristico) {
  guiaDelete.value = guia
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${guiaDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const guiasFiltrados = computed(() => {
  return guias.value.filter(
    (guia) =>
      guia.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      guia.apellido.toLowerCase().includes(busqueda.value.toLowerCase()),
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o apellido" />
      </InputGroup>
    </div>
    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Teléfono</th>
          <th>Idioma</th>
          <th>Calificación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(guia, index) in guiasFiltrados" :key="guia.id">
          <td>{{ index + 1 }}</td>
          <td>{{ guia.nombre }}</td>
          <td>{{ guia.apellido }}</td>
          <td>{{ guia.teléfono }}</td>
          <td>{{ guia.idioma }}</td>
          <td>{{ guia.calificación }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(guia)" />
            <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(guia)" />
          </td>
        </tr>
        <tr v-if="guiasFiltrados.length === 0">
          <td colspan="7">No se encontraron resultados.</td>
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