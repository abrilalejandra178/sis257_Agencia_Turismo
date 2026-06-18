<script lang="ts" setup>
import type { Destino } from '@/models/destino'
import DestinoList from '@/components/destino/DestinoList.vue'
import DestinoSave from '@/components/destino/DestinoSave.vue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const destinoListRef = ref<typeof DestinoList | null>(null)
const destinoEdit = ref<Destino | undefined>(undefined)

function handleCreate() {
  destinoEdit.value = undefined
  mostrarDialog.value = true
}

function handleEdit(destino: Destino) {
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
    <div class="page-header">
      <h2 class="page-title">Destinos</h2>
      <button class="app-btn app-btn-primary" @click="handleCreate">
        <i class="pi pi-plus"></i> Crear Nuevo
      </button>
    </div>
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