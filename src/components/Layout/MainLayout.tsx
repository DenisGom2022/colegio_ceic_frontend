import React from 'react';
import styles from './MainLayout.module.css';
import SideMenu from './SideMenu';

type MainLayoutProps = {
    children: React.ReactNode;
    title?: string;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
    return (
        <div className={styles.layoutContainer}>
            <div className={styles.sideMenuWrapper}>
                <SideMenu />
            </div>
            <div className={styles.contentWrapper}>
                {title && (
                    <div className={styles.contentHeader}>
                        <h1 className={styles.contentTitle}>{title}</h1>
                    </div>
                )}
                <main className={styles.contentMain}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
