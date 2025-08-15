import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaSearch,
    FaEye,
    FaPencilAlt,
    FaTrash,
    FaPlus,
    FaChalkboardTeacher
} from "react-icons/fa";
import { useTeacherTable } from "../hooks/useTeacherTable";
import type { Teacher } from "../models/Teacher";
import DeleteConfirmModal from "../../../../../components/DeleteConfirmModal";
import { deleteTeacher } from "../services/teacherService";
import styles from "./TeachersPage.module.css";

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

const TeachersPage = () => {
    // Recuperar filtros guardados o usar valores por defecto
    const savedFilters = getFiltersFromStorage();
    
    const [page, setPage] = useState(savedFilters?.page || 1);
    const [pageSize, setPageSize] = useState(savedFilters?.pageSize || PAGE_SIZE_OPTIONS[0]);
    const [searchQuery, setSearchQuery] = useState(savedFilters?.searchQuery || "");
    const [activeSearchQuery, setActiveSearchQuery] = useState(savedFilters?.activeSearchQuery || "");
    const [sortField, setSortField] = useState(savedFilters?.sortField || "idUsuario");
    const [sortDirection, setSortDirection] = useState(savedFilters?.sortDirection || "asc");
    const [lastViewedTeacher, setLastViewedTeacher] = useState(localStorage.getItem('lastViewedTeacher') || "");
    const [highlightedRow, setHighlightedRow] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Usar el hook para la tabla de maestros
    const {
        teachers,
        loading,
        error,
        refetch: recargarDatos
    } = useTeacherTable({
        page,
        limit: pageSize,
        searchTerm: activeSearchQuery,
        sortField,
        sortDirection
    });
    
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
    
    // Efecto para resaltar la fila del maestro recién consultado
    useEffect(() => {
        // Si hay un catedrático que se acaba de ver y tenemos datos de catedráticos
        if (lastViewedTeacher && teachers && teachers.items.length > 0 && 
            teachers.items.some(t => t && t.idUsuario === lastViewedTeacher)) {
            // Resaltar ese catedrático
            setHighlightedRow(lastViewedTeacher);
            
            // Quitar el resaltado después de 0.9 segundos
            const timer = setTimeout(() => {
                setHighlightedRow("");
                // Limpiar el localStorage
                localStorage.removeItem('lastViewedTeacher');
                setLastViewedTeacher("");
            }, 900);
            
            return () => clearTimeout(timer);
        }
    }, [lastViewedTeacher, teachers]);
    
    // Obtener las iniciales para el avatar
    const getInitials = (teacher: Teacher) => {
        // Verificar que usuario existe para evitar error de null
        if (!teacher.usuario) {
            return "NA"; // Not Available
        }
        const firstName = teacher.usuario.primerNombre?.charAt(0) || "?";
        const lastName = teacher.usuario.primerApellido?.charAt(0) || "?";
        return `${firstName}${lastName}`.toUpperCase();
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
    
    // Funciones para manejar el modal de eliminación
    const handleOpenDeleteModal = (teacher: Teacher) => {
        setTeacherToDelete(teacher.dpi);
        setDeleteModalOpen(true);
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setTeacherToDelete("");
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
            // Usar la función recargarDatos para actualizar la tabla
            recargarDatos();
        } catch (error: any) {
            setDeleteError(error.message || "Error al eliminar el maestro");
        } finally {
            setDeleteLoading(false);
        }
    };
    
    // Cambiar el campo de ordenación
    const handleSortChange = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
        setPage(1);
    };
    
    // Ordenar maestros (frontend solo)
    const sortedTeachers = teachers && teachers.items ? [...teachers.items].sort((a, b) => {
        let valA, valB;

        if (sortField === 'idUsuario') {
            valA = a.idUsuario || '';
            valB = b.idUsuario || '';
        } else if (sortField === 'nombre') {
            // Manejar el caso cuando usuario es null
            valA = a.usuario ? (a.usuario.primerNombre || '') + ' ' + (a.usuario.primerApellido || '') : '';
            valB = b.usuario ? (b.usuario.primerNombre || '') + ' ' + (b.usuario.primerApellido || '') : '';
        } else if (sortField === 'dpi') {
            valA = a.dpi || '';
            valB = b.dpi || '';
        } else {
            return 0;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    }) : [];

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <div>Cargando maestros...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div>Error: {error}</div>
                <button className={styles.reloadButton} onClick={() => window.location.reload()}>
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            
            {/* Encabezado con botón de crear maestro */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <FaChalkboardTeacher size={24} />
                    Listado de Maestros
                    <span className={styles.badgeCount}>{ teachers?.totalItems || 0 }</span>
                </div>

                <Link to="/admin/crear-catedratico" className={styles.createButton}>
                    <FaPlus size={14} />
                    Crear Maestro
                </Link>
            </div>

            {/* Barra de herramientas y búsqueda */}
            <div className={styles.toolbarSection}>
                <div className={styles.searchTools}>
                    <form 
                        className={styles.searchForm} 
                        onSubmit={(e) => {
                            e.preventDefault();
                            setActiveSearchQuery(searchQuery);
                            setPage(1);
                        }}
                    >
                        <div className={styles.searchInput}>
                            <FaSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Buscar por nombre, usuario o DPI"
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
                        }}
                        title="Limpiar búsqueda"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Tabla de maestros */}
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeader}>
                            <th onClick={() => handleSortChange("idUsuario")} style={{ cursor: "pointer" }}>
                                Usuario
                            </th>
                            <th onClick={() => handleSortChange("nombre")} style={{ cursor: "pointer" }}>
                                Nombre Completo
                            </th>
                            <th onClick={() => handleSortChange("dpi")} style={{ cursor: "pointer" }}>
                                DPI
                            </th>
                            <th>Teléfono</th>
                            <th>Fecha de Registro</th>
                            <th className={styles.actionCell}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody className={styles.tableBody}>
                        {teachers?.items.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                                    <div style={{ fontSize: '0.875rem' }}>No se encontraron catedráticos que coincidan con tu búsqueda</div>
                                </td>
                            </tr>
                        ) : (
                            sortedTeachers.map((teacher: Teacher) => (
                                <tr 
                                    key={teacher.idUsuario} 
                                    className={`${styles.userRow} ${highlightedRow === teacher.idUsuario ? styles.highlightedRow : ''}`}
                                >
                                    <td>
                                        <div className={styles.nameCell}>
                                            <div className={styles.avatar}>
                                                {getInitials(teacher)}
                                            </div>
                                            <div>
                                                <div className={styles.userName}>{teacher.idUsuario}</div>
                                                <div className={styles.userEmail}>{teacher.usuario?.telefono || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {teacher.usuario ? 
                                            `${teacher.usuario.primerNombre || ''} ${teacher.usuario.segundoNombre || ''} ${teacher.usuario.primerApellido || ''} ${teacher.usuario.segundoApellido || ''}` : 
                                            'Datos no disponibles'
                                        }
                                    </td>
                                    <td>{teacher.dpi || 'N/A'}</td>
                                    <td>{teacher.usuario?.telefono || 'N/A'}</td>
                                    <td className={styles.dateCell}>
                                        {formatDate(teacher.createdAt)}
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
                                            title="Editar maestro"
                                        >
                                            <FaPencilAlt size={15} />
                                        </Link>
                                        <button 
                                            className={`${styles.actionButton} ${styles.delete}`} 
                                            title="Eliminar maestro"
                                            onClick={() => handleOpenDeleteModal(teacher)}
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
                                setPage(1);
                            }}
                        >
                            {PAGE_SIZE_OPTIONS.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        <span>registros</span>
                    </div>

                    <div className={styles.paginationInfo}>
                        Mostrando {teachers?.items.length} de {teachers?.totalItems || 0} registros
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
                        {Array.from({ length: teachers?.totalPages || 0 }, (_, i) => i + 1)
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
                        {page < (teachers?.totalPages || 0) - 2 && <span>...</span>}

                        {/* Última página */}
                        {page < (teachers?.totalPages || 0) - 1 && (teachers?.totalPages || 0) > 1 && (
                            <button className={styles.pageButton} onClick={() => setPage(teachers?.totalPages || 0)}>
                                {teachers?.totalPages || 0}
                            </button>
                        )}

                        <button
                            className={styles.pageButton}
                            onClick={() => setPage(Math.min(teachers?.totalPages || 0, page + 1))}
                            disabled={page >= (teachers?.totalPages || 0)}
                            aria-label="Siguiente"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Modal de confirmación para eliminar maestro */}
            <DeleteConfirmModal 
                isOpen={deleteModalOpen}
                title="Eliminar Maestro"
                message={`¿Estás seguro que deseas eliminar al maestro con DPI "${teacherToDelete}"? Esta acción no se puede deshacer.`}
                itemId={teacherToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                isLoading={deleteLoading}
            />
            
            {/* Notificaciones */}
            {deleteSuccess && (
                <div className={styles.notification}>
                    <div className={styles.successNotification}>
                        <strong>¡Éxito!</strong> Maestro eliminado correctamente.
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
