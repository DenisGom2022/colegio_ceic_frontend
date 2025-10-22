import { Link } from "react-router-dom";
import { FaArrowLeft, FaBook, FaCalendarAlt, FaClock, FaGraduationCap, FaCheckCircle } from "react-icons/fa";
import { formatDate } from "../utils/formatters";
import styles from "../pages/MisCursosDetailPage.module.css";

interface CourseHeaderProps {
  nombre: string;
  notaAprobada: number;
  notaMaxima: number;
  cursoFinalizado: boolean;
  gradoCiclo: any;
}

export const CourseHeader = ({ 
  nombre, 
  notaAprobada, 
  notaMaxima, 
  cursoFinalizado, 
  gradoCiclo 
}: CourseHeaderProps) => {
  return (
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
  );
};
