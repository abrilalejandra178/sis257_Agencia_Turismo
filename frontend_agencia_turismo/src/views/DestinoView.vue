<script lang="ts" setup>
import DestinoList from '@/components/destino/DestinoList.vue'
import DestinoSave from '@/components/destino/DestinoSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const destinoListRef = ref<typeof DestinoList | null>(null)
const destinoEdit = ref<any>(null)

function handleCreate() {
  destinoEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(destino: any) {
  destinoEdit.value = destino
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  destinoListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <h2>Destinos</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <DestinoList ref="destinoListRef" @edit="handleEdit" />
    <DestinoSave
      :mostrar="mostrarDialog"
      :destino="destinoEdit"
      :modoEdicion="!!destinoEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>