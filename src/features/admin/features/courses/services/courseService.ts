import axios from 'axios';
import { environments } from '../../../../../utils/environments';
import type { CoursesResponse } from '../models';

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
