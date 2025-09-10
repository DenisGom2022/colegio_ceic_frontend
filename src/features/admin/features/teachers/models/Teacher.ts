import type { Curso } from '../../../../../interfaces/interfaces';
import type { Usuario } from '../../../../../models/Usuario';

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

export interface Grado {
  id: number;
  nombre: string;
  idNivel: number;
  idJornada: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  jornada: Jornada;
  nivelAcademico: NivelAcademico;
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
  ciclo: Ciclo;
  grado: Grado;
}


export interface Teacher {
  dpi: string;
  idUsuario: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  usuario: Usuario;
  cursosActivos?: Curso[];
  cursosFinalizados?: Curso[];
}

export interface TeacherResponse {
  message: string;
  catedraticos: Teacher[];
  total: number;
  totalPages: number;
}

export interface TeacherDetailResponse {
  message: string;
  catedratico: Teacher;
  cursosActivos: Curso[];
  cursosFinalizados: Curso[];
}
