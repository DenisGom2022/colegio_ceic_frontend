import { useState } from 'react';
import type { CicloUpdateData } from '../models/Ciclo';
import { cycleService } from '../services/cycleService';

interface EditCycleResult {
  cycleUpdated: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  updateCycle: (data: CicloUpdateData) => Promise<any>;
  resetState: () => void;
}

export function useEditCycle(): EditCycleResult {
  const [cycleUpdated, setCycleUpdated] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateCycle = async (data: CicloUpdateData): Promise<any> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await cycleService.updateCiclo(data);
      setCycleUpdated(response.ciclo);
      setSuccess(true);
      return response;
    } catch (err: any) {
      console.error('Error en useEditCycle:', err);
      
      // Extraer mensaje de error del backend
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        (err.response?.data && typeof err.response.data === 'string' ? err.response.data : null) || 
        err.message || 
        "Error al actualizar el ciclo";
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setCycleUpdated(null);
    setError(null);
    setSuccess(false);
  };

  return {
    cycleUpdated,
    loading,
    error,
    success,
    updateCycle,
    resetState
  };
}
