import axios from "axios";
import type { Curso } from "../../../interfaces/interfaces";
import { environments } from "../../../utils/environments";

const getAuthHeaders = () => {
    const token = localStorage.getItem('ceic_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};


export interface createTareaProps {
    titulo: string;
    descripcion: string; 
    punteo: number;
    fechaEntrega: string; 
    idCurso: number; 
    nroBimestre: number
}

export const tareaSevice = {
    getAllMisCursosActivos: async (): Promise<Curso[]> => {
        const response = await axios.get(`${environments.VITE_API_URL}/curso/activos`, {
            headers: getAuthHeaders()
        });
        return response?.data?.cursos;
    },

    createTarea: async (data:createTareaProps): Promise<any> => {
        const response = await axios.post(`${environments.VITE_API_URL}/tarea`, data,  {
            headers: getAuthHeaders()
        });
        return response;
    }
}