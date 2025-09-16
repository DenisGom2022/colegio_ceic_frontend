// Definimos las interfaces necesarias en un solo archivo para evitar importaciones circulares

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
  idCiclo: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  estado: EstadoBimestre;
}

export interface Ciclo {
  id: number;
  descripcion: string;
  createdAt: string;
  fechaFin: string | null;
  cantidadBimestres: number;
  updatedAt: string;
  deletedAt: string | null;
  gradosCiclo: GradoCiclo[];
  bimestres?: Bimestre[];
}

export interface CicloCreateData {
  id?: string;
  descripcion: string;
  cantidadBimestres: number;
  fechaFin?: string | null;
}

export interface CicloUpdateData {
  id: number;
  descripcion: string;
  fechaFin?: string | null;
}

export interface CicloResponse {
  message: string;
  ciclos: Ciclo[];
}

export interface CicloDetalleResponse {
  message: string;
  ciclo: Ciclo;
}
