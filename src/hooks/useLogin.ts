import { useState } from "react";
import { useAuth } from "./useAuth";
import { loginService } from "../services/authService";
import { CambiarContrasenaError } from "../Errors/CambiarContrasenaError";
import { RESPUESTA_USER } from "../enums/enums";

interface UseLoginReturn {
    login: (email: string, password: string) => Promise<RESPUESTA_USER>;
    loading: boolean;
    error: string | null;
}

export function useLogin(): UseLoginReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login: setAuthUser } = useAuth();

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginService(username, password);
            setAuthUser(data);
            setLoading(false);
            return RESPUESTA_USER.OK;
        } catch (err: any) {
            if(err instanceof CambiarContrasenaError){
                return RESPUESTA_USER.CAMBIA_PASSWORD;
            }
            setError(err?.response?.data?.message || err.message || "Error de autenticación");
            setLoading(false);
            return RESPUESTA_USER.ERROR;
        }
    };

    return { login, loading, error };
}
