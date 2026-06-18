<script lang="ts" setup>
import type { Reserva } from '@/models/reserva'
import ReservaList from '@/components/reserva/ReservaList.vue'
import ReservaSave from '@/components/reserva/ReservaSave.vue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const reservaListRef = ref<typeof ReservaList | null>(null)
const reservaEdit = ref<Reserva | undefined>(undefined)

function handleCreate() {
  reservaEdit.value = undefined
  mostrarDialog.value = true
}

function handleEdit(reserva: Reserva) {
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
    <div class="page-header">
      <h2 class="page-title">Reservas</h2>

    </div>
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
