<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVentasStore } from '@/stores/ventas'

const ventasStore = useVentasStore()
const filtro = ref('hoy')
const cargando = ref(false)
const error = ref('')

onMounted(async () => {
  await cargarReporte()
})

async function cargarReporte() {
  cargando.value = true
  error.value = ''
  try {
    await ventasStore.obtenerReporte(filtro.value)
  } catch {
    error.value = 'Error cargando reporte de ventas'
  } finally {
    cargando.value = false
  }
}

async function cambiarFiltro(nuevoFiltro: string) {
  filtro.value = nuevoFiltro
  await cargarReporte()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h3 class="text-lg font-bold mb-4 text-gray-800">Período</h3>
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

    <div v-if="cargando" class="text-center py-12">
      <div class="inline-block animate-spin">
        <svg class="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <div v-else>
      <!-- Tarjetas de resumen -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Total Ventas -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold opacity-90">Total de Ventas</p>
              <p class="text-3xl font-bold mt-2">${{ ventasStore.reporteVentas.totalVentas.toFixed(2) }}</p>
            </div>
            <svg class="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z"></path>
            </svg>
          </div>
        </div>

        <!-- Total Pagado -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold opacity-90">Total Pagado</p>
              <p class="text-3xl font-bold mt-2">${{ ventasStore.reporteVentas.totalPagado.toFixed(2) }}</p>
            </div>
            <svg class="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6-4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>

        <!-- Total Pendiente -->
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold opacity-90">Total Pendiente</p>
              <p class="text-3xl font-bold mt-2">${{ ventasStore.reporteVentas.totalPendiente.toFixed(2) }}</p>
            </div>
            <svg class="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12s4.477 10 10 10 10-4.484 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm3.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>

        <!-- Cantidad de Reservas -->
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold opacity-90">Total de Reservas</p>
              <p class="text-3xl font-bold mt-2">{{ ventasStore.reporteVentas.cantidadReservas }}</p>
            </div>
            <svg class="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Tabla detallada -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Paquete</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Personas</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="venta in ventasStore.reporteVentas.detalleVentas"
                :key="venta.id"
                class="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ venta.nombreCliente }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ venta.paquete }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ venta.cantidadPersonas }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900 text-right">${{ venta.total.toFixed(2) }}</td>
                <td class="px-6 py-4 text-sm">
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold capitalize',
                    venta.estado === 'pagada' ? 'bg-green-100 text-green-800' :
                    venta.estado === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                    venta.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  ]">
                    {{ venta.estado }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ new Date(venta.fechaReserva).toLocaleDateString('es-ES') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="ventasStore.reporteVentas.detalleVentas.length === 0" class="p-12 text-center text-gray-500">
          <p>No hay ventas para este período</p>
        </div>
      </div>
    </div>
  </div>
</template>
