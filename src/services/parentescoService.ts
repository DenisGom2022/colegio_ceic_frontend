import axios from 'axios';
import { environments } from '../utils/environments';

export interface TipoParentesco {
  id: number;
  descripcion: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: null | string;
}

// Obtiene todos los tipos de parentesco
export const getTiposParentesco = async (): Promise<TipoParentesco[]> => {
  try {
    const token = localStorage.getItem('ceic_token');
    const response = await axios.get(`${environments.VITE_API_URL}/tipo-parentesco`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && Array.isArray(response.data.tiposParentesco)) {
      return response.data.tiposParentesco;
    }
    
    return [];
  } catch (error) {
    console.error('Error al obtener tipos de parentesco:', error);
    throw error;
  }
};

// Crea un nuevo tipo de parentesco
export const crearTipoParentesco = async (descripcion: string): Promise<TipoParentesco> => {
  try {
    const token = localStorage.getItem('ceic_token');
    const response = await axios.post(
      `${environments.VITE_API_URL}/tipo-parentesco`, 
      { descripcion },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (response.data && response.data.tipoParentesco) {
      return response.data.tipoParentesco;
    }
    
    throw new Error('Error al crear el tipo de parentesco');
  } catch (error) {
    console.error('Error al crear tipo de parentesco:', error);
    throw error;
  }
};
