import styles from './Dashboard.module.css';

export default function Dashboard() {
  return (
    <div>
      <div className={styles["dashboard-content"]}>
        <div className={styles["stats-cards"]}>
          <div className={styles["stat-card"]}>
            <h3>Total Estudiantes</h3>
            <p className={styles["stat-value"]}>1,245</p>
            <p className={`${styles["stat-change"]} ${styles["positive"]}`}>+5% desde el mes pasado</p>
          </div>
          <div className={styles["stat-card"]}>
            <h3>Clases Activas</h3>
            <p className={styles["stat-value"]}>32</p>
            <p className={`${styles["stat-change"]} ${styles["neutral"]}`}>Sin cambios</p>
          </div>
          <div className={styles["stat-card"]}>
            <h3>Asistencia Promedio</h3>
            <p className={styles["stat-value"]}>92%</p>
            <p className={`${styles["stat-change"]} ${styles["positive"]}`}>+2% desde el mes pasado</p>
          </div>
          <div className={styles["stat-card"]}>
            <h3>Rendimiento Promedio</h3>
            <p className={styles["stat-value"]}>87%</p>
            <p className={`${styles["stat-change"]} ${styles["negative"]}`}>-1% desde el mes pasado</p>
          </div>
        </div>

        <div className={styles["dashboard-row"]}>
          <div className={`${styles["dashboard-panel"]} ${styles["recent-activities"]}`}>
            <h2>Actividades Recientes</h2>
            <div className={styles["activities-list"]}>
              <div className={styles["activity-item"]}>
                <div className={styles["activity-icon"]}>📝</div>
                <div className={styles["activity-details"]}>
                  <p className={styles["activity-title"]}>Nueva tarea asignada</p>
                  <p className={styles["activity-info"]}>Matemáticas - Álgebra</p>
                  <p className={styles["activity-time"]}>Hace 2 horas</p>
                </div>
              </div>
              <div className={styles["activity-item"]}>
                <div className={styles["activity-icon"]}>📊</div>
                <div className={styles["activity-details"]}>
                  <p className={styles["activity-title"]}>Calificaciones publicadas</p>
                  <p className={styles["activity-info"]}>Historia - Examen Final</p>
                  <p className={styles["activity-time"]}>Hace 5 horas</p>
                </div>
              </div>
              <div className={styles["activity-item"]}>
                <div className={styles["activity-icon"]}>👤</div>
                <div className={styles["activity-details"]}>
                  <p className={styles["activity-title"]}>Nuevo estudiante registrado</p>
                  <p className={styles["activity-info"]}>María González - 10° Grado</p>
                  <p className={styles["activity-time"]}>Hace 1 día</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles["dashboard-panel"]} ${styles["upcoming-events"]}`}>
            <h2>Próximos Eventos</h2>
            <div className={styles["events-list"]}>
              <div className={styles["event-item"]}>
                <div className={styles["event-date"]}>
                  <span className={styles["event-day"]}>15</span>
                  <span className={styles["event-month"]}>Oct</span>
                </div>
                <div className={styles["event-details"]}>
                  <p className={styles["event-title"]}>Reunión de Padres</p>
                  <p className={styles["event-time"]}>14:00 - 18:00</p>
                </div>
              </div>
              <div className={styles["event-item"]}>
                <div className={styles["event-date"]}>
                  <span className={styles["event-day"]}>22</span>
                  <span className={styles["event-month"]}>Oct</span>
                </div>
                <div className={styles["event-details"]}>
                  <p className={styles["event-title"]}>Día de la Ciencia</p>
                  <p className={styles["event-time"]}>Todo el día</p>
                </div>
              </div>
              <div className={styles["event-item"]}>
                <div className={styles["event-date"]}>
                  <span className={styles["event-day"]}>30</span>
                  <span className={styles["event-month"]}>Oct</span>
                </div>
                <div className={styles["event-details"]}>
                  <p className={styles["event-title"]}>Entrega de Boletines</p>
                  <p className={styles["event-time"]}>09:00 - 12:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
