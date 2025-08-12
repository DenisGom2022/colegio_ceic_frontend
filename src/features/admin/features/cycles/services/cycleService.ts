import axios from 'axios';
import { environments } from '../../../../../utils/environments';
import type { 
  CicloCreateData,
  CicloUpdateData,
  CicloResponse,
  CicloDetalleResponse
} from '../models/Ciclo';

// Configuración para incluir automáticamente el token en las peticiones
const getAuthHeaders = () => {
  const token = localStorage.getItem('ceic_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const cycleService = {
  // Obtener todos los ciclos
  getCiclos: async (): Promise<CicloResponse> => {
    const response = await axios.get(`${environments.VITE_API_URL}/ciclo`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Crear un nuevo ciclo
  createCiclo: async (cicloData: CicloCreateData): Promise<any> => {
    const response = await axios.post(`${environments.VITE_API_URL}/ciclo`, cicloData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Actualizar un ciclo existente
  updateCiclo: async (cicloData: CicloUpdateData): Promise<any> => {
    const response = await axios.put(`${environments.VITE_API_URL}/ciclo`, cicloData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Eliminar un ciclo
  deleteCiclo: async (id: number): Promise<any> => {
    const response = await axios.delete(`${environments.VITE_API_URL}/ciclo/${id}`,  {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Finalizar un ciclo
  finalizarCiclo: async (id: number): Promise<any> => {
    const response = await axios.patch(`${environments.VITE_API_URL}/ciclo/finaliza-ciclo/${id}`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  // Obtener detalle de un ciclo
  getCicloDetalle: async (id: number): Promise<CicloDetalleResponse> => {
    const response = await axios.get(`${environments.VITE_API_URL}/ciclo/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  }
};

export default cycleService;
