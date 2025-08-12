import type { Usuario } from '../../../../../models/Usuario';

export interface Teacher {
  dpi: string;
  idUsuario: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  usuario: Usuario;
}

export interface TeacherResponse {
  message: string;
  catedraticos: Teacher[];
  total: number;
  totalPages: number;
}
