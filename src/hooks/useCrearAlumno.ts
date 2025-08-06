import { useState } from 'react';
import axios from 'axios';
import { environments } from '../utils/environments';

const API_URL = environments.VITE_API_URL;

// Interfaces para tipado
export interface Responsable {
  idResponsable: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono: string;
  idParentesco: number;
}

export interface AlumnoData {
  cui: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono: string;
  genero: 'M' | 'F';
  responsables: Responsable[];
}

export interface UseCrearAlumnoResult {
  crearAlumno: (alumno: AlumnoData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useCrearAlumno = (): UseCrearAlumnoResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const crearAlumno = async (alumno: AlumnoData): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('ceic_token');
      
      await axios.post(
        `${API_URL}/alumno`,
        alumno,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSuccess(true);
    } catch (err: any) {
      console.error('Error al crear alumno:', err);
      
      // Intentar obtener un mensaje de error específico de la API
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        'Error al crear el alumno';
        
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { crearAlumno, loading, error, success };
};
