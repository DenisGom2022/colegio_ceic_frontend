import type { Jornada, NivelAcademico } from './Ciclo';

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
