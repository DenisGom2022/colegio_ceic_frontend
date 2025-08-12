import { useState } from 'react';
import { deleteStudent } from '../services/studentService';

interface UseDeleteStudentResult {
  deleteStudent: (cui: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useDeleteStudent = (): UseDeleteStudentResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleDeleteStudent = async (cui: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await deleteStudent(cui);
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar el estudiante');
      console.error('Error en useDeleteStudent:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteStudent: handleDeleteStudent,
    loading,
    error,
    success
  };
};
