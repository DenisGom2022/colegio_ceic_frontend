import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaSearch,
    FaEye,
    FaPencilAlt,
    FaTrash,
    FaPlus,
    FaGraduationCap,
    FaMale,
    FaFemale,
    FaFilePdf
} from "react-icons/fa";
import { useStudentTable } from "../hooks/useStudentTable";
import type { Student } from "../models/Student";
import DeleteConfirmModal from "../../../../../components/DeleteConfirmModal";
import { deleteStudent, getAllStudentsForPDF } from "../services/studentService";
import { generateStudentsPDF } from "../../../../../utils/pdf/studentPdfGenerator";
import styles from "./StudentListPage.module.css";

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100];

// Funciones para persistir y recuperar los filtros en localStorage
const saveFiltersToStorage = (filters:any) => {
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
    const [sortField, setSortField] = useState(savedFilters?.sortField || "primerNombre");
    const [sortDirection, setSortDirection] = useState(savedFilters?.sortDirection || "asc");
    const [lastViewedStudent, setLastViewedStudent] = useState(localStorage.getItem('lastViewedStudent') || "");
    const [highlightedRow, setHighlightedRow] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [pdfError, setPdfError] = useState<string | null>(null);
    
    // Usar el hook con todos los parámetros, incluido ordenamiento
    const { students, loading, error, totalPages, recargarDatos } = useStudentTable(
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
    
    // Efecto para resaltar la fila del estudiante recién consultado
    useEffect(() => {
        // Si hay un estudiante que se acaba de ver y tenemos datos de estudiantes
        if (lastViewedStudent && students && students.items.length > 0 && 
            students.items.some(s => s && s.cui === lastViewedStudent)) {
            // Resaltar ese estudiante
            setHighlightedRow(lastViewedStudent);
            
            // Quitar el resaltado después de 0.9 segundos
            const timer = setTimeout(() => {
                setHighlightedRow("");
                // Limpiar el localStorage
                localStorage.removeItem('lastViewedStudent');
                setLastViewedStudent("");
            }, 900);
            
            return () => clearTimeout(timer);
        }
    }, [lastViewedStudent, students]);

    // Obtener las iniciales para el avatar
    const getInitials = (student: Student) => {
        const firstName = student.primerNombre?.charAt(0) || "?";
        const lastName = student.primerApellido?.charAt(0) || "?";
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
    const handleOpenDeleteModal = (student: Student) => {
        setStudentToDelete(student.cui);
        setDeleteModalOpen(true);
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setStudentToDelete("");
    };
    
    const handleConfirmDelete = async (cui: string) => {
        setDeleteLoading(true);
        try {
            await deleteStudent(cui);
            setDeleteSuccess(true);
            setDeleteModalOpen(false);
            // Mostrar notificación temporal de éxito
            setTimeout(() => {
                setDeleteSuccess(false);
            }, 3000);
            // Usar la función recargarDatos para actualizar la tabla
            recargarDatos();
        } catch (error: any) {
            setDeleteError(error.message || "Error al eliminar el estudiante");
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

    // Función para descargar el PDF de estudiantes
    const handleDownloadPDF = async () => {
        setPdfLoading(true);
        setPdfError(null);
        try {
            // Obtener todos los estudiantes sin paginación pero con los filtros actuales
            const allStudents = await getAllStudentsForPDF(activeSearchQuery, sortField, sortDirection);
            // Generar el PDF
            generateStudentsPDF(allStudents, activeSearchQuery);
        } catch (error: any) {
            console.error('Error al generar el PDF:', error);
            setPdfError(error.message || 'Error al generar el PDF de estudiantes');
        } finally {
            setPdfLoading(false);
        }
    };
    
    // Función para obtener el nombre completo
    const getNombreCompleto = (student: Student): string => {
        return `${student.primerNombre || ''} ${student.segundoNombre || ''} ${student.tercerNombre || ''} ${student.primerApellido || ''} ${student.segundoApellido || ''}`.trim().replace(/\s+/g, ' ');
    };

    // Obtener badge class según el género
    const getGenderBadgeClass = (genero: string): string => {
        return genero.toUpperCase() === 'M' ? styles.badgeMale : styles.badgeFemale;
    };

    if (loading) {
        return <div className={styles.loadingContainer}>Cargando estudiantes...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>Error: {error}</div>;
    }

    return (
        <div className={styles.pageContainer}>
            
            {/* Encabezado con botón de crear estudiante */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>
                    <FaGraduationCap size={24} />
                    Listado de Estudiantes
                    <span className={styles.badgeCount}>{ students?.totalItems || 0 }</span>
                </div>

                <div className={styles.headerActions}>
                    <button 
                        className={`${styles.downloadButton}`}
                        onClick={handleDownloadPDF}
                        disabled={pdfLoading}
                        title="Descargar listado en PDF"
                    >
                        <FaFilePdf size={14} />
                        {pdfLoading ? 'Generando...' : 'Descargar PDF'}
                    </button>
                    
                    <Link to="/admin/estudiantes/crear" className={styles.createButton}>
                        <FaPlus size={14} />
                        Crear Estudiante
                    </Link>
                </div>
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

            {/* Tabla de estudiantes */}
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
                        {students?.items.length === 0 ? (
                            <tr>
                                <td colSpan={7} className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>🔍</div>
                                    <div className={styles.emptyMessage}>No se encontraron estudiantes que coincidan con tu búsqueda</div>
                                </td>
                            </tr>
                        ) : (
                            students.items.map((student: Student) => (
                                <tr 
                                    key={student.cui} 
                                    className={`${styles.userRow} ${highlightedRow === student.cui ? styles.highlightedRow : ''}`}
                                >
                                    <td>
                                        <div className={styles.nameCell}>
                                            <div className={styles.avatar}>
                                                {getInitials(student)}
                                            </div>
                                            <div>
                                                <div className={styles.userName}>{getNombreCompleto(student)}</div>
                                                <div className={styles.userEmail}>{student.telefono || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{student.cui}</td>
                                    <td>
                                        <span className={`${styles.badge} ${getGenderBadgeClass(student.genero)}`}>
                                            {student.genero === 'M' ? (
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
                                    <td>{student.telefono || 'N/A'}</td>
                                    <td>{student.responsables?.length || 0}</td>
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
                                            <FaPencilAlt size={15} />
                                        </Link>
                                        <button 
                                            className={`${styles.actionButton} ${styles.delete}`} 
                                            title="Eliminar estudiante"
                                            onClick={() => handleOpenDeleteModal(student)}
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
                        Mostrando {students?.items.length} de {students?.totalItems || 0} registros
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
                        {page > 3 && <span className={styles.ellipsis}>...</span>}

                        {/* Páginas cercanas a la actual */}
                        {Array.from({ length: totalPages || 0 }, (_, i) => i + 1)
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
                        {page < (totalPages || 0) - 2 && <span className={styles.ellipsis}>...</span>}

                        {/* Última página */}
                        {page < (totalPages || 0) - 1 && (totalPages || 0) > 1 && (
                            <button className={styles.pageButton} onClick={() => setPage(totalPages || 0)}>
                                {totalPages || 0}
                            </button>
                        )}

                        <button
                            className={styles.pageButton}
                            onClick={() => setPage(Math.min(totalPages || 0, page + 1))}
                            disabled={page >= (totalPages || 0)}
                            aria-label="Siguiente"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Modal de confirmación para eliminar estudiante */}
            <DeleteConfirmModal 
                isOpen={deleteModalOpen}
                title="Eliminar Estudiante"
                message={`¿Estás seguro que deseas eliminar al estudiante con CUI "${studentToDelete}"? Esta acción no se puede deshacer.`}
                itemId={studentToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                isLoading={deleteLoading}
            />
            
            {/* Notificaciones */}
            {deleteSuccess && (
                <div className={styles.notification}>
                    <div className={styles.successNotification}>
                        <strong>¡Éxito!</strong> Estudiante eliminado correctamente.
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
            
            {pdfError && (
                <div className={styles.notification}>
                    <div className={styles.errorNotification}>
                        <strong>Error:</strong> {pdfError}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentListPage;
