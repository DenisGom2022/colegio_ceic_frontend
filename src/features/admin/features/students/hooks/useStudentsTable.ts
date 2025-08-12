import { useState } from 'react';
import { getStudents } from '../services/studentService';
import { type Student } from '../models/Student';

interface UseStudentsTableResult {
  students: Student[];
  loading: boolean;
  error: string | null;
  totalStudents: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  sortField: string;
  sortDirection: string;
  fetchStudents: (page?: number, limit?: number, search?: string, sort?: string, direction?: string) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchQuery: (query: string) => void;
  setSortField: (field: string) => void;
  setSortDirection: (direction: string) => void;
}

export const useStudentsTable = (): UseStudentsTableResult => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('primerNombre');
  const [sortDirection, setSortDirection] = useState<string>('asc');

  const fetchStudents = async (
    page: number = currentPage,
    limit: number = pageSize,
    search: string = searchQuery,
    sort: string = sortField,
    direction: string = sortDirection
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getStudents(page, limit, search, sort, direction);
      
      setStudents(response.students);
      setTotalStudents(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
      setPageSize(limit);
      setSearchQuery(search);
      setSortField(sort);
      setSortDirection(direction);
    } catch (err) {
      setError('Error al cargar los estudiantes');
      console.error('Error en useStudentsTable:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    students,
    loading,
    error,
    totalStudents,
    totalPages,
    currentPage,
    pageSize,
    searchQuery,
    sortField,
    sortDirection,
    fetchStudents,
    setCurrentPage,
    setPageSize,
    setSearchQuery,
    setSortField,
    setSortDirection
  };
};
