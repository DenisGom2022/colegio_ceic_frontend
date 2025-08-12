import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPencilAlt, FaTrash, FaUser, FaIdCard, FaCalendarAlt } from 'react-icons/fa';
import { useTeacher } from '../hooks/useTeacher';
import { useDeleteTeacher } from '../hooks/useDeleteTeacher';
import DeleteConfirmModal from '../../../../../components/DeleteConfirmModal';
import FloatingNotification from '../../../../../components/FloatingNotification';
import styles from './TeacherDetailPage.module.css';

export const TeacherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { teacher, loading, error, fetchTeacher } = useTeacher();
  const { deleteTeacher, loading: deleteLoading } = useDeleteTeacher();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchTeacher(id);
    }
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
    if (!teacher || !teacher.usuario) return 'Datos no disponibles';
    
    const { primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido } = teacher.usuario;
    
    return `${primerNombre || ''} ${segundoNombre || ''} ${tercerNombre || ''} ${primerApellido || ''} ${segundoApellido || ''}`.trim();
  };

  // Manejar la eliminación del catedrático
  const handleDelete = async () => {
    if (!teacher) return;
    
    try {
      await deleteTeacher(teacher.dpi);
      setNotificationType('success');
      setNotificationMessage('Catedrático eliminado correctamente');
      setShowNotification(true);
      
      // Redireccionar a la lista después de un breve retraso
      setTimeout(() => {
        navigate('/admin/catedraticos');
      }, 1500);
    } catch (error: any) {
      setShowNotification(true);
      setNotificationType('error');
      setNotificationMessage(error?.message || 'Error al eliminar el catedrático');
    } finally {
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
        <h2>Error al cargar los datos</h2>
        <p>{error}</p>
        <Link to="/admin/catedraticos" className={styles.backButton}>
          <FaArrowLeft /> Volver a la lista
        </Link>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className={styles.errorContainer}>
        <h2>Catedrático no encontrado</h2>
        <p>No se pudo encontrar la información del catedrático solicitado.</p>
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
          <Link to="/admin/catedraticos" className={styles.breadcrumbLink}>Catedráticos</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Detalle de catedrático</span>
        </div>
        
        <div className={styles.actionButtons}>
          <Link to="/admin/catedraticos" className={styles.buttonReturn}>
            <FaArrowLeft size={14} />
            Volver a la lista
          </Link>
          <Link 
            to={`/admin/editar-catedratico/${teacher.dpi}`}
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
            {teacher.usuario && teacher.usuario.primerNombre && teacher.usuario.primerApellido ? (
              `${teacher.usuario.primerNombre.charAt(0)}${teacher.usuario.primerApellido.charAt(0)}`.toUpperCase()
            ) : 'NA'}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{getNombreCompleto()}</h2>
            
            <div className={styles.userMeta}>
              <span className={styles.userMetaItem}>
                <FaUser size={14} />
                {teacher.idUsuario}
              </span>
              <span className={styles.userMetaItem}>
                <FaIdCard size={14} />
                {teacher.dpi}
              </span>
              <span className={styles.userMetaItem}>
                <FaCalendarAlt size={14} />
                Creado el {formatDate(teacher.createdAt)}
              </span>
            </div>
            
            <div className={styles.userBadges}>
              <span className={styles.userBadgeTeacher}>
                {teacher.usuario?.tipoUsuario?.descripcion || 'Docente'}
              </span>
            </div>
            
            <div className={styles.userStatus}>
              {teacher.usuario?.cambiarContrasena === 1 ? (
                <>
                  <div className={`${styles.statusDot} ${styles.locked}`}></div>
                  <span className={`${styles.statusText} ${styles.locked}`}>
                    Requiere cambio de contraseña
                  </span>
                </>
              ) : (
                <>
                  <div className={`${styles.statusDot} ${teacher.deletedAt ? styles.inactive : styles.active}`}></div>
                  <span className={`${styles.statusText} ${teacher.deletedAt ? styles.inactive : styles.active}`}>
                    {teacher.deletedAt ? 'Inactivo' : 'Activo'}
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
                {teacher.usuario ? 
                  `${teacher.usuario.primerNombre || ''} ${teacher.usuario.segundoNombre || ''} ${teacher.usuario.tercerNombre || ''}`.trim() || 'N/A' 
                  : 'N/A'}
              </div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Apellidos</div>
              <div className={styles.detailValue}>
                {teacher.usuario ? 
                  `${teacher.usuario.primerApellido || ''} ${teacher.usuario.segundoApellido || ''}`.trim() || 'N/A' 
                  : 'N/A'}
              </div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>DPI</div>
              <div className={styles.detailValue}>{teacher.dpi || 'N/A'}</div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Teléfono de contacto</div>
              <div className={styles.detailValue}>{teacher.usuario?.telefono || 'N/A'}</div>
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
              <div className={styles.detailValue}>{teacher.idUsuario}</div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Tipo de usuario</div>
              <div className={styles.detailValue}>{teacher.usuario?.tipoUsuario?.descripcion || 'Docente'}</div>
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
              <div className={styles.detailValue}>{formatDate(teacher.createdAt)}</div>
            </div>
            
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Última actualización</div>
              <div className={styles.detailValue}>{formatDate(teacher.updatedAt)}</div>
            </div>
            
            {teacher.deletedAt && (
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Fecha de eliminación</div>
                <div className={styles.detailValue}>{formatDate(teacher.deletedAt)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        title="Eliminar Catedrático"
        message={`¿Estás seguro que deseas eliminar al catedrático "${teacher.idUsuario}"? Esta acción no se puede deshacer.`}
        itemId={teacher.dpi}
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
