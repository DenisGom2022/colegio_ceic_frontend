import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaGraduationCap,
  FaCheck,
  FaSpinner,
  FaSchool,
  FaClock,
  FaListAlt,
  FaPlus
} from 'react-icons/fa';
import styles from './CreateGradePage.module.css';
import { useCreateGrade } from '../hooks/useGradeMutation';
import { useNivelesAcademicos } from '../hooks/useNivelesAcademicos';
import { useJornadas } from '../hooks/useJornadas';
import { useCreateNivel } from '../hooks/useCreateNivel';
import { useCreateJornada } from '../hooks/useCreateJornada';
import FloatingNotification from '../../../../../components/FloatingNotification';

interface FormData {
  nombre: string;
  idNivel: string;
  idJornada: string;
}

interface FormErrors {
  [key: string]: string;
}

export const CreateGradePage: React.FC = () => {
  const { createGrade, loading, error, success } = useCreateGrade();
  const { createNivel, loading: loadingNivel } = useCreateNivel();
  const { createJornada, loading: loadingJornada } = useCreateJornada();
  
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    idNivel: '',
    idJornada: ''
  });
  
  // Estados para nuevos niveles y jornadas
  const [showNewNivelForm, setShowNewNivelForm] = useState(false);
  const [showNewJornadaForm, setShowNewJornadaForm] = useState(false);
  const [newNivel, setNewNivel] = useState('');
  const [newJornada, setNewJornada] = useState('');
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Usar hooks para cargar niveles académicos y jornadas
  const { niveles, loading: loadingNiveles, error: errorNiveles, reloadNiveles } = useNivelesAcademicos();
  const { jornadas, loading: loadingJornadas, error: errorJornadas, reloadJornadas } = useJornadas();
  
  // Determinar si las opciones están cargando
  const loadingOptions = loadingNiveles || loadingJornadas;
  
  // Mostrar errores de carga de opciones si ocurren
  useEffect(() => {
    if (errorNiveles) {
      setErrorMessage(`Error al cargar niveles académicos: ${errorNiveles}`);
      setShowNotification(true);
    }
    if (errorJornadas) {
      setErrorMessage(`Error al cargar jornadas: ${errorJornadas}`);
      setShowNotification(true);
    }
  }, [errorNiveles, errorJornadas]);
  
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'nombre':
        return value.trim() === '' ? 'El nombre es requerido' : '';
      case 'idNivel':
        return value.trim() === '' ? 'El nivel académico es requerido' : '';
      case 'idJornada':
        return value.trim() === '' ? 'La jornada es requerida' : '';
      default:
        return '';
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  const [successMessage, setSuccessMessage] = useState<string>("");
  
  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      idNivel: '',
      idJornada: ''
    });
    setTouched({});
    setErrors({});
    setSubmitSuccess(false);
  };
  
  // Función para crear un nuevo nivel académico
  const handleCreateNivel = async () => {
    
    if (newNivel.trim() === '') {
      setErrorMessage('El nombre del nivel académico es requerido');
      setShowNotification(true);
      return;
    }
    
    try {
      const result = await createNivel({ descripcion: newNivel.trim() });
      
      // Actualizar el formulario con el nuevo nivel
      setFormData(prev => ({
        ...prev,
        idNivel: result.id.toString()
      }));
      
      // Recargar la lista de niveles académicos
      await reloadNiveles();
      
      // Cerrar formulario y limpiar entrada
      setShowNewNivelForm(false);
      setNewNivel('');
      
      // Mostrar notificación de éxito
      setSuccessMessage('Nivel académico creado correctamente');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error: any) {
      console.error('Error al crear nivel académico:', error);
      setErrorMessage(error?.message || 'Error al crear nivel académico');
      setShowNotification(true);
    }
  };
  
  // Función para crear una nueva jornada
  const handleCreateJornada = async () => {
    
    if (newJornada.trim() === '') {
      setErrorMessage('El nombre de la jornada es requerido');
      setShowNotification(true);
      return;
    }
    
    try {
      const result = await createJornada({ descripcion: newJornada.trim() });
      
      // Actualizar el formulario con la nueva jornada
      setFormData(prev => ({
        ...prev,
        idJornada: result.id.toString()
      }));
      
      // Recargar la lista de jornadas
      await reloadJornadas();
      
      // Cerrar formulario y limpiar entrada
      setShowNewJornadaForm(false);
      setNewJornada('');
      
      // Mostrar notificación de éxito
      setSuccessMessage('Jornada creada correctamente');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error: any) {
      console.error('Error al crear jornada:', error);
      setErrorMessage(error?.message || 'Error al crear jornada');
      setShowNotification(true);
    }
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
        const result = await createGrade({
          nombre: formData.nombre.trim(),
          idNivel: parseInt(formData.idNivel),
          idJornada: parseInt(formData.idJornada)
        });
        
        if (result) {
          // Limpiar formulario para permitir crear otro grado
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
        setErrorMessage(error?.message || "Error inesperado al crear el grado");
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
    <div className={styles.formContainer}>
      {/* Encabezado con migas de pan */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to="/admin/grados" className={styles.breadcrumbLink}>Grados</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Crear nuevo grado</span>
        </div>
        
        <Link to="/admin/grados" className={styles.buttonCancel}>
          <FaArrowLeft size={14} style={{ marginRight: '6px' }} />
          Volver a la lista
        </Link>
      </div>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div className={styles.formCard}>
          {/* Sección: Información del grado */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FaGraduationCap />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>Información del grado</h3>
                <p className={styles.sectionDescription}>Datos básicos del grado académico</p>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Nombre del grado
                </label>
                <div className={styles.inputWrapper}>
                  <FaGraduationCap className={styles.inputIcon} />
                  <input
                    type="text"
                    name="nombre"
                    className={styles.input}
                    placeholder="Ingrese el nombre del grado"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {touched.nombre && !errors.nombre && (
                    <FaCheck className={styles.successIndicator} />
                  )}
                </div>
                {touched.nombre && errors.nombre && (
                  <p className={styles.errorText}>{errors.nombre}</p>
                )}
                <p className={styles.helpText}>Nombre del grado académico (ej: Primero, Segundo, etc.)</p>
              </div>
            </div>
          </div>
          
          {/* Sección: Clasificación */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FaListAlt />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>Clasificación</h3>
                <p className={styles.sectionDescription}>Nivel académico y jornada</p>
              </div>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Nivel Académico
                </label>
                {!showNewNivelForm ? (
                  <>
                    <div className={styles.inputWrapper}>
                      <FaSchool className={styles.inputIcon} />
                      <select
                        name="idNivel"
                        className={styles.select}
                        value={formData.idNivel}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        disabled={loadingOptions || loadingNivel}
                      >
                        <option value="">Seleccionar nivel académico</option>
                        {niveles.map(nivel => (
                          <option key={nivel.id} value={nivel.id}>
                            {nivel.descripcion}
                          </option>
                        ))}
                      </select>
                      {loadingOptions && <div className={styles.loaderSmall}></div>}
                    </div>
                    <div className={styles.formActions} style={{ justifyContent: 'flex-start', borderTop: 'none', paddingTop: '8px', marginTop: '8px' }}>
                      <button 
                        type="button"
                        className={styles.addNewButton}
                        onClick={() => setShowNewNivelForm(true)}
                      >
                        <FaPlus size={12} style={{ marginRight: '6px' }} />
                        Crear nuevo nivel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={styles.nestedForm}>
                    <div className={styles.inputWrapper}>
                      <FaSchool className={styles.inputIcon} />
                      <input
                        type="text"
                        value={newNivel}
                        onChange={(e) => setNewNivel(e.target.value)}
                        className={styles.input}
                        placeholder="Nombre del nuevo nivel académico"
                      />
                      {loadingNivel && <div className={styles.loaderSmall}></div>}
                    </div>
                    <div className={styles.formActions} style={{ justifyContent: 'flex-start', borderTop: 'none', paddingTop: '8px', marginTop: '8px' }}>
                      <button 
                        type="button" 
                        className={styles.cancelButton}
                        onClick={() => {
                          setShowNewNivelForm(false);
                          setNewNivel('');
                        }}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="button" 
                        className={styles.addButton}
                        disabled={loadingNivel || !newNivel.trim()}
                        onClick={handleCreateNivel}
                      >
                        {loadingNivel ? (
                          <>
                            <FaSpinner className={styles.spinnerIcon} />
                            <span>Creando...</span>
                          </>
                        ) : (
                          'Guardar nivel'
                        )}
                      </button>
                    </div>
                  </div>
                )}
                {touched.idNivel && errors.idNivel && (
                  <p className={styles.errorText}>{errors.idNivel}</p>
                )}
                <p className={styles.helpText}>Seleccione el nivel académico al que pertenece este grado o cree uno nuevo</p>
              </div>
              
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Jornada
                </label>
                {!showNewJornadaForm ? (
                  <>
                    <div className={styles.inputWrapper}>
                      <FaClock className={styles.inputIcon} />
                      <select
                        name="idJornada"
                        className={styles.select}
                        value={formData.idJornada}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        disabled={loadingOptions || loadingJornada}
                      >
                        <option value="">Seleccionar jornada</option>
                        {jornadas.map(jornada => (
                          <option key={jornada.id} value={jornada.id}>
                            {jornada.descripcion}
                          </option>
                        ))}
                      </select>
                      {loadingOptions && <div className={styles.loaderSmall}></div>}
                    </div>
                    <div className={styles.formActions} style={{ justifyContent: 'flex-start', borderTop: 'none', paddingTop: '8px', marginTop: '8px' }}>
                      <button 
                        type="button"
                        className={styles.addNewButton}
                        onClick={() => setShowNewJornadaForm(true)}
                      >
                        <FaPlus size={12} style={{ marginRight: '6px' }} />
                        Crear nueva jornada
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={styles.nestedForm}>
                    <div className={styles.inputWrapper}>
                      <FaClock className={styles.inputIcon} />
                      <input
                        type="text"
                        value={newJornada}
                        onChange={(e) => setNewJornada(e.target.value)}
                        className={styles.input}
                        placeholder="Nombre de la nueva jornada"
                      />
                      {loadingJornada && <div className={styles.loaderSmall}></div>}
                    </div>
                    <div className={styles.formActions} style={{ justifyContent: 'flex-start', borderTop: 'none', paddingTop: '8px', marginTop: '8px' }}>
                      <button 
                        type="button" 
                        className={styles.cancelButton}
                        onClick={() => {
                          setShowNewJornadaForm(false);
                          setNewJornada('');
                        }}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="button" 
                        className={styles.addButton}
                        onClick={handleCreateJornada}
                        disabled={loadingJornada || !newJornada.trim()}
                      >
                        {loadingJornada ? (
                          <>
                            <FaSpinner className={styles.spinnerIcon} />
                            <span>Creando...</span>
                          </>
                        ) : (
                          'Guardar jornada'
                        )}
                      </button>
                    </div>
                  </div>
                )}
                {touched.idJornada && errors.idJornada && (
                  <p className={styles.errorText}>{errors.idJornada}</p>
                )}
                <p className={styles.helpText}>Seleccione la jornada en que se imparte este grado o cree una nueva</p>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className={styles.formActions}>
            <Link
              to="/admin/grados"
              className={styles.buttonCancel}
            >
              Cancelar
            </Link>
            <button 
              type="submit" 
              className={`${styles.buttonSubmit} ${loading ? styles.buttonLoading : ''}`}
              disabled={loading || submitSuccess}
            >
              {loading ? (
                <>
                  <FaSpinner className={styles.spinnerIcon} />
                  <span>Creando grado...</span>
                </>
              ) : (
                <>
                  <FaCheck style={{ marginRight: '6px' }} />
                  Guardar Grado
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      
      {/* Notificaciones */}
      {showNotification && errorMessage && (
        <FloatingNotification 
          type="error"
          title="Error"
          message={errorMessage}
          onClose={() => {
            setShowNotification(false);
            setErrorMessage("");
          }}
          autoCloseTime={0} // No cerrará automáticamente los errores
        />
      )}
      
      {showNotification && submitSuccess && (
        <FloatingNotification 
          type="success"
          title="Grado creado exitosamente"
          message="El grado ha sido creado correctamente. Puedes crear otro grado."
          onClose={() => {
            setShowNotification(false);
            if (submitSuccess) {
              setSubmitSuccess(false);
            }
          }}
          autoCloseTime={5000} // 5 segundos para cerrar automáticamente
        />
      )}
      
      {showNotification && successMessage && !errorMessage && !submitSuccess && (
        <FloatingNotification 
          type="success"
          title="Éxito"
          message={successMessage}
          onClose={() => {
            setShowNotification(false);
            setSuccessMessage("");
          }}
          autoCloseTime={3000} // 3 segundos para cerrar automáticamente
        />
      )}
    </div>
  );
};

export default CreateGradePage;
