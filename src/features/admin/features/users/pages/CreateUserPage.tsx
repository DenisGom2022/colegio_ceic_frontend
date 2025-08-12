import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './CreateUserPage.module.css';
import FloatingNotification from '../../../../../components/FloatingNotification';
import { 
  FaUser, 
  FaIdCard, 
  FaPhone, 
  FaUserTag, 
  FaLock, 
  FaArrowLeft,
  FaCheck,
  FaInfoCircle,
  FaUserPlus,
  FaShieldAlt,
  FaAddressCard,
  FaSpinner
} from 'react-icons/fa';
import { useTiposUsuario, useUsuario } from '../hooks';

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
  const { crearNuevoUsuario, error: errorCrear, loading: loadingCrear } = useUsuario();
  
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
    idTipoUsuario: 2,
    correo: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'usuario':
        return value.trim() === '' ? 'El usuario es requerido' : 
               value.length < 4 ? 'El usuario debe tener al menos 4 caracteres' : '';
      case 'contrasena':
        return value.trim() === '' ? 'La contraseña es requerida' : 
               value.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : '';
      case 'confirmarContrasena':
        return value !== formData.contrasena ? 'Las contraseñas no coinciden' : '';
      case 'primerNombre':
      case 'primerApellido':
        return value.trim() === '' ? 'Este campo es requerido' : '';
      case 'telefono':
        return value.trim() === '' ? 'El teléfono es requerido' : 
               !/^[0-9]{8,12}$/.test(value) ? 'Ingrese un número de teléfono válido' : '';
      case 'correo':
        return value.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 
               'Ingrese un correo electrónico válido' : '';
      default:
        return '';
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
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
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Validar todos los campos
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'segundoNombre' && key !== 'tercerNombre' && key !== 'segundoApellido' && key !== 'correo') {
        const errorMessage = validateField(key, value as string);
        if (errorMessage) {
          newErrors[key] = errorMessage;
          isValid = false;
        }
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
      usuario: '',
      contrasena: '',
      confirmarContrasena: '',
      primerNombre: '',
      segundoNombre: '',
      tercerNombre: '',
      primerApellido: '',
      segundoApellido: '',
      telefono: '',
      idTipoUsuario: 2,
      correo: ''
    });
    setTouched({});
    setErrors({});
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
        const response = await crearNuevoUsuario(formData);
        
        // Mostrar notificación basada en la respuesta directamente
        if (response.success) {
          setSubmitSuccess(true);
          setShowNotification(true);
          
          // Limpiar formulario para permitir crear otro usuario
          resetForm();
        } else {
          // Mostrar notificación de error con el mensaje recibido directamente
          setSubmitSuccess(false);
          setShowNotification(true);
          // Guardamos el error para mostrarlo en la notificación
          if (response.errorMessage) {
            setErrorMessage(response.errorMessage);
            console.error('Error al crear usuario:', response.errorMessage);
          }
        }
      } catch (error: any) {
        console.error('Error inesperado:', error);
        setSubmitSuccess(false);
        setShowNotification(true);
        setErrorMessage(error?.message || "Error inesperado al crear el usuario");
        // No redirigimos en caso de error
      }
    } else {
      console.log('Formulario con errores de validación');
    }
  };

  return (
    <div className={styles.formContainer}>
      {/* Encabezado con migas de pan */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to="/admin/usuarios">Usuarios</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Crear nuevo usuario</span>
        </div>
        
        <Link to="/admin/usuarios" className={styles.buttonCancel}>
          <FaArrowLeft size={14} style={{ marginRight: '6px' }} />
          Volver a la lista
        </Link>
      </div>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        {/* Sección: Información de acceso */}
        <div className={styles.formCard}>
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FaShieldAlt />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>Información de acceso</h3>
                <p className={styles.sectionDescription}>Datos para ingresar al sistema</p>
              </div>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Usuario
                </label>
                <div className={styles.inputWrapper}>
                  <FaUser className={styles.inputIcon} />
                  <input
                    type="text"
                    name="usuario"
                    className={styles.input}
                    placeholder="Ingrese nombre de usuario"
                    value={formData.usuario}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {touched.usuario && !errors.usuario && (
                    <FaCheck className={styles.successIndicator} />
                  )}
                </div>
                {touched.usuario && errors.usuario && (
                  <p className={styles.errorText}>{errors.usuario}</p>
                )}
                <p className={styles.helpText}>El nombre de usuario debe ser único</p>
              </div>
              
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Correo electrónico
                </label>
                <div className={styles.inputWrapper}>
                  <FaInfoCircle className={styles.inputIcon} />
                  <input
                    type="email"
                    name="correo"
                    className={styles.input}
                    placeholder="correo@ejemplo.com"
                    value={formData.correo}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {touched.correo && !errors.correo && formData.correo && (
                    <FaCheck className={styles.successIndicator} />
                  )}
                </div>
                {touched.correo && errors.correo && (
                  <p className={styles.errorText}>{errors.correo}</p>
                )}
              </div>
              
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Contraseña
                </label>
                <div className={styles.inputWrapper}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    name="contrasena"
                    className={styles.input}
                    placeholder="Ingrese contraseña"
                    value={formData.contrasena}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.contrasena && errors.contrasena && (
                  <p className={styles.errorText}>{errors.contrasena}</p>
                )}
                <p className={styles.helpText}>Mínimo 6 caracteres</p>
              </div>
              
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Confirmar contraseña
                </label>
                <div className={styles.inputWrapper}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    name="confirmarContrasena"
                    className={styles.input}
                    placeholder="Confirme la contraseña"
                    value={formData.confirmarContrasena}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {touched.confirmarContrasena && 
                   formData.confirmarContrasena && 
                   !errors.confirmarContrasena && (
                    <FaCheck className={styles.successIndicator} />
                  )}
                </div>
                {touched.confirmarContrasena && errors.confirmarContrasena && (
                  <p className={styles.errorText}>{errors.confirmarContrasena}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Sección: Información personal */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FaAddressCard />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>Información personal</h3>
                <p className={styles.sectionDescription}>Datos personales del usuario</p>
              </div>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Primer Nombre
                </label>
                <div className={styles.inputWrapper}>
                  <FaIdCard className={styles.inputIcon} />
                  <input
                    type="text"
                    name="primerNombre"
                    className={styles.input}
                    placeholder="Primer nombre"
                    value={formData.primerNombre}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.primerNombre && errors.primerNombre && (
                  <p className={styles.errorText}>{errors.primerNombre}</p>
                )}
              </div>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Segundo Nombre
                </label>
                <div className={styles.inputWrapper}>
                  <FaIdCard className={styles.inputIcon} />
                  <input
                    type="text"
                    name="segundoNombre"
                    className={styles.input}
                    placeholder="Segundo nombre"
                    value={formData.segundoNombre}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Tercer Nombre
                </label>
                <div className={styles.inputWrapper}>
                  <FaIdCard className={styles.inputIcon} />
                  <input
                    type="text"
                    name="tercerNombre"
                    className={styles.input}
                    placeholder="Tercer nombre (opcional)"
                    value={formData.tercerNombre}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Primer Apellido
                </label>
                <div className={styles.inputWrapper}>
                  <FaIdCard className={styles.inputIcon} />
                  <input
                    type="text"
                    name="primerApellido"
                    className={styles.input}
                    placeholder="Primer apellido"
                    value={formData.primerApellido}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.primerApellido && errors.primerApellido && (
                  <p className={styles.errorText}>{errors.primerApellido}</p>
                )}
              </div>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Segundo Apellido
                </label>
                <div className={styles.inputWrapper}>
                  <FaIdCard className={styles.inputIcon} />
                  <input
                    type="text"
                    name="segundoApellido"
                    className={styles.input}
                    placeholder="Segundo apellido"
                    value={formData.segundoApellido}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Teléfono
                </label>
                <div className={styles.inputWrapper}>
                  <FaPhone className={styles.inputIcon} />
                  <input
                    type="tel"
                    name="telefono"
                    className={styles.input}
                    placeholder="Número de teléfono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.telefono && errors.telefono && (
                  <p className={styles.errorText}>{errors.telefono}</p>
                )}
                <p className={styles.helpText}>Formato: 12345678 (8-12 dígitos)</p>
              </div>
            </div>
          </div>
          
          {/* Sección: Tipo de usuario */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FaUserPlus />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>Tipo de usuario</h3>
                <p className={styles.sectionDescription}>Roles y permisos del sistema</p>
              </div>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Tipo de Usuario
                </label>
                <div className={styles.inputWrapper}>
                  <FaUserTag className={styles.inputIcon} />
                  <select
                    name="idTipoUsuario"
                    className={styles.select}
                    value={formData.idTipoUsuario}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    {loading ? (
                      <option value="">Cargando tipos de usuario...</option>
                    ) : error ? (
                      <option value="">Error: No se pudieron cargar los tipos</option>
                    ) : tiposUsuario && tiposUsuario.length > 0 ? (
                      tiposUsuario.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.descripcion}
                        </option>
                      ))
                    ) : (
                      <option value="">No hay tipos de usuario disponibles</option>
                    )}
                  </select>
                  {loading && <div className={styles.loaderSmall}></div>}
                  {error && <p className={styles.errorText}>{error}</p>}
                </div>
                <p className={styles.helpText}>Define los permisos en el sistema</p>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.buttonCancel}
              onClick={() => navigate('/admin/usuarios')}
              disabled={loadingCrear}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={`${styles.buttonSubmit} ${loadingCrear ? styles.buttonLoading : ''}`}
              disabled={loadingCrear || submitSuccess}
            >
              {loadingCrear ? (
                <>
                  <FaSpinner className={styles.spinnerIcon} />
                  <span>Creando usuario...</span>
                </>
              ) : (
                'Guardar Usuario'
              )}
            </button>
          </div>
        </div>
      </form>
      
      {/* Notificación flotante */}
      {showNotification && !submitSuccess && (
        <FloatingNotification 
          type="error"
          title="Error al crear usuario"
          message={errorMessage || errorCrear || "Ocurrió un error al crear el usuario. Por favor, inténtelo nuevamente."}
          onClose={() => setShowNotification(false)}
          autoCloseTime={0} // No cerrará automáticamente los errores
        />
      )}
      
      {showNotification && submitSuccess && (
        <FloatingNotification 
          type="success"
          title="Usuario creado exitosamente"
          message="El usuario ha sido creado correctamente. Puedes crear otro usuario."
          onClose={() => setShowNotification(false)}
          autoCloseTime={5000} // 5 segundos para cerrar automáticamente
        />
      )}
    </div>
  );
};
