import { Route } from "react-router-dom";
import { ProtectedRouteAdmin } from "../../../components/ProtectedRouteAdmin";
import MainLayout from "../../../components/Layout/MainLayout";
import GradesPage from '../features/grades/pages/GradesPage';
import { 
  CreateGradePage, 
  GradeDetailPage, 
  EditGradePage
} from '../features/grades/pages';

export const gradeRoutes = (
  <>
    {/* Lista de grados */}
    <Route path="grados" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Gestión de Grados">
          <GradesPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Crear grado */}
    <Route path="crear-grado" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Crear Grado">
          <CreateGradePage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Detalle de grado */}
    <Route path="grado/:id" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Detalle de Grado">
          <GradeDetailPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Editar grado */}
    <Route path="editar-grado/:id" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Editar Grado">
          <EditGradePage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
  </>
);
