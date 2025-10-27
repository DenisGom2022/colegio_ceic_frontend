import axios from "axios";
import type { Catedratico, Curso } from "../../../interfaces/interfaces";
import { environments } from "../../../utils/environments";

const API_URL = environments.VITE_API_URL;
if (!API_URL) {
    console.error('ADVERTENCIA: La URL de la API no está configurada. Verifica la variable VITE_API_URL en tu archivo .env');
}

// Configuración para incluir automáticamente el token en las peticiones
const getAuthHeaders = () => {
    const token = localStorage.getItem('ceic_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getAllMisCursos = async (): Promise<{ cursos: Curso[], esCatedratico: Boolean }> => {
    try {
        let url = `${API_URL}/curso/mis-cursos`;
        const response = await axios.get<{ message: string, cursos: Curso[], esCatedratico: Boolean, catedratico: Catedratico }>(url, {
            headers: getAuthHeaders()
        });

        const { cursos, esCatedratico } = response.data;

        return {
            cursos,
            esCatedratico
        };
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        throw error;
    }
};

export const getMiCurso = async (id: string): Promise<{ message:string, curso:Curso }> => {
    try {
        let url = `${API_URL}/curso/mis-cursos/${id}`;
        const response = await axios.get<{ message: string, curso: Curso }>(url, {
            headers: getAuthHeaders()
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener el curso:', error);
        throw error;
    }
}