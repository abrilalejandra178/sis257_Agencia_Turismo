<script lang="ts" setup>
import type { Pago } from '@/models/pago'
import PagoList from '@/components/pago/PagoList.vue'
import PagoSave from '@/components/pago/PagoSave.vue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const pagoListRef = ref<typeof PagoList | null>(null)
const pagoEdit = ref<Pago | undefined>(undefined)

function handleCreate() {
  pagoEdit.value = undefined
  mostrarDialog.value = true
}

function handleEdit(pago: Pago) {
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
  <div>
    <div class="page-header">
      <h2 class="page-title">Pagos</h2>
      <button class="app-btn app-btn-primary" @click="handleCreate">
        <i class="pi pi-plus"></i> Crear Nuevo
      </button>
    </div>
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

<style scoped></style>
