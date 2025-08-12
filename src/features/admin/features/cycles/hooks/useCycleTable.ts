import { useState, useEffect, useCallback } from 'react';
import type { Ciclo } from '../models/Ciclo';
import { cycleService } from '../services/cycleService';

interface TablaCicloResult {
  ciclos: Ciclo[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  recargarDatos: () => Promise<void>;
}

export function useCycleTable(
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = ''
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
      const response = await cycleService.getCiclos();
      
      // Filtrar ciclos según searchQuery si es necesario
      let filteredCiclos = response.ciclos;
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        filteredCiclos = filteredCiclos.filter(ciclo => 
          ciclo.descripcion.toLowerCase().includes(searchLower) || 
          ciclo.id.toString().includes(searchLower)
        );
      }

      // Calcular el total y páginas
      const totalItems = filteredCiclos.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      
      // Aplicar paginación
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCiclos = filteredCiclos.slice(startIndex, endIndex);
      
      setCiclos(paginatedCiclos);
      setTotal(totalItems);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error al cargar ciclos:', error);
      setError('Error al cargar los datos de los ciclos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    fetchCiclos();
  }, [fetchCiclos]);

  return {
    ciclos,
    loading,
    error,
    total,
    totalPages,
    recargarDatos: fetchCiclos
  };
}
