import { useState, useCallback } from 'react';
import { gradoService } from '../services/gradoService';
import type { Grado } from '../services/gradoService';

export const useGrado = () => {
  const [grado, setGrado] = useState<Grado | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getGradoById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const gradoData = await gradoService.getGradoById(id);
      setGrado(gradoData);
      setLoading(false);
    } catch (error: any) {
      console.error('Error al obtener el grado:', error);
      setError(error?.message || 'Error al cargar la información del grado');
      setLoading(false);
    }
  }, []);

  return {
    grado,
    loading,
    error,
    getGradoById
  };
};
