import axios from 'axios';
import { environments } from '../../../../../utils/environments';

interface NivelAcademico {
  id: number;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Jornada {
  id: number;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Ciclo {
  id: number;
  descripcion: string;
  createdAt: string;
  fechaFin: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface GradoCiclo {
  id: number;
  idGrado: number;
  idCiclo: number;
  precioPago: string;
  cantidadPagos: number;
  precioInscripcion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  ciclo: Ciclo;
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
  gradosCiclo: GradoCiclo[];
}

export interface GradosResponse {
  message: string;
  grados: Grado[];
  total: number;
  page: number;
  totalPages: number;
}

interface FetchGradosParams {
  page: number;
  limit: number;
  searchTerm?: string;
  sortField?: string;
  sortDirection?: string;
}

export const fetchGrados = async ({
  page = 1,
  limit = 5,
  searchTerm = '',
  sortField,
  sortDirection
}: FetchGradosParams): Promise<GradosResponse> => {
  try {
    const token = localStorage.getItem("ceic_token");
    let url = environments.VITE_API_URL + `/grado?page=${page}&limit=${limit}`;

    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }

    if (sortField && sortDirection) {
      url += `&sortBy=${sortField}&order=${sortDirection}`;
    }

    const response = await axios.get<GradosResponse>(url,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      }
    );

    // Asegurarnos de que los datos tienen la estructura correcta
    if (!response.data || !response.data.grados) {
      console.error('Respuesta de API inválida:', response.data);
      // Devolver una estructura válida aunque esté vacía
      return {
        message: 'No se encontraron grados',
        grados: [],
        total: 0,
        page: page,
        totalPages: 0
      };
    }

    return response.data;
  } catch (error) {
    throw new Error('Error al obtener grados');
  }
};

export const deleteGrado = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem('ceic_token');
    await axios.delete(`${environments.VITE_API_URL}/grado/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    throw new Error('Error al eliminar el grado');
  }
};

export interface ActualizarGradoDTO {
  id: number;
  nombre: string;
  idNivel: number;
  idJornada: number;
}

export interface ActualizarGradoResponse {
  message: string;
  grado: Grado;
}

export const actualizarGrado = async (gradoData: ActualizarGradoDTO): Promise<ActualizarGradoResponse> => {
  try {
    const token = localStorage.getItem('ceic_token');
    const response = await axios.put(
      `${environments.VITE_API_URL}/grado`, 
      gradoData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Error al actualizar el grado';
  }
};

export const gradoService = {
  getGradoById: async (id: string): Promise<Grado> => {
    try {
      const token = localStorage.getItem('ceic_token');
      const response = await axios.get(`${environments.VITE_API_URL}/grado/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.grado;
    } catch (error: any) {
      throw error.response?.data?.message || 'Error al obtener el grado';
    }
  },
  fetchGrados,
  deleteGrado,
  actualizarGrado
};
