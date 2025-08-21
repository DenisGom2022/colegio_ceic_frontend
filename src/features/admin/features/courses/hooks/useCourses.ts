import { useState, useEffect, useCallback } from 'react';
import { getCourses } from '../services';
import type { Course } from '../models';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getCourses();
      setCourses(response.cursos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los cursos');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const refreshCourses = () => {
    fetchCourses();
  };

  return {
    courses,
    loading,
    error,
    refreshCourses
  };
};
