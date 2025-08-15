import { useState, useEffect } from 'react';
import { fetchGrados, type GradosResponse } from '../services/gradoService';

interface UseGradeTableParams {
    page: number;
    limit: number;
    searchTerm?: string;
    sortField?: string;
    sortDirection?: string;
}

export const useGradeTable = ({
    page,
    limit,
    searchTerm,
    sortField,
    sortDirection
}: UseGradeTableParams) => {
    const [grades, setGrades] = useState<GradosResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const data = await fetchGrados({ 
                page, 
                limit, 
                searchTerm, 
                sortField, 
                sortDirection 
            });
            setGrades(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar grados');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit, searchTerm, sortField, sortDirection]);

    return {
        grades,
        loading,
        error,
        refetch: fetchData
    };
};
