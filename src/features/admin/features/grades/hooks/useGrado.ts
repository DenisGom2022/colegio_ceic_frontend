import { useState, useCallback } from 'react';
import { gradoService } from '../services/gradoService';
import type { Grado, AsignarCicloActualDTO } from '../services/gradoService';

export const useGrado = () => {
  const [grado, setGrado] = useState<Grado | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [assignCycleSuccess, setAssignCycleSuccess] = useState<boolean>(false);
  const [assignCycleMessage, setAssignCycleMessage] = useState<string>('');

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
  
  const asignarCicloActual = useCallback(async (data: AsignarCicloActualDTO) => {
    setLoading(true);
    // NO establecer error en null aquí para evitar limpiar errores de carga
    setAssignCycleSuccess(false);
    setAssignCycleMessage('');
    
    try {
      const response = await gradoService.asignarCicloActual(data);
      setGrado(response.grado);
      setAssignCycleSuccess(true);
      setAssignCycleMessage(response.message);
      setLoading(false);
      return response;
    } catch (error: any) {
      console.error('Error al asignar el grado al ciclo actual:', error);
      
      // El error puede ser un string directo desde el servicio
      const errorMessage = typeof error === 'string' ? error : (error?.message || 'Error al asignar el grado al ciclo actual');
      
      // NO establecer el error en el estado global, solo lanzarlo para que el componente lo maneje
      setAssignCycleSuccess(false);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    grado,
    loading,
    error,
    getGradoById,
    asignarCicloActual,
    assignCycleSuccess,
    assignCycleMessage
  };
};
