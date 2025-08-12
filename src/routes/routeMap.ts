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

/**
 * Rutas para administradores
 */
export const ADMIN_ROUTES = {
  BASE: '/admin',
  DASHBOARD: '/admin/dashboard',
  
  // Usuarios
  USERS: '/admin/usuarios',
  CREATE_USER: '/admin/crear-usuario',
  USER_DETAIL: (id: string | number = ':id') => `/admin/usuario/${id}`,
  EDIT_USER: (id: string | number = ':id') => `/admin/editar-usuario/${id}`,
  
  // Catedráticos
  TEACHERS: '/admin/catedraticos',
  CREATE_TEACHER: '/admin/crear-catedratico',
  TEACHER_DETAIL: (id: string | number = ':id') => `/admin/catedratico/${id}`,
  EDIT_TEACHER: (id: string | number = ':id') => `/admin/editar-catedratico/${id}`,
  
  // Alumnos
  STUDENTS: '/admin/alumnos',
  CREATE_STUDENT: '/admin/crear-alumno',
  STUDENT_DETAIL: (id: string | number = ':id') => `/admin/alumno/${id}`,
  EDIT_STUDENT: (id: string | number = ':id') => `/admin/editar-alumno/${id}`,
  
  // Ciclos
  CYCLES: '/admin/ciclos',
  CREATE_CYCLE: '/admin/crear-ciclo',
  CYCLE_DETAIL: (id: string | number = ':id') => `/admin/ciclo/${id}`,
  EDIT_CYCLE: (id: string | number = ':id') => `/admin/editar-ciclo/${id}`,
  
  // Otras rutas admin
  RESET_USER_PASSWORD: '/admin/reiniciar-contrasena',
};
