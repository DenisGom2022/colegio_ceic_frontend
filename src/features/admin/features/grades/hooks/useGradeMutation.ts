import { useState } from 'react';
import axios from 'axios';
import { environments } from '../../../../../utils/environments';

interface CreateGradeData {
  nombre: string;
  idNivel: number;
  idJornada: number;
}

interface CreateGradeResponse {
  message: string;
}

export const useCreateGrade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createGrade = async (data: CreateGradeData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post<CreateGradeResponse>(
        `${environments.VITE_API_URL}/grado`,
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
      return response.data;
    } catch (error: any) {
      let errorMessage = 'Error al crear el grado';
      
      if (error.response) {
        // El servidor respondió con un código de estado diferente de 2xx
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // La petición se hizo pero no se recibió respuesta
        errorMessage = 'No se pudo conectar con el servidor';
      }
      
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    createGrade,
    loading,
    error,
    success
  };
};
