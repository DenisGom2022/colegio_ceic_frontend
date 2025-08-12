import { useState, useEffect } from 'react';
import { getTeachers } from '../services/teacherService';
import type { Teacher } from '../models/Teacher';

// Interfaz para la paginación y respuesta de la API
interface TeachersPaginated {
  items: Teacher[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// Interfaz para los parámetros del hook
interface TeacherTableParams {
  page: number;
  limit: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  searchTerm?: string;
}

// Interfaz para el retorno del hook
interface UseTeacherTableReturn {
  teachers: TeachersPaginated | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTeacherTable = ({
  page = 1,
  limit = 10,
  sortField = 'nombre',
  sortDirection = 'asc',
  searchTerm = ''
}: TeacherTableParams): UseTeacherTableReturn => {
  const [teachers, setTeachers] = useState<TeachersPaginated | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener los datos de la API
      const response = await getTeachers(page, limit, searchTerm, sortField, sortDirection);
      
      // Formatear la respuesta para que coincida con la interfaz TeachersPaginated
      const formattedResponse: TeachersPaginated = {
        items: response.catedraticos || [],
        totalItems: response.total || 0,
        totalPages: response.totalPages || 0,
        currentPage: page
      };
      
      setTeachers(formattedResponse);
    } catch (error: any) {
      console.error('Error al cargar los catedráticos:', error);
      setError(error?.response?.data?.message || error.message || 'Error al cargar los catedráticos');
      setTeachers(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, limit, sortField, sortDirection, searchTerm]);

  return {
    teachers,
    loading,
    error,
    refetch: fetchTeachers
  };
};
