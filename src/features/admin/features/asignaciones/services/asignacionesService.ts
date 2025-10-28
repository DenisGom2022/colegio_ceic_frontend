import axios from "axios";
import { environments } from "../../../../../utils/environments";

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
    
        /**
         * Crea una nueva asignación de alumno
         * @param cuiAlumno CUI del alumno
         * @param idGrado ID del grado
         * @returns La asignación creada o mensaje de error
         */
    createAsignacionAlumno: async (
        cuiAlumno: string,
        idGrado: number
    ): Promise<any> => {
        const response = await axios.post(
            `${environments.VITE_API_URL}/asignaciones-alumno`,
            { cuiAlumno, idGrado },
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    /**
     * Actualiza una asignación de alumno existente
     * @param id ID de la asignación a actualizar
     * @param idGrado Nuevo ID del grado
     * @returns La asignación actualizada o mensaje de error
     */
    updateAsignacionAlumno: async (
        id: number,
        idGrado: number
    ): Promise<any> => {
        const response = await axios.put(
            `${environments.VITE_API_URL}/asignaciones-alumno/${id}`,
            { idGrado },
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    /**
     * Elimina una asignación de alumno
     * @param id ID de la asignación a eliminar
     * @returns Mensaje de confirmación o error
     */
    deleteAsignacionAlumno: async (id: number): Promise<{ message: string }> => {
        const response = await axios.delete(
            `${environments.VITE_API_URL}/asignaciones-alumno/${id}`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    }
}