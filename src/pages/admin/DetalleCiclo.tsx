import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDetalleCiclo } from '../../hooks/useDetalleCiclo';
import styles from './DetalleCiclo.module.css';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
// import { useEliminarCiclo } from '../../hooks/useEliminarCiclo';
// Esta línea debe ser descomentada cuando exista el hook
import FloatingNotification from '../../components/FloatingNotification/FloatingNotification';
import { 
    FaCalendarAlt,
    FaGraduationCap,
    FaClock,
    FaMoneyBillWave,
    FaRegCalendarCheck
} from 'react-icons/fa';

// Interfaz para los eventos de log
interface EventoLog {
  id: number;
  tipo: 'creacion' | 'edicion' | 'acceso' | 'asignacion';
  descripcion: string;
  usuario: string;
  fecha: string;
  icono: string;
}

const DetalleCiclo: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const cicloId = id ? parseInt(id, 10) : 0;
    const { ciclo, loading, error } = useDetalleCiclo(cicloId);
    // Mock para eliminarCiclo mientras no exista el hook real
    const loadingEliminar = false;
    const eliminarCiclo = async (id: number) => {
      console.log('Eliminando ciclo', id);
      // Aquí iría la llamada real a la API
      return true;
    };
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
    
    // Eventos de log simulados para el ciclo
    const [eventosLog, setEventosLog] = useState<EventoLog[]>([]);
    
    useEffect(() => {
      if (ciclo) {
        // Simular carga de eventos después de obtener el ciclo
        generarEventosSimulados();
      }
    }, [ciclo]);
    
    // Función para generar eventos simulados
    const generarEventosSimulados = () => {
      const hoy = new Date();
      const eventos: EventoLog[] = [
        {
          id: 1,
          tipo: 'creacion',
          descripcion: 'Ciclo escolar creado en el sistema',
          usuario: 'Admin Sistema',
          fecha: new Date(hoy.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 días atrás
          icono: 'calendar-plus'
        },
        {
          id: 2,
          tipo: 'edicion',
          descripcion: 'Actualización de información del ciclo',
          usuario: 'María González',
          fecha: new Date(hoy.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 días atrás
          icono: 'edit'
        },
        {
          id: 3,
          tipo: 'asignacion',
          descripcion: 'Asignación de grados al ciclo',
          usuario: 'Juan Pérez',
          fecha: new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días atrás
          icono: 'layer-group'
        },
        {
          id: 4,
          tipo: 'acceso',
          descripcion: 'Consulta de información del ciclo',
          usuario: 'Sistema Automático',
          fecha: new Date(hoy.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 días atrás
          icono: 'file-text'
        }
      ];
      
      setEventosLog(eventos);
    };

    const handleDelete = async () => {
      if (!id) return;
      
      try {
        await eliminarCiclo(parseInt(id, 10));
        setNotificationMessage('Ciclo eliminado correctamente');
        setNotificationType('success');
        setTimeout(() => {
          navigate('/admin/ciclos');
        }, 2000);
      } catch (error) {
        setNotificationMessage('Error al eliminar el ciclo');
        setNotificationType('error');
      }
      setShowDeleteModal(false);
    };

    // Formatear fecha a un formato legible
    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) return "No definido";
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
    
    // Formatear dinero
    const formatCurrency = (value: string | number | undefined | null) => {
        if (value === undefined || value === null) return "Q0.00";
        return `Q${parseFloat(value.toString()).toFixed(2)}`;
    };
    
    // Función para obtener el ícono correcto según el tipo de evento
    const getEventIcon = (iconName: string) => {
      switch (iconName) {
        case 'calendar-plus':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <line x1="12" y1="15" x2="12" y2="19"></line>
              <line x1="10" y1="17" x2="14" y2="17"></line>
            </svg>
          );
        case 'edit':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          );
        case 'layer-group':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
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

    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Cargando información del ciclo...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer}>
          <h2>Error al cargar los datos</h2>
          <p>{error}</p>
          <Link to="/admin/ciclos" className={styles.buttonReturn}>
            Volver al listado
          </Link>
        </div>
      );
    }

    if (!ciclo) {
      return (
        <div className={styles.errorContainer}>
          <h2>Ciclo no encontrado</h2>
          <p>No se encontró la información del ciclo solicitado.</p>
          <Link to="/admin/ciclos" className={styles.buttonReturn}>
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
                  <Link to="/admin/ciclos" className={styles.breadcrumbLink}>Ciclos</Link>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <span className={styles.breadcrumbCurrent}>{ciclo.descripcion}</span>
                </div>
                
                <div className={styles.actionButtons}>
                  <Link to="/admin/ciclos" className={styles.buttonReturn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5"></path>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Volver al listado
                  </Link>
                  <Link to={`/admin/editar-ciclo/${ciclo.id}`} className={styles.buttonEdit}>
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
                        <FaCalendarAlt size={32} />
                    </div>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.nombre}>{ciclo.descripcion}</h1>
                        <div className={styles.cicloId}>ID: {ciclo.id}</div>
                        <div className={styles.subInfo}>
                            <div className={styles.infoItem}>
                                <span>Creado el: {formatDate(ciclo.createdAt)}</span>
                            </div>
                        </div>
                        <div className={`${styles.badge} ${ciclo.fechaFin ? styles.badgeInactive : styles.badgeActive}`}>
                            {ciclo.fechaFin ? 'Finalizado' : 'Activo'}
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className={styles.detailSections}>
                    <div id="informacion-ciclo" className={styles.detailSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaCalendarAlt size={16} />
                            </div>
                            <h2 className={styles.sectionTitle}>Información del Ciclo</h2>
                        </div>
                        
                        <div className={styles.detailGrid}>
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>ID</div>
                                <div className={styles.detailValue}>{ciclo.id}</div>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>Descripción</div>
                                <div className={styles.detailValue}>{ciclo.descripcion}</div>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>Estado</div>
                                <div className={styles.detailValue}>
                                    {ciclo.fechaFin ? 'Finalizado' : 'Activo'}
                                </div>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>Fecha de creación</div>
                                <div className={styles.detailValue}>{formatDate(ciclo.createdAt)}</div>
                            </div>
                            
                            {ciclo.fechaFin && (
                                <div className={styles.detailItem}>
                                    <div className={styles.detailLabel}>Fecha de finalización</div>
                                    <div className={styles.detailValue}>{formatDate(ciclo.fechaFin)}</div>
                                </div>
                            )}
                            
                            <div className={styles.detailItem}>
                                <div className={styles.detailLabel}>Última actualización</div>
                                <div className={styles.detailValue}>{formatDate(ciclo.updatedAt)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="grados-asignados" className={styles.detailSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaGraduationCap size={16} />
                            </div>
                            <h2 className={styles.sectionTitle}>Grados Asignados</h2>
                            <span className={styles.count}>{ciclo.gradosCiclo?.length || 0}</span>
                        </div>
                        
                        {ciclo.gradosCiclo && ciclo.gradosCiclo.length > 0 ? (
                            <div className={styles.gradosGrid}>
                                {ciclo.gradosCiclo.map(gc => (
                                    <div key={gc.id} className={styles.gradoCard}>
                                        <h3 className={styles.gradoTitle}>{gc.grado.nombre}</h3>
                                        <div className={styles.gradoMeta}>
                                            <span>{gc.grado.nivelAcademico.descripcion}</span>
                                            <span className={styles.divider}>•</span>
                                            <span>{gc.grado.jornada.descripcion}</span>
                                        </div>
                                        
                                        <div className={styles.gradoInfoGrid}>
                                            <div className={styles.infoItem}>
                                                <div className={styles.infoIcon}>
                                                    <FaMoneyBillWave size={14} />
                                                </div>
                                                <div className={styles.infoContent}>
                                                    <span className={styles.infoLabel}>Precio de pago</span>
                                                    <span className={styles.infoValue}>{formatCurrency(gc.precioPago)}</span>
                                                </div>
                                            </div>
                                            
                                            <div className={styles.infoItem}>
                                                <div className={styles.infoIcon}>
                                                    <FaClock size={14} />
                                                </div>
                                                <div className={styles.infoContent}>
                                                    <span className={styles.infoLabel}>Cantidad de pagos</span>
                                                    <span className={styles.infoValue}>{gc.cantidadPagos}</span>
                                                </div>
                                            </div>
                                            
                                            <div className={styles.infoItem}>
                                                <div className={styles.infoIcon}>
                                                    <FaRegCalendarCheck size={14} />
                                                </div>
                                                <div className={styles.infoContent}>
                                                    <span className={styles.infoLabel}>Precio inscripción</span>
                                                    <span className={styles.infoValue}>{formatCurrency(gc.precioInscripcion)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                Este ciclo no tiene grados asignados
                            </div>
                        )}
                    </div>
                    
                    {/* Sección de Log de Eventos */}
                    <div id="log-eventos" className={styles.detailSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    title="Eliminar Ciclo"
                    message={`¿Está seguro que desea eliminar el ciclo ${ciclo.descripcion}?`}
                    itemId={id || ''}
                    isLoading={loadingEliminar}
                />
            )}
        </div>
    );
};

export default DetalleCiclo;
