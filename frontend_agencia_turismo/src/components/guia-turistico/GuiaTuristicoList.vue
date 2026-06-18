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
      guia.idioma?.some((i: string) => i.toLowerCase().includes(busqueda.value.toLowerCase())),
  )
})

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="search-box">
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
      <Column field="idioma" header="Idioma" sortable>
        <template #body="{ data }">
          <span v-for="lang in data.idioma" :key="lang" class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">
            {{ lang }}
          </span>
        </template>
      </Column>
      <Column field="experiencia" header="Experiencia" sortable />
      <Column field="calificación" header="Calificación" sortable>
        <template #body="{ data }">
          <Rating v-model="data.calificación" :stars="5" :cancel="false" readonly />
        </template>
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
      <template #empty>
        <div class="p-4 text-center text-gray-500">No se encontraron guías.</div>
      </template>
    </DataTable>
    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <button type="button" class="app-btn app-btn-secondary" @click="mostrarConfirmDialog = false">Cancelar</button>
        <button type="button" class="app-btn app-btn-danger" @click="eliminar">Eliminar</button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
