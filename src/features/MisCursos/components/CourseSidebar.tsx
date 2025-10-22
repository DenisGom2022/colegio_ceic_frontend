import { Link } from "react-router-dom";
import { FaPhone, FaTasks, FaCheckCircle } from "react-icons/fa";
import { getInitials } from "../utils/formatters";
import type { Bimestre } from "../../../interfaces/interfaces";
import styles from "../pages/MisCursosDetailPage.module.css";

interface CourseSidebarProps {
  catedratico: any;
  notaAprobada: number;
  notaMaxima: number;
  totalPunteoTareas: number;
  cursoFinalizado: boolean;
  cursoId: number;
  cursoNombre: string;
  selectedBimestre: number | null;
  bimestres: Bimestre[];
}

export const CourseSidebar = ({ 
  catedratico, 
  notaAprobada, 
  notaMaxima, 
  totalPunteoTareas,
  cursoFinalizado,
  cursoId,
  cursoNombre,
  selectedBimestre,
  bimestres
}: CourseSidebarProps) => {
  const teacher = catedratico?.usuario;
  const teacherName = teacher ? `${teacher.primerNombre} ${teacher.primerApellido}` : "N/A";
  const teacherInitials = teacher ? getInitials(teacher.primerNombre, teacher.primerApellido) : "NA";

  return (
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
            to={`/crear-tarea?idCurso=${cursoId}&curso=${cursoNombre}${selectedBimestre ? `&nroBimestre=${bimestres.find((e: Bimestre) => e.id == selectedBimestre)?.numeroBimestre}` : ''}`} 
            className={styles.actionButton}
          >
            <FaTasks size={16} /> Nueva tarea
          </Link>
        )}
      </div>
    </div>
  );
};
