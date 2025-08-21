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

export interface Catedratico {
  dpi: string;
  idUsuario: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  usuario: Usuario;
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
}

export interface CoursesResponse {
  message: string;
  cursos: Course[];
}
