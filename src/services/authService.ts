import axios from "axios";
import type { Usuario } from "../models/Usuario";
import { CambiarContrasenaError } from "../Errors/CambiarContrasenaError";
import { environments } from "../utils/environments";

const API_URL = environments.VITE_API_URL;

export async function loginService(username: string, password: string): Promise<string> {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    // Ajusta la estructura de la respuesta según tu API
    if(res.data.cambiarContrasena){
        throw new CambiarContrasenaError(res.data.message);
    }
    return res.data.token;

}

export async function datosTokenService(token: string): Promise<Usuario | null> {
    try{
        const res = await axios.get(`${API_URL}/login/datosToken`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data.user as Usuario;
    } catch(err){
        return null;
    }
}
