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
