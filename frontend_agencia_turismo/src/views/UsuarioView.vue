<script lang="ts" setup>
import UsuarioList from '@/components/usuario/UsuarioList.vue'
import UsuarioSave from '@/components/usuario/UsuarioSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const usuarioListRef = ref<typeof UsuarioList | null>(null)
const usuarioEdit = ref<any>(null)

function handleCreate() {
  usuarioEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(usuario: any) {
  usuarioEdit.value = usuario
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  usuarioListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <h2>Usuarios</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <UsuarioList ref="usuarioListRef" @edit="handleEdit" />
    <UsuarioSave
      :mostrar="mostrarDialog"
      :usuario="usuarioEdit"
      :modoEdicion="!!usuarioEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
