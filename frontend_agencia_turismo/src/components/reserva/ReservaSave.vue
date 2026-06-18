<script setup lang="ts">
import type { Reserva } from '@/models/reserva'
import type { Usuario } from '@/models/usuario'
import type { PaqueteTuristico } from '@/models/paquete-turistico'
import http from '@/plugins/axios'
import { InputNumber, Select, Textarea } from 'primevue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'reservas'
const props = defineProps({
  mostrar: Boolean,
  reserva: {
    type: Object as () => Reserva,
    default: () => ({}) as Reserva,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

// CAMBIO (requisito #6): no se permite elegir una fecha pasada
const fechaMinima = new Date().toISOString().slice(0, 10)

// CAMBIO (requisito #2): opciones del estado de la reserva (antes era texto libre)
const opcionesEstado = [
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Confirmada', value: 'confirmada' },
  { label: 'Pagada', value: 'pagada' },
  { label: 'Cancelada', value: 'cancelada' },
  { label: 'Completada', value: 'completada' },
]

const usuarios = ref<Usuario[]>([])
const paquetes = ref<PaqueteTuristico[]>([])
const reserva = ref<Reserva>({ ...props.reserva })

// CAMBIO (requisito #7): resultado de la búsqueda de cliente frecuente
const buscandoCliente = ref(false)
const resultadoBusquedaCliente = ref<{ totalReservas: number; esClienteFrecuente: boolean } | null>(
  null,
)

watch(
  () => props.reserva,
  (newVal) => {
    reserva.value = { ...newVal }
    resultadoBusquedaCliente.value = null
  },
)

// Si el usuario cambia el nombre/teléfono, se invalida la búsqueda anterior
watch([() => reserva.value.nombreCliente, () => reserva.value.telefonoCliente], () => {
  resultadoBusquedaCliente.value = null
})

async function cargarDatos() {
  usuarios.value = await http.get('usuarios').then((res) => res.data)
  paquetes.value = await http.get('paquetes-turisticos').then((res) => res.data)
}

// CAMBIO (requisito #7): busca por nombre, teléfono o email para saber
// si la persona ya hizo reservas antes (cliente frecuente).
async function buscarClienteFrecuente() {
  const query = (reserva.value.nombreCliente || reserva.value.telefonoCliente || '').trim()
  if (!query) {
    alert('Ingrese el nombre o teléfono del cliente para buscar')
    return
  }
  buscandoCliente.value = true
  try {
    const { data } = await http.get(`${ENDPOINT}/buscar-cliente`, { params: { query } })
    resultadoBusquedaCliente.value = data
  } catch (error) {
    resultadoBusquedaCliente.value = null
  } finally {
    buscandoCliente.value = false
  }
}

async function handleSave() {
  try {
    // CAMBIO (requisito #2): al cancelar la reserva se exige el motivo
    if (reserva.value.estado === 'cancelada' && !reserva.value.motivoCancelacion?.trim()) {
      alert('Debe indicar el motivo de la cancelación')
      return
    }

    const body = {
      nombreCliente: reserva.value.nombreCliente,
      telefonoCliente: reserva.value.telefonoCliente || undefined,
      emailCliente: reserva.value.emailCliente || undefined,
      fechaReserva: reserva.value.fechaReserva,
      fechaViaje: reserva.value.fechaViaje || undefined,
      cantidadPersonas: reserva.value.cantidadPersonas,
      total: reserva.value.total,
      adelanto: reserva.value.adelanto,
      saldoPendiente: reserva.value.saldoPendiente,
      estado: reserva.value.estado,
      idUsuario: reserva.value.idUsuario,
      idPaquete: reserva.value.idPaquete,
      // CAMBIO (requisito #2): motivo de cancelación / baja
      motivoCancelacion: reserva.value.motivoCancelacion || undefined,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${reserva.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    reserva.value = {} as Reserva
    resultadoBusquedaCliente.value = null
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  async (nuevoValor) => {
    if (nuevoValor) {
      await cargarDatos()
      resultadoBusquedaCliente.value = null
      if (props.reserva?.id) {
        reserva.value = { ...props.reserva }
      } else {
        reserva.value = {} as Reserva
      }
    }
  },
)

// 🔥 AQUÍ VA EL COMPUTED (FUERA DEL WATCH)
const cambio = computed(() => {
  const total = reserva.value.total || 0
  const adelanto = reserva.value.adelanto || 0

  return adelanto > total ? adelanto - total : 0
})

</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Reserva'"
      style="width: 34rem"
    >
      <!-- CAMBIO: datos del cliente (antes no estaban en este formulario) -->
      <div class="flex items-center gap-4 mb-4">
        <label for="nombreCliente" class="font-semibold w-4">Cliente</label>
        <InputText
          id="nombreCliente"
          v-model="reserva.nombreCliente"
          class="flex-auto"
          maxlength="100"
          placeholder="Nombre completo del cliente"
        />
        <!-- CAMBIO (requisito #7): búsqueda de cliente frecuente -->
        <Button
          type="button"
          icon="pi pi-search"
          :loading="buscandoCliente"
          @click="buscarClienteFrecuente"
        />
      </div>
      <div v-if="resultadoBusquedaCliente" class="mb-4 -mt-2">
        <span
          v-if="resultadoBusquedaCliente.esClienteFrecuente"
          class="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
        >
          <i class="pi pi-star-fill"></i>
          Cliente frecuente ({{ resultadoBusquedaCliente.totalReservas }} reservas anteriores)
        </span>
        <span v-else class="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
          Cliente nuevo (sin reservas anteriores)
        </span>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="telefonoCliente" class="font-semibold w-4">Teléfono</label>
        <InputText id="telefonoCliente" v-model="reserva.telefonoCliente" class="flex-auto" maxlength="20" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="emailCliente" class="font-semibold w-4">Email</label>
        <InputText id="emailCliente" v-model="reserva.emailCliente" class="flex-auto" maxlength="100" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="usuario" class="font-semibold w-4">Registrado por</label>
        <Select
          id="usuario"
          v-model="reserva.idUsuario"
          :options="usuarios"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="paquete" class="font-semibold w-4">Paquete</label>
        <Select
          id="paquete"
          v-model="reserva.idPaquete"
          :options="paquetes"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fechaReserva" class="font-semibold w-4">Fecha Reserva</label>
        <!-- CAMBIO (requisito #6): no se permiten fechas pasadas -->
        <InputText
          id="fechaReserva"
          v-model="reserva.fechaReserva as any"
          type="date"
          class="flex-auto"
          :min="fechaMinima"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fechaViaje" class="font-semibold w-4">Fecha Viaje</label>
        <InputText
          id="fechaViaje"
          v-model="reserva.fechaViaje as any"
          type="date"
          class="flex-auto"
          :min="fechaMinima"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="cantidadPersonas" class="font-semibold w-4">Personas</label>
        <InputNumber
          id="cantidadPersonas"
          v-model="reserva.cantidadPersonas"
          class="flex-auto"
          :min="1"
          showButtons
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="total" class="font-semibold w-4">Total</label>
        <InputNumber
          id="total"
          v-model="reserva.total"
          class="flex-auto"
          :min="0"
          :minFractionDigits="2"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="adelanto" class="font-semibold w-4">Adelanto</label>
        <InputNumber
          id="adelanto"
          v-model="reserva.adelanto"
          class="flex-auto"
          :min="0"
          :minFractionDigits="2"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="saldoPendiente" class="font-semibold w-4">Saldo Pendiente</label>
        <InputNumber
          id="saldoPendiente"
          v-model="reserva.saldoPendiente"
          class="flex-auto"
          :min="0"
          :minFractionDigits="2"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="estado" class="font-semibold w-4">Estado</label>
        <!-- CAMBIO (requisito #2): select en lugar de texto libre -->
        <Select
          id="estado"
          v-model="reserva.estado"
          :options="opcionesEstado"
          optionLabel="label"
          optionValue="value"
          class="flex-auto"
        />
      </div>
      <!-- CAMBIO (requisito #2): motivo obligatorio cuando se cancela la reserva -->
      <div v-if="reserva.estado === 'cancelada'" class="flex items-center gap-4 mb-4">
        <label for="motivoCancelacion" class="font-semibold w-4">Motivo cancelación</label>
        <Textarea
          id="motivoCancelacion"
          v-model="reserva.motivoCancelacion"
          class="flex-auto"
          rows="2"
          maxlength="255"
          placeholder="¿Por qué se cancela esta reserva?"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
