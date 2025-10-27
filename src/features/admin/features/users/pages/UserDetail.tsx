import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './UserDetailPage.module.css';
import { 
  FaArrowLeft, FaEdit, FaKey, FaUser, FaPhone, FaCalendarAlt, 
  FaAddressCard, FaSignInAlt, FaUserEdit, FaLock, FaShieldAlt,
  FaHistory
} from 'react-icons/fa';
import { useUsuario } from '../hooks';
import FloatingNotification from '../../../../../components/FloatingNotification/FloatingNotification';

// Definición de tipo para el registro de actividad
interface ActivityLog {
  id: string;
  type: 'login' | 'update' | 'password' | 'create' | 'role';
  description: string;
  timestamp: string;
}

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage] = useState<string>('');
  // Dummy data para registro de actividad (en una implementación real, esto vendría de una API)
  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      type: 'login',
      description: 'Inicio de sesión exitoso',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      type: 'update',
      description: 'Información de usuario actualizada',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      type: 'password',
      description: 'Cambio de contraseña',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
  
  const { usuario, getUsuarioById, loading, error } = useUsuario();
  const localError = '';

  useEffect(() => {
    if (id) {
      getUsuarioById(id);
    }
  }, [id, getUsuarioById]);

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

  // Obtener iniciales del usuario para el avatar
  const getInitials = (usuario: any) => {
    if (!usuario) return '';
    
    let initials = '';
    if (usuario.primerNombre) {
      initials += usuario.primerNombre.charAt(0);
    }
    
    if (usuario.primerApellido) {
      initials += usuario.primerApellido.charAt(0);
    }
    
    return initials.toUpperCase();
  };

  // Obtener clase para la insignia de usuario basada en el tipo
  const getUserBadgeClass = (tipoUsuario: any) => {
    if (!tipoUsuario) return '';
    
    const tipo = tipoUsuario.descripcion?.toLowerCase() || '';
    if (tipo.includes('admin')) return styles.userBadgeAdmin;
    if (tipo.includes('profesor')) return styles.userBadgeTeacher;
    if (tipo.includes('estudiante')) return styles.userBadgeStudent;
    if (tipo.includes('padre')) return styles.userBadgeParent;
    
    return '';
  };

  // Obtener el icono para el tipo de actividad
  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'login': return <FaSignInAlt />;
      case 'update': return <FaUserEdit />;
      case 'password': return <FaLock />;
      case 'create': return <FaUser />;
      case 'role': return <FaShieldAlt />;
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
          <div className="text-gray-400 text-lg">Cargando información del usuario...</div>
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
            onClick={() => navigate('/admin/usuarios')}
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className={styles.detailContainer}>
        <div className="text-center py-16">
          <div className="text-red-500 text-lg">Usuario no encontrado</div>
          <button
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md"
            onClick={() => navigate('/admin/usuarios')}
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
          <Link to="/admin/usuarios">Usuarios</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Detalle de usuario</span>
        </div>

        <div className={styles.actionButtons}>
          <Link to="/admin/usuarios" className={styles.buttonReturn}>
            <FaArrowLeft size={14} />
            Volver a la lista
          </Link>
          <Link to={`/admin/usuarios/editar/${usuario.usuario}`} className={styles.buttonEdit}>
            <FaEdit size={14} />
            Editar
          </Link>
          <Link to={`/admin/usuarios/reiniciar-contrasena/${usuario.usuario}`} className={styles.buttonPassword}>
            <FaKey size={14} />
            Reiniciar contraseña
          </Link>
        </div>
      </div>

      {/* Tarjeta de detalle de usuario */}
      <div className={styles.userDetailCard}>
        {/* Encabezado con información principal */}
        <div className={styles.userHeader}>
          <div className={styles.avatarLarge}>
            {getInitials(usuario)}
          </div>

          <div className={styles.userInfo}>
            <h2 className={styles.userName}>
              {usuario.primerNombre} {usuario.segundoNombre} {usuario.primerApellido} {usuario.segundoApellido}
            </h2>

            <div className={styles.userMeta}>
              <span className={styles.userMetaItem}>
                <FaUser size={14} />
                {usuario.usuario}
              </span>
              <span className={styles.userMetaItem}>
                <FaPhone size={14} />
                {usuario.telefono}
              </span>
              <span className={styles.userMetaItem}>
                <FaCalendarAlt size={14} />
                Creado el {formatDate(usuario.createdAt)}
              </span>
            </div>

            <div className={styles.userStatus}>
              <div className={`${styles.statusDot} ${styles.active}`}></div>
              <span className={`${styles.statusText} ${styles.active}`}>Activo</span>
              <span className={`${styles.userBadge} ${getUserBadgeClass(usuario.tipoUsuario)}`}>
                {usuario.tipoUsuario?.descripcion}
              </span>
            </div>
          </div>
        </div>

        {/* Sección: Información personal */}
        <div className={styles.detailSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaAddressCard />
            </div>
            <h3 className={styles.sectionTitle}>Información personal</h3>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Primer nombre</div>
              <div className={styles.detailValue}>{usuario.primerNombre}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Segundo nombre</div>
              <div className={styles.detailValue}>
                {usuario.segundoNombre || <span className={styles.valueEmpty}>No especificado</span>}
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Tercer nombre</div>
              <div className={styles.detailValue}>
                {usuario.tercerNombre || <span className={styles.valueEmpty}>No especificado</span>}
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Primer apellido</div>
              <div className={styles.detailValue}>{usuario.primerApellido}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Segundo apellido</div>
              <div className={styles.detailValue}>
                {usuario.segundoApellido || <span className={styles.valueEmpty}>No especificado</span>}
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Teléfono de contacto</div>
              <div className={styles.detailValue}>{usuario.telefono}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Correo electrónico</div>
              <div className={styles.detailValue}>
                <span className={styles.valueEmpty}>No registrado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Información de cuenta */}
        <div className={styles.detailSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaKey />
            </div>
            <h3 className={styles.sectionTitle}>Información de cuenta</h3>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nombre de usuario</div>
              <div className={styles.detailValue}>{usuario.usuario}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Tipo de usuario</div>
              <div className={styles.detailValue}>{usuario.tipoUsuario?.descripcion}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Estado de contraseña</div>
              <div className={styles.detailValue}>
                <div className={styles.passwordStatusContainer}>
                  <div>
                    {usuario.cambiarContrasena === 1 ?
                      <span style={{ color: '#ef4444' }}>Debe cambiar contraseña</span> :
                      <span style={{ color: '#10b981' }}>Contraseña establecida</span>
                    }
                  </div>
                  <Link 
                    to={`/admin/usuarios/reiniciar-contrasena/${usuario.usuario}`}
                    className={styles.resetPasswordLink}
                  >
                    <FaKey size={12} />
                    Reiniciar
                  </Link>
                </div>
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Fecha de creación</div>
              <div className={styles.detailValue}>{formatDate(usuario.createdAt)}</div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Última actualización</div>
              <div className={styles.detailValue}>{formatDate(usuario.updatedAt)}</div>
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

export default UserDetailPage;
