import { useState } from "react";
import { asignacionesService } from "../services/asignacionesService";

interface EliminarAsignacionResult {
    loading: boolean;
    error: string | null;
    data: { message: string } | null;
    eliminarAsignacion: (id: number) => Promise<void>;
}

export function useEliminarAsignacion(): EliminarAsignacionResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<{ message: string } | null>(null);

    const eliminarAsignacion = async (id: number) => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const response = await asignacionesService.deleteAsignacionAlumno(id);
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

    return { loading, error, data, eliminarAsignacion };
}
