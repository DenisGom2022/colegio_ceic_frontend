import { Route } from "react-router-dom";
import { ProtectedRouteAdmin } from "../../../components/ProtectedRouteAdmin";
import MainLayout from "../../../components/Layout/MainLayout";
import { 
  UsersPage, 
  CreateUserPage, 
  UserDetailPage, 
  EditUserPage,
  ResetPasswordPage
} from "../features/users/pages";

export const userRoutes = (
  <>
    {/* Lista de usuarios */}
    <Route path="usuarios" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Gestión de Usuarios">
          <UsersPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Crear usuario */}
    <Route path="usuarios/crear" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Crear Usuario">
          <CreateUserPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Detalle de usuario */}
    <Route path="usuarios/:id" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Detalle de Usuario">
          <UserDetailPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Editar usuario */}
    <Route path="usuarios/editar/:id" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Editar Usuario">
          <EditUserPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
    
    {/* Reiniciar contraseña */}
    <Route path="usuarios/reiniciar-contrasena/:usuario" element={
      <ProtectedRouteAdmin>
        <MainLayout title="Reiniciar Contraseña">
          <ResetPasswordPage />
        </MainLayout>
      </ProtectedRouteAdmin>
    } />
  </>
);
