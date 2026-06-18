<script setup lang="ts">
import { ref } from 'vue'
import ExtraList from '@/components/extra/ExtraList.vue'
import ExtraSave from '@/components/extra/ExtraSave.vue'
import type { Extra } from '@/models/extra'

const mostrarDialog = ref(false)
const modoEdicion = ref(false)
const extraEdit = ref<Extra>({} as Extra)
const listRef = ref<InstanceType<typeof ExtraList>>()

function nuevo() {
  modoEdicion.value = false
  extraEdit.value = {} as Extra
  mostrarDialog.value = true
}

function editar(ex: Extra) {
  modoEdicion.value = true
  extraEdit.value = { ...ex }
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
      <h2 class="page-title">Extras</h2>
      <button class="app-btn app-btn-primary" @click="nuevo">
        <i class="pi pi-plus"></i> Crear Nuevo
      </button>
    </div>
    <ExtraList ref="listRef" @edit="editar" />
    <ExtraSave :mostrar="mostrarDialog" :modoEdicion="modoEdicion" :extra="extraEdit" @guardar="onGuardar" @close="mostrarDialog = false" />
  </div>
</template>

<style scoped>
.admin-view {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
