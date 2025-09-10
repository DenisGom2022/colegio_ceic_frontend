import { useEffect, useState } from "react";
import type { Curso } from "../../../interfaces/interfaces";
import { getMiCurso } from "../services/MisCursosService";

export const useMiCurso = (id:any) => {
    const [curso, setCurso] = useState<Curso|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getMiCursoById(id);
    }, []);

    const getMiCursoById = async (id:any) => {
        try {
            setLoading(true);
            const { curso } = await getMiCurso(id);
            setCurso(curso);
        } catch(error:any){
            setError(error?.response?.data?.message || error.message || "Error al obtener curso");
        }finally {
            setLoading(false);
        }
    }

    return {
        curso,
        error,
        loading
    }
}