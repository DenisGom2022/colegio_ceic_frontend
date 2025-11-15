import axios from "axios";
import { environments } from "../../../../../utils/environments";

// Configuración para incluir automáticamente el token en las peticiones
const getAuthHeaders = () => {
    const token = localStorage.getItem('ceic_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export interface CreatePagoData {
    idAsignacionCurso: number;
    tipoPagoId: number; // 1 = Inscripción, 2 = Mensualidad
    numeroPago: number;
    valor: number;
    mora: number;
    fechaPago: string; // formato ISO: "YYYY-MM-DD"
}

export interface PagoResponse {
    message: string;
    pago?: {
        id: number;
        asignacionCursoId: number;
        tipoPagoId: number;
        numeroPago: number;
        valor: number;
        mora: number;
        fechaPago: string;
    };
}

export interface CreatePagoServicioData {
    id_servicio: number;
    id_asignacion_alumno: number;
    valor: string;
    fecha_pagado: string; // formato ISO: "YYYY-MM-DD"
}

export interface PagoServicioResponse {
    message: string;
    pagoServicio?: {
        id: number;
        idServicio: number;
        idAsignacionAlumno: number;
        valor: string;
        fechaPagado: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    };
}

export const pagosService = {
    /**
     * Crea un nuevo pago para una asignación
     * @param pagoData Datos del pago a crear
     * @returns Respuesta con el pago creado o mensaje de error
     */
    createPago: async (pagoData: CreatePagoData): Promise<PagoResponse> => {
        const response = await axios.post(
            `${environments.VITE_API_URL}/pago`,
            pagoData,
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    /**
     * Crea un nuevo pago de servicio para una asignación
     * @param pagoServicioData Datos del pago de servicio a crear
     * @returns Respuesta con el pago de servicio creado o mensaje de error
     */
    createPagoServicio: async (pagoServicioData: CreatePagoServicioData): Promise<PagoServicioResponse> => {
        const response = await axios.post(
            `${environments.VITE_API_URL}/pago-servicio`,
            pagoServicioData,
            { headers: getAuthHeaders() }
        );
        return response.data;
    }
};
