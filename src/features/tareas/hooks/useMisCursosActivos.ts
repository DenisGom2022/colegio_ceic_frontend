import { useEffect, useState } from "react";
import { tareaSevice } from "../services/tareaService";
import type { Curso } from "../../../interfaces/interfaces";

export const useMisCursosActivos = () => {

    const [misCursosActivos, setMisCursosActivos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        getAllMisCursosActivos();
    }, []);

    
    const getAllMisCursosActivos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tareaSevice.getAllMisCursosActivos();
            setMisCursosActivos(data);
        } catch (error:any) {
            const errorMessage = error?.response?.data?.message || error.message || "Error al obtener cursos";
            setError(errorMessage);
        }finally{
            setLoading(false);
        }
    }

    return {
        misCursosActivos,
        loading,
        error
    };
};