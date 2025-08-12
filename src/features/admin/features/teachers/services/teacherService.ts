import axios from 'axios';
import { environments } from '../../../../../utils/environments';
import type { Teacher } from '../models/Teacher';

const API_URL = environments.VITE_API_URL;

// Configuración para incluir automáticamente el token en las peticiones
const getAuthHeaders = () => {
  const token = localStorage.getItem('ceic_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Obtener todos los catedráticos con paginación, búsqueda y ordenamiento
export const getTeachers = async (
  page: number = 1, 
  pageSize: number = 10, 
  searchQuery: string = "",
  sortField: string = "nombre",
  sortDirection: "asc" | "desc" = "asc"
): Promise<{catedraticos: Teacher[], total: number, totalPages: number}> => {
  try {
    let url = `${API_URL}/catedratico?page=${page}&limit=${pageSize}`;
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }
    
    // Añadir parámetros de ordenamiento
    if (sortField) {
      url += `&sortField=${encodeURIComponent(sortField)}`;
    }
    
    if (sortDirection) {
      url += `&sortDirection=${encodeURIComponent(sortDirection)}`;
    }
    
    const response = await axios.get<{message: string, catedraticos: Teacher[], total: number, totalPages: number}>(url, {
      headers: getAuthHeaders()
    });
    
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
export const getTeacherById = async (idUsuarioODpi: string): Promise<Teacher> => {
  try {
    const response = await axios.get<{message: string, catedratico: Teacher}>(`${API_URL}/catedratico/${idUsuarioODpi}`, {
      headers: getAuthHeaders()
    });
    
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
export const createTeacher = async (
  catedratico: { dpi: string, idUsuario: string }
): Promise<Teacher> => {
  try {
    const response = await axios.post<{message: string, catedratico: Teacher}>(
      `${API_URL}/catedratico`, 
      catedratico, 
      { headers: getAuthHeaders() }
    );
    return response.data.catedratico;
  } catch (error) {
    console.error('Error al crear catedrático:', error);
    throw error;
  }
};

// Actualizar un catedrático
export const updateTeacher = async (
  idUsuario: string, 
  catedratico: { dpi: string }
): Promise<Teacher> => {
  try {
    const response = await axios.put<{message: string, catedratico: Teacher}>(
      `${API_URL}/catedratico`, 
      {
        dpi: catedratico.dpi,
        idUsuario: idUsuario
      }, 
      { headers: getAuthHeaders() }
    );
    return response.data.catedratico;
  } catch (error) {
    console.error('Error al actualizar catedrático:', error);
    throw error;
  }
};

// Eliminar un catedrático
export const deleteTeacher = async (dpi: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/catedratico/${dpi}`, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    console.error('Error al eliminar catedrático:', error);
    throw error;
  }
};
