import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    FaArrowLeft, 
    FaGraduationCap, 
    FaSave, 
    FaCheck, 
    FaSpinner 
} from 'react-icons/fa';
import { useGrado } from '../hooks/useGrado';
import { useNivelesAcademicos } from '../hooks/useNivelesAcademicos';
import { useJornadas } from '../hooks/useJornadas';
import { useEditarGrado } from '../hooks/useEditarGrado';
import styles from './EditGradePage.module.css';

interface FormErrors {
    [key: string]: string;
}

const EditGradePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { grado, getGradoById, loading: gradoLoading, error: gradoError } = useGrado();
  const { niveles, loading: nivelesLoading, error: nivelesError } = useNivelesAcademicos();
  const { jornadas, loading: jornadasLoading, error: jornadasError } = useJornadas();
  const { editarGrado, loading: saveLoading, success, error: saveError } = useEditarGrado();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    idNivel: '',
    idJornada: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Cargar datos del grado cuando se obtiene el ID
  useEffect(() => {
    if (id) {
      getGradoById(id);
    }
  }, [id, getGradoById]);
  
  // Actualizar el formulario cuando se carga el grado
  useEffect(() => {
    if (grado) {
      setFormData({
        nombre: grado.nombre || '',
        idNivel: grado.idNivel.toString() || '',
        idJornada: grado.idJornada.toString() || ''
      });
    }
  }, [grado]);
  
  // Manejar notificaciones de éxito/error
  useEffect(() => {
    if (success) {
      setShowNotification(true);
      setNotificationType('success');
      setNotificationMessage('Grado actualizado exitosamente');
      
      // Redirigir después de mostrar el mensaje a la página de detalle
      const timer = setTimeout(() => {
        navigate(`/admin/grado/${id}`);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    if (saveError) {
      setShowNotification(true);
      setNotificationType('error');
      setNotificationMessage(saveError);
    }
  }, [success, saveError, navigate, id]);
  
  // Validar un campo específico
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'nombre':
        return value.trim() === '' ? 'El nombre del grado es requerido' : '';
      case 'idNivel':
        return value === '' ? 'Debe seleccionar un nivel académico' : '';
      case 'idJornada':
        return value === '' ? 'Debe seleccionar una jornada' : '';
      default:
        return '';
    }
  };

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando se modifica
    if (touched[name] && errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Manejar el evento blur (cuando el campo pierde el foco)
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

  // Validar el formulario completo
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Validar cada campo
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del grado es requerido';
      isValid = false;
    }
    
    if (!formData.idNivel) {
      newErrors.idNivel = 'Debe seleccionar un nivel académico';
      isValid = false;
    }
    
    if (!formData.idJornada) {
      newErrors.idJornada = 'Debe seleccionar una jornada';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    // Marcar todos los campos como tocados
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    return isValid;
  };
  
  // Enviar formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (id) {
      const gradoData = {
        id: parseInt(id),
        nombre: formData.nombre,
        idNivel: parseInt(formData.idNivel),
        idJornada: parseInt(formData.idJornada)
      };
      
      const success = await editarGrado(gradoData);
      
      if (success) {
        setShowNotification(true);
        setNotificationType('success');
        setNotificationMessage('Grado actualizado exitosamente');
        // No necesitamos redirigir aquí ya que se maneja en el useEffect
      }
    }
  };
  
  // Si está cargando los datos iniciales
  if (gradoLoading || nivelesLoading || jornadasLoading) {
    return (
      <div className={styles.editGradeContainer}>
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg">Cargando información del grado...</div>
        </div>
      </div>
    );
  }
  
  // Si hay error al cargar datos
  if (gradoError || nivelesError || jornadasError) {
    const errorMessage = gradoError || nivelesError || jornadasError;
    return (
      <div className={styles.editGradeContainer}>
        <div className="text-center py-16">
          <div className="text-red-500 text-lg">Error: {errorMessage}</div>
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
  
  // Si no se encuentra el grado
  if (!grado && !gradoLoading) {
    return (
      <div className={styles.editGradeContainer}>
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
    <div className={styles.formContainer}>
      {/* Encabezado con navegación */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to="/admin/grados">Grados</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link to={`/admin/grados/detalle/${id}`}>Detalle del grado</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Editar grado</span>
        </div>

        <div className={styles.actionButtons}>
          <Link to={`/admin/grados/detalle/${id}`} className={styles.buttonReturn}>
            <FaArrowLeft size={14} />
            <span>Volver a detalles</span>
          </Link>
        </div>
      </div>
      
      {/* Formulario de edición */}
      {grado && (
        <form onSubmit={handleSubmit}>
          <div className={styles.formCard}>
            {/* Información básica del grado */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <FaGraduationCap />
                </div>
                <h3 className={styles.sectionTitle}>Información del grado</h3>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="id" className={styles.inputLabel}>
                    ID
                  </label>
                  <div className={styles.inputWrapper}>
                    <FaGraduationCap className={styles.inputIcon} />
                    <input
                      type="text"
                      id="id"
                      name="id"
                      className={styles.input}
                      value={id || ''}
                      disabled
                      readOnly
                    />
                  </div>
                  <p className={styles.helpText}>El ID del grado no puede modificarse</p>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="nombre" className={`${styles.inputLabel} ${styles.requiredField}`}>
                    Nombre del grado
                  </label>
                  <div className={styles.inputWrapper}>
                    <FaGraduationCap className={styles.inputIcon} />
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className={styles.input}
                      value={formData.nombre}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Ej. Primero primaria"
                    />
                  </div>
                  {touched?.nombre && errors?.nombre && (
                    <p className={styles.errorText}>{errors.nombre}</p>
                  )}
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="idNivel" className={`${styles.inputLabel} ${styles.requiredField}`}>
                    Nivel académico
                  </label>
                  <div className={styles.inputWrapper}>
                    <FaGraduationCap className={styles.inputIcon} />
                    <select
                      id="idNivel"
                      name="idNivel"
                      className={styles.input}
                      value={formData.idNivel}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Seleccionar nivel académico</option>
                      {niveles.map((nivel) => (
                        <option key={nivel.id} value={nivel.id}>
                          {nivel.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  {touched?.idNivel && errors?.idNivel && (
                    <p className={styles.errorText}>{errors.idNivel}</p>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="idJornada" className={`${styles.inputLabel} ${styles.requiredField}`}>
                    Jornada
                  </label>
                  <div className={styles.inputWrapper}>
                    <FaGraduationCap className={styles.inputIcon} />
                    <select
                      id="idJornada"
                      name="idJornada"
                      className={styles.input}
                      value={formData.idJornada}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Seleccionar jornada</option>
                      {jornadas.map((jornada) => (
                        <option key={jornada.id} value={jornada.id}>
                          {jornada.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  {touched?.idJornada && errors?.idJornada && (
                    <p className={styles.errorText}>{errors.idJornada}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones del formulario */}
            <div className={styles.formActions}>
              <Link to={`/admin/grados/detalle/${id}`} className={styles.cancelButton}>
                Cancelar
              </Link>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <FaSpinner className={styles.spinnerIcon} />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <FaSave style={{ marginRight: '6px' }} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
      
      {/* Notificación */}
      {showNotification && (
        <div className={`${styles.notification} ${styles[notificationType]}`}>
          <div className={styles.notificationContent}>
            <div className={styles.notificationIcon}>
              {notificationType === 'success' ? (
                <FaCheck />
              ) : (
                <span className={styles.errorIcon}>!</span>
              )}
            </div>
            <div className={styles.notificationText}>
              <h4>
                {notificationType === 'success' ? 'Operación exitosa' : 'Error'}
              </h4>
              <p>{notificationMessage}</p>
            </div>
          </div>
          <button
            className={styles.closeNotification}
            onClick={() => setShowNotification(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default EditGradePage;
