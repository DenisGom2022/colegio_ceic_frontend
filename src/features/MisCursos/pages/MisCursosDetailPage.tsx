import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useMiCurso } from "../hooks/useMiCurso";
import styles from "./MisCursosDetailPage.module.css";
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
  FaLayerGroup
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

const MisCursosDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { curso, error, loading } = useMiCurso(id);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedBimestre, setSelectedBimestre] = useState<number | null>(null);
  
  useEffect(() => {
    if (curso?.bimestres) {
      // Buscar si hay algún bimestre con estado 1 (activo)
      const activeBimestre = curso.bimestres.find(bim => bim.idEstado === 1);
      if (activeBimestre) {
        setSelectedBimestre(activeBimestre.id);
      } else {
        // Si no hay bimestres activos, seleccionar el primero
        setSelectedBimestre(curso.bimestres[0]?.id || null);
      }
    }
  }, [curso]);

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
  // console.log("Datos del curso:", curso);

  const {
    nombre,
    notaMaxima,
    notaAprobada,
    createdAt,
    gradoCiclo,
    catedratico,
    bimestres = []
  } = curso;
  
  // Obtener el bimestre seleccionado o el primero si no hay selección
  const currentBimestre = bimestres.find(b => b.id === selectedBimestre) || bimestres[0];
  
  // Obtener las tareas del bimestre seleccionado
  const tareasActuales = currentBimestre?.tareas || [];
  
  // Calcular el punteo total de todas las tareas del bimestre actual
  const totalPunteoTareas = tareasActuales.length > 0
    ? tareasActuales.reduce((total, tarea) => total + (tarea.punteo || 0), 0)
    : 0;

  const teacher = catedratico?.usuario;
  const teacherName = teacher ? `${teacher.primerNombre} ${teacher.primerApellido}` : "N/A";
  const teacherInitials = teacher ? getInitials(teacher.primerNombre, teacher.primerApellido) : "NA";

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.courseHeader}>
        <Link to="/mis-cursos" className={styles.backButton}>
          <FaArrowLeft /> Volver a mis cursos
        </Link>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 className={styles.courseTitle}>{nombre}</h1>
          <div>
            <strong>{gradoCiclo?.grado?.nombre || "Grado N/A"}</strong> | {gradoCiclo?.grado?.nivelAcademico?.descripcion || "Nivel N/A"}
          </div>
          <div className={styles.courseMeta}>
            <div className={styles.metaItem}>
              <FaCalendarAlt /> {gradoCiclo?.ciclo?.descripcion || "Ciclo N/A"}
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
          </div>
          
          {(activeTab === "tasks" || activeTab === "notes") && bimestres.length > 0 && (
            <div className={styles.bimestreSelector}>
              <FaLayerGroup className={styles.bimestreIcon} />
              <select 
                value={selectedBimestre || ''} 
                onChange={(e) => setSelectedBimestre(Number(e.target.value))}
                className={styles.bimestreSelect}
              >
                {bimestres.map((bim) => (
                  <option key={bim.id} value={bim.id}>
                    Bimestre {bim.numeroBimestre} - {bim.estado.descripcion}
                  </option>
                ))}
              </select>
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
                {tareasActuales && tareasActuales.length > 0 ? (
                  <>
                    <div className={styles.tasksHeader}>
                      <h3 className={styles.sectionTitle}>Tareas Asignadas</h3>
                      <p className={styles.taskCount}>{tareasActuales.length} tareas en total</p>
                    </div>
                    <div className={styles.tasksList}>
                      {tareasActuales.map((tarea) => {
                        // No necesitamos más el log de depuración
                        return (
                          <div key={tarea.id} className={styles.taskCard}>
                            <div className={styles.taskHeader}>
                              <h4 className={styles.taskTitle}>{tarea.titulo}</h4>
                              <div className={styles.taskPoints}>
                                {tarea.punteo !== undefined && tarea.punteo !== null 
                                  ? `${tarea.punteo} pts`
                                  : "Punteo no asignado"}
                              </div>
                            </div>
                            <p className={styles.taskDescription}>{tarea.descripcion}</p>
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
                    <h3 style={{ color: "#64748b", fontWeight: "500" }}>No hay tareas disponibles en este momento</h3>
                    <p style={{ color: "#94a3b8", marginTop: "8px" }}>Las tareas asignadas aparecerán aquí</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "notes" && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <FaGraduationCap style={{ fontSize: "3rem", color: "#cbd5e1", marginBottom: "16px" }} />
                <h3 style={{ color: "#64748b", fontWeight: "500" }}>No hay notas disponibles en este momento</h3>
                <p style={{ color: "#94a3b8", marginTop: "8px" }}>Las notas calificadas aparecerán aquí</p>
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
            <Link 
              to={`/mis-cursos/${id}/nueva-tarea${selectedBimestre ? `?bimestre=${selectedBimestre}` : ''}`} 
              className={styles.actionButton}
            >
              <FaTasks size={16} /> Nueva tarea
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisCursosDetailPage;
