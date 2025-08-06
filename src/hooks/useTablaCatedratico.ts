import { useState, useEffect } from 'react';
import { getCatedraticos } from '../services/catedraticoService';

export interface Usuario {
  usuario: string;
  primerNombre: string;
  segundoNombre: string;
  tercerNombre: string;
  primerApellido: string;
  segundoApellido: string;
  idTipoUsuario: number;
  telefono: string;
  cambiarContrasena: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tipoUsuario: {
    id: number;
    descripcion: string;
    createdAt: string;
  };
}

export interface Catedratico {
  dpi: string;
  idUsuario: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  usuario: Usuario;
}

export interface CatedraticoResponse {
  message: string;
  catedraticos: Catedratico[];
}

export const useTablaCatedratico = (page: number = 1, pageSize: number = 10, searchQuery: string = "") => {
  const [catedraticos, setCatedraticos] = useState<Catedratico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCatedraticos();
  }, [page, pageSize, searchQuery]);

  const fetchCatedraticos = async () => {
      try {
        setLoading(true);
        console.log('Solicitando catedráticos con parámetros:', { page, pageSize, searchQuery });
        const data = await getCatedraticos(page, pageSize, searchQuery);
        
        // Verificar si los datos recibidos son válidos
        if (data && Array.isArray(data.catedraticos)) {
          console.log('Datos recibidos correctamente:', data);
          setCatedraticos(data.catedraticos);
          setTotal(data.total);
          setTotalPages(data.totalPages);
          setError(null);
        } else {
          console.error('Formato de datos incorrecto:', data);
          setError('Formato de datos incorrecto recibido del servidor');
          setCatedraticos([]);
          setTotal(0);
          setTotalPages(0);
        }
      } catch (err: any) {
        console.error('Error al obtener catedráticos:', err);
        setError(err?.response?.data?.message || err.message || 'Error al obtener los datos de catedráticos');
        setCatedraticos([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

  const recargarDatos = fetchCatedraticos;

  return { catedraticos, loading, error, total, totalPages, recargarDatos };
};
