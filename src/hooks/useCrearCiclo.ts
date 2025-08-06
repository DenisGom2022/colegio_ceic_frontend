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
      const errorMessage = err.response?.data?.message || err.message || "Error al crear el ciclo";
      setError(errorMessage);
      return false;
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
