import { useState, useCallback } from 'react';
import { getCourseById, createCourse, type CreateCourseRequest } from '../services';
import type { Course } from '../models';

export const useCourse = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const fetchCourse = useCallback(async (id: string) => {
    setLoading(true);
    setError('');
    setCourse(null);
    
    try {
      const response = await getCourseById(id);
      setCourse(response.curso);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el curso');
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourseForGrade = useCallback(async (courseData: CreateCourseRequest) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    setMessage('');
    
    try {
      const response = await createCourse(courseData);
      setSuccess(true);
      setMessage(response.message);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al crear el curso');
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    course,
    loading,
    error,
    success,
    message,
    fetchCourse,
    createCourseForGrade
  };
};
