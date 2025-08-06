import axios from 'axios';
import { environments } from '../utils/environments';
import type { Alumno } from '../hooks/useTablaAlumno';

const API_URL = environments.VITE_API_URL;

// Configuración para incluir automáticamente el token en las peticiones
const getAuthHeaders = () => {
  const token = localStorage.getItem('ceic_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Obtener todos los alumnos con paginación, búsqueda y ordenamiento
export const getAlumnos = async (
  page: number = 1, 
  pageSize: number = 10, 
  searchQuery: string = "",
  sortField: string = "primerNombre",
  sortDirection: string = "asc"
): Promise<{alumnos: Alumno[], total: number, totalPages: number}> => {
  try {
    let url = `${API_URL}/alumno?page=${page}&limit=${pageSize}`;
    
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }
    
    // Añadir parámetros de ordenamiento si están disponibles en el backend
    if (sortField) {
      url += `&sortBy=${encodeURIComponent(sortField)}`;
    }
    
    if (sortDirection) {
      url += `&sortDir=${encodeURIComponent(sortDirection)}`;
    }
    
    const response = await axios.get<{message: string, alumnos: Alumno[], total?: number, totalPages?: number}>(url, {
      headers: getAuthHeaders()
    });
    
    console.log('Respuesta del API de alumnos:', response.data);
    
    // Validar que la respuesta contiene un array de alumnos
    const alumnos = Array.isArray(response.data.alumnos) 
      ? response.data.alumnos
      : [];
      
    return {
      alumnos,
      total: response.data.total || alumnos.length,
      totalPages: response.data.totalPages || Math.ceil(alumnos.length / pageSize)
    };
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    throw error;
  }
};

// Obtener un alumno por su CUI
export const getAlumnoByCui = async (cui: string): Promise<Alumno> => {
  try {
    const response = await axios.get<{message: string, Alumno: Alumno}>(`${API_URL}/alumno/${cui}`, {
      headers: getAuthHeaders()
    });
    
    return response.data.Alumno;
  } catch (error) {
    console.error(`Error al obtener alumno con CUI ${cui}:`, error);
    throw error;
  }
};

// Eliminar un alumno
export const deleteAlumno = async (cui: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/alumno/${cui}`, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    console.error(`Error al eliminar alumno con CUI ${cui}:`, error);
    throw error;
  }
};

// Actualizar un alumno existente
export interface ResponsableData {
  idResponsable: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono: string;
  idParentesco: number;
}

export interface AlumnoUpdateData {
  cui: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono?: string;
  genero: 'M' | 'F';
  responsables?: ResponsableData[];
}

export const updateAlumno = async (alumnoData: AlumnoUpdateData): Promise<{message: string}> => {
  try {
    const response = await axios.put<{message: string}>(`${API_URL}/alumno`, alumnoData, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error al modificar alumno con CUI ${alumnoData.cui}:`, error);
    throw error;
  }
};
