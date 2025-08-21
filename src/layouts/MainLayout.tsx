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
                <footer className={styles.footer}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerSection}>
                            <p className={styles.footerText}>
                                © 2025 CEIC - Centro Educativo Integral Cristiano. Todos los derechos reservados.
                            </p>
                        </div>
                        <div className={styles.footerSection}>
                            <p className={styles.footerVersion}>
                                Versión 1.0.0
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </ProtectedRoute>
    );
};

export default MainLayout;
