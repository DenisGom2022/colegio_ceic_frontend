import axios from "axios";
import { environments } from "../../../utils";

const API_URL = environments.VITE_API_URL;
if (!API_URL) {
	console.error('ADVERTENCIA: La URL de la API no está configurada. Verifica la variable VITE_API_URL en tu archivo .env');
}

const getAuthHeaders = () => {
	const token = localStorage.getItem('ceic_token');
	return {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`
	};
};


export const TareasAlumnoService = {
	createTarea: async (body: {
		idTarea: number;
		idAsignacionAlumno: number;
		fechaEntrega: string;
		puntoObtenido: number;
	}): Promise<{ message: string; tareaAlumno?: any }> => {
		try {
			const url = `${API_URL}/tareas-alumno`;
			const response = await axios.post<{ message: string; tareaAlumno: any }>(url, body, {
				headers: getAuthHeaders()
			});
			return response.data;
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.message) {
				return { message: error.response.data.message };
			}
			console.error('Error al crear tarea de alumno:', error);
			throw error;
		}
	}
};
