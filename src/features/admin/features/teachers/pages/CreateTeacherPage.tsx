import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUser,  
  FaArrowLeft,
  FaChalkboardTeacher,
  FaCheck
} from 'react-icons/fa';
import styles from './CreateTeacherPage.module.css';
import { useCreateTeacher } from '../hooks/useTeacherMutation';
import FloatingNotification from '../../../../../components/FloatingNotification';
import UserSelectionModal from '../../../../../components/UserSelectionModal';

interface FormData {
  dpi: string;
  idUsuario: string;
}

interface FormErrors {
  [key: string]: string;
}

export const CreateTeacherPage: React.FC = () => {
  const { createTeacher, loading, error, success } = useCreateTeacher();
  
  // Estado para el modal de selección de usuarios
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    dpi: '',
    idUsuario: ''
  });
  
  // Estado para guardar el usuario seleccionado completo
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'dpi':
        return value.trim() === '' ? 'El DPI es requerido' : 
               !/^\d+$/.test(value.trim()) ? 'El DPI debe contener solo números' :
               value.trim().length !== 13 ? 'El DPI debe tener 13 dígitos' : '';
      case 'idUsuario':
        return value.trim() === '' ? 'El usuario es requerido' : '';
      default:
        return '';
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Si hay alguna notificación de error, la limpiamos
    if (showNotification) {
      setShowNotification(false);
      setErrorMessage("");
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validar el campo cuando cambia
    if (touched[name]) {
      const errorMessage = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };
  
  // Función para abrir el modal de selección de usuario
  const handleOpenUserModal = () => {
    // Asegurar que no haya notificaciones de error activas
    setShowNotification(false);
    setErrorMessage("");
    setShowModal(true);
  };
  
  // Función para seleccionar un usuario del modal
  const handleSelectUser = (usuario: any) => {
    // Guardar el usuario seleccionado completo
    setSelectedUser(usuario);
    
    setFormData(prev => ({
      ...prev,
      idUsuario: usuario.usuario
    }));
    
    // Marcar el campo como tocado y validar
    setTouched(prev => ({
      ...prev,
      idUsuario: true
    }));
    
    // Limpiar el error si existe
    setErrors(prev => ({
      ...prev,
      idUsuario: ''
    }));
    
    // Cerrar el modal
    setShowModal(false);
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Validar todos los campos
    Object.entries(formData).forEach(([key, value]) => {
      const errorMessage = validateField(key, value as string);
      if (errorMessage) {
        newErrors[key] = errorMessage;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      dpi: '',
      idUsuario: ''
    });
    setTouched({});
    setErrors({});
    setSelectedUser(null); // Limpiar el usuario seleccionado
    setSubmitSuccess(false); // Reiniciar el estado de éxito para poder enviar nuevamente
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (validateForm()) {
      try {
        const result = await createTeacher({
          dpi: formData.dpi.trim(),
          idUsuario: formData.idUsuario.trim()
        });
        
        if (result) {
          // Limpiar formulario para permitir crear otro catedrático
          resetForm();
          
          // Establecer estados para la notificación de éxito
          setSubmitSuccess(true);
          setShowNotification(true);
          
          // Establecemos un timer para restablecer submitSuccess después de la notificación
          setTimeout(() => {
            if (!showNotification) {
              setSubmitSuccess(false);
            }
          }, 5500); // Un poco más que el tiempo de autoCloseTime
        }
      } catch (error: any) {
        console.error('Error inesperado:', error);
        setSubmitSuccess(false);
        setErrorMessage(error?.message || "Error inesperado al crear el catedrático");
        setShowNotification(true);
      }
    } else {
      console.log('Formulario con errores de validación');
    }
  };

  // Efecto para mostrar notificación cuando cambia el estado de error o éxito
  useEffect(() => {
    if (success) {
      setSubmitSuccess(true);
      setShowNotification(true);
      setErrorMessage("");
    } else if (error) {
      setErrorMessage(error);
      setShowNotification(true);
      setSubmitSuccess(false);
    }
  }, [success, error]);

  return (
    <div className={styles.editContainer}>
      {/* Encabezado con migas de pan */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to="/admin/catedraticos" className={styles.breadcrumbLink}>Catedráticos</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Crear nuevo catedrático</span>
        </div>
        
        <Link to="/admin/catedraticos" className={styles.buttonReturn}>
          <FaArrowLeft size={14} />
          Volver a la lista
        </Link>
      </div>
      
      {/* Formulario */}
      <div className={styles.editCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerIcon}>
            <FaChalkboardTeacher />
          </div>
          <h1 className={styles.cardTitle}>Crear Catedrático</h1>
        </div>

        {errorMessage && !submitSuccess && showNotification && (
          <div className={styles.errorMessage}>
            <p>{errorMessage}</p>
          </div>
        )}

        {submitSuccess && showNotification && (
          <div className={styles.successMessage}>
            <p>Catedrático creado exitosamente.</p>
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
                  placeholder="Ingrese el DPI"
                  value={formData.dpi}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  maxLength={13}
                  required
                />
                {touched.dpi && errors.dpi && (
                  <div className={styles.inputHelp} style={{color: '#ef4444'}}>{errors.dpi}</div>
                )}
                {!errors.dpi && (
                  <div className={styles.inputHelp}>DPI único del catedrático</div>
                )}
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="idUsuario" className={styles.inputLabel}>
                  Usuario
                </label>
                <div className={styles.userSelectContainer}>
                  <input
                    type="text"
                    id="idUsuario"
                    name="idUsuario"
                    className={styles.inputField}
                    placeholder="Seleccione un usuario"
                    value={formData.idUsuario}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    readOnly
                  />
                  <button 
                    type="button" 
                    className={styles.selectUserButton}
                    onClick={handleOpenUserModal}
                  >
                    <FaUser size={14} />
                    Seleccionar usuario
                  </button>
                </div>
                {touched.idUsuario && errors.idUsuario && (
                  <div className={styles.inputHelp} style={{color: '#ef4444'}}>{errors.idUsuario}</div>
                )}
                
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
                      <p className={styles.selectedUserUsername}>@{selectedUser.usuario}</p>
                      {selectedUser.tipoUsuario && (
                        <span className={styles.selectedUserType}>{selectedUser.tipoUsuario.descripcion}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className={styles.formActions}>
            <Link
              to="/admin/catedraticos"
              className={styles.buttonCancel}
            >
              Cancelar
            </Link>
            <button 
              type="submit" 
              className={styles.buttonSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.spinnerSmall}></div>
                  Creando catedrático...
                </>
              ) : (
                <>
                  <FaCheck size={14} />
                  Guardar Catedrático
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Notificación de éxito o error */}
      {showNotification && (
        <FloatingNotification
          message={errorMessage || "Catedrático creado correctamente."}
          type={errorMessage ? "error" : "success"}
          title={errorMessage ? "Error" : "Éxito"}
          onClose={() => {
            setShowNotification(false);
            setErrorMessage("");
            if (submitSuccess) {
              setSubmitSuccess(false);
            }
          }}
          autoCloseTime={errorMessage ? 0 : 5000}
        />
      )}
      
      {/* Modal de selección de usuarios */}
      <UserSelectionModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSelectUser={handleSelectUser} 
      />
    </div>
  );
};
