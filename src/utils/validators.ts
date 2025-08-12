/**
 * Valida si un email tiene formato correcto
 * @param email - Email a validar
 * @returns true si el email es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida si una contraseña cumple con requisitos mínimos de seguridad
 * @param password - Contraseña a validar
 * @returns true si la contraseña es válida
 */
export function isValidPassword(password: string): boolean {
  // Al menos 8 caracteres, una mayúscula, una minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Valida si un nombre de usuario es válido
 * @param username - Nombre de usuario a validar
 * @returns true si el nombre de usuario es válido
 */
export function isValidUsername(username: string): boolean {
  // Al menos 3 caracteres, solo letras, números y guiones bajos
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
}
