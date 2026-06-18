<script lang="ts" setup>
import type { Transporte } from '@/models/transporte'
import TransporteList from '@/components/transporte/TransporteList.vue'
import TransporteSave from '@/components/transporte/TransporteSave.vue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const transporteListRef = ref<typeof TransporteList | null>(null)
const transporteEdit = ref<Transporte | undefined>(undefined)

function handleCreate() {
  transporteEdit.value = undefined
  mostrarDialog.value = true
}

function handleEdit(transporte: Transporte) {
  transporteEdit.value = transporte
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  transporteListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">Transportes</h2>
      <button class="app-btn app-btn-primary" @click="handleCreate">
        <i class="pi pi-plus"></i> Crear Nuevo
      </button>
    </div>
    <TransporteList ref="transporteListRef" @edit="handleEdit" />
    <TransporteSave
      :mostrar="mostrarDialog"
      :transporte="transporteEdit"
      :modoEdicion="!!transporteEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>