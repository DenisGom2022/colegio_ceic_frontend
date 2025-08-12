import { Route } from "react-router-dom";
import { ProtectedRouteAdmin } from "../../../components/ProtectedRouteAdmin";
import MainLayout from "../../../components/Layout/MainLayout";
import TeachersPage from '../features/teachers/pages/TeachersPage';
import { 
  CreateTeacherPage, 
  TeacherDetailPage, 
  EditTeacherPage
} from '../features/teachers/pages';

export const teacherRoutes = (
  <>
    {/* Lista de catedráticos */}
    <Route path="catedraticos" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Gestión de Catedráticos">
          <TeachersPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Crear catedrático */}
    <Route path="crear-catedratico" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Crear Catedrático">
          <CreateTeacherPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Detalle de catedrático */}
    <Route path="catedratico/:id" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Detalle de Catedrático">
          <TeacherDetailPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Editar catedrático */}
    <Route path="editar-catedratico/:id" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Editar Catedrático">
          <EditTeacherPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
  </>
);
