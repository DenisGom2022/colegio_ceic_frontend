import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPencilAlt, FaTrash, FaUser, FaIdCard, FaCalendarAlt, FaLock, FaKey } from 'react-icons/fa';
import { getCatedraticoById } from '../../services/catedraticoService';
import type { Catedratico } from '../../hooks/useTablaCatedratico';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import styles from './DetalleCatedratico.module.css';
import { useEliminarCatedratico } from '../../hooks/useEliminarCatedratico';
import FloatingNotification from '../../components/FloatingNotification';

const DetalleCatedratico = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [catedratico, setCatedratico] = useState<Catedratico | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  
  const { eliminarCatedratico, loading: deleteLoading, error: deleteError } = useEliminarCatedratico();

  useEffect(() => {
    const fetchCatedratico = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getCatedraticoById(id);
        setCatedratico(data);
        setError(null);
      } catch (err: any) {
        console.error('Error al cargar los datos del catedrático:', err);
        setError(err?.response?.data?.message || err.message || 'Error al cargar los datos del catedrático');
      } finally {
        setLoading(false);
      }
    };

    fetchCatedratico();
  }, [id]);

  // Formatear fecha a un formato legible
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  // Obtener el nombre completo del catedrático
  const getNombreCompleto = () => {
    if (!catedratico || !catedratico.usuario) return 'Datos no disponibles';
    
    const { primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido } = catedratico.usuario;
    
    return `${primerNombre || ''} ${segundoNombre || ''} ${tercerNombre || ''} ${primerApellido || ''} ${segundoApellido || ''}`.trim();
  };

  // Manejar la eliminación del catedrático
  const handleDelete = async (dpi: string) => {
    if (!catedratico) return;
    
    const success = await eliminarCatedratico(dpi);
    if (success) {
      setDeleteModalOpen(false);
      setShowNotification(true);
      setNotificationType('success');
      setNotificationMessage('Catedrático eliminado correctamente');
      
      // Redireccionar a la lista después de un breve retraso
      setTimeout(() => {
        navigate('/admin/catedraticos');
      }, 1500);
    } else {
      setShowNotification(true);
      setNotificationType('error');
      setNotificationMessage(deleteError || 'Error al eliminar el catedrático');
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando datos del catedrático...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/admin/catedraticos" className={styles.backButton}>
          <FaArrowLeft /> Volver a la lista
        </Link>
      </div>
    );
  }

  if (!catedratico) {
    return (
      <div className={styles.errorContainer}>
        <h2>Catedrático no encontrado</h2>
        <p>No se encontró información para el catedrático solicitado.</p>
        <Link to="/admin/catedraticos" className={styles.backButton}>
          <FaArrowLeft /> Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detailContainer}>
      {/* Encabezado con navegación */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to="/admin/catedraticos">Catedráticos</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Detalle de catedrático</span>
        </div>
        
        <div className={styles.actionButtons}>
          <Link to="/admin/catedraticos" className={styles.buttonReturn}>
            <FaArrowLeft size={14} />
            Volver a la lista
          </Link>
          <Link 
            to={`/admin/editar-catedratico/${catedratico.dpi}`}
            className={styles.buttonEdit}
          >
            <FaPencilAlt size={14} /> Editar
          </Link>
          <button 
            className={styles.buttonDelete}
            onClick={() => setDeleteModalOpen(true)}
          >
            <FaTrash size={14} /> Eliminar
          </button>
        </div>
      </div>

      {/* Tarjeta de detalle de catedrático */}
      <div className={styles.userDetailCard}>
        {/* Encabezado con información principal */}
        <div className={styles.userHeader}>
          <div className={styles.avatarLarge}>
            {catedratico.usuario && catedratico.usuario.primerNombre && catedratico.usuario.primerApellido ? (
              `${catedratico.usuario.primerNombre.charAt(0)}${catedratico.usuario.primerApellido.charAt(0)}`.toUpperCase()
            ) : 'NA'}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{getNombreCompleto()}</h2>
            
            <div className={styles.userMeta}>
              <span className={styles.userMetaItem}>
                <FaUser size={14} />
                {catedratico.idUsuario}
              </span>
              <span className={styles.userMetaItem}>
                <FaIdCard size={14} />
                {catedratico.dpi}
              </span>
              <span className={styles.userMetaItem}>
                <FaCalendarAlt size={14} />
                Creado el {formatDate(catedratico.createdAt)}
              </span>
            </div>
            
            <div className={styles.userBadges}>
              <span className={styles.userBadgeTeacher}>
                {catedratico.usuario?.tipoUsuario?.descripcion || 'Docente'}
              </span>
            </div>
            
            <div className={styles.userStatus}>
              {catedratico.usuario?.cambiarContrasena === 1 ? (
                <>
                  <div className={`${styles.statusDot} ${styles.locked}`}></div>
                  <span className={`${styles.statusText} ${styles.locked}`}>
                    Requiere cambio de contraseña
                  </span>
                </>
              ) : (
                <>
                  <div className={`${styles.statusDot} ${catedratico.deletedAt ? styles.inactive : styles.active}`}></div>
                  <span className={`${styles.statusText} ${catedratico.deletedAt ? styles.inactive : styles.active}`}>
                    {catedratico.deletedAt ? 'Inactivo' : 'Activo'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sección: Información personal */}
        <div className={styles.detailSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaUser />
            </div>
            <h3 className={styles.sectionTitle}>Información personal</h3>
          </div>
          
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nombres</div>
              <div className={styles.detailValue}>
                {catedratico.usuario ? 
                  `${catedratico.usuario.primerNombre || ''} ${catedratico.usuario.segundoNombre || ''} ${catedratico.usuario.tercerNombre || ''}`.trim() || 'N/A' 
                  : 'N/A'}
              </div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Apellidos</div>
              <div className={styles.detailValue}>
                {catedratico.usuario ? 
                  `${catedratico.usuario.primerApellido || ''} ${catedratico.usuario.segundoApellido || ''}`.trim() || 'N/A' 
                  : 'N/A'}
              </div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>DPI</div>
              <div className={styles.detailValue}>{catedratico.dpi || 'N/A'}</div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Teléfono de contacto</div>
              <div className={styles.detailValue}>{catedratico.usuario?.telefono || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        {/* Sección: Información de cuenta */}
        <div className={styles.detailSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaIdCard />
            </div>
            <h3 className={styles.sectionTitle}>Información de cuenta</h3>
          </div>
          
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Nombre de usuario</div>
              <div className={styles.detailValue}>{catedratico.idUsuario}</div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Tipo de usuario</div>
              <div className={styles.detailValue}>{catedratico.usuario?.tipoUsuario?.descripcion || 'Docente'}</div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Estado de contraseña</div>
              <div className={styles.detailValue}>
                <div className={styles.passwordStatusContainer}>
                  <div className={styles.passwordStatusWrapper}>
                    {catedratico.usuario?.cambiarContrasena === 1 ? (
                      <span className={styles.passwordStatusReset}>
                        <FaLock size={12} style={{ marginRight: '4px' }} />
                        Debe cambiar contraseña
                      </span>
                    ) : (
                      <span className={styles.passwordStatusOk}>
                        <FaKey size={12} style={{ marginRight: '4px' }} />
                        Contraseña establecida
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección: Fechas importantes */}
        <div className={styles.detailSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FaCalendarAlt />
            </div>
            <h3 className={styles.sectionTitle}>Fechas importantes</h3>
          </div>
          
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Fecha de registro</div>
              <div className={styles.detailValue}>{formatDate(catedratico.createdAt)}</div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Última actualización</div>
              <div className={styles.detailValue}>{formatDate(catedratico.updatedAt)}</div>
            </div>
            
            {catedratico.deletedAt && (
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Fecha de eliminación</div>
                <div className={styles.detailValue}>{formatDate(catedratico.deletedAt)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        title="Eliminar Catedrático"
        message={`¿Estás seguro que deseas eliminar al catedrático "${catedratico.idUsuario}"? Esta acción no se puede deshacer.`}
        itemId={catedratico.dpi}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isLoading={deleteLoading}
      />
      
      {/* Notificación flotante para mostrar éxito o error */}
      {showNotification && (
        <FloatingNotification
          message={notificationMessage}
          type={notificationType}
          title={notificationType === 'success' ? 'Éxito' : 'Error'}
          onClose={() => setShowNotification(false)}
          autoCloseTime={notificationType === 'success' ? 3000 : 0}
        />
      )}
    </div>
  );
};

export default DetalleCatedratico;
