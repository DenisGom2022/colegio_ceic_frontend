import { useState } from 'react';
import { deleteTeacher } from '../services/teacherService';

interface UseDeleteTeacherReturn {
  loading: boolean;
  error: string | null;
  deleteTeacher: (dpi: string) => Promise<boolean>;
}

export const useDeleteTeacher = (): UseDeleteTeacherReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteTeacher = async (dpi: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await deleteTeacher(dpi);
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Error al eliminar el catedrático';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    deleteTeacher: handleDeleteTeacher
  };
};
