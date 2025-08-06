import { useState, useEffect } from 'react';
import { getCicloDetalle } from '../services/cicloService';
import type { Ciclo } from '../services/cicloService';

interface DetalleCicloResult {
  ciclo: Ciclo | null;
  loading: boolean;
  error: string | null;
  recargarDatos: () => void;
}

export function useDetalleCiclo(cicloId: number): DetalleCicloResult {
  const [ciclo, setCiclo] = useState<Ciclo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  useEffect(() => {
    const fetchCicloDetalle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCicloDetalle(cicloId);
        setCiclo(response.ciclo);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Error al cargar el detalle del ciclo");
        setCiclo(null);
      } finally {
        setLoading(false);
      }
    };

    if (cicloId) {
      fetchCicloDetalle();
    } else {
      setError("ID de ciclo no proporcionado");
      setLoading(false);
      setCiclo(null);
    }
  }, [cicloId, refreshCounter]);

  const recargarDatos = () => {
    setRefreshCounter(prev => prev + 1);
  };

  return { ciclo, loading, error, recargarDatos };
}
