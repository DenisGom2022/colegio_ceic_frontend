import { useState, useCallback, useEffect } from 'react';
import { getStudents } from '../services/studentService';
import { type Student } from '../models/Student';

interface StudentsResponse {
  items: Student[];
  totalItems: number;
  totalPages: number;
}

interface UseStudentTableResult {
  students: StudentsResponse;
  loading: boolean;
  error: string | null;
  totalPages: number;
  recargarDatos: () => Promise<void>;
}

export const useStudentTable = (
  initialPage: number = 1,
  initialPageSize: number = 10,
  initialSearchQuery: string = "",
  initialSortField: string = "primerNombre",
  initialSortDirection: string = "asc"
): UseStudentTableResult => {
  const [students, setStudents] = useState<StudentsResponse>({
    items: [],
    totalItems: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getStudents(initialPage, initialPageSize, initialSearchQuery, initialSortField, initialSortDirection);
      
      setStudents({
        items: response.students,
        totalItems: response.total,
        totalPages: response.totalPages
      });
    } catch (error: any) {
      setError(error.message || 'Error al cargar los estudiantes');
    } finally {
      setLoading(false);
    }
  }, [initialPage, initialPageSize, initialSearchQuery, initialSortField, initialSortDirection]);

  // Cargar datos cuando cambian los parámetros
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const recargarDatos = useCallback(async () => {
    await fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    totalPages: students.totalPages,
    recargarDatos
  };
};
