<script setup lang="ts">
import type { Pago } from '@/models/pago'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'pagos'
const pagos = ref<Pago[]>([])
const emit = defineEmits(['edit'])
const pagoDelete = ref<Pago | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  pagos.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(pago: Pago) {
  emit('edit', pago)
}

function mostrarEliminarConfirm(pago: Pago) {
  pagoDelete.value = pago
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${pagoDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

const pagosFiltrados = computed(() => {
  return pagos.value.filter(
    (pago) =>
      pago.metodoPago.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      pago.estadoPago.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-9 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText
          v-model="busqueda"
          type="text"
          placeholder="Buscar por método o estado de pago"
        />
      </InputGroup>
    </div>
    <DataTable
      :value="pagosFiltrados"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 25]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} a {last} de {totalRecords}"
      scrollable
      tableStyle="min-width: 50rem"
    >
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text @click="obtenerLista" />
      </template>
      <Column field="idReserva" header="ID Reserva" sortable />
      <Column field="monto" header="Monto" sortable>
        <template #body="{ data }">{{ Number(data.monto).toFixed(2) }}</template>
      </Column>
      <Column field="fechaPago" header="Fecha Pago" sortable />
      <Column field="metodoPago" header="Método Pago" sortable />
      <Column field="estadoPago" header="Estado Pago" sortable />
      <Column header="Acciones" style="min-width: 120px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
          <Button
            icon="pi pi-trash"
            aria-label="Eliminar"
            text
            @click="mostrarEliminarConfirm(data)"
          />
        </template>
      </Column>
    </DataTable>
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
