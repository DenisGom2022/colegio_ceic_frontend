import { Outlet } from "react-router-dom";
import SideMenu from "../components/Layout/SideMenu";
import { ProtectedRoute } from "../components/ProtectedRoute";

const MainLayout = () => {
    return (
        <ProtectedRoute>
            <div style={{ minHeight: "100vh", display: "flex" }}>
                <SideMenu />
                <main style={{ flex: 1, padding: 20, minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
                    <Outlet />
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default MainLayout;
