import type { Catedratico } from "../../../../../interfaces/interfaces";

export interface Ciclo {
  id: number;
  descripcion: string;
  createdAt: string;
  fechaFin: string | null;
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

export interface Jornada {
  id: number;
  descripcion: string;
  createdAt: string;
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
  nivelAcademico: NivelAcademico;
  jornada: Jornada;
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

export interface EstadoBimestre {
  id: number;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
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
  estado: EstadoBimestre;
}

export interface Course {
  id: number;
  nombre: string;
  notaMaxima: number;
  notaAprobada: number;
  idGradoCiclo: number;
  dpiCatedratico: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  gradoCiclo: GradoCiclo;
  catedratico: Catedratico;
  bimestres?: Bimestre[];
}

export interface CoursesResponse {
  message: string;
  cursos: Course[];
}
