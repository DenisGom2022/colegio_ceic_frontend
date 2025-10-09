import { Route } from "react-router-dom";
import { ProtectedRouteAdmin } from "../../../components/ProtectedRouteAdmin";
import { MainLayout } from "../../../components";
import { AsignacionesListPage } from "../features/asignaciones/pages/AsignacionesListPage";
import AsignacionDetailPage from "../features/asignaciones/pages/AsignacionDetailPage";

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