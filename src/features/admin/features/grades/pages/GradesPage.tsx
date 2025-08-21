import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import React from "react";
import {
    FaSearch,
    FaEye,
    FaPencilAlt,
    FaTrash,
    FaPlus,
    FaGraduationCap,
    FaClock,
    FaBook,
    FaTable,
    FaTh
} from "react-icons/fa";
import { useGradeTable } from "../hooks/useGradeTable";
import type { Grado } from "../services/gradoService";
import DeleteConfirmModal from "../../../../../components/DeleteConfirmModal";
import { deleteGrado } from "../services/gradoService";
import styles from "./GradesPage.module.css";

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100];

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

const GradesPage = () => {
    // Recuperar filtros guardados o usar valores por defecto
    const savedFilters = getFiltersFromStorage();
    
    const [page, setPage] = useState(savedFilters?.page || 1);
    const [pageSize, setPageSize] = useState(savedFilters?.pageSize || PAGE_SIZE_OPTIONS[0]);
    const [searchQuery, setSearchQuery] = useState(savedFilters?.searchQuery || "");
    const [activeSearchQuery, setActiveSearchQuery] = useState(savedFilters?.activeSearchQuery || "");
    const [sortField, setSortField] = useState(savedFilters?.sortField || "id");
    const [sortDirection, setSortDirection] = useState(savedFilters?.sortDirection || "asc");
    const [lastViewedGrade, setLastViewedGrade] = useState(localStorage.getItem('lastViewedGrade') || "");
    const [highlightedRow, setHighlightedRow] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [gradeToDelete, setGradeToDelete] = useState<number | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>(savedFilters?.viewMode || 'cards');
    
    // Usar el hook para la tabla de grados
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
    
    // Guardar filtros cuando cambien
    useEffect(() => {
        const filters = {
            page,
            pageSize,
            searchQuery,
            activeSearchQuery,
            sortField,
            sortDirection,
            viewMode
        };
        saveFiltersToStorage(filters);
    }, [page, pageSize, searchQuery, activeSearchQuery, sortField, sortDirection, viewMode]);
    
    // Efecto para resaltar la fila del grado recién consultado
    useEffect(() => {
        if (lastViewedGrade && grades && grades.grados && grades.grados.length > 0 && 
            grades.grados.some(g => g && g.id.toString() === lastViewedGrade)) {
            // Resaltar ese grado
            setHighlightedRow(lastViewedGrade);
            
            // Quitar el resaltado después de 0.9 segundos
            const timer = setTimeout(() => {
                setHighlightedRow("");
                // Limpiar el localStorage
                localStorage.removeItem('lastViewedGrade');
                setLastViewedGrade("");
            }, 900);
            
            return () => clearTimeout(timer);
        }
    }, [lastViewedGrade, grades]);
    
    // Obtener las iniciales para el avatar
    const getInitials = (grade: Grado) => {
        if (!grade.nombre) {
            return "NA"; // Not Available
        }
        const words = grade.nombre.split(' ');
        if (words.length >= 2) {
            return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
        }
        return grade.nombre.charAt(0).toUpperCase();
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
    const handleOpenDeleteModal = (grade: Grado) => {
        setGradeToDelete(grade.id);
        setDeleteModalOpen(true);
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setGradeToDelete(null);
    };
    
    const handleConfirmDelete = async (id: string) => {
        setDeleteLoading(true);
        try {
            await deleteGrado(parseInt(id));
            setDeleteSuccess(true);
            setDeleteModalOpen(false);
            // Mostrar notificación temporal de éxito
            setTimeout(() => {
                setDeleteSuccess(false);
            }, 3000);
            // Usar la función recargarDatos para actualizar la tabla
            recargarDatos();
        } catch (error: any) {
            setDeleteError(error.message || "Error al eliminar el grado");
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
    
    // Ordenar grados (frontend solo)
    const sortedGrades = grades && grades.grados ? [...grades.grados].sort((a, b) => {
        let valA, valB;

        if (sortField === 'id') {
            valA = a.id;
            valB = b.id;
        } else if (sortField === 'nombre') {
            valA = a.nombre || '';
            valB = b.nombre || '';
        } else if (sortField === 'nivelAcademico') {
            valA = a.nivelAcademico?.descripcion || '';
            valB = b.nivelAcademico?.descripcion || '';
        } else if (sortField === 'jornada') {
            valA = a.jornada?.descripcion || '';
            valB = b.jornada?.descripcion || '';
        } else {
            return 0;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    }) : [];

    // Agrupar grados por jornada y nivel académico
    const groupedGrades = sortedGrades.reduce((groups: any, grade: Grado) => {
        const jornada = grade.jornada?.descripcion || 'Sin jornada';
        const nivelAcademico = grade.nivelAcademico?.descripcion || 'Sin nivel académico';
        
        if (!groups[jornada]) {
            groups[jornada] = {};
        }
        
        if (!groups[jornada][nivelAcademico]) {
            groups[jornada][nivelAcademico] = [];
        }
        
        groups[jornada][nivelAcademico].push(grade);
        
        return groups;
    }, {});

    // Renderizar filas agrupadas
    const renderGroupedRows = () => {
        const rows: React.ReactElement[] = [];
        
        Object.keys(groupedGrades).forEach((jornada) => {
            const jornadaGrades = Object.values(groupedGrades[jornada]).flat();
            const totalGradosJornada = jornadaGrades.length;
            
            // Encabezado de jornada
            rows.push(
                <tr key={`jornada-${jornada}`} className={styles.groupHeader}>
                    <td colSpan={7}>
                        <FaClock className={styles.groupIcon} />
                        {jornada} ({totalGradosJornada} grado{totalGradosJornada !== 1 ? 's' : ''})
                    </td>
                </tr>
            );
            
            Object.keys(groupedGrades[jornada]).forEach((nivelAcademico) => {
                const gradosNivel = groupedGrades[jornada][nivelAcademico];
                const totalGradosNivel = gradosNivel.length;
                
                // Subencabezado de nivel académico
                rows.push(
                    <tr key={`nivel-${jornada}-${nivelAcademico}`} className={styles.subGroupHeader}>
                        <td colSpan={7}>
                            <FaBook className={styles.subGroupIcon} />
                            {nivelAcademico} ({totalGradosNivel} grado{totalGradosNivel !== 1 ? 's' : ''})
                        </td>
                    </tr>
                );
                
                // Grados del grupo
                groupedGrades[jornada][nivelAcademico].forEach((grade: Grado) => {
                    rows.push(
                        <tr 
                            key={grade.id} 
                            className={`${styles.userRow} ${styles.groupedRow} ${highlightedRow === grade.id.toString() ? styles.highlightedRow : ''}`}
                        >
                            <td>
                                <div className={styles.nameCell}>
                                    <div className={styles.avatar}>
                                        {getInitials(grade)}
                                    </div>
                                    <div>
                                        <div className={styles.userName}>{grade.id}</div>
                                        <div className={styles.userEmail}>ID: #{grade.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td className={styles.dataCell}>{grade.nombre || 'N/A'}</td>
                            <td className={styles.dataCell}>{grade.nivelAcademico?.descripcion || 'N/A'}</td>
                            <td className={styles.dataCell}>{grade.jornada?.descripcion || 'N/A'}</td>
                            <td className={styles.dataCell}>
                                {grade.gradosCiclo && grade.gradosCiclo.length > 0
                                    ? (() => {
                                        // Buscar el ciclo activo (where fechaFin is null)
                                        const activeCycle = grade.gradosCiclo.find((gc: any) => 
                                          gc.ciclo && gc.ciclo.fechaFin === null
                                        );
                                        
                                        if (activeCycle) {
                                          return (
                                            <>
                                              <div>Q{activeCycle.precioPago} ({activeCycle.cantidadPagos} pagos)</div>
                                              <div className={styles.cycleName}>
                                                {activeCycle.ciclo?.descripcion || `Ciclo ${activeCycle.idCiclo}`}
                                              </div>
                                            </>
                                          );
                                        } else {
                                          return (
                                            <div className={styles.noCycle}>No está en un ciclo activo</div>
                                          );
                                        }
                                      })()
                                    : <div className={styles.noCycle}>No está en un ciclo activo</div>}
                            </td>
                            <td className={styles.dateCell}>
                                {formatDate(grade.createdAt)}
                            </td>
                            <td className={styles.actionCell}>
                                <Link
                                    to={`/admin/grado/${grade.id}`}
                                    className={`${styles.actionButton} ${styles.view}`}
                                    title="Ver detalles"
                                    onClick={() => localStorage.setItem('lastViewedGrade', grade.id.toString())}
                                >
                                    <FaEye size={16} />
                                </Link>
                                <Link
                                    to={`/admin/editar-grado/${grade.id}`}
                                    className={`${styles.actionButton} ${styles.edit}`}
                                    title="Editar grado"
                                >
                                    <FaPencilAlt size={15} />
                                </Link>
                                <button 
                                    className={`${styles.actionButton} ${styles.delete}`} 
                                    title="Eliminar grado"
                                    onClick={() => handleOpenDeleteModal(grade)}
                                >
                                    <FaTrash size={14} />
                                </button>
                            </td>
                        </tr>
                    );
                });
            });
        });
        
        return rows;
    };

    // Renderizar vista de tarjetas agrupadas
    const renderGroupedCards = () => {
        if (!grades?.grados || grades.grados.length === 0) {
            return (
                <div className={styles.emptyGroup}>
                    <div className={styles.emptyIcon}>🔍</div>
                    <div className={styles.emptyGroupText}>No se encontraron grados que coincidan con tu búsqueda</div>
                    <div className={styles.emptyGroupSubtext}>Prueba con otros términos o criterios de búsqueda</div>
                </div>
            );
        }

        return (
            <div className={styles.groupedView}>
                {Object.keys(groupedGrades).map((jornada) => {
                    const jornadaGrades = Object.values(groupedGrades[jornada]).flat();
                    const totalGradosJornada = jornadaGrades.length;

                    return (
                        <div key={jornada} className={styles.jornadaGroup}>
                            <div className={styles.jornadaHeader}>
                                <FaClock className={styles.jornadaIcon} />
                                {jornada} ({totalGradosJornada} grado{totalGradosJornada !== 1 ? 's' : ''})
                            </div>

                            {Object.keys(groupedGrades[jornada]).map((nivelAcademico) => {
                                const gradosNivel = groupedGrades[jornada][nivelAcademico];
                                const totalGradosNivel = gradosNivel.length;

                                return (
                                    <div key={`${jornada}-${nivelAcademico}`} className={styles.nivelGroup}>
                                        <div className={styles.nivelHeader}>
                                            <FaBook className={styles.nivelIcon} />
                                            {nivelAcademico} ({totalGradosNivel} grado{totalGradosNivel !== 1 ? 's' : ''})
                                        </div>

                                        <div className={styles.gradesGrid}>
                                            {gradosNivel.map((grade: Grado) => (
                                                <div 
                                                    key={grade.id} 
                                                    className={`${styles.gradeCard} ${highlightedRow === grade.id.toString() ? styles.highlighted : ''}`}
                                                >
                                                    <div className={styles.gradeCardHeader}>
                                                        <div className={styles.gradeInfo}>
                                                            <div className={styles.gradeAvatar}>
                                                                {getInitials(grade)}
                                                            </div>
                                                            <div className={styles.gradeDetails}>
                                                                <div className={styles.gradeName}>{grade.nombre || 'N/A'}</div>
                                                                <div className={styles.gradeId}>ID: #{grade.id}</div>
                                                            </div>
                                                        </div>
                                                        <div className={styles.gradeActions}>
                                                            <Link
                                                                to={`/admin/grado/${grade.id}`}
                                                                className={`${styles.actionButton} ${styles.view}`}
                                                                title="Ver detalles"
                                                                onClick={() => localStorage.setItem('lastViewedGrade', grade.id.toString())}
                                                            >
                                                                <FaEye size={16} />
                                                            </Link>
                                                            <Link
                                                                to={`/admin/editar-grado/${grade.id}`}
                                                                className={`${styles.actionButton} ${styles.edit}`}
                                                                title="Editar grado"
                                                            >
                                                                <FaPencilAlt size={15} />
                                                            </Link>
                                                            <button 
                                                                className={`${styles.actionButton} ${styles.delete}`} 
                                                                title="Eliminar grado"
                                                                onClick={() => handleOpenDeleteModal(grade)}
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className={styles.gradeCardBody}>
                                                        <div className={styles.gradeField}>
                                                            <div className={styles.fieldLabel}>Nivel Académico</div>
                                                            <div className={styles.fieldValue}>{grade.nivelAcademico?.descripcion || 'N/A'}</div>
                                                        </div>
                                                        <div className={styles.gradeField}>
                                                            <div className={styles.fieldLabel}>Jornada</div>
                                                            <div className={styles.fieldValue}>{grade.jornada?.descripcion || 'N/A'}</div>
                                                        </div>
                                                        <div className={styles.gradeField} style={{ gridColumn: 'span 2' }}>
                                                            <div className={styles.fieldLabel}>Fecha de Registro</div>
                                                            <div className={styles.fieldValue}>{formatDate(grade.createdAt)}</div>
                                                        </div>
                                                    </div>

                                                    {grade.gradosCiclo && grade.gradosCiclo.length > 0 ? (() => {
                                                        const activeCycle = grade.gradosCiclo.find((gc: any) => 
                                                            gc.ciclo && gc.ciclo.fechaFin === null
                                                        );
                                                        
                                                        if (activeCycle) {
                                                            return (
                                                                <div className={styles.gradePrice}>
                                                                    <div className={styles.priceAmount}>
                                                                        Q{activeCycle.precioPago} ({activeCycle.cantidadPagos} pagos)
                                                                    </div>
                                                                    <div className={styles.priceCycle}>
                                                                        {activeCycle.ciclo?.descripcion || `Ciclo ${activeCycle.idCiclo}`}
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div className={styles.noPriceInfo}>
                                                                    No está en un ciclo activo
                                                                </div>
                                                            );
                                                        }
                                                    })() : (
                                                        <div className={styles.noPriceInfo}>
                                                            No está en un ciclo activo
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <div>Cargando grados...</div>
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
            
            {/* Encabezado con botón de crear grado */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <FaGraduationCap size={24} />
                    Listado de Grados
                    <span className={styles.badgeCount}>{ grades?.total || 0 }</span>
                </div>

                <Link to="/admin/crear-grado" className={styles.createButton}>
                    <FaPlus size={14} />
                    Crear Grado
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
                                placeholder="Buscar por nombre, nivel académico o jornada"
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

            {/* Toggle de vista */}
            <div className={styles.viewToggle}>
                <button 
                    className={`${styles.toggleButton} ${viewMode === 'cards' ? styles.active : ''}`}
                    onClick={() => setViewMode('cards')}
                    title="Vista de tarjetas agrupadas"
                >
                    <FaTh size={14} />
                    Tarjetas
                </button>
                <button 
                    className={`${styles.toggleButton} ${viewMode === 'table' ? styles.active : ''}`}
                    onClick={() => setViewMode('table')}
                    title="Vista de tabla"
                >
                    <FaTable size={14} />
                    Tabla
                </button>
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

            {/* Contenido principal */}
            {viewMode === 'table' ? (
                /* Tabla de grados */
                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHeader}>
                                <th onClick={() => handleSortChange("id")} style={{ cursor: "pointer" }}>
                                    ID
                                </th>
                                <th onClick={() => handleSortChange("nombre")} style={{ cursor: "pointer" }}>
                                    Nombre
                                </th>
                                <th onClick={() => handleSortChange("nivelAcademico")} style={{ cursor: "pointer" }}>
                                    Nivel Académico
                                </th>
                                <th onClick={() => handleSortChange("jornada")} style={{ cursor: "pointer" }}>
                                    Jornada
                                </th>
                                <th>Precio (Ciclo Activo)</th>
                                <th>Fecha de Registro</th>
                                <th className={styles.actionCell}>Acciones</th>
                            </tr>
                        </thead>

                        <tbody className={styles.tableBody}>
                            {!grades?.grados || grades.grados.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '48px 0' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '16px', color: '#94a3b8' }}>🔍</div>
                                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>No se encontraron grados que coincidan con tu búsqueda</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>Prueba con otros términos o criterios de búsqueda</div>
                                    </td>
                                </tr>
                            ) : (
                                renderGroupedRows()
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
                            Mostrando {grades?.grados?.length || 0} de {grades?.total || 0} registros
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
                                <button 
                                    className={styles.pageButton} 
                                    onClick={() => setPage(1)}
                                >
                                    1
                                </button>
                            )}

                            {/* Elipsis si hay muchas páginas */}
                            {page > 3 && <span className={styles.ellipsis}>...</span>}

                            {/* Páginas cercanas a la actual */}
                            {Array.from({ length: grades?.totalPages || 0 }, (_, i) => i + 1)
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
                            {page < (grades?.totalPages || 0) - 2 && <span className={styles.ellipsis}>...</span>}

                            {/* Última página */}
                            {page < (grades?.totalPages || 0) - 1 && (grades?.totalPages || 0) > 1 && (
                                <button 
                                    className={styles.pageButton} 
                                    onClick={() => setPage(grades?.totalPages || 0)}
                                >
                                    {grades?.totalPages || 0}
                                </button>
                            )}

                            <button
                                className={styles.pageButton}
                                onClick={() => setPage(Math.min(grades?.totalPages || 0, page + 1))}
                                disabled={page >= (grades?.totalPages || 0)}
                                aria-label="Siguiente"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Vista de tarjetas agrupadas */
                renderGroupedCards()
            )}
            
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
            
            {/* Notificaciones */}
            {deleteSuccess && (
                <div className={styles.notification}>
                    <div className={styles.successNotification}>
                        <strong>¡Éxito!</strong> Grado eliminado correctamente.
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

export default GradesPage;
