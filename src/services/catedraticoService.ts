import axios from 'axios';
import { environments } from '../utils/environments';
import type { Catedratico } from '../hooks/useTablaCatedratico';

const API_URL = environments.VITE_API_URL;

// Configuración para incluir automáticamente el token en las peticiones
const getAuthHeaders = () => {
  const token = localStorage.getItem('ceic_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Obtener todos los catedráticos con paginación y búsqueda
export const getCatedraticos = async (page: number = 1, pageSize: number = 10, searchQuery: string = ""): Promise<{catedraticos: Catedratico[], total: number, totalPages: number}> => {
  try {
    let url = `${API_URL}/catedratico?page=${page}&limit=${pageSize}`;
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }
    
    const response = await axios.get<{message: string, catedraticos: Catedratico[], total: number, totalPages: number}>(url, {
      headers: getAuthHeaders()
    });
    
    console.log('Respuesta del API:', response.data);
    
    // Validar que la respuesta contiene un array de catedráticos
    const catedraticos = Array.isArray(response.data.catedraticos) 
      ? response.data.catedraticos.map((catedratico: any) => {
          // Asegurar que cada catedrático tiene las propiedades necesarias
          return {
            dpi: catedratico.dpi || '',
            idUsuario: catedratico.idUsuario || '',
            createdAt: catedratico.createdAt || '',
            updatedAt: catedratico.updatedAt || '',
            deletedAt: catedratico.deletedAt,
            usuario: catedratico.usuario || null
          };
        })
      : [];
      
    return {
      catedraticos,
      total: response.data.total || 0,
      totalPages: response.data.totalPages || 0
    };
  } catch (error) {
    console.error('Error al obtener catedráticos:', error);
    throw error;
  }
};

// Obtener un catedrático por su ID (usuario/DPI)
export const getCatedraticoById = async (idUsuarioODpi: string): Promise<Catedratico> => {
  try {
    console.log(`Obteniendo catedrático con ID/DPI: ${idUsuarioODpi}`);
    const response = await axios.get<{message: string, catedratico: Catedratico}>(`${API_URL}/catedratico/${idUsuarioODpi}`, {
      headers: getAuthHeaders()
    });
    
    console.log('Respuesta del detalle de catedrático:', response.data);
    
    // Validar y asegurar que los datos tienen la estructura esperada
    const catedratico = response.data.catedratico;
    if (!catedratico) {
      throw new Error('No se recibieron datos del catedrático');
    }
    
    return {
      dpi: catedratico.dpi || '',
      idUsuario: catedratico.idUsuario || '',
      createdAt: catedratico.createdAt || '',
      updatedAt: catedratico.updatedAt || '',
      deletedAt: catedratico.deletedAt,
      usuario: catedratico.usuario || null
    };
  } catch (error) {
    console.error(`Error al obtener catedrático con ID/DPI ${idUsuarioODpi}:`, error);
    throw error;
  }
};

// Crear un nuevo catedrático
export const createCatedratico = async (catedratico: { dpi: string, idUsuario: string }): Promise<Catedratico> => {
  try {
    const response = await axios.post<{message: string, catedratico: Catedratico}>(`${API_URL}/catedratico`, catedratico, {
      headers: getAuthHeaders()
    });
    return response.data.catedratico;
  } catch (error) {
    console.error('Error al crear catedrático:', error);
    throw error;
  }
};

// Actualizar un catedrático
export const updateCatedratico = async (idUsuario: string, catedratico: { dpi: string }): Promise<Catedratico> => {
  try {
    const response = await axios.put<{message: string, catedratico: Catedratico}>(`${API_URL}/catedratico`, {
      dpi: catedratico.dpi,
      idUsuario: idUsuario
    }, {
      headers: getAuthHeaders()
    });
    return response.data.catedratico;
  } catch (error) {
    console.error(`Error al actualizar catedrático con ID ${idUsuario}:`, error);
    throw error;
  }
};

// Eliminar un catedrático
export const deleteCatedratico = async (dpi: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/catedratico/${dpi}`, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    console.error(`Error al eliminar catedrático con DPI ${dpi}:`, error);
    throw error;
  }
};
