export interface Curso {
  id: number;
  nombre: string;
  notaMaxima: number;
  notaAprobada: number;
  idGradoCiclo: number;
  dpiCatedratico: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  catedratico: Catedratico;
  gradoCiclo?: GradoCiclo;
  tareas?: Tarea[];
  bimestres?: Bimestre[];
}

export interface Bimestre {
  id: number;
  numeroBimestre: number;
  idEstado: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  idCurso: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tareas: Tarea[];
  estado: EstadoBimestre;
}

export interface EstadoBimestre {
  id: number;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  punteo: number;
  idBimestre?: number;  // Changed from idCurso
  createdAt: string;
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
  ciclo: Ciclo;
  grado: Grado;
}

export interface Ciclo {
  id: number;
  descripcion: string;
  createdAt: string;
  fechaFin: string | null;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Grado {
  id: number;
  nombre: string;
  idNivel: number;
  idJornada: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  jornada?: Jornada;
  nivelAcademico?: NivelAcademico;
}

export interface Jornada {
  id: number;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface NivelAcademico {
  id: number;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Catedratico {
  dpi: string;
  idUsuario: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  usuario: Usuario;
}

export interface TipoUsuario {
  id: number;
  descripcion: string;
  createdAt: string;
}

export interface Usuario {
  usuario: string;
  contrasena: string;
  primerNombre: string;
  segundoNombre: string;
  tercerNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  idTipoUsuario: number;
  telefono: string;
  cambiarContrasena: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tipoUsuario: TipoUsuario;
}
