import { useState, useEffect } from 'react';
import axios from 'axios';
import { environments } from '../../../../../utils/environments';

export interface Jornada {
  id: number;
  descripcion: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

interface JornadasResponse {
  message: string;
  jornadas: Jornada[];
}

export const useJornadas = () => {
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJornadas = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<JornadasResponse>(
        `${environments.VITE_API_URL}/jornada`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ceic_token')}`
          }
        }
      );

      setJornadas(response.data.jornadas);
      setLoading(false);
    } catch (error: any) {
      let errorMessage = 'Error al cargar las jornadas';
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJornadas();
  }, []);

  return {
    jornadas,
    loading,
    error,
    reloadJornadas: fetchJornadas
  };
};
