import { useEffect, useState } from "react";
import { getAllUsuarios } from "../services/userService";
import type { Usuario } from "../models/Usuario";

export function useTablaUsuario(page:number, pageSize:number, searchQuery:string) {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [ total, setTotal ] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        cargaDatos();
    }, [page, pageSize, searchQuery]);

    const cargaDatos = async () => {
        try {
            setCargando(true);
            const { usuarios, total, totalPages } = await getAllUsuarios(page, pageSize, searchQuery);
            setUsuarios(usuarios);            
            setTotal(total);
            setTotalPages(totalPages);
        } catch (err:any) {
            setUsuarios([]);
            setError(err?.response?.data?.message || err.message || "Error al obtener usuarios")
        }finally{
            setCargando(false);
        }
    }

    return { usuarios, total, totalPages, cargando, error, recargarDatos: cargaDatos };
}