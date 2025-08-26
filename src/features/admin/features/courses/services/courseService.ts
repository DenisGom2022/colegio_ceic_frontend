import axios from 'axios';
import { environments } from '../../../../../utils/environments';
import type { CoursesResponse, Course } from '../models';

export interface CreateCourseRequest {
  nombre: string;
  notaMaxima: number;
  notaAprobada: number;
  idGrado: number;
  dpiCatedratico: string;
}

export interface CreateCourseResponse {
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

export const getCourses = async (): Promise<CoursesResponse> => {
  try {
    const token = localStorage.getItem("ceic_token");
    const url = environments.VITE_API_URL + '/curso';

    const response = await axios.get<CoursesResponse>(
      url,
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
    console.error('Error fetching courses:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 401) {
      throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
    } else if (error.response?.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción.');
    } else if (error.response?.status === 404) {
      throw new Error('No se encontraron cursos.');
    } else {
      throw new Error('Error al obtener los cursos. Inténtalo de nuevo.');
    }
  }
};

export const getCourseById = async (id: string): Promise<{ message: string; curso: Course }> => {
  try {
    const token = localStorage.getItem("ceic_token");
    const url = environments.VITE_API_URL + `/curso/${id}`;

    const response = await axios.get<{ message: string; curso: Course }>(
      url,
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
    console.error('Error fetching course:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 401) {
      throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
    } else if (error.response?.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción.');
    } else if (error.response?.status === 404) {
      throw new Error('Curso no encontrado.');
    } else {
      throw new Error('Error al obtener el curso. Inténtalo de nuevo.');
    }
  }
};

export const createCourse = async (courseData: CreateCourseRequest): Promise<CreateCourseResponse> => {
  try {
    const token = localStorage.getItem("ceic_token");
    const url = environments.VITE_API_URL + '/curso';

    const response = await axios.post<CreateCourseResponse>(
      url,
      courseData,
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
    console.error('Error creating course:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 401) {
      throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
    } else if (error.response?.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción.');
    } else {
      throw new Error('Error al crear el curso. Inténtalo de nuevo.');
    }
  }
};
