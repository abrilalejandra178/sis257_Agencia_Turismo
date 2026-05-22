# SIS257_Agencia_Turismo - Proyecto de Agencia de Turismo
Descripción del Negocio

Somos una agencia de turismo que ofrece una plataforma web orientada a la promoción y reserva de paquetes turísticos a diferentes destinos de Bolivia. Los usuarios podrán explorar lugares turísticos, visualizar información de paquetes disponibles, conocer detalles sobre el transporte y guía turístico asignado, realizar reservas y efectuar pagos de manera sencilla y segura.

El sistema permitirá mejorar la gestión de reservas y brindar una experiencia accesible, organizada y eficiente para los clientes interesados en realizar viajes turísticos dentro del país.

Objetivo del Sistema

Desarrollar una página web que permita gestionar la oferta de paquetes turísticos, facilitando la visualización de destinos turísticos, la reserva de viajes y la gestión de pagos dentro de Bolivia.

Funcionalidades Principales
Registro e inicio de sesión de usuarios
Visualización de destinos turísticos de Bolivia
Visualización de paquetes turísticos
Visualización de información del guía turístico
Visualización de información del transporte
Reserva de paquetes turísticos
Gestión de pagos
Historial de reservas
Sistema de reseñas y calificaciones
Entidades del Sistema (8 tablas)

1. Usuario
- id
- nombre
- apellido
- email
- contraseña
- país
- teléfono

2. Destino
- id_destino
- nombre
- descripcion
- ubicacion
- imagen

3. GuiaTuristico
- id_guia
- nombre
- apellido
- telefono
- idioma
- experiencia
- calificacion

4. Transporte
- id_transporte
- tipo
- empresa
- descripcion

5. PaqueteTuristico
- id_paquete
- nombre
- descripcion
- precio
- duracion
- capacidad_maxima
- incluye_hospedaje
- incluye_alimentacion
- id_destino
- id_guia
- id_transporte

6. Reserva
- id_reserva
- fecha_reserva
- cantidad_personas
- total
- adelanto
- saldo_pendiente
- estado
- id_usuario
- id_paquete

7. Pago
- id_pago
- monto
- fecha_pago
- metodo_pago
- estado_pago
- id_reserva

8. Reseña
- id_reseña
- comentario
- calificacion
- fecha
- id_usuario
- id_paquete