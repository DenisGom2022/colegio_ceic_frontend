import axios from 'axios';
import { environments } from '../../../../../utils/environments';
import type { Usuario } from '../../users';

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
  fechaFin: string | null;
  updatedAt: string;
  deletedAt: string | null;
}


interface Catedratico {
  dpi: string;
  idUsuario: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  usuario: Usuario;
}

export interface Curso {
  id: number;
  nombre: string;
  notaMaxima: number;
  notaAprobada: number;
  idGradoCiclo: number;
  dpiCatedratico: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  catedratico: Catedratico;
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
  cursos?: Curso[];
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
  ciclosActivos?: GradoCiclo[];
  ciclosFinalizados?: GradoCiclo[];
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

export interface AsignarCicloActualDTO {
  idGrado: number;
  precioPago: number;
  cantidadPagos: number;
  precioInscripcion: number;
}

export interface AsignarCicloActualResponse {
  message: string;
  grado: Grado;
  ciclo: Ciclo;
}

export const gradoService = {
  getGradoById: async (id: string): Promise<Grado> => {
    try {
      const token = localStorage.getItem('ceic_token');
      const response = await axios.get(`${environments.VITE_API_URL}/grado/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Debug - Respuesta completa del backend:', response.data);
      console.log('Debug - Grado recibido:', response.data.grado);
      
      return response.data.grado;
    } catch (error: any) {
      throw error.response?.data?.message || 'Error al obtener el grado';
    }
  },
  
  // Nueva función para obtener grados con ciclos activos
  getGradosWithActiveCycles: async (): Promise<Grado[]> => {
    try {
      const token = localStorage.getItem('ceic_token');
      // Obtener todos los grados sin paginación
      const response = await axios.get(`${environments.VITE_API_URL}/grado?limit=1000`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.data || !response.data.grados) {
        return [];
      }
      
      // Obtener detalles completos de cada grado
      const gradosWithDetails = await Promise.all(
        response.data.grados.map(async (grado: Grado) => {
          try {
            return await gradoService.getGradoById(grado.id.toString());
          } catch (error) {
            console.error(`Error al obtener detalles del grado ${grado.id}:`, error);
            return null;
          }
        })
      );
      
      // Filtrar grados nulos y que tengan ciclos activos
      return gradosWithDetails
        .filter((grado): grado is Grado => grado !== null)
        .filter((grado) => {
          // Revisar si tiene ciclosActivos definidos
          if (grado.ciclosActivos && grado.ciclosActivos.length > 0) {
            return true;
          }
          
          // Si no tiene ciclosActivos, revisar en gradosCiclo si hay algún ciclo sin fechaFin
          if (grado.gradosCiclo && grado.gradosCiclo.length > 0) {
            return grado.gradosCiclo.some(gc => gc.ciclo.fechaFin === null);
          }
          
          return false;
        });
    } catch (error: any) {
      console.error('Error al obtener grados con ciclos activos:', error);
      throw error.response?.data?.message || 'Error al obtener grados con ciclos activos';
    }
  },

  asignarCicloActual: async (data: AsignarCicloActualDTO): Promise<AsignarCicloActualResponse> => {
    try {
      const token = localStorage.getItem('ceic_token');
      const response = await axios.post(
        `${environments.VITE_API_URL}/grado/asignar-ciclo-actual`,
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
      throw error.response?.data?.message || 'Error al asignar el grado al ciclo actual';
    }
  },
  fetchGrados,
  deleteGrado,
  actualizarGrado
};
