import { Route } from "react-router-dom";
import { ProtectedRouteAdmin } from "../../../components/ProtectedRouteAdmin";
import MainLayout from "../../../components/Layout/MainLayout";
import { CoursesPage } from '../features/courses/pages';

export const courseRoutes = (
  <>
    {/* Lista de cursos */}
    <Route path="cursos" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Gestión de Cursos">
          <CoursesPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
  </>
);
