import { useState } from 'react';
import { updateStudent, type StudentUpdateData } from '../services/studentService';
import type { Student } from '../models/Student';

interface UseUpdateStudentResult {
    updateStudent: (cui: string, studentData: StudentUpdateData) => Promise<String>;
    loading: boolean;
    error: string | null;
    success: boolean;
    updatedStudent: Student | null;
}

export const useUpdateStudent = (): UseUpdateStudentResult => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [updatedStudent, setUpdatedStudent] = useState<Student | null>(null);

    const handleUpdateStudent = async (cui: string, studentData: StudentUpdateData) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            setUpdatedStudent(null);

            const result = await updateStudent(cui, studentData);

            setSuccess(true);
            return result;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar el estudiante');
            console.error('Error en useUpdateStudent:', err);
            // Propagar el error para que pueda ser manejado por el componente
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateStudent: handleUpdateStudent,
        loading,
        error,
        success,
        updatedStudent
    };
};
