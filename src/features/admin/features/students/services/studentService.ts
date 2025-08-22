import axios from 'axios';
import { environments } from '../../../../../utils/environments';
import type { Student } from '../models/Student';

const API_URL = environments.VITE_API_URL;
if (!API_URL) {
  console.error('ADVERTENCIA: La URL de la API no está configurada. Verifica la variable VITE_API_URL en tu archivo .env');
}

// Configuración para incluir automáticamente el token en las peticiones
const getAuthHeaders = () => {
  const token = localStorage.getItem('ceic_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Obtener todos los estudiantes con paginación, búsqueda y ordenamiento
export const getStudents = async (
  page: number = 1, 
  pageSize: number = 10, 
  searchQuery: string = ""
): Promise<{students: Student[], total: number, totalPages: number}> => {
  try {
    let url = `${API_URL}/alumno?page=${page}&limit=${pageSize}`;
    
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }
    
    const response = await axios.get<{message: string, alumnos: Student[], total?: number, totalPages?: number}>(url, {
      headers: getAuthHeaders()
    });
    
    // Validar que la respuesta contiene un array de estudiantes
    const students = Array.isArray(response.data.alumnos) 
      ? response.data.alumnos
      : [];
      
    return {
      students,
      total: response.data.total || students.length,
      totalPages: response.data.totalPages || Math.ceil(students.length / pageSize)
    };
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    throw error;
  }
};

// Obtener un estudiante por su CUI
export const getStudentByCui = async (cui: string): Promise<Student> => {
  try {
    console.log(`Solicitando estudiante con CUI: ${cui}`);
    const response = await axios.get<{message: string, Alumno: Student}>(`${API_URL}/alumno/${cui}`, {
      headers: getAuthHeaders()
    });
    
    console.log('Respuesta completa:', JSON.stringify(response.data));
    
    // Verificar si la respuesta contiene el alumno
    if (!response.data || !response.data.Alumno) {
      throw new Error(`No se encontraron datos para el estudiante con CUI ${cui}`);
    }
    
    return response.data.Alumno;
  } catch (error: any) {
    console.error(`Error al obtener estudiante con CUI ${cui}:`, error);
    // Mejorar el mensaje de error para depuración
    if (error.response) {
      console.error('Detalles del error:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw error;
  }
};

// Obtener todos los estudiantes (sin paginación) para el PDF
export const getAllStudentsForPDF = async (
  searchQuery: string = ""
): Promise<Student[]> => {
  try {
    let url = `${API_URL}/alumno`;
    
    // Sólo añadimos los parámetros de búsqueda
    if (searchQuery.trim()) {
      url += `?search=${encodeURIComponent(searchQuery.trim())}`;
    }
    
    const response = await axios.get<{message: string, alumnos: Student[]}>(url, {
      headers: getAuthHeaders()
    });
    
    // Validar que la respuesta contiene un array de estudiantes
    const students = Array.isArray(response.data.alumnos) 
      ? response.data.alumnos
      : [];
      
    return students;
  } catch (error) {
    console.error('Error al obtener estudiantes para PDF:', error);
    throw error;
  }
};

// Eliminar un estudiante
export const deleteStudent = async (cui: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/alumno/${cui}`, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    console.error(`Error al eliminar estudiante con CUI ${cui}:`, error);
    throw error;
  }
};

// Crear un nuevo estudiante
export interface StudentCreateData {
  cui: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono: string;
  genero: 'M' | 'F';
  responsables: StudentGuardianData[];
}

export interface StudentGuardianData {
  idResponsable: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono: string;
  idParentesco: number;
}

export const createStudent = async (studentData: StudentCreateData): Promise<Student> => {
  try {
    const response = await axios.post<{message: string, alumno: Student}>(`${API_URL}/alumno`, studentData, {
      headers: getAuthHeaders()
    });
    
    return response.data.alumno;
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    throw error;
  }
};

// Actualizar un estudiante existente
export interface StudentUpdateData {
  cui: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono?: string;
  genero: 'M' | 'F';
  responsables?: StudentGuardianData[];
}

export const updateStudent = async (cui: string, studentData: StudentUpdateData): Promise<String> => {
  try {
    console.log(`Actualizando estudiante con CUI: ${cui}`, studentData);
    const response = await axios.put<{message: string, alumno: Student}>(`${API_URL}/alumno`, studentData, {
      headers: getAuthHeaders()
    });
    
    
    return response.data.message;
  } catch (error: any) {
    console.error(`Error al actualizar estudiante con CUI ${cui}:`, error);
    // Mejorar el mensaje de error para depuración
    if (error.response) {
      console.error('Detalles del error de actualización:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw error;
  }
};
