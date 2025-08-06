import React, { useState } from 'react';
import type { ReactElement } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './SideMenu.module.css';
import { useAuth } from '../../hooks/useAuth';
import { 
    FaHome, FaUsers, FaBook, FaCalendarAlt, 
    FaCog, FaClipboardList, FaChalkboardTeacher, 
    FaChartBar, FaBell, FaSignOutAlt, FaUserShield
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

const SideMenu: React.FC = () => {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [adminModeActive, setAdminModeActive] = useState(false);
    const { logout, usuario } = useAuth();
    const location = useLocation();
    
    // Check if user is admin
    const isAdmin = usuario?.tipoUsuario?.id === ROLES.SUPERUSUARIO || usuario?.tipoUsuario?.id === ROLES.ADMIN;
    
    // Check if we're in admin section based on URL
    React.useEffect(() => {
        setAdminModeActive(location.pathname.includes('/admin/'));
    }, [location.pathname]);
    
    // Toggle submenu expand/collapse
    const toggleSubmenu = (label: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
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
    
    // Render a menu item with optional submenu
    const renderMenuItem = (item: MenuItem) => {
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isExpanded = expandedItems[item.label];
        
        return (
            <li key={item.label} className={styles.menuItem}>
                {hasSubmenu ? (
                    <>
                        <div 
                            className={styles.menuLink} 
                            onClick={() => toggleSubmenu(item.label)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            <span className={`${styles.menuArrow} ${isExpanded ? styles.expanded : ''}`}>
                                ▶
                            </span>
                        </div>
                        {isExpanded && (
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
        <div className={`${styles.sideMenu} ${adminModeActive ? styles.adminMode : ''}`}>
            <div className={styles.logoContainer}>
                <div className={styles.logo}>CEIC</div>
                <div className={styles.schoolName}>Colegio CEIC</div>
            </div>
            
            <nav className={styles.navigation}>
                {!adminModeActive ? (
                    /* Normal mode - show regular menu items */
                    <>
                        <ul className={styles.menuList}>
                            {menuItems.map(item => renderMenuItem(item))}
                        </ul>
                        
                        {isAdmin && (
                            <div className={styles.adminSection}>
                                <div className={styles.menuDivider}></div>
                                <div className={styles.adminSectionTitle}>Administración</div>
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
                        <div className={styles.adminModeIndicator}>
                            <div className={styles.adminModeIconContainer}>
                                <FaUserShield className={styles.adminModeIcon} />
                            </div>
                            <div className={styles.adminModeText}>
                                <span className={styles.adminModeName}>Panel de Administración</span>
                            </div>
                        </div>
                        
                        <div className={styles.adminModeHeader}>
                            <NavLink 
                                to="/dashboard"
                                className={styles.backToMainLink}
                                onClick={() => setAdminModeActive(false)}
                            >
                                <FaHome className={styles.menuIcon} />
                                <span>Volver al Dashboard</span>
                            </NavLink>
                        </div>
                        
                        <div className={styles.menuDivider}></div>
                        <div className={styles.adminSectionTitle}>Panel de Administración</div>
                        
                        <ul className={styles.menuList}>
                            <li className={styles.menuItem}>
                                <NavLink 
                                    to="/admin/dashboard"
                                    className={({ isActive }) => 
                                        `${styles.menuLink} ${isActive ? styles.active : ''}`
                                    }
                                >
                                    <FaHome className={styles.menuIcon} />
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>

                            <div className={styles.menuDivider}></div>
                            <div className={styles.adminSectionTitle}>Gestión</div>
                            
                            <li className={styles.menuItem}>
                                <div 
                                    className={styles.menuLink} 
                                    onClick={() => toggleSubmenu('AdminUsuarios')}
                                >
                                    <FaUsers className={styles.menuIcon} />
                                    <span>Usuarios</span>
                                    <span className={`${styles.menuArrow} ${expandedItems['AdminUsuarios'] ? styles.expanded : ''}`}>
                                        ▶
                                    </span>
                                </div>
                                {expandedItems['AdminUsuarios'] && (
                                    <ul className={styles.submenu}>
                                        <li className={styles.submenuItem}>
                                            <NavLink 
                                                to="/admin/usuarios"
                                                className={({ isActive }) => 
                                                    `${styles.submenuLink} ${isActive ? styles.active : ''}`
                                                }
                                            >
                                                <FaUsers className={styles.menuIcon} />
                                                <span>Lista de Usuarios</span>
                                            </NavLink>
                                        </li>
                                        <li className={styles.submenuItem}>
                                            <NavLink 
                                                to="/admin/crear-usuario"
                                                className={({ isActive }) => 
                                                    `${styles.submenuLink} ${isActive ? styles.active : ''}`
                                                }
                                            >
                                                <FaUsers className={styles.menuIcon} />
                                                <span>Crear Usuario</span>
                                            </NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li className={styles.menuItem}>
                                <div 
                                    className={styles.menuLink} 
                                    onClick={() => toggleSubmenu('AdminCatedraticos')}
                                >
                                    <FaChalkboardTeacher className={styles.menuIcon} />
                                    <span>Catedráticos</span>
                                    <span className={`${styles.menuArrow} ${expandedItems['AdminCatedraticos'] ? styles.expanded : ''}`}>
                                        ▶
                                    </span>
                                </div>
                                {expandedItems['AdminCatedraticos'] && (
                                    <ul className={styles.submenu}>
                                        <li className={styles.submenuItem}>
                                            <NavLink 
                                                to="/admin/catedraticos"
                                                className={({ isActive }) => 
                                                    `${styles.submenuLink} ${isActive ? styles.active : ''}`
                                                }
                                            >
                                                <FaChalkboardTeacher className={styles.menuIcon} />
                                                <span>Lista de Catedráticos</span>
                                            </NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li className={styles.menuItem}>
                                <div 
                                    className={styles.menuLink} 
                                    onClick={() => toggleSubmenu('AdminAlumnos')}
                                >
                                    <FaUsers className={styles.menuIcon} />
                                    <span>Alumnos</span>
                                    <span className={`${styles.menuArrow} ${expandedItems['AdminAlumnos'] ? styles.expanded : ''}`}>
                                        ▶
                                    </span>
                                </div>
                                {expandedItems['AdminAlumnos'] && (
                                    <ul className={styles.submenu}>
                                        <li className={styles.submenuItem}>
                                            <NavLink 
                                                to="/admin/alumnos"
                                                className={({ isActive }) => 
                                                    `${styles.submenuLink} ${isActive ? styles.active : ''}`
                                                }
                                            >
                                                <FaUsers className={styles.menuIcon} />
                                                <span>Lista de Alumnos</span>
                                            </NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li className={styles.menuItem}>
                                <div 
                                    className={styles.menuLink} 
                                    onClick={() => toggleSubmenu('AdminCiclos')}
                                >
                                    <FaCalendarAlt className={styles.menuIcon} />
                                    <span>Ciclos Escolares</span>
                                    <span className={`${styles.menuArrow} ${expandedItems['AdminCiclos'] ? styles.expanded : ''}`}>
                                        ▶
                                    </span>
                                </div>
                                {expandedItems['AdminCiclos'] && (
                                    <ul className={styles.submenu}>
                                        <li className={styles.submenuItem}>
                                            <NavLink 
                                                to="/admin/ciclos"
                                                className={({ isActive }) => 
                                                    `${styles.submenuLink} ${isActive ? styles.active : ''}`
                                                }
                                            >
                                                <FaCalendarAlt className={styles.menuIcon} />
                                                <span>Lista de Ciclos</span>
                                            </NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </>
                )}
            </nav>
            
            <div className={styles.userSection}>
                <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                        <img src="https://via.placeholder.com/40" alt="User" />
                    </div>
                    <div className={styles.userName}>
                        <div className={styles.userDisplayName}>Admin User</div>
                        <div className={styles.userRole}>Administrador</div>
                    </div>
                </div>
                <button className={styles.logoutButton} onClick={logout} title="Cerrar sesión">
                    <FaSignOutAlt />
                </button>
            </div>
        </div>
    );
};

export default SideMenu;
