import { useState } from 'react';
import { createTeacher, updateTeacher } from '../services/teacherService';
import type { Teacher } from '../models/Teacher';

interface UseCreateTeacherReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  createTeacher: (data: { dpi: string; idUsuario: string }) => Promise<Teacher | null>;
}

export const useCreateTeacher = (): UseCreateTeacherReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleCreateTeacher = async (data: { dpi: string; idUsuario: string }): Promise<Teacher | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await createTeacher(data);
      
      setSuccess(true);
      return result;
    } catch (error: any) {
      setError(error?.response?.data?.message || error.message || 'Error al crear el catedrático');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    createTeacher: handleCreateTeacher
  };
};

interface UseEditTeacherReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  updateTeacher: (idUsuario: string, data: { dpi: string }) => Promise<Teacher | null>;
}

export const useEditTeacher = (): UseEditTeacherReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleUpdateTeacher = async (idUsuario: string, data: { dpi: string }): Promise<Teacher | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await updateTeacher(idUsuario, data);
      
      setSuccess(true);
      return result;
    } catch (error: any) {
      setError(error?.response?.data?.message || error.message || 'Error al actualizar el catedrático');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    updateTeacher: handleUpdateTeacher
  };
};
