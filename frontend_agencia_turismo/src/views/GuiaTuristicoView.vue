<script lang="ts" setup>
import GuiaTuristicoList from '@/components/guia-turistico/GuiaTuristicoList.vue'
import GuiaTuristicoSave from '@/components/guia-turistico/GuiaTuristicoSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const guiaListRef = ref<typeof GuiaTuristicoList | null>(null)
const guiaEdit = ref<any>(null)

function handleCreate() {
  guiaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(guia: any) {
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
    <h2>Guías Turísticos</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
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