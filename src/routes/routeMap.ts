/**
 * Mapa de rutas de la aplicación
 * Centraliza las rutas para evitar strings dispersos en el código
 */

/**
 * Rutas públicas
 */
export const PUBLIC_ROUTES = {
  LOGIN: '/login',
  FORBIDDEN: '/forbidden',
  RESET_PASSWORD: '/reiniciar-contrasena',
};

/**
 * Rutas para usuarios autenticados (no admin)
 */
export const USER_ROUTES = {
  DASHBOARD: '/dashboard',
  CHANGE_PASSWORD: '/cambiar-contrasena',
  COURSES: '/cursos',
  TASKS: '/tareas',
};

