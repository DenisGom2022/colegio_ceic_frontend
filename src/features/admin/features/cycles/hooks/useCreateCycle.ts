import { useState } from 'react';
import type { Ciclo } from '../models/Ciclo';
import { cycleService } from '../services/cycleService';

interface CreateCycleData {
  id: string;
  descripcion: string;
  cantidadBimestres: number;
}

interface CreateCycleResult {
  ciclo: Ciclo | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  createCycle: (data: CreateCycleData) => Promise<{success: boolean; errorMessage: string | null}>;
  resetState: () => void;
}

export function useCreateCycle(): CreateCycleResult {
  const [ciclo, setCiclo] = useState<Ciclo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createCycle = async (data: CreateCycleData): Promise<{success: boolean; errorMessage: string | null}> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await cycleService.createCiclo(data);
      setCiclo(response.ciclo);
      setSuccess(true);
      return { success: true, errorMessage: null };
    } catch (err: any) {
      console.error('Error en useCreateCycle:', err);
      // Manejar diferentes formatos de error desde el backend
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        (err.response?.data && typeof err.response.data === 'string' ? err.response.data : null) || 
        err.message || 
        "Error al crear el ciclo";
      
      setError(errorMessage);
      return { success: false, errorMessage };
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
    createCycle,
    resetState
  };
}
