import { FaCheckCircle, FaCalendarAlt, FaTasks } from "react-icons/fa";
import { formatDate } from "../utils/formatters";
import type { Bimestre, Tarea } from "../../../interfaces/interfaces";
import styles from "../pages/MisCursosDetailPage.module.css";

interface TasksTabProps {
  curso: any;
  cursoFinalizado: boolean;
  selectedBimestre: number | null;
  bimestreActual: Bimestre | undefined;
}

export const TasksTab = ({ 
  curso, 
  cursoFinalizado, 
  selectedBimestre, 
  bimestreActual 
}: TasksTabProps) => {
  const tareasFiltradas = curso.tareas?.filter((tarea: Tarea) => tarea.idBimestre === selectedBimestre) || [];
  const tieneTareas = curso.tareas && Array.isArray(curso.tareas) && curso.tareas.length > 0;

  return (
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
      {tieneTareas ? (
        <>
          <div className={styles.tasksHeader}>
            <h3 className={styles.sectionTitle}>
              Tareas del Bimestre {bimestreActual?.numeroBimestre}
            </h3>
            {selectedBimestre && (
              <p className={styles.taskCount}>
                {tareasFiltradas.length} tareas en este bimestre
              </p>
            )}
          </div>
          <div className={styles.tasksList}>
            {tareasFiltradas.map((tarea: Tarea) => (
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
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <FaTasks style={{ fontSize: "3rem", color: "#cbd5e1", marginBottom: "16px" }} />
          {tieneTareas ? (
            <h3 style={{ color: "#64748b", fontWeight: "500" }}>
              No hay tareas para el Bimestre {bimestreActual?.numeroBimestre}
            </h3>
          ) : (
            <h3 style={{ color: "#64748b", fontWeight: "500" }}>
              No hay tareas disponibles en este curso
            </h3>
          )}
          <div style={{ color: "#94a3b8", marginTop: "12px" }}>
            <p>Estado de la carga de tareas:</p>
            <ul style={{ listStyle: "none", padding: "10px 0" }}>
              <li>curso.tareas existe: {curso.tareas ? "Sí" : "No"}</li>
              <li>curso.tareas es un array: {Array.isArray(curso.tareas) ? "Sí" : "No"}</li>
              <li>Cantidad de tareas totales: {Array.isArray(curso.tareas) ? curso.tareas.length : "N/A"}</li>
              <li>Bimestre seleccionado: {selectedBimestre} (Bimestre {bimestreActual?.numeroBimestre})</li>
              <li>Tareas en este bimestre: {tareasFiltradas.length}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
