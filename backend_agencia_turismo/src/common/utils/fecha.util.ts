/**
 * Utilidades para validar fechas en el sistema.
 *
 * CAMBIO (requisito #6): se agrega esta utilidad para impedir que
 * reservas y pagos se registren con una fecha anterior al día de hoy.
 */

/**
 * Indica si la fecha recibida corresponde a un día anterior al de hoy.
 * Ignora la hora: solo compara año/mes/día.
 */
export function esFechaAnterierAHoy(fecha: Date | string): boolean {
  const fechaComparar = new Date(fecha);
  if (isNaN(fechaComparar.getTime())) return false;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fechaComparar.setHours(0, 0, 0, 0);

  return fechaComparar.getTime() < hoy.getTime();
}
