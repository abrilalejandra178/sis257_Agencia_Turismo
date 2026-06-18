<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useVentasStore } from '@/stores/ventas'
import { usePaquetesStore } from '@/stores/paquetes'

const ventasStore = useVentasStore()
const paquetesStore = usePaquetesStore()

const paso = ref<'catalogo' | 'cliente' | 'pago' | 'confirmacion'>('catalogo')
const busqueda = ref('')
const filtroDestino = ref('')
const cargando = ref(false)
const error = ref('')
const exito = ref('')

// Pago
const metodoPago = ref('efectivo')
const referenciaPago = ref('')
const idVentaCompletada = ref<number | null>(null)

// CAMBIO (requisito #5): monto que entrega el cliente en efectivo, para
// calcular el cambio/vuelto cuando paga con un monto más elevado.
const montoRecibido = ref<number | null>(null)

// CAMBIO (requisito #6): no se permite elegir una fecha de viaje pasada
const fechaMinima = new Date().toISOString().slice(0, 10)

// Fecha de viaje
const fechaViaje = ref('')

// CAMBIO (requisito #7): resultado de la búsqueda de cliente frecuente
const buscandoCliente = ref(false)
const resultadoCliente = ref<{ totalReservas: number; esClienteFrecuente: boolean } | null>(null)

const destinosUnicos = computed(() => {
  const destinos = new Set<string>()
  paquetesStore.paquetes.forEach((p: any) => {
    if (p.destino?.nombre) destinos.add(p.destino.nombre)
  })
  return Array.from(destinos)
})

const paquetesFiltrados = computed(() => {
  let result = paquetesStore.paquetes
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    result = result.filter((p: any) =>
      p.nombre?.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q)
    )
  }
  if (filtroDestino.value) {
    result = result.filter((p: any) => p.destino?.nombre === filtroDestino.value)
  }
  return result
})

const totalTicket = computed(() => ventasStore.subtotal)

// CAMBIO (requisito #5): cambio/vuelto a entregar si el cliente paga en
// efectivo con un monto mayor al total del ticket.
const cambioCalculado = computed(() => {
  if (metodoPago.value !== 'efectivo') return 0
  const recibido = Number(montoRecibido.value) || 0
  if (recibido <= totalTicket.value) return 0
  return recibido - totalTicket.value
})

const faltaParaCubrirEfectivo = computed(() => {
  if (metodoPago.value !== 'efectivo' || !montoRecibido.value) return 0
  const recibido = Number(montoRecibido.value) || 0
  if (recibido >= totalTicket.value) return 0
  return totalTicket.value - recibido
})

// Si el método de pago no es efectivo, no tiene sentido pedir "monto recibido"
const pagoEfectivoIncompleto = computed(() => {
  return metodoPago.value === 'efectivo' && faltaParaCubrirEfectivo.value > 0
})

onMounted(async () => {
  try {
    await paquetesStore.obtenerPaquetes()
  } catch (err) {
    error.value = 'Error cargando paquetes'
  }
})

// CAMBIO (requisito #7): si cambia el nombre o teléfono, se invalida la
// búsqueda anterior para no mostrar un resultado desactualizado.
watch([() => ventasStore.cliente.nombre, () => ventasStore.cliente.telefono], () => {
  resultadoCliente.value = null
})

function agregarPaquete(paquete: any) {
  const itemExistente = ventasStore.carrito.find(i => i.idPaquete === paquete.id)
  if (itemExistente) {
    ventasStore.actualizarCantidad(paquete.id, itemExistente.cantidadPersonas + 1)
  } else {
    ventasStore.agregarAlCarrito({
      idPaquete: paquete.id,
      cantidadPersonas: 1,
      nombrePaquete: paquete.nombre,
      precio: Number(paquete.precio),
    })
  }
  exito.value = `${paquete.nombre} agregado`
  setTimeout(() => (exito.value = ''), 1500)
}

// CAMBIO (requisito #7): busca por nombre o teléfono si el cliente ya
// tiene reservas anteriores (cliente frecuente) antes de venderle.
async function buscarCliente() {
  const query = (ventasStore.cliente.nombre || ventasStore.cliente.telefono || '').trim()
  if (!query) {
    error.value = 'Ingrese el nombre o teléfono del cliente para buscar'
    setTimeout(() => (error.value = ''), 3000)
    return
  }
  buscandoCliente.value = true
  try {
    resultadoCliente.value = await ventasStore.buscarClienteFrecuente(query)
  } catch (err) {
    resultadoCliente.value = null
  } finally {
    buscandoCliente.value = false
  }
}

function incrementarCantidad(idPaquete: number) {
  const item = ventasStore.carrito.find(i => i.idPaquete === idPaquete)
  if (item) {
    ventasStore.actualizarCantidad(idPaquete, item.cantidadPersonas + 1)
  }
}

function decrementarCantidad(idPaquete: number) {
  const item = ventasStore.carrito.find(i => i.idPaquete === idPaquete)
  if (item && item.cantidadPersonas > 1) {
    ventasStore.actualizarCantidad(idPaquete, item.cantidadPersonas - 1)
  }
}

function eliminarItem(idPaquete: number) {
  ventasStore.eliminarDelCarrito(idPaquete)
}

function irPaso(nuevoPaso: typeof paso.value) {
  if (nuevoPaso === 'cliente' && ventasStore.carrito.length === 0) {
    error.value = 'Agregue al menos un paquete al carrito'
    setTimeout(() => (error.value = ''), 3000)
    return
  }
  if (nuevoPaso === 'pago') {
    if (!ventasStore.cliente.nombre.trim()) {
      error.value = 'Ingrese el nombre del cliente'
      setTimeout(() => (error.value = ''), 3000)
      return
    }
  }
  paso.value = nuevoPaso
  error.value = ''
}

async function crearVenta() {
  if (!ventasStore.cliente.nombre.trim()) {
    error.value = 'Ingrese el nombre del cliente'
    return
  }

  cargando.value = true
  error.value = ''

  try {
    const venta = await ventasStore.crearVenta(fechaViaje.value)
    idVentaCompletada.value = venta.id
    paso.value = 'pago'
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Error creando la venta'
  } finally {
    cargando.value = false
  }
}

async function confirmarPago() {
  cargando.value = true
  error.value = ''

  try {
    if (!idVentaCompletada.value) throw new Error('Venta no encontrada')

    await ventasStore.confirmarPago(
      idVentaCompletada.value,
      metodoPago.value,
      referenciaPago.value,
      // CAMBIO (requisito #5): se envía el monto recibido en efectivo
      metodoPago.value === 'efectivo' ? montoRecibido.value || undefined : undefined,
    )

    paso.value = 'confirmacion'
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Error procesando el pago'
  } finally {
    cargando.value = false
  }
}

function nuevaVenta() {
  ventasStore.vaciarCarrito()
  paso.value = 'catalogo'
  metodoPago.value = 'efectivo'
  referenciaPago.value = ''
  idVentaCompletada.value = null
  fechaViaje.value = ''
  montoRecibido.value = null
  resultadoCliente.value = null
}

const metodosPago = [
  { value: 'efectivo', label: 'Efectivo', icon: 'pi pi-money-bill' },
  { value: 'tarjeta_debito', label: 'Tarjeta Débito', icon: 'pi pi-credit-card' },
  { value: 'transferencia', label: 'Transferencia', icon: 'pi pi-send' },
]

const estadosReserva = {
  pagada: { clase: 'estado-pagada', label: 'Pagada' },
  confirmada: { clase: 'estado-confirmada', label: 'Confirmada' },
  pendiente: { clase: 'estado-pendiente', label: 'Pendiente' },
  cancelada: { clase: 'estado-cancelada', label: 'Cancelada' },
  completada: { clase: 'estado-completada', label: 'Completada' },
}
</script>

<template>
  <div class="pos-container">
    <!-- Alertas globales -->
    <div v-if="error" class="alert alert-error">
      <i class="pi pi-exclamation-circle"></i>
      <span>{{ error }}</span>
    </div>
    <div v-if="exito" class="alert alert-success">
      <i class="pi pi-check-circle"></i>
      <span>{{ exito }}</span>
    </div>

    <!-- Stepper -->
    <div class="stepper">
      <div :class="['step', { active: paso === 'catalogo', completed: paso !== 'catalogo' }]">
        <div class="step-icon"><i class="pi pi-shopping-bag"></i></div>
        <span class="step-label">Productos</span>
      </div>
      <div class="step-line"></div>
      <div :class="['step', { active: paso === 'cliente', completed: paso === 'pago' || paso === 'confirmacion' }]">
        <div class="step-icon"><i class="pi pi-user"></i></div>
        <span class="step-label">Cliente</span>
      </div>
      <div class="step-line"></div>
      <div :class="['step', { active: paso === 'pago', completed: paso === 'confirmacion' }]">
        <div class="step-icon"><i class="pi pi-wallet"></i></div>
        <span class="step-label">Pago</span>
      </div>
      <div class="step-line"></div>
      <div :class="['step', { active: paso === 'confirmacion' }]">
        <div class="step-icon"><i class="pi pi-check"></i></div>
        <span class="step-label">Confirmación</span>
      </div>
    </div>

    <div class="pos-grid">
      <!-- Panel Izquierdo -->
      <div class="pos-main">
        <!-- PASO 1: CATÁLOGO -->
        <div v-if="paso === 'catalogo'" class="panel catalogo-panel">
          <div class="panel-header">
            <h3><i class="pi pi-shopping-bag"></i> Catálogo de Paquetes</h3>
          </div>

          <div class="filtros">
            <div class="search-box">
              <i class="pi pi-search"></i>
              <input v-model="busqueda" type="text" placeholder="Buscar paquete..." />
            </div>
            <select v-model="filtroDestino" class="destino-filter">
              <option value="">Todos los destinos</option>
              <option v-for="dest in destinosUnicos" :key="dest" :value="dest">{{ dest }}</option>
            </select>
          </div>

          <div class="paquetes-grid">
            <div
              v-for="paquete in paquetesFiltrados"
              :key="paquete.id"
              class="paquete-card"
              @click="agregarPaquete(paquete)"
            >
              <div class="paquete-icon">
                <i class="pi pi-image"></i>
              </div>
              <div class="paquete-info">
                <h4>{{ paquete.nombre }}</h4>
                <p class="paquete-destino" v-if="paquete.destino">
                  <i class="pi pi-map-marker"></i> {{ paquete.destino.nombre }}
                </p>
                <div class="paquete-footer">
                  <span class="precio">Bs {{ Number(paquete.precio).toFixed(2) }}</span>
                  <span class="capacidad">
                    <i class="pi pi-users"></i> {{ paquete.capacidadMaxima }}
                  </span>
                </div>
              </div>
              <div class="add-btn">
                <i class="pi pi-plus"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- PASO 2: CLIENTE -->
        <div v-if="paso === 'cliente'" class="panel cliente-panel">
          <div class="panel-header">
            <h3><i class="pi pi-user"></i> Datos del Cliente</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Nombre completo *</label>
              <div class="input-with-button">
                <input v-model="ventasStore.cliente.nombre" type="text" placeholder="Ej: Juan Pérez" />
                <!-- CAMBIO (requisito #7): búsqueda de cliente frecuente -->
                <button
                  type="button"
                  class="btn-buscar-cliente"
                  title="Ver si ya es cliente frecuente"
                  @click="buscarCliente"
                  :disabled="buscandoCliente"
                >
                  <i class="pi pi-search"></i>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input v-model="ventasStore.cliente.telefono" type="tel" placeholder="+591 71234567" />
            </div>
            <div class="form-group full" v-if="resultadoCliente">
              <span v-if="resultadoCliente.esClienteFrecuente" class="badge-cliente badge-frecuente">
                <i class="pi pi-star-fill"></i>
                Cliente frecuente ({{ resultadoCliente.totalReservas }} reservas anteriores)
              </span>
              <span v-else class="badge-cliente badge-nuevo">
                Cliente nuevo (sin reservas anteriores)
              </span>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="ventasStore.cliente.email" type="email" placeholder="cliente@email.com" />
            </div>
            <div class="form-group">
              <label>Fecha de viaje</label>
              <!-- CAMBIO (requisito #6): no se permite elegir una fecha pasada -->
              <input v-model="fechaViaje" type="date" :min="fechaMinima" />
            </div>
            <div class="form-group full">
              <label>Notas adicionales</label>
              <textarea v-model="ventasStore.notasVenta" rows="3" placeholder="Alguna observación especial..."></textarea>
            </div>
          </div>

          <div class="panel-actions">
            <button class="btn btn-secondary" @click="paso = 'catalogo'">
              <i class="pi pi-arrow-left"></i> Atrás
            </button>
            <button class="btn btn-primary" @click="crearVenta" :disabled="cargando">
              <i class="pi pi-credit-card"></i>
              {{ cargando ? 'Procesando...' : 'Continuar al Pago' }}
            </button>
          </div>
        </div>

        <!-- PASO 3: PAGO -->
        <div v-if="paso === 'pago'" class="panel pago-panel">
          <div class="panel-header">
            <h3><i class="pi pi-wallet"></i> Procesar Pago</h3>
          </div>

          <div class="pago-grid">
            <div class="metodos-pago">
              <label>Método de Pago</label>
              <div class="metodos-grid">
                <button
                  v-for="mp in metodosPago"
                  :key="mp.value"
                  :class="['metodo-btn', { active: metodoPago === mp.value }]"
                  @click="metodoPago = mp.value"
                >
                  <i :class="mp.icon"></i>
                  <span>{{ mp.label }}</span>
                </button>
              </div>
            </div>

            <div v-if="metodoPago !== 'efectivo'" class="form-group">
              <label>Referencia / Comprobante</label>
              <input v-model="referenciaPago" type="text" placeholder="N° de transacción" />
            </div>

            <!-- CAMBIO (requisito #5): monto recibido y cambio a devolver -->
            <div v-if="metodoPago === 'efectivo'" class="form-group">
              <label>Monto recibido del cliente</label>
              <input
                v-model.number="montoRecibido"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ej: si cobra Bs 100 y paga con Bs 150"
              />
            </div>
            <div v-if="metodoPago === 'efectivo' && cambioCalculado > 0" class="cambio-box">
              <span>Cambio a entregar:</span>
              <strong>Bs {{ cambioCalculado.toFixed(2) }}</strong>
            </div>
            <div v-if="pagoEfectivoIncompleto" class="cambio-box cambio-insuficiente">
              <span>Falta para cubrir el total:</span>
              <strong>Bs {{ faltaParaCubrirEfectivo.toFixed(2) }}</strong>
            </div>

            <div class="total-pago-box">
              <span>Total a Pagar:</span>
              <strong>Bs {{ totalTicket.toFixed(2) }}</strong>
            </div>
          </div>

          <div class="panel-actions">
            <button class="btn btn-secondary" @click="paso = 'cliente'">
              <i class="pi pi-arrow-left"></i> Atrás
            </button>
            <button
              class="btn btn-success"
              @click="confirmarPago"
              :disabled="cargando || pagoEfectivoIncompleto"
            >
              <i class="pi pi-check"></i>
              {{ cargando ? 'Procesando...' : 'Confirmar Pago Total' }}
            </button>
          </div>
        </div>

        <!-- PASO 4: CONFIRMACIÓN -->
        <div v-if="paso === 'confirmacion'" class="panel confirmacion-panel">
          <div class="confirmacion-content">
            <div class="success-icon">
              <i class="pi pi-check-circle"></i>
            </div>
            <h2>¡Venta Completada!</h2>
            <p class="success-sub">Reserva #{{ idVentaCompletada }} registrada exitosamente</p>

            <div class="ticket-resumen">
              <div class="ticket-row">
                <span>Cliente:</span>
                <strong>{{ ventasStore.cliente.nombre }}</strong>
              </div>
              <div class="ticket-row">
                <span>Total Pagado:</span>
                <strong>Bs {{ totalTicket.toFixed(2) }}</strong>
              </div>
              <div class="ticket-row">
                <span>Método:</span>
                <strong>{{ metodosPago.find(m => m.value === metodoPago)?.label }}</strong>
              </div>
              <div class="ticket-row">
                <span>Estado:</span>
                <strong class="estado-pagada">Pagada</strong>
              </div>
            </div>

            <div class="confirmacion-actions">
              <button class="btn btn-success" @click="nuevaVenta">
                <i class="pi pi-plus"></i> Nueva Venta
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Derecho: Ticket -->
      <div class="pos-ticket" v-if="paso !== 'confirmacion'">
        <div class="ticket-header">
          <div class="ticket-logo">
            <i class="pi pi-globe"></i>
            <span>Pacific Travel</span>
          </div>
          <div class="ticket-info">
            <p>Ticket #{{ idVentaCompletada || '—' }}</p>
            <p>{{ new Date().toLocaleDateString('es-ES') }}</p>
          </div>
        </div>

        <div class="ticket-items">
          <div v-if="ventasStore.carrito.length === 0" class="ticket-empty">
            <i class="pi pi-shopping-cart"></i>
            <p>Carrito vacío</p>
            <span>Seleccione paquetes del catálogo</span>
          </div>

          <div v-else class="ticket-list">
            <div v-for="item in ventasStore.carrito" :key="item.idPaquete" class="ticket-item">
              <div class="item-header">
                <span class="item-name">{{ item.nombrePaquete }}</span>
                <button class="item-remove" @click="eliminarItem(item.idPaquete)">
                  <i class="pi pi-times"></i>
                </button>
              </div>
              <div class="item-controls">
                <button @click="decrementarCantidad(item.idPaquete)">
                  <i class="pi pi-minus"></i>
                </button>
                <span class="item-qty">{{ item.cantidadPersonas }}</span>
                <button @click="incrementarCantidad(item.idPaquete)">
                  <i class="pi pi-plus"></i>
                </button>
                <span class="item-subtotal">Bs {{ ((item.precio ?? 0) * item.cantidadPersonas).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="ticket-totals">
          <div class="total-row total-final">
            <span>TOTAL</span>
            <span>Bs {{ totalTicket.toFixed(2) }}</span>
          </div>
        </div>

        <div class="ticket-actions">
          <button
            v-if="paso === 'catalogo'"
            class="btn-ticket btn-primary"
            @click="irPaso('cliente')"
            :disabled="ventasStore.carritoVacio"
          >
            <i class="pi pi-arrow-right"></i> Continuar
          </button>
          <button v-if="paso !== 'catalogo'" class="btn-ticket btn-secondary" @click="paso = 'catalogo'">
            <i class="pi pi-arrow-left"></i> Volver
          </button>
          <button class="btn-ticket btn-danger" @click="ventasStore.vaciarCarrito()" :disabled="ventasStore.carritoVacio">
            <i class="pi pi-trash"></i> Limpiar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== ESTADOS CON ENUM ===== */
.estado-pagada { color: #059669; background: #ecfdf5; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; }
.estado-confirmada { color: #c73e1e; background: #ffe8e0; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; }
.estado-pendiente { color: #b45309; background: #fef3c7; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; }
.estado-cancelada { color: #dc2626; background: #fef2f2; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; }
.estado-completada { color: #6b7280; background: #f3f4f6; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; }

.pos-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Alertas */
.alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  animation: slideDown 0.3s ease;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Stepper */
.stepper {
  display: flex;
  align-items: center;
  gap: 0;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 0.5rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.8125rem;
  font-weight: 600;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: all 0.3s ease;
}

.step.active .step-icon {
  background: linear-gradient(135deg, #f15d30 0%, #e04a1f 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(241, 93, 48, 0.3);
}

.step.completed .step-icon {
  background: #10b981;
  color: white;
}

.step.active .step-label,
.step.completed .step-label {
  color: #1f2937;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e5e7eb;
  margin: 0 0.5rem;
  min-width: 30px;
}

/* Grid principal */
.pos-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
  align-items: start;
}

/* Panel */
.panel {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.panel-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-header i {
  color: #f15d30;
}

/* Catálogo */
.catalogo-panel {
  padding-bottom: 1rem;
}

.filtros {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.875rem;
}

.search-box input {
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.25rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
}

.search-box input:focus {
  border-color: #f15d30;
  box-shadow: 0 0 0 3px rgba(241, 93, 48, 0.1);
}

.destino-filter {
  padding: 0.625rem 0.875rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  background: white;
  min-width: 160px;
  font-family: inherit;
  cursor: pointer;
}

.paquetes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.75rem;
  padding: 0 1.5rem;
}

.paquete-card {
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
}

.paquete-card:hover {
  border-color: #f15d30;
  box-shadow: 0 8px 25px -5px rgba(241, 93, 48, 0.2);
  transform: translateY(-2px);
}

.paquete-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ffe8e0 0%, #ffd4c7 100%);
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f15d30;
  font-size: 1.25rem;
}

.paquete-info h4 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
}

.paquete-destino {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.paquete-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.precio {
  font-size: 1rem;
  font-weight: 800;
  color: #f15d30;
}

.capacidad {
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.add-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #f15d30 0%, #e04a1f 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
}

.paquete-card:hover .add-btn {
  opacity: 1;
  transform: scale(1);
}

/* Ticket */
.pos-ticket {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 220px);
  position: sticky;
  top: 1rem;
}

.ticket-header {
  padding: 1.25rem;
  border-bottom: 2px dashed #e5e7eb;
  text-align: center;
}

.ticket-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.ticket-logo i {
  font-size: 1.5rem;
  color: #f15d30;
}

.ticket-logo span {
  font-size: 1.25rem;
  font-weight: 800;
  color: #f15d30;
}

.ticket-info p {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.ticket-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  min-height: 150px;
}

.ticket-empty {
  text-align: center;
  padding: 2rem 1rem;
  color: #9ca3af;
}

.ticket-empty i {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  display: block;
}

.ticket-empty p {
  margin: 0;
  font-weight: 600;
  font-size: 0.9375rem;
}

.ticket-empty span {
  font-size: 0.75rem;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ticket-item {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #f3f4f6;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.item-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1f2937;
}

.item-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.125rem;
  font-size: 0.75rem;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-controls button {
  width: 24px;
  height: 24px;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
}

.item-qty {
  font-size: 0.875rem;
  font-weight: 700;
  min-width: 24px;
  text-align: center;
}

.item-subtotal {
  margin-left: auto;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #f15d30;
}

.ticket-totals {
  padding: 1rem 1.25rem;
  border-top: 2px dashed #e5e7eb;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
  padding: 0.25rem 0;
}

.total-final {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1f2937;
  padding-top: 0.5rem;
  margin-top: 0.25rem;
  border-top: 1px solid #e5e7eb;
}

.ticket-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #f3f4f6;
}

.btn-ticket {
  flex: 1;
  padding: 0.625rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-ticket:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ticket.btn-primary {
  background: linear-gradient(135deg, #f15d30 0%, #e04a1f 100%);
  color: white;
}

.btn-ticket.btn-primary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(241, 93, 48, 0.3);
}

.btn-ticket.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-ticket.btn-danger {
  background: #fef2f2;
  color: #dc2626;
}

/* Cliente form */
.cliente-panel {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group.full {
  grid-column: span 2;
}

.form-group label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.625rem 0.875rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  color: #1f2937;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #f15d30;
  box-shadow: 0 0 0 3px rgba(241, 93, 48, 0.1);
}

.panel-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #f15d30 0%, #e04a1f 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(241, 93, 48, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-success {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

/* Pago */
.pago-panel {
  padding: 1.5rem;
}

.pago-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.metodos-pago label,
.monto-section label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: block;
}

.metodos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.metodo-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.875rem 0.5rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.metodo-btn i {
  font-size: 1.25rem;
}

.metodo-btn:hover {
  border-color: #f15d30;
  color: #f15d30;
}

.metodo-btn.active {
  border-color: #f15d30;
  background: linear-gradient(135deg, #f15d30 0%, #e04a1f 100%);
  color: white;
}

.total-pago-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%);
  border: 2px solid #f15d30;
  border-radius: 0.75rem;
}

.total-pago-box span {
  font-size: 1rem;
  color: #7c2d12;
  font-weight: 600;
}

.total-pago-box strong {
  font-size: 1.75rem;
  color: #f15d30;
}

/* CAMBIO (requisito #5): caja de cambio a entregar / monto faltante */
.cambio-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1.25rem;
  border-radius: 0.625rem;
  font-weight: 600;
}

.cambio-box span {
  color: #065f46;
}

.cambio-box strong {
  color: #059669;
  font-size: 1.125rem;
}

.cambio-box:not(.cambio-insuficiente) {
  background: #ecfdf5;
  border: 1.5px solid #a7f3d0;
}

.cambio-box.cambio-insuficiente {
  background: #fef2f2;
  border: 1.5px solid #fecaca;
}

.cambio-box.cambio-insuficiente span,
.cambio-box.cambio-insuficiente strong {
  color: #dc2626;
}

/* CAMBIO (requisito #7): búsqueda de cliente frecuente */
.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.input-with-button input {
  flex: 1;
}

.btn-buscar-cliente {
  width: 40px;
  flex-shrink: 0;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #f15d30;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-buscar-cliente:hover:not(:disabled) {
  border-color: #f15d30;
  background: #fff5f2;
}

.btn-buscar-cliente:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.badge-cliente {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 700;
}

.badge-frecuente {
  background: #ecfdf5;
  color: #059669;
}

.badge-nuevo {
  background: #f3f4f6;
  color: #6b7280;
}

/* Confirmación */
.confirmacion-panel {
  padding: 3rem;
  text-align: center;
}

.confirmacion-content {
  max-width: 480px;
  margin: 0 auto;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2.5rem;
  box-shadow: 0 10px 30px rgba(5, 150, 105, 0.3);
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.confirmacion-content h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 0.5rem;
}

.success-sub {
  color: #6b7280;
  margin: 0 0 2rem;
}

.ticket-resumen {
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 2rem;
  text-align: left;
}

.ticket-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.ticket-row span {
  color: #6b7280;
}

.ticket-row strong {
  color: #1f2937;
}

.confirmacion-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .pos-grid {
    grid-template-columns: 1fr;
  }

  .pos-ticket {
    position: static;
    max-height: none;
  }

  .stepper {
    overflow-x: auto;
    padding: 0.75rem;
  }

  .step-label {
    display: none;
  }

  .paquetes-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full {
    grid-column: span 1;
  }

  .metodos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .filtros {
    flex-direction: column;
  }

  .paquetes-grid {
    grid-template-columns: 1fr;
  }

  .panel-actions {
    flex-direction: column;
  }

  .confirmacion-actions {
    flex-direction: column;
  }
}

/* Print styles */
@media print {
  .pos-container > *:not(.confirmacion-panel) {
    display: none;
  }

  .confirmacion-panel {
    display: block !important;
    box-shadow: none;
  }
}
</style>
