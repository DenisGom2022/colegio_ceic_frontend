import { useState, useEffect } from 'react';
import { getAlumnos } from '../services/alumnoService';

export interface Responsable {
    id: number;
    idResponsable: string;
    primerNombre: string;
    segundoNombre: string;
    tercerNombre: string;
    primerApellido: string;
    segundoApellido: string;
    telefono: string;
    idParentesco: number;
    cuiAlumno: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    parentesco: {
        id: number;
        descripcion: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    };
}

export interface Alumno {
    cui: string;
    primerNombre: string;
    segundoNombre: string;
    tercerNombre: string;
    primerApellido: string;
    segundoApellido: string;
    telefono: string;
    genero: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    responsables: Responsable[];
}

export const useTablaAlumno = (
    page: number = 1, 
    pageSize: number = 10, 
    searchQuery: string = "", 
    sortField: string = "primerNombre", 
    sortDirection: string = "asc"
) => {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchAlumnos = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Llamar al servicio para obtener los alumnos con ordenamiento
            const data = await getAlumnos(page, pageSize, searchQuery, sortField, sortDirection);
            
            // Actualizar el estado con los datos recibidos
            setAlumnos(data.alumnos);
            setTotal(data.total || data.alumnos.length);
            setTotalPages(data.totalPages || Math.ceil(data.alumnos.length / pageSize));
            
        } catch (err: any) {
            console.error('Error al obtener alumnos:', err);
            setError(err?.response?.data?.message || err.message || 'Error al obtener los alumnos');
            setAlumnos([]);
        } finally {
            setLoading(false);
        }
    };

    // Cargar los alumnos cuando cambian los parámetros de búsqueda, paginación o ordenamiento
    useEffect(() => {
        fetchAlumnos();
    }, [page, pageSize, searchQuery, sortField, sortDirection]);

    return {
        alumnos,
        loading,
        error,
        total,
        totalPages,
        recargarDatos: fetchAlumnos
    };
};
