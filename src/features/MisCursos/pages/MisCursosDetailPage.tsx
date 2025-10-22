import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useMiCurso } from "../hooks/useMiCurso";
import { useCreateTareaAlumno } from "../../TareasAlumno/hooks/useCreateTareaAlumno";
import styles from "./MisCursosDetailPage.module.css";
import type { Bimestre, AsignacionAlumno, Tarea } from "../../../interfaces/interfaces";
import {
  FaArrowLeft,
  FaBook,
  FaCalendarAlt,
  FaGraduationCap,
  FaPhone,
  FaClock,
  FaTasks,
  FaSpinner,
  FaExclamationTriangle,
  FaLayerGroup,
  FaCheckCircle,
  FaUsers,
  FaUserGraduate,
  FaSearch
} from "react-icons/fa";

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
};

const getInitials = (firstName: string, lastName: string) => {
  return (firstName?.charAt(0) || "") + (lastName?.charAt(0) || "");
};

// Modal para calificar tarea
interface CalificarModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarea: Tarea | null;
  alumnoNombre: string;
  onSubmit: (punteo: number, fecha: string) => void;
  loading: boolean;
  error: string | null;
}

const CalificarModal = ({ isOpen, onClose, tarea, alumnoNombre, onSubmit, loading, error }: CalificarModalProps) => {
  const [punteo, setPunteo] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPunteo("");
      setFechaEntrega("");
    }
  }, [isOpen]);

  if (!isOpen || !tarea) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Number(punteo), fechaEntrega);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "24px",
        minWidth: "400px",
        maxWidth: "500px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}>
        <h2 style={{ marginTop: 0, marginBottom: "20px", fontSize: "1.5rem", color: "#1f2937" }}>
          Calificar Tarea
        </h2>
        
        <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Alumno:</strong> <span style={{ color: "#6b7280" }}>{alumnoNombre}</span>
          </div>
          <div>
            <strong style={{ color: "#374151" }}>Tarea:</strong> <span style={{ color: "#6b7280" }}>{tarea.titulo}</span>
          </div>
          <div style={{ marginTop: "4px", fontSize: "0.875rem", color: "#9ca3af" }}>
            Punteo máximo: {tarea.punteo} pts
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
              Punteo obtenido:
            </label>
            <input
              type="number"
              min={0}
              max={tarea.punteo}
              step="0.01"
              value={punteo}
              onChange={(e) => setPunteo(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
              Fecha de entrega:
            </label>
            <input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: "12px",
              marginBottom: "16px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "6px",
              color: "#dc2626",
              fontSize: "0.875rem"
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "10px 20px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "white",
                color: "#374151",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: loading ? "#9ca3af" : "#1976d2",
                color: "white",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MisCursosDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { curso: cursoOriginal, error, loading } = useMiCurso(id);
  const [curso, setCurso] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedBimestre, setSelectedBimestre] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para el modal de calificación
  const [modalOpen, setModalOpen] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<string>("");
  const [asignacionId, setAsignacionId] = useState<number | null>(null);
  const { createTarea, loading: loadingCreate, error: errorCreate } = useCreateTareaAlumno();

  // Sincronizar el curso original con el estado local
  useEffect(() => {
    if (cursoOriginal) {
      setCurso(cursoOriginal);
    }
  }, [cursoOriginal]);
  
  useEffect(() => {
    if (curso?.gradoCiclo?.ciclo?.bimestres) {
      // Buscar si hay algún bimestre con estado 1 (activo)
      const bimestres = curso.gradoCiclo.ciclo.bimestres;
      const activeBimestre = bimestres.find((bim: Bimestre) => bim.idEstado === 1);
      if (activeBimestre) {
        setSelectedBimestre(activeBimestre.id);
      } else {
        // Si no hay bimestres activos, seleccionar el primero
        setSelectedBimestre(bimestres[0]?.id || null);
      }
    }
  }, [curso]);

  // Funciones para manejar el modal de calificación
  const handleAbrirModalCalificar = (tarea: Tarea, asignacion: AsignacionAlumno) => {
    setTareaSeleccionada(tarea);
    setAlumnoSeleccionado(`${asignacion.alumno.primerNombre} ${asignacion.alumno.primerApellido}`);
    setAsignacionId(asignacion.id);
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setTareaSeleccionada(null);
    setAlumnoSeleccionado("");
    setAsignacionId(null);
  };

  const handleGuardarCalificacion = async (punteo: number, fechaEntrega: string) => {
    if (!tareaSeleccionada || !asignacionId || !curso) return;
    
    const resultado = await createTarea({
      idTarea: tareaSeleccionada.id,
      idAsignacionAlumno: asignacionId,
      fechaEntrega,
      puntoObtenido: punteo
    });

    if (resultado && resultado.tareaAlumno) {
      // Actualizar el estado local del curso con la nueva calificación
      setCurso((prevCurso: any) => {
        if (!prevCurso) return prevCurso;
        
        // Crear una copia profunda del curso
        const cursoActualizado = { ...prevCurso };
        
        // Actualizar la asignación del alumno con la nueva tarea calificada
        if (cursoActualizado.gradoCiclo?.asignacionesAlumno) {
          cursoActualizado.gradoCiclo.asignacionesAlumno = cursoActualizado.gradoCiclo.asignacionesAlumno.map((asignacion: any) => {
            if (asignacion.id === asignacionId) {
              return {
                ...asignacion,
                tareaAlumnos: [
                  ...(asignacion.tareaAlumnos || []),
                  resultado.tareaAlumno
                ]
              };
            }
            return asignacion;
          });
        }
        
        return cursoActualizado;
      });
      
      // Cerrar modal
      handleCerrarModal();
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.loadingIcon} />
        <p className={styles.loadingText}>Cargando información del curso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle style={{ marginRight: "8px" }} />
        <span>Error al cargar el curso: {error}</span>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle style={{ marginRight: "8px" }} />
        <span>No se encontró el curso solicitado.</span>
      </div>
    );
  }
  
  // Dejar solo para verificar la estructura

  const {
    nombre,
    notaMaxima,
    notaAprobada,
    createdAt,
    gradoCiclo,
    catedratico
  } = curso;
  
  // Verificar si el curso ha finalizado
  const cursoFinalizado = gradoCiclo?.ciclo?.fechaFin !== null;
  
  // Los bimestres están dentro de gradoCiclo.ciclo.bimestres, no directamente en curso
  const bimestres = gradoCiclo?.ciclo?.bimestres || [];
  
  // Obtener el bimestre seleccionado o el primero si no hay selección
  const bimestreActual = bimestres.find((b: Bimestre) => b.id === selectedBimestre) || bimestres[0];
  
  // Mostrar todas las tareas sin filtrar para verificar que existen
  let tareasActuales = curso.tareas || [];
  
  // Calcular el punteo total de todas las tareas del bimestre actual
  const totalPunteoTareas = tareasActuales.length > 0
    ? tareasActuales.reduce((total:any, tarea:any) => total + (tarea.punteo || 0), 0)
    : 0;

  const teacher = catedratico?.usuario;
  const teacherName = teacher ? `${teacher.primerNombre} ${teacher.primerApellido}` : "N/A";
  const teacherInitials = teacher ? getInitials(teacher.primerNombre, teacher.primerApellido) : "NA";

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={`${styles.courseHeader} ${cursoFinalizado ? styles.finished : ''}`}>
        <Link to="/mis-cursos" className={styles.backButton}>
          <FaArrowLeft /> Volver a mis cursos
        </Link>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 className={styles.courseTitle}>
            {nombre}
            {cursoFinalizado && (
              <span className={styles.finishedBadge}>
                <FaCheckCircle className={styles.finishedIcon} />
                CURSO FINALIZADO
              </span>
            )}
          </h1>
          <div>
            <strong>{gradoCiclo?.grado?.nombre || "Grado N/A"}</strong> | {gradoCiclo?.grado?.nivelAcademico?.descripcion || "Nivel N/A"}
          </div>
          <div className={styles.courseMeta}>
            <div className={styles.metaItem}>
              <FaCalendarAlt /> {gradoCiclo?.ciclo?.descripcion || "Ciclo N/A"}
              {cursoFinalizado && (
                <span style={{ marginLeft: '8px', opacity: 0.8 }}>
                  (Finalizado el {formatDate(gradoCiclo?.ciclo?.fechaFin || undefined)})
                </span>
              )}
            </div>
            <div className={styles.metaItem}>
              <FaClock /> {gradoCiclo?.grado?.jornada?.descripcion || "Jornada N/A"}
            </div>
            <div className={styles.metaItem}>
              <FaGraduationCap /> Nota para aprobar: {notaAprobada} de {notaMaxima}
            </div>
          </div>
        </div>
        <div className={styles.headerPattern}>
          <FaBook size={300} />
        </div>
      </div>

      {/* Content */}
      <div className={styles.mainContent}>
        <div className={styles.courseContent}>
          <div className={styles.tabGroup}>
            <div
              className={`${styles.tab} ${activeTab === "info" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Información General
            </div>
            <div
              className={`${styles.tab} ${activeTab === "tasks" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("tasks")}
            >
              Tareas
            </div>
            <div
              className={`${styles.tab} ${activeTab === "notes" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("notes")}
            >
              Notas
            </div>
            <div
              className={`${styles.tab} ${activeTab === "students" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("students")}
            >
              Alumnos
            </div>
          </div>
          
          {(activeTab === "tasks" || activeTab === "notes") && bimestres.length > 0 && (
            <div className={styles.bimestreSelector}>
              <div className={styles.bimestreLabel}>
                <FaLayerGroup className={styles.bimestreIcon} />
                <span>Bimestre actual:</span>
              </div>
              <div className={styles.selectWrapper}>
                <select 
                  value={selectedBimestre || ''} 
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    setSelectedBimestre(newValue);
                  }}
                  className={styles.bimestreSelect}
                >
                  {bimestres.map((bim: Bimestre) => (
                    <option key={bim.id} value={bim.id}>
                      Bimestre {bim.numeroBimestre} - {bim.estado.descripcion}
                    </option>
                  ))}
                </select>
                <div className={styles.selectArrow}></div>
              </div>
            </div>
          )}

          <div className={styles.contentBody}>
            {activeTab === "info" && (
              <>
                <div className={styles.contentHeader}>
                  <h3 className={styles.contentTitle}>Detalles del curso</h3>
                </div>
                <div className={styles.courseInfo}>
                  <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>Nombre del curso</div>
                    <div className={styles.infoValue}>{nombre}</div>
                  </div>
                  <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>Grado</div>
                    <div className={styles.infoValue}>{gradoCiclo?.grado?.nombre || "N/A"}</div>
                  </div>
                  <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>Nivel académico</div>
                    <div className={styles.infoValue}>
                      {gradoCiclo?.grado?.nivelAcademico?.descripcion || "N/A"}
                    </div>
                  </div>
                  <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>Jornada</div>
                    <div className={styles.infoValue}>
                      {gradoCiclo?.grado?.jornada?.descripcion || "N/A"}
                    </div>
                  </div>
                  <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>Ciclo</div>
                    <div className={styles.infoValue}>
                      {gradoCiclo?.ciclo?.descripcion || "N/A"}
                    </div>
                  </div>
                  <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>Estado del curso</div>
                    <div className={styles.infoValue} style={{ 
                      color: cursoFinalizado ? '#ef4444' : '#10b981',
                      fontWeight: '600'
                    }}>
                      {cursoFinalizado ? (
                        <>
                          <FaCheckCircle style={{ marginRight: '6px', fontSize: '0.9rem' }} />
                          Finalizado
                        </>
                      ) : (
                        <>
                          <FaClock style={{ marginRight: '6px', fontSize: '0.9rem' }} />
                          Activo
                        </>
                      )}
                    </div>
                  </div>
                  {cursoFinalizado && (
                    <div className={styles.infoCard}>
                      <div className={styles.infoLabel}>Fecha de finalización</div>
                      <div className={styles.infoValue}>
                        {formatDate(gradoCiclo?.ciclo?.fechaFin || undefined)}
                      </div>
                    </div>
                  )}
                  <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>Nota máxima</div>
                    <div className={styles.infoValue}>{notaMaxima} pts.</div>
                  </div>
                  <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>Nota para aprobar</div>
                    <div className={styles.infoValue}>{notaAprobada} pts.</div>
                  </div>
                  <div className={styles.infoCard}>
                    <div className={styles.infoLabel}>Fecha de creación</div>
                    <div className={styles.infoValue}>{formatDate(createdAt)}</div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "tasks" && (
              <div className={styles.tasksContainer}>
                {cursoFinalizado && (
                  <div className={styles.finishedNotice}>
                    <FaCheckCircle />
                    <span>
                      <strong>Curso finalizado:</strong> No se pueden crear nuevas tareas. 
                      Todas las tareas mostradas son del período académico completado.
                    </span>
                  </div>
                )}
                {curso.tareas && Array.isArray(curso.tareas) && curso.tareas.length > 0 ? (
                  <>
                    <div className={styles.tasksHeader}>
                      <h3 className={styles.sectionTitle}>
                        Tareas del Bimestre {bimestreActual?.numeroBimestre}
                      </h3>
                      {selectedBimestre && (
                        <p className={styles.taskCount}>
                          {curso.tareas.filter(tarea => tarea.idBimestre === selectedBimestre).length} tareas en este bimestre
                        </p>
                      )}
                    </div>
                    <div className={styles.tasksList}>
                      {curso.tareas
                        .filter(tarea => tarea.idBimestre === selectedBimestre)
                        .map((tarea) => {
                        return (
                          <div key={tarea.id} className={styles.taskCard}>
                            <div className={styles.taskHeader}>
                              <h4 className={styles.taskTitle}>
                                {tarea.titulo || "Sin título"}
                                <span style={{fontWeight: 'normal', fontSize: '0.8em', color: '#666', marginLeft: '8px'}}>
                                  (ID Bimestre: {tarea.idBimestre})
                                </span>
                              </h4>
                              <div className={styles.taskPoints}>
                                {tarea.punteo !== undefined && tarea.punteo !== null 
                                  ? `${tarea.punteo} pts`
                                  : "Punteo no asignado"}
                              </div>
                            </div>
                            <p className={styles.taskDescription}>{tarea.descripcion || "Sin descripción"}</p>
                            <div className={styles.taskFooter}>
                              <div className={styles.taskDueDate}>
                                <FaCalendarAlt size={14} />
                                <span>Fecha de entrega: {formatDate(tarea.fechaEntrega)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <FaTasks style={{ fontSize: "3rem", color: "#cbd5e1", marginBottom: "16px" }} />
                    {curso.tareas && Array.isArray(curso.tareas) && curso.tareas.length > 0 ? (
                      // Tiene tareas pero no para este bimestre
                      <h3 style={{ color: "#64748b", fontWeight: "500" }}>No hay tareas para el Bimestre {bimestreActual?.numeroBimestre}</h3>
                    ) : (
                      // No tiene tareas en absoluto
                      <h3 style={{ color: "#64748b", fontWeight: "500" }}>No hay tareas disponibles en este curso</h3>
                    )}
                    <div style={{ color: "#94a3b8", marginTop: "12px" }}>
                      <p>Estado de la carga de tareas:</p>
                      <ul style={{ listStyle: "none", padding: "10px 0" }}>
                        <li>curso.tareas existe: {curso.tareas ? "Sí" : "No"}</li>
                        <li>curso.tareas es un array: {Array.isArray(curso.tareas) ? "Sí" : "No"}</li>
                        <li>Cantidad de tareas totales: {Array.isArray(curso.tareas) ? curso.tareas.length : "N/A"}</li>
                        <li>Bimestre seleccionado: {selectedBimestre} (Bimestre {bimestreActual?.numeroBimestre})</li>
                        <li>Tareas en este bimestre: {curso.tareas && Array.isArray(curso.tareas) ? 
                          curso.tareas.filter(t => t.idBimestre === selectedBimestre).length : "N/A"}</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "notes" && (
              <div className={styles.notesContainer}>
                <div className={styles.notesHeader}>
                  <div className={styles.notesHeaderTop}>
                    <div>
                      <h3 className={styles.sectionTitle}>
                        <FaGraduationCap style={{ marginRight: '8px' }} />
                        Calificaciones - Bimestre {bimestreActual?.numeroBimestre}
                      </h3>
                      <p className={styles.notesSubtitle}>
                        {gradoCiclo?.asignacionesAlumno?.filter(asignacion => {
                          const alumno = asignacion.alumno;
                          const fullName = `${alumno.primerNombre} ${alumno.segundoNombre || ''} ${alumno.primerApellido} ${alumno.segundoApellido}`.toLowerCase();
                          return fullName.includes(searchTerm.toLowerCase()) || alumno.cui.includes(searchTerm);
                        }).length || 0} estudiantes • {' '}
                        {curso.tareas?.filter(t => t.idBimestre === selectedBimestre).length || 0} tareas
                      </p>
                    </div>
                    <div className={styles.searchContainer}>
                      <FaSearch className={styles.searchIcon} />
                      <input
                        type="text"
                        placeholder="Buscar estudiante por nombre o CUI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                      />
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm('')}
                          className={styles.clearButton}
                          aria-label="Limpiar búsqueda"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {gradoCiclo?.asignacionesAlumno && gradoCiclo.asignacionesAlumno.length > 0 ? (
                  <>
                    {(() => {
                      const filteredStudents = gradoCiclo.asignacionesAlumno.filter(asignacion => {
                        const alumno = asignacion.alumno;
                        const fullName = `${alumno.primerNombre} ${alumno.segundoNombre || ''} ${alumno.primerApellido} ${alumno.segundoApellido}`.toLowerCase();
                        return fullName.includes(searchTerm.toLowerCase()) || alumno.cui.includes(searchTerm);
                      });

                      if (filteredStudents.length === 0) {
                        return (
                          <div className={styles.noResults}>
                            <FaSearch style={{ fontSize: '2.5rem', color: '#cbd5e1', marginBottom: '12px' }} />
                            <h3 style={{ color: '#64748b', fontWeight: '500', margin: '0 0 8px 0' }}>
                              No se encontraron estudiantes
                            </h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                              Intenta con otro término de búsqueda
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className={styles.gradesGrid}>
                          {filteredStudents.map((asignacion) => {
                      const alumno = asignacion.alumno;
                      const fullName = `${alumno.primerNombre} ${alumno.segundoNombre || ''} ${alumno.tercerNombre || ''} ${alumno.primerApellido} ${alumno.segundoApellido}`.replace(/\s+/g, ' ').trim();
                      
                      // Filtrar tareas del bimestre actual
                      const tareasDelBimestre = curso.tareas?.filter(
                        tarea => tarea.idBimestre === selectedBimestre
                      ) || [];
                      
                      // Calcular total de puntos obtenidos
                      const totalObtenido = tareasDelBimestre.reduce((sum, tarea) => {
                        const tareaAlumno = asignacion.tareaAlumnos?.find(
                          ta => ta.idTarea === tarea.id
                        );
                        return sum + (tareaAlumno ? parseFloat(tareaAlumno.punteoObtenido) : 0);
                      }, 0);
                      
                      // Calcular total posible
                      const totalPosible = tareasDelBimestre.reduce((sum, tarea) => sum + tarea.punteo, 0);
                      const porcentajeTotal = totalPosible > 0 ? (totalObtenido / totalPosible) * 100 : 0;
                      const isApproved = porcentajeTotal >= 60;
                      
                      return (
                        <div key={asignacion.id} className={styles.gradeCard}>
                          {/* Header del alumno */}
                          <div className={styles.gradeCardHeader}>
                            <div className={styles.studentInfo}>
                              <div className={styles.studentAvatarLarge}>
                                {getInitials(alumno.primerNombre, alumno.primerApellido)}
                              </div>
                              <div className={styles.studentDetails}>
                                <h4 className={styles.studentNameLarge}>{fullName}</h4>
                                <span className={styles.studentCui}>CUI: {alumno.cui}</span>
                              </div>
                            </div>
                            <div className={`${styles.statusBadge} ${isApproved ? styles.approved : styles.failed}`}>
                              {isApproved ? '✓ Aprobado' : '✗ Reprobado'}
                            </div>
                          </div>

                          {/* Resumen de puntos */}
                          <div className={styles.gradeSummary}>
                            <div className={styles.summaryItem}>
                              <span className={styles.summaryLabel}>Total obtenido</span>
                              <span className={`${styles.summaryValue} ${isApproved ? styles.approved : styles.failed}`}>
                                {totalObtenido.toFixed(2)} pts
                              </span>
                            </div>
                            <div className={styles.summaryDivider}>/</div>
                            <div className={styles.summaryItem}>
                              <span className={styles.summaryLabel}>Total posible</span>
                              <span className={styles.summaryValue}>{totalPosible} pts</span>
                            </div>
                            <div className={styles.summaryDivider}>•</div>
                            <div className={styles.summaryItem}>
                              <span className={styles.summaryLabel}>Porcentaje</span>
                              <span className={`${styles.summaryValue} ${isApproved ? styles.approved : styles.failed}`}>
                                {porcentajeTotal.toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          {/* Barra de progreso */}
                          <div className={styles.progressBarContainer}>
                            <div 
                              className={`${styles.progressBarFill} ${isApproved ? styles.approved : styles.failed}`}
                              style={{ width: `${Math.min(porcentajeTotal, 100)}%` }}
                            ></div>
                          </div>

                          {/* Lista de tareas */}
                          <div className={styles.taskGradesList}>
                            <div className={styles.taskGradesHeader}>
                              <span>Tareas calificadas</span>
                              <span>{asignacion.tareaAlumnos?.filter(ta => 
                                tareasDelBimestre.some(t => t.id === ta.idTarea)
                              ).length || 0} / {tareasDelBimestre.length}</span>
                            </div>
                            {tareasDelBimestre.map((tarea) => {
                              const tareaAlumno = asignacion.tareaAlumnos?.find(
                                ta => ta.idTarea === tarea.id
                              );
                              const punteo = tareaAlumno ? parseFloat(tareaAlumno.punteoObtenido) : null;
                              const porcentaje = punteo !== null ? (punteo / tarea.punteo) * 100 : null;
                              
                              return (
                                <div key={tarea.id} className={styles.taskGradeItem}>
                                  <div className={styles.taskGradeInfo}>
                                    <FaTasks className={styles.taskIcon} />
                                    <div className={styles.taskGradeDetails}>
                                      <span className={styles.taskGradeName}>{tarea.titulo}</span>
                                      <span className={styles.taskGradeMax}>Máximo: {tarea.punteo} pts</span>
                                    </div>
                                  </div>
                                  <div className={styles.taskGradeScore}>
                                    {punteo !== null ? (
                                      <>
                                        <span 
                                          className={styles.taskGradeValue}
                                          style={{
                                            color: porcentaje !== null && porcentaje >= 60 ? '#10b981' : '#ef4444'
                                          }}
                                        >
                                          {punteo.toFixed(2)}
                                        </span>
                                        <span className={styles.taskGradePercentage}>
                                          ({porcentaje?.toFixed(0)}%)
                                        </span>
                                      </>
                                    ) : (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span className={styles.taskNotGraded}>Sin calificar</span>
                                        <button
                                          onClick={() => handleAbrirModalCalificar(tarea, asignacion)}
                                          style={{
                                            padding: '6px 14px',
                                            backgroundColor: '#1976d2',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                          }}
                                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1565c0'}
                                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1976d2'}
                                        >
                                          Calificar
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <FaGraduationCap style={{ fontSize: "3rem", color: "#cbd5e1", marginBottom: "16px" }} />
                    <h3 style={{ color: "#64748b", fontWeight: "500" }}>
                      No hay alumnos inscritos en este curso
                    </h3>
                  </div>
                )}
              </div>
            )}

            {activeTab === "students" && (
              <div className={styles.studentsContainer}>
                <div className={styles.studentsHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>
                      <FaUserGraduate style={{ marginRight: '8px' }} />
                      Alumnos inscritos en el curso
                    </h3>
                    <p className={styles.studentCount}>
                      {gradoCiclo?.asignacionesAlumno?.filter(asignacion => {
                        const alumno = asignacion.alumno;
                        const fullName = `${alumno.primerNombre} ${alumno.segundoNombre || ''} ${alumno.primerApellido} ${alumno.segundoApellido}`.toLowerCase();
                        return fullName.includes(searchTerm.toLowerCase()) || alumno.cui.includes(searchTerm);
                      }).length || 0} estudiantes inscritos
                    </p>
                  </div>
                  <div className={styles.searchContainer}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Buscar estudiante por nombre o CUI..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className={styles.clearButton}
                        aria-label="Limpiar búsqueda"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {gradoCiclo?.asignacionesAlumno && gradoCiclo.asignacionesAlumno.length > 0 ? (
                  (() => {
                    const filteredStudents = gradoCiclo.asignacionesAlumno.filter(asignacion => {
                      const alumno = asignacion.alumno;
                      const fullName = `${alumno.primerNombre} ${alumno.segundoNombre || ''} ${alumno.primerApellido} ${alumno.segundoApellido}`.toLowerCase();
                      return fullName.includes(searchTerm.toLowerCase()) || alumno.cui.includes(searchTerm);
                    });

                    if (filteredStudents.length === 0) {
                      return (
                        <div className={styles.noResults}>
                          <FaSearch style={{ fontSize: '2.5rem', color: '#cbd5e1', marginBottom: '12px' }} />
                          <h3 style={{ color: '#64748b', fontWeight: '500', margin: '0 0 8px 0' }}>
                            No se encontraron estudiantes
                          </h3>
                          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                            Intenta con otro término de búsqueda
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className={styles.studentsList}>
                        {filteredStudents.map((asignacion: AsignacionAlumno) => {
                      const alumno = asignacion.alumno;
                      const fullName = `${alumno.primerNombre} ${alumno.segundoNombre || ''} ${alumno.tercerNombre || ''} ${alumno.primerApellido} ${alumno.segundoApellido}`.replace(/\s+/g, ' ').trim();
                      const initials = getInitials(alumno.primerNombre, alumno.primerApellido);
                      
                      return (
                        <div key={asignacion.id} className={styles.studentCard}>
                          <div className={styles.studentAvatar}>
                            {initials}
                          </div>
                          <div className={styles.studentInfo}>
                            <h4 className={styles.studentName}>{fullName}</h4>
                            <div className={styles.studentDetails}>
                              <div className={styles.studentDetail}>
                                <strong>CUI:</strong> {alumno.cui}
                              </div>
                              <div className={styles.studentDetail}>
                                <strong>Género:</strong> {alumno.genero === 'M' ? 'Masculino' : alumno.genero === 'F' ? 'Femenino' : alumno.genero}
                              </div>
                              {alumno.telefono && (
                                <div className={styles.studentDetail}>
                                  <FaPhone size={12} style={{ marginRight: '4px' }} />
                                  {alumno.telefono}
                                </div>
                              )}
                              <div className={styles.studentDetail}>
                                <strong>Estado:</strong> 
                                <span style={{ 
                                  color: asignacion.idEstadoAsignacion === 1 ? '#10b981' : '#ef4444',
                                  fontWeight: '600',
                                  marginLeft: '4px'
                                }}>
                                  {asignacion.idEstadoAsignacion === 1 ? 'Activo' : 'Inactivo'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                      </div>
                    );
                  })()
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <FaUsers style={{ fontSize: "3rem", color: "#cbd5e1", marginBottom: "16px" }} />
                    <h3 style={{ color: "#64748b", fontWeight: "500" }}>
                      No hay alumnos inscritos en este curso
                    </h3>
                    <p style={{ color: "#94a3b8", marginTop: "8px" }}>
                      Los alumnos inscritos aparecerán aquí
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.sidebarContent}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Docente</h3>
            <div className={styles.teacherCard}>
              <div className={styles.teacherAvatar}>{teacherInitials}</div>
              <div className={styles.teacherInfo}>
                <div className={styles.teacherName}>{teacherName}</div>
                <div className={styles.teacherRole}>{teacher?.tipoUsuario?.descripcion || "Docente"}</div>
                {teacher?.telefono && (
                  <div className={styles.teacherContact}>
                    <FaPhone size={12} /> {teacher.telefono}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Requisitos de aprobación</h3>
            <div className={styles.noteGroup}>
              <div className={styles.note}>
                <div className={styles.noteTitle}>Nota mínima para aprobar</div>
                <div className={styles.noteValue}>{notaAprobada} pts.</div>
              </div>
              <div className={styles.note}>
                <div className={styles.noteTitle}>Nota máxima del curso</div>
                <div className={styles.noteValue}>{notaMaxima} pts.</div>
              </div>
              <div className={styles.note}>
                <div className={styles.noteTitle}>Porcentaje requerido</div>
                <div className={styles.noteValue}>
                  {Math.round((notaAprobada / notaMaxima) * 100)}%
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Progreso de tareas</h3>
            <div className={styles.noteGroup}>
              <div className={styles.note}>
                <div className={styles.noteTitle}>Total punteo asignado</div>
                <div className={styles.noteValue}>{totalPunteoTareas} / {notaMaxima} pts.</div>
              </div>
              <div className={styles.note}>
                <div className={styles.noteTitle}>Porcentaje del curso</div>
                <div className={styles.noteValue} style={{ 
                  color: notaMaxima > 0 ? 
                    Math.round((totalPunteoTareas / notaMaxima) * 100) >= 100 ? '#ef4444' : '#10b981'
                    : '#64748b' 
                }}>
                  {notaMaxima > 0 ? Math.round((totalPunteoTareas / notaMaxima) * 100) : 0}%
                </div>
              </div>
              <div className={styles.progressSection}>
                <div className={styles.progressTitle}>
                  <span>Progreso de tareas</span>
                  <span className={styles.progressValue}>{totalPunteoTareas} / {notaMaxima}</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${Math.min(Math.round((totalPunteoTareas / notaMaxima) * 100), 100)}%`,
                      backgroundColor: notaMaxima > 0 && Math.round((totalPunteoTareas / notaMaxima) * 100) > 100 ? '#ef4444' : ''
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sidebarSection}>
            {cursoFinalizado ? (
              <div className={`${styles.actionButton} ${styles.disabled}`}>
                <FaCheckCircle size={16} /> Curso finalizado
              </div>
            ) : (
              <Link 
                to={`/crear-tarea?idCurso=${curso.id}&curso=${curso.nombre}${selectedBimestre ? `&nroBimestre=${bimestres.find(e => e.id == selectedBimestre)?.numeroBimestre}` : ''}`} 
                className={styles.actionButton}
              >
                <FaTasks size={16} /> Nueva tarea
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Modal de calificación */}
      <CalificarModal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        tarea={tareaSeleccionada}
        alumnoNombre={alumnoSeleccionado}
        onSubmit={handleGuardarCalificacion}
        loading={loadingCreate}
        error={errorCreate}
      />
    </div>
  );
};

export default MisCursosDetailPage;
