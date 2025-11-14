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
  idCiclo: number;    // Según el JSON, es idCiclo, no idCurso
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
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
  idBimestre: number;  // Es obligatorio, ya que cada tarea pertenece a un bimestre
  idCurso: number;     // Campo adicional que aparece en el JSON
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  curso?: Curso;       // Agregamos el curso completo
}

export interface TareaAlumno {
  id: number;
  idTarea: number;
  idAsignacionAlumno: number;
  punteoObtenido: string;
  fechaEntrega: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tarea: Tarea;
}

export interface AsignacionAlumno {
  id: number;
  idGradoCiclo: number;
  idAlumno: string;
  idEstadoAsignacion: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  alumno: Alumno;
  tareaAlumnos?: TareaAlumno[];
}

export interface Alumno {
  cui: string;
  primerNombre: string;
  segundoNombre: string;
  tercerNombre: string;
  primerApellido: string;
  segundoApellido: string;
  telefono: string;
  genero: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Servicio {
  id: number;
  descripcion: string;
  valor: string;
  fecha_a_pagar: string;
  id_grado_ciclo: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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
  asignacionesAlumno?: AsignacionAlumno[];
  servicios?: Servicio[];
}

export interface Ciclo {
  id: number;
  descripcion: string;
  createdAt: string;
  fechaFin: string | null;
  updatedAt: string;
  deletedAt: string | null;
  bimestres?: Bimestre[]; // Agregamos la propiedad bimestres
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
