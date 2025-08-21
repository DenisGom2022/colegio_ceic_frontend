import React from 'react';
import styles from './MainLayout.module.css';
import ModernSideMenu from './ModernSideMenu';
import { SideMenuProvider, useSideMenu } from './SideMenuContext';
import './GlobalStyles.module.css';

type MainLayoutProps = {
    children: React.ReactNode;
    title?: string;
};

const MainLayoutContent: React.FC<MainLayoutProps> = ({ children, title }) => {
    const { collapsed, mobileMenuOpen } = useSideMenu();
    
    return (
        <div className={styles.layoutContainer}>
            <ModernSideMenu />
            
            <div 
                className={`${styles.contentWrapper} ${collapsed ? styles.contentWrapperCollapsed : ''} ${mobileMenuOpen ? styles.contentWrapperMobile : ''}`}
            >
                <div className={styles.contentContainer}>
                    {title && (
                        <header className={styles.contentHeader}>
                            <h1 className={styles.contentTitle}>{title}</h1>
                        </header>
                    )}
                    <main className={styles.contentMain}>
                        {children}
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
            </div>
        </div>
    );
};

const MainLayout: React.FC<MainLayoutProps> = (props) => {
    return (
        <SideMenuProvider>
            <MainLayoutContent {...props} />
        </SideMenuProvider>
    );
};

export default MainLayout;
