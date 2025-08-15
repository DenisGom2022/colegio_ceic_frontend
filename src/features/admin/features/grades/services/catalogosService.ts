import axios from 'axios';
import { environments } from '../../../../../utils/environments';

export interface NivelAcademico {
  id: number;
  descripcion: string;
}

export interface Jornada {
  id: number;
  descripcion: string;
}

export const fetchNivelesAcademicos = async (): Promise<NivelAcademico[]> => {
  try {
    const token = localStorage.getItem('ceic_token');
    const response = await axios.get(`${environments.VITE_API_URL}/catalogo/nivel-academico`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Verificar la estructura de la respuesta y mostrar un log para debugging
    console.log('Respuesta de nivel académico:', response.data);
    
    // Si la respuesta tiene un formato diferente, intentar encontrar los niveles en otra propiedad
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.niveles && Array.isArray(response.data.niveles)) {
      return response.data.niveles;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Formato de respuesta inesperado para niveles académicos:', response.data);
      return [];
    }
  } catch (error: any) {
    console.error('Error al obtener niveles académicos:', error?.response?.data || error.message);
    throw new Error('No se pudieron cargar los niveles académicos');
  }
};

export const fetchJornadas = async (): Promise<Jornada[]> => {
  try {
    const token = localStorage.getItem('ceic_token');
    const response = await axios.get(`${environments.VITE_API_URL}/catalogo/jornada`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Verificar la estructura de la respuesta y mostrar un log para debugging
    console.log('Respuesta de jornadas:', response.data);
    
    // Si la respuesta tiene un formato diferente, intentar encontrar las jornadas en otra propiedad
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.jornadas && Array.isArray(response.data.jornadas)) {
      return response.data.jornadas;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Formato de respuesta inesperado para jornadas:', response.data);
      return [];
    }
  } catch (error: any) {
    console.error('Error al obtener jornadas:', error?.response?.data || error.message);
    throw new Error('No se pudieron cargar las jornadas');
  }
};

export const catalogosService = {
  fetchNivelesAcademicos,
  fetchJornadas
};
