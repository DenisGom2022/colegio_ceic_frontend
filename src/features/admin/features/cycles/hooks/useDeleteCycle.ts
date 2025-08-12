import { useState } from 'react';
import { cycleService } from '../services/cycleService';

export function useDeleteCycle() {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCycle = async (id: number): Promise<any> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await cycleService.deleteCiclo(id);
      setSuccess(true);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Error al eliminar el ciclo';
      setError(errorMessage);
      console.error('Error en useDeleteCycle:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteCycle,
    loading,
    success,
    error
  };
}
