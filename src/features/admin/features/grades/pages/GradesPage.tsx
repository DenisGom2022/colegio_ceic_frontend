import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaSearch,
    FaEye,
    FaPencilAlt,
    FaTrash,
    FaPlus,
    FaGraduationCap,
    FaFilter,
    FaLayerGroup,
    FaCheck,
    FaExclamationTriangle,
    FaUserGraduate,
    FaMoneyBillAlt
} from "react-icons/fa";
import { useGradeTable } from "../hooks/useGradeTable";
import DeleteConfirmModal from "../../../../../components/DeleteConfirmModal";
import { deleteGrado } from "../services/gradoService";
import styles from "./GradesPage.module.css";

// Interfaces para los datos del backend
interface Ciclo {
    id: number;
    descripcion: string;
    createdAt: string;
    fechaFin: string | null;
    updatedAt: string;
    deletedAt: null;
}

interface GradoCiclo {
    id: number;
    idGrado: number;
    idCiclo: number;
    precioPago: string;
    cantidadPagos: number;
    precioInscripcion: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    ciclo: Ciclo;
}

interface NivelAcademico {
    id: number;
    descripcion: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
}

interface Jornada {
    id: number;
    descripcion: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
}

interface Grado {
    id: number;
    nombre: string;
    idNivel: number;
    idJornada: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    nivelAcademico: NivelAcademico;
    jornada: Jornada;
    gradosCiclo: GradoCiclo[];
}

// Interface para estadísticas de grados
interface GradeStatistics {
    total: number;
    byLevel: Record<string, number>;
    byJornada: Record<string, number>;
    withCiclos: number;
    withoutCiclos: number;
}

const GradesPage: React.FC = () => {
    // Estados
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSearchTerm, setActiveSearchTerm] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [gradeToDelete, setGradeToDelete] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [stats, setStats] = useState<GradeStatistics>({
        total: 0,
        byLevel: {},
        byJornada: {},
        withCiclos: 0,
        withoutCiclos: 0
    });

    // Obtener datos con el hook useGradeTable
    const {
        grades,
        loading,
        error,
        refetch
    } = useGradeTable({
        page,
        limit: pageSize,
        searchTerm: activeSearchTerm,
        sortField: sortField || undefined,
        sortDirection: sortDirection || undefined
    });

    // Calcular estadísticas cuando se cargan los grados
    useEffect(() => {
        if (!loading && !error && grades && grades.grados && grades.grados.length > 0) {
            const items = grades.grados;
            
            const byLevel: Record<string, number> = {};
            const byJornada: Record<string, number> = {};
            let withCiclos = 0;
            let withoutCiclos = 0;
            
            // Calcular estadísticas
            items.forEach((grade: any) => {
                // Contar por nivel académico
                const nivelDesc = grade.nivelAcademico?.descripcion || 'Sin nivel';
                byLevel[nivelDesc] = (byLevel[nivelDesc] || 0) + 1;
                
                // Contar por jornada
                const jornadaDesc = grade.jornada?.descripcion || 'Sin jornada';
                byJornada[jornadaDesc] = (byJornada[jornadaDesc] || 0) + 1;
                
                // Contar grados con o sin ciclos
                if (grade.gradosCiclo && grade.gradosCiclo.length > 0) {
                    withCiclos++;
                } else {
                    withoutCiclos++;
                }
            });
            
            const statsData: GradeStatistics = {
                total: grades.total || 0,
                byLevel,
                byJornada,
                withCiclos,
                withoutCiclos
            };
            
            setStats(statsData);
        }
    }, [grades, loading, error]);

    // Manejar búsqueda
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveSearchTerm(searchQuery);
        setPage(1);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setActiveSearchTerm("");
        setPage(1);
    };

    // Manejar cambios en ordenación
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
        setPage(1);
    };

    // Mostrar modal de confirmación para eliminar
    const handleDeleteClick = (id: number) => {
        setGradeToDelete(id);
        setDeleteModalOpen(true);
    };

    // Cerrar modal de confirmación
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setGradeToDelete(null);
    };

    // Confirmar eliminación de grado
    const handleConfirmDelete = async () => {
        if (gradeToDelete === null) return;
        
        setDeleteLoading(true);
        try {
            await deleteGrado(gradeToDelete);
            refetch();
        } catch (err) {
            console.error("Error al eliminar grado:", err);
        } finally {
            setDeleteLoading(false);
            setDeleteModalOpen(false);
            setGradeToDelete(null);
        }
    };

    // Función para recargar datos
    const recargarDatos = () => {
        refetch();
    };

    // Retrasar búsqueda mientras se escribe
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery === "") {
                setActiveSearchTerm("");
            }
        }, 300);
        
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Preparar datos filtrados para visualización
    const filteredGrades = grades?.grados || [];

    // Vista de carga
    if (loading && !filteredGrades.length) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingContent}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Cargando grados académicos...</p>
                </div>
            </div>
        );
    }

    // Vista de error
    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorContent}>
                    <FaExclamationTriangle className={styles.errorIcon} />
                    <h2>Error al cargar los grados</h2>
                    <p>{typeof error === "string" ? error : "Ha ocurrido un error inesperado"}</p>
                    <div className={styles.emptyStateActions}>
                        <button 
                            onClick={() => recargarDatos()} 
                            className={styles.emptyStateAction}
                        >
                            <FaSearch />
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // === RENDERIZADO PRINCIPAL ===
    
    return (
        <div className={styles.pageContainer}>
            {/* Encabezado principal con dashboard */}
            <header className={styles.dashboardHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.headerMain}>
                        <div className={styles.titleWrapper}>
                            <h1 className={styles.pageTitle}>
                                <FaGraduationCap className={styles.pageTitleIcon} />
                                Grados Académicos
                            </h1>
                            <p className={styles.pageDescription}>
                                Administración de grados académicos del sistema
                            </p>
                        </div>
                        
                        <div className={styles.headerActions}>
                            <Link to="/admin/grados/crear" className={styles.createButton}>
                                <FaPlus className={styles.buttonIcon} />
                                <span>Nuevo Grado</span>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Barra de estadísticas */}
                    <div className={styles.statsBar}>
                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.totalIcon}`}>
                                <FaGraduationCap />
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>Total Grados</span>
                                <span className={styles.statValue}>{stats.total}</span>
                            </div>
                        </div>
                        
                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.activeIcon}`}>
                                <FaCheck />
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>Con Ciclos Asignados</span>
                                <span className={styles.statValue}>{stats.withCiclos}</span>
                            </div>
                        </div>
                        
                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.levelIcon}`}>
                                <FaLayerGroup />
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>Niveles Académicos</span>
                                <span className={styles.statValue}>{Object.keys(stats.byLevel).length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Contenido principal */}
            <div className={styles.pageContent}>
                {/* Barra de herramientas y búsqueda */}
                <div className={styles.toolbarSection}>
                    <div className={styles.searchContainer}>
                        <form className={styles.searchForm} onSubmit={handleSearch}>
                            <FaSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Buscar grados académicos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className={styles.clearButton}
                                    title="Limpiar búsqueda"
                                >
                                    ×
                                </button>
                            )}
                            <button type="submit" className={styles.searchButton}>
                                Buscar
                            </button>
                        </form>
                    </div>
                    
                    <div className={styles.filterContainer}>
                        <button 
                            className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter className={styles.buttonIcon} /> Filtrar
                        </button>
                        
                        <div className={styles.sortButtons}>
                            <button
                                className={`${styles.sortButton} ${sortField === "nombre" ? styles.active : ""}`}
                                onClick={() => handleSort("nombre")}
                            >
                                Nombre {sortField === "nombre" && (
                                    sortDirection === "asc" ? "↑" : "↓"
                                )}
                            </button>
                            
                            <button
                                className={`${styles.sortButton} ${sortField === "nivelAcademico.descripcion" ? styles.active : ""}`}
                                onClick={() => handleSort("nivelAcademico.descripcion")}
                            >
                                Nivel Académico {sortField === "nivelAcademico.descripcion" && (
                                    sortDirection === "asc" ? "↑" : "↓"
                                )}
                            </button>
                            
                            <button
                                className={`${styles.sortButton} ${sortField === "jornada.descripcion" ? styles.active : ""}`}
                                onClick={() => handleSort("jornada.descripcion")}
                            >
                                Jornada {sortField === "jornada.descripcion" && (
                                    sortDirection === "asc" ? "↑" : "↓"
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {showFilters && (
                        <div className={styles.filtersPanel}>
                            <div className={styles.filterControls}>
                                <div className={styles.filterGroup}>
                                    <label>Nivel Académico</label>
                                    <select
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setActiveSearchTerm(e.target.value);
                                        }}
                                        className={styles.filterSelect}
                                    >
                                        <option value="">Todos los niveles</option>
                                        {Object.keys(stats.byLevel).map(nivel => (
                                            <option key={nivel} value={nivel}>
                                                {nivel} ({stats.byLevel[nivel]})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className={styles.filterGroup}>
                                    <label>Jornada</label>
                                    <select
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setActiveSearchTerm(e.target.value);
                                        }}
                                        className={styles.filterSelect}
                                    >
                                        <option value="">Todas las jornadas</option>
                                        {Object.keys(stats.byJornada).map(jornada => (
                                            <option key={jornada} value={jornada}>
                                                {jornada} ({stats.byJornada[jornada]})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className={styles.filterGroup}>
                                    <label>Estado</label>
                                    <select
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setActiveSearchTerm(e.target.value);
                                        }}
                                        className={styles.filterSelect}
                                    >
                                        <option value="">Todos los estados</option>
                                        <option value="con ciclos">Con ciclos ({stats.withCiclos})</option>
                                        <option value="sin ciclos">Sin ciclos ({stats.withoutCiclos})</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className={styles.filterActions}>
                                <button
                                    onClick={clearSearch}
                                    className={styles.clearFiltersButton}
                                    disabled={!activeSearchTerm}
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Vista vacía cuando no hay resultados para una búsqueda */}
                {activeSearchTerm && filteredGrades.length === 0 ? (
                    <div className={styles.noResults}>
                        <FaSearch className={styles.noResultsIcon} />
                        <h3>No se encontraron resultados</h3>
                        <p>No hay grados que coincidan con "<strong>{activeSearchTerm}</strong>"</p>
                        <button
                            onClick={clearSearch}
                            className={styles.clearSearchButton}
                        >
                            Limpiar búsqueda
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Lista de grados */}
                        <div className={styles.gradesGrid}>
                            {filteredGrades.map((grade: any) => (
                                <div
                                    key={grade.id}
                                    className={`${styles.gradeCard} ${grade.gradosCiclo?.length === 0 ? styles.inactiveCard : ""}`}
                                >
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.gradeName}>{grade.nombre}</h3>
                                        {grade.gradosCiclo?.length > 0 ? (
                                            <span className={styles.statusBadge}>Con ciclos</span>
                                        ) : (
                                            <span className={`${styles.statusBadge} ${styles.inactiveBadge}`}>Sin ciclos</span>
                                        )}
                                    </div>
                                    
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardInfo}>
                                            <p><strong>Nivel académico:</strong> {grade.nivelAcademico?.descripcion || "No definido"}</p>
                                            <p><strong>Jornada:</strong> {grade.jornada?.descripcion || "No definida"}</p>
                                            
                                            <div className={styles.cardStats}>
                                                <div className={styles.cardStat}>
                                                    <FaUserGraduate className={styles.statIcon} />
                                                    <span>{grade.gradosCiclo?.length || 0} ciclos asignados</span>
                                                </div>
                                            </div>
                                            
                                            {grade.gradosCiclo && grade.gradosCiclo.length > 0 && (
                                                <div className={styles.cicloInfo}>
                                                    <h4 className={styles.cicloTitle}>
                                                        <FaMoneyBillAlt className={styles.cicloIcon} />
                                                        Último ciclo: {grade.gradosCiclo[grade.gradosCiclo.length-1].ciclo.descripcion}
                                                    </h4>
                                                    <div className={styles.precioDetails}>
                                                        <div className={styles.precioItem}>
                                                            <span className={styles.precioLabel}>Inscripción:</span>
                                                            <span className={styles.precioValue}>Q{grade.gradosCiclo[grade.gradosCiclo.length-1].precioInscripcion}</span>
                                                        </div>
                                                        <div className={styles.precioItem}>
                                                            <span className={styles.precioLabel}>Mensualidad:</span>
                                                            <span className={styles.precioValue}>Q{grade.gradosCiclo[grade.gradosCiclo.length-1].precioPago}</span>
                                                        </div>
                                                        <div className={styles.precioItem}>
                                                            <span className={styles.precioLabel}>Pagos:</span>
                                                            <span className={styles.precioValue}>{grade.gradosCiclo[grade.gradosCiclo.length-1].cantidadPagos}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className={styles.cardActions}>
                                        <Link
                                            to={`/admin/grados/${grade.id}`}
                                            className={`${styles.cardAction} ${styles.viewAction}`}
                                            title="Ver detalles"
                                        >
                                            <FaEye />
                                        </Link>
                                        <Link
                                            to={`/admin/grados/editar/${grade.id}`}
                                            className={`${styles.cardAction} ${styles.editAction}`}
                                            title="Editar grado"
                                        >
                                            <FaPencilAlt />
                                        </Link>
                                        <button
                                            className={`${styles.cardAction} ${styles.deleteAction}`}
                                            onClick={() => handleDeleteClick(grade.id)}
                                            title="Eliminar grado"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Paginación */}
                        <div className={styles.pagination}>
                            <div className={styles.pageInfo}>
                                Mostrando {filteredGrades.length} de {grades?.total || 0} resultados
                            </div>
                            
                            <div className={styles.pageControls}>
                                <button
                                    className={styles.pageButton}
                                    onClick={() => setPage(page > 1 ? page - 1 : 1)}
                                    disabled={page === 1}
                                >
                                    &lt;
                                </button>
                                
                                {[...Array(Math.ceil((grades?.total || 0) / pageSize))].map((_, i) => (
                                    <button
                                        key={i}
                                        className={`${styles.pageButton} ${page === i + 1 ? styles.active : ''}`}
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                
                                <button
                                    className={styles.pageButton}
                                    onClick={() => setPage(page < Math.ceil((grades?.total || 0) / pageSize) ? page + 1 : page)}
                                    disabled={page >= Math.ceil((grades?.total || 0) / pageSize)}
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            
            {/* Modal de confirmación para eliminar grado */}
            <DeleteConfirmModal 
                isOpen={deleteModalOpen}
                title="Eliminar Grado"
                message={`¿Está seguro que desea eliminar el grado con ID "${gradeToDelete}"? Esta acción no se puede deshacer.`}
                itemId={gradeToDelete?.toString() || ""}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                isLoading={deleteLoading}
            />
        </div>
    );
};

export default GradesPage;