import { useState } from 'react';
import { deleteCatedratico } from '../services/catedraticoService';

export const useEliminarCatedratico = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const eliminarCatedratico = async (dpi: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        
        try {
            await deleteCatedratico(dpi);
            setLoading(false);
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar el catedrático';
            setError(errorMessage);
            setLoading(false);
            return false;
        }
    };

    return {
        eliminarCatedratico,
        loading,
        error
    };
};
