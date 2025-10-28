import { useState } from "react";
import { asignacionesService } from "../services/asignacionesService";

interface ModificaAsignacionResult {
    loading: boolean;
    error: string | null;
    data: any;
    modificaAsignacion: (id: number, idGrado: number) => Promise<void>;
}

export function useModificaAsignacion(): ModificaAsignacionResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const modificaAsignacion = async (id: number, idGrado: number) => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const response = await asignacionesService.updateAsignacionAlumno(id, idGrado);
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

    return { loading, error, data, modificaAsignacion };
}
