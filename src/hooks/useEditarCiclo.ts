import { useState } from 'react';
import { updateCiclo } from '../services/cicloService';
import type { CicloUpdateData } from '../services/cicloService';

interface EditarCicloResult {
  cicloActualizado: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  editarCiclo: (data: CicloUpdateData) => Promise<any>;
  resetState: () => void;
}

export function useEditarCiclo(): EditarCicloResult {
  const [cicloActualizado, setCicloActualizado] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const editarCiclo = async (data: CicloUpdateData): Promise<any> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await updateCiclo(data);
      setCicloActualizado(response.ciclo);
      setSuccess(true);
      return response;
    } catch (err: any) {
      console.error('Error en useEditarCiclo:', err);
      
      // Extraer mensaje de error del backend
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        (err.response?.data && typeof err.response.data === 'string' ? err.response.data : null) || 
        err.message || 
        "Error al actualizar el ciclo";
      
      setError(errorMessage);
      // Propagar el error para que el componente pueda manejarlo
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setCicloActualizado(null);
    setError(null);
    setSuccess(false);
  };

  return {
    cicloActualizado,
    loading,
    error,
    success,
    editarCiclo,
    resetState
  };
}
