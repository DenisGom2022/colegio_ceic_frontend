import React, { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './ModernSideMenu.module.css';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useSideMenu } from './SideMenuContext';
import { 
    FaHome, FaUsers, FaBook, FaCalendarAlt, 
    FaCog, FaClipboardList, FaChalkboardTeacher, 
    FaChartBar, FaBell, FaSignOutAlt, FaUserShield,
    FaGraduationCap, FaBars, FaTimes, FaChevronRight,
    FaChevronLeft, FaLayerGroup
} from 'react-icons/fa';
import { ROLES } from '../../enums/enums';

// Menu item structure
type MenuItem = {
    label: string;
    path: string;
    icon: ReactElement;
    sectionTitle?: string;
};

const ModernSideMenu: React.FC = () => {
    const [adminModeActive, setAdminModeActive] = useState(false);
    const { collapsed, setCollapsed, mobileMenuOpen, setMobileMenuOpen } = useSideMenu();
    const { logout, user } = useAuth();
    const location = useLocation();
    
    // Check if user is admin
    const isAdmin = user?.tipoUsuario?.id === ROLES.SUPERUSUARIO || user?.tipoUsuario?.id === ROLES.ADMIN;
    
    // Check if we're in admin section based on URL
    useEffect(() => {
        setAdminModeActive(location.pathname.includes('/admin/'));
    }, [location.pathname]);
    
    // Toggle menu collapse state
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };
    
    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Menu data
    const menuItems: MenuItem[] = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: <FaHome className={styles.menuIcon} />
        },
        {
            label: "Mis Cursos",
            path: "/mis-cursos",
            icon: <FaBook className={styles.menuIcon} />
        },
        {
            label: "Mis Tareas",
            path: "/mis-tareas",
            icon: <FaClipboardList className={styles.menuIcon} />
        }
    ];
    
    const adminMenuItems: MenuItem[] = [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: <FaHome className={styles.menuIcon} />
        },
        {
            label: "Usuarios",
            path: "/admin/usuarios",
            icon: <FaUsers className={styles.menuIcon} />
        },
        {
            label: "Catedráticos",
            path: "/admin/catedraticos",
            icon: <FaChalkboardTeacher className={styles.menuIcon} />
        },
        {
            label: "Alumnos",
            path: "/admin/estudiantes",
            icon: <FaUsers className={styles.menuIcon} />
        },
        {
            label: "Grados",
            path: "/admin/grados",
            icon: <FaLayerGroup className={styles.menuIcon} />
        },
        {
            label: "Cursos",
            path: "/admin/cursos",
            icon: <FaBook className={styles.menuIcon} />
        },
        {
            label: "Ciclos",
            path: "/admin/ciclos",
            icon: <FaCalendarAlt className={styles.menuIcon} />
        },
        {
            label: "Asignaciones Alumno",
            path: "/admin/asignaciones",
            icon: <FaGraduationCap className={styles.menuIcon} />
        }
    ];
    
    // Render a menu item (simplified - no submenu)
    const renderMenuItem = (item: MenuItem) => {
        const isActive = location.pathname === item.path;
        
        return (
            <li key={item.label} className={`${styles.menuItem} ${isActive ? styles.activeItem : ''}`}>
                <NavLink 
                    to={item.path}
                    className={({ isActive }) => 
                        `${styles.menuLink} ${isActive ? styles.active : ''}`
                    }
                >
                    <div className={styles.menuLinkContent}>
                        {item.icon}
                        {!collapsed && <span className={styles.menuLabel}>{item.label}</span>}
                    </div>
                </NavLink>
            </li>
        );
    };
    
    return (
        <>
            {/* Mobile menu toggle button (only visible on small screens) */}
            <button 
                className={styles.mobileMenuToggle}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            
            {/* Botón discreto para expandir el menú (solo visible cuando está colapsado) */}
            {collapsed && (
                <button 
                    className={styles.expandToggle}
                    onClick={toggleCollapse}
                    title="Expandir menú"
                    aria-label="Expandir menú"
                >
                    <FaChevronRight style={{fontSize: '12px'}} />
                </button>
            )}
            
            {/* Backdrop for mobile menu */}
            {mobileMenuOpen && (
                <div className={styles.menuBackdrop} onClick={toggleMobileMenu} />
            )}
        
            <div 
                className={`
                    ${styles.sideMenu} 
                    ${adminModeActive ? styles.adminMode : ''} 
                    ${collapsed ? styles.collapsed : ''} 
                    ${mobileMenuOpen ? styles.mobileOpen : ''}
                `}
            >
                <div className={styles.logoContainer}>
                    <div className={styles.logoWrapper}>
                        <div className={styles.logo}>
                            {collapsed ? "C" : "CEIC"}
                        </div>
                        {!collapsed && <div className={styles.schoolName}>Colegio CEIC</div>}
                    </div>
                    <button 
                        className={styles.collapseToggle}
                        onClick={toggleCollapse}
                        title="Colapsar menú"
                        aria-label="Colapsar menú"
                    >
                        <FaChevronLeft style={{fontSize: '12px'}} />
                    </button>
                </div>
                
                <div className={styles.menuContainer}>
                    <nav className={styles.navigation}>
                    <div className={styles.menuWrapper}>
                        {/* Toggle between normal mode and admin mode */}
                        {!adminModeActive ? (
                            /* Normal mode - show regular menu items */
                            <>
                                <ul className={styles.menuList}>
                                    {menuItems.map(item => renderMenuItem(item))}
                                </ul>
                                
                                {isAdmin && !collapsed && (
                                    <div className={styles.sectionContainer}>
                                        <div className={styles.sectionTitle}>ACCOUNT</div>
                                        <ul className={styles.menuList}>
                                            <li className={styles.menuItem}>
                                                <NavLink 
                                                    to="/admin/dashboard"
                                                    className={({ isActive }) => 
                                                        `${styles.menuLink} ${styles.adminLink} ${isActive ? styles.active : ''}`
                                                    }
                                                >
                                                    <div className={styles.menuLinkContent}>
                                                        <FaUserShield className={styles.menuIcon} />
                                                        <span className={styles.menuLabel}>Panel Admin</span>
                                                    </div>
                                                    <div className={styles.notificationBadge}>
                                                        <span>24</span>
                                                    </div>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Admin mode - show only admin menu items */
                            <>
                                {!collapsed && (
                                    <div className={styles.adminModeHeader}>
                                        <span className={styles.adminModeTitle}>Panel Administrador</span>
                                        <NavLink 
                                            to="/dashboard"
                                            className={styles.backToMainLink}
                                            onClick={() => setAdminModeActive(false)}
                                        >
                                            <FaHome className={styles.menuIcon} />
                                            <span>Volver al Dashboard</span>
                                        </NavLink>
                                    </div>
                                )}
                                
                                <ul className={styles.menuList}>
                                    {adminMenuItems.map(item => renderMenuItem(item))}
                                </ul>
                            </>
                        )}
                    </div>
                </nav>
                </div>
                
                {!collapsed && (
                    <div className={styles.userSection}>
                        <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                                <img src="https://via.placeholder.com/32" alt="User" />
                            </div>
                            <div className={styles.userDetails}>
                                <div className={styles.userName}>
                                    {user ? `${user.primerNombre} ${user.primerApellido}` : 'Usuario'}
                                </div>
                                <div className={styles.userEmail}>
                                    {user?.usuario || 'usuario@ejemplo.com'}
                                </div>
                            </div>
                        </div>
                        <button 
                            className={styles.logoutButton}
                            onClick={logout}
                            title="Cerrar sesión"
                        >
                            <FaSignOutAlt />
                        </button>
                    </div>
                )}
                
                {collapsed && (
                    <div className={styles.userSectionCollapsed}>
                        <div className={styles.userAvatarCollapsed}>
                            <img src="https://via.placeholder.com/24" alt="User" />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ModernSideMenu;
