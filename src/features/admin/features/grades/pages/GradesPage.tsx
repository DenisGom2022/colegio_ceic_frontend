import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    FaSearch,
    FaEye,
    FaPencilAlt,
    FaTrash,
    FaPlus,
    FaGraduationCap,
    FaTh,
    FaFilter,
    FaSort,
    FaChartBar
} from "react-icons/fa";
import { useGradeTable } from "../hooks/useGradeTable";
import type { Grado } from "../services/gradoService";
import DeleteConfirmModal from "../../../../../components/DeleteConfirmModal";
import { deleteGrado } from "../services/gradoService";
import styles from "./GradesPage.module.css";

// Tipos para mejor tipado
interface GradeFilters {
    page: number;
    pageSize: number;
    searchQuery: string;
    activeSearchQuery: string;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    levelFilter: string;
    statusFilter: string;
}

interface GradeStatistics {
    total: number;
    active: number;
    inactive: number;
    byLevel: Record<string, number>;
}

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [6, 12, 24, 48] as const;

// Opciones de filtrado
const LEVEL_FILTER_OPTIONS = [
    { value: '', label: 'Todos los niveles' },
    { value: 'primaria', label: 'Primaria' },
    { value: 'secundaria', label: 'Secundaria' },
    { value: 'bachillerato', label: 'Bachillerato' }
] as const;

const STATUS_FILTER_OPTIONS = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' }
] as const;

// Opciones de ordenamiento
const SORT_OPTIONS = [
    { value: 'id', label: 'ID' },
    { value: 'nombre', label: 'Nombre' },
    { value: 'createdAt', label: 'Fecha de creación' },
    { value: 'nivelAcademico', label: 'Nivel académico' }
] as const;

// Funciones para persistir y recuperar los filtros en localStorage
const saveFiltersToStorage = (filters: any) => {
    localStorage.setItem('gradesFilters', JSON.stringify(filters));
};

const getFiltersFromStorage = () => {
    const savedFilters = localStorage.getItem('gradesFilters');
    if (savedFilters) {
        return JSON.parse(savedFilters);
    }
    return null;
};

const GradesPage: React.FC = () => {
    // === ESTADO Y CONFIGURACIÓN ===
    const savedFilters = getFiltersFromStorage();
    
    // Estados de filtros y paginación
    const [page, setPage] = useState(savedFilters?.page || 1);
    const [pageSize, setPageSize] = useState(savedFilters?.pageSize || PAGE_SIZE_OPTIONS[1]);
    const [searchQuery, setSearchQuery] = useState(savedFilters?.searchQuery || "");
    const [activeSearchQuery, setActiveSearchQuery] = useState(savedFilters?.activeSearchQuery || "");
    const [sortField, setSortField] = useState(savedFilters?.sortField || "id");
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(savedFilters?.sortDirection || "asc");
    const [levelFilter, setLevelFilter] = useState(savedFilters?.levelFilter || "");
    const [statusFilter, setStatusFilter] = useState(savedFilters?.statusFilter || "");
    const [showFilters, setShowFilters] = useState(false);
    
    // Estados de UI
    const [lastViewedGrade, setLastViewedGrade] = useState(localStorage.getItem('lastViewedGrade') || "");
    const [highlightedRow, setHighlightedRow] = useState("");
    
    // Estados del modal de eliminación
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [gradeToDelete, setGradeToDelete] = useState<number | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // === HOOK DE DATOS ===
    const {
        grades,
        loading,
        error,
        refetch: recargarDatos
    } = useGradeTable({
        page,
        limit: pageSize,
        searchTerm: activeSearchQuery,
        sortField,
        sortDirection
    });
    
    // === EFECTOS ===
    
    // Persistir filtros en localStorage
    useEffect(() => {
        const filters: GradeFilters = {
            page,
            pageSize,
            searchQuery,
            activeSearchQuery,
            sortField,
            sortDirection,
            levelFilter,
            statusFilter
        };
        saveFiltersToStorage(filters);
    }, [page, pageSize, searchQuery, activeSearchQuery, sortField, sortDirection, levelFilter, statusFilter]);

    // Calcular estadísticas de grados
    const gradeStatistics = useMemo((): GradeStatistics => {
        if (!grades?.grados) {
            return { total: 0, active: 0, inactive: 0, byLevel: {} };
        }

        const stats = grades.grados.reduce((acc, grade) => {
            const hasActiveCycle = grade.gradosCiclo?.some((gc: any) => 
                gc.ciclo && gc.ciclo.fechaFin === null
            );
            
            if (hasActiveCycle) acc.active++;
            else acc.inactive++;

            const level = grade.nivelAcademico?.descripcion || 'Sin nivel';
            acc.byLevel[level] = (acc.byLevel[level] || 0) + 1;

            return acc;
        }, { active: 0, inactive: 0, byLevel: {} as Record<string, number> });

        return {
            total: grades.total || grades.grados.length,
            ...stats
        };
    }, [grades]);

    // Filtrar grados aplicando filtros adicionales
    const filteredGrades = useMemo(() => {
        if (!grades?.grados) return [];

        return grades.grados.filter(grade => {
            // Filtro por nivel académico
            if (levelFilter) {
                const gradeLevel = grade.nivelAcademico?.descripcion?.toLowerCase() || '';
                if (!gradeLevel.includes(levelFilter.toLowerCase())) {
                    return false;
                }
            }

            // Filtro por estado
            if (statusFilter) {
                const hasActiveCycle = grade.gradosCiclo?.some((gc: any) => 
                    gc.ciclo && gc.ciclo.fechaFin === null
                );
                
                if (statusFilter === 'active' && !hasActiveCycle) return false;
                if (statusFilter === 'inactive' && hasActiveCycle) return false;
            }

            return true;
        });
    }, [grades?.grados, levelFilter, statusFilter]);
    
    // Resaltar grado recién consultado
    useEffect(() => {
        if (lastViewedGrade && grades?.grados && grades.grados.length > 0 && 
            grades.grados.some(g => g?.id.toString() === lastViewedGrade)) {
            setHighlightedRow(lastViewedGrade);
            
            const timer = setTimeout(() => {
                setHighlightedRow("");
                localStorage.removeItem('lastViewedGrade');
                setLastViewedGrade("");
            }, 900);
            
            return () => clearTimeout(timer);
        }
    }, [lastViewedGrade, grades]);
    
    // === FUNCIONES UTILITARIAS ===
    
    /**
     * Obtiene las iniciales para el avatar del grado
     */
    const getInitials = useCallback((grade: Grado): string => {
        if (!grade.nombre) return "NA";
        
        const words = grade.nombre.split(' ');
        if (words.length >= 2) {
            return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
        }
        return grade.nombre.charAt(0).toUpperCase();
    }, []);
    
    /**
     * Formatea una fecha a formato legible en español
     */
    const formatDate = useCallback((dateString: string | undefined): string => {
        if (!dateString) return "";
        
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }, []);

    /**
     * Obtiene el color del avatar basado en el nivel académico
     */
    const getAvatarColor = useCallback((grade: Grado): string => {
        const nivel = grade.nivelAcademico?.descripcion?.toLowerCase();
        if (nivel?.includes('primaria')) return 'primary';
        if (nivel?.includes('secundaria')) return 'secondary';
        if (nivel?.includes('bachillerato')) return 'tertiary';
        return 'default';
    }, []);

    /**
     * Obtiene el estado de un grado (activo/inactivo)
     */
    const getGradeStatus = useCallback((grade: Grado): 'active' | 'inactive' => {
        const hasActiveCycle = grade.gradosCiclo?.some((gc: any) => 
            gc.ciclo && gc.ciclo.fechaFin === null
        );
        return hasActiveCycle ? 'active' : 'inactive';
    }, []);

    /**
     * Limpia todos los filtros aplicados
     */
    const clearAllFilters = useCallback((): void => {
        setActiveSearchQuery("");
        setSearchQuery("");
        setLevelFilter("");
        setStatusFilter("");
        setSortField("id");
        setSortDirection("asc");
        setPage(1);
    }, []);

    /**
     * Aplica ordenamiento a los grados
     */
    const handleSort = useCallback((field: string): void => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setPage(1);
    }, [sortField]);
    
    // === MANEJADORES DE EVENTOS ===
    
    /**
     * Maneja la búsqueda de grados
     */
    const handleSearch = (e: React.FormEvent): void => {
        e.preventDefault();
        setActiveSearchQuery(searchQuery);
        setPage(1);
    };
    
    /**
     * Limpia la búsqueda activa
     */
    const clearSearch = (): void => {
        setActiveSearchQuery("");
        setSearchQuery("");
        setPage(1);
    };
    
    /**
     * Maneja el cambio en el input de búsqueda
     */
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(e.target.value);
        if (e.target.value === "" && activeSearchQuery !== "") {
            setActiveSearchQuery("");
            setPage(1);
        }
    };
    
    // === MANEJADORES DEL MODAL DE ELIMINACIÓN ===
    
    /**
     * Abre el modal de confirmación de eliminación
     */
    const handleOpenDeleteModal = (grade: Grado): void => {
        setGradeToDelete(grade.id);
        setDeleteModalOpen(true);
    };
    
    /**
     * Cierra el modal de confirmación de eliminación
     */
    const handleCloseDeleteModal = (): void => {
        setDeleteModalOpen(false);
        setGradeToDelete(null);
    };
    
    /**
     * Confirma y ejecuta la eliminación del grado
     */
    const handleConfirmDelete = async (id: string): Promise<void> => {
        setDeleteLoading(true);
        try {
            await deleteGrado(parseInt(id));
            setDeleteSuccess(true);
            setDeleteModalOpen(false);
            
            // Limpiar notificación después de 3 segundos
            setTimeout(() => {
                setDeleteSuccess(false);
            }, 3000);
            
            // Recargar datos
            recargarDatos();
        } catch (error: any) {
            setDeleteError(error.message || "Error al eliminar el grado");
        } finally {
            setDeleteLoading(false);
        }
    };

    // === RENDERIZADO DE TARJETAS ===
    
    /**
     * Renderiza una tarjeta individual de grado con diseño profesional
     */
    const renderGradeCard = useCallback((grade: Grado): React.ReactElement => {
        const activeCycle = grade.gradosCiclo?.find((gc: any) => 
            gc.ciclo && gc.ciclo.fechaFin === null
        );
        const status = getGradeStatus(grade);
        const initials = getInitials(grade);

        return (
            <div 
                key={grade.id} 
                className={`${styles.gradeCard} ${styles[status]} ${
                    highlightedRow === grade.id.toString() ? styles.highlighted : ''
                }`}
            >
                {/* Avatar con iniciales profesional */}
                <div className={styles.cardAvatar}>
                    <div className={`${styles.avatarCircle} ${styles[getAvatarColor(grade)]}`}>
                        <span className={styles.avatarInitials}>{initials}</span>
                    </div>
                    <div className={styles.avatarIcon}>
                        <FaGraduationCap />
                    </div>
                </div>

                {/* Badge de estado profesional */}
                <div className={styles.cardBadge}>
                    <span className={`${styles.statusBadge} ${styles[status]}`}>
                        {status === 'active' ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                </div>

                {/* Contenido principal mejorado */}
                <div className={styles.cardContent}>
                    <div className={styles.cardMeta}>
                        <span className={styles.cardId}>#{grade.id}</span>
                        <span className={styles.cardLevel}>
                            {grade.nivelAcademico?.descripcion || 'Nivel no definido'}
                        </span>
                    </div>
                    
                    <h3 className={styles.cardTitle}>
                        {grade.nombre || 'Grado sin nombre'}
                    </h3>
                    
                    <div className={styles.cardDetails}>
                        {activeCycle ? (
                            <>
                                <div className={styles.cardDetailItem}>
                                    <span className={styles.detailLabel}>Ciclo:</span>
                                    <span className={styles.detailValue}>
                                        {activeCycle.ciclo?.descripcion || `Ciclo ${activeCycle.idCiclo}`}
                                    </span>
                                </div>
                                <div className={styles.cardDetailItem}>
                                    <span className={styles.detailLabel}>Precio:</span>
                                    <span className={styles.detailValue}>
                                        Q{activeCycle.precioPago} ({activeCycle.cantidadPagos} pagos)
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.cardDetailItem}>
                                    <span className={styles.detailLabel}>Jornada:</span>
                                    <span className={styles.detailValue}>
                                        {grade.jornada?.descripcion || 'No definida'}
                                    </span>
                                </div>
                                <div className={styles.cardDetailItem}>
                                    <span className={styles.detailLabel}>Creado:</span>
                                    <span className={styles.detailValue}>
                                        {formatDate(grade.createdAt)}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Acciones profesionales */}
                <div className={styles.cardActions}>
                    <div className={styles.actionGroup}>
                        <Link
                            to={`/admin/grado/${grade.id}`}
                            className={`${styles.actionButton} ${styles.view}`}
                            title="Ver detalles completos"
                            onClick={() => localStorage.setItem('lastViewedGrade', grade.id.toString())}
                        >
                            <FaEye />
                            <span>Ver</span>
                        </Link>
                        <Link
                            to={`/admin/editar-grado/${grade.id}`}
                            className={`${styles.actionButton} ${styles.edit}`}
                            title="Editar información del grado"
                        >
                            <FaPencilAlt />
                            <span>Editar</span>
                        </Link>
                        <button 
                            className={`${styles.actionButton} ${styles.delete}`} 
                            title="Eliminar grado permanentemente"
                            onClick={() => handleOpenDeleteModal(grade)}
                        >
                            <FaTrash />
                            <span>Eliminar</span>
                        </button>
                    </div>
                </div>

                {/* Indicador de última visualización */}
                {highlightedRow === grade.id.toString() && (
                    <div className={styles.recentlyViewed}>
                        <span>Recientemente consultado</span>
                    </div>
                )}
            </div>
        );
    }, [highlightedRow, getGradeStatus, getInitials, getAvatarColor, formatDate, handleOpenDeleteModal]);
    
    // === COMPONENTES DE RENDERIZADO ===
    
    /**
     * Renderiza el estado de carga
     */
    const renderLoadingState = (): React.ReactElement => (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <div className={styles.loadingText}>Cargando grados...</div>
        </div>
    );

    /**
     * Renderiza el estado de error
     */
    const renderErrorState = (): React.ReactElement => (
        <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <div className={styles.errorMessage}>Error: {error}</div>
            <button 
                className={styles.reloadButton} 
                onClick={() => window.location.reload()}
            >
                Reintentar
            </button>
        </div>
    );

    /**
     * Renderiza el encabezado principal de la página con estadísticas
     */
    const renderPageHeader = (): React.ReactElement => (
        <div className={styles.pageHeader}>
            <div className={styles.headerContent}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>
                        <FaGraduationCap className={styles.titleIcon} />
                        Gestión de Grados Académicos
                    </h1>
                    <p className={styles.pageSubtitle}>
                        Sistema integral para la administración y organización de grados académicos
                    </p>
                </div>
                <div className={styles.statsSection}>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{gradeStatistics.total}</div>
                        <div className={styles.statLabel}>Total</div>
                        <div className={styles.statIcon}>
                            <FaChartBar />
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{gradeStatistics.active}</div>
                        <div className={styles.statLabel}>Activos</div>
                        <div className={styles.statIcon}>
                            <FaGraduationCap />
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{gradeStatistics.inactive}</div>
                        <div className={styles.statLabel}>Inactivos</div>
                        <div className={styles.statIcon}>
                            <FaTh />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.headerActions}>
                <button 
                    className={styles.filterToggle}
                    onClick={() => setShowFilters(!showFilters)}
                    title="Mostrar/Ocultar filtros avanzados"
                >
                    <FaFilter />
                    Filtros
                </button>
                <Link to="/admin/crear-grado" className={styles.createButton}>
                    <FaPlus className={styles.buttonIcon} />
                    Nuevo Grado
                </Link>
            </div>
        </div>
    );

    /**
     * Renderiza la barra de herramientas y filtros
     */
    const renderToolbar = (): React.ReactElement => (
        <div className={styles.toolbarSection}>
            <div className={styles.searchSection}>
                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <div className={styles.searchInputGroup}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Buscar por nombre, nivel académico o jornada..."
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className={styles.clearButton}
                                onClick={clearSearch}
                                title="Limpiar búsqueda"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        className={styles.searchButton}
                        disabled={!searchQuery.trim()}
                    >
                        Buscar
                    </button>
                </form>
            </div>
            
            {showFilters && (
                <div className={styles.filtersSection}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Nivel Académico</label>
                        <select
                            className={styles.filterSelect}
                            value={levelFilter}
                            onChange={(e) => {
                                setLevelFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            {LEVEL_FILTER_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Estado</label>
                        <select
                            className={styles.filterSelect}
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            {STATUS_FILTER_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Ordenar por</label>
                        <div className={styles.sortControls}>
                            <select
                                className={styles.filterSelect}
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value)}
                            >
                                {SORT_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                className={styles.sortDirection}
                                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                                title={`Ordenar ${sortDirection === 'asc' ? 'descendente' : 'ascendente'}`}
                            >
                                <FaSort />
                                {sortDirection === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.filterActions}>
                        <button 
                            className={styles.clearFiltersButton}
                            onClick={clearAllFilters}
                            title="Limpiar todos los filtros"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
            )}
            
            <div className={styles.controlsSection}>
                <div className={styles.resultInfo}>
                    <span className={styles.resultCount}>
                        {filteredGrades.length} de {gradeStatistics.total} grados
                    </span>
                    {(levelFilter || statusFilter || activeSearchQuery) && (
                        <span className={styles.filterIndicator}>
                            (Filtros aplicados)
                        </span>
                    )}
                </div>
                <div className={styles.viewOptions}>
                    <FaTh className={styles.viewIcon} />
                    <span>Vista de tarjetas</span>
                </div>
            </div>
        </div>
    );

    /**
     * Renderiza la paginación
     */
    const renderPagination = (): React.ReactElement => {
        const totalPages = grades?.totalPages || 0;
        
        return (
            <div className={styles.paginationSection}>
                <div className={styles.paginationInfo}>
                    <span>Mostrar</span>
                    <select
                        className={styles.pageSizeSelect}
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
                    <span>por página</span>
                </div>

                {totalPages > 1 && (
                    <div className={styles.paginationControls}>
                        <button
                            className={`${styles.pageButton} ${page === 1 ? styles.disabled : ''}`}
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                        >
                            Anterior
                        </button>
                        
                        <div className={styles.pageNumbers}>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (page <= 3) {
                                    pageNum = i + 1;
                                } else if (page >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }
                                
                                return (
                                    <button
                                        key={pageNum}
                                        className={`${styles.pageNumber} ${page === pageNum ? styles.active : ''}`}
                                        onClick={() => setPage(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <button
                            className={`${styles.pageButton} ${page >= totalPages ? styles.disabled : ''}`}
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page >= totalPages}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        );
    };

    /**
     * Renderiza las notificaciones del sistema
     */
    const renderNotifications = (): React.ReactElement | null => {
        if (!deleteSuccess && !deleteError) return null;

        return (
            <div className={styles.notificationContainer}>
                {deleteSuccess && (
                    <div className={styles.successNotification}>
                        <div className={styles.notificationIcon}>✓</div>
                        <div className={styles.notificationContent}>
                            <strong>¡Éxito!</strong>
                            <span>Grado eliminado correctamente.</span>
                        </div>
                    </div>
                )}
                
                {deleteError && (
                    <div className={styles.errorNotification}>
                        <div className={styles.notificationIcon}>⚠</div>
                        <div className={styles.notificationContent}>
                            <strong>Error:</strong>
                            <span>{deleteError}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // === ESTADOS CONDICIONALES ===
    
    if (loading) return renderLoadingState();
    if (error) return renderErrorState();

    // === RENDERIZADO PRINCIPAL ===
    
    return (
        <div className={styles.pageContainer}>
            {renderPageHeader()}
            {renderToolbar()}

            {activeSearchQuery && (
                <div className={styles.activeSearchBanner}>
                    <span>Resultados para: "{activeSearchQuery}"</span>
                    <button onClick={clearSearch} className={styles.clearSearchBtn}>
                        Limpiar búsqueda
                    </button>
                </div>
            )}

            <main className={styles.mainContent}>
                {!filteredGrades || filteredGrades.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            {activeSearchQuery || levelFilter || statusFilter ? '🔍' : '📚'}
                        </div>
                        <h3 className={styles.emptyTitle}>
                            {activeSearchQuery || levelFilter || statusFilter 
                                ? 'No se encontraron grados' 
                                : 'No hay grados registrados'
                            }
                        </h3>
                        <p className={styles.emptySubtitle}>
                            {activeSearchQuery || levelFilter || statusFilter
                                ? "Intenta ajustar los filtros o criterios de búsqueda" 
                                : "Comienza creando tu primer grado académico"
                            }
                        </p>
                        {!activeSearchQuery && !levelFilter && !statusFilter ? (
                            <Link to="/admin/crear-grado" className={styles.emptyAction}>
                                <FaPlus />
                                Crear primer grado
                            </Link>
                        ) : (
                            <button onClick={clearAllFilters} className={styles.emptyAction}>
                                <FaFilter />
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className={styles.gradesGrid}>
                            {filteredGrades.map((grade: Grado) => renderGradeCard(grade))}
                        </div>
                        {renderPagination()}
                    </>
                )}
            </main>

            {/* Modal de confirmación para eliminar grado */}
            <DeleteConfirmModal 
                isOpen={deleteModalOpen}
                title="Eliminar Grado"
                message={`¿Estás seguro que deseas eliminar el grado "${gradeToDelete}"? Esta acción no se puede deshacer.`}
                itemId={gradeToDelete?.toString() || ""}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                isLoading={deleteLoading}
            />
            
            {/* Sistema de notificaciones */}
            {renderNotifications()}
        </div>
    );
};

export default GradesPage;
