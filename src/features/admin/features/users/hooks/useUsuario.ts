import { useState, useCallback } from "react";
import { RESPUESTA_USER } from "../../../../../enums/enums";
import { 
  cambiarContrasenaService, 
  crearUsuario, 
  getUsuarioByUsername,
  getUsuarioById as getUserById
} from "../services/userService";
import type { CrearUsuarioInt, Usuario } from "../models";

interface UseUsuarioReturn {
  cambiarContrasena: (username: string, currentPassword: string, newPassword: string, confirmPassword: string) => Promise<RESPUESTA_USER>;
  loading: boolean;
  error: string | null;
  crearNuevoUsuario: (newUsuario: CrearUsuarioInt) => Promise<{
    success: boolean;
    errorMessage?: string;
  }>;
  getUsuario: (username: string) => Promise<Usuario | null>;
  usuario: Usuario | null;
  getUsuarioById: (id: string) => Promise<void>;
}

export function useUsuario(): UseUsuarioReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const cambiarContrasena = async (username: string, currentPassword: string, newPassword: string, confirmPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      await cambiarContrasenaService(username, currentPassword, newPassword, confirmPassword);
      setLoading(false);
      return RESPUESTA_USER.OK;
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Error al Cambiar contrasena");
      setLoading(false);
            return RESPUESTA_USER.ERROR;
        }
    };

    const crearNuevoUsuario = async (newUsuario: CrearUsuarioInt): Promise<{
        success: boolean;
        errorMessage?: string;
    }> => {
        setLoading(true);
        setError(null);
        try {
            await crearUsuario(newUsuario);
            return { success: true };
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err.message || "Error al crear usuario";
            setError(errorMessage);
            return {
                success: false,
                errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    const getUsuario = useCallback(async (username: string): Promise<Usuario | null> => {
        try {
            setLoading(true);
            setError(null); // Limpiar errores anteriores
            const dato = await getUsuarioByUsername(username);
            setUsuario(dato);
            return dato;
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || err.message || "Error al obtener usuario";
            setError(errorMsg);
            setUsuario(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []); // La función permanece estable entre renderizaciones
    
    const getUsuarioById = useCallback(async (id: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUserById(id);
            setUsuario(data);
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || err.message || "Error al obtener usuario por ID";
            console.log(err);
            setError(errorMsg);
            setUsuario(null);
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        crearNuevoUsuario, 
        cambiarContrasena, 
        getUsuario,
        getUsuarioById,
        usuario, 
        loading, 
        error 
    };
}
