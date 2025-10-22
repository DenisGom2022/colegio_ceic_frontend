import { useState } from "react";
import { TareasAlumnoService } from "../services/TareasAlumnoService";

interface UseModificaNotaTareaAlumnoResult {
    modificarNota: (id: number, nuevoPunteo: number) => Promise<void>;
    loading: boolean;
    error: string | null;
    message: string | null;
    tareaAlumno: any | null;
}

export function useModificaNotaTareaAlumno(): UseModificaNotaTareaAlumnoResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [tareaAlumno, setTareaAlumno] = useState<any | null>(null);

    const modificarNota = async (id: number, nuevoPunteo: number) => {
        setLoading(true);
        setError(null);
        setMessage(null);
        setTareaAlumno(null);
        try {
            const res = await TareasAlumnoService.updateNota(id, nuevoPunteo);
            setMessage(res.message);
            setTareaAlumno(res.tareaAlumno || null);
        } catch (err: any) {
            setError(err?.message || "Error desconocido al modificar la nota");
        } finally {
            setLoading(false);
        }
    };

    return { modificarNota, loading, error, message, tareaAlumno };
}
