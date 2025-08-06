import { useState } from 'react';
import { getAlumnoByCui } from '../services/alumnoService';
import type { Alumno } from '../hooks/useTablaAlumno';

interface UseAlumnoProps {
  loading: boolean;
  error: string | null;
  alumno: Alumno | null;
  fetchAlumno: (cui: string) => Promise<void>;
}

export const useAlumno = (): UseAlumnoProps => {
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlumno = async (cui: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlumnoByCui(cui);
      setAlumno(data);
    } catch (err: any) {
      console.error('Error fetching alumno:', err);
      setError(err.response?.data?.message || 'Error al cargar los datos del alumno');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    alumno,
    fetchAlumno
  };
};
