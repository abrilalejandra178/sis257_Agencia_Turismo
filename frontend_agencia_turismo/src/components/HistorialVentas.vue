<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVentasStore } from '@/stores/ventas'

const ventasStore = useVentasStore()
const filtro = ref('todos')
const cargando = ref(false)
const error = ref('')

onMounted(async () => {
  await cargarVentas()
})

async function cargarVentas() {
  cargando.value = true
  error.value = ''
  try {
    await ventasStore.obtenerVentas(filtro.value as any)
  } catch (err) {
    error.value = 'Error cargando historial de ventas'
  } finally {
    cargando.value = false
  }
}

async function cambiarFiltro(nuevoFiltro: string) {
  filtro.value = nuevoFiltro
  await cargarVentas()
}

function getEstadoColor(estado: string) {
  switch (estado) {
    case 'pagada':
      return 'bg-green-100 text-green-800'
    case 'confirmada':
      return 'bg-blue-100 text-blue-800'
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelada':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

async function cancelarReserva(idReserva: number) {
  // CAMBIO (requisito #2): se solicita el motivo antes de cancelar
  const motivo = prompt('Ingrese el motivo de la cancelación:')
  if (motivo === null) return // el usuario presionó "Cancelar" en el prompt
  if (!motivo.trim()) {
    error.value = 'Debe indicar un motivo para cancelar la reserva'
    return
  }

  try {
    await ventasStore.cancelarReserva(idReserva, motivo.trim())
    await cargarVentas()
  } catch (err) {
    error.value = 'Error cancelando la reserva'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h3 class="text-lg font-bold mb-4 text-gray-800">Filtros</h3>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="f in ['hoy', 'semana', 'mes', 'todos']"
          :key="f"
          @click="cambiarFiltro(f)"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition capitalize',
            filtro === f
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ f }}
        </button>
      </div>
    </div>

    <!-- Mensajes -->
    <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      {{ error }}
    </div>

    <!-- Tabla de ventas -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div v-if="cargando" class="p-12 text-center">
        <div class="inline-block animate-spin">
          <svg class="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>

      <div v-else-if="ventasStore.historialVentas.length === 0" class="p-12 text-center text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p>No hay registros para este período</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Paquete</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pagado</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Saldo</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="venta in ventasStore.historialVentas"
              :key="venta.id"
              class="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 text-sm text-gray-900">#{{ venta.id }}</td>
              <td class="px-6 py-4 text-sm">
                <div class="font-semibold text-gray-900">{{ venta.nombreCliente }}</div>
                <div class="text-xs text-gray-500">{{ venta.telefonoCliente }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ venta.paquetesTuristicos?.nombre }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-gray-900">${{ venta.total.toFixed(2) }}</td>
              <td class="px-6 py-4 text-sm text-green-600 font-semibold">${{ venta.adelanto.toFixed(2) }}</td>
              <td class="px-6 py-4 text-sm text-orange-600 font-semibold">${{ venta.saldoPendiente.toFixed(2) }}</td>
              <td class="px-6 py-4 text-sm">
                <span :class="['px-3 py-1 rounded-full text-xs font-semibold capitalize', getEstadoColor(venta.estado)]" :title="venta.estado === 'cancelada' ? venta.motivoCancelacion : ''">
                  {{ venta.estado }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ new Date(venta.fechaCreacion).toLocaleDateString('es-ES') }}
              </td>
              <td class="px-6 py-4 text-sm">
                <button
                  v-if="venta.estado !== 'cancelada'"
                  @click="cancelarReserva(venta.id)"
                  class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold transition"
                >
                  Cancelar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
