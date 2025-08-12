import { useState } from 'react';
import { createStudent, type StudentCreateData } from '../services/studentService';
import type { Student } from '../models/Student';

interface UseCreateStudentResult {
  createStudent: (studentData: StudentCreateData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  createdStudent: Student | null;
}

export const useCreateStudent = (): UseCreateStudentResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [createdStudent, setCreatedStudent] = useState<Student | null>(null);

  const handleCreateStudent = async (studentData: StudentCreateData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setCreatedStudent(null);
      
      const newStudent = await createStudent(studentData);
      
      setCreatedStudent(newStudent);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el estudiante');
      console.error('Error en useCreateStudent:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    createStudent: handleCreateStudent,
    loading,
    error,
    success,
    createdStudent
  };
};
