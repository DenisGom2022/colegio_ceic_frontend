import { useState } from "react";
import { asignacionesService } from "../services/asignacionesService";

interface CreateAsignacionResult {
    loading: boolean;
    error: string | null;
    data: any;
    createAsignacion: (cuiAlumno: string, idGrado: number) => Promise<void>;
}

export function useCreateAsignacion(): CreateAsignacionResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const createAsignacion = async (cuiAlumno: string, idGrado: number) => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const response = await asignacionesService.createAsignacionAlumno(cuiAlumno, idGrado);
            setData(response);
        } catch (err: any) {
            if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err?.message) {
                setError(err.message);
            } else {
                setError("Error desconocido");
            }
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, data, createAsignacion };
}
