import { ROLES } from "../enums/enums";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export function ProtectedRouteAdmin({ children }: { children: React.ReactNode; role?: string }) {  
    const { evaluado, usuario, logout } = useAuth();
    if(!evaluado) return null;
    if (!usuario) return <Navigate to="/login" replace />;
    if(!(usuario?.tipoUsuario?.id == ROLES.SUPERUSUARIO || usuario?.tipoUsuario?.id == ROLES.ADMIN)){
        logout();
        return <Navigate to="/forbidden" replace />;
    } 
        
    return <>{children}</>;
}
