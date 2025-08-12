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
    const [sortField, setSortField] = useState(savedFilters?.sortField || "usuario");
    const [sortDirection, setSortDirection] = useState(savedFilters?.sortDirection || "asc");
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
            activeSearchQuery,
            sortField,
            sortDirection
        });
    }, [page, pageSize, searchQuery, activeSearchQuery, sortField, sortDirection]);
    
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

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
    };

    const handleSort = (field: string) => {
        // Si se hace clic en el mismo campo, invertir la dirección
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
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
    const renderPagination = () => {
        const paginationItems = [];
        const maxPagesToShow = 5;
        
        let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        
        // Botón anterior
        paginationItems.push(
            <button
                key="prev"
                className={`${styles.paginationButton} ${page === 1 ? styles.disabled : ''}`}
                onClick={() => page > 1 && handlePageChange(page - 1)}
                disabled={page === 1}
            >
                &lt;
            </button>
        );
        
        // Primera página y ellipsis si es necesario
        if (startPage > 1) {
            paginationItems.push(
                <button
                    key={1}
                    className={`${styles.paginationButton} ${page === 1 ? styles.active : ''}`}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                paginationItems.push(
                    <span key="ellipsis1" className={styles.ellipsis}>...</span>
                );
            }
        }
        
        // Páginas numeradas
        for (let i = startPage; i <= endPage; i++) {
            paginationItems.push(
                <button
                    key={i}
                    className={`${styles.paginationButton} ${page === i ? styles.active : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        
        // Última página y ellipsis si es necesario
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationItems.push(
                    <span key="ellipsis2" className={styles.ellipsis}>...</span>
                );
            }
            paginationItems.push(
                <button
                    key={totalPages}
                    className={`${styles.paginationButton} ${page === totalPages ? styles.active : ''}`}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }
        
        // Botón siguiente
        paginationItems.push(
            <button
                key="next"
                className={`${styles.paginationButton} ${page === totalPages ? styles.disabled : ''}`}
                onClick={() => page < totalPages && handlePageChange(page + 1)}
                disabled={page === totalPages}
            >
                &gt;
            </button>
        );
        
        return (
            <div className={styles.paginationContainer}>
                {paginationItems}
            </div>
        );
    };

    // Formatear fecha a un formato legible
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
                        <div className={styles.emptyIcon}>🔍</div>
                        <div className={styles.emptyMessage}>No se encontraron usuarios que coincidan con tu búsqueda</div>
                    </td>
                </tr>
            );
        }
        
        return usuarios.map(renderUserRow);
    };

    // Determinar dirección de ordenamiento para el encabezado
    const getSortIcon = (field: string) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? '↑' : '↓';
    };
    
    return (
        <div className={styles.usuariosPage}>
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <FaUsersCog size={24} />
                    Listado de Usuarios
                    <span className={styles.badgeCount}>{total}</span>
                </div>
                <Link to="/admin/usuarios/crear" className={styles.createButton}>
                    <FaPlus size={14} />
                    Crear Usuario
                </Link>
            </div>
            
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
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className={styles.filterButton}>
                            <FaSearch size={14} />
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
                            setSearchQuery("");
                            setActiveSearchQuery("");
                            setPage(1);
                        }}
                        title="Limpiar búsqueda"
                    >
                        ×
                    </button>
                </div>
            )}
            
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th onClick={() => handleSort('usuario')}>
                                Usuario {getSortIcon('usuario')}
                            </th>
                            <th onClick={() => handleSort('primerNombre')}>
                                Nombre {getSortIcon('primerNombre')}
                            </th>
                            <th onClick={() => handleSort('telefono')}>
                                Teléfono {getSortIcon('telefono')}
                            </th>
                            <th onClick={() => handleSort('idTipoUsuario')}>
                                Tipo {getSortIcon('idTipoUsuario')}
                            </th>
                            <th onClick={() => handleSort('createdAt')}>
                                Fecha Creación {getSortIcon('createdAt')}
                            </th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {renderTableBody()}
                    </tbody>
                </table>
            </div>
            
            <div className={styles.footerSection}>
                <div className={styles.pageSizeSelector}>
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
                    <span>registros por página</span>
                </div>

                <div className={styles.paginationInfo}>
                    Mostrando {usuarios.length} de {total} registros
                </div>

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        {renderPagination()}
                    </div>
                )}
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
