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
  <div class="destino-container">
    <h2 class="titulo">Destinos</h2>

    <Button label="Crear Nuevo" icon="pi pi-plus" class="btn-crear" @click="handleCreate" />

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

<style scoped>
.titulo {
  color: #fcfcfd;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.btn-crear {
  background-color: #0acaaa !important;
  border-color: #4caf50 !important;
  margin-bottom: 1rem;
}
.btn-crear:hover {
  background-color: #388e3c !important;
  border-color: #388e3c !important;
}
</style>
