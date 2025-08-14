import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './GradeDetailPage.module.css';
import { 
  FaArrowLeft, FaEdit, FaGraduationCap, FaSchool, FaClock, FaCalendarAlt,
  FaMoneyBillWave, FaClipboardList, FaHistory
} from 'react-icons/fa';
import { useGrado } from '../hooks';
import FloatingNotification from '../../../../../components/FloatingNotification/FloatingNotification';

// Definición de tipo para el registro de actividad
interface ActivityLog {
  id: string;
  type: 'create' | 'update' | 'assign' | 'price';
  description: string;
  timestamp: string;
}

export const GradeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  
  // Dummy data para registro de actividad (en una implementación real, esto vendría de una API)
  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      type: 'create',
      description: 'Grado creado',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      type: 'update',
      description: 'Información del grado actualizada',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      type: 'assign',
      description: 'Grado asignado al ciclo 2026',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
  
  const { grado, getGradoById, loading, error } = useGrado();
  const localError = '';
  
  useEffect(() => {
    if (id) {
      getGradoById(id);
    }
  }, [id, getGradoById]);

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

  // Formatear moneda
  const formatCurrency = (amount: string | undefined) => {
    if (!amount) return "Q0.00";
    const numericValue = parseFloat(amount);
    return `Q${numericValue.toFixed(2)}`;
  };
  
  // Obtener el icono para el tipo de actividad
  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'create': return <FaGraduationCap />;
      case 'update': return <FaEdit />;
      case 'assign': return <FaClipboardList />;
      case 'price': return <FaMoneyBillWave />;
      default: return <FaHistory />;
    }
  };

  // Formatear fecha de la actividad
  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className={styles.detailContainer}>
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg">Cargando información del grado...</div>
        </div>
      </div>
    );
  }

  if (error || localError) {
    return (
      <div className={styles.detailContainer}>
        <div className="text-center py-16">
          <div className="text-red-500 text-lg">Error: {error || localError}</div>
          <button
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md"
            onClick={() => navigate('/admin/grados')}
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!grado) {
    return (
      <div className={styles.detailContainer}>
        <div className="text-center py-16">
          <div className="text-red-500 text-lg">Grado no encontrado</div>
          <button
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md"
            onClick={() => navigate('/admin/grados')}
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
          <Link to="/admin/grados">Grados</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Detalle de grado</span>
        </div>

        <div className={styles.actionButtons}>
          <Link to="/admin/grados" className={styles.buttonReturn}>
            <FaArrowLeft size={14} />
            <span>Volver a la lista</span>
          </Link>
          <Link to={`/admin/grados/editar/${grado.id}`} className={styles.buttonEdit}>
            <FaEdit size={14} />
            <span>Editar grado</span>
          </Link>
        </div>
      </div>

      {/* Tarjeta de detalle de grado */}
      <div className={styles.userDetailCard}>
        {/* Encabezado con información principal */}
        <div className={styles.userHeader}>
          <div className={styles.avatarLarge}>
            <FaGraduationCap size={28} />
          </div>

          <div className={styles.userInfo}>
            <h2 className={styles.userName}>
              {grado.nombre}
            </h2>

            <div className={styles.userMeta}>
              <div className={styles.userMetaItem}>
                <FaSchool size={14} />
                {grado.nivelAcademico.descripcion}
              </div>
              <div className={styles.userMetaItem}>
                <FaClock size={14} />
                {grado.jornada.descripcion}
              </div>
              <div className={styles.userMetaItem}>
                <FaCalendarAlt size={14} />
                Creado el {formatDate(grado.createdAt)}
              </div>
            </div>

            <div className={styles.userStatus}>
              <div className={`${styles.statusDot} ${styles.active}`}></div>
              <span className={`${styles.statusText} ${styles.active}`}>Activo</span>
            </div>
          </div>
        </div>

        {/* Sección: Información básica */}
        <div className={styles.detailSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaGraduationCap size={16} />
            </div>
            <h3 className={styles.sectionTitle}>Información del grado</h3>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nombre</div>
              <div className={styles.detailValue}>{grado.nombre}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nivel académico</div>
              <div className={styles.detailValue}>{grado.nivelAcademico.descripcion}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Jornada</div>
              <div className={styles.detailValue}>{grado.jornada.descripcion}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Fecha de creación</div>
              <div className={styles.detailValue}>{formatDate(grado.createdAt)}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Última actualización</div>
              <div className={styles.detailValue}>{formatDate(grado.updatedAt)}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Estado</div>
              <div className={styles.detailValue}>
                <div className={styles.userStatus} style={{ marginTop: 0 }}>
                  <div className={`${styles.statusDot} ${styles.active}`}></div>
                  <span className={`${styles.statusText} ${styles.active}`}>Activo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Ciclos asociados */}
        <div className={styles.detailSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaClipboardList size={16} />
            </div>
            <h3 className={styles.sectionTitle}>Ciclos asociados</h3>
          </div>

          <div className={styles.cyclesContainer}>
            {grado.gradosCiclo && grado.gradosCiclo.length > 0 ? (
              grado.gradosCiclo.map((gradoCiclo) => (
                <div key={gradoCiclo.id} className={styles.cycleCard}>
                  <div className={styles.cycleHeader}>
                    <h4 className={styles.cycleTitle}>{gradoCiclo.ciclo.descripcion}</h4>
                    <div className={styles.userStatus} style={{ marginTop: 0 }}>
                      {new Date(gradoCiclo.ciclo.fechaFin) > new Date() ? (
                        <>
                          <div className={`${styles.statusDot} ${styles.active}`}></div>
                          <span className={`${styles.statusText} ${styles.active}`}>Activo</span>
                        </>
                      ) : (
                        <>
                          <div className={`${styles.statusDot} ${styles.inactive}`}></div>
                          <span className={`${styles.statusText} ${styles.inactive}`}>Finalizado</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.cycleDetails}>
                    <div className={styles.cycleDetail}>
                      <FaMoneyBillWave className={styles.cycleDetailIcon} />
                      <div className={styles.cycleDetailContent}>
                        <span className={styles.cycleDetailLabel}>Precio de inscripción</span>
                        <span className={styles.cycleDetailValue}>{formatCurrency(gradoCiclo.precioInscripcion)}</span>
                      </div>
                    </div>
                    
                    <div className={styles.cycleDetail}>
                      <FaMoneyBillWave className={styles.cycleDetailIcon} />
                      <div className={styles.cycleDetailContent}>
                        <span className={styles.cycleDetailLabel}>Precio por pago</span>
                        <span className={styles.cycleDetailValue}>{formatCurrency(gradoCiclo.precioPago)}</span>
                      </div>
                    </div>
                    
                    <div className={styles.cycleDetail}>
                      <FaClipboardList className={styles.cycleDetailIcon} />
                      <div className={styles.cycleDetailContent}>
                        <span className={styles.cycleDetailLabel}>Cantidad de pagos</span>
                        <span className={styles.cycleDetailValue}>{gradoCiclo.cantidadPagos}</span>
                      </div>
                    </div>
                    
                    <div className={styles.cycleDetail}>
                      <FaCalendarAlt className={styles.cycleDetailIcon} />
                      <div className={styles.cycleDetailContent}>
                        <span className={styles.cycleDetailLabel}>Fecha de fin</span>
                        <span className={styles.cycleDetailValue}>{formatDate(gradoCiclo.ciclo.fechaFin)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.cycleActions}>
                    <Link to={`/admin/ciclos/${gradoCiclo.ciclo.id}/grados/${grado.id}`} className={styles.cycleActionLink}>
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyStateContainer}>
                <div className={styles.emptyStateMessage}>
                  Este grado no está asociado a ningún ciclo actualmente.
                </div>
                <Link to={`/admin/grados/${grado.id}/asociar-ciclo`} className={styles.emptyStateAction}>
                  Asociar grado a un ciclo
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Sección: Registro de actividad */}
        <div className={styles.activitySection}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>
              <FaHistory size={16} />
              Registro de actividad
            </h3>
          </div>

          <div className={styles.activityList}>
            {activityLogs.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityText}>
                    <span className={styles.activityDescription}>
                      {activity.description}
                    </span>
                  </div>
                  <div className={styles.activityDate}>
                    {formatActivityDate(activity.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {activityLogs.length === 0 && (
              <div className="text-center py-8">
                <span className="text-gray-400">No hay registros de actividad</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showNotification && (
        <FloatingNotification
          type={notificationType}
          title={notificationType === 'success' ? 'Éxito' : 'Error'}
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
          autoCloseTime={5000}
        />
      )}
    </div>
  );
};

export default GradeDetailPage;
