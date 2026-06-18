<script setup lang="ts">
import { ref } from 'vue'
import ItinerarioList from '@/components/itinerario/ItinerarioList.vue'
import ItinerarioSave from '@/components/itinerario/ItinerarioSave.vue'
import type { Itinerario } from '@/models/itinerario'

const mostrarDialog = ref(false)
const modoEdicion = ref(false)
const itinerarioEdit = ref<Itinerario>({} as Itinerario)
const listRef = ref<InstanceType<typeof ItinerarioList>>()

function nuevo() {
  modoEdicion.value = false
  itinerarioEdit.value = {} as Itinerario
  mostrarDialog.value = true
}

function editar(it: Itinerario) {
  modoEdicion.value = true
  itinerarioEdit.value = { ...it }
  mostrarDialog.value = true
}

function onGuardar() {
  mostrarDialog.value = false
  listRef.value?.obtenerLista()
}
</script>

<template>
  <div class="admin-view">
    <div class="page-header">
      <h2 class="page-title">Itinerarios</h2>
      <button class="app-btn app-btn-primary" @click="nuevo">
        <i class="pi pi-plus"></i> Crear Nuevo
      </button>
    </div>
    <ItinerarioList ref="listRef" @edit="editar" />
    <ItinerarioSave :mostrar="mostrarDialog" :modoEdicion="modoEdicion" :itinerario="itinerarioEdit" @guardar="onGuardar" @close="mostrarDialog = false" />
  </div>
</template>

<style scoped>
.admin-view {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
