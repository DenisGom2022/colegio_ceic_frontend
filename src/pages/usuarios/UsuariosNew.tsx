import { useState, useEffect } from "react";
import { useTablaUsuario } from "../../hooks/useTablaUsuario";
import { useEliminarUsuario } from "../../hooks/useEliminarUsuario";
import styles from "./UsuariosNew.module.css";
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
import type { Usuario } from "../../models/Usuario";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100];

// Funciones para persistir y recuperar los filtros en localStorage
const saveFiltersToStorage = (filters:any) => {
    localStorage.setItem('usuariosFilters', JSON.stringify(filters));
};

const getFiltersFromStorage = () => {
    const savedFilters = localStorage.getItem('usuariosFilters');
    if (savedFilters) {
        return JSON.parse(savedFilters);
    }
    return null;
};

const UsuariosNew = () => {
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
    const { eliminarUsuario, isLoading: deleteLoading, error: deleteError } = useEliminarUsuario();
    
    // Guardar filtros cuando cambien
    useEffect(() => {
        const filters = {
            page,
            pageSize,
            searchQuery,
            activeSearchQuery,
            sortField,
            sortDirection
        };
        saveFiltersToStorage(filters);
    }, [page, pageSize, searchQuery, activeSearchQuery, sortField, sortDirection]);
    
    // Efecto para resaltar la fila del usuario recién consultado
    useEffect(() => {
        // Si hay un usuario que se acaba de ver
        if (lastViewedUser && usuarios.some(u => u.usuario === lastViewedUser)) {
            // Resaltar ese usuario
            setHighlightedRow(lastViewedUser);
            
            // Quitar el resaltado después de 0.9 segundos
            const timer = setTimeout(() => {
                setHighlightedRow("");
                // Limpiar el localStorage
                localStorage.removeItem('lastViewedUser');
                setLastViewedUser("");
            }, 900);
            
            return () => clearTimeout(timer);
        }
    }, [lastViewedUser, usuarios]);

    // Obtener las iniciales para el avatar
    const getInitials = (user: Usuario) => {
        const firstName = user.primerNombre.charAt(0);
        const lastName = user.primerApellido.charAt(0);
        return `${firstName}${lastName}`.toUpperCase();
    };

    // Obtener el color de badge según el tipo de usuario
    const getUserBadgeClass = (tipoUsuario: Usuario['tipoUsuario'] | undefined) => {
        const tipo = tipoUsuario?.descripcion?.toLowerCase() || "";
        if (tipo.includes("admin")) return styles.badgeAdmin;
        if (tipo.includes("profesor") || tipo.includes("docente")) return styles.badgeTeacher;
        if (tipo.includes("estudiante") || tipo.includes("alumno")) return styles.badgeStudent;
        if (tipo.includes("padre") || tipo.includes("madre")) return styles.badgeParent;
        return "";
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

    // Usar directamente los usuarios sin filtrado ni paginación en el cliente
    // Esta parte será manejada por el backend
    const paginatedUsers = usuarios; // Esto vendrá ya paginado desde el backend
    
    // Funciones para manejar el modal de eliminación
    const handleOpenDeleteModal = (usuario: string) => {
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
            // Recargar la tabla de usuarios manualmente
            recargarDatos();
        }
    };

    // Cambiar el campo de ordenación
    // Esta función enviará una solicitud al backend para reordenar los datos
    const handleSortChange = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
        // Aquí irá la lógica para solicitar nuevos datos al backend con el nuevo ordenamiento
        setPage(1); // Resetear a la primera página cuando cambia el ordenamiento
    };

    return (
        <div className={styles.pageContainer}>
            
            {/* Encabezado con botón de crear usuario */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <FaUsersCog size={24} />
                    Listado de Usuarios
                    <span className={styles.badgeCount}>{ total }</span>
                </div>

                    <Link to="/admin/crear-usuario" className={styles.createButton}>
                        <FaPlus size={14} />
                        Crear Usuario
                    </Link>
                </div>

                {/* Barra de herramientas y búsqueda */}
                <div className={styles.toolbarSection}>
                    <div className={styles.searchTools}>
                        <form 
                            className={styles.searchForm} 
                            onSubmit={(e) => {
                                e.preventDefault();
                                // Activar la búsqueda con el valor actual
                                setActiveSearchQuery(searchQuery);
                                setPage(1); // Resetear a la primera página al buscar
                            }}
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
                                        // Si se borra la búsqueda completamente, limpiar la búsqueda activa también
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
                                setActiveSearchQuery("");
                                setSearchQuery("");
                                setPage(1);
                                // Los cambios se guardarán automáticamente gracias al useEffect
                            }}
                            title="Limpiar búsqueda"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Tabla de usuarios */}
                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHeader}>
                                <th onClick={() => handleSortChange("usuario")} style={{ cursor: "pointer" }}>
                                    Usuario
                                </th>
                                <th onClick={() => handleSortChange("nombre")} style={{ cursor: "pointer" }}>
                                    Nombre Completo
                                </th>
                                <th>Teléfono</th>
                                <th>Tipo de Usuario</th>
                                <th>Fecha de Registro</th>
                                <th className={styles.actionCell}>Acciones</th>
                            </tr>
                        </thead>

                        <tbody className={styles.tableBody}>
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className={styles.emptyState}>
                                        <div className={styles.emptyIcon}>🔍</div>
                                        <div className={styles.emptyMessage}>No se encontraron usuarios que coincidan con tu búsqueda</div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <tr 
                                        key={user.usuario} 
                                        className={`${styles.userRow} ${highlightedRow === user.usuario ? styles.highlightedRow : ''}`}
                                    >
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
                                        <td>
                                            {`${user.primerNombre} ${user.segundoNombre || ''} ${user.primerApellido} ${user.segundoApellido || ''}`}
                                        </td>
                                        <td>{user.telefono}</td>
                                        <td>
                                            <span className={`${styles.badge} ${getUserBadgeClass(user.tipoUsuario)}`}>
                                                {user.tipoUsuario?.descripcion}
                                            </span>
                                        </td>
                                        <td className={styles.dateCell}>
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className={styles.actionCell}>
                                            <Link
                                                to={`/admin/usuario/${user.usuario}`}
                                                className={`${styles.actionButton} ${styles.view}`}
                                                title="Ver detalles"
                                                onClick={() => localStorage.setItem('lastViewedUser', user.usuario)}
                                            >
                                                <FaEye size={16} />
                                            </Link>
                                            <Link
                                                to={`/admin/editar-usuario/${user.usuario}`}
                                                className={`${styles.actionButton} ${styles.edit}`}
                                                title="Editar usuario"
                                            >
                                                <FaPencilAlt size={15} />
                                            </Link>
                                            <Link 
                                                to={`/admin/reiniciar-contrasena/${user.usuario}`}
                                                className={`${styles.actionButton} ${styles.password}`} 
                                                title="Reiniciar contraseña"
                                            >
                                                <FaKey size={14} />
                                            </Link>
                                            <button 
                                                className={`${styles.actionButton} ${styles.delete}`} 
                                                title="Eliminar usuario"
                                                onClick={() => handleOpenDeleteModal(user.usuario)}
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Footer con paginación */}
                    <div className={styles.footerSection}>
                        <div className={styles.rowsPerPage}>
                            <span>Mostrar</span>
                            <select
                                className={styles.selectPageSize}
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(1); // Resetear la página cuando cambia el tamaño
                                    // Aquí irá la lógica para solicitar nuevos datos al backend con el nuevo tamaño de página
                                }}
                            >
                                {PAGE_SIZE_OPTIONS.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                            <span>registros</span>
                        </div>

                        <div className={styles.paginationInfo}>
                            Mostrando {paginatedUsers.length} de {total} registros
                        </div>

                        <div className={styles.pagination}>
                            <button
                                className={styles.pageButton}
                                onClick={() => {
                                    const newPage = Math.max(1, page - 1);
                                    setPage(newPage);
                                    // Aquí irá la lógica para solicitar la página anterior al backend
                                }}
                                disabled={page === 1}
                                aria-label="Anterior"
                            >
                                &lt;
                            </button>

                            {/* Primera página */}
                            {page > 2 && (
                                <button className={styles.pageButton} onClick={() => {
                                    setPage(1);
                                    // Aquí irá la lógica para solicitar la primera página al backend
                                }}>1</button>
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
                                        onClick={() => {
                                            setPage(num);
                                            // Aquí irá la lógica para solicitar una página específica al backend
                                        }}
                                    >
                                        {num}
                                    </button>
                                ))
                            }

                            {/* Elipsis si hay muchas páginas */}
                            {page < totalPages - 2 && <span>...</span>}

                            {/* Última página */}
                            {page < totalPages - 1 && totalPages > 1 && (
                                <button className={styles.pageButton} onClick={() => {
                                    setPage(totalPages);
                                    // Aquí irá la lógica para solicitar la última página al backend
                                }}>
                                    {totalPages}
                                </button>
                            )}

                            <button
                                className={styles.pageButton}
                                onClick={() => {
                                    const newPage = Math.min(totalPages, page + 1);
                                    setPage(newPage);
                                    // Aquí irá la lógica para solicitar la página siguiente al backend
                                }}
                                disabled={page >= totalPages}
                                aria-label="Siguiente"
                            >
                                &gt;
                            </button>
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
                    isLoading={deleteLoading}
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

export default UsuariosNew;
