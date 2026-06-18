<script setup lang="ts">
import type { GuiaTuristico } from '@/models/guia-turistico'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText, Rating } from 'primevue'
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

// Permite calificar directo desde la tabla, sin abrir el diálogo de edición.
async function actualizarCalificacion(guia: GuiaTuristico, nuevaCalificacion: number) {
  const calificacionAnterior = guia.calificacion
  guia.calificacion = nuevaCalificacion // actualiza la vista al toque
  try {
    await http.patch(`${ENDPOINT}/${guia.id}`, { calificacion: nuevaCalificacion })
  } catch (error: any) {
    guia.calificacion = calificacionAnterior // revierte si el guardado falla
    alert(error?.response?.data?.message)
  }
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
      guia.apellido.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      guia.idioma.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="mb-4">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre, apellido o idioma" />
      </InputGroup>
    </div>
    <DataTable
      :value="guiasFiltrados"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 25]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} a {last} de {totalRecords}"
      scrollable
      tableStyle="min-width: 50rem"
    >
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text @click="obtenerLista" />
      </template>
      <Column field="id" header="ID" sortable style="width: 80px" />
      <Column field="nombre" header="Nombre" sortable />
      <Column field="apellido" header="Apellido" sortable />
      <Column field="teléfono" header="Teléfono" sortable />
      <Column field="idioma" header="Idioma" sortable />
      <Column field="experiencia" header="Experiencia" sortable />
      <Column field="calificacion" header="Calificación" sortable>
        <template #body="{ data }">
          <Rating :modelValue="data.calificacion" :stars="5" @update:modelValue="(valor) => actualizarCalificacion(data, valor)" />
        </template>
      </Column>
      <Column header="Acciones" style="min-width: 120px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
          <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(data)" />
        </template>
      </Column>
      <template #empty>
        <div class="p-4 text-center text-gray-500">No se encontraron guías.</div>
      </template>
    </DataTable>
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
