<script setup lang="ts">
import { ref } from 'vue'
import ClienteList from '@/components/cliente/ClienteList.vue'
import ClienteSave from '@/components/cliente/ClienteSave.vue'
import type { Cliente } from '@/models/cliente'

const mostrarDialog = ref(false)
const modoEdicion = ref(false)
const clienteEdit = ref<Cliente>({} as Cliente)
const clienteListRef = ref<InstanceType<typeof ClienteList>>()

function nuevoCliente() {
  modoEdicion.value = false
  clienteEdit.value = {} as Cliente
  mostrarDialog.value = true
}

function editarCliente(cliente: Cliente) {
  modoEdicion.value = true
  clienteEdit.value = { ...cliente }
  mostrarDialog.value = true
}

function onGuardar() {
  mostrarDialog.value = false
  clienteListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="admin-view">
    <div class="page-header">
      <h2 class="page-title">Clientes</h2>
      <button class="app-btn app-btn-primary" @click="nuevoCliente">
        <i class="pi pi-plus"></i> Crear Nuevo
      </button>
    </div>
    <ClienteList ref="clienteListRef" @edit="editarCliente" />
    <ClienteSave :mostrar="mostrarDialog" :modoEdicion="modoEdicion" :cliente="clienteEdit" @guardar="onGuardar" @close="mostrarDialog = false" />
  </div>
</template>

<style scoped>
.admin-view {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
