import { useState } from "react";
import { useListMisCursos } from "../hooks/useListMisCursos";
import styles from "./MisCursosPage.module.css";
import { FaSearch, FaBook, FaExclamationTriangle, FaUserGraduate, FaTasks, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

// Opciones para el número de registros por página
const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50];

const MisCursosPage = () => {
  const { misCursos, esCatedratico, error, loading } = useListMisCursos();
  
  // Estado para la paginación y búsqueda
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "activos" | "finalizados">("todos");
  
  // Filtrar cursos por búsqueda y estado
  const filteredCursos = misCursos ? misCursos.filter(curso => {
    // Filtro por búsqueda
    if (activeSearchQuery) {
      const searchTerm = activeSearchQuery.toLowerCase();
      const matchesSearch = (
        (curso.nombre && curso.nombre.toLowerCase().includes(searchTerm)) ||
        (curso.gradoCiclo?.grado?.nombre && curso.gradoCiclo.grado.nombre.toLowerCase().includes(searchTerm)) ||
        (curso.gradoCiclo?.ciclo?.descripcion && curso.gradoCiclo.ciclo.descripcion.toLowerCase().includes(searchTerm)) ||
        (curso.gradoCiclo?.grado?.nivelAcademico?.descripcion && curso.gradoCiclo.grado.nivelAcademico.descripcion.toLowerCase().includes(searchTerm)) ||
        (curso.gradoCiclo?.grado?.jornada?.descripcion && curso.gradoCiclo.grado.jornada.descripcion.toLowerCase().includes(searchTerm))
      );
      if (!matchesSearch) return false;
    }
    
    // Filtro por estado
    const cursoFinalizado = curso.gradoCiclo?.ciclo?.fechaFin !== null;
    if (statusFilter === "activos" && cursoFinalizado) return false;
    if (statusFilter === "finalizados" && !cursoFinalizado) return false;
    
    return true;
  }) : [];
  
  // Calcular datos de paginación
  const totalCursos = filteredCursos.length;
  const totalPages = Math.ceil(totalCursos / pageSize) || 1;
  const paginatedCursos = filteredCursos.slice((page - 1) * pageSize, page * pageSize);
  
  // Calcular estadísticas de cursos
  const cursosActivos = misCursos ? misCursos.filter(curso => curso.gradoCiclo?.ciclo?.fechaFin === null).length : 0;
  const cursosFinalizados = misCursos ? misCursos.filter(curso => curso.gradoCiclo?.ciclo?.fechaFin !== null).length : 0;
  
  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchQuery(searchQuery);
    setPage(1); // Reset a página 1 al buscar
  };
  
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1); // Reset a página 1 al cambiar tamaño
  };
  
  // Renderizar tabla o mensaje de no cursos
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7} className={styles.emptyState}>
            <div className={styles.emptyIcon}>⌛</div>
            <div className={styles.emptyMessage}>Cargando cursos...</div>
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
              Error al cargar los cursos: {error}
            </div>
          </td>
        </tr>
      );
    }
    
    if (paginatedCursos.length === 0) {
      let message = "No tienes cursos asignados en este momento";
      
      if (activeSearchQuery && statusFilter !== "todos") {
        message = `No se encontraron cursos ${statusFilter} que coincidan con "${activeSearchQuery}"`;
      } else if (activeSearchQuery) {
        message = `No se encontraron cursos que coincidan con "${activeSearchQuery}"`;
      } else if (statusFilter === "activos") {
        message = "No tienes cursos activos en este momento";
      } else if (statusFilter === "finalizados") {
        message = "No tienes cursos finalizados";
      }
      
      return (
        <tr>
          <td colSpan={7} className={styles.emptyState}>
            <div className={styles.emptyIcon}>📚</div>
            <div className={styles.emptyMessage}>{message}</div>
          </td>
        </tr>
      );
    }
    
    return paginatedCursos.map((curso, index) => {
      // Verificar si el curso ha finalizado
      const cursoFinalizado = curso.gradoCiclo?.ciclo?.fechaFin !== null;
      
      return (
        <tr 
          key={curso.id || index} 
          className={`${styles.courseRow} ${cursoFinalizado ? styles.finished : ''}`}
        >
          <td>
            <div className={styles.nameCell}>
              <div className={styles.avatar}>
                {curso.nombre?.substring(0, 2) || "CR"}
              </div>
              <div>
                <div className={`${styles.courseTitle} ${cursoFinalizado ? styles.finished : ''}`}>
                  {curso.nombre}
                  {cursoFinalizado && (
                    <span className={styles.finishedBadge}>
                      <FaCheckCircle className={styles.finishedIcon} />
                      FINALIZADO
                    </span>
                  )}
                </div>
                <div className={`${styles.courseCode} ${cursoFinalizado ? styles.finished : ''}`}>
                  ID: {curso.id}
                </div>
              </div>
            </div>
          </td>
        <td className={styles.centeredCell}>{curso.notaMaxima || "N/A"}</td>
        <td className={styles.centeredCell}>{curso.notaAprobada || "N/A"}</td>
        <td>{curso.gradoCiclo?.grado?.nombre || "N/A"}</td>
        <td className={styles.badgeCell}>
          <div className={styles.badgeContainer}>
            <span className={`${styles.badge} ${styles.badgeStudent}`}>
              {curso.gradoCiclo?.grado?.nivelAcademico?.descripcion || "N/A"}
            </span>
          </div>
        </td>
        <td className={styles.badgeCell}>
          <div className={styles.badgeContainer}>
            <span className={`${styles.badge} ${styles.badgeParent}`}>
              {curso.gradoCiclo?.grado?.jornada?.descripcion || "N/A"}
            </span>
          </div>
        </td>
        <td className={styles.actionCell}>
          <div className={styles.actionButtonsContainer}>
            <Link
              to={`/mis-cursos/${curso.id}`}
              className={`${styles.actionButton} ${styles.view}`}
              title="Ver detalle"
            >
              <FaBook size={16} />
            </Link>
            {esCatedratico && !cursoFinalizado && (
              <Link
                to={`/mis-cursos/${curso.id}/nueva-tarea`}
                className={`${styles.actionButton} ${styles.edit}`}
                title="Nueva tarea"
              >
                <FaTasks size={16} />
              </Link>
            )}
          </div>
        </td>
      </tr>
      );
    });
  };

  return (
    <div className={styles.pageContainer}>
      {/* Encabezado con título */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <FaUserGraduate size={28} />
          Mis Cursos
          <span className={styles.badgeCount}>{misCursos?.length || 0}</span>
        </div>
        <div className={styles.coursesStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{cursosActivos}</span>
            <span className={styles.statLabel}>Activos</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{cursosFinalizados}</span>
            <span className={styles.statLabel}>Finalizados</span>
          </div>
        </div>
      </div>

      {/* Mostrar mensaje de advertencia si no es catedrático */}
      {!esCatedratico && (
        <div className={styles.warningMessage}>
          <FaExclamationTriangle className={styles.warningIcon} />
          <div>
            <strong>Atención:</strong> Al no ser catedrático no tienes cursos asignados.
          </div>
        </div>
      )}

      {/* Barra de búsqueda y filtros */}
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
                placeholder="Buscar por curso, grado, ciclo, nivel académico o jornada"
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
          
          {/* Filtro de estado */}
          <div className={styles.statusFilter}>
            <label htmlFor="statusFilter">Estado:</label>
            <select
              id="statusFilter"
              className={styles.selectFilter}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "todos" | "activos" | "finalizados");
                setPage(1);
              }}
            >
              <option value="todos">Todos los cursos</option>
              <option value="activos">Solo activos</option>
              <option value="finalizados">Solo finalizados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Indicador de búsqueda activa */}
      {(activeSearchQuery || statusFilter !== "todos") && (
        <div className={styles.activeSearchIndicator}>
          {activeSearchQuery && (
            <>
              <span className={styles.searchLabel}>Búsqueda:</span>
              <span className={styles.searchTerm}>{activeSearchQuery}</span>
            </>
          )}
          {statusFilter !== "todos" && (
            <>
              <span className={styles.searchLabel}>Estado:</span>
              <span className={styles.searchTerm}>
                {statusFilter === "activos" ? "Cursos activos" : "Cursos finalizados"}
              </span>
            </>
          )}
          <button 
            className={styles.clearSearchButton}
            onClick={() => {
              setActiveSearchQuery("");
              setSearchQuery("");
              setStatusFilter("todos");
              setPage(1);
            }}
            title="Limpiar filtros"
          >
            ×
          </button>
        </div>
      )}

      {/* Tabla de cursos */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Curso</th>
                <th className={styles.centeredCell}>Nota Máxima</th>
                <th className={styles.centeredCell}>Nota Aprobada</th>
                <th>Grado</th>
                <th className={styles.badgeCell}>Nivel Académico</th>
                <th className={styles.badgeCell}>Jornada</th>
                <th className={styles.actionColumn}>Acciones</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {renderTableBody()}
            </tbody>
          </table>

          {/* Footer con paginación */}
          {paginatedCursos.length > 0 && (
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
                Mostrando {Math.min(paginatedCursos.length, pageSize)} de {totalCursos} registros
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MisCursosPage;
