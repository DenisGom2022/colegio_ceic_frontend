import { useState, useEffect } from 'react';
import axios from 'axios';
import { environments } from '../utils/environments';

interface Usuario {
    usuario: string;
    primerNombre: string;
    segundoNombre: string | null;
    tercerNombre: string | null;
    primerApellido: string;
    segundoApellido: string | null;
    idTipoUsuario: number;
    telefono: string | null;
    cambiarContrasena: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

interface Catedratico {
    dpi: string;
    idUsuario: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    usuario: Usuario;
}

interface UseCatedraticoReturn {
    catedraticos: Catedratico[];
    loading: boolean;
    error: string | null;
    total: number;
    totalPages: number;
    page: number;
    recargarDatos: () => Promise<void>;
}

// Crear un servicio para los catedráticos similar al userService
const getCatedraticos = async (page: number, pageSize: number, searchQuery: string) => {
    const token = localStorage.getItem("ceic_token");
    let url = `${environments.VITE_API_URL}/catedratico?page=${page}&limit=${pageSize}`;
    if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    const response = await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });

    return response.data;
};

export const useCatedraticos = (
    page: number = 1,
    pageSize: number = 10,
    searchQuery: string = ""
): UseCatedraticoReturn => {
    const [catedraticos, setCatedraticos] = useState<Catedratico[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const cargarDatos = async () => {
        try {
            debugger;
            setLoading(true);
            setError(null);

            const data = await getCatedraticos(page, pageSize, searchQuery);

            setCatedraticos(data.catedraticos || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 0);
        } catch (error: any) {
            console.error('Error fetching catedráticos:', error);
            setError(error?.response?.data?.message || error.message || 'Error al cargar los catedráticos');
            setCatedraticos([]);
            setTotal(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [page, pageSize, searchQuery]);

    return {
        catedraticos,
        loading,
        error,
        total,
        totalPages,
        page,
        recargarDatos: cargarDatos
    };
};
