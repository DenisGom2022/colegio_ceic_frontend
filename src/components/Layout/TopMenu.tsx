import React, { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './TopMenu.module.css';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { 
    FaHome, FaUsers, FaBook, FaCalendarAlt, 
    FaCog, FaClipboardList, FaChalkboardTeacher, 
    FaChartBar, FaBell, FaSignOutAlt, FaUserShield,
    FaGraduationCap, FaBars
} from 'react-icons/fa';
import { ROLES } from '../../enums/enums';

// Menu item structure
type MenuItem = {
    label: string;
    path: string;
    icon: ReactElement;
    submenu?: MenuItem[];
    sectionTitle?: string;
};

const TopMenu: React.FC = () => {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminModeActive, setAdminModeActive] = useState(false);
    const { logout, user } = useAuth();
    const location = useLocation();
    
    // Check if user is admin
    const isAdmin = user?.tipoUsuario?.id === ROLES.SUPERUSUARIO || user?.tipoUsuario?.id === ROLES.ADMIN;
    
    // Check if we're in admin section based on URL
    useEffect(() => {
        setAdminModeActive(location.pathname.includes('/admin/'));
        // Close mobile menu when route changes
        setMobileMenuOpen(false);
    }, [location.pathname]);
    
    // Toggle submenu expand/collapse
    const toggleSubmenu = (label: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
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
            label: "Cursos",
            path: "/cursos",
            icon: <FaBook className={styles.menuIcon} />,
            submenu: [
                {
                    label: "Lista de Cursos",
                    path: "/cursos",
                    icon: <FaBook className={styles.menuIcon} />
                },
                {
                    label: "Agregar Curso",
                    path: "/cursos/crear",
                    icon: <FaBook className={styles.menuIcon} />
                }
            ]
        },
        {
            label: "Calendario",
            path: "/calendario",
            icon: <FaCalendarAlt className={styles.menuIcon} />
        },
        {
            label: "Tareas",
            path: "/tareas",
            icon: <FaClipboardList className={styles.menuIcon} />
        },
        {
            label: "Profesores",
            path: "/profesores",
            icon: <FaChalkboardTeacher className={styles.menuIcon} />
        },
        {
            label: "Reportes",
            path: "/reportes",
            icon: <FaChartBar className={styles.menuIcon} />
        },
        {
            label: "Notificaciones",
            path: "/notificaciones",
            icon: <FaBell className={styles.menuIcon} />
        },
        {
            label: "Configuración",
            path: "/configuracion",
            icon: <FaCog className={styles.menuIcon} />
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
            icon: <FaUsers className={styles.menuIcon} />,
            submenu: [
                {
                    label: "Lista de Usuarios",
                    path: "/admin/usuarios",
                    icon: <FaUsers className={styles.menuIcon} />
                },
                {
                    label: "Crear Usuario",
                    path: "/admin/crear-usuario",
                    icon: <FaUsers className={styles.menuIcon} />
                }
            ]
        },
        {
            label: "Catedráticos",
            path: "/admin/catedraticos",
            icon: <FaChalkboardTeacher className={styles.menuIcon} />,
            submenu: [
                {
                    label: "Lista de Catedráticos",
                    path: "/admin/catedraticos",
                    icon: <FaChalkboardTeacher className={styles.menuIcon} />
                }
            ]
        },
        {
            label: "Alumnos",
            path: "/admin/alumnos",
            icon: <FaGraduationCap className={styles.menuIcon} />,
            submenu: [
                {
                    label: "Lista de Alumnos",
                    path: "/admin/alumnos",
                    icon: <FaGraduationCap className={styles.menuIcon} />
                }
            ]
        },
        {
            label: "Ciclos",
            path: "/admin/ciclos",
            icon: <FaCalendarAlt className={styles.menuIcon} />,
            submenu: [
                {
                    label: "Lista de Ciclos",
                    path: "/admin/ciclos",
                    icon: <FaCalendarAlt className={styles.menuIcon} />
                }
            ]
        }
    ];
    
    // Detect hover for desktop submenus
    const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
    
    // Use hover for desktop and click for mobile
    const handleMenuItemMouseEnter = (label: string) => {
        if (window.innerWidth > 768) {
            setHoveredMenuItem(label);
        }
    };
    
    const handleMenuItemMouseLeave = () => {
        if (window.innerWidth > 768) {
            setHoveredMenuItem(null);
        }
    };
    
    // Render a menu item with optional submenu
    const renderMenuItem = (item: MenuItem) => {
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isExpanded = expandedItems[item.label];
        const isHovered = hoveredMenuItem === item.label;
        const showSubmenu = window.innerWidth > 768 ? isHovered : isExpanded;
        
        return (
            <li 
                key={item.label} 
                className={styles.menuItem}
                onMouseEnter={() => handleMenuItemMouseEnter(item.label)}
                onMouseLeave={handleMenuItemMouseLeave}
            >
                {hasSubmenu ? (
                    <>
                        <div 
                            className={styles.menuLink} 
                            onClick={() => toggleSubmenu(item.label)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            <span className={`${styles.menuArrow} ${isExpanded ? styles.expanded : ''}`}>
                                ▼
                            </span>
                        </div>
                        {showSubmenu && (
                            <ul className={styles.submenu}>
                                {item.submenu!.map(subitem => (
                                    <li key={subitem.label} className={styles.submenuItem}>
                                        <NavLink 
                                            to={subitem.path}
                                            className={({ isActive }) => 
                                                `${styles.submenuLink} ${isActive ? styles.active : ''}`
                                            }
                                        >
                                            {subitem.icon}
                                            <span>{subitem.label}</span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                ) : (
                    <NavLink 
                        to={item.path}
                        className={({ isActive }) => 
                            `${styles.menuLink} ${isActive ? styles.active : ''}`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                )}
            </li>
        );
    };

    return (
        <>
            <div className={`${styles.topMenu} ${adminModeActive ? styles.adminMode : ''}`}>
                <div className={styles.logoContainer}>
                    <div className={styles.logo}>CEIC</div>
                    <div className={styles.schoolName}>Colegio CEIC</div>
                </div>
                
                {/* Mobile Menu Toggle Button */}
                <button 
                    className={styles.mobileMenuToggle}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    <FaBars />
                </button>

                <nav className={`${styles.navigation} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
                    {!adminModeActive ? (
                        /* Normal mode - show regular menu items */
                        <>
                            <ul className={styles.menuList}>
                                {menuItems.map(item => renderMenuItem(item))}
                            </ul>
                            
                            {isAdmin && (
                                <div className={styles.adminSection}>
                                    <NavLink 
                                        to="/admin/dashboard"
                                        className={({ isActive }) => 
                                            `${styles.adminLink} ${isActive ? styles.active : ''}`
                                        }
                                    >
                                        <FaUserShield className={styles.adminIcon} />
                                        <span>Panel de Administración</span>
                                    </NavLink>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Admin mode - show only admin menu items */
                        <>
                            <div className={styles.adminModeHeader}>
                                <span className={styles.adminModeTitle}>Panel de Administración</span>
                                <NavLink 
                                    to="/dashboard"
                                    className={styles.backToMainLink}
                                    onClick={() => setAdminModeActive(false)}
                                >
                                    <FaHome className={styles.menuIcon} />
                                    <span>Volver al Dashboard</span>
                                </NavLink>
                            </div>
                            
                            <ul className={styles.menuList}>
                                {adminMenuItems.map(item => renderMenuItem(item))}
                            </ul>
                        </>
                    )}
                </nav>

                <div className={styles.userSection}>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>
                            {user ? `${user.primerNombre} ${user.primerApellido}` : 'Usuario'}
                        </span>
                        <button 
                            className={styles.logoutButton}
                            onClick={logout}
                            title="Cerrar sesión"
                        >
                            <FaSignOutAlt />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TopMenu;
