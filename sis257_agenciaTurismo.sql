-- Seed de datos de prueba para SIS257 Agencia de Turismo
-- Ejecutar en la base de datos PostgreSQL con el esquema ya sincronizado.
-- CONTRASEÑA GENERAL PARA TODOS LOS USUARIOS: 123456
TRUNCATE table
extras,
itinerarios,
clientes,
pagos,
resenas,
reservas,
paquetes_turisticos,
transportes,
guias_turisticos,
destinos,
usuarios
RESTART IDENTITY CASCADE;


-- Reset de secuencias
SELECT setval('destinos_id_seq', 8, true);
SELECT setval('guias_turisticos_id_seq', 4, true);
SELECT setval('transportes_id_seq', 4, true);
SELECT setval('extras_id_seq', 5, true);
SELECT setval('usuarios_id_seq', 7, true);
SELECT setval('clientes_id_seq', 3, true);
SELECT setval('paquetes_turisticos_id_seq', 4, true);
SELECT setval('itinerarios_id_seq', 7, true);
SELECT setval('reservas_id_seq', 2, true);
SELECT setval('pagos_id_seq', 1, true);
SELECT setval('resenas_id_seq', 2, true);

-- DESTINOS (múltiples imágenes por destino para galería/slideshow)
INSERT INTO destinos (id, nombre, descripcion, ubicacion, imagenes) OVERRIDING SYSTEM VALUE VALUES
(1, 'Salar de Uyuni',
  'El desierto de sal más grande del mundo, un paisaje surrealista que combina cielo y tierra en la época de lluvias.',
  'Potosí, Bolivia',
  ARRAY[
    'https://unifranz.edu.bo/wp-content/uploads/2024/05/SALAR2.jpeg',
    'https://www.boliviaentusmanos.com/imagenes/ciudades/650x400/uyuni.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Salar_de_Uyuni%2C_Bolivia.jpg/800px-Salar_de_Uyuni%2C_Bolivia.jpg'
  ]::text[]),
(2, 'Cordillera Real',
  'Impresionante cadena montañosa de los Andes con trekking, escalada y vistas de nevados emblemáticos.',
  'La Paz, Bolivia',
  ARRAY[
    'https://unifranz.edu.bo/wp-content/uploads/2024/05/cordillera-real2-1.jpg',
    'https://www.boliviaentusmanos.com/imagenes/ciudades/650x400/la-paz.jpg'
  ]::text[]),
(3, 'Villa Tunari',
  'Paraíso natural del trópico boliviano, famoso por sus cascadas, fauna y aventuras en la selva.',
  'Cochabamba, Bolivia',
  ARRAY[
    'https://unifranz.edu.bo/wp-content/uploads/2024/05/cascada-amor-villa-tunari-1.jpg',
    'https://www.boliviaentusmanos.com/imagenes/ciudades/650x400/cochabamba.jpg'
  ]::text[]),
(4, 'Isla del Sol',
  'Cuna legendaria del imperio inca en medio del lago Titicaca, ideal para caminatas y cultura andina.',
  'La Paz, Bolivia',
  ARRAY[
    'https://unifranz.edu.bo/wp-content/uploads/2024/05/isla-del-sol1-1.jpg',
    'https://www.boliviaentusmanos.com/turismo/imagenes/copacabana-2.jpg'
  ]::text[]),
(5, 'Copacabana',
  'Pueblo costero a orillas del lago Titicaca, puerta de entrada a la Isla del Sol y la Isla de la Luna.',
  'La Paz, Bolivia',
  ARRAY[
    'https://www.boliviaentusmanos.com/imagenes/ciudades/650x400/copacabana.jpg',
    'https://www.boliviaentusmanos.com/turismo/imagenes/copacabana-2.jpg'
  ]::text[]),
(6, 'Basílica de Copacabana',
  'Templo colonial de gran importancia religiosa y patrimonial, patrón de Bolivia.',
  'Copacabana, La Paz',
  ARRAY[
    'https://www.boliviaentusmanos.com/turismo/imagenes/copacabana-2.jpg',
    'https://www.boliviaentusmanos.com/imagenes/ciudades/650x400/copacabana.jpg'
  ]::text[]),
(7, 'Tarija',
  'Ciudad del sol y del buen vino, conocida por sus viñedos, gastronomía y clima agradable.',
  'Tarija, Bolivia',
  ARRAY[
    'https://cdn.inteligenciaviajera.com/wp-content/uploads/2020/04/sitios-turisticos-2.jpg',
    'https://cdn.inteligenciaviajera.com/wp-content/uploads/2020/04/mejores-sitios-turisticos.jpg'
  ]::text[]),
(8, 'Potosí Colonial',
  'Ciudad histórica declarada Patrimonio de la Humanidad, famosa por el Cerro Rico y su arquitectura colonial.',
  'Potosí, Bolivia',
  ARRAY[
    'https://cdn.inteligenciaviajera.com/wp-content/uploads/2020/04/mejores-sitios-turisticos.jpg',
    'https://cdn.inteligenciaviajera.com/wp-content/uploads/2020/04/sitios-turisticos-2.jpg'
  ]::text[]);

-- GUÍAS TURÍSTICOS
INSERT INTO guias_turisticos (id, nombre, apellido, telefono, idiomas, experiencia, calificacion) OVERRIDING SYSTEM VALUE VALUES
(1, 'Carlos', 'Mamani',  '71234567', ARRAY['Español', 'Inglés']::text[],             'Guía certificado con 8 años de experiencia en turismo de aventura y cultura andina.', 4.8),
(2, 'Ana',    'Quispe',  '72345678', ARRAY['Español', 'Quechua']::text[],             'Especialista en rutas del Salar de Uyuni y comunidades originarias.',                 4.9),
(3, 'Luis',   'Rojas',   '73456789', ARRAY['Español', 'Inglés', 'Portugués']::text[], 'Experto en trekking de alta montaña y fotografía de paisajes.',                       4.7),
(4, 'María',  'Condori', '74567890', ARRAY['Español', 'Alemán']::text[],              'Guía cultural con amplio conocimiento de historia colonial y patrimonio.',             4.9);

-- TRANSPORTES
INSERT INTO transportes (id, tipo, empresa, descripcion) OVERRIDING SYSTEM VALUE VALUES
(1, 'BUS',      'TRANS_COPACABANA', 'Bus cama con aire acondicionado y baño para tramos largos.'),
(2, 'MINIBUS',  'TITICACA',         'Minibús 4x4 ideal para caminos rurales y grupos pequeños.'),
(3, 'CAMIONETA','CUESTAS',          'Camioneta todo terreno para expediciones al Salar y montaña.'),
(4, 'BARCO',    'BOA',              'Embarcación turística para recorridos en el lago Titicaca.');

-- EXTRAS
INSERT INTO extras (id, nombre, descripcion, precio, tipo) OVERRIDING SYSTEM VALUE VALUES
(1, 'Seguro de viaje',    'Cobertura médica y de emergencia durante todo el tour.',              50, 'SEGURO'),
(2, 'Entrada a museos',   'Ingreso a museos y sitios arqueológicos incluidos en el itinerario.', 30, 'ENTRADA_TURISTICA'),
(3, 'Cena de bienvenida', 'Cena típica boliviana en restaurante local.',                         80, 'ALIMENTACION'),
(4, 'Equipo de camping',  'Alquiler de saco de dormir, linterna y otros implementos.',           45, 'EQUIPAMIENTO'),
(5, 'Bebidas premium',    'Selección de vinos, cervezas y bebidas no incluidas en el menú.',     60, 'BEBIDAS');

-- USUARIOS (clave 123456 hasheada con bcrypt) — todos los roles cubiertos
INSERT INTO usuarios (id, usuario, nombre, apellido, email, contrasena, pais, telefono, rol) OVERRIDING SYSTEM VALUE VALUES
(1, 'admin',    'Administrador', 'Sistema',    'admin@pacific.bo',     '$2b$10$jHRvMlaIMUw07oqtIJB4m.4MmRXaHOJ/pxrw9uUINv032.7KKASzy', 'Bolivia', '70000001', 'admin'),
(2, 'gerente',  'Juan',          'Pérez',      'gerente@pacific.bo',   '$2b$10$jHRvMlaIMUw07oqtIJB4m.4MmRXaHOJ/pxrw9uUINv032.7KKASzy', 'Bolivia', '70000002', 'gerente'),
(3, 'vendedor', 'Laura',         'Vargas',     'vendedor@pacific.bo',  '$2b$10$jHRvMlaIMUw07oqtIJB4m.4MmRXaHOJ/pxrw9uUINv032.7KKASzy', 'Bolivia', '70000003', 'vendedor'),
(4, 'cajero',   'Sofía',         'Mamani',     'cajero@pacific.bo',    '$2b$10$jHRvMlaIMUw07oqtIJB4m.4MmRXaHOJ/pxrw9uUINv032.7KKASzy', 'Bolivia', '70000004', 'cajero'),
(5, 'contador', 'Marco',         'Quispe',     'contador@pacific.bo',  '$2b$10$jHRvMlaIMUw07oqtIJB4m.4MmRXaHOJ/pxrw9uUINv032.7KKASzy', 'Bolivia', '70000005', 'contador'),
(6, 'guia_usr', 'Pablo',         'Rojas',      'guia@pacific.bo',      '$2b$10$jHRvMlaIMUw07oqtIJB4m.4MmRXaHOJ/pxrw9uUINv032.7KKASzy', 'Bolivia', '70000006', 'guia'),
(7, 'cliente',  'Pedro',         'Gutiérrez',  'cliente@pacific.bo',   '$2b$10$jHRvMlaIMUw07oqtIJB4m.4MmRXaHOJ/pxrw9uUINv032.7KKASzy', 'Bolivia', '70000007', 'cliente');

-- CLIENTES
INSERT INTO clientes (id, nombre, apellido, email, telefono, documento) OVERRIDING SYSTEM VALUE VALUES
(1, 'Roberto', 'Sánchez', 'roberto.sanchez@email.com', '75555555', '6543210'),
(2, 'Elena',   'Torres',  'elena.torres@email.com',    '76666666', '7890123'),
(3, 'Miguel',  'Flores',  'miguel.flores@email.com',   '77777777', '8901234');

-- PAQUETES TURÍSTICOS
INSERT INTO paquetes_turisticos (id, nombre, descripcion, precio, duracion, capacidad_maxima, incluye_hospedaje, incluye_alimentacion, id_destino, id_guia, id_transporte) OVERRIDING SYSTEM VALUE VALUES
(1, 'Salar de Uyuni 3D/2N',    'Recorre el desierto de sal más grande del mundo, los trenes abandonados y lagunas de colores.',    1200, '3 días / 2 noches', 16, 'Hotel de sal incluido', 'TODO_INCLUIDO',   1, 1, 3),
(2, 'Cordillera Real Trekking', 'Trekking de alta montaña por senderos andinos con campamentos y vistas de nevados.',               950, '4 días / 3 noches', 12, 'Campamento incluido',   'PENSION_COMPLETA', 2, 3, 2),
(3, 'Isla del Sol Cultural',    'Viaje cultural al lago Titicaca con visita a Copacabana, Isla del Sol e Isla de la Luna.',         680, '2 días / 1 noche',  20, 'Hospedaje local',       'MEDIA_PENSION',    4, 2, 4),
(4, 'Villa Tunari Aventura',    'Aventura en el trópico: cascadas, canopy, avistamiento de aves y gastronomía local.',              550, '2 días / 1 noche',  18, 'Ecolodge incluido',     'MEDIA_PENSION',    3, 4, 2);

-- ITINERARIOS
INSERT INTO itinerarios (id, dia, titulo, descripcion, hora_inicio, hora_fin, id_paquete) OVERRIDING SYSTEM VALUE VALUES
(1, 1, 'Llegada al Salar',            'Salida desde Uyuni, visita al Cementerio de Trenes y Colchani.',             '08:00', '18:00', 1),
(2, 2, 'Isla Incahuasi y desierto',   'Amanecer en el Salar, visita a la Isla Incahuasi y fotografía.',              '05:00', '19:00', 1),
(3, 3, 'Lagunas de colores',          'Recorrido por lagunas altiplánicas y regreso a Uyuni.',                       '07:00', '17:00', 1),
(4, 1, 'Acercamiento a la Cordillera','Traslado a la base de la Cordillera Real y montaje de campamento.',           '07:00', '16:00', 2),
(5, 2, 'Trekking a laguna glaciar',   'Caminata hasta laguna glaciar con vistas del Huayna Potosí.',                 '06:00', '18:00', 2),
(6, 1, 'Copacabana e Isla del Sol',   'Viaje a Copacabana, visita a la Basílica y embarque a Isla del Sol.',        '07:00', '19:00', 3),
(7, 1, 'Cascadas y selva',            'Llegada a Villa Tunari y recorrido por cascadas y senderos de selva.',        '08:00', '17:00', 4);

-- RESERVAS
INSERT INTO reservas (id, nombre_cliente, telefono_cliente, email_cliente, fecha_reserva, fecha_viaje, cantidad_personas, total, estado, id_usuario, id_paquete, id_cliente) OVERRIDING SYSTEM VALUE VALUES
(1, 'Roberto Sánchez', '75555555', 'roberto.sanchez@email.com', '2026-07-01', '2026-08-15', 2, 2400, 'confirmada', 3, 1, 1),
(2, 'Elena Torres',    '76666666', 'elena.torres@email.com',    '2026-07-10', '2026-09-05', 4, 3800, 'pendiente',  3, 2, 2);

-- PAGOS
INSERT INTO pagos (id, total, fecha_pago, metodo_pago, estado_pago, referencia_pago, id_reserva) OVERRIDING SYSTEM VALUE VALUES
(1, 2400, '2026-07-02', 'transferencia', 'completado', 'TRX-001-UYUNI', 1);

-- RESEÑAS
INSERT INTO resenas (id, comentario, calificacion, fecha, id_usuario, id_paquete) OVERRIDING SYSTEM VALUE VALUES
(1, 'Una experiencia única, el Salar es mágico y el guía muy profesional.', 5, '2026-08-20', 7, 1),
(2, 'El trekking fue exigente pero las vistas valieron cada paso.',          4, '2026-09-10', 7, 2);


