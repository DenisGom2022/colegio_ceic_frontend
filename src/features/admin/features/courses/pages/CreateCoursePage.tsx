import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaSpinner,
  FaExclamationCircle,
  FaBookOpen,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaLayerGroup,
  FaClock,
  FaStar
} from 'react-icons/fa';
import styles from './CreateCoursePage.module.css';
import { useGrado } from '../../grades/hooks';
import { useCourse } from '../hooks';
import { gradoService, type Grado } from '../../grades/services/gradoService';
import TeacherSelectionModal from '../../grades/components/TeacherSelectionModal';
import GradeSelectionModal from '../components/GradeSelectionModal';
import FloatingNotification from '../../../../../components/FloatingNotification/FloatingNotification';

interface FormData {
  nombre: string;
  notaMaxima: number;
  notaAprobada: number;
  dpiCatedratico: string;
  catedraticoNombre?: string;
  idGrado?: number;
  gradoNombre?: string;
  gradoDescripcionCiclo?: string;
  gradoNivelAcademico?: string;
  gradoJornada?: string;
}

interface FormErrors {
  [key: string]: string;
}

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { gradeId } = useParams<{ gradeId: string }>();
  
  // Determinar contexto de navegación
  const isFromGrade = location.pathname.includes('/grados/') && gradeId;
  const isFromCourses = location.pathname === '/admin/crear-curso';

  const [grades, setGrades] = useState<Grado[]>([]);
  const [gradesLoading, setGradesLoading] = useState(false);
  
  const { grado, getGradoById, loading: gradeLoading } = useGrado();
  
  const loadGrades = useCallback(async () => {
    setGradesLoading(true);
    try {
      const gradesWithActiveCycles = await gradoService.getGradosWithActiveCycles();
      setGrades(gradesWithActiveCycles);
    } catch (error) {
      console.error('Error al obtener grados con ciclos activos:', error);
    } finally {
      setGradesLoading(false);
    }
  }, []);

  const { 
    createCourseForGrade
  } = useCourse();

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    notaMaxima: 100,
    notaAprobada: 60,
    dpiCatedratico: '',
    catedraticoNombre: '',
    idGrado: undefined,
    gradoNombre: '',
    gradoDescripcionCiclo: '',
    gradoNivelAcademico: '',
    gradoJornada: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Cargar datos según el contexto
  useEffect(() => {
    if (isFromGrade && gradeId) {
      getGradoById(gradeId);
    } else if (isFromCourses) {
      loadGrades();
    }
  }, [isFromGrade, isFromCourses, gradeId, getGradoById, loadGrades]);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'nombre':
        if (!value || value.trim() === '') return 'El nombre del curso es requerido';
        if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
        return '';
      case 'notaMaxima':
        if (!value || value <= 0) return 'La nota máxima debe ser mayor a 0';
        if (value > 1000) return 'La nota máxima debe ser menor a 1000';
        return '';
      case 'notaAprobada':
        if (!value || value <= 0) return 'La nota de aprobación debe ser mayor a 0';
        if (value >= formData.notaMaxima) return 'La nota de aprobación debe ser menor a la nota máxima';
        return '';
      case 'dpiCatedratico':
        if (!value || value.trim() === '') return 'Debe seleccionar un catedrático';
        return '';
      case 'idGrado':
        if (isFromCourses && (!value || value === '')) return 'Debe seleccionar un grado';
        return '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validar campos básicos
    Object.keys(formData).forEach(key => {
      if (key === 'catedraticoNombre') return; // Skip this field
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      notaMaxima: 100,
      notaAprobada: 60,
      dpiCatedratico: '',
      catedraticoNombre: '',
      idGrado: undefined,
      gradoNombre: '',
      gradoDescripcionCiclo: '',
      gradoNivelAcademico: '',
      gradoJornada: ''
    });
    setTouched({});
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'notaMaxima' || name === 'notaAprobada' || name === 'idGrado' 
        ? parseInt(value) || 0 
        : value
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validación en tiempo real
    if (touched[name]) {
      const errorMsg = validateField(name, name === 'notaMaxima' || name === 'notaAprobada' || name === 'idGrado' ? parseInt(value) || 0 : value);
      setErrors(prev => ({
        ...prev,
        [name]: errorMsg
      }));
    }
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
  };

  const handleGradeSelect = (grade: { 
    id: number; 
    nombre: string; 
    descripcionCiclo: string;
    nivelAcademico: string;
    jornada: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      idGrado: grade.id,
      gradoNombre: grade.nombre,
      gradoDescripcionCiclo: grade.descripcionCiclo,
      gradoNivelAcademico: grade.nivelAcademico,
      gradoJornada: grade.jornada
    }));
    
    setErrors(prev => ({
      ...prev,
      idGrado: ''
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const errorMsg = validateField(name, name === 'notaMaxima' || name === 'notaAprobada' || name === 'idGrado' ? parseInt(value) || 0 : value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMsg
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allFields = Object.keys(formData);
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let targetGradeId: number;
      
      if (isFromGrade && grado) {
        targetGradeId = grado.id;
      } else if (isFromCourses && formData.idGrado) {
        targetGradeId = formData.idGrado;
      } else {
        throw new Error('No se pudo determinar el grado objetivo');
      }

      await createCourseForGrade({
        nombre: formData.nombre,
        notaMaxima: formData.notaMaxima,
        notaAprobada: formData.notaAprobada,
        idGrado: targetGradeId,
        dpiCatedratico: formData.dpiCatedratico
      });

      // Éxito - mostrar notificación
      setSubmitSuccess(true);
      setShowNotification(true);

      // Resetear formulario
      resetForm();

      // Redirigir después de un breve delay
      setTimeout(() => {
        if (isFromGrade) {
          navigate(`/admin/grados/${gradeId}`);
        } else {
          navigate('/admin/cursos');
        }
      }, 2000);

    } catch (error: any) {
      console.error('Error al crear el curso:', error);
      // Error - mostrar notificación de error
      setSubmitSuccess(false);
      setShowNotification(true);
      setErrorMessage(error.message || 'Error al crear el curso');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActiveCycle = (grade: Grado) => {
    // Primero intentar con ciclosActivos
    if (grade.ciclosActivos && grade.ciclosActivos.length > 0) {
      return grade.ciclosActivos[0];
    }
    
    // Si no, buscar en gradosCiclo un ciclo sin fechaFin
    if (grade.gradosCiclo && grade.gradosCiclo.length > 0) {
      return grade.gradosCiclo.find(gc => gc.ciclo.fechaFin === null);
    }
    
    return null;
  };

  // Loading states
  if (isFromGrade && gradeLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.loadingIcon} />
          <p>Cargando información del grado...</p>
        </div>
      </div>
    );
  }

  if (isFromCourses && gradesLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.loadingIcon} />
          <p>Cargando grados disponibles...</p>
        </div>
      </div>
    );
  }

  // Error states para contexto de grado específico
  if (isFromGrade && !grado) {
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

  if (isFromGrade && grado) {
    const activeCycle = getActiveCycle(grado);
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
  }

  // Error states para contexto de cursos
  if (isFromCourses && grades.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <FaExclamationCircle className={styles.errorIcon} />
          <h3>No hay grados disponibles</h3>
          <p>No hay grados con ciclo activo disponibles para crear cursos.</p>
          <Link to="/admin/cursos" className={styles.backButton}>
            <FaArrowLeft size={14} />
            Volver a la lista de cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      {/* Encabezado con migas de pan */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to={isFromGrade ? `/admin/grados/${gradeId}` : "/admin/cursos"}>
            {isFromGrade ? 'Grados' : 'Cursos'}
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Crear nuevo curso</span>
        </div>
        
        <Link 
          to={isFromGrade ? `/admin/grados/${gradeId}` : "/admin/cursos"} 
          className={styles.buttonCancel}
        >
          <FaArrowLeft size={14} style={{ marginRight: '6px' }} />
          Volver a la lista
        </Link>
      </div>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        {/* Sección: Información del Curso */}
        <div className={styles.formCard}>
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FaBookOpen />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>Información del curso</h3>
                <p className={styles.sectionDescription}>Datos básicos del curso</p>
              </div>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Nombre del Curso
                </label>
                <div className={styles.inputWrapper}>
                  <FaBookOpen className={styles.inputIcon} />
                  <input
                    type="text"
                    name="nombre"
                    className={styles.input}
                    placeholder="Ej: Matemáticas, Ciencias Naturales..."
                    value={formData.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {touched.nombre && errors.nombre && (
                  <p className={styles.errorText}>{errors.nombre}</p>
                )}
                <p className={styles.helpText}>El nombre del curso debe ser descriptivo</p>
              </div>

              {isFromCourses && (
                <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                  <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                    Grado Asignado
                  </label>
                  <div className={styles.gradeSelection}>
                    {formData.gradoNombre ? (
                      <div className={styles.selectedGrade}>
                        <FaGraduationCap className={styles.gradeIcon} />
                        <div className={styles.selectedGradeInfo}>
                          <span className={styles.selectedGradeName}>{formData.gradoNombre}</span>
                          <div className={styles.selectedGradeDetails}>
                            <div className={styles.gradeDetailRow}>
                              <FaLayerGroup className={styles.detailIcon} />
                              <span>{formData.gradoNivelAcademico}</span>
                            </div>
                            <div className={styles.gradeDetailRow}>
                              <FaClock className={styles.detailIcon} />
                              <span>{formData.gradoJornada}</span>
                            </div>
                            <div className={styles.gradeDetailRow}>
                              <span className={styles.cycleInfo}>{formData.gradoDescripcionCiclo}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowGradeModal(true)}
                          className={styles.changeGradeBtn}
                        >
                          Cambiar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowGradeModal(true)}
                        className={styles.selectGradeBtn}
                      >
                        <FaGraduationCap />
                        Seleccionar Grado
                      </button>
                    )}
                  </div>
                  {touched.idGrado && errors.idGrado && (
                    <p className={styles.errorText}>{errors.idGrado}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Sección: Configuración de Calificaciones */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FaStar />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>Configuración de calificaciones</h3>
                <p className={styles.sectionDescription}>Definir escalas de evaluación</p>
              </div>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Nota Máxima
                </label>
                <div className={styles.inputWrapper}>
                  <FaStar className={styles.inputIcon} />
                  <input
                    type="number"
                    name="notaMaxima"
                    className={styles.input}
                    placeholder="100"
                    value={formData.notaMaxima}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="1"
                    max="1000"
                  />
                </div>
                {touched.notaMaxima && errors.notaMaxima && (
                  <p className={styles.errorText}>{errors.notaMaxima}</p>
                )}
                <p className={styles.helpText}>Puntuación máxima posible</p>
              </div>
              
              <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Nota de Aprobación
                </label>
                <div className={styles.inputWrapper}>
                  <FaStar className={styles.inputIcon} />
                  <input
                    type="number"
                    name="notaAprobada"
                    className={styles.input}
                    placeholder="60"
                    value={formData.notaAprobada}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="1"
                    max={formData.notaMaxima - 1}
                  />
                </div>
                {touched.notaAprobada && errors.notaAprobada && (
                  <p className={styles.errorText}>{errors.notaAprobada}</p>
                )}
                <p className={styles.helpText}>Puntuación mínima para aprobar</p>
              </div>
            </div>
          </div>
          
          {/* Sección: Asignación de Catedrático */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FaChalkboardTeacher />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>Asignación de catedrático</h3>
                <p className={styles.sectionDescription}>Seleccionar el profesor responsable</p>
              </div>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.inputGroup} style={{ gridColumn: 'span 3' }}>
                <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                  Catedrático Asignado
                </label>
                <div className={styles.teacherSelection}>
                  {formData.catedraticoNombre ? (
                    <div className={styles.selectedTeacher}>
                      <FaChalkboardTeacher className={styles.teacherIcon} />
                      <span className={styles.selectedTeacherName}>{formData.catedraticoNombre}</span>
                      <button
                        type="button"
                        onClick={() => setShowTeacherModal(true)}
                        className={styles.changeTeacherBtn}
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowTeacherModal(true)}
                      className={styles.selectTeacherBtn}
                    >
                      <FaChalkboardTeacher />
                      Seleccionar Catedrático
                    </button>
                  )}
                </div>
                {touched.dpiCatedratico && errors.dpiCatedratico && (
                  <p className={styles.errorText}>{errors.dpiCatedratico}</p>
                )}
                <p className={styles.helpText}>El catedrático será responsable de este curso</p>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.buttonCancel}
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={`${styles.buttonSubmit} ${isSubmitting ? styles.buttonLoading : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className={styles.spinnerIcon} />
                  <span>Creando curso...</span>
                </>
              ) : (
                'Guardar Curso'
              )}
            </button>
          </div>
        </div>
      </form>

      {showTeacherModal && (
        <TeacherSelectionModal
          isOpen={showTeacherModal}
          onClose={() => setShowTeacherModal(false)}
          onSelect={handleTeacherSelect}
        />
      )}

      {showGradeModal && (
        <GradeSelectionModal
          isOpen={showGradeModal}
          onClose={() => setShowGradeModal(false)}
          onSelect={handleGradeSelect}
        />
      )}
      
      {/* Notificación flotante */}
      {showNotification && !submitSuccess && (
        <FloatingNotification 
          type="error"
          title="Error al crear curso"
          message={errorMessage || "Ocurrió un error al crear el curso. Por favor, inténtelo nuevamente."}
          onClose={() => setShowNotification(false)}
          autoCloseTime={0} // No cerrará automáticamente los errores
        />
      )}
      
      {showNotification && submitSuccess && (
        <FloatingNotification 
          type="success"
          title="Curso creado exitosamente"
          message="El curso ha sido creado correctamente."
          onClose={() => setShowNotification(false)}
          autoCloseTime={5000} // 5 segundos para cerrar automáticamente
        />
      )}
    </div>
  );
};

export default CreateCoursePage;
