import { useEffect, useState } from "react";
import { getAllTiposUsuario } from "../services/userService";
import type { TipoUsuario } from "../models";

export function useTiposUsuario() {
    const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const datos = await getAllTiposUsuario();
            setTiposUsuario(datos);
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || "Error al obtener tipos de usuario");
        } finally {
            setLoading(false);
        }
    };

    return { tiposUsuario, error, loading };
}
