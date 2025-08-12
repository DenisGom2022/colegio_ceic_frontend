import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateUser.module.css';
import { 
  FaUser, 
  FaIdCard, 
  FaPhone, 
  FaUserTag, 
  FaLock, 
  FaArrowLeft,
  FaInfoCircle,
  FaUserPlus,
  FaAddressCard,
  FaSpinner
} from 'react-icons/fa';
import { useTiposUsuario, useUsuario } from '../hooks';
import FloatingNotification from '../../../../../components/FloatingNotification/FloatingNotification';
import { PageHeader } from '../../../../common/components/PageHeader';
import { UserButton } from '../components';

interface UserFormData {
  usuario: string;
  contrasena: string;
  confirmarContrasena: string;
  primerNombre: string;
  segundoNombre: string;
  tercerNombre: string;
  primerApellido: string;
  segundoApellido: string;
  telefono: string;
  idTipoUsuario: number;
  correo?: string;
}

interface FormErrors {
  [key: string]: string;
}

export const CreateUserPage = () => {
  const navigate = useNavigate();
  const { tiposUsuario, error, loading } = useTiposUsuario();
  const { crearNuevoUsuario, loading: loadingCrear } = useUsuario();
  
  const [formData, setFormData] = useState<UserFormData>({
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
    primerNombre: '',
    segundoNombre: '',
    tercerNombre: '',
    primerApellido: '',
    segundoApellido: '',
    telefono: '',
    idTipoUsuario: 0
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  const validateField = (name: string, value: string | number): string => {
    switch(name) {
      case 'usuario':
        if (!value) return 'El nombre de usuario es requerido';
        if (value.toString().length < 3) return 'El usuario debe tener al menos 3 caracteres';
        return '';
      case 'contrasena':
        if (!value) return 'La contraseña es requerida';
        if (value.toString().length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        return '';
      case 'confirmarContrasena':
        if (!value) return 'Debe confirmar la contraseña';
        if (value !== formData.contrasena) return 'Las contraseñas no coinciden';
        return '';
      case 'primerNombre':
      case 'primerApellido':
        if (!value) return `El ${name === 'primerNombre' ? 'primer nombre' : 'primer apellido'} es requerido`;
        return '';
      case 'telefono':
        if (!value) return 'El teléfono es requerido';
        if (!/^[0-9]{8}$/.test(value.toString())) return 'El teléfono debe tener 8 dígitos';
        return '';
      case 'idTipoUsuario':
        if (!value || value === 0) return 'Debe seleccionar un tipo de usuario';
        return '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Validar cada campo
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof UserFormData];
      const error = validateField(key, value as string);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'idTipoUsuario' ? parseInt(value, 10) || 0 : value
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validación en tiempo real
    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: errorMsg
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados para mostrar todos los errores
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (validateForm()) {
      try {
        // Eliminar campos que no van al API
        const { confirmarContrasena, correo, ...submitData } = formData;
        
        const result = await crearNuevoUsuario(submitData);
        
        if (result.success) {
          // Éxito - mostrar notificación y redirigir
          setNotificationType('success');
          setNotificationMessage('Usuario creado exitosamente');
          setShowNotification(true);
          
          // Redirigir después de un breve delay
          setTimeout(() => {
            navigate('/admin/usuarios');
          }, 2000);
        } else {
          // Error del servidor - mostrar notificación de error
          setNotificationType('error');
          setNotificationMessage(result.errorMessage || 'Error al crear usuario');
          setShowNotification(true);
        }
      } catch (err: any) {
        // Error de red u otro error - mostrar notificación de error
        setNotificationType('error');
        setNotificationMessage(err.message || 'Error al crear usuario');
        setShowNotification(true);
      }
    }
  };

  const renderFieldError = (fieldName: string) => {
    if (touched[fieldName] && errors[fieldName]) {
      return (
        <div className={styles.errorMessage}>
          <FaInfoCircle className={styles.errorIcon} />
          <span>{errors[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.createUserContainer}>
      <PageHeader 
        title="Crear Nuevo Usuario" 
        subtitle="Ingrese los datos para registrar un nuevo usuario en el sistema"
        actionButton={
          <UserButton to="/admin/usuarios" className={styles.backButton}>
            <FaArrowLeft className={styles.iconLeft} />
            Volver a la lista
          </UserButton>
        }
      />

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <FaUser className={styles.sectionIcon} />
              Información de Cuenta
            </h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="usuario" className={styles.label}>
                  <FaIdCard className={styles.inputIcon} />
                  Nombre de Usuario*
                </label>
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  className={`${styles.input} ${touched.usuario && errors.usuario ? styles.inputError : ''}`}
                  placeholder="Ingrese nombre de usuario"
                />
                {renderFieldError('usuario')}
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="contrasena" className={styles.label}>
                  <FaLock className={styles.inputIcon} />
                  Contraseña*
                </label>
                <input
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  className={`${styles.input} ${touched.contrasena && errors.contrasena ? styles.inputError : ''}`}
                  placeholder="Ingrese contraseña"
                />
                {renderFieldError('contrasena')}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmarContrasena" className={styles.label}>
                  <FaLock className={styles.inputIcon} />
                  Confirmar Contraseña*
                </label>
                <input
                  type="password"
                  id="confirmarContrasena"
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  className={`${styles.input} ${touched.confirmarContrasena && errors.confirmarContrasena ? styles.inputError : ''}`}
                  placeholder="Confirme la contraseña"
                />
                {renderFieldError('confirmarContrasena')}
              </div>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <FaAddressCard className={styles.sectionIcon} />
              Información Personal
            </h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="primerNombre" className={styles.label}>
                  Primer Nombre*
                </label>
                <input
                  type="text"
                  id="primerNombre"
                  name="primerNombre"
                  value={formData.primerNombre}
                  onChange={handleChange}
                  className={`${styles.input} ${touched.primerNombre && errors.primerNombre ? styles.inputError : ''}`}
                  placeholder="Primer nombre"
                />
                {renderFieldError('primerNombre')}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="segundoNombre" className={styles.label}>
                  Segundo Nombre
                </label>
                <input
                  type="text"
                  id="segundoNombre"
                  name="segundoNombre"
                  value={formData.segundoNombre}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Segundo nombre (opcional)"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tercerNombre" className={styles.label}>
                  Tercer Nombre
                </label>
                <input
                  type="text"
                  id="tercerNombre"
                  name="tercerNombre"
                  value={formData.tercerNombre}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Tercer nombre (opcional)"
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="primerApellido" className={styles.label}>
                  Primer Apellido*
                </label>
                <input
                  type="text"
                  id="primerApellido"
                  name="primerApellido"
                  value={formData.primerApellido}
                  onChange={handleChange}
                  className={`${styles.input} ${touched.primerApellido && errors.primerApellido ? styles.inputError : ''}`}
                  placeholder="Primer apellido"
                />
                {renderFieldError('primerApellido')}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="segundoApellido" className={styles.label}>
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  id="segundoApellido"
                  name="segundoApellido"
                  value={formData.segundoApellido}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Segundo apellido (opcional)"
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="telefono" className={styles.label}>
                  <FaPhone className={styles.inputIcon} />
                  Teléfono*
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`${styles.input} ${touched.telefono && errors.telefono ? styles.inputError : ''}`}
                  placeholder="Número de teléfono"
                />
                {renderFieldError('telefono')}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="idTipoUsuario" className={styles.label}>
                  <FaUserTag className={styles.inputIcon} />
                  Tipo de Usuario*
                </label>
                <select
                  id="idTipoUsuario"
                  name="idTipoUsuario"
                  value={formData.idTipoUsuario}
                  onChange={handleChange}
                  className={`${styles.select} ${touched.idTipoUsuario && errors.idTipoUsuario ? styles.inputError : ''}`}
                >
                  <option value={0}>Seleccione un tipo de usuario</option>
                  {tiposUsuario?.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.descripcion}
                    </option>
                  ))}
                </select>
                {renderFieldError('idTipoUsuario')}
                {loading && (
                  <div className={styles.loadingMessage}>
                    <FaSpinner className={styles.loadingIcon} />
                    Cargando tipos de usuario...
                  </div>
                )}
                {error && !loading && (
                  <div className={styles.errorMessage}>
                    <FaInfoCircle className={styles.errorIcon} />
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className={styles.formActions}>
            <UserButton 
              type="button" 
              onClick={() => navigate('/admin/usuarios')}
              className={styles.cancelButton}
            >
              Cancelar
            </UserButton>
            
            <UserButton 
              type="submit"
              disabled={loadingCrear}
              className={styles.submitButton}
            >
              {loadingCrear ? (
                <>
                  <FaSpinner className={styles.spinIcon} />
                  Guardando...
                </>
              ) : (
                <>
                  <FaUserPlus className={styles.iconLeft} />
                  Crear Usuario
                </>
              )}
            </UserButton>
          </div>
        </form>
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
