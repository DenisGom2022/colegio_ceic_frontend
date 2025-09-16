import axios from "axios";
import { environments } from "../../../../../utils";

const getAuthHeaders = () => {
    const token = localStorage.getItem('ceic_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const bimestreService = {
    // Obtener todos los ciclos
    iniciarBimestre: async (idBimestre: number): Promise<void> => {
        const response = await axios.patch(`${environments.VITE_API_URL}/bimestre/iniciar/${idBimestre}`, {}, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    finalizarBimestre: async (idBimestre: number): Promise<void> => {
        const response = await axios.patch(`${environments.VITE_API_URL}/bimestre/finalizar/${idBimestre}`, {} ,{
            headers: getAuthHeaders()
        });
        return response.data;
    },
}