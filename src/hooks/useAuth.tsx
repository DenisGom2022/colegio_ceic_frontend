import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Usuario } from "../models/Usuario";
import { datosTokenService } from "../services/authService";

interface AuthContextType {
    evaluado: boolean;
    usuario: Usuario | null;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [evaluado, setEvaluado] = useState(false);

    // Validar token al cargar la app
    useEffect(() => {
        const token = localStorage.getItem("ceic_token");
        
        if (!token) {
            setEvaluado(true);
            return;
        }
        
        obtieneDatosToken(token);
    }, []);

    const login = async (token: string) => {
        try {
            localStorage.setItem("ceic_token", token);
            await obtieneDatosToken(token);
        } catch {
            setUsuario(null);
            localStorage.removeItem("ceic_token");
        }
    };

    const obtieneDatosToken = async (token:any) => {
        try {
            const data = await datosTokenService(token);
            setUsuario(data);            
        } catch (error) {
            console.error("Error al obtener datos del token:", error);
            setUsuario(null);
            localStorage.removeItem("ceic_token");
        } finally {
            setEvaluado(true);
        }
    }

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem("ceic_token");
        window.location.href = '/login'; // Redirigir a la página de login
    };

    return (
        <AuthContext.Provider value={{ evaluado, usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
}
