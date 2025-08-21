import { useState, useEffect } from "react";
import { useTablaUsuario } from "../hooks/useTablaUsuario";
import { useEliminarUsuario } from "../hooks/useEliminarUsuario";
import styles from "./UsersPage.module.css";
import { Link } from "react-router-dom";
import {
    FaSearch,
    FaEye,
    FaPencilAlt,
    FaTrash,
    FaPlus,
    FaUsersCog,
    FaKey
} from "react-icons/fa";
import type { Usuario } from "../models";
import DeleteConfirmModal from "../../../../../components/DeleteConfirmModal";

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100];

// Funciones para persistir y recuperar los filtros en localStorage
const saveFiltersToStorage = (filters: any) => {
    localStorage.setItem('usuariosFilters', JSON.stringify(filters));
};

const getFiltersFromStorage = () => {
    const savedFilters = localStorage.getItem('usuariosFilters');
    if (savedFilters) {
        return JSON.parse(savedFilters);
    }
    return null;
};

export const UsersPage = () => {
    // Recuperar filtros guardados o usar valores por defecto
    const savedFilters = getFiltersFromStorage();
    
    const [page, setPage] = useState(savedFilters?.page || 1);
    const [pageSize, setPageSize] = useState(savedFilters?.pageSize || PAGE_SIZE_OPTIONS[0]);
    const [searchQuery, setSearchQuery] = useState(savedFilters?.searchQuery || "");
    const [activeSearchQuery, setActiveSearchQuery] = useState(savedFilters?.activeSearchQuery || "");
    const [lastViewedUser, setLastViewedUser] = useState(localStorage.getItem('lastViewedUser') || "");
    const [highlightedRow, setHighlightedRow] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    
    const { usuarios, total, totalPages, recargarDatos } = useTablaUsuario(page, pageSize, activeSearchQuery);
    const { eliminarUsuario, isLoading: isDeleting, error: deleteError } = useEliminarUsuario();
    
    useEffect(() => {
        // Aplicar resaltado si se viene de ver detalles de un usuario
        if (lastViewedUser) {
            setHighlightedRow(lastViewedUser);
            // Limpiar después de un tiempo
            const timer = setTimeout(() => {
                setHighlightedRow("");
                setLastViewedUser("");
                localStorage.removeItem('lastViewedUser');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [lastViewedUser]);
    
    useEffect(() => {
        // Guardar filtros actuales
        saveFiltersToStorage({
            page,
            pageSize,
            searchQuery,
            activeSearchQuery
        });
    }, [page, pageSize, searchQuery, activeSearchQuery]);
    
    useEffect(() => {
        // Reset a página 1 cuando cambia la búsqueda activa o el tamaño de página
        if (page !== 1) {
            setPage(1);
        }
    }, [activeSearchQuery, pageSize]);
    
    useEffect(() => {
        // Recargar datos después de una eliminación exitosa
        if (deleteSuccess) {
            recargarDatos();
            setDeleteSuccess(false);
        }
    }, [deleteSuccess, recargarDatos]);

    // Handlers
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveSearchQuery(searchQuery);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    // Funciones para manejar el modal de eliminación
    const handleDeleteClick = (usuario: string) => {
        setUserToDelete(usuario);
        setDeleteModalOpen(true);
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setUserToDelete("");
    };
    
    const handleConfirmDelete = async (usuario: string) => {
        const success = await eliminarUsuario(usuario);
        if (success) {
            setDeleteSuccess(true);
            setDeleteModalOpen(false);
            // Mostrar notificación temporal de éxito
            setTimeout(() => {
                setDeleteSuccess(false);
            }, 3000);
            // Recargar la tabla de usuarios
            recargarDatos();
        }
    };

    // Pagination 
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // Obtener iniciales para el avatar
    const getInitials = (user: Usuario) => {
        const first = user.primerNombre?.charAt(0) || '';
        const last = user.primerApellido?.charAt(0) || '';
        return (first + last).toUpperCase();
    };

    // Obtener clase para el badge según tipo de usuario
    const getUserBadgeClass = (tipoUsuario: any) => {
        if (!tipoUsuario) return '';
        
        const tipo = tipoUsuario.descripcion?.toLowerCase() || '';
        if (tipo.includes('admin')) return styles.badgeAdmin;
        if (tipo.includes('profesor') || tipo.includes('docente')) return styles.badgeTeacher;
        if (tipo.includes('estudiante') || tipo.includes('alumno')) return styles.badgeStudent;
        if (tipo.includes('padre') || tipo.includes('madre') || tipo.includes('encargado')) return styles.badgeParent;
        
        return '';
    };

    // Renderizar usuario con resaltado condicional
    const renderUserRow = (user: Usuario) => {
        const isHighlighted = highlightedRow === user.usuario;
        return (
            <tr key={user.usuario} className={`${styles.userRow} ${isHighlighted ? styles.highlightedRow : ''}`}>
                <td>
                    <div className={styles.nameCell}>
                        <div className={styles.avatar}>
                            {getInitials(user)}
                        </div>
                        <div>
                            <div className={styles.userName}>{user.usuario}</div>
                            <div className={styles.userEmail}>{user.telefono}</div>
                        </div>
                    </div>
                </td>
                <td>{`${user.primerNombre} ${user.segundoNombre || ''} ${user.primerApellido} ${user.segundoApellido || ''}`}</td>
                <td>{user.telefono}</td>
                <td>
                    <span className={`${styles.badge} ${getUserBadgeClass(user.tipoUsuario)}`}>
                        {user.tipoUsuario?.descripcion || 'N/A'}
                    </span>
                </td>
                <td className={styles.dateCell}>
                    {formatDate(user.createdAt)}
                </td>
                <td className={styles.actionCell}>
                    <Link
                        to={`/admin/usuarios/${user.usuario}`}
                        className={`${styles.actionButton} ${styles.view}`}
                        title="Ver detalles"
                        onClick={() => localStorage.setItem('lastViewedUser', user.usuario)}
                    >
                        <FaEye size={16} />
                    </Link>
                    <Link
                        to={`/admin/usuarios/editar/${user.usuario}`}
                        className={`${styles.actionButton} ${styles.edit}`}
                        title="Editar usuario"
                    >
                        <FaPencilAlt size={16} />
                    </Link>
                    <button
                        className={`${styles.actionButton} ${styles.delete}`}
                        onClick={() => handleDeleteClick(user.usuario)}
                        title="Eliminar usuario"
                    >
                        <FaTrash size={16} />
                    </button>
                    <Link
                        to={`/admin/usuarios/reiniciar-contrasena/${user.usuario}`}
                        className={`${styles.actionButton} ${styles.password}`}
                        title="Reiniciar contraseña"
                    >
                        <FaKey size={16} />
                    </Link>
                </td>
            </tr>
        );
    };
    
    // Renderizar cuerpo de la tabla o mensaje vacío
    const renderTableBody = () => {
        if (usuarios.length === 0) {
            return (
                <tr>
                    <td colSpan={6} className={styles.emptyState}>
                        <div className={styles.emptyIcon}>�</div>
                        <div className={styles.emptyMessage}>
                            {activeSearchQuery 
                                ? `No se encontraron usuarios que coincidan con "${activeSearchQuery}"`
                                : "No hay usuarios registrados en el sistema"
                            }
                        </div>
                    </td>
                </tr>
            );
        }
        
        return usuarios.map(renderUserRow);
    };
    
    return (
        <div className={styles.pageContainer}>
            
            {/* Encabezado con botón de crear usuario */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <FaUsersCog size={28} />
                    Gestión de Usuarios
                    <span className={styles.badgeCount}>{total}</span>
                </div>

                <Link to="/admin/usuarios/crear" className={styles.createButton}>
                    <FaPlus size={16} />
                    Nuevo Usuario
                </Link>
            </div>

            {/* Barra de herramientas y búsqueda */}
            <div className={styles.toolbarSection}>
                <div className={styles.searchTools}>
                    <form 
                        className={styles.searchForm} 
                        onSubmit={handleSearch}
                    >
                        <div className={styles.searchInput}>
                            <FaSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Buscar por nombre o usuario"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (e.target.value === "" && activeSearchQuery !== "") {
                                        setActiveSearchQuery("");
                                        setPage(1);
                                    }
                                }}
                            />
                        </div>

                        <button 
                            type="submit"
                            className={styles.filterButton}
                        >
                            <FaSearch size={16} />
                            Buscar
                        </button>
                    </form>
                </div>
            </div>

            {/* Indicador de búsqueda activa */}
            {activeSearchQuery && (
                <div className={styles.activeSearchIndicator}>
                    <span className={styles.searchLabel}>Búsqueda actual:</span>
                    <span className={styles.searchTerm}>{activeSearchQuery}</span>
                    <button 
                        className={styles.clearSearchButton}
                        onClick={() => {
                            setActiveSearchQuery("");
                            setSearchQuery("");
                            setPage(1);
                        }}
                        title="Limpiar búsqueda"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Tabla de usuarios */}
            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeader}>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Tipo</th>
                            <th>Fecha Creación</th>
                            <th className={styles.actionCell}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody className={styles.tableBody}>
                        {renderTableBody()}
                    </tbody>
                </table>

                {/* Footer con paginación */}
                <div className={styles.footerSection}>
                    <div className={styles.rowsPerPage}>
                        <span>Mostrar</span>
                        <select
                            className={styles.selectPageSize}
                            value={pageSize}
                            onChange={handlePageSizeChange}
                        >
                            {PAGE_SIZE_OPTIONS.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        <span>registros</span>
                    </div>

                    <div className={styles.paginationInfo}>
                        Mostrando {usuarios.length} de {total} registros
                    </div>

                    <div className={styles.pagination}>
                        <button
                            className={styles.pageButton}
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            aria-label="Anterior"
                        >
                            &lt;
                        </button>

                        {/* Primera página */}
                        {page > 2 && (
                            <button className={styles.pageButton} onClick={() => setPage(1)}>1</button>
                        )}

                        {/* Elipsis si hay muchas páginas */}
                        {page > 3 && <span>...</span>}

                        {/* Páginas cercanas a la actual */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(num => num === page || num === page - 1 || num === page + 1)
                            .map(num => (
                                <button
                                    key={num}
                                    className={`${styles.pageButton} ${num === page ? styles.active : ''}`}
                                    onClick={() => setPage(num)}
                                >
                                    {num}
                                </button>
                            ))
                        }

                        {/* Elipsis si hay muchas páginas */}
                        {page < totalPages - 2 && <span>...</span>}

                        {/* Última página */}
                        {page < totalPages - 1 && totalPages > 1 && (
                            <button className={styles.pageButton} onClick={() => setPage(totalPages)}>
                                {totalPages}
                            </button>
                        )}

                        <button
                            className={styles.pageButton}
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page >= totalPages}
                            aria-label="Siguiente"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
                </div>
            </div>

            {/* Modal de confirmación para eliminar usuario */}
            <DeleteConfirmModal 
                isOpen={deleteModalOpen}
                title="Eliminar Usuario"
                message={`¿Estás seguro que deseas eliminar al usuario "${userToDelete}"? Esta acción no se puede deshacer.`}
                itemId={userToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                isLoading={isDeleting}
            />
            
            {/* Notificaciones */}
            {deleteSuccess && (
                <div className={styles.notification}>
                    <div className={styles.successNotification}>
                        <strong>¡Éxito!</strong> Usuario eliminado correctamente.
                        <button 
                            onClick={() => setDeleteSuccess(false)} 
                            className={styles.closeNotification}
                            aria-label="Cerrar notificación"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
            
            {deleteError && (
                <div className={styles.notification}>
                    <div className={styles.errorNotification}>
                        <strong>Error:</strong> {deleteError}
                    </div>
                </div>
            )}
        </div>
    );
};
