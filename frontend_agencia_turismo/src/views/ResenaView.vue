<script lang="ts" setup>
import ResenaList from '@/components/resena/ResenaList.vue'
import ResenaSave from '@/components/resena/ResenaSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const resenaListRef = ref<typeof ResenaList | null>(null)
const resenaEdit = ref<any>(null)

function handleCreate() {
  resenaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(resena: any) {
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
  <div class="page-resenas">
    <h2>Reseñas</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
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

<style scoped>
.page-resenas {
  background-image: url('/images/rese.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  margin: -1.5rem;
  padding: 1.5rem;
}
</style>
