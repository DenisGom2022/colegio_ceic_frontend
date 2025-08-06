import axios from 'axios';
import { environments } from '../utils/environments';

export interface Jornada {
  id: number;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface NivelAcademico {
  id: number;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Grado {
  id: number;
  nombre: string;
  idNivel: number;
  idJornada: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  nivelAcademico: NivelAcademico;
  jornada: Jornada;
}

export interface GradoCiclo {
  id: number;
  idGrado: number;
  idCiclo: number;
  precioPago: string;
  cantidadPagos: number;
  precioInscripcion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  grado: Grado;
}

export interface Ciclo {
  id: number;
  descripcion: string;
  createdAt: string;
  fechaFin: string | null;
  updatedAt: string;
  deletedAt: string | null;
  gradosCiclo: GradoCiclo[];
}

export interface CicloResponse {
  message: string;
  ciclos: Ciclo[];
}

export interface CicloDetalleResponse {
  message: string;
  ciclo: Ciclo;
}

export interface CicloCreateData {
  id?: string;
  descripcion: string;
  fechaFin?: string | null;
}

export interface CicloUpdateData {
  id: number;
  descripcion: string;
  fechaFin?: string | null;
}

// Configuración para incluir automáticamente el token en las peticiones
const getAuthHeaders = () => {
  const token = localStorage.getItem('ceic_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Obtener todos los ciclos
export const getCiclos = async (): Promise<CicloResponse> => {
  const response = await axios.get(`${environments.VITE_API_URL}/ciclo`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Crear un nuevo ciclo
export const createCiclo = async (cicloData: CicloCreateData): Promise<any> => {
  const response = await axios.post(`${environments.VITE_API_URL}/ciclo`, cicloData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Actualizar un ciclo existente
export const updateCiclo = async (cicloData: CicloUpdateData): Promise<any> => {
  const response = await axios.put(`${environments.VITE_API_URL}/ciclo`, cicloData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Eliminar un ciclo
export const deleteCiclo = async (id: number): Promise<any> => {
  const response = await axios.delete(`${environments.VITE_API_URL}/ciclo/${id}`,  {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Finalizar un ciclo
export const finalizarCiclo = async (id: number): Promise<any> => {
  const response = await axios.patch(`${environments.VITE_API_URL}/ciclo/finaliza-ciclo/${id}`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Obtener detalle de un ciclo
export const getCicloDetalle = async (id: number): Promise<CicloDetalleResponse> => {
  const response = await axios.get(`${environments.VITE_API_URL}/ciclo/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};
