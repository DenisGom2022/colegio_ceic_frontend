import axios from 'axios';
import { environments } from '../../../../../utils/environments';

export interface CreateCursoRequest {
  nombre: string;
  notaMaxima: number;
  notaAprobada: number;
  idGrado: number;
  dpiCatedratico: string;
}

export interface CreateCursoResponse {
  message: string;
  curso: {
    id: number;
    nombre: string;
    notaMaxima: number;
    notaAprobada: number;
    idGradoCiclo: number;
    dpiCatedratico: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export const createCurso = async (cursoData: CreateCursoRequest): Promise<CreateCursoResponse> => {
  try {
    const token = localStorage.getItem("ceic_token");
    const url = environments.VITE_API_URL + '/curso';

    const response = await axios.post<CreateCursoResponse>(
      url,
      cursoData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error creating curso:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 401) {
      throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
    } else if (error.response?.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción.');
    } else if (error.response?.status === 400) {
      throw new Error('Datos inválidos. Verifica la información ingresada.');
    } else {
      throw new Error('Error al crear el curso. Inténtalo de nuevo.');
    }
  }
};
