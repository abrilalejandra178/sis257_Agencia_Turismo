<script lang="ts" setup>
import type { GuiaTuristico } from '@/models/guia-turistico'
import GuiaTuristicoList from '@/components/guia-turistico/GuiaTuristicoList.vue'
import GuiaTuristicoSave from '@/components/guia-turistico/GuiaTuristicoSave.vue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const guiaListRef = ref<typeof GuiaTuristicoList | null>(null)
const guiaEdit = ref<GuiaTuristico | undefined>(undefined)

function handleCreate() {
  guiaEdit.value = undefined
  mostrarDialog.value = true
}

function handleEdit(guia: GuiaTuristico) {
  guiaEdit.value = guia
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  guiaListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">Guías Turísticos</h2>
      <button class="app-btn app-btn-primary" @click="handleCreate">
        <i class="pi pi-plus"></i> Crear Nuevo
      </button>
    </div>
    <GuiaTuristicoList ref="guiaListRef" @edit="handleEdit" />
    <GuiaTuristicoSave
      :mostrar="mostrarDialog"
      :guia="guiaEdit"
      :modoEdicion="!!guiaEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>