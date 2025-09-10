import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import styles from './CourseDetailPage.module.css';
import { 
  FaArrowLeft, FaEdit, FaBook, FaUser, FaCalendarAlt, 
  FaGraduationCap, FaHistory, FaHashtag
} from 'react-icons/fa';
import { useCourse } from '../hooks';
import FloatingNotification from '../../../../../components/FloatingNotification/FloatingNotification';

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  // Leer los query params
  const params = new URLSearchParams(location.search);
  const returnTo = params.get('return');
  const gradeId = params.get('gradeId');
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage] = useState<string>('');
  
  const { course, loading, error, fetchCourse } = useCourse();

  useEffect(() => {
    if (id) {
      fetchCourse(id);
    }
  }, [id, fetchCourse]);

  // Formatear fecha
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
  };

  // Obtener iniciales del curso para el avatar
  const getCourseInitials = (nombre: string) => {
    if (!nombre) return '';
    
    const words = nombre.split(' ');
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return nombre.charAt(0).toUpperCase();
  };

  // Obtener el nombre completo del catedrático
  const getCatedraticoFullName = (catedratico: any) => {
    if (!catedratico?.usuario) return 'No asignado';
    
    const { primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido } = catedratico.usuario;
    const nombres = [primerNombre, segundoNombre, tercerNombre].filter(Boolean).join(' ');
    const apellidos = [primerApellido, segundoApellido].filter(Boolean).join(' ');
    
    return `${nombres} ${apellidos}`.trim();
  };

  if (loading) {
    return (
      <div className={styles.detailContainer}>
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg">Cargando información del curso...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.detailContainer}>
        <div className="text-center py-16">
          <div className="text-red-500 text-lg">Error: {error}</div>
          <button
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md"
            onClick={() => navigate('/admin/cursos')}
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={styles.detailContainer}>
        <div className="text-center py-16">
          <div className="text-red-500 text-lg">Curso no encontrado</div>
          <button
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md"
            onClick={() => navigate('/admin/cursos')}
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailContainer}>
      {/* Encabezado con navegación */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          {returnTo === 'grade' && gradeId ? (
            <>
              <Link to={`/admin/grados/${gradeId}`}>Detalle de grado</Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>Detalle de curso</span>
            </>
          ) : (
            <>
              <Link to="/admin/cursos">Cursos</Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>Detalle de curso</span>
            </>
          )}
        </div>

        <div className={styles.actionButtons}>
          {returnTo === 'grade' && gradeId ? (
            <button
              className={styles.buttonReturn}
              onClick={() => navigate(`/admin/grado/${gradeId}`)}
            >
              <FaArrowLeft size={14} />
              Volver al grado
            </button>
          ) : (
            <button
              className={styles.buttonReturn}
              onClick={() => navigate('/admin/cursos')}
            >
              <FaArrowLeft size={14} />
              Volver a la lista
            </button>
          )}
          <Link to={`/admin/editar-curso/${course.id}`} className={styles.buttonEdit}>
            <FaEdit size={14} />
            Editar
          </Link>
        </div>
      </div>

      {/* Tarjeta de detalle de curso */}
      <div className={styles.courseDetailCard}>
        {/* Encabezado con información principal */}
        <div className={styles.courseHeader}>
          <div className={styles.avatarLarge}>
            {getCourseInitials(course.nombre)}
          </div>

          <div className={styles.courseInfo}>
            <h2 className={styles.courseName}>
              {course.nombre}
            </h2>

            <div className={styles.courseMeta}>
              <span className={styles.courseMetaItem}>
                <FaHashtag size={14} />
                ID: {course.id}
              </span>
              <span className={styles.courseMetaItem}>
                <FaUser size={14} />
                {getCatedraticoFullName(course.catedratico)}
              </span>
              <span className={styles.courseMetaItem}>
                <FaCalendarAlt size={14} />
                Creado el {formatDate(course.createdAt)}
              </span>
            </div>

            <div className={styles.courseStatus}>
              <div className={`${styles.statusDot} ${styles.active}`}></div>
              <span className={`${styles.statusText} ${styles.active}`}>Activo</span>
              <span className={styles.courseBadge}>
                <FaBook size={12} />
                Curso
              </span>
            </div>
          </div>
        </div>

        {/* Sección: Información del curso */}
        <div className={styles.detailSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaBook />
            </div>
            <h3 className={styles.sectionTitle}>Información del curso</h3>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nombre del curso</div>
              <div className={styles.detailValue}>{course.nombre}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nota máxima</div>
              <div className={styles.detailValue}>
                <span className={styles.scoreValue}>{course.notaMaxima} puntos</span>
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nota de aprobación</div>
              <div className={styles.detailValue}>
                <span className={styles.scoreValue}>{course.notaAprobada} puntos</span>
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Porcentaje de aprobación</div>
              <div className={styles.detailValue}>
                <span className={styles.percentageValue}>
                  {((course.notaAprobada / course.notaMaxima) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Información del catedrático */}
        <div className={styles.detailSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaUser />
            </div>
            <h3 className={styles.sectionTitle}>Catedrático asignado</h3>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nombre completo</div>
              <div className={styles.detailValue}>{getCatedraticoFullName(course.catedratico)}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>DPI</div>
              <div className={styles.detailValue}>{course.catedratico.dpi}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Usuario</div>
              <div className={styles.detailValue}>{course.catedratico.usuario.usuario}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Teléfono</div>
              <div className={styles.detailValue}>{course.catedratico.usuario.telefono}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Tipo de usuario</div>
              <div className={styles.detailValue}>{course.catedratico.usuario.tipoUsuario.descripcion}</div>
            </div>
          </div>
        </div>

        {/* Sección: Información del grado y ciclo */}
        <div className={styles.detailSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaGraduationCap />
            </div>
            <h3 className={styles.sectionTitle}>Grado y ciclo académico</h3>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nombre de grado</div>
              <div className={styles.detailValue}>{course.gradoCiclo.grado?.nombre || 'No disponible'}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nivel académico</div>
              <div className={styles.detailValue}>{course.gradoCiclo.grado?.nivelAcademico?.descripcion || 'No disponible'}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Jornada</div>
              <div className={styles.detailValue}>{course.gradoCiclo.grado?.jornada?.descripcion || 'No disponible'}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>ID Grado</div>
              <div className={styles.detailValue}>{course.gradoCiclo.idGrado}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Ciclo académico</div>
              <div className={styles.detailValue}>{course.gradoCiclo.ciclo.descripcion}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Fecha fin de ciclo</div>
              <div className={styles.detailValue}>
                {course.gradoCiclo.ciclo.fechaFin ? formatDate(course.gradoCiclo.ciclo.fechaFin) : 
                  <span className={styles.valueEmpty}>No especificada</span>
                }
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Precio de pago</div>
              <div className={styles.detailValue}>
                <span className={styles.priceValue}>Q{course.gradoCiclo.precioPago}</span>
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Cantidad de pagos</div>
              <div className={styles.detailValue}>{course.gradoCiclo.cantidadPagos} pagos</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Precio de inscripción</div>
              <div className={styles.detailValue}>
                <span className={styles.priceValue}>Q{course.gradoCiclo.precioInscripcion}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Bimestres */}
        {course.bimestres && course.bimestres.length > 0 && (
          <div className={styles.detailSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FaCalendarAlt />
              </div>
              <h3 className={styles.sectionTitle}>Bimestres</h3>
            </div>

            <div className={styles.detailGrid}>
              {course.bimestres.map((bimestre) => (
                <div key={bimestre.id} className={`${styles.detailItem} ${styles.bimestreCard}`}>
                  <div className={styles.detailLabel}>
                    {bimestre.numeroBimestre === 0 
                      ? 'Bimestre inicial' 
                      : `Bimestre ${bimestre.numeroBimestre}`}
                  </div>
                  <div className={styles.detailValue}>
                    <div className={styles.bimestreStatus}>
                      Estado: 
                      <span className={`${styles.bimestreEstado} ${
                        bimestre.idEstado === 0 ? styles.estadoEspera : 
                        bimestre.idEstado === 1 ? styles.estadoEnCurso : 
                        styles.estadoFinalizado}`}>
                        {bimestre.estado?.descripcion || 'Desconocido'}
                      </span>
                    </div>
                    {bimestre.fechaInicio && (
                      <div>Fecha de inicio: {formatDate(bimestre.fechaInicio)}</div>
                    )}
                    {bimestre.fechaFin && (
                      <div>Fecha de finalización: {formatDate(bimestre.fechaFin)}</div>
                    )}
                    {!bimestre.fechaInicio && !bimestre.fechaFin && (
                      <div className={styles.valueEmpty}>Sin fechas registradas</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sección: Información técnica */}
        <div className={styles.detailSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaHistory />
            </div>
            <h3 className={styles.sectionTitle}>Información técnica</h3>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Fecha de creación</div>
              <div className={styles.detailValue}>{formatDate(course.createdAt)}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Última actualización</div>
              <div className={styles.detailValue}>{formatDate(course.updatedAt)}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Estado</div>
              <div className={styles.detailValue}>
                {course.deletedAt ? 
                  <span className={styles.statusInactive}>Eliminado</span> : 
                  <span className={styles.statusActive}>Activo</span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notificación flotante */}
      {showNotification && (
        <FloatingNotification
          title="Información"
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default CourseDetailPage;
