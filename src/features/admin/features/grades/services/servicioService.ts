import axios from 'axios';
import { environments } from '../../../../../utils/environments';

export interface CreateServicioDTO {
  descripcion: string;
  valor: number;
  fecha_a_pagar: string;
  id_grado_ciclo: number;
}

export interface Servicio {
  id: number;
  descripcion: string;
  valor: string;
  fecha_a_pagar: string;
  id_grado_ciclo: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateServicioResponse {
  message: string;
  servicio: Servicio;
}

export const servicioService = {
  createServicio: async (data: CreateServicioDTO): Promise<CreateServicioResponse> => {
    try {
      const token = localStorage.getItem('ceic_token');
      const response = await axios.post(
        `${environments.VITE_API_URL}/servicio`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      // Verificar si es un error de respuesta HTTP
      if (error.response?.status >= 400) {
        throw error.response.data.message || 'Error al crear el servicio';
      }
      throw error.message || 'Error al crear el servicio';
    }
  }
};