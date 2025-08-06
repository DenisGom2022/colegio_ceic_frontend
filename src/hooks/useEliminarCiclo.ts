import { useState } from 'react';
import { deleteCiclo } from '../services/cicloService';

export function useEliminarCiclo() {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarCiclo = async (id: number): Promise<any> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await deleteCiclo(id);
      setSuccess(true);
      return { success: true};
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Error al eliminar el ciclo';
      setError(errorMessage);
      console.error('Error en useEliminarCiclo:', errorMessage);
      return { success: false, error: errorMessage};;
    } finally {
      setLoading(false);
    }
  };

  return {
    eliminarCiclo,
    loading,
    success,
    error
  };
}
