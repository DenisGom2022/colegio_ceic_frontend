import { useState, useCallback } from 'react';
import { servicioService } from '../services/servicioService';
import type { CreateServicioDTO, CreateServicioResponse } from '../services/servicioService';

export const useServicio = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const createServicio = useCallback(async (data: CreateServicioDTO): Promise<CreateServicioResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage('');

    try {
      const response = await servicioService.createServicio(data);
      setSuccess(true);
      setMessage(response.message);
      setLoading(false);
      return response;
    } catch (error: any) {
      console.error('Error al crear el servicio:', error);
      const errorMessage = typeof error === 'string' ? error : (error?.message || 'Error al crear el servicio');
      setError(errorMessage);
      setSuccess(false);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
    setMessage('');
  }, []);

  return {
    loading,
    error,
    success,
    message,
    createServicio,
    resetState
  };
};