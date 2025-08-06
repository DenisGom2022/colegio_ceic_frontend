import { useState } from 'react';
import { createCiclo } from '../services/cicloService';
import type { Ciclo } from '../services/cicloService';

interface CrearCicloData {
  id: string;
  descripcion: string;
}

interface CrearCicloResult {
  ciclo: Ciclo | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  crearCiclo: (data: CrearCicloData) => Promise<boolean>;
  resetState: () => void;
}

export function useCrearCiclo(): CrearCicloResult {
  const [ciclo, setCiclo] = useState<Ciclo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const crearCiclo = async (data: CrearCicloData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await createCiclo(data);
      setCiclo(response.ciclo);
      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error('Error en useCrearCiclo:', err);
      // Manejar diferentes formatos de error desde el backend
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        (err.response?.data && typeof err.response.data === 'string' ? err.response.data : null) || 
        err.message || 
        "Error al crear el ciclo";
      setError(errorMessage);
      // Propagar el error para que el componente pueda manejarlo
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setCiclo(null);
    setError(null);
    setSuccess(false);
  };

  return {
    ciclo,
    loading,
    error,
    success,
    crearCiclo,
    resetState
  };
}
