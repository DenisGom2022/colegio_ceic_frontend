import { Route } from "react-router-dom";
import { MainLayout } from "../../components";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { CreateTareaPage } from "../tareas/pages/CreateTareaPage";

export const TareasRoutes = (
    <>
        <Route path="crear-tarea" element={
            <ProtectedRoute>
                <MainLayout title="Nueva Tarea">
                    <CreateTareaPage />
                </MainLayout>
            </ProtectedRoute>
        } />
    </>

);