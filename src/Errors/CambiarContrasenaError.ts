export class CambiarContrasenaError extends Error {
    constructor(message:string){
        super(message);
        this.name = "CambiarContrasenaError";
    }
}