import { Route, Navigate } from "react-router-dom";
import { ProtectedRouteAdmin } from "../components/ProtectedRouteAdmin";
import MainLayout from "../components/Layout/MainLayout";

// Admin Dashboard
import AdminDashboard from "../features/admin/features/dashboard/pages/AdminDashboard";

// Feature Routes
import { userRoutes, teacherRoutes, studentRoutes, cycleRoutes, gradeRoutes } from "../features/admin/routes";

export const adminRoutes = (
  <>
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="dashboard" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Panel de Administración">
          <AdminDashboard />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Rutas de usuarios - importadas desde el módulo de usuarios */}
    {userRoutes}
    
    {/* Catedráticos - Rutas importadas del módulo de catedráticos */}
    {teacherRoutes}
    
    {/* Estudiantes - Rutas importadas del módulo de estudiantes */}
    {studentRoutes}
    
    {/* Grados - Rutas importadas del módulo de grados */}
    {gradeRoutes}
    
    {/* Ciclos - Rutas importadas del módulo de ciclos */}
    {cycleRoutes.map(route => {
      const Element = route.element;
      let title;
      
      // Determinar el título según la ruta
      if (route.path === 'ciclos') {
        title = "Gestión de Ciclos Escolares";
      } else if (route.path === 'ciclo/:id') {
        title = "Detalle de Ciclo Escolar";
      } else if (route.path === 'crear-ciclo') {
        title = "Crear Ciclo Escolar";
      } else if (route.path === 'editar-ciclo/:id') {
        title = "Editar Ciclo Escolar";
      } else {
        title = "Ciclos Escolares";
      }
      
      return (
        <Route 
          key={route.path} 
          path={route.path} 
          element={
            <ProtectedRouteAdmin>
              <MainLayout title={title}>
                {Element}
              </MainLayout>
            </ProtectedRouteAdmin>
          } 
        />
      );
    })}
  </>
);
