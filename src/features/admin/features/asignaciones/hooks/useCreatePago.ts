import { useState } from 'react';
import { pagosService } from '../services/pagosService';
import type { CreatePagoData, PagoResponse } from '../services/pagosService';

export interface UseCreatePagoResult {
    createPago: (pagoData: CreatePagoData) => Promise<PagoResponse>;
    loading: boolean;
    error: string | null;
    success: boolean;
    resetState: () => void;
}

export const useCreatePago = (): UseCreatePagoResult => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const createPago = async (pagoData: CreatePagoData): Promise<PagoResponse> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await pagosService.createPago(pagoData);
            setSuccess(true);
            return response;
        } catch (err: any) {
            console.error('Error al crear pago:', err);

            // Intentar obtener un mensaje de error específico de la API
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                'Error al crear el pago';

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
    };

    return { createPago, loading, error, success, resetState };
};
