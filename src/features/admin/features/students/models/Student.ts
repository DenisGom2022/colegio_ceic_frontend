export interface Student {
  cui: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono: string;
  genero: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  responsables: StudentGuardian[];
  asignaciones?: StudentAssignment[];
}

export interface StudentGuardian {
  idResponsable: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono: string;
  idParentesco: number;
  cuiAlumno: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  parentesco?: {
    id: number;
    descripcion: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export interface StudentAssignment {
  id: number;
  idGradoCiclo: number;
  idAlumno: string;
  idEstadoAsignacion: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  estadoAsignacion: {
    id: number;
    descripcion: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  gradoCiclo: {
    id: number;
    idGrado: number;
    idCiclo: number;
    precioPago: string;
    cantidadPagos: number;
    precioInscripcion: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    ciclo: {
      id: number;
      descripcion: string;
      createdAt: string;
      fechaFin: string | null;
      updatedAt: string;
      deletedAt: string | null;
    };
    grado: {
      id: number;
      nombre: string;
      idNivel: number;
      idJornada: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      jornada: {
        id: number;
        descripcion: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
      };
      nivelAcademico: {
        id: number;
        descripcion: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
      };
    };
  };
}
