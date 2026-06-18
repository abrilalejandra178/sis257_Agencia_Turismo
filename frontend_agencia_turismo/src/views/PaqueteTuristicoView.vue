<script lang="ts" setup>
import type { PaqueteTuristico } from '@/models/paquete-turistico'
import PaqueteTuristicoList from '@/components/paquete-turistico/PaqueteTuristicoList.vue'
import PaqueteTuristicoSave from '@/components/paquete-turistico/PaqueteTuristicoSave.vue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const paqueteListRef = ref<typeof PaqueteTuristicoList | null>(null)
const paqueteEdit = ref<PaqueteTuristico | undefined>(undefined)

function handleCreate() {
  paqueteEdit.value = undefined
  mostrarDialog.value = true
}

function handleEdit(paquete: PaqueteTuristico) {
  paqueteEdit.value = paquete
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  paqueteListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">Paquetes Turísticos</h2>
      <button class="app-btn app-btn-primary" @click="handleCreate">
        <i class="pi pi-plus"></i> Crear Nuevo
      </button>
    </div>
    <PaqueteTuristicoList ref="paqueteListRef" @edit="handleEdit" />
    <PaqueteTuristicoSave
      :mostrar="mostrarDialog"
      :paquete="paqueteEdit"
      :modoEdicion="!!paqueteEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>