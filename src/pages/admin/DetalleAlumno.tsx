import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './DetalleAlumno.module.css';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import { useAlumno } from '../../hooks/useAlumno';
import { useEliminarAlumno } from '../../hooks/useEliminarAlumno';
import FloatingNotification from '../../components/FloatingNotification/FloatingNotification';

// Interfaz para los eventos de log
interface EventoLog {
  id: number;
  tipo: 'creacion' | 'edicion' | 'acceso' | 'matricula';
  descripcion: string;
  usuario: string;
  fecha: string;
  icono: string;
}

const DetalleAlumno: React.FC = () => {
  const { cui } = useParams<{ cui: string }>();
  const navigate = useNavigate();
  const { loading, error, alumno, fetchAlumno } = useAlumno();
  const { loading: loadingEliminar, error: errorEliminar, eliminarAlumno } = useEliminarAlumno();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  
  // Eventos de log simulados para el alumno
  const [eventosLog, setEventosLog] = useState<EventoLog[]>([]);

  useEffect(() => {
    if (cui) {
      fetchAlumno(cui);
      // Simular carga de eventos después de obtener el alumno
      generarEventosSimulados();
    }
  }, [cui]);
  
  // Función para generar eventos simulados
  const generarEventosSimulados = () => {
    const hoy = new Date();
    const eventos: EventoLog[] = [
      {
        id: 1,
        tipo: 'creacion',
        descripcion: 'Registro creado en el sistema',
        usuario: 'Admin Sistema',
        fecha: new Date(hoy.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 días atrás
        icono: 'user-plus'
      },
      {
        id: 2,
        tipo: 'edicion',
        descripcion: 'Actualización de información personal',
        usuario: 'María González',
        fecha: new Date(hoy.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 días atrás
        icono: 'edit'
      },
      {
        id: 3,
        tipo: 'matricula',
        descripcion: 'Matriculado en el ciclo escolar 2025',
        usuario: 'Juan Pérez',
        fecha: new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días atrás
        icono: 'calendar'
      },
      {
        id: 4,
        tipo: 'edicion',
        descripcion: 'Actualización de datos de contacto',
        usuario: 'Carlos Ramírez',
        fecha: new Date(hoy.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 días atrás
        icono: 'phone'
      },
      {
        id: 5,
        tipo: 'acceso',
        descripcion: 'Revisión de expediente',
        usuario: 'Laura Mendoza',
        fecha: new Date(hoy.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 días atrás
        icono: 'folder-open'
      },
      {
        id: 6,
        tipo: 'acceso',
        descripcion: 'Consulta de datos para reporte',
        usuario: 'Sistema Automático',
        fecha: new Date(hoy.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
        icono: 'file-text'
      }
    ];
    
    setEventosLog(eventos);
  };

  const handleDelete = async () => {
    if (!cui) return;
    
    try {
      await eliminarAlumno(cui);
      setNotificationMessage('Alumno eliminado correctamente');
      setNotificationType('success');
      setTimeout(() => {
        navigate('/admin/alumnos');
      }, 2000);
    } catch (error) {
      setNotificationMessage('Error al eliminar el alumno');
      setNotificationType('error');
    }
    setShowDeleteModal(false);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-GT', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Función para formatear la fecha y hora en el log de eventos
  const formatLogDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-GT', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Función para obtener el ícono correcto según el tipo de evento
  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case 'user-plus':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="17" y1="11" x2="23" y2="11"></line>
          </svg>
        );
      case 'edit':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        );
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        );
      case 'phone':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        );
      case 'folder-open':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      case 'file-text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
    }
  };

  const getInitials = (nombre: string | undefined, apellido: string | undefined) => {
    if (!nombre || !apellido) return '';
    return `${nombre.charAt(0)}${apellido.charAt(0)}`;
  };

  // Función para formatear nombre completo
  const formatFullName = (alumno: any) => {
    const nombres = [
      alumno.primerNombre,
      alumno.segundoNombre,
      alumno.tercerNombre
    ].filter(Boolean).join(' ');
    
    const apellidos = [
      alumno.primerApellido,
      alumno.segundoApellido
    ].filter(Boolean).join(' ');
    
    return `${nombres} ${apellidos}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando información del alumno...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error al cargar los datos</h2>
        <p>{error}</p>
        <Link to="/admin/alumnos" className={styles.buttonReturn}>
          Volver al listado
        </Link>
      </div>
    );
  }

  if (!alumno) {
    return (
      <div className={styles.errorContainer}>
        <h2>Alumno no encontrado</h2>
        <p>No se encontró la información del alumno solicitado.</p>
        <Link to="/admin/alumnos" className={styles.buttonReturn}>
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
          <Link to="/admin/alumnos" className={styles.breadcrumbLink}>Alumnos</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{formatFullName(alumno)}</span>
        </div>
        
        <div className={styles.actionButtons}>
          <Link to="/admin/alumnos" className={styles.buttonReturn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"></path>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver al listado
          </Link>
          <Link to={`/admin/editar-alumno/${alumno.cui}`} className={styles.buttonEdit}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar
          </Link>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className={styles.buttonDelete}
            disabled={loadingEliminar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            {loadingEliminar ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <div className={styles.profileImage}>
            {getInitials(alumno.primerNombre, alumno.primerApellido)}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.nombre}>{formatFullName(alumno)}</h1>
            <div className={styles.cui}>CUI: {alumno.cui}</div>
            <div className={styles.subInfo}>
              <div className={styles.infoItem}>
                <span>Teléfono: {alumno.telefono || 'No especificado'}</span>
              </div>
            </div>
            <div className={styles.badge + ' ' + (alumno.genero === 'M' ? styles.badgeMale : styles.badgeFemale)}>
              {alumno.genero === 'M' ? 'Masculino' : 'Femenino'}
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
                  {[alumno.primerNombre, alumno.segundoNombre, alumno.tercerNombre].filter(Boolean).join(' ')}
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Apellidos</div>
                <div className={styles.detailValue}>
                  {[alumno.primerApellido, alumno.segundoApellido].filter(Boolean).join(' ')}
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>CUI</div>
                <div className={styles.detailValue}>{alumno.cui}</div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Género</div>
                <div className={styles.detailValue}>
                  {alumno.genero === 'M' ? 'Masculino' : 'Femenino'}
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Teléfono</div>
                <div className={styles.detailValue}>{alumno.telefono || 'No especificado'}</div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Fecha de registro</div>
                <div className={styles.detailValue}>{formatDate(alumno.createdAt)}</div>
              </div>
            </div>
          </div>

          {alumno.responsables && alumno.responsables.length > 0 && (
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
                {alumno.responsables.map((responsable, index) => (
                  <div key={index} className={styles.responsableCard}>
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
          
          {/* Sección de Log de Eventos */}
          <div id="log-eventos" className={styles.detailSection}>
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
              <h2 className={styles.sectionTitle}>Log de Eventos</h2>
            </div>
            
            <div className={styles.logContainer}>
              <div className={styles.logTimeline}>
                {eventosLog.map((evento) => (
                  <div key={evento.id} className={styles.logEvent}>
                    <div className={styles.logEventIcon}>
                      {getEventIcon(evento.icono)}
                    </div>
                    <div className={styles.logEventContent}>
                      <div className={styles.logEventHeader}>
                        <h4 className={styles.logEventTitle}>{evento.descripcion}</h4>
                        <span className={styles.logEventDate}>{formatLogDate(evento.fecha)}</span>
                      </div>
                      <div className={styles.logEventDetails}>
                        <span className={styles.logEventUser}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          {evento.usuario}
                        </span>
                        <span className={`${styles.logEventBadge} ${styles['badge' + evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)]}`}>
                          {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
      </div>
      
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => handleDelete()}
          title="Eliminar Alumno"
          message={`¿Está seguro que desea eliminar al alumno ${formatFullName(alumno)}?`}
          itemId={cui || ''}
          isLoading={loadingEliminar}
        />
      )}
    </div>
  );
};

export default DetalleAlumno;
