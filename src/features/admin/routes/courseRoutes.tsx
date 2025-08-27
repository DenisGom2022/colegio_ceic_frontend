import { Route } from "react-router-dom";
import { ProtectedRouteAdmin } from "../../../components/ProtectedRouteAdmin";
import MainLayout from "../../../components/Layout/MainLayout";
import { CoursesPage, CourseDetailPage, CreateCoursePage } from '../features/courses/pages';

import EditCoursePage from '../features/courses/pages/EditCoursePage';

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
    
    {/* Crear curso */}
    <Route path="crear-curso" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Crear Curso">
          <CreateCoursePage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Detalle de curso */}
    <Route path="cursos/:id" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Detalle de Curso">
          <CourseDetailPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />

    {/* Editar curso */}
    <Route path="editar-curso/:id" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Editar Curso">
          <EditCoursePage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
  </>
);
