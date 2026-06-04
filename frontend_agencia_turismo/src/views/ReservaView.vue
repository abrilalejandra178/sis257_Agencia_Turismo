<script lang="ts" setup>
import ReservaList from '@/components/reserva/ReservaList.vue'
import ReservaSave from '@/components/reserva/ReservaSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const reservaListRef = ref<typeof ReservaList | null>(null)
const reservaEdit = ref<any>(null)

function handleCreate() {
  reservaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(reserva: any) {
  reservaEdit.value = reserva
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  reservaListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <h2>Reservas</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <ReservaList ref="reservaListRef" @edit="handleEdit" />
    <ReservaSave
      :mostrar="mostrarDialog"
      :reserva="reservaEdit"
      :modoEdicion="!!reservaEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
