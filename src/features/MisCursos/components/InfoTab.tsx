import { FaCheckCircle, FaClock } from "react-icons/fa";
import { formatDate } from "../utils/formatters";
import styles from "../pages/MisCursosDetailPage.module.css";

interface InfoTabProps {
  nombre: string;
  notaMaxima: number;
  notaAprobada: number;
  createdAt: string;
  cursoFinalizado: boolean;
  gradoCiclo: any;
}

export const InfoTab = ({ 
  nombre, 
  notaMaxima, 
  notaAprobada, 
  createdAt, 
  cursoFinalizado, 
  gradoCiclo 
}: InfoTabProps) => {
  return (
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
  );
};
