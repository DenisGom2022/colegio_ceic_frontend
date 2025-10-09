import { Route } from "react-router-dom";
import { ProtectedRouteAdmin } from "../../../components/ProtectedRouteAdmin";
import { MainLayout } from "../../../components";
import { AsignacionesListPage } from "../features/asignaciones/pages/AsignacionesListPage";

export const asignacionesRoutes = (
  <>
    {/* Lista de cursos */}
    <Route path="asignaciones" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Gestión de Cursos">
          <AsignacionesListPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
  </>
);