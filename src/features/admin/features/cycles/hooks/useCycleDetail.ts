import { useState, useEffect } from 'react';
import type { Ciclo } from '../models/Ciclo';
import { cycleService } from '../services/cycleService';

interface DetalleCicloResult {
  ciclo: Ciclo | null;
  loading: boolean;
  error: string | null;
  recargarDatos: () => void;
}

export function useCycleDetail(cycleId: number): DetalleCicloResult {
  const [ciclo, setCiclo] = useState<Ciclo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  useEffect(() => {
    const fetchCycleDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await cycleService.getCicloDetalle(cycleId);
        setCiclo(response.ciclo);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Error al cargar el detalle del ciclo");
        setCiclo(null);
      } finally {
        setLoading(false);
      }
    };

    if (cycleId) {
      fetchCycleDetail();
    } else {
      setError("ID de ciclo no proporcionado");
      setLoading(false);
      setCiclo(null);
    }
  }, [cycleId, refreshCounter]);

  const recargarDatos = () => {
    setRefreshCounter(prev => prev + 1);
  };

  return {
    ciclo,
    loading,
    error,
    recargarDatos
  };
}
