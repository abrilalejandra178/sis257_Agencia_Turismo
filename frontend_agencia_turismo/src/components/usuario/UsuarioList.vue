<script setup lang="ts">
import type { Usuario } from '@/models/usuario'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'usuarios'
const usuarios = ref<Usuario[]>([])
const emit = defineEmits(['edit'])
const usuarioDelete = ref<Usuario | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  usuarios.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(usuario: Usuario) {
  emit('edit', usuario)
}

function mostrarEliminarConfirm(usuario: Usuario) {
  usuarioDelete.value = usuario
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${usuarioDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      usuario.usuario.toLowerCase().includes(busqueda.value.toLowerCase()),
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre, usuario o email" />
      </InputGroup>
    </div>
    <DataTable
      :value="usuariosFiltrados"
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
      <Column field="usuario" header="Usuario" sortable />
      <Column field="nombre" header="Nombre" sortable />
      <Column field="apellido" header="Apellido" sortable />
      <Column field="email" header="Email" sortable />
      <Column field="país" header="País" sortable />
      <Column field="teléfono" header="Teléfono" sortable />
      <Column field="rol" header="Rol" sortable>
        <template #body="{ data }">
          <span class="px-2 py-1 rounded-full text-xs font-semibold capitalize"
            :class="data.rol === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'">
            {{ data.rol }}
          </span>
        </template>
      </Column>
      <Column header="Acciones" style="min-width: 120px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
          <Button icon="pi pi-trash" aria-label="Eliminar" text @click="mostrarEliminarConfirm(data)" />
        </template>
      </Column>
      <template #empty>
        <div class="p-4 text-center text-gray-500">No se encontraron usuarios.</div>
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
