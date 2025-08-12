import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Usuario } from "../../../models/Usuario";
import { datosTokenService } from "../../../services/authService";

interface AuthContextType {
    user: Usuario | null;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Validar token al cargar la app
    useEffect(() => {
        const token = localStorage.getItem("ceic_token");
        
        if (!token) {
            setIsLoading(false);
            return;
        }
        
        fetchUserData(token);
    }, []);

    const login = async (token: string) => {
        try {
            localStorage.setItem("ceic_token", token);
            await fetchUserData(token);
        } catch {
            setUser(null);
            localStorage.removeItem("ceic_token");
        }
    };

    const fetchUserData = async (token: string) => {
        try {
            const data = await datosTokenService(token);
            setUser(data);            
        } catch (error) {
            console.error("Error al obtener datos del token:", error);
            setUser(null);
            localStorage.removeItem("ceic_token");
        } finally {
            setIsLoading(false);
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("ceic_token");
        window.location.href = '/login'; // Redirigir a la página de login
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
}
