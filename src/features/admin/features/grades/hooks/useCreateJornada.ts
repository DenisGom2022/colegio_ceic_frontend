import { useState } from 'react';
import axios from 'axios';
import { environments } from '../../../../../utils/environments';
import type { Jornada } from './useJornadas';

interface CreateJornadaRequest {
  descripcion: string;
}

interface CreateJornadaResponse {
  message: string;
  jornada: Jornada;
}

export const useCreateJornada = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createJornada = async (data: CreateJornadaRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post<CreateJornadaResponse>(
        `${environments.VITE_API_URL}/jornada`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('ceic_token')}`
          }
        }
      );

      setSuccess(true);
      setLoading(false);
      return response.data.jornada;
    } catch (error: any) {
      let errorMessage = 'Error al crear la jornada';
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor';
      }
      
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    createJornada,
    loading,
    error,
    success
  };
};
