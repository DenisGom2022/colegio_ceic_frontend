import { useState, useEffect, useCallback } from 'react';
import { getCiclos } from '../services/cicloService';
import type { Ciclo } from '../services/cicloService';

interface TablaCicloResult {
  ciclos: Ciclo[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  recargarDatos: () => Promise<void>;
}

export function useTablaCiclo(
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = ''
  // Eliminamos los parámetros de ordenación
  // sortField: string = 'id',
  // sortDirection: string = 'desc'
): TablaCicloResult {
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchCiclos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCiclos();
      
      let filteredCiclos = response.ciclos;
      
      // Aplicar búsqueda si existe
      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filteredCiclos = filteredCiclos.filter(ciclo => {
          return (
            ciclo.descripcion.toLowerCase().includes(query) ||
            ciclo.id.toString().includes(query)
          );
        });
      }
      
      // Eliminamos la ordenación para mantener el orden original del backend
      
      // Calcular paginación
      const totalFiltered = filteredCiclos.length;
      const totalPagesCalculated = Math.ceil(totalFiltered / pageSize);
      
      // Obtener solo los ciclos de la página actual
      const startIndex = (page - 1) * pageSize;
      const paginatedCiclos = filteredCiclos.slice(startIndex, startIndex + pageSize);
      
      setCiclos(paginatedCiclos);
      setTotal(totalFiltered);
      setTotalPages(totalPagesCalculated);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error al cargar los ciclos");
      setCiclos([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    fetchCiclos();
  }, [fetchCiclos]);

  const recargarDatos = useCallback(async () => {
    await fetchCiclos();
  }, [fetchCiclos]);

  return { ciclos, loading, error, total, totalPages, recargarDatos };
}
