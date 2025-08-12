export interface Usuario {
    usuario: string;
    primerNombre: string;
    segundoNombre: string;
    tercerNombre: string;
    primerApellido: string;
    segundoApellido: string;
    idTipoUsuario: number;
    telefono: string;
    cambiarContrasena: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    tipoUsuario: {
        id: number;
        descripcion: string;
        createdAt: string;
    };
}
