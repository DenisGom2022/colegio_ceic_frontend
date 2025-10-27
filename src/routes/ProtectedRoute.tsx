import React from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import Forbidden from "../pages/Forbidden";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }
  
  if (!user) {
    /* return <Navigate to="/login" />; */
    return <Forbidden />;
  }

  return children;
};
