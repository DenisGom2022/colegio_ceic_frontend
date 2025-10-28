import { useState, useEffect } from "react";
import { useListAsignaciones } from "../hooks/useListAsignaciones";
import { useEliminarAsignacion } from "../hooks/useEliminarAsignacion";
import { FaGraduationCap, FaSearch, FaEye, FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
import styles from "../../users/pages/UsersPage.module.css";
import { Link } from "react-router-dom";
import DeleteConfirmModal from "../../../../../components/DeleteConfirmModal";

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50, 100];

// Funciones para persistir y recuperar los filtros en localStorage
const saveFiltersToStorage = (filters: any) => {
  localStorage.setItem('asignacionesFilters', JSON.stringify(filters));
};

const getFiltersFromStorage = () => {
  const savedFilters = localStorage.getItem('asignacionesFilters');
  if (savedFilters) {
      return JSON.parse(savedFilters);
  }
  return null;
};

export const AsignacionesListPage = () => {
  // Recuperar filtros guardados o usar valores por defecto
  const savedFilters = getFiltersFromStorage();
  
  const [page, setPage] = useState(savedFilters?.page || 1);
  const [pageSize, setPageSize] = useState(savedFilters?.pageSize || PAGE_SIZE_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState(savedFilters?.searchQuery || "");
  const [activeSearchQuery, setActiveSearchQuery] = useState(savedFilters?.activeSearchQuery || "");

  // Estados para el modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [asignacionToDelete, setAsignacionToDelete] = useState<{ id: number; nombre: string } | null>(null);
  
  // Estados para notificaciones
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { data, loading, error } = useListAsignaciones({
    page: page,
    limit: pageSize,
    nombre: activeSearchQuery
  });

  const { 
    eliminarAsignacion, 
    loading: deleteLoading, 
    error: deleteError, 
    data: deleteData 
  } = useEliminarAsignacion();

  // Extraer datos de la respuesta
  const asignaciones = data?.asignaciones || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Persistir filtros cuando cambien
  useEffect(() => {
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

  // Efecto para manejar el resultado de la eliminación
  useEffect(() => {
    if (deleteData) {
      setNotification({ type: 'success', message: deleteData.message });
      setShowDeleteModal(false);
      setAsignacionToDelete(null);
      
      // Ocultar notificación después de 3 segundos
      setTimeout(() => setNotification(null), 3000);
      
      // Recargar la lista (esto se hace automáticamente al cambiar el estado)
      // Si estamos en una página > 1 y solo quedaba 1 registro, volver a la página anterior
      if (asignaciones.length === 1 && page > 1) {
        setPage(page - 1);
      }
    }
  }, [deleteData]);

  useEffect(() => {
    if (deleteError) {
      setNotification({ type: 'error', message: deleteError });
      
      // Ocultar notificación después de 5 segundos
      setTimeout(() => setNotification(null), 5000);
    }
  }, [deleteError]);

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchQuery(searchQuery);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  // Funciones para manejar la eliminación
  const handleDeleteClick = (asignacion: any) => {
    const nombreCompleto = `${asignacion.alumno?.primerNombre || ''} ${asignacion.alumno?.primerApellido || ''}`.trim();
    setAsignacionToDelete({ 
      id: asignacion.id, 
      nombre: nombreCompleto || `Asignación #${asignacion.id}` 
    });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (asignacionToDelete) {
      await eliminarAsignacion(asignacionToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAsignacionToDelete(null);
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

  // Obtener clase para el badge según estado
  const getEstadoBadgeClass = (estadoId: number) => {
    switch (estadoId) {
      case 1: return styles.badgeActive;
      case 2: return styles.badgeInactive;
      default: return '';
    }
  };

  // Renderizar asignación con resaltado condicional
  const renderAsignacionRow = (asignacion: any) => {
    // Verificar si el ciclo ha finalizado y el estado es activo
    const cicloFinalizado = asignacion.gradoCiclo?.ciclo?.fechaFin !== null;
    const esActivo = asignacion.idEstadoAsignacion === 1;
    const mostrarFinalizado = esActivo && cicloFinalizado;
    
    return (
      <tr key={asignacion.id} className={styles.userRow}>
        <td>
          <div className={styles.nameCell}>
            <div className={styles.avatar}>
              {asignacion.alumno?.primerNombre?.charAt(0) || ''}
              {asignacion.alumno?.primerApellido?.charAt(0) || ''}
            </div>
            <div>
              <div className={styles.userName}>{asignacion.alumno?.cui || 'N/A'}</div>
              <div className={styles.userEmail}>{asignacion.alumno?.telefono || 'Sin teléfono'}</div>
            </div>
          </div>
        </td>
        <td>{asignacion.alumno?.telefono || 'N/A'}</td>
        <td>{`${asignacion.gradoCiclo?.grado?.nombre || 'N/A'}`}</td>
        <td>{asignacion.gradoCiclo?.ciclo?.descripcion || 'N/A'}</td>
        <td>
          <span 
            className={`${styles.badge} ${mostrarFinalizado ? styles.badgeInactive : getEstadoBadgeClass(asignacion.idEstadoAsignacion)}`}
          >
            {mostrarFinalizado ? 'Finalizado' : (asignacion.estadoAsignacion?.descripcion || 'N/A')}
          </span>
        </td>
        <td className={styles.dateCell}>
          {formatDate(asignacion.createdAt)}
        </td>
        <td className={styles.actionCell}>
          <Link
            to={`/admin/asignaciones/${asignacion.id}`}
            className={`${styles.actionButton} ${styles.view}`}
            title="Ver detalles"
          >
            <FaEye size={16} />
          </Link>
          <Link
            to={`/admin/asignaciones/editar/${asignacion.id}`}
            className={`${styles.actionButton} ${styles.edit}`}
            title="Editar asignación"
          >
            <FaPencilAlt size={16} />
          </Link>
          <button
            className={`${styles.actionButton} ${styles.delete}`}
            onClick={() => handleDeleteClick(asignacion)}
            title="Eliminar asignación"
          >
            <FaTrash size={16} />
          </button>
        </td>
      </tr>
    );
  };
  
  // Renderizar cuerpo de la tabla o mensaje vacío
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7} className={styles.emptyState}>
            <div className={styles.emptyMessage}>
              Cargando asignaciones...
            </div>
          </td>
        </tr>
      );
    }
    
    if (error) {
      return (
        <tr>
          <td colSpan={7} className={styles.emptyState}>
            <div className={styles.emptyIcon}>⚠️</div>
            <div className={styles.emptyMessage}>
              Error al cargar las asignaciones: {error.message}
            </div>
          </td>
        </tr>
      );
    }
    
    if (asignaciones.length === 0) {
      return (
        <tr>
          <td colSpan={7} className={styles.emptyState}>
            <div className={styles.emptyIcon}>📚</div>
            <div className={styles.emptyMessage}>
              No se encontraron asignaciones.
              {activeSearchQuery && (
                <p>Intenta con una búsqueda diferente o quita los filtros.</p>
              )}
            </div>
          </td>
        </tr>
      );
    }
    
    return asignaciones.map(renderAsignacionRow);
  };
  
  return (
    <div className={styles.pageContainer}>
      {/* Encabezado con botón de crear asignación */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <FaGraduationCap size={28} />
          Asignaciones de Alumnos
          <span className={styles.badgeCount}>
            {total}
          </span>
        </div>

        <Link to="/admin/asignaciones/crear" className={styles.createButton}>
          <FaPlus size={16} />
          Nueva Asignación
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
                placeholder="Buscar por nombre de alumno"
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

      {/* Tabla de asignaciones */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Alumno</th>
                <th>Teléfono</th>
                <th>Grado</th>
                <th>Ciclo</th>
                <th>Estado</th>
                <th>Fecha Asignación</th>
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
              Mostrando {asignaciones.length} de {total} registros
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

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Eliminar Asignación"
        message={`¿Está seguro que desea eliminar la asignación de ${asignacionToDelete?.nombre || 'este alumno'}?`}
        itemId={asignacionToDelete?.id.toString() || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={deleteLoading}
        confirmButtonText="Eliminar"
      />

      {/* Notificación flotante */}
      {notification && (
        <div className={`${styles.notification} ${notification.type === 'success' ? styles.successNotification : styles.errorNotification}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AsignacionesListPage;
