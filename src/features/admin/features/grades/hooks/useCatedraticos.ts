import { useState, useCallback } from 'react';
import axios from 'axios';
import { environments } from '../../../../../utils/environments';

interface CatedraticoSimple {
  dpi: string;
  nombres: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  genero?: string;
}

interface UseCatedraticoSimpleReturn {
  catedraticos: CatedraticoSimple[];
  loading: boolean;
  error: string | null;
  getCatedraticos: () => Promise<void>;
}

// Servicio para obtener todos los catedráticos (sin paginación)
const getAllCatedraticos = async (): Promise<CatedraticoSimple[]> => {
  const token = localStorage.getItem("ceic_token");
  // Usando el endpoint estándar de catedráticos
  const url = `${environments.VITE_API_URL}/catedratico`;

  const response = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  });

  // Transformar los datos al formato esperado por el modal
  // Asumiendo que la respuesta tiene la estructura { catedraticos: [...] }
  const catedraticos = response.data.catedraticos || response.data;
  
  return catedraticos.map((catedratico: any) => ({
    dpi: catedratico.dpi,
    nombres: [
      catedratico.usuario?.primerNombre,
      catedratico.usuario?.segundoNombre,
      catedratico.usuario?.tercerNombre
    ].filter(Boolean).join(' '),
    apellidos: [
      catedratico.usuario?.primerApellido,
      catedratico.usuario?.segundoApellido
    ].filter(Boolean).join(' '),
    email: catedratico.usuario?.email || '',
    telefono: catedratico.usuario?.telefono || '',
    genero: catedratico.usuario?.genero || ''
  }));
};

export const useCatedraticos = (): UseCatedraticoSimpleReturn => {
  const [catedraticos, setCatedraticos] = useState<CatedraticoSimple[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCatedraticos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllCatedraticos();
      setCatedraticos(data);
    } catch (error: any) {
      console.error('Error fetching catedráticos:', error);
      setError(error?.response?.data?.message || error.message || 'Error al cargar los catedráticos');
      setCatedraticos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    catedraticos,
    loading,
    error,
    getCatedraticos
  };
};
