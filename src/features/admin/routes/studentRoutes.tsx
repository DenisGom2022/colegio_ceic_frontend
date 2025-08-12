import { Route } from "react-router-dom";
import { ProtectedRouteAdmin } from "../../../components/ProtectedRouteAdmin";
import MainLayout from "../../../components/Layout/MainLayout";
import { 
  StudentListPage,
  StudentDetailPage,
  CreateStudentPage,
  EditStudentPage
} from '../features/students/pages';

export const studentRoutes = (
  <>
    {/* Lista de estudiantes */}
    <Route path="estudiantes" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Gestión de Estudiantes">
          <StudentListPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Crear estudiante */}
    <Route path="estudiantes/crear" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Crear Estudiante">
          <CreateStudentPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Detalle de estudiante */}
    <Route path="estudiantes/:cui" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Detalle de Estudiante">
          <StudentDetailPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Editar estudiante */}
    <Route path="estudiantes/editar/:cui" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Editar Estudiante">
          <EditStudentPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
  </>
);
