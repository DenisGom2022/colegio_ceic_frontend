import { useState, useEffect } from "react";
import { useTablaCatedratico } from "../../hooks/useTablaCatedratico";
import styles from "./Catedraticos.module.css";
import { Link } from "react-router-dom";
import {
    FaSearch,
    FaEye,
    FaPencilAlt,
    FaTrash,
    FaPlus,
    FaChalkboardTeacher
} from "react-icons/fa";
import type { Catedratico } from "../../hooks/useTablaCatedratico";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { deleteCatedratico } from "../../services/catedraticoService";

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100];

// Funciones para persistir y recuperar los filtros en localStorage
const saveFiltersToStorage = (filters:any) => {
    localStorage.setItem('catedraticosFilters', JSON.stringify(filters));
};

const getFiltersFromStorage = () => {
    const savedFilters = localStorage.getItem('catedraticosFilters');
    if (savedFilters) {
        return JSON.parse(savedFilters);
    }
    return null;
};

const Catedraticos = () => {
    // Recuperar filtros guardados o usar valores por defecto
    const savedFilters = getFiltersFromStorage();
    
    const [page, setPage] = useState(savedFilters?.page || 1);
    const [pageSize, setPageSize] = useState(savedFilters?.pageSize || PAGE_SIZE_OPTIONS[0]);
    const [searchQuery, setSearchQuery] = useState(savedFilters?.searchQuery || "");
    const [activeSearchQuery, setActiveSearchQuery] = useState(savedFilters?.activeSearchQuery || "");
    const [sortField, setSortField] = useState(savedFilters?.sortField || "idUsuario");
    const [sortDirection, setSortDirection] = useState(savedFilters?.sortDirection || "asc");
    const [lastViewedCatedratico, setLastViewedCatedratico] = useState(localStorage.getItem('lastViewedCatedratico') || "");
    const [highlightedRow, setHighlightedRow] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [catedraticoToDelete, setCatedraticoToDelete] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const { catedraticos, loading, error, total, totalPages, recargarDatos } = useTablaCatedratico(page, pageSize, activeSearchQuery);
    
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
    
    // Efecto para resaltar la fila del catedrático recién consultado
    useEffect(() => {
        // Si hay un catedrático que se acaba de ver y tenemos datos de catedráticos
        if (lastViewedCatedratico && catedraticos && catedraticos.length > 0 && 
            catedraticos.some(c => c && c.idUsuario === lastViewedCatedratico)) {
            // Resaltar ese catedrático
            setHighlightedRow(lastViewedCatedratico);
            
            // Quitar el resaltado después de 0.9 segundos
            const timer = setTimeout(() => {
                setHighlightedRow("");
                // Limpiar el localStorage
                localStorage.removeItem('lastViewedCatedratico');
                setLastViewedCatedratico("");
            }, 900);
            
            return () => clearTimeout(timer);
        }
    }, [lastViewedCatedratico, catedraticos]);

    // Obtener las iniciales para el avatar
    const getInitials = (catedratico: Catedratico) => {
        // Verificar que usuario existe para evitar error de null
        if (!catedratico.usuario) {
            return "NA"; // Not Available
        }
        const firstName = catedratico.usuario.primerNombre?.charAt(0) || "?";
        const lastName = catedratico.usuario.primerApellido?.charAt(0) || "?";
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
    const handleOpenDeleteModal = (catedratico: Catedratico) => {
        setCatedraticoToDelete(catedratico.dpi);
        setDeleteModalOpen(true);
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setCatedraticoToDelete("");
    };
    
    const handleConfirmDelete = async (dpi: string) => {
        setDeleteLoading(true);
        try {
            await deleteCatedratico(dpi);
            setDeleteSuccess(true);
            setDeleteModalOpen(false);
            // Mostrar notificación temporal de éxito
            setTimeout(() => {
                setDeleteSuccess(false);
            }, 3000);
            // Usar la función recargarDatos para actualizar la tabla
            recargarDatos();
        } catch (error: any) {
            setDeleteError(error.message || "Error al eliminar el catedrático");
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

    // Ordenar catedráticos (frontend solo, ya que el backend ahora maneja la búsqueda y paginación)
    const sortedCatedraticos = [...catedraticos].sort((a, b) => {
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
    });

    if (loading) {
        return <div className={styles.loadingContainer}>Cargando catedráticos...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>Error: {error}</div>;
    }

    return (
        <div className={styles.pageContainer}>
            
            {/* Encabezado con botón de crear catedrático */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <FaChalkboardTeacher size={24} />
                    Listado de Catedráticos
                    <span className={styles.badgeCount}>{ total }</span>
                </div>

                <Link to="/admin/crear-catedratico" className={styles.createButton}>
                    <FaPlus size={14} />
                    Crear Catedrático
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

            {/* Tabla de catedráticos */}
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
                        {catedraticos.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>🔍</div>
                                    <div className={styles.emptyMessage}>No se encontraron catedráticos que coincidan con tu búsqueda</div>
                                </td>
                            </tr>
                        ) : (
                            sortedCatedraticos.map((catedratico: Catedratico) => (
                                <tr 
                                    key={catedratico.idUsuario} 
                                    className={`${styles.userRow} ${highlightedRow === catedratico.idUsuario ? styles.highlightedRow : ''}`}
                                >
                                    <td>
                                        <div className={styles.nameCell}>
                                            <div className={styles.avatar}>
                                                {getInitials(catedratico)}
                                            </div>
                                            <div>
                                                <div className={styles.userName}>{catedratico.idUsuario}</div>
                                                <div className={styles.userEmail}>{catedratico.usuario?.telefono || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {catedratico.usuario ? 
                                            `${catedratico.usuario.primerNombre || ''} ${catedratico.usuario.segundoNombre || ''} ${catedratico.usuario.primerApellido || ''} ${catedratico.usuario.segundoApellido || ''}` : 
                                            'Datos no disponibles'
                                        }
                                    </td>
                                    <td>{catedratico.dpi || 'N/A'}</td>
                                    <td>{catedratico.usuario?.telefono || 'N/A'}</td>
                                    <td className={styles.dateCell}>
                                        {formatDate(catedratico.createdAt)}
                                    </td>
                                    <td className={styles.actionCell}>
                                        <Link
                                            to={`/admin/catedratico/${catedratico.dpi}`}
                                            className={`${styles.actionButton} ${styles.view}`}
                                            title="Ver detalles"
                                            onClick={() => localStorage.setItem('lastViewedCatedratico', catedratico.idUsuario)}
                                        >
                                            <FaEye size={16} />
                                        </Link>
                                        <Link
                                            to={`/admin/editar-catedratico/${catedratico.dpi}`}
                                            className={`${styles.actionButton} ${styles.edit}`}
                                            title="Editar catedrático"
                                        >
                                            <FaPencilAlt size={15} />
                                        </Link>
                                        <button 
                                            className={`${styles.actionButton} ${styles.delete}`} 
                                            title="Eliminar catedrático"
                                            onClick={() => handleOpenDeleteModal(catedratico)}
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
                        Mostrando {catedraticos.length} de {total} registros
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
            
            {/* Modal de confirmación para eliminar catedrático */}
            <DeleteConfirmModal 
                isOpen={deleteModalOpen}
                title="Eliminar Catedrático"
                message={`¿Estás seguro que deseas eliminar al catedrático con DPI "${catedraticoToDelete}"? Esta acción no se puede deshacer.`}
                itemId={catedraticoToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                isLoading={deleteLoading}
            />
            
            {/* Notificaciones */}
            {deleteSuccess && (
                <div className={styles.notification}>
                    <div className={styles.successNotification}>
                        <strong>¡Éxito!</strong> Catedrático eliminado correctamente.
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

export default Catedraticos;
