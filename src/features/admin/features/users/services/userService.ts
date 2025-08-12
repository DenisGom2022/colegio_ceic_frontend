import axios from "axios";
import { environments } from "../../../../../utils/environments";
import type { Usuario, TipoUsuario, CrearUsuarioInt } from "../models";

const API_URL = environments.VITE_API_URL;

export async function cambiarContrasenaService(username: string, currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    const res = await axios.patch(`${API_URL}/usuarios/cambiarContrasena`, { 
        usuario: username, 
        contrasenaActual: currentPassword,
        contrasenaNueva: newPassword,
        contrasenaNueva2: confirmPassword 
    });
    return res.data.token;
}

interface ResponseGetAllUsuarios {
    message: string;
    usuarios: Usuario[];
    total: number;
    page: number;
    totalPages: number;
}

export interface EditarUsuarioInt {
    usuario: string;
    primerNombre: string;
    segundoNombre?: string;
    tercerNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    telefono: string;
    idTipoUsuario: number;
}

export async function getAllUsuarios(page: number, pageSize: number, searchQuery: string): Promise<ResponseGetAllUsuarios> {
    const token = localStorage.getItem("ceic_token");
    const res = await axios.get(`${API_URL}/usuarios?page=${page}&limit=${pageSize}&search=${searchQuery}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    return res.data;
}

export async function getUsuarioByUsername(username: string): Promise<Usuario> {
    const token = localStorage.getItem("ceic_token");
    const res = await axios.get(`${API_URL}/usuarios/${username}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    return res.data.user;
}

// Nueva función para obtener usuario por ID
export async function getUsuarioById(id: string): Promise<Usuario> {
    const token = localStorage.getItem("ceic_token");
    const res = await axios.get(`${API_URL}/usuarios/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    return res.data.user;
}

export async function getAllTiposUsuario(): Promise<TipoUsuario[]> {
    const token = localStorage.getItem("ceic_token");
    const res = await axios.get(`${API_URL}/usuarios/tiposUsuario`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    return res.data.tiposUsuario;
}

export async function crearUsuario(newUsuario: CrearUsuarioInt): Promise<string> {
    const token = localStorage.getItem("ceic_token");
    const res = await axios.post(`${API_URL}/usuarios`, newUsuario, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    return res.data.message;
}

export async function reiniciarContrasena(usuario: string, newContrasena: string): Promise<string> {
    const token = localStorage.getItem("ceic_token");
    const res = await axios.post(`${API_URL}/usuarios/reiniciarContrasena`,
        { usuario, newContrasena },
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    );
    return res.data.message;
}

export async function editarUsuario(userData: EditarUsuarioInt): Promise<string> {
    const token = localStorage.getItem("ceic_token");
    const res = await axios.put(`${API_URL}/usuarios`, userData, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    return res.data.message;
}

export async function eliminarUsuario(usuario: string): Promise<string> {
    const token = localStorage.getItem("ceic_token");
    if (!token) {
        throw new Error("No se encontró el token de autenticación");
    }
    
    const res = await axios.delete(`${API_URL}/usuarios/${usuario}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });
    return res.data.message;
}
