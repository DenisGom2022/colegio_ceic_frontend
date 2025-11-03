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
  tareasAsignadas?: AssignedTask[];
  tareasEntregadas?: SubmittedTask[];
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

export interface AssignedTask {
  id: number;
  titulo: string;
  descripcion: string;
  punteo: number;
  fechaEntrega: string;
  idBimestre: number;
  idCurso: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  curso: {
    id: number;
    nombre: string;
    notaMaxima: number;
    notaAprobada: number;
    idGradoCiclo: number;
    dpiCatedratico: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    catedratico: {
      dpi: string;
      idUsuario: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      usuario: {
        usuario: string;
        primerNombre: string;
        segundoNombre?: string;
        tercerNombre?: string;
        primerApellido: string;
        segundoApellido?: string;
        idTipoUsuario: number;
        telefono: string;
        cambiarContrasena: number;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
      };
    };
  };
}

export interface SubmittedTask {
  id: number;
  idTarea: number;
  idAsignacionAlumno: number;
  punteoObtenido: string;
  fechaEntrega: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tarea: {
    id: number;
    titulo: string;
    descripcion: string;
    punteo: number;
    fechaEntrega: string;
    idBimestre: number;
    idCurso: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}
