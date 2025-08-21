import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaGraduationCap,
  FaCheck,
  FaSpinner,
  FaUser,
  FaListAlt,
  FaExclamationCircle,
  FaSearch
} from 'react-icons/fa';
import styles from './AddCoursePage.module.css';
import { useGrado, useCurso } from '../hooks';
import FloatingNotification from '../../../../../components/FloatingNotification/FloatingNotification';
// import TeacherSelectionModal from '../components/TeacherSelectionModal';
import TeacherSelectionModal from '../components/TeacherSelectionModal';

interface FormData {
  nombre: string;
  notaMaxima: number;
  notaAprobada: number;
  dpiCatedratico: string;
  catedraticoNombre?: string;
}

interface FormErrors {
  [key: string]: string;
}

export const AddCoursePage: React.FC = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const navigate = useNavigate();
  
  const { grado, getGradoById, loading: gradeLoading } = useGrado();
  const { 
    loading: courseLoading, 
    error: courseError, 
    message: courseMessage,
    createCourseForGrade
  } = useCurso();

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    notaMaxima: 100,
    notaAprobada: 60,
    dpiCatedratico: '',
    catedraticoNombre: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (gradeId) {
      getGradoById(gradeId);
    }
  }, [gradeId, getGradoById]);

  useEffect(() => {
    if (courseMessage) {
      setNotificationType('success');
      setNotificationMessage(courseMessage);
      setShowNotification(true);
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate(`/admin/grados/${gradeId}`);
      }, 2000);
    }
  }, [courseMessage, navigate, gradeId]);

  useEffect(() => {
    if (courseError) {
      setNotificationType('error');
      setNotificationMessage(courseError);
      setShowNotification(true);
    }
  }, [courseError]);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'nombre':
        if (!value || value.trim().length === 0) {
          return 'El nombre del curso es requerido';
        }
        if (value.trim().length < 3) {
          return 'El nombre debe tener al menos 3 caracteres';
        }
        if (value.trim().length > 100) {
          return 'El nombre no puede exceder 100 caracteres';
        }
        return '';

      case 'notaMaxima':
        if (!value || isNaN(value)) {
          return 'La nota máxima es requerida';
        }
        if (value <= 0 || value > 100) {
          return 'La nota máxima debe estar entre 1 y 100';
        }
        return '';

      case 'notaAprobada':
        if (!value || isNaN(value)) {
          return 'La nota de aprobación es requerida';
        }
        if (value <= 0 || value > formData.notaMaxima) {
          return `La nota de aprobación debe estar entre 1 y ${formData.notaMaxima}`;
        }
        return '';

      case 'dpiCatedratico':
        if (!value || value.trim().length === 0) {
          return 'Debe seleccionar un catedrático';
        }
        return '';

      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'catedraticoNombre') {
        const error = validateField(key, formData[key as keyof FormData]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const processedValue = name === 'notaMaxima' || name === 'notaAprobada' 
      ? parseFloat(value) || 0 
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (touched[name]) {
      const error = validateField(name, processedValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleTeacherSelect = (teacher: { dpi: string; nombres: string; apellidos: string }) => {
    setFormData(prev => ({
      ...prev,
      dpiCatedratico: teacher.dpi,
      catedraticoNombre: `${teacher.nombres} ${teacher.apellidos}`
    }));
    
    setErrors(prev => ({
      ...prev,
      dpiCatedratico: ''
    }));
    
    setShowTeacherModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allFields = Object.keys(formData).reduce((acc, key) => {
      if (key !== 'catedraticoNombre') {
        acc[key] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allFields);

    if (!validateForm()) {
      setNotificationType('error');
      setNotificationMessage('Por favor, corrija los errores en el formulario');
      setShowNotification(true);
      return;
    }

    if (!gradeId) {
      setNotificationType('error');
      setNotificationMessage('ID de grado no válido');
      setShowNotification(true);
      return;
    }

    try {
      await createCourseForGrade({
        nombre: formData.nombre.trim(),
        notaMaxima: formData.notaMaxima,
        notaAprobada: formData.notaAprobada,
        dpiCatedratico: formData.dpiCatedratico,
        idGrado: parseInt(gradeId)
      });
    } catch (error) {
      console.error('Error al crear el curso:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/grados/${gradeId}`);
  };

  if (gradeLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.loadingIcon} />
          <span>Cargando información del grado...</span>
        </div>
      </div>
    );
  }

  if (!grado) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <FaExclamationCircle className={styles.errorIcon} />
          <h3>Grado no encontrado</h3>
          <p>No se pudo cargar la información del grado.</p>
          <Link to="/admin/grados" className={styles.backButton}>
            <FaArrowLeft size={14} />
            Volver a la lista de grados
          </Link>
        </div>
      </div>
    );
  }

  const activeCycle = grado.ciclosActivos?.[0];
  if (!activeCycle) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <FaExclamationCircle className={styles.errorIcon} />
          <h3>Sin ciclo activo</h3>
          <p>Este grado no tiene un ciclo activo. No se pueden agregar cursos.</p>
          <Link to={`/admin/grados/${gradeId}`} className={styles.backButton}>
            <FaArrowLeft size={14} />
            Volver al detalle del grado
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to="/admin/grados">Grados</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link to={`/admin/grados/${gradeId}`}>{grado.nombre}</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Agregar curso</span>
        </div>

        <div className={styles.pageTitle}>
          <div className={styles.titleIcon}>
            <FaGraduationCap size={24} />
          </div>
          <div className={styles.titleContent}>
            <h1>Agregar Nuevo Curso</h1>
            <p>Agregue un curso al grado {grado.nombre} en el ciclo {activeCycle.ciclo.descripcion}</p>
          </div>
        </div>
      </div>

      {/* Información del contexto */}
      <div className={styles.contextCard}>
        <div className={styles.contextHeader}>
          <FaListAlt size={16} />
          <span>Información del contexto</span>
        </div>
        <div className={styles.contextGrid}>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Grado:</span>
            <span className={styles.contextValue}>{grado.nombre}</span>
          </div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Nivel:</span>
            <span className={styles.contextValue}>{grado.nivelAcademico.descripcion}</span>
          </div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Jornada:</span>
            <span className={styles.contextValue}>{grado.jornada.descripcion}</span>
          </div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Ciclo:</span>
            <span className={styles.contextValue}>{activeCycle.ciclo.descripcion}</span>
          </div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Cursos actuales:</span>
            <span className={styles.contextValue}>{activeCycle.cursos?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <FaGraduationCap size={20} />
          <h2>Información del curso</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Nombre del curso */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <FaGraduationCap size={14} />
                Nombre del curso *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.formInput} ${errors.nombre ? styles.inputError : ''}`}
                placeholder="Ej. Matemáticas, Ciencias Naturales, Historia..."
                maxLength={100}
              />
              {errors.nombre && (
                <span className={styles.errorMessage}>
                  <FaExclamationCircle size={12} />
                  {errors.nombre}
                </span>
              )}
            </div>

            {/* Nota máxima */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <FaCheck size={14} />
                Nota máxima *
              </label>
              <input
                type="number"
                name="notaMaxima"
                value={formData.notaMaxima}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.formInput} ${errors.notaMaxima ? styles.inputError : ''}`}
                min="1"
                max="100"
                step="0.1"
              />
              {errors.notaMaxima && (
                <span className={styles.errorMessage}>
                  <FaExclamationCircle size={12} />
                  {errors.notaMaxima}
                </span>
              )}
            </div>

            {/* Nota de aprobación */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <FaCheck size={14} />
                Nota de aprobación *
              </label>
              <input
                type="number"
                name="notaAprobada"
                value={formData.notaAprobada}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.formInput} ${errors.notaAprobada ? styles.inputError : ''}`}
                min="1"
                max={formData.notaMaxima}
                step="0.1"
              />
              {errors.notaAprobada && (
                <span className={styles.errorMessage}>
                  <FaExclamationCircle size={12} />
                  {errors.notaAprobada}
                </span>
              )}
            </div>

            {/* Catedrático */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <FaUser size={14} />
                Catedrático *
              </label>
              <div className={styles.teacherSelection}>
                <input
                  type="text"
                  value={formData.catedraticoNombre || 'Seleccione un catedrático...'}
                  readOnly
                  className={`${styles.formInput} ${styles.teacherInput} ${errors.dpiCatedratico ? styles.inputError : ''}`}
                  onClick={() => setShowTeacherModal(true)}
                />
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(true)}
                  className={styles.teacherSelectButton}
                >
                  <FaSearch size={14} />
                  Seleccionar
                </button>
              </div>
              {errors.dpiCatedratico && (
                <span className={styles.errorMessage}>
                  <FaExclamationCircle size={12} />
                  {errors.dpiCatedratico}
                </span>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={courseLoading}
            >
              <FaArrowLeft size={14} />
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={courseLoading}
            >
              {courseLoading ? (
                <>
                  <FaSpinner className={styles.loadingIcon} />
                  Creando curso...
                </>
              ) : (
                <>
                  <FaCheck size={14} />
                  Crear curso
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de selección de maestro */}
      {showTeacherModal && (
        <TeacherSelectionModal
          isOpen={showTeacherModal}
          onClose={() => setShowTeacherModal(false)}
          onSelect={handleTeacherSelect}
        />
      )}

      {/* Notificaciones */}
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

export default AddCoursePage;
