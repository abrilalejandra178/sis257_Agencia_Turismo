<script setup lang="ts">
import type { Usuario } from '@/models/usuario'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
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
      usuario.email.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3 mb-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre o email" />
      </InputGroup>
    </div>

    <div class="tabla-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nro.</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>País</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(usuario, index) in usuariosFiltrados" :key="usuario.id">
            <td>{{ index + 1 }}</td>
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.apellido }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.país }}</td>
            <td>{{ usuario.teléfono }}</td>
            <td>
              <Button
                icon="pi pi-pencil"
                aria-label="Editar"
                text
                class="btn-edit"
                @click="emitirEdicion(usuario)"
              />
              <Button
                icon="pi pi-trash"
                aria-label="Eliminar"
                text
                class="btn-delete"
                @click="mostrarEliminarConfirm(usuario)"
              />
            </td>
          </tr>
          <tr v-if="usuariosFiltrados.length === 0">
            <td colspan="7" class="sin-resultados">No se encontraron resultados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" severity="danger" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.tabla-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead tr {
  background-color: #13a191;
}

th {
  padding: 14px 16px;
  text-align: left;
  color: #ffffff;
  font-weight: 700;
  border: none;
}

tbody tr {
  background-color: #f9fffe;
  transition: background-color 0.2s;
}

tbody tr:nth-child(even) {
  background-color: #edfaf8;
}

tbody tr:hover {
  background-color: #c8f0eb;
}

td {
  padding: 12px 16px;
  color: #2d2d2d;
  border-bottom: 1px solid #e0f5f2;
}

.sin-resultados {
  text-align: center;
  color: #aaa;
  padding: 2rem;
}

.btn-edit :deep(.p-button-icon) {
  color: #13a191;
}

.btn-delete :deep(.p-button-icon) {
  color: #e53e3e;
}
</style>
