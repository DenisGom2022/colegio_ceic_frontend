import { useState } from 'react';
import { finalizarCiclo } from '../services/cicloService';

interface FinalizarCicloResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  ejecutarFinalizarCiclo: (id: number) => Promise<any>;
  resetState: () => void;
}

export function useFinalizarCiclo(): FinalizarCicloResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const ejecutarFinalizarCiclo = async (id: number): Promise<any> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);
    
    try {
      const response = await finalizarCiclo(id);
      setSuccess(true);
      setMessage(response.message || 'Ciclo finalizado exitosamente');
      return { success: true, message: response.message };
    } catch (err: any) {
      console.error('Error en useFinalizarCiclo:', err);
      
      // Extraer mensaje de error del backend
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        (err.response?.data && typeof err.response.data === 'string' ? err.response.data : null) || 
        err.message || 
        "Error al finalizar el ciclo";
      
      setError(errorMessage);
      // Propagar el error para que el componente pueda manejarlo
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setMessage(null);
  };

  return {
    loading,
    error,
    success,
    message,
    ejecutarFinalizarCiclo,
    resetState
  };
}
