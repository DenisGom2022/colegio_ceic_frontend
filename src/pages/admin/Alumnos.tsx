import { useState, useEffect } from "react";
import { useTablaAlumno } from "../../hooks/useTablaAlumno";
import styles from "./Alumnos.module.css";
import { Link } from "react-router-dom";
import {
    FaSearch,
    FaEye,
    FaPencilAlt,
    FaTrash,
    FaPlus,
    FaGraduationCap,
    FaMale,
    FaFemale
} from "react-icons/fa";
import type { Alumno } from "../../hooks/useTablaAlumno";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { deleteAlumno } from "../../services/alumnoService";

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100];

// Funciones para persistir y recuperar los filtros en localStorage
const saveFiltersToStorage = (filters:any) => {
    localStorage.setItem('alumnosFilters', JSON.stringify(filters));
};

const getFiltersFromStorage = () => {
    const savedFilters = localStorage.getItem('alumnosFilters');
    if (savedFilters) {
        return JSON.parse(savedFilters);
    }
    return null;
};

const Alumnos = () => {
    // Recuperar filtros guardados o usar valores por defecto
    const savedFilters = getFiltersFromStorage();
    
    const [page, setPage] = useState(savedFilters?.page || 1);
    const [pageSize, setPageSize] = useState(savedFilters?.pageSize || PAGE_SIZE_OPTIONS[0]);
    const [searchQuery, setSearchQuery] = useState(savedFilters?.searchQuery || "");
    const [activeSearchQuery, setActiveSearchQuery] = useState(savedFilters?.activeSearchQuery || "");
    const [sortField, setSortField] = useState(savedFilters?.sortField || "primerNombre");
    const [sortDirection, setSortDirection] = useState(savedFilters?.sortDirection || "asc");
    const [lastViewedAlumno, setLastViewedAlumno] = useState(localStorage.getItem('lastViewedAlumno') || "");
    const [highlightedRow, setHighlightedRow] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [alumnoToDelete, setAlumnoToDelete] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Usar el hook con todos los parámetros, incluido ordenamiento
    const { alumnos, loading, error, total, totalPages, recargarDatos } = useTablaAlumno(
        page, 
        pageSize, 
        activeSearchQuery, 
        sortField, 
        sortDirection
    );
    
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
    
    // Efecto para resaltar la fila del alumno recién consultado
    useEffect(() => {
        // Si hay un alumno que se acaba de ver y tenemos datos de alumnos
        if (lastViewedAlumno && alumnos && alumnos.length > 0 && 
            alumnos.some(a => a && a.cui === lastViewedAlumno)) {
            // Resaltar ese alumno
            setHighlightedRow(lastViewedAlumno);
            
            // Quitar el resaltado después de 0.9 segundos
            const timer = setTimeout(() => {
                setHighlightedRow("");
                // Limpiar el localStorage
                localStorage.removeItem('lastViewedAlumno');
                setLastViewedAlumno("");
            }, 900);
            
            return () => clearTimeout(timer);
        }
    }, [lastViewedAlumno, alumnos]);

    // Obtener las iniciales para el avatar
    const getInitials = (alumno: Alumno) => {
        const firstName = alumno.primerNombre?.charAt(0) || "?";
        const lastName = alumno.primerApellido?.charAt(0) || "?";
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
    const handleOpenDeleteModal = (alumno: Alumno) => {
        setAlumnoToDelete(alumno.cui);
        setDeleteModalOpen(true);
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setAlumnoToDelete("");
    };
    
    const handleConfirmDelete = async (cui: string) => {
        setDeleteLoading(true);
        try {
            await deleteAlumno(cui);
            setDeleteSuccess(true);
            setDeleteModalOpen(false);
            // Mostrar notificación temporal de éxito
            setTimeout(() => {
                setDeleteSuccess(false);
            }, 3000);
            // Usar la función recargarDatos para actualizar la tabla
            recargarDatos();
        } catch (error: any) {
            setDeleteError(error.message || "Error al eliminar el alumno");
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

    // Ya no necesitamos ordenar los alumnos en el frontend
    // ya que el backend está manejando el ordenamiento

    // Función para obtener el nombre completo
    const getNombreCompleto = (alumno: Alumno): string => {
        return `${alumno.primerNombre || ''} ${alumno.segundoNombre || ''} ${alumno.tercerNombre || ''} ${alumno.primerApellido || ''} ${alumno.segundoApellido || ''}`.trim().replace(/\s+/g, ' ');
    };

    // Obtener badge class según el género
    const getGenderBadgeClass = (genero: string): string => {
        return genero.toUpperCase() === 'M' ? styles.badgeMale : styles.badgeFemale;
    };

    if (loading) {
        return <div className={styles.loadingContainer}>Cargando alumnos...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>Error: {error}</div>;
    }

    return (
        <div className={styles.pageContainer}>
            
            {/* Encabezado con botón de crear alumno */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <FaGraduationCap size={24} />
                    Listado de Alumnos
                    <span className={styles.badgeCount}>{ total }</span>
                </div>

                <Link to="/admin/crear-alumno" className={styles.createButton}>
                    <FaPlus size={14} />
                    Crear Alumno
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
                                placeholder="Buscar por nombre, apellido o CUI"
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

            {/* Tabla de alumnos */}
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeader}>
                            <th onClick={() => handleSortChange("primerNombre")} style={{ cursor: "pointer" }}>
                                Nombre Completo
                            </th>
                            <th onClick={() => handleSortChange("cui")} style={{ cursor: "pointer" }}>
                                CUI
                            </th>
                            <th>Género</th>
                            <th>Teléfono</th>
                            <th>Responsables</th>
                            <th>Fecha de Registro</th>
                            <th className={styles.actionCell}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody className={styles.tableBody}>
                        {alumnos.length === 0 ? (
                            <tr>
                                <td colSpan={7} className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>🔍</div>
                                    <div className={styles.emptyMessage}>No se encontraron alumnos que coincidan con tu búsqueda</div>
                                </td>
                            </tr>
                        ) : (
                            alumnos.map((alumno: Alumno) => (
                                <tr 
                                    key={alumno.cui} 
                                    className={`${styles.userRow} ${highlightedRow === alumno.cui ? styles.highlightedRow : ''}`}
                                >
                                    <td>
                                        <div className={styles.nameCell}>
                                            <div className={styles.avatar}>
                                                {getInitials(alumno)}
                                            </div>
                                            <div>
                                                <div className={styles.userName}>{getNombreCompleto(alumno)}</div>
                                                <div className={styles.userEmail}>{alumno.telefono || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{alumno.cui}</td>
                                    <td>
                                        <span className={`${styles.badge} ${getGenderBadgeClass(alumno.genero)}`}>
                                            {alumno.genero === 'M' ? (
                                                <>
                                                    <FaMale size={12} style={{marginRight: '4px'}} />
                                                    Masculino
                                                </>
                                            ) : (
                                                <>
                                                    <FaFemale size={12} style={{marginRight: '4px'}} />
                                                    Femenino
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td>{alumno.telefono || 'N/A'}</td>
                                    <td>{alumno.responsables?.length || 0}</td>
                                    <td className={styles.dateCell}>
                                        {formatDate(alumno.createdAt)}
                                    </td>
                                    <td className={styles.actionCell}>
                                        <Link
                                            to={`/admin/alumno/${alumno.cui}`}
                                            className={`${styles.actionButton} ${styles.view}`}
                                            title="Ver detalles"
                                            onClick={() => localStorage.setItem('lastViewedAlumno', alumno.cui)}
                                        >
                                            <FaEye size={16} />
                                        </Link>
                                        <Link
                                            to={`/admin/editar-alumno/${alumno.cui}`}
                                            className={`${styles.actionButton} ${styles.edit}`}
                                            title="Editar alumno"
                                        >
                                            <FaPencilAlt size={15} />
                                        </Link>
                                        <button 
                                            className={`${styles.actionButton} ${styles.delete}`} 
                                            title="Eliminar alumno"
                                            onClick={() => handleOpenDeleteModal(alumno)}
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
                        Mostrando {alumnos.length} de {total} registros
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
            
            {/* Modal de confirmación para eliminar alumno */}
            <DeleteConfirmModal 
                isOpen={deleteModalOpen}
                title="Eliminar Alumno"
                message={`¿Estás seguro que deseas eliminar al alumno con CUI "${alumnoToDelete}"? Esta acción no se puede deshacer.`}
                itemId={alumnoToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                isLoading={deleteLoading}
            />
            
            {/* Notificaciones */}
            {deleteSuccess && (
                <div className={styles.notification}>
                    <div className={styles.successNotification}>
                        <strong>¡Éxito!</strong> Alumno eliminado correctamente.
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

export default Alumnos;
