import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROLES } from "../enums/enums";

interface ProtectedRouteAdminProps {
  children: React.ReactNode;
}

export const ProtectedRouteAdmin = ({ children }: ProtectedRouteAdminProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Verificar si el usuario es administrador
  if (user.tipoUsuario.id !== ROLES.ADMIN) {
    return <Navigate to="/forbidden" />;
  }

  return children;
};
