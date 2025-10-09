import axios from "axios";
import { environments } from "../../../../../utils";

// Configuración para incluir automáticamente el token en las peticiones
const getAuthHeaders = () => {
  const token = localStorage.getItem('ceic_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const asignacionesService = {
  /**
   * Obtiene las asignaciones de alumno paginadas y filtradas por nombre
   * @param page número de página (default 1)
   * @param limit cantidad por página (default 5)
   * @param nombre filtro por nombre (default "")
   */
  getAsignacionesAlumno: async (
    page: number = 1,
    limit: number = 5,
    nombre: string = ""
  ): Promise<any> => {
    const response = await axios.get(`${environments.VITE_API_URL}/asignaciones-alumno/pag`, {
      headers: getAuthHeaders(),
      params: { page, limit, nombre }
    });
    return response.data;
  },

  /**
   * Obtiene una asignación de alumno específica por su ID
   * @param id ID de la asignación a obtener
   * @returns Detalles de la asignación incluyendo información del alumno, grado, ciclo y responsables
   */
  getAsignacionAlumno: async (id: number): Promise<any> => {
    const response = await axios.get(`${environments.VITE_API_URL}/asignaciones-alumno/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
}