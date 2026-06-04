<script lang="ts" setup>
import PaqueteTuristicoList from '@/components/paquete-turistico/PaqueteTuristicoList.vue'
import PaqueteTuristicoSave from '@/components/paquete-turistico/PaqueteTuristicoSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const paqueteListRef = ref<typeof PaqueteTuristicoList | null>(null)
const paqueteEdit = ref<any>(null)

function handleCreate() {
  paqueteEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(paquete: any) {
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
  <div class="page-paquetes">
    <h2>Paquetes Turísticos</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
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

<style scoped>
.page-paquetes {
  background-image: url('/images/paquete.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  margin: -1.5rem;
  padding: 1.5rem;
}
</style>
