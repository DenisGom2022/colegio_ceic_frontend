import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStudentByCui, deleteStudent } from '../services/studentService';
import type { Student, StudentGuardian, StudentAssignment } from '../models/Student';
import styles from './StudentDetailPage.module.css';
import DeleteConfirmModal from '../../../../../components/DeleteConfirmModal';
import FloatingNotification from '../../../../../components/FloatingNotification/FloatingNotification';

const StudentDetailPage: React.FC = () => {
  const { cui } = useParams<{ cui: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el modal y notificaciones
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (cui) {
          setLoading(true);
          setError(null);
          const data = await getStudentByCui(cui);
          setStudent(data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar datos del estudiante');
        console.error('Error en StudentDetailPage:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [cui]);
  
  // Función para manejar la eliminación de un estudiante
  const handleDelete = async () => {
    if (!cui) return;
    
    setDeleteLoading(true);
    try {
      await deleteStudent(cui);
      setNotificationMessage('Estudiante eliminado correctamente');
      setNotificationType('success');
      setTimeout(() => {
        navigate('/admin/estudiantes');
      }, 2000);
    } catch (error) {
      setNotificationMessage('Error al eliminar el estudiante');
      setNotificationType('error');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-GT', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Función para formatear nombre completo
  const formatFullName = (student: any) => {
    const nombres = [
      student.primerNombre,
      student.segundoNombre,
      student.tercerNombre
    ].filter(Boolean).join(' ');
    
    const apellidos = [
      student.primerApellido,
      student.segundoApellido
    ].filter(Boolean).join(' ');
    
    return `${nombres} ${apellidos}`;
  };
  
  // Función para obtener iniciales para el avatar
  const getInitials = (nombre: string | undefined, apellido: string | undefined) => {
    if (!nombre || !apellido) return '';
    return `${nombre.charAt(0)}${apellido.charAt(0)}`;
  };

  // Función para obtener la asignación del ciclo activo
  const getActiveAssignment = () => {
    if (!student?.asignaciones) return null;
    return student.asignaciones.find(asignacion => 
      asignacion.gradoCiclo.ciclo.fechaFin === null
    );
  };

  // Función para obtener las asignaciones de ciclos anteriores
  const getPreviousAssignments = () => {
    if (!student?.asignaciones) return [];
    return student.asignaciones.filter(asignacion => 
      asignacion.gradoCiclo.ciclo.fechaFin !== null
    );
  };

  // Función para formatear el precio
  const formatPrice = (price: string) => {
    return `Q${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando información del estudiante...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error al cargar los datos</h2>
        <p>{error}</p>
        <Link to="/admin/estudiantes" className={styles.buttonReturn}>
          Volver al listado
        </Link>
      </div>
    );
  }

  if (!student) {
    return (
      <div className={styles.errorContainer}>
        <h2>Estudiante no encontrado</h2>
        <p>No se encontró la información del estudiante solicitado.</p>
        <Link to="/admin/estudiantes" className={styles.buttonReturn}>
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detailContainer}>
      {notificationMessage && (
        <FloatingNotification 
          message={notificationMessage}
          title={notificationType === 'success' ? 'Éxito' : 'Error'}
          type={notificationType}
          onClose={() => setNotificationMessage('')}
        />
      )}
      
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to="/admin/dashboard" className={styles.breadcrumbLink}>Dashboard</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link to="/admin/estudiantes" className={styles.breadcrumbLink}>Estudiantes</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{formatFullName(student)}</span>
        </div>
        
        <div className={styles.actionButtons}>
          <Link to="/admin/estudiantes" className={styles.buttonReturn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"></path>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver al listado
          </Link>
          <Link to={`/admin/estudiantes/editar/${student.cui}`} className={styles.buttonEdit}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar
          </Link>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className={styles.buttonDelete}
            disabled={deleteLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            {deleteLoading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <div className={styles.profileImage}>
            {getInitials(student.primerNombre, student.primerApellido)}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.nombre}>{formatFullName(student)}</h1>
            <div className={styles.cui}>CUI: {student.cui}</div>
            <div className={styles.subInfo}>
              <div className={styles.infoItem}>
                <span>Teléfono: {student.telefono || 'No especificado'}</span>
              </div>
            </div>
            <div className={styles.badge + ' ' + (student.genero === 'M' ? styles.badgeMale : styles.badgeFemale)}>
              {student.genero === 'M' ? 'Masculino' : 'Femenino'}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className={styles.detailSections}>
          <div id="informacion-personal" className={styles.detailSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2 className={styles.sectionTitle}>Información Personal</h2>
            </div>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Nombres</div>
                <div className={styles.detailValue}>
                  {[student.primerNombre, student.segundoNombre, student.tercerNombre].filter(Boolean).join(' ')}
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Apellidos</div>
                <div className={styles.detailValue}>
                  {[student.primerApellido, student.segundoApellido].filter(Boolean).join(' ')}
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>CUI</div>
                <div className={styles.detailValue}>{student.cui}</div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Género</div>
                <div className={styles.detailValue}>
                  {student.genero === 'M' ? 'Masculino' : 'Femenino'}
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Teléfono</div>
                <div className={styles.detailValue}>{student.telefono || 'No especificado'}</div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Fecha de registro</div>
                <div className={styles.detailValue}>{formatDate(student.createdAt)}</div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Última actualización</div>
                <div className={styles.detailValue}>{formatDate(student.updatedAt)}</div>
              </div>
            </div>
          </div>

          {student.responsables && student.responsables.length > 0 && (
            <div id="responsables" className={styles.detailSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h2 className={styles.sectionTitle}>Responsables</h2>
              </div>
              
              <div className={styles.responsablesList}>
                {student.responsables.map((responsable: StudentGuardian, index) => (
                  <div key={responsable.idResponsable || index} className={styles.responsableCard}>
                    <div className={styles.responsableAvatar}>
                      {getInitials(responsable.primerNombre, responsable.primerApellido)}
                    </div>
                    <div className={styles.responsableInfo}>
                      <h3 className={styles.responsableNombre}>
                        {[
                          responsable.primerNombre, 
                          responsable.segundoNombre, 
                          responsable.tercerNombre,
                          responsable.primerApellido,
                          responsable.segundoApellido
                        ].filter(Boolean).join(' ')}
                      </h3>
                      <div className={styles.responsableDatos}>
                        <span>DPI: {responsable.idResponsable}</span>
                        <span>Teléfono: {responsable.telefono}</span>
                      </div>
                      <span className={styles.responsableParentesco}>
                        {responsable.parentesco?.descripcion || 'No especificado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!student.responsables || student.responsables.length === 0 && (
            <div className={styles.emptyState}>No hay responsables registrados</div>
          )}

          {/* Sección de Asignaciones */}
          <div id="asignaciones" className={styles.detailSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h2 className={styles.sectionTitle}>Asignaciones Académicas</h2>
            </div>

            {/* Asignación del Ciclo Activo */}
            {getActiveAssignment() && (
              <div className={styles.activeAssignmentSection}>
                <h3 className={styles.subsectionTitle}>Ciclo Actual</h3>
                <div className={`${styles.assignmentCard} ${getActiveAssignment()?.idEstadoAsignacion === 1 ? styles.activeAssignment : styles.inactiveAssignment}`}>
                  <div className={styles.assignmentHeader}>
                    <div className={styles.assignmentCycle}>
                      <h4>{getActiveAssignment()?.gradoCiclo.ciclo.descripcion}</h4>
                      <span className={getActiveAssignment()?.idEstadoAsignacion === 1 ? styles.activeLabel : styles.inactiveLabel}>
                        {getActiveAssignment()?.idEstadoAsignacion === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className={`${styles.assignmentStatus} ${getActiveAssignment()?.idEstadoAsignacion === 1 ? styles.statusActive : styles.statusInactive}`}>
                      {getActiveAssignment()?.estadoAsignacion.descripcion}
                    </div>
                  </div>
                  <div className={styles.assignmentDetails}>
                    <div className={styles.assignmentInfo}>
                      <span className={styles.assignmentLabel}>Grado:</span>
                      <span>{getActiveAssignment()?.gradoCiclo.grado.nombre} - {getActiveAssignment()?.gradoCiclo.grado.nivelAcademico.descripcion}</span>
                    </div>
                    <div className={styles.assignmentInfo}>
                      <span className={styles.assignmentLabel}>Jornada:</span>
                      <span>{getActiveAssignment()?.gradoCiclo.grado.jornada.descripcion}</span>
                    </div>
                    <div className={styles.assignmentInfo}>
                      <span className={styles.assignmentLabel}>Precio de Inscripción:</span>
                      <span>{formatPrice(getActiveAssignment()?.gradoCiclo.precioInscripcion || '0')}</span>
                    </div>
                    <div className={styles.assignmentInfo}>
                      <span className={styles.assignmentLabel}>Precio por Pago:</span>
                      <span>{formatPrice(getActiveAssignment()?.gradoCiclo.precioPago || '0')}</span>
                    </div>
                    <div className={styles.assignmentInfo}>
                      <span className={styles.assignmentLabel}>Cantidad de Pagos:</span>
                      <span>{getActiveAssignment()?.gradoCiclo.cantidadPagos}</span>
                    </div>
                    <div className={styles.assignmentInfo}>
                      <span className={styles.assignmentLabel}>Fecha de Asignación:</span>
                      <span>{formatDate(getActiveAssignment()?.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Asignaciones de Ciclos Anteriores */}
            {getPreviousAssignments().length > 0 && (
              <div className={styles.previousAssignmentsSection}>
                <h3 className={styles.subsectionTitle}>Ciclos Anteriores</h3>
                <div className={styles.assignmentsList}>
                  {getPreviousAssignments().map((asignacion: StudentAssignment) => (
                    <div key={asignacion.id} className={`${styles.assignmentCard} ${asignacion.idEstadoAsignacion === 2 ? styles.inactiveAssignment : ''}`}>
                      <div className={styles.assignmentHeader}>
                        <div className={styles.assignmentCycle}>
                          <h4>{asignacion.gradoCiclo.ciclo.descripcion}</h4>
                          <span className={styles.finishedLabel}>Finalizado: {formatDate(asignacion.gradoCiclo.ciclo.fechaFin || undefined)}</span>
                        </div>
                        <div className={`${styles.assignmentStatus} ${asignacion.idEstadoAsignacion === 1 ? styles.statusActive : styles.statusInactive}`}>
                          {asignacion.estadoAsignacion.descripcion}
                        </div>
                      </div>
                      <div className={styles.assignmentDetails}>
                        <div className={styles.assignmentInfo}>
                          <span className={styles.assignmentLabel}>Grado:</span>
                          <span>{asignacion.gradoCiclo.grado.nombre} - {asignacion.gradoCiclo.grado.nivelAcademico.descripcion}</span>
                        </div>
                        <div className={styles.assignmentInfo}>
                          <span className={styles.assignmentLabel}>Jornada:</span>
                          <span>{asignacion.gradoCiclo.grado.jornada.descripcion}</span>
                        </div>
                        <div className={styles.assignmentInfo}>
                          <span className={styles.assignmentLabel}>Fecha de Asignación:</span>
                          <span>{formatDate(asignacion.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensaje cuando no hay asignaciones */}
            {(!student.asignaciones || student.asignaciones.length === 0) && (
              <div className={styles.emptyState}>No hay asignaciones registradas</div>
            )}
          </div>
        </div>
      </div>
      
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Eliminar Estudiante"
          message={`¿Está seguro que desea eliminar al estudiante ${formatFullName(student)}?`}
          itemId={cui || ''}
          isLoading={deleteLoading}
        />
      )}
    </div>
  );
};

export default StudentDetailPage;
