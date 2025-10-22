import { FaUserGraduate, FaUsers, FaSearch, FaPhone } from "react-icons/fa";
import { getInitials } from "../utils/formatters";
import type { AsignacionAlumno } from "../../../interfaces/interfaces";
import styles from "../pages/MisCursosDetailPage.module.css";

interface StudentsTabProps {
  gradoCiclo: any;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const StudentsTab = ({ gradoCiclo, searchTerm, onSearchChange }: StudentsTabProps) => {
  const filteredStudents = gradoCiclo?.asignacionesAlumno?.filter((asignacion: AsignacionAlumno) => {
    const alumno = asignacion.alumno;
    const fullName = `${alumno.primerNombre} ${alumno.segundoNombre || ''} ${alumno.primerApellido} ${alumno.segundoApellido}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || alumno.cui.includes(searchTerm);
  }) || [];

  return (
    <div className={styles.studentsContainer}>
      <div className={styles.studentsHeader}>
        <div>
          <h3 className={styles.sectionTitle}>
            <FaUserGraduate style={{ marginRight: '8px' }} />
            Alumnos inscritos en el curso
          </h3>
          <p className={styles.studentCount}>
            {filteredStudents.length} estudiantes inscritos
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
          )}
        </>
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
  );
};
