import { useState, useEffect } from "react";
import { useCycleTable, useDeleteCycle, useFinalizeCycle } from '../hooks';
import { Link } from "react-router-dom";
import styles from "../../users/pages/UsersPage.module.css";
import type { Ciclo } from "../models/Ciclo";
import DeleteConfirmModal from "../../../../../components/DeleteConfirmModal";
import {
    FaSearch,
    FaEye,
    FaPencilAlt,
    FaTrash,
    FaPlus,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaCalendarCheck
} from "react-icons/fa";

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100];

// Funciones para persistir y recuperar los filtros en localStorage
const saveFiltersToStorage = (filters:any) => {
    localStorage.setItem('ciclosFilters', JSON.stringify(filters));
};

const getFiltersFromStorage = () => {
    const savedFilters = localStorage.getItem('ciclosFilters');
    if (savedFilters) {
        return JSON.parse(savedFilters);
    }
    return null;
};

const CycleListPage: React.FC = () => {
    // Recuperar filtros guardados o usar valores por defecto
    const savedFilters = getFiltersFromStorage();
    
    const [page, setPage] = useState(savedFilters?.page || 1);
    const [pageSize, setPageSize] = useState(savedFilters?.pageSize || PAGE_SIZE_OPTIONS[0]);
    const [searchQuery, setSearchQuery] = useState(savedFilters?.searchQuery || "");
    const [activeSearchQuery, setActiveSearchQuery] = useState(savedFilters?.activeSearchQuery || "");
    const [lastViewedCiclo, setLastViewedCiclo] = useState(localStorage.getItem('lastViewedCiclo') || "");
    const [highlightedRow, setHighlightedRow] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [cicloToDelete, setCicloToDelete] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Estados para finalizar ciclo
    const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);
    const [cicloToFinalize, setCicloToFinalize] = useState<string>("");
    const [finalizeSuccess, setFinalizeSuccess] = useState(false);
    const [finalizeError, setFinalizeError] = useState<string | null>(null);
    const [finalizeMessage, setFinalizeMessage] = useState<string | null>(null);
    
    // Funciones para gestionar tooltips
    const showTooltip = (event: React.MouseEvent<HTMLDivElement>) => {
        const tooltip = event.currentTarget.querySelector(`.${styles.tooltip}`);
        if (tooltip instanceof HTMLElement) {
            // Calcular la posición del tooltip basado en el evento
            const rect = event.currentTarget.getBoundingClientRect();
            
            // Obtener dimensiones de la ventana y viewport
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // Dimensiones del tooltip (más conservadoras para evitar scroll)
            const tooltipWidth = 320;
            const tooltipHeight = 200; // Reducido para más seguridad
            
            // Margen de seguridad más grande
            const margin = 30;
            
            // Calcular posición inicial (debajo del elemento)
            let left = rect.left;
            let top = rect.bottom + 10;
            
            // Verificar si hay suficiente espacio debajo (más estricto)
            const spaceBelow = windowHeight - rect.bottom;
            
            // Si no hay suficiente espacio debajo, mostrar arriba
            if (spaceBelow < tooltipHeight + margin) {
                top = rect.top - tooltipHeight - 10;
            }
            
            // Ajustar posición horizontal con mayor margen
            if (left + tooltipWidth > windowWidth - margin) {
                left = windowWidth - tooltipWidth - margin;
            }
            if (left < margin) {
                left = margin;
            }
            
            // Asegurar límites verticales estrictos
            if (top < margin) {
                top = margin;
            }
            if (top + tooltipHeight > windowHeight - margin) {
                top = windowHeight - tooltipHeight - margin;
            }
            
            // Verificación final para evitar cualquier desbordamiento
            if (top < 0) top = 10;
            if (left < 0) left = 10;
            if (top + tooltipHeight > windowHeight) {
                top = windowHeight - tooltipHeight - 10;
            }
            if (left + tooltipWidth > windowWidth) {
                left = windowWidth - tooltipWidth - 10;
            }
            
            // Aplicar posicionamiento
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            tooltip.style.transform = 'none';
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        }
    };

    const hideTooltip = (event: React.MouseEvent<HTMLDivElement>) => {
        const tooltip = event.currentTarget.querySelector(`.${styles.tooltip}`);
        if (tooltip instanceof HTMLElement) {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        }
    };
    
    // Usar los hooks
    const { ciclos, loading, error, total, totalPages, recargarDatos } = useCycleTable(
        page, 
        pageSize, 
        activeSearchQuery
    );
    
    const { deleteCycle, error: errorDeleteCycle } = useDeleteCycle();
    const { finalizeCycle, loading: loadingFinalizaCiclo, error: errorFinalizaCiclo } = useFinalizeCycle();
    
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
    
    // Efecto para resaltar la fila del ciclo recién consultado
    useEffect(() => {
        // Si hay un ciclo que se acaba de ver y tenemos datos de ciclos
        if (lastViewedCiclo && ciclos && ciclos.length > 0 && 
            ciclos.some(c => c && c.id.toString() === lastViewedCiclo)) {
            // Resaltar ese ciclo
            setHighlightedRow(lastViewedCiclo);
            
            // Quitar el resaltado después de 0.9 segundos
            const timer = setTimeout(() => {
                setHighlightedRow("");
                // Limpiar el localStorage
                localStorage.removeItem('lastViewedCiclo');
                setLastViewedCiclo("");
            }, 900);
            
            return () => clearTimeout(timer);
        }
    }, [lastViewedCiclo, ciclos]);

    // Formatear fecha a un formato legible
    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) return "No definido";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // Funciones para manejar el modal de eliminación
    const handleOpenDeleteModal = (ciclo: Ciclo) => {
        setCicloToDelete(ciclo.id.toString());
        setDeleteModalOpen(true);
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setCicloToDelete("");
    };
    
    // Funciones para manejar el modal de finalización
    const handleOpenFinalizeModal = (ciclo: Ciclo) => {
        setCicloToFinalize(ciclo.id.toString());
        setFinalizeModalOpen(true);
    };
    
    const handleCloseFinalizeModal = () => {
        setFinalizeModalOpen(false);
        setCicloToFinalize("");
    };
    
    const handleConfirmDelete = async (id: string) => {
        setDeleteLoading(true);
        try {
            const result = await deleteCycle(Number(id));
            if (result.success) {
                setDeleteSuccess(true);
                setDeleteModalOpen(false);
                // Mostrar notificación temporal de éxito
                setTimeout(() => {
                    setDeleteSuccess(false);
                }, 3000);
                // Usar la función recargarDatos para actualizar la tabla
                recargarDatos();
            } else {
                setDeleteError(result.error);
                // Cerrar el modal en caso de error
                setDeleteModalOpen(false);
                // Ocultar el mensaje de error después de 5 segundos
                setTimeout(() => {
                    setDeleteError(null);
                }, 5000);
            }
        } catch (error: any) {
            setDeleteError(errorDeleteCycle || "Error al eliminar el ciclo");
            // Cerrar el modal en caso de error
            setDeleteModalOpen(false);
            // Ocultar el mensaje de error después de 5 segundos
            setTimeout(() => {
                setDeleteError(null);
            }, 5000);
        } finally {
            setDeleteLoading(false);
        }
    };
    
    // Función para confirmar la finalización de un ciclo
    const handleConfirmFinalize = async (id: string) => {
        try {
            const result = await finalizeCycle(Number(id));
            if (result.success) {
                setFinalizeSuccess(true);
                setFinalizeModalOpen(false);
                setFinalizeMessage(result.message || "Ciclo finalizado exitosamente");
                
                // Mostrar notificación temporal de éxito
                setTimeout(() => {
                    setFinalizeSuccess(false);
                    setFinalizeMessage(null);
                }, 5000);
                
                // Recargar datos para actualizar la tabla
                recargarDatos();
            } else {
                setFinalizeError(result.error);
                // Cerrar el modal en caso de error
                setFinalizeModalOpen(false);
                
                // Ocultar el mensaje de error después de 5 segundos
                setTimeout(() => {
                    setFinalizeError(null);
                }, 5000);
            }
        } catch (error: any) {
            setFinalizeError(errorFinalizaCiclo || "Error al finalizar el ciclo");
            // Cerrar el modal en caso de error
            setFinalizeModalOpen(false);
            
            // Ocultar el mensaje de error después de 5 segundos
            setTimeout(() => {
                setFinalizeError(null);
            }, 5000);
        }
    };

    if (loading) {
        return <div className={styles.loadingContainer}>Cargando ciclos...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>Error: {error}</div>;
    }

    return (
        <div className={styles.pageContainer}>
            
            {/* Encabezado con botón de crear ciclo */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <FaCalendarAlt size={24} />
                    Listado de Ciclos
                    <span className={styles.badgeCount}>{ total }</span>
                </div>

                <Link to="/admin/crear-ciclo" className={styles.createButton}>
                    <FaPlus size={14} />
                    Crear Ciclo
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
                                placeholder="Buscar por descripción o ID"
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

            {/* Tabla de ciclos */}
            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeader}>
                            <th>ID</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Fecha Fin</th>
                            <th>Grados</th>
                            <th>Fecha de Creación</th>
                            <th className={styles.actionCell}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody className={styles.tableBody}>
                        {ciclos.length === 0 ? (
                            <tr>
                                <td colSpan={7} className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>🔍</div>
                                    <div className={styles.emptyMessage}>No se encontraron ciclos que coincidan con tu búsqueda</div>
                                </td>
                            </tr>
                        ) : (
                            ciclos.map((ciclo: Ciclo) => (
                                <tr 
                                    key={ciclo.id} 
                                    className={`${styles.userRow} ${highlightedRow === ciclo.id.toString() ? styles.highlightedRow : ''} ${ciclo.fechaFin ? styles.finishedRow : ''}`}
                                >
                                    <td>{ciclo.id}</td>
                                    <td>{ciclo.descripcion}</td>
                                    <td>
                                        <span className={`${styles.badge} ${ciclo.fechaFin ? styles.badgeInactive : styles.badgeActive}`}>
                                            {ciclo.fechaFin ? (
                                                <>
                                                    <FaTimesCircle size={12} style={{marginRight: '4px'}} />
                                                    Finalizado
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheckCircle size={12} style={{marginRight: '4px'}} />
                                                    Activo
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td>{formatDate(ciclo.fechaFin)}</td>
                                    <td className={styles.tooltipCell}>
                                        {ciclo.gradosCiclo && ciclo.gradosCiclo.length > 0 ? (
                                            <div 
                                                className={styles.tooltipContainer} 
                                                onMouseEnter={showTooltip} 
                                                onMouseLeave={hideTooltip}
                                            >
                                                <span className={styles.gradosCount}>
                                                    {ciclo.gradosCiclo.length} {ciclo.gradosCiclo.length === 1 ? 'grado' : 'grados'}
                                                </span>
                                                <div className={styles.tooltip}>
                                                    <div className={styles.tooltipTitle}>Grados asignados:</div>
                                                    <ul className={styles.tooltipList}>
                                                        {ciclo.gradosCiclo.map(gc => (
                                                            <li key={gc.id}>
                                                                {gc.grado.nombre} - {gc.grado.nivelAcademico.descripcion} ({gc.grado.jornada.descripcion})
                                                                <div className={styles.tooltipDetail}>
                                                                    <span>Precio pago: Q{gc.precioPago}</span>
                                                                    <span>Pagos: {gc.cantidadPagos}</span>
                                                                    <span>Inscripción: Q{gc.precioInscripcion}</span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className={styles.noGrados}>Sin grados</span>
                                        )}
                                    </td>
                                    <td className={styles.dateCell}>
                                        {formatDate(ciclo.createdAt)}
                                    </td>
                                    <td className={styles.actionCell}>
                                        <Link
                                            to={`/admin/ciclo/${ciclo.id}`}
                                            className={`${styles.actionButton} ${styles.view}`}
                                            title="Ver detalles"
                                            onClick={() => localStorage.setItem('lastViewedCiclo', ciclo.id.toString())}
                                        >
                                            <FaEye size={16} />
                                        </Link>
                                        <Link
                                            to={`/admin/editar-ciclo/${ciclo.id}`}
                                            className={`${styles.actionButton} ${styles.edit}`}
                                            title="Editar ciclo"
                                        >
                                            <FaPencilAlt size={15} />
                                        </Link>
                                        <button 
                                            className={`${styles.actionButton} ${styles.finalize}`} 
                                            title="Finalizar ciclo"
                                            onClick={() => handleOpenFinalizeModal(ciclo)}
                                        >
                                            <FaCalendarCheck size={15} />
                                        </button>
                                        <button 
                                            className={`${styles.actionButton} ${styles.delete}`} 
                                            title="Eliminar ciclo"
                                            onClick={() => handleOpenDeleteModal(ciclo)}
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
                        Mostrando {ciclos.length} de {total} registros
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
            
            {/* Modal de confirmación para eliminar ciclo */}
            <DeleteConfirmModal 
                isOpen={deleteModalOpen}
                title="Eliminar Ciclo"
                message={`¿Estás seguro que deseas eliminar el ciclo con ID "${cicloToDelete}"? Esta acción no se puede deshacer.`}
                itemId={cicloToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                isLoading={deleteLoading}
            />
            
            {/* Modal de confirmación para finalizar ciclo */}
            <DeleteConfirmModal 
                isOpen={finalizeModalOpen}
                title="Finalizar Ciclo"
                message={`¿Estás seguro que deseas finalizar el ciclo con ID "${cicloToFinalize}"? Esta acción cerrará el ciclo y no se podrán realizar más cambios.`}
                itemId={cicloToFinalize}
                onConfirm={handleConfirmFinalize}
                onCancel={handleCloseFinalizeModal}
                isLoading={loadingFinalizaCiclo}
                confirmButtonText="Finalizar"
                confirmButtonClass="finalize"
                modalClass="finalize"
                icon={<FaCalendarCheck size={24} />}
            />
            
            {/* Notificaciones */}
            {deleteSuccess && (
                <div className={styles.notification}>
                    <div className={styles.successNotification}>
                        <strong>¡Éxito!</strong> Ciclo eliminado correctamente.
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
            
            {finalizeSuccess && (
                <div className={styles.notification}>
                    <div className={styles.successNotification}>
                        <strong>¡Éxito!</strong> {finalizeMessage || "Ciclo finalizado correctamente."}
                        <button 
                            onClick={() => {
                                setFinalizeSuccess(false);
                                setFinalizeMessage(null);
                            }} 
                            className={styles.closeNotification}
                            aria-label="Cerrar notificación"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
            
            {finalizeError && (
                <div className={styles.notification}>
                    <div className={styles.errorNotification}>
                        <strong>Error:</strong> {finalizeError}
                        <button 
                            onClick={() => setFinalizeError(null)} 
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

export default CycleListPage;
