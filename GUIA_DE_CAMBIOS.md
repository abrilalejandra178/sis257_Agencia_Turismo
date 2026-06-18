# Guía de cambios — Agencia de Turismo (SIS257)

Este documento resume los 7 puntos que pediste, qué se implementó para cada uno y en qué archivos (backend NestJS y frontend Vue) se hicieron los cambios. El proyecto corregido está en el mismo zip que este archivo, con la misma estructura `backend_agencia_turismo/` y `frontend_agencia_turismo/` que ya tenías.

> Nota: el zip no incluye `node_modules` (para que pese menos). Antes de correrlo, en cada carpeta ejecuta `npm install`.

---

## 1) Destinos con varias imágenes

**Qué se hizo:** un destino sigue teniendo su imagen principal (campo `imagen`), pero ahora además puede tener una **galería de imágenes adicionales** (varias URLs).

- Backend:
  - Nueva entidad `backend_agencia_turismo/src/destinos/entities/imagen-destino.entity.ts` (tabla `destino_imagenes`, relacionada con `destinos`).
  - `destinos/entities/destino.entity.ts`: se agregó la relación `imagenes` (OneToMany).
  - `destinos/dto/create-destino.dto.ts`: nuevo campo opcional `imagenes: string[]`.
  - `destinos/destinos.service.ts`: al crear/editar un destino, guarda y sincroniza la galería (si quitas una URL de la lista, se borra de la base automáticamente).
  - `destinos/destinos.module.ts`: se registró la nueva entidad.
- Frontend:
  - `frontend_agencia_turismo/src/models/destino.ts`: se agregó `imagenes?: ImagenDestino[]`.
  - `components/destino/DestinoSave.vue`: se agregó una sección "Imágenes adicionales (galería)" donde puedes añadir/quitar URLs de fotos.
  - `components/destino/DestinoList.vue`: la columna "Imágenes" muestra la foto principal y un botón "+N fotos" que abre un diálogo con toda la galería.

**Dónde verlo:** menú "Destinos" → Crear/Editar un destino.

---

## 2) Motivo de eliminación/cancelación de reservas

**Qué se hizo:** ya no se puede cancelar o dar de baja una reserva "en silencio": siempre se pide el motivo, y queda guardado.

- Backend:
  - `reservas/entities/reserva.entity.ts`: nueva columna `motivoCancelacion`.
  - `reservas/dto/update-reserva.dto.ts`: si el estado es `cancelada`, el motivo es **obligatorio**.
  - `reservas/reservas.service.ts` y `reservas/reservas.controller.ts`: el `DELETE` (dar de baja) ahora acepta `{ motivo }` en el cuerpo de la petición y lo guarda antes de eliminar.
  - `ventas/dto/crear-venta.dto.ts` y `ventas/ventas.service.ts` / `ventas.controller.ts`: el endpoint de cancelación del punto de venta (`PATCH /ventas/:id/cancelar`) también guarda el motivo.
- Frontend:
  - `models/reserva.ts`: nuevo campo `motivoCancelacion`.
  - `components/reserva/ReservaSave.vue`: si cambias el estado a "Cancelada" aparece un campo de texto obligatorio para el motivo.
  - `components/reserva/ReservaList.vue`: al eliminar una reserva, el diálogo de confirmación pide el motivo antes de permitir la baja; el estado "cancelada" muestra el motivo como tooltip (ícono de información).
  - `components/HistorialVentas.vue` y `stores/ventas.ts`: al cancelar desde el punto de venta, se pregunta el motivo con una ventana de texto.

**Dónde verlo:** menú "Reservas" (editar estado o eliminar), y en el panel de punto de venta al cancelar una venta.

---

## 3) Paquetes con select (Sí/No) en hospedaje y alimentación

**Qué se hizo:** los campos "Incluye hospedaje" e "Incluye alimentación" ya no son texto libre; ahora son un **select con dos opciones: Sí / No**. (Destino, Guía y Transporte ya eran select desde antes; ahora todo el formulario de paquete usa selects donde corresponde).

- Backend: `paquetes_turisticos/dto/create-paquetes_turistico.dto.ts` — se valida que el valor sea exactamente `"Sí"` o `"No"`.
- Frontend: `components/paquete-turistico/PaqueteTuristicoSave.vue` — los campos ahora son `<Select>` con esas dos opciones.

**Dónde verlo:** menú "Paquetes" → Crear/Editar un paquete.

---

## 4) Clasificar al guía del 1 al 5

**Qué se hizo:** la calificación del guía turístico ahora es un número entero del 1 al 5, mostrado con estrellas (antes era un decimal sin límite real).

- Backend: `guias_turisticos/entities/guias_turistico.entity.ts` (columna entera) y `guias_turisticos/dto/create-guias_turistico.dto.ts` (valida que sea un entero entre 1 y 5).
- Frontend: `components/guia-turistico/GuiaTuristicoSave.vue` (selector de estrellas para calificar) y `GuiaTuristicoList.vue` (estrellas de solo lectura en la tabla).

**Dónde verlo:** menú "Guías" → Crear/Editar un guía.

---

## 5) Monto del cambio cuando pagan con un monto más alto

**Qué se hizo:** ahora se puede registrar cuánto entregó el cliente (monto recibido) y el sistema calcula automáticamente el cambio/vuelto a devolver, tanto en el punto de venta como en el módulo de pagos.

- Backend:
  - `pagos/entities/pago.entity.ts`: nuevas columnas `montoRecibido` y `cambio`.
  - `pagos/dto/create-pago.dto.ts` y `pagos/pagos.service.ts`: se calcula el cambio automáticamente si `montoRecibido` es mayor al monto a cobrar.
  - `ventas/dto/crear-venta.dto.ts` y `ventas/ventas.service.ts` (`confirmarPago`): mismo cálculo para el flujo del punto de venta.
- Frontend:
  - `models/pago.ts`: nuevos campos `montoRecibido` y `cambio`.
  - `components/pago/PagoSave.vue`: campo "Monto recibido" que muestra en vivo el cambio a entregar (o cuánto falta si el monto no cubre el total). De paso se corrigieron "Método de pago" y "Estado de pago" para que también sean select.
  - `components/pago/PagoList.vue`: nueva columna "Cambio".
  - `components/POSModule.vue` (panel de venta, paso "Pago"): si el método es efectivo, aparece el campo "Monto recibido del cliente" y se muestra el cambio a entregar; si el monto no alcanza, el botón de confirmar pago se bloquea.

**Dónde verlo:** Panel de administración → Punto de Venta (paso de pago en efectivo), y menú de Pagos.

---

## 6) No registrar reservas/pagos con fecha pasada

**Qué se hizo:** se bloqueó, tanto en el formulario como en el servidor, la posibilidad de registrar una reserva, un viaje o un pago con una fecha anterior al día de hoy.

- Backend:
  - Nueva utilidad `backend_agencia_turismo/src/common/utils/fecha.util.ts` (`esFechaAnterierAHoy`).
  - `reservas/reservas.service.ts`: valida `fechaReserva` y `fechaViaje` al crear/editar.
  - `pagos/pagos.service.ts`: valida `fechaPago` al crear.
  - `ventas/ventas.service.ts`: valida `fechaViaje` al crear una venta desde el punto de venta.
- Frontend: en `ReservaSave.vue`, `PagoSave.vue` y `POSModule.vue` los campos de fecha tienen el atributo `min` con la fecha de hoy, para que el calendario no deje elegir fechas pasadas.

**Dónde verlo:** al crear una reserva, un pago, o una venta con fecha de viaje, intenta poner una fecha pasada — el sistema la rechaza con un mensaje claro.

---

## 7) Búsqueda de cliente para saber si ya es cliente frecuente

**Qué se hizo:** se agregó una búsqueda rápida por nombre, teléfono o correo que muestra cuántas reservas anteriores tiene esa persona y si ya se considera "cliente frecuente" (2 o más reservas previas).

- Backend:
  - `reservas/reservas.service.ts` (`buscarPorCliente`) y `reservas/reservas.controller.ts`: nuevo endpoint `GET /reservas/buscar-cliente?query=...`.
  - `ventas/ventas.service.ts` (`buscarClienteFrecuente`) y `ventas/ventas.controller.ts`: mismo tipo de búsqueda para el punto de venta, en `GET /ventas/buscar-cliente?query=...`.
- Frontend:
  - `components/reserva/ReservaSave.vue`: botón de lupa junto al nombre del cliente; muestra una etiqueta "Cliente frecuente (N reservas anteriores)" o "Cliente nuevo".
  - `components/POSModule.vue` (paso "Cliente"): mismo botón de búsqueda y misma etiqueta, antes de generar la venta.
  - `stores/ventas.ts`: nueva acción `buscarClienteFrecuente`.

**Dónde verlo:** Panel de administración → Punto de Venta (paso "Cliente"), y en el formulario de Reservas.

---

## Cómo correr el proyecto

**Backend:**
```bash
cd backend_agencia_turismo
npm install
# revisa/edita el archivo .env con los datos de tu base de datos PostgreSQL
npm run start:dev
```

**Frontend:**
```bash
cd frontend_agencia_turismo
npm install
npm run dev
```

El backend usa `synchronize: true` en TypeORM, así que las tablas y columnas nuevas (galería de imágenes, motivo de cancelación, monto recibido/cambio, etc.) se crean automáticamente la primera vez que arranca contra tu base de datos — no necesitas escribir ninguna migración a mano.

## Verificación realizada

- El backend se compiló sin errores (`nest build`).
- El frontend se verificó con `vue-tsc` (chequeo de tipos) sin errores nuevos. Hay un error de tipos preexistente en `src/layouts/AdminLayout.vue` (no relacionado con ninguno de estos 7 cambios, ya estaba antes); si quieres que también lo corrija, dímelo y lo arreglo en una próxima vuelta.
