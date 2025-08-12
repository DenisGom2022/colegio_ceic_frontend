import { ROLES } from "../enums/enums";
import { useAuth } from "../features/auth/hooks/useAuth";
import { Navigate } from "react-router-dom";

export function ProtectedRouteAdmin({ children }: { children: React.ReactNode; role?: string }) {  
    const { isLoading, user, logout } = useAuth();
    if(isLoading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if(!(user?.tipoUsuario?.id == ROLES.SUPERUSUARIO || user?.tipoUsuario?.id == ROLES.ADMIN)){
        logout();
        return <Navigate to="/forbidden" replace />;
    } 
        
    return <>{children}</>;
}
