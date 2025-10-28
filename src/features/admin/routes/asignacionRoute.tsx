import { Route } from "react-router-dom";
import { ProtectedRouteAdmin } from "../../../components/ProtectedRouteAdmin";
import { MainLayout } from "../../../components";
import { AsignacionesListPage } from "../features/asignaciones/pages/AsignacionesListPage";
import AsignacionDetailPage from "../features/asignaciones/pages/AsignacionDetailPage";
import CreateAsignacionPage from "../features/asignaciones/pages/CreateAsignacionPage";
import ModificaAsignacionPage from "../features/asignaciones/pages/ModificaAsignacionPage";

export const asignacionesRoutes = (
  <>
    {/* Lista de asignaciones */}
    <Route path="asignaciones" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Gestión de Asignaciones">
          <AsignacionesListPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Crear asignación */}
    <Route path="asignaciones/crear" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Nueva Asignación">
          <CreateAsignacionPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Editar asignación */}
    <Route path="asignaciones/editar/:id" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Modificar Asignación">
          <ModificaAsignacionPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Detalle de asignación */}
    <Route path="asignaciones/:id" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Detalle de Asignación">
          <AsignacionDetailPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
  </>
);