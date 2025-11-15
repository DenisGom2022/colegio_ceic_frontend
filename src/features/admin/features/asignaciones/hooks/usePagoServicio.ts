import { useState } from 'react';
import { pagosService } from '../services/pagosService';
import type { CreatePagoServicioData, PagoServicioResponse } from '../services/pagosService';

export const usePagoServicio = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const registrarPagoServicio = async (
        pagoData: CreatePagoServicioData
    ): Promise<PagoServicioResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await pagosService.createPagoServicio(pagoData);
            setLoading(false);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al registrar el pago de servicio';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    return {
        registrarPagoServicio,
        loading,
        error,
        clearError: () => setError(null)
    };
};