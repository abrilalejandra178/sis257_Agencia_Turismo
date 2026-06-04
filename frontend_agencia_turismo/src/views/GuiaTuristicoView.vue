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
  <div class="page-guias">
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

<style scoped>
.page-guias {
  background-image: url('/images/bg_3.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  margin: -1.5rem;
  padding: 1.5rem;
}
</style>