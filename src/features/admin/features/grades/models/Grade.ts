export interface NivelAcademico {
    id: number;
    descripcion: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface Jornada {
    id: number;
    descripcion: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface Ciclo {
    id: number;
    descripcion: string;
    createdAt: string;
    fechaFin: string | null;
    updatedAt: string;
    deletedAt: string | null;
}

export interface GradoCiclo {
    id: number;
    idGrado: number;
    idCiclo: number;
    precioPago: string;
    cantidadPagos: number;
    precioInscripcion: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    ciclo?: Ciclo;
}

export interface Grade {
    id: number;
    nombre: string;
    idNivel: number;
    idJornada: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    nivelAcademico: NivelAcademico;
    jornada: Jornada;
    gradosCiclo: GradoCiclo[];
}

export interface GradesResponse {
    message: string;
    grados: Grade[];
    total: number;
    page: number;
    totalPages: number;
}
