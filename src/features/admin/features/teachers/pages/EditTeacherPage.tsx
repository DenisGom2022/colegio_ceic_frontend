import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUserEdit, FaUser, FaSearch, FaSpinner, FaTimes, FaCheck } from 'react-icons/fa';
import styles from './EditTeacherPage.module.css';
import { useTeacher } from '../hooks/useTeacher';
import { useEditTeacher } from '../hooks/useTeacherMutation';
import { useTablaUsuario } from '../../../features/users/hooks/useTablaUsuario';
import FloatingNotification from '../../../../../components/FloatingNotification';

// Componente modal para seleccionar usuario
interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (user: any) => void;
}

const UserSelectionModal: React.FC<UserSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
  // Estados para el modal
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Obtener usuarios con el mismo hook que usa UsersPage
  const { usuarios, total, totalPages, cargando: loading, recargarDatos } = useTablaUsuario(page, pageSize, activeSearchQuery);

  // Manejar búsqueda
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveSearchQuery(searchQuery);
    setPage(1);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Seleccionar Usuario</h2>
          <button 
            className={styles.modalClose}
            onClick={onClose}
          >
              <FaTimes size={18} />
          </button>
        </div>        <div className={styles.modalBody}>
          {/* Buscador de usuarios */}
          <div className={styles.searchContainer}>
            <form className={styles.searchInputContainer} onSubmit={handleSearch}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar usuario por nombre o código"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value === "") {
                    setActiveSearchQuery("");
                    setPage(1);
                  }
                }}
              />
              <button 
                type="submit"
                className={styles.searchButton}
              >
                <FaSearch size={14} />
                Buscar
              </button>
            </form>
          </div>
          
          {/* Lista de usuarios */}
          <div className={styles.userListContainer}>
            {loading ? (
              <div className={styles.loadingUsers}>
                <FaSpinner className={styles.spinnerIcon} />
                <p>Cargando usuarios...</p>
              </div>
            ) : usuarios.length === 0 ? (
              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <tbody className={styles.tableBody}>
                    <tr>
                      <td colSpan={3} className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🔍</div>
                        <div className={styles.emptyMessage}>No se encontraron maestros que coincidan con tu búsqueda</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.userList}>
                {usuarios.map(user => (
                  <div 
                    key={user.usuario}
                    className={styles.userItem}
                    onClick={() => onSelect(user)}
                  >
                    <div className={styles.userAvatar}>
                      {user.primerNombre?.charAt(0)}{user.primerApellido?.charAt(0)}
                    </div>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>
                        {user.primerNombre} {user.segundoNombre || ''} {user.primerApellido} {user.segundoApellido || ''}
                      </div>
                      <div className={styles.userCode}>
                        {user.usuario} - {user.tipoUsuario?.descripcion || 'Sin rol'}
                      </div>
                    </div>
                    <div className={styles.userSelect}>
                      <FaCheck size={14} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Paginación */}
          {!loading && usuarios.length > 0 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Anterior
              </button>
              
              <span className={styles.pageInfo}>
                Página {page} de {totalPages || 1}
              </span>
              
              <button
                className={styles.pageButton}
                disabled={page >= (totalPages || 1)}
                onClick={() => setPage(prev => prev + 1)}
              >
                Siguiente
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export const EditTeacherPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { teacher, loading: loadingTeacher, error: errorTeacher, fetchTeacher } = useTeacher();
  const { updateTeacher, loading: loadingUpdate } = useEditTeacher();
  
  const [formData, setFormData] = useState({
    dpi: '',
    idUsuario: ''
  });
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [notificationType, setNotificationType] = useState<'error' | 'success'>('success');

  // Cargar los datos del profesor al iniciar
  useEffect(() => {
    if (id) {
      fetchTeacher(id);
    }
    // Evitamos incluir fetchTeacher como dependencia para evitar bucles infinitos
  }, [id]);

  // Actualizar el formulario cuando se carguen los datos del profesor
  useEffect(() => {
    if (teacher) {
      setFormData({
        dpi: teacher.dpi || '',
        idUsuario: teacher.idUsuario || ''
      });
      
      if (teacher.usuario) {
        setSelectedUser(teacher.usuario);
      }
    }
  }, [teacher]);

  // Esta función se utiliza directamente en el botón onClick
  
  // Función para seleccionar un usuario del modal
  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    
    setFormData(prev => ({
      ...prev,
      idUsuario: user.usuario || user.username
    }));
    
    setShowModal(false);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Si hay alguna notificación, la limpiamos
    if (showNotification) {
      setShowNotification(false);
      setNotificationMessage('');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // No permitir múltiples envíos simultáneos
      if (loadingUpdate) return;
      
      // Validar formulario básico
      if (!formData.dpi.trim() || !formData.idUsuario.trim()) {
        setNotificationMessage('Por favor complete todos los campos');
        setNotificationType('error');
        setShowNotification(true);
        return;
      }
      
      console.log('Enviando actualización con datos:', formData);
      
      // Enviamos el idUsuario y el DPI como requiere la API
      await updateTeacher(formData.idUsuario, { 
        dpi: formData.dpi.trim() 
      });
      
      setNotificationType('success');
      setNotificationMessage('Catedrático actualizado correctamente');
      setShowNotification(true);
      
      // Redirigir a la página de detalles después de un tiempo
      setTimeout(() => {
        navigate(`/admin/catedratico/${formData.dpi}`);
      }, 1500);
      
    } catch (err: any) {
      console.error('Error al actualizar el catedrático:', err);
      const errorMsg = err?.message || 'Error al actualizar el catedrático';
      setNotificationType('error');
      setNotificationMessage(errorMsg);
      setShowNotification(true);
    }
  };

  if (loadingTeacher) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando datos del catedrático...</p>
      </div>
    );
  }

  return (
    <div className={styles.editContainer}>
      {/* Encabezado con navegación */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to="/admin/catedraticos" className={styles.breadcrumbLink}>Catedráticos</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          {teacher && (
            <>
              <Link 
                to={`/admin/catedratico/${teacher.dpi}`} 
                className={styles.breadcrumbLink}
              >
                Detalle de {teacher.idUsuario}
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
            </>
          )}
          <span className={styles.breadcrumbCurrent}>Editar catedrático</span>
        </div>
        
        <Link to="/admin/catedraticos" className={styles.buttonReturn}>
          <FaArrowLeft size={14} />
          Volver a la lista
        </Link>
      </div>

      <div className={styles.editCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerIcon}>
            <FaUserEdit />
          </div>
          <h1 className={styles.cardTitle}>Editar Catedrático</h1>
        </div>

        {errorTeacher && (
          <div className={styles.errorMessage}>
            <p>{errorTeacher}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Información del catedrático</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="dpi" className={styles.inputLabel}>
                  DPI
                </label>
                <input
                  type="text"
                  id="dpi"
                  name="dpi"
                  className={styles.inputField}
                  value={formData.dpi}
                  onChange={handleInputChange}
                  disabled={true} // No permitir cambiar el DPI porque es la llave primaria
                  title="El DPI no puede ser modificado ya que es la llave primaria"
                />
                <div className={styles.inputHelp}>El DPI no puede ser modificado ya que es la llave primaria</div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="idUsuario" className={styles.inputLabel}>
                  Nombre de usuario
                </label>
                <div className={styles.userSelectContainer}>
                  <input
                    type="text"
                    id="idUsuario"
                    name="idUsuario"
                    className={styles.inputField}
                    value={formData.idUsuario}
                    onChange={handleInputChange}
                    required
                    placeholder="Seleccione un usuario"
                    readOnly
                  />
                  <button 
                    type="button" 
                    className={styles.selectUserButton}
                    onClick={() => setShowModal(true)}
                  >
                    <FaUser size={14} />
                    Seleccionar usuario
                  </button>
                </div>
                
                {/* Mostrar información del usuario seleccionado */}
                {selectedUser && (
                  <div className={styles.selectedUserInfo}>
                    <div className={styles.selectedUserAvatar}>
                      {selectedUser.primerNombre?.charAt(0)}{selectedUser.primerApellido?.charAt(0)}
                    </div>
                    <div className={styles.selectedUserDetails}>
                      <h4 className={styles.selectedUserName}>
                        {selectedUser.primerNombre} {selectedUser.segundoNombre ? `${selectedUser.segundoNombre} ` : ''}
                        {selectedUser.primerApellido} {selectedUser.segundoApellido || ''}
                      </h4>
                      <p className={styles.selectedUserUsername}>@{selectedUser.usuario || selectedUser.idUsuario}</p>
                      {selectedUser.tipoUsuario && (
                        <span className={styles.selectedUserType}>{selectedUser.tipoUsuario.descripcion}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <Link 
              to={teacher ? `/admin/catedratico/${teacher.dpi}` : '/admin/catedraticos'}
              className={styles.buttonCancel}
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className={styles.buttonSave}
              disabled={loadingUpdate}
            >
              {loadingUpdate ? (
                <>
                  <div className={styles.spinnerSmall}></div>
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave size={14} />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Modal para selección de usuario */}
      <UserSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleSelectUser}
      />
      
      {/* Notificación flotante */}
      {showNotification && (
        <FloatingNotification
          title={notificationType === 'success' ? 'Éxito' : 'Error'}
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
          autoCloseTime={5000}
        />
      )}
    </div>
  );
};
