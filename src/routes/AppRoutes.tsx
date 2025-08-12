import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";

// Routes Config
import { PUBLIC_ROUTES, USER_ROUTES } from "./routeMap";

// Dashboard
import Dashboard from "../features/dashboard/pages/Dashboard";

// Auth Pages
import Login from "../features/auth/pages/Login";
import CambiaContrasena from "../pages/cambiaContrasena/CambiaContrasena";

// Protección de rutas
import { ProtectedRoute } from "./ProtectedRoute";
import Forbidden from "../pages/Forbidden";
import { adminRoutes } from "./adminRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path={PUBLIC_ROUTES.LOGIN} element={<Login />} />
      <Route path={USER_ROUTES.CHANGE_PASSWORD} element={<CambiaContrasena />} />
      <Route path={PUBLIC_ROUTES.FORBIDDEN} element={<Forbidden />} />
      
      {/* Todas las rutas protegidas con un único layout */}
      <Route path="/" element={<Navigate to={USER_ROUTES.DASHBOARD} replace />} />
      <Route path="dashboard" element={
        <ProtectedRoute>
          <MainLayout title="Dashboard">
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="cursos" element={
        <ProtectedRoute>
          <MainLayout title="Cursos">
            <div>Página de cursos (en desarrollo)</div>
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="tareas" element={
        <ProtectedRoute>
          <MainLayout title="Tareas">
            <div>Página de tareas (en desarrollo)</div>
          </MainLayout>
        </ProtectedRoute>
      } />
            
      {/* Rutas de administración */}
      <Route path="admin">
        {adminRoutes}
      </Route>
          
      {/* Cualquier otra ruta no definida */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// End of AppRoutes component
