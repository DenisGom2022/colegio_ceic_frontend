import { FaGraduationCap, FaSearch } from "react-icons/fa";
import { StudentGradeCard } from "./StudentGradeCard";
import type { AsignacionAlumno, Bimestre, Tarea } from "../../../interfaces/interfaces";
import styles from "../pages/MisCursosDetailPage.module.css";

interface NotesTabProps {
  curso: any;
  selectedBimestre: number | null;
  bimestreActual: Bimestre | undefined;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCalificar: (tarea: Tarea, asignacion: AsignacionAlumno) => void;
  onModificarNota: (tarea: Tarea, asignacion: AsignacionAlumno, tareaAlumno: any) => void;
  gradoCiclo: any;
}

export const NotesTab = ({ 
  curso, 
  selectedBimestre, 
  bimestreActual, 
  searchTerm, 
  onSearchChange, 
  onCalificar,
  onModificarNota,
  gradoCiclo 
}: NotesTabProps) => {
  const tareasDelBimestre = curso.tareas?.filter(
    (tarea: Tarea) => tarea.idBimestre === selectedBimestre
  ) || [];

  const filteredStudents = gradoCiclo?.asignacionesAlumno?.filter((asignacion: AsignacionAlumno) => {
    const alumno = asignacion.alumno;
    const fullName = `${alumno.primerNombre} ${alumno.segundoNombre || ''} ${alumno.primerApellido} ${alumno.segundoApellido}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || alumno.cui.includes(searchTerm);
  }) || [];

  return (
    <div className={styles.notesContainer}>
      <div className={styles.notesHeader}>
        <div className={styles.notesHeaderTop}>
          <div>
            <h3 className={styles.sectionTitle}>
              <FaGraduationCap style={{ marginRight: '8px' }} />
              Calificaciones - Bimestre {bimestreActual?.numeroBimestre}
            </h3>
            <p className={styles.notesSubtitle}>
              {filteredStudents.length} estudiantes • {tareasDelBimestre.length} tareas
            </p>
          </div>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar estudiante por nombre o CUI..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button 
                onClick={() => onSearchChange('')}
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
          {filteredStudents.length === 0 ? (
            <div className={styles.noResults}>
              <FaSearch style={{ fontSize: '2.5rem', color: '#cbd5e1', marginBottom: '12px' }} />
              <h3 style={{ color: '#64748b', fontWeight: '500', margin: '0 0 8px 0' }}>
                No se encontraron estudiantes
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Intenta con otro término de búsqueda
              </p>
            </div>
          ) : (
            <div className={styles.gradesGrid}>
              {filteredStudents.map((asignacion: AsignacionAlumno) => (
                <StudentGradeCard
                  key={asignacion.id}
                  asignacion={asignacion}
                  tareasDelBimestre={tareasDelBimestre}
                  onCalificar={onCalificar}
                  onModificarNota={onModificarNota}
                />
              ))}
            </div>
          )}
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
  );
};
