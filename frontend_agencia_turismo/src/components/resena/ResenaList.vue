<script setup lang="ts">
import type { Resena } from '@/models/resena'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'resenas'
const resenas = ref<Resena[]>([])
const emit = defineEmits(['edit'])
const resenaDelete = ref<Resena | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  resenas.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(resena: Resena) {
  emit('edit', resena)
}

function mostrarEliminarConfirm(resena: Resena) {
  resenaDelete.value = resena
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${resenaDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const resenasFiltradas = computed(() => {
  return resenas.value.filter(
    (resena) =>
      resena.comentario.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      resena.usuario?.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      resena.paquetesTuristicos?.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function formatoFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-ES')
}

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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por comentario, usuario o paquete" />
      </InputGroup>
    </div>
    <DataTable
      :value="resenasFiltradas"
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
      <Column field="id" header="#" sortable style="width: 60px" />
      <Column field="usuario.nombre" header="Usuario" sortable />
      <Column field="paquetesTuristicos.nombre" header="Paquete" sortable />
      <Column field="comentario" header="Comentario" sortable>
        <template #body="{ data }">
          <span class="truncate max-w-xs block">{{ data.comentario }}</span>
        </template>
      </Column>
      <Column field="calificacion" header="Calificación" sortable>
        <template #body="{ data }">
          <div class="flex items-center gap-1">
            <span class="text-orange-500 font-bold">{{ data.calificacion }}</span>
            <div class="flex">
              <i v-for="n in 5" :key="n" class="pi text-xs"
                :class="n <= data.calificacion ? 'pi-star-fill text-yellow-400' : 'pi-star text-gray-300'">
              </i>
            </div>
          </div>
        </template>
      </Column>
      <Column field="fecha" header="Fecha" sortable>
        <template #body="{ data }">{{ formatoFecha(data.fecha) }}</template>
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
        <div class="p-4 text-center text-gray-500">No se encontraron reseñas.</div>
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
