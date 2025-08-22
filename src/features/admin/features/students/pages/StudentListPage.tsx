import { useState, useEffect } from "react";
import { useStudentTable } from "../hooks/useStudentTable";
import { useDeleteStudent } from "../hooks/useDeleteStudent";
import styles from "../../users/pages/UsersPage.module.css";
import { Link } from "react-router-dom";
import {
    FaSearch,
    FaEye,
    FaPencilAlt,
    FaTrash,
    FaPlus,
    FaGraduationCap
} from "react-icons/fa";
import type { Student } from "../models/Student";
import DeleteConfirmModal from "../../../../../components/DeleteConfirmModal";

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100];

// Funciones para persistir y recuperar los filtros en localStorage
const saveFiltersToStorage = (filters: any) => {
    localStorage.setItem('studentsFilters', JSON.stringify(filters));
};

const getFiltersFromStorage = () => {
    const savedFilters = localStorage.getItem('studentsFilters');
    if (savedFilters) {
        return JSON.parse(savedFilters);
    }
    return null;
};

const StudentListPage = () => {
    // Recuperar filtros guardados o usar valores por defecto
    const savedFilters = getFiltersFromStorage();
    
    const [page, setPage] = useState(savedFilters?.page || 1);
    const [pageSize, setPageSize] = useState(savedFilters?.pageSize || PAGE_SIZE_OPTIONS[0]);
    const [searchQuery, setSearchQuery] = useState(savedFilters?.searchQuery || "");
    const [activeSearchQuery, setActiveSearchQuery] = useState(savedFilters?.activeSearchQuery || "");
    const [lastViewedStudent, setLastViewedStudent] = useState(localStorage.getItem('lastViewedStudent') || "");
    const [highlightedRow, setHighlightedRow] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    
    const { students, totalPages, recargarDatos } = useStudentTable(page, pageSize, activeSearchQuery);
    const { deleteStudent: eliminarEstudiante, loading: isDeleting, error: deleteError } = useDeleteStudent();
    
    // Calcular total de estudiantes y datos para mostrar
    const studentItems = students?.items || [];
    const total = students?.totalItems || 0;
    
    useEffect(() => {
        // Aplicar resaltado si se viene de ver detalles de un estudiante
        if (lastViewedStudent) {
            setHighlightedRow(lastViewedStudent);
            // Limpiar después de un tiempo
            const timer = setTimeout(() => {
                setHighlightedRow("");
                setLastViewedStudent("");
                localStorage.removeItem('lastViewedStudent');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [lastViewedStudent]);
    
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
    const handleDeleteClick = (cui: string) => {
        setStudentToDelete(cui);
        setDeleteModalOpen(true);
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setStudentToDelete("");
    };
    
    const handleConfirmDelete = async (cui: string) => {
        try {
            await eliminarEstudiante(cui);
            setDeleteSuccess(true);
            setDeleteModalOpen(false);
            // Mostrar notificación temporal de éxito
            setTimeout(() => {
                setDeleteSuccess(false);
            }, 3000);
            // Recargar la tabla de estudiantes
            recargarDatos();
        } catch (error) {
            console.error('Error eliminando estudiante:', error);
        }
    };

    // Formatear fecha
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
    const getInitials = (student: Student) => {
        const first = student.primerNombre?.charAt(0) || '';
        const last = student.primerApellido?.charAt(0) || '';
        return (first + last).toUpperCase();
    };

    // Obtener clase para el badge según género
    const getGenderBadgeClass = (genero: string) => {
        if (!genero) return '';
        
        const gender = genero.toLowerCase();
        if (gender.includes('m') || gender === 'masculino') return styles.badgeStudent;
        if (gender.includes('f') || gender === 'femenino') return styles.badgeParent;
        
        return '';
    };

    // Renderizar estudiante con resaltado condicional
    const renderStudentRow = (student: Student) => {
        const isHighlighted = highlightedRow === student.cui;
        return (
            <tr key={student.cui} className={`${styles.userRow} ${isHighlighted ? styles.highlightedRow : ''}`}>
                <td>
                    <div className={styles.nameCell}>
                        <div className={styles.avatar}>
                            {getInitials(student)}
                        </div>
                        <div>
                            <div className={styles.userName}>{student.cui}</div>
                            <div className={styles.userEmail}>{student.telefono || 'Sin teléfono'}</div>
                        </div>
                    </div>
                </td>
                <td>{`${student.primerNombre} ${student.segundoNombre || ''} ${student.primerApellido} ${student.segundoApellido || ''}`}</td>
                <td>{student.telefono || 'N/A'}</td>
                <td>
                    <span className={`${styles.badge} ${getGenderBadgeClass(student.genero)}`}>
                        {student.genero || 'N/A'}
                    </span>
                </td>
                <td className={styles.dateCell}>
                    {formatDate(student.createdAt)}
                </td>
                <td className={styles.actionCell}>
                    <Link
                        to={`/admin/estudiantes/${student.cui}`}
                        className={`${styles.actionButton} ${styles.view}`}
                        title="Ver detalles"
                        onClick={() => localStorage.setItem('lastViewedStudent', student.cui)}
                    >
                        <FaEye size={16} />
                    </Link>
                    <Link
                        to={`/admin/estudiantes/editar/${student.cui}`}
                        className={`${styles.actionButton} ${styles.edit}`}
                        title="Editar estudiante"
                    >
                        <FaPencilAlt size={16} />
                    </Link>
                    <button
                        className={`${styles.actionButton} ${styles.delete}`}
                        onClick={() => handleDeleteClick(student.cui)}
                        title="Eliminar estudiante"
                    >
                        <FaTrash size={16} />
                    </button>
                </td>
            </tr>
        );
    };
    
    // Renderizar cuerpo de la tabla o mensaje vacío
    const renderTableBody = () => {
        if (studentItems.length === 0) {
            return (
                <tr>
                    <td colSpan={6} className={styles.emptyState}>
                        <div className={styles.emptyIcon}>👨‍🎓</div>
                        <div className={styles.emptyMessage}>
                            {activeSearchQuery 
                                ? `No se encontraron estudiantes que coincidan con "${activeSearchQuery}"`
                                : "No hay estudiantes registrados en el sistema"
                            }
                        </div>
                    </td>
                </tr>
            );
        }
        
        return studentItems.map(renderStudentRow);
    };
    
    return (
        <div className={styles.pageContainer}>
            
            {/* Encabezado con botón de crear estudiante */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <FaGraduationCap size={28} />
                    Gestión de Estudiantes
                    <span className={styles.badgeCount}>{total}</span>
                </div>

                <Link to="/admin/estudiantes/crear" className={styles.createButton}>
                    <FaPlus size={16} />
                    Nuevo Estudiante
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
                                placeholder="Buscar por nombre o CUI"
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

            {/* Tabla de estudiantes */}
            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeader}>
                            <th>Estudiante</th>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Género</th>
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
                        Mostrando {studentItems.length} de {total} registros
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

            {/* Modal de confirmación para eliminar estudiante */}
            <DeleteConfirmModal 
                isOpen={deleteModalOpen}
                title="Eliminar Estudiante"
                message={`¿Estás seguro que deseas eliminar al estudiante "${studentToDelete}"? Esta acción no se puede deshacer.`}
                itemId={studentToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                isLoading={isDeleting}
            />
            
            {/* Notificaciones */}
            {deleteSuccess && (
                <div className={styles.notification}>
                    <div className={styles.successNotification}>
                        <strong>¡Éxito!</strong> Estudiante eliminado correctamente.
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

export default StudentListPage;
