import { useState } from 'react';
import { deleteAlumno } from '../services/alumnoService';

export const useEliminarAlumno = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const eliminarAlumno = async (cui: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        
        try {
            await deleteAlumno(cui);
            setLoading(false);
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar el alumno';
            setError(errorMessage);
            setLoading(false);
            return false;
        }
    };

    return {
        eliminarAlumno,
        loading,
        error
    };
};
