import { useState, useEffect } from "react";
import { useTeacherTable } from "../hooks/useTeacherTable";
import { deleteTeacher } from "../services/teacherService";
import styles from "./TeachersPage.module.css";
import { Link } from "react-router-dom";
import {
    FaSearch,
    FaEye,
    FaPencilAlt,
    FaTrash,
    FaPlus,
    FaChalkboardTeacher
} from "react-icons/fa";
import type { Teacher } from "../models/Teacher";
import DeleteConfirmModal from "../../../../../components/DeleteConfirmModal";

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100];

// Funciones para persistir y recuperar los filtros en localStorage
const saveFiltersToStorage = (filters: any) => {
    localStorage.setItem('teachersFilters', JSON.stringify(filters));
};

const getFiltersFromStorage = () => {
    const savedFilters = localStorage.getItem('teachersFilters');
    if (savedFilters) {
        return JSON.parse(savedFilters);
    }
    return null;
};

export const TeachersPage = () => {
    // Recuperar filtros guardados o usar valores por defecto
    const savedFilters = getFiltersFromStorage();
    
    const [page, setPage] = useState(savedFilters?.page || 1);
    const [pageSize, setPageSize] = useState(savedFilters?.pageSize || PAGE_SIZE_OPTIONS[0]);
    const [searchQuery, setSearchQuery] = useState(savedFilters?.searchQuery || "");
    const [activeSearchQuery, setActiveSearchQuery] = useState(savedFilters?.activeSearchQuery || "");
    const [lastViewedTeacher, setLastViewedTeacher] = useState(localStorage.getItem('lastViewedTeacher') || "");
    const [highlightedRow, setHighlightedRow] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const {
        teachers,
        loading,
        error,
        refetch: recargarDatos
    } = useTeacherTable({
        page,
        limit: pageSize,
        searchTerm: activeSearchQuery,
        sortField: "idUsuario",
        sortDirection: "asc"
    });
    
    useEffect(() => {
        // Aplicar resaltado si se viene de ver detalles de un teacher
        if (lastViewedTeacher) {
            setHighlightedRow(lastViewedTeacher);
            // Limpiar después de un tiempo
            const timer = setTimeout(() => {
                setHighlightedRow("");
                setLastViewedTeacher("");
                localStorage.removeItem('lastViewedTeacher');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [lastViewedTeacher]);
    
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
    const handleDeleteClick = (dpi: string) => {
        setTeacherToDelete(dpi);
        setDeleteModalOpen(true);
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setTeacherToDelete("");
        setDeleteError(null);
    };
    
    const handleConfirmDelete = async (dpi: string) => {
        setDeleteLoading(true);
        try {
            await deleteTeacher(dpi);
            setDeleteSuccess(true);
            setDeleteModalOpen(false);
            // Mostrar notificación temporal de éxito
            setTimeout(() => {
                setDeleteSuccess(false);
            }, 3000);
            // Recargar la tabla
            recargarDatos();
        } catch (error: any) {
            setDeleteError(error.message || "Error al eliminar el catedrático");
        } finally {
            setDeleteLoading(false);
        }
    };

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
    const getInitials = (teacher: Teacher) => {
        if (!teacher.usuario) return "TC";
        const first = teacher.usuario.primerNombre?.charAt(0) || '';
        const last = teacher.usuario.primerApellido?.charAt(0) || '';
        return (first + last).toUpperCase();
    };

    // Renderizar teacher con resaltado condicional
    const renderTeacherRow = (teacher: Teacher) => {
        const isHighlighted = highlightedRow === teacher.idUsuario;
        return (
            <tr key={teacher.dpi} className={`${styles.userRow} ${isHighlighted ? styles.highlightedRow : ''}`}>
                <td>
                    <div className={styles.nameCell}>
                        <div className={styles.avatar}>
                            {getInitials(teacher)}
                        </div>
                        <div>
                            <div className={styles.userName}>{teacher.idUsuario}</div>
                            <div className={styles.userEmail}>{teacher.dpi}</div>
                        </div>
                    </div>
                </td>
                <td>
                    {teacher.usuario ? 
                        `${teacher.usuario.primerNombre} ${teacher.usuario.segundoNombre || ''} ${teacher.usuario.primerApellido} ${teacher.usuario.segundoApellido || ''}` :
                        'N/A'
                    }
                </td>
                <td>{teacher.dpi}</td>
                <td>
                    {teacher.usuario?.telefono || 'N/A'}
                </td>
                <td className={styles.dateCell}>
                    {formatDate(teacher.usuario?.createdAt)}
                </td>
                <td className={styles.actionCell}>
                    <Link
                        to={`/admin/catedratico/${teacher.dpi}`}
                        className={`${styles.actionButton} ${styles.view}`}
                        title="Ver detalles"
                        onClick={() => localStorage.setItem('lastViewedTeacher', teacher.idUsuario)}
                    >
                        <FaEye size={16} />
                    </Link>
                    <Link
                        to={`/admin/editar-catedratico/${teacher.dpi}`}
                        className={`${styles.actionButton} ${styles.edit}`}
                        title="Editar catedrático"
                    >
                        <FaPencilAlt size={16} />
                    </Link>
                    <button
                        className={`${styles.actionButton} ${styles.delete}`}
                        onClick={() => handleDeleteClick(teacher.dpi)}
                        title="Eliminar catedrático"
                    >
                        <FaTrash size={16} />
                    </button>
                </td>
            </tr>
        );
    };
    
    // Renderizar cuerpo de la tabla o mensaje vacío
    const renderTableBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={6} className={styles.emptyState}>
                        <div className={styles.emptyIcon}>⏳</div>
                        <div className={styles.emptyMessage}>Cargando catedráticos...</div>
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={6} className={styles.emptyState}>
                        <div className={styles.emptyIcon}>❌</div>
                        <div className={styles.emptyMessage}>Error al cargar los datos</div>
                    </td>
                </tr>
            );
        }

        if (!teachers?.items || teachers.items.length === 0) {
            return (
                <tr>
                    <td colSpan={6} className={styles.emptyState}>
                        <div className={styles.emptyIcon}>👨‍🏫</div>
                        <div className={styles.emptyMessage}>
                            {activeSearchQuery 
                                ? `No se encontraron catedráticos que coincidan con "${activeSearchQuery}"`
                                : "No hay catedráticos registrados en el sistema"
                            }
                        </div>
                    </td>
                </tr>
            );
        }
        
        return teachers.items.map(renderTeacherRow);
    };
    
    const total = teachers?.totalItems || 0;
    const totalPages = teachers?.totalPages || 0;
    const currentData = teachers?.items || [];
    
    return (
        <div className={styles.pageContainer}>
            
            {/* Encabezado con botón de crear catedrático */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <FaChalkboardTeacher size={28} />
                    Gestión de Catedráticos
                    <span className={styles.badgeCount}>{total}</span>
                </div>

                <Link to="/admin/crear-catedratico" className={styles.createButton}>
                    <FaPlus size={16} />
                    Nuevo Catedrático
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

            {/* Tabla de catedráticos */}
            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeader}>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>DPI</th>
                            <th>Teléfono</th>
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
                        Mostrando {currentData.length} de {total} registros
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

            {/* Modal de confirmación para eliminar catedrático */}
            <DeleteConfirmModal 
                isOpen={deleteModalOpen}
                title="Eliminar Catedrático"
                message={`¿Estás seguro que deseas eliminar al catedrático con DPI "${teacherToDelete}"? Esta acción no se puede deshacer.`}
                itemId={teacherToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                isLoading={deleteLoading}
            />
            
            {/* Notificaciones */}
            {deleteSuccess && (
                <div className={styles.notification}>
                    <div className={styles.successNotification}>
                        <strong>¡Éxito!</strong> Catedrático eliminado correctamente.
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

export default TeachersPage;
