import { FaTasks } from "react-icons/fa";
import { getInitials } from "../utils/formatters";
import type { AsignacionAlumno, Tarea } from "../../../interfaces/interfaces";
import styles from "../pages/MisCursosDetailPage.module.css";

interface StudentGradeCardProps {
  asignacion: AsignacionAlumno;
  tareasDelBimestre: Tarea[];
  onCalificar: (tarea: Tarea, asignacion: AsignacionAlumno) => void;
  onModificarNota: (tarea: Tarea, asignacion: AsignacionAlumno, tareaAlumno: any) => void;
}

export const StudentGradeCard = ({ 
  asignacion, 
  tareasDelBimestre, 
  onCalificar,
  onModificarNota
}: StudentGradeCardProps) => {
  const alumno = asignacion.alumno;
  const fullName = `${alumno.primerNombre} ${alumno.segundoNombre || ''} ${alumno.tercerNombre || ''} ${alumno.primerApellido} ${alumno.segundoApellido}`.replace(/\s+/g, ' ').trim();
  
  // Calcular total de puntos obtenidos
  const totalObtenido = tareasDelBimestre.reduce((sum: number, tarea: any) => {
    const tareaAlumno = asignacion.tareaAlumnos?.find(
      (ta: any) => ta.idTarea === tarea.id
    );
    return sum + (tareaAlumno ? parseFloat(tareaAlumno.punteoObtenido) : 0);
  }, 0);
  
  // Calcular total posible
  const totalPosible = tareasDelBimestre.reduce((sum: number, tarea: any) => sum + tarea.punteo, 0);
  const porcentajeTotal = totalPosible > 0 ? (totalObtenido / totalPosible) * 100 : 0;
  const isApproved = porcentajeTotal >= 60;
  
  return (
    <div className={styles.gradeCard}>
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
          <span>{asignacion.tareaAlumnos?.filter((ta: any) => 
            tareasDelBimestre.some((t: any) => t.id === ta.idTarea) && 
            ta.punteoObtenido !== null && 
            ta.punteoObtenido !== undefined
          ).length || 0} / {tareasDelBimestre.length}</span>
        </div>
        {tareasDelBimestre.map((tarea: any) => {
          const tareaAlumno = asignacion.tareaAlumnos?.find(
            (ta: any) => ta.idTarea === tarea.id
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div>
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
                    </div>
                    <button
                      onClick={() => onModificarNota(tarea, asignacion, tareaAlumno)}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: 'transparent',
                        color: '#6b7280',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '400',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.borderColor = '#9ca3af';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }}
                    >
                      Editar
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={styles.taskNotGraded}>Sin calificar</span>
                    <button
                      onClick={() => onCalificar(tarea, asignacion)}
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
};
