import { AuthProvider } from "./hooks/useAuth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/Dashboard";
import "./App.css";
import CambiaContrasena from "./pages/cambiaContrasena/CambiaContrasena";
import ReiniciarContrasena from "./pages/cambiaContrasena/ReiniciarContrasena";
import Forbidden from "./pages/Forbidden";
import CrearUsuarioNew from "./pages/usuarios/CrearUsuarioNew";
import UsuariosNew from "./pages/usuarios/UsuariosNew";
import DetalleUsuario from "./pages/usuarios/DetalleUsuario";
import EditarUsuarioNew from "./pages/usuarios/EditarUsuarioNew";
import Catedraticos from "./pages/admin/Catedraticos";
import CrearCatedratico from "./pages/admin/CrearCatedratico";
import EditarCatedratico from "./pages/admin/EditarCatedratico";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProtectedRouteAdmin } from "./components/ProtectedRouteAdmin";
import MainLayout from "./components/Layout/MainLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { DetalleCatedratico } from "./pages/admin";
import DetalleAlumno from "./pages/admin/DetalleAlumno";
import Alumnos from "./pages/admin/Alumnos";
import CrearAlumno from "./pages/admin/CrearAlumno";
import EditarAlumno from "./pages/admin/EditarAlumno";
import Ciclos from "./pages/admin/Ciclos";
import DetalleCiclo from "./pages/admin/DetalleCiclo";
import CrearCiclo from "./pages/admin/CrearCiclo";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cambiaContrasena" element={<CambiaContrasena />} />
          <Route path="/forbidden" element={<Forbidden />} />
          
          {/* Todas las rutas protegidas con un único layout */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={
            <ProtectedRoute>
              <MainLayout title="Dashboard">
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="cursos" element={
            <ProtectedRoute>
              <MainLayout title="Cursos">
                <div>Página de cursos (en desarrollo)</div>
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="tareas" element={
            <ProtectedRoute>
              <MainLayout title="Tareas">
                <div>Página de tareas (en desarrollo)</div>
              </MainLayout>
            </ProtectedRoute>
          } />
            
          {/* Rutas de administración */}
          <Route path="admin">
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={
              <ProtectedRouteAdmin>
                <MainLayout title="Panel de Administración">
                  <AdminDashboard />
                </MainLayout>
              </ProtectedRouteAdmin>
            } />
              <Route path="usuarios" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Gestión de Usuarios">
                    <UsuariosNew />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="crear-usuario" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Gestión de Usuarios">
                    <CrearUsuarioNew />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="usuario/:id" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Gestión de Usuarios">
                    <DetalleUsuario />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="reiniciar-contrasena/:usuario" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Reiniciar Contraseña">
                    <ReiniciarContrasena />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="editar-usuario/:usuario" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Gestión de Usuarios">
                    <EditarUsuarioNew />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="catedraticos" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Gestión de Catedráticos">
                    <Catedraticos />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="crear-catedratico" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Gestión de Catedráticos">
                    <CrearCatedratico />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="catedratico/:id" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Detalle de Catedrático">
                    <DetalleCatedratico />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="editar-catedratico/:id" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Editar Catedrático">
                    <EditarCatedratico />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="alumnos" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Gestión de Alumnos">
                    <Alumnos />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="alumno/:cui" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Detalle de Alumno">
                    <DetalleAlumno />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="crear-alumno" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Crear Alumno">
                    <CrearAlumno />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="editar-alumno/:cui" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Editar Alumno">
                    <EditarAlumno />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="ciclos" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Gestión de Ciclos Escolares">
                    <Ciclos />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="ciclo/:id" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Detalle de Ciclo Escolar">
                    <DetalleCiclo />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
              <Route path="crear-ciclo" element={
                <ProtectedRouteAdmin>
                  <MainLayout title="Crear Ciclo Escolar">
                    <CrearCiclo />
                  </MainLayout>
                </ProtectedRouteAdmin>
              } />
            </Route>
          
          {/* Cualquier otra ruta no definida */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
