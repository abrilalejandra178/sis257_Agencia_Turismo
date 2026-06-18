<script lang="ts" setup>
import type { Resena } from '@/models/resena'
import ResenaList from '@/components/resena/ResenaList.vue'
import ResenaSave from '@/components/resena/ResenaSave.vue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const resenaListRef = ref<typeof ResenaList | null>(null)
const resenaEdit = ref<Resena | undefined>(undefined)

function handleCreate() {
  resenaEdit.value = undefined
  mostrarDialog.value = true
}

function handleEdit(resena: Resena) {
  resenaEdit.value = resena
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  resenaListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">Reseñas</h2>
      <button class="app-btn app-btn-primary" @click="handleCreate">
        <i class="pi pi-plus"></i> Crear Nuevo
      </button>
    </div>
    <ResenaList ref="resenaListRef" @edit="handleEdit" />
    <ResenaSave
      :mostrar="mostrarDialog"
      :resena="resenaEdit"
      :modoEdicion="!!resenaEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
