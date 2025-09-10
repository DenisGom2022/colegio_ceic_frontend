import { Route } from "react-router-dom";
import { MainLayout } from "../../components";
import MisCursosPage from "../MisCursos/pages/MisCursosPage";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import MisCursosDetailPage from "../MisCursos/pages/MisCursosDetailPage";


export const MisCursosRoutes = (
    <>
        <Route path="mis-cursos" element={
            <ProtectedRoute>
                <MainLayout title="Mis Cursos">
                    <MisCursosPage />
                </MainLayout>
            </ProtectedRoute>
        } />

        <Route path="mis-cursos/:id" element={
            <ProtectedRoute>
                <MainLayout title="Mis Cursos">
                    <MisCursosDetailPage />
                </MainLayout>
            </ProtectedRoute>
        } />
    </>

);