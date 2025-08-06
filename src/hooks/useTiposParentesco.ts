import { useState, useEffect, useCallback } from 'react';
import { getTiposParentesco, crearTipoParentesco } from '../services/parentescoService';
import type { TipoParentesco } from '../services/parentescoService';

export const useTiposParentesco = () => {
  const [tiposParentesco, setTiposParentesco] = useState<TipoParentesco[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposParentesco = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTiposParentesco();
      setTiposParentesco(data);
    } catch (err) {
      setError('Error al cargar los tipos de parentesco');
      console.error('Error en useTiposParentesco:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposParentesco();
  }, [fetchTiposParentesco]);

  const crearNuevoTipoParentesco = async (descripcion: string) => {
    // No establecemos setError aquí para evitar que se muestre la notificación de error general
    setLoading(true);
    try {
      const nuevoTipo = await crearTipoParentesco(descripcion);
      setTiposParentesco(prev => [...prev, nuevoTipo]);
      // Si todo sale bien, aseguramos que no haya error
      setError(null);
      return nuevoTipo;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al crear tipo de parentesco';
      // No establecemos setError aquí para evitar que se muestre la notificación de error general
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    tiposParentesco,
    loading,
    error,
    crearNuevoTipoParentesco,
    recargarTipos: fetchTiposParentesco
  };
};
