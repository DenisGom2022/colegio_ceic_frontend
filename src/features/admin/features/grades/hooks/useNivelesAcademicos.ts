import { useState, useEffect } from 'react';
import axios from 'axios';
import { environments } from '../../../../../utils/environments';

export interface NivelAcademico {
  id: number;
  descripcion: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

interface NivelesResponse {
  message: string;
  niveles: NivelAcademico[];
}

export const useNivelesAcademicos = () => {
  const [niveles, setNiveles] = useState<NivelAcademico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNiveles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<NivelesResponse>(
        `${environments.VITE_API_URL}/nivel-academico`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ceic_token')}`
          }
        }
      );

      setNiveles(response.data.niveles);
      setLoading(false);
    } catch (error: any) {
      let errorMessage = 'Error al cargar los niveles académicos';
      
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
    fetchNiveles();
  }, []);

  return {
    niveles,
    loading,
    error,
    reloadNiveles: fetchNiveles
  };
};
