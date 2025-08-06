import { useState } from 'react';
import { updateAlumno } from '../services/alumnoService';
import type { AlumnoUpdateData } from '../services/alumnoService';

interface UseEditarAlumnoReturn {
  editarAlumno: (alumnoData: AlumnoUpdateData) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useEditarAlumno = (): UseEditarAlumnoReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const editarAlumno = async (alumnoData: AlumnoUpdateData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await updateAlumno(alumnoData);
      setSuccess(true);
      console.log('Alumno modificado con éxito:', response.message);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Error al modificar el alumno';
      setError(errorMessage);
      console.error('Error en useEditarAlumno:', errorMessage);
      
      // Re-lanzar el error para que pueda ser capturado por el componente
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    editarAlumno,
    loading,
    error,
    success
  };
};
