import { useState } from 'react';
import axios from 'axios';
import { environments } from '../../../../../utils/environments';
import type { NivelAcademico } from './useNivelesAcademicos';

interface CreateNivelRequest {
  descripcion: string;
}

interface CreateNivelResponse {
  message: string;
  nivel: NivelAcademico;
}

export const useCreateNivel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createNivel = async (data: CreateNivelRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post<CreateNivelResponse>(
        `${environments.VITE_API_URL}/nivel-academico`,
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
      return response.data.nivel;
    } catch (error: any) {
      let errorMessage = 'Error al crear el nivel académico';
      
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
    createNivel,
    loading,
    error,
    success
  };
};
