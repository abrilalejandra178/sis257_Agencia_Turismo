<script lang="ts" setup>
import PagoList from '@/components/pago/PagoList.vue'
import PagoSave from '@/components/pago/PagoSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const pagoListRef = ref<typeof PagoList | null>(null)
const pagoEdit = ref<any>(null)

function handleCreate() {
  pagoEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(pago: any) {
  pagoEdit.value = pago
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  pagoListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="page-pagos">
    <h2>Pagos</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <PagoList ref="pagoListRef" @edit="handleEdit" />
    <PagoSave
      :mostrar="mostrarDialog"
      :pago="pagoEdit"
      :modoEdicion="!!pagoEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped>
.page-pagos {
  background-image: url('/images/pago.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  margin: -1.5rem;
  padding: 1.5rem;
}
</style>
