import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaSearch,
    FaEye,
    FaPencilAlt,
    FaTrash,
    FaPlus,
    FaBook,
    FaGraduationCap,
    FaChartLine,
    FaExclamationTriangle,
    FaRedo
} from "react-icons/fa";
import { useCourses } from "../hooks";
import { deleteCourse } from "../services";
import type { Course } from "../models";
import DeleteConfirmModal from "../../../../../components/DeleteConfirmModal";
import styles from "../../users/pages/UsersPage.module.css";

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100];

// Funciones para persistir y recuperar los filtros en localStorage
const saveFiltersToStorage = (filters: any) => {
    localStorage.setItem('coursesFilters', JSON.stringify(filters));
};

const getFiltersFromStorage = () => {
    const savedFilters = localStorage.getItem('coursesFilters');
    if (savedFilters) {
        return JSON.parse(savedFilters);
    }
    return null;
};

const CoursesPage = () => {
    const { courses, loading, error, refreshCourses } = useCourses();
    
    // Recuperar filtros guardados o usar valores por defecto
    const savedFilters = getFiltersFromStorage();
    
    // Estados para filtrado y paginación
    const [page, setPage] = useState(savedFilters?.page || 1);
    const [pageSize, setPageSize] = useState(savedFilters?.pageSize || PAGE_SIZE_OPTIONS[1]); // 10 por defecto
    const [searchQuery, setSearchQuery] = useState(savedFilters?.searchQuery || "");
    const [activeSearchQuery, setActiveSearchQuery] = useState(savedFilters?.activeSearchQuery || "");
    const [lastViewedCourse, setLastViewedCourse] = useState(localStorage.getItem('lastViewedCourse') || "");
    const [highlightedRow, setHighlightedRow] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Guardar filtros cuando cambien
    useEffect(() => {
        const filters = {
            page,
            pageSize,
            searchQuery,
            activeSearchQuery
        };
        saveFiltersToStorage(filters);
    }, [page, pageSize, searchQuery, activeSearchQuery]);
    
    // Efecto para resaltar la fila del curso recién consultado
    useEffect(() => {
        if (lastViewedCourse && courses && courses.length > 0 && 
            courses.some(c => c && c.id.toString() === lastViewedCourse)) {
            setHighlightedRow(lastViewedCourse);
            
            const timer = setTimeout(() => {
                setHighlightedRow("");
                localStorage.removeItem('lastViewedCourse');
                setLastViewedCourse("");
            }, 900);
            
            return () => clearTimeout(timer);
        }
    }, [lastViewedCourse, courses]);

    // Función para formatear nombres completos
    const getFullName = (usuario: any) => {
        const nombres = [
            usuario.primerNombre,
            usuario.segundoNombre,
            usuario.tercerNombre
        ].filter(Boolean).join(' ');
        
        const apellidos = [
            usuario.primerApellido,
            usuario.segundoApellido
        ].filter(Boolean).join(' ');
        
        return `${nombres} ${apellidos}`.trim();
    };

    // Función para determinar si un ciclo está activo
    const isCycleActive = (course: Course) => {
        return course.gradoCiclo.ciclo.fechaFin === null;
    };

    // Filtrar cursos
    const filteredCourses = useMemo(() => {
        let filtered = courses;

        // Aplicar filtro de búsqueda
        if (activeSearchQuery) {
            const query = activeSearchQuery.toLowerCase();
            filtered = courses.filter((course) => {
                const teacherName = getFullName(course.catedratico.usuario).toLowerCase();
                const courseName = course.nombre.toLowerCase();
                const cycleName = course.gradoCiclo.ciclo.descripcion.toLowerCase();
                const teacherDpi = course.catedratico.dpi.toLowerCase();
                
                return (
                    courseName.includes(query) ||
                    teacherName.includes(query) ||
                    cycleName.includes(query) ||
                    teacherDpi.includes(query)
                );
            });
        }

        return filtered;
    }, [courses, activeSearchQuery]);

    // Paginación
    const totalItems = filteredCourses.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    // Funciones de manejo
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveSearchQuery(searchQuery);
        setPage(1);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setActiveSearchQuery("");
        setPage(1);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    };

    // Funciones para manejar el modal de eliminación
    const handleOpenDeleteModal = (course: Course) => {
        setCourseToDelete(course.id.toString());
        setDeleteModalOpen(true);
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setCourseToDelete("");
    };
    
    const handleConfirmDelete = async (id: string) => {
        setDeleteLoading(true);
        try {
            // Eliminar curso usando el endpoint /curso
            await deleteCourse(id);
            setDeleteSuccess(true);
            setDeleteModalOpen(false);
            setTimeout(() => {
                setDeleteSuccess(false);
            }, 3000);
            refreshCourses();
        } catch (error: any) {
            setDeleteError(error.message || "Error al eliminar el curso");
            setDeleteModalOpen(false);
            setTimeout(() => {
                setDeleteError(null);
            }, 5000);
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <div>Cargando cursos...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.errorState}>
                    <FaExclamationTriangle className={styles.errorIcon} />
                    <div className={styles.errorTitle}>Error al cargar los cursos</div>
                    <div className={styles.errorDescription}>{error}</div>
                    <button onClick={refreshCourses} className={styles.retryButton}>
                        <FaRedo style={{ marginRight: '8px' }} />
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Encabezado con botón de crear curso */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <FaBook size={24} />
                    Listado de Cursos
                    <span className={styles.badgeCount}>{totalItems}</span>
                </div>

                <Link to="/admin/crear-curso" className={styles.createButton}>
                    <FaPlus size={14} />
                    Nuevo curso
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
                                placeholder="Buscar por nombre, catedrático, DPI o ciclo..."
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
                        onClick={handleClearSearch}
                        title="Limpiar búsqueda"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Tabla de cursos */}
            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                {paginatedCourses.length > 0 ? (
                    <>
                        <table className={styles.table}>
                            <thead>
                                <tr className={styles.tableHeader}>
                                    <th>
                                        ID
                                    </th>
                                    <th>
                                        Nombre del curso
                                    </th>
                                    <th>
                                        Grado y ciclo
                                    </th>
                                    <th>
                                        Catedrático
                                    </th>
                                    <th>
                                        Calificaciones
                                    </th>
                                    <th>
                                        Estado
                                    </th>
                                    <th>
                                        Fecha creación
                                    </th>
                                    <th className={styles.actionCell}>
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {paginatedCourses.map((course) => (
                                    <tr key={course.id} className={`${styles.userRow} ${highlightedRow === course.id.toString() ? styles.highlightedRow : ''}`}>
                                        <td className={styles.tableCell}>
                                            {course.id}
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className={styles.courseName}>
                                                {course.nombre}
                                            </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className={styles.gradeInfo}>
                                                <div className={styles.gradeName}>
                                                    Grado ID: {course.gradoCiclo.idGrado}
                                                </div>
                                                <div className={styles.cycleInfo}>
                                                    {course.gradoCiclo.ciclo.descripcion}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className={styles.teacherInfo}>
                                                <div className={styles.teacherName}>
                                                    {getFullName(course.catedratico.usuario)}
                                                </div>
                                                <div className={styles.teacherDpi}>
                                                    DPI: {course.catedratico.dpi}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className={styles.scoreInfo}>
                                                <div className={styles.maxScore}>
                                                    Máxima: {course.notaMaxima}
                                                </div>
                                                <div className={styles.passingScore}>
                                                    Aprobación: {course.notaAprobada}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <span className={`${styles.statusBadge} ${
                                                isCycleActive(course) ? styles.active : styles.finished
                                            }`}>
                                                {isCycleActive(course) ? (
                                                    <>
                                                        <FaChartLine size={12} />
                                                        Activo
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaGraduationCap size={12} />
                                                        Finalizado
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className={styles.dateCell}>
                                            {formatDate(course.createdAt)}
                                        </td>
                                        <td className={styles.actionCell}>
                                            <Link
                                                to={`/admin/cursos/${course.id}?return=courses`}
                                                className={`${styles.actionButton} ${styles.view}`}
                                                title="Ver detalles"
                                                onClick={() => localStorage.setItem('lastViewedCourse', course.id.toString())}
                                            >
                                                <FaEye size={16} />
                                            </Link>
                                            <Link
                                                to={`/admin/editar-curso/${course.id}`}
                                                className={`${styles.actionButton} ${styles.edit}`}
                                                title="Editar curso"
                                            >
                                                <FaPencilAlt size={15} />
                                            </Link>
                                            <button
                                                className={`${styles.actionButton} ${styles.delete}`}
                                                title="Eliminar curso"
                                                onClick={() => handleOpenDeleteModal(course)}
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Footer con paginación */}
                        <div className={styles.footerSection}>
                            <div className={styles.rowsPerPage}>
                                <span>Mostrar</span>
                                <select
                                    className={styles.selectPageSize}
                                    value={pageSize}
                                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                >
                                    {PAGE_SIZE_OPTIONS.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                                <span>registros</span>
                            </div>

                            <div className={styles.paginationInfo}>
                                Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} registros
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
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🔍</div>
                        <div className={styles.emptyMessage}>
                            {activeSearchQuery ? 'No se encontraron cursos' : 'No hay cursos registrados'}
                        </div>
                        <div className={styles.emptyDescription}>
                            {activeSearchQuery
                                ? `No se encontraron cursos que coincidan con "${activeSearchQuery}"`
                                : 'Comienza creando tu primer curso en el sistema'
                            }
                        </div>
                        {!activeSearchQuery && (
                            <Link to="/admin/crear-curso" className={styles.createButton}>
                                <FaPlus size={14} />
                                <span>Crear primer curso</span>
                            </Link>
                        )}
                    </div>
                )}
                </div>
            </div>
            
            {/* Modal de confirmación para eliminar curso */}
            <DeleteConfirmModal 
                isOpen={deleteModalOpen}
                title="Eliminar Curso"
                message={`¿Estás seguro que deseas eliminar el curso con ID "${courseToDelete}"? Esta acción no se puede deshacer.`}
                itemId={courseToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                isLoading={deleteLoading}
            />
            
            {/* Notificaciones */}
            {deleteSuccess && (
                <div className={styles.notification}>
                    <div className={styles.successNotification}>
                        <strong>¡Éxito!</strong> Curso eliminado correctamente.
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
                        <button 
                            onClick={() => setDeleteError(null)} 
                            className={styles.closeNotification}
                            aria-label="Cerrar notificación"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
