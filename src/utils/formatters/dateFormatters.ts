/**
 * Formatea una fecha en formato ISO a un formato legible
 * @param isoString - String de fecha en formato ISO
 * @param includeTime - Indica si incluir la hora en el formato
 * @returns Fecha formateada
 */
export function formatDate(isoString: string, includeTime = false): string {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  if (includeTime) {
    return new Intl.DateTimeFormat('es-GT', {
      ...dateOptions,
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
  
  return new Intl.DateTimeFormat('es-GT', dateOptions).format(date);
}

/**
 * Formatea un número como moneda quetzales (Q)
 * @param value - Valor a formatear
 * @returns String formateado como moneda
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Acorta un texto si excede la longitud máxima
 * @param text - Texto a acortar
 * @param maxLength - Longitud máxima
 * @returns Texto acortado con elipsis si es necesario
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
}
