import { useState, useCallback } from 'react';
import { createCurso, type CreateCursoRequest } from '../services/cursoService';

export const useCurso = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const createCourseForGrade = useCallback(async (courseData: CreateCursoRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage('');
    
    try {
      const response = await createCurso(courseData);
      setSuccess(true);
      setMessage(response.message);
      setLoading(false);
      return response;
    } catch (error: any) {
      console.error('Error creating course:', error);
      setError(error?.message || 'Error al crear el curso');
      setSuccess(false);
      setLoading(false);
      throw error;
    }
  }, []);

  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setMessage('');
  }, []);

  return {
    loading,
    error,
    success,
    message,
    createCourseForGrade,
    resetState
  };
};
