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
