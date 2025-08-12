import { useState } from 'react';
import { getTeacherById } from '../services/teacherService';
import type { Teacher } from '../models/Teacher';

interface UseTeacherReturn {
  teacher: Teacher | null;
  loading: boolean;
  error: string | null;
  fetchTeacher: (id: string) => Promise<void>;
}

export const useTeacher = (): UseTeacherReturn => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeacher = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTeacherById(id);
      setTeacher(data);
    } catch (error: any) {
      console.error('Error fetching teacher:', error);
      setError(error?.response?.data?.message || error.message || 'Error al cargar el catedrático');
      setTeacher(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    teacher,
    loading,
    error,
    fetchTeacher
  };
};
