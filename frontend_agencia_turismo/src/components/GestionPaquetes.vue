<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePaquetesStore } from '@/stores/paquetes'

const paquetesStore = usePaquetesStore()
const cargando = ref(false)
const error = ref('')
const exito = ref('')
const busqueda = ref('')

onMounted(async () => {
  await cargarPaquetes()
})

async function cargarPaquetes() {
  cargando.value = true
  error.value = ''
  try {
    await paquetesStore.obtenerPaquetes()
  } catch (err) {
    error.value = 'Error cargando paquetes'
  } finally {
    cargando.value = false
  }
}

const paquetesFiltrados = () => {
  if (!busqueda.value) return paquetesStore.paquetes
  return paquetesStore.buscarPaquetes(busqueda.value)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z"></path>
            </svg>
            Gestión de Paquetes Turísticos
          </h3>
          <p class="text-gray-600 mt-2">Total de paquetes: <strong>{{ paquetesStore.paquetes.length }}</strong></p>
        </div>
        <button class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
          </svg>
          Nuevo Paquete
        </button>
      </div>
    </div>

    <!-- Filtro y búsqueda -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar paquete por nombre o descripción..."
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Mensajes -->
    <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      {{ error }}
    </div>
    <div v-if="exito" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
      {{ exito }}
    </div>

    <!-- Contenido -->
    <div v-if="cargando" class="text-center py-12">
      <div class="inline-block animate-spin">
        <svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <!-- Grid de Paquetes -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="paquete in paquetesFiltrados()"
        :key="paquete.id"
        class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
      >
        <!-- Card Header -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
          <h3 class="text-lg font-bold mb-1">{{ paquete.nombre }}</h3>
          <p class="text-blue-100 text-sm">{{ paquete.duración }}</p>
        </div>

        <!-- Card Body -->
        <div class="p-4 space-y-3">
          <!-- Descripción -->
          <p class="text-gray-600 text-sm line-clamp-2">{{ paquete.descripción }}</p>

          <!-- Info items -->
          <div class="space-y-2 border-t border-gray-200 pt-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-600">Capacidad:</span>
              <span class="font-semibold text-gray-800">{{ paquete.capacidadMaxima }} personas</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-600">Hospedaje:</span>
              <span class="inline-block px-2 py-1 rounded text-xs font-semibold"
                :class="paquete.incluyeHospedaje === 'Si' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ paquete.incluyeHospedaje }}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-600">Alimentación:</span>
              <span class="inline-block px-2 py-1 rounded text-xs font-semibold"
                :class="paquete.incluyeAlimentacion === 'Si' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ paquete.incluyeAlimentacion }}
              </span>
            </div>
          </div>

          <!-- Precio -->
          <div class="border-t border-gray-200 pt-3">
            <div class="text-center">
              <p class="text-gray-600 text-xs uppercase tracking-widest">Precio por persona</p>
              <p class="text-3xl font-bold text-blue-600 mt-1">${{ paquete.precio }}</p>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="bg-gray-50 p-4 border-t border-gray-200 flex gap-2">
          <button class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-sm">
            Editar
          </button>
          <button class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition text-sm">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay paquetes -->
    <div v-if="!cargando && paquetesFiltrados().length === 0" class="bg-white rounded-xl shadow-lg p-12 text-center">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
      </svg>
      <p class="text-gray-500 text-lg">No se encontraron paquetes</p>
    </div>
  </div>
</template>
