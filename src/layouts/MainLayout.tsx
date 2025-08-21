import { Outlet } from "react-router-dom";
import TopMenu from "../components/Layout/TopMenu";
import { ProtectedRoute } from "../components/ProtectedRoute";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
    return (
        <ProtectedRoute>
            <div className={styles.layoutContainer}>
                <TopMenu />
                <main className={styles.mainContent}>
                    <Outlet />
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default MainLayout;
