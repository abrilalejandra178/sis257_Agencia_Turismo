<script lang="ts" setup>
import TransporteList from '@/components/transporte/TransporteList.vue'
import TransporteSave from '@/components/transporte/TransporteSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const transporteListRef = ref<typeof TransporteList | null>(null)
const transporteEdit = ref<any>(null)

function handleCreate() {
  transporteEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(transporte: any) {
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
    <h2>Transportes</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
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