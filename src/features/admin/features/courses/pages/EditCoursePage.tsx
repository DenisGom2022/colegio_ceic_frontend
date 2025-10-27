import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './EditCoursePage.module.css';
import selectionStyles from '../components/GradeSelectionButton.module.css';
import gradeInfoStyles from './GradeInfoStyles.module.css';
import {
    FaBook,
    FaArrowLeft,
    FaCheck,
    FaGraduationCap,
    FaSpinner,
    FaSave,
    FaExclamationTriangle,
    FaUserTie,
    FaPercentage
} from "react-icons/fa";
import { getCourseById } from '../services/courseService';
import { updateCurso } from '../../grades/services/cursoService';
import GradeSelectionModal from '../components/GradeSelectionModal';
import TeacherSelectionModal from '../components/TeacherSelectionModal';
import { gradoService } from '../../grades/services/gradoService';

interface FormErrors {
    [key: string]: string;
}

const EditCoursePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    // Estados para los campos del formulario
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
        notaMaxima: 100,
        notaAprobada: 60,
        idGrado: 0,
        dpiCatedratico: ''
    });
    
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showGradeModal, setShowGradeModal] = useState<boolean>(false);
    const [showTeacherModal, setShowTeacherModal] = useState<boolean>(false);
    const [gradoSeleccionado, setGradoSeleccionado] = useState<{
        id: number; 
        nombre: string; 
        descripcionCiclo: string;
        nivelAcademico: string;
        jornada: string;
        cicloActivo: boolean;
    } | null>(null);
    const [catedraticoSeleccionado, setCatedraticoSeleccionado] = useState<{
        dpi: string;
        nombre: string;
        tipoUsuario: string;
        telefono: string;
    } | null>(null);

    // Obtener datos del curso actual
    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getCourseById(id!);
                setFormData({
                    id: id || '',
                    nombre: data.curso.nombre || '',
                    notaMaxima: data.curso.notaMaxima || 100,
                    notaAprobada: data.curso.notaAprobada || 60,
                    idGrado: data.curso.gradoCiclo?.idGrado || 0,
                    dpiCatedratico: data.curso.dpiCatedratico || ''
                });
                
                // Cargar información completa del grado si tenemos el ID
                if (data.curso.gradoCiclo?.idGrado) {
                    try {
                        // Obtenemos la información completa del grado usando el servicio
                        const gradoInfo = await gradoService.getGradoById(data.curso.gradoCiclo.idGrado.toString());
                        
                        // Determinar si el ciclo está activo desde los datos del curso
                        const cicloActivo = data.curso.gradoCiclo.ciclo?.fechaFin === null;
                        
                        // Obtener descripción del ciclo directamente del objeto del curso
                        let descripcionCiclo = data.curso.gradoCiclo.ciclo?.descripcion || 'Ciclo no especificado';
                        
                        // Establecer la información completa del grado
                        setGradoSeleccionado({
                            id: gradoInfo.id,
                            nombre: gradoInfo.nombre,
                            descripcionCiclo,
                            nivelAcademico: gradoInfo.nivelAcademico?.descripcion || 'Nivel no disponible',
                            jornada: gradoInfo.jornada?.descripcion || 'Jornada no disponible',
                            cicloActivo: Boolean(cicloActivo)
                        });
                    } catch (gradoError) {
                        console.error('Error al cargar detalles del grado:', gradoError);
                        // Si falla la carga del grado, mostramos información básica pero con la descripción del ciclo
                        // que ya tenemos en los datos del curso
                        const cicloActivo = data.curso.gradoCiclo.ciclo?.fechaFin === null;
                        const descripcionCiclo = data.curso.gradoCiclo.ciclo?.descripcion || 'Ciclo no especificado';
                        
                        setGradoSeleccionado({
                            id: data.curso.gradoCiclo.idGrado,
                            nombre: `Grado ID: ${data.curso.gradoCiclo.idGrado}`,
                            descripcionCiclo: descripcionCiclo,
                            nivelAcademico: 'Error al cargar detalles',
                            jornada: 'Error al cargar detalles',
                            cicloActivo: Boolean(cicloActivo)
                        });
                    }
                }
                
                // Cargar información del catedrático si tenemos el DPI
                if (data.curso.dpiCatedratico && data.curso.catedratico) {
                    // Construir el nombre completo del catedrático
                    const nombreCompleto = [
                        data.curso.catedratico.usuario?.primerNombre,
                        data.curso.catedratico.usuario?.segundoNombre,
                        data.curso.catedratico.usuario?.tercerNombre,
                        data.curso.catedratico.usuario?.primerApellido,
                        data.curso.catedratico.usuario?.segundoApellido
                    ].filter(Boolean).join(' ');
                    
                    // Establecer la información del catedrático
                    setCatedraticoSeleccionado({
                        dpi: data.curso.catedratico.dpi,
                        nombre: nombreCompleto || `Catedrático ID: ${data.curso.catedratico.dpi}`,
                        tipoUsuario: data.curso.catedratico.usuario?.tipoUsuario?.descripcion || 'Docente',
                        telefono: data.curso.catedratico.usuario?.telefono || 'No disponible'
                    });
                }
            } catch (err: any) {
                // Extraer el mensaje de error de diferentes fuentes posibles
                const errorMessage = err?.response?.data?.message || err.message || 'Error al cargar el curso';
                
                // Establecer mensaje de error para ambos tipos de notificaciones
                setError(errorMessage);
                setNotificationType('error');
                setNotificationMessage(errorMessage);
                setShowNotification(true);
                
                // Intentamos mantener la interfaz utilizable con valores por defecto
                setFormData({
                    id: id || '',
                    nombre: '',
                    notaMaxima: 100,
                    notaAprobada: 60,
                    idGrado: 0,
                    dpiCatedratico: ''
                });
                
                // Desplazar la página hacia arriba para mostrar la notificación
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const validateField = (name: string, value: string | number): string => {
        switch (name) {
            case 'nombre':
                return value.toString().trim() === '' ? 'El nombre del curso es requerido' : '';
            case 'notaMaxima':
                return isNaN(Number(value)) ? 'La nota máxima debe ser un número válido' : '';
            case 'notaAprobada':
                return isNaN(Number(value)) ? 'La nota de aprobación debe ser un número válido' : '';
            case 'idGrado':
                return isNaN(Number(value)) ? 'El ID del grado debe ser un número válido' : '';
            case 'dpiCatedratico':
                return value.toString().trim() === '' ? 'El DPI del catedrático es requerido' : '';
            default:
                return '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'notaMaxima' || name === 'notaAprobada' || name === 'idGrado' 
                ? (value === '' ? 0 : parseInt(value, 10)) 
                : value
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

        // Validar campos requeridos
        if (!formData.nombre) {
            newErrors.nombre = 'El nombre del curso es requerido';
            isValid = false;
        }

        if (isNaN(Number(formData.notaMaxima))) {
            newErrors.notaMaxima = 'La nota máxima debe ser un número válido';
            isValid = false;
        }

        if (isNaN(Number(formData.notaAprobada))) {
            newErrors.notaAprobada = 'La nota de aprobación debe ser un número válido';
            isValid = false;
        }

        if (!formData.dpiCatedratico) {
            newErrors.dpiCatedratico = 'El DPI del catedrático es requerido';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
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
            setSaving(true);
            try {
                const response = await updateCurso({
                    id: Number(id),
                    nombre: formData.nombre,
                    notaMaxima: Number(formData.notaMaxima),
                    notaAprobada: Number(formData.notaAprobada),
                    idGrado: Number(formData.idGrado),
                    dpiCatedratico: formData.dpiCatedratico
                });

                // Mostrar notificación de éxito
                setNotificationType('success');
                setNotificationMessage(response.message || 'Curso actualizado con éxito');
                setShowNotification(true);
                setSuccess('Curso actualizado con éxito');

                // Redirigir después de un breve momento
                setTimeout(() => {
                    navigate(`/admin/cursos/${id}`);
                }, 2000);

            } catch (err: any) {
                // Extraer el mensaje de error de diferentes fuentes posibles
                const errorMessage = err?.response?.data?.message || err.message || "Error al actualizar el curso";
                
                // Establecer mensaje de error para ambos tipos de notificaciones
                setError(errorMessage);
                setNotificationType('error');
                setNotificationMessage(errorMessage);
                setShowNotification(true);
                
                // Desplazar la página hacia arriba para mostrar la notificación
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } finally {
                setSaving(false);
            }
        }
    };

    return (
        <div className={styles.formContainer}>
            {/* Notificación flotante */}
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
                        aria-label="Cerrar notificación"
                    >
                        ×
                    </button>
                </div>
            )}
            
            {/* Encabezado con migas de pan */}
            <div className={styles.pageHeader}>
                <div className={styles.breadcrumb}>
                    <Link to="/admin/cursos">Cursos</Link>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <Link to={`/admin/cursos/${id}`}>{formData.nombre || 'Detalle de curso'}</Link>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <span className={styles.breadcrumbCurrent}>Editar curso</span>
                </div>

                <Link to={`/admin/cursos/${id}`} className={styles.buttonCancel}>
                    <FaArrowLeft size={14} style={{ marginRight: '6px' }} />
                    Volver a detalles
                </Link>
            </div>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.loader}></div>
                    <p>Cargando datos del curso...</p>
                </div>
            ) : (
                /* Formulario */
                <form onSubmit={handleSubmit}>
                    {/* Error de formulario que no está en notificación flotante */}
                    {error && !showNotification && (
                        <div className={styles.errorNotification}>
                            <FaExclamationTriangle style={{marginRight: '8px'}} />
                            {error}
                            <button 
                                onClick={() => setError(null)} 
                                className={styles.closeButton} 
                                aria-label="Cerrar mensaje de error"
                                style={{marginLeft: 'auto'}}
                            >
                                ×
                            </button>
                        </div>
                    )}
                    <div className={styles.formCard}>
                        {/* Sección: Información básica */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionIcon}>
                                    <FaBook />
                                </div>
                                <div>
                                    <h3 className={styles.sectionTitle}>Información del curso</h3>
                                    <p className={styles.sectionDescription}>
                                        Datos principales del curso
                                    </p>
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                                        Nombre del curso
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <FaBook className={styles.inputIcon} />
                                        <input
                                            type="text"
                                            name="nombre"
                                            className={styles.input}
                                            placeholder="Nombre del curso"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    {touched.nombre && errors.nombre && (
                                        <p className={styles.errorText}>{errors.nombre}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sección: Calificaciones */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionIcon}>
                                    <FaGraduationCap />
                                </div>
                                <div>
                                    <h3 className={styles.sectionTitle}>Configuración de calificaciones</h3>
                                    <p className={styles.sectionDescription}>
                                        Parámetros para evaluar el curso
                                    </p>
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                                        Nota máxima
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <FaPercentage className={styles.inputIcon} />
                                        <input
                                            type="number"
                                            name="notaMaxima"
                                            className={styles.input}
                                            placeholder="100"
                                            value={formData.notaMaxima}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            min={1}
                                            max={100}
                                        />
                                    </div>
                                    {touched.notaMaxima && errors.notaMaxima && (
                                        <p className={styles.errorText}>{errors.notaMaxima}</p>
                                    )}
                                    <p className={styles.helpText}>Valor máximo para calificaciones del curso</p>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                                        Nota aprobatoria
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <FaCheck className={styles.inputIcon} />
                                        <input
                                            type="number"
                                            name="notaAprobada"
                                            className={styles.input}
                                            placeholder="60"
                                            value={formData.notaAprobada}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            min={1}
                                            max={formData.notaMaxima}
                                        />
                                    </div>
                                    {touched.notaAprobada && errors.notaAprobada && (
                                        <p className={styles.errorText}>{errors.notaAprobada}</p>
                                    )}
                                    <p className={styles.helpText}>Nota mínima para aprobar el curso</p>
                                </div>
                            </div>
                        </div>

                        {/* Sección: Asignación */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionIcon}>
                                    <FaUserTie />
                                </div>
                                <div>
                                    <h3 className={styles.sectionTitle}>Asignación académica</h3>
                                    <p className={styles.sectionDescription}>
                                        Asignación de grado y catedrático
                                    </p>
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                                        Grado
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <FaGraduationCap className={styles.inputIcon} />
                                        <input
                                            type="text"
                                            name="gradoNombre"
                                            className={styles.input}
                                            placeholder="Seleccionar grado"
                                            value={gradoSeleccionado ? gradoSeleccionado.nombre : ''}
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            className={selectionStyles.selectionButton}
                                            onClick={() => setShowGradeModal(true)}
                                        >
                                            Buscar
                                        </button>
                                    </div>
                                    <input
                                        type="hidden"
                                        name="idGrado"
                                        value={formData.idGrado}
                                    />
                                    {gradoSeleccionado && (
                                        <div className={gradeInfoStyles.gradeInfo}>
                                            <div className={gradeInfoStyles.gradeDetail}>
                                                <span className={gradeInfoStyles.detailLabel}>Nivel académico:</span>
                                                <span className={gradeInfoStyles.detailValue}>{gradoSeleccionado.nivelAcademico}</span>
                                            </div>
                                            <div className={gradeInfoStyles.gradeDetail}>
                                                <span className={gradeInfoStyles.detailLabel}>Jornada:</span>
                                                <span className={gradeInfoStyles.detailValue}>{gradoSeleccionado.jornada}</span>
                                            </div>
                                            <div className={gradeInfoStyles.gradeDetail}>
                                                <span className={gradeInfoStyles.detailLabel}>Ciclo:</span>
                                                <span className={gradeInfoStyles.detailValue}>{gradoSeleccionado.descripcionCiclo}</span>
                                            </div>
                                            <div className={gradeInfoStyles.gradeDetail}>
                                                <span className={gradeInfoStyles.detailLabel}>Estado del ciclo:</span>
                                                <span className={`${gradeInfoStyles.detailValue} ${gradoSeleccionado.cicloActivo ? gradeInfoStyles.activeCycle : gradeInfoStyles.inactiveCycle}`}>
                                                    {gradoSeleccionado.cicloActivo ? 
                                                        'Asignado al ciclo activo' : 
                                                        'No asignado a ciclo activo'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {touched.idGrado && errors.idGrado && (
                                        <p className={styles.errorText}>{errors.idGrado}</p>
                                    )}
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={`${styles.inputLabel} ${styles.requiredField}`}>
                                        Catedrático
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <FaUserTie className={styles.inputIcon} />
                                        <input
                                            type="text"
                                            name="nombreCatedratico"
                                            className={styles.input}
                                            placeholder="Seleccionar catedrático"
                                            value={catedraticoSeleccionado ? catedraticoSeleccionado.nombre : ''}
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            className={selectionStyles.selectionButton}
                                            onClick={() => setShowTeacherModal(true)}
                                        >
                                            Buscar
                                        </button>
                                    </div>
                                    <input
                                        type="hidden"
                                        name="dpiCatedratico"
                                        value={formData.dpiCatedratico}
                                    />
                                    {catedraticoSeleccionado && (
                                        <div className={gradeInfoStyles.gradeInfo}>
                                            <div className={gradeInfoStyles.gradeDetail}>
                                                <span className={gradeInfoStyles.detailLabel}>DPI:</span>
                                                <span className={gradeInfoStyles.detailValue}>{catedraticoSeleccionado.dpi}</span>
                                            </div>
                                            <div className={gradeInfoStyles.gradeDetail}>
                                                <span className={gradeInfoStyles.detailLabel}>Tipo Usuario:</span>
                                                <span className={gradeInfoStyles.detailValue}>{catedraticoSeleccionado.tipoUsuario}</span>
                                            </div>
                                            <div className={gradeInfoStyles.gradeDetail}>
                                                <span className={gradeInfoStyles.detailLabel}>Teléfono:</span>
                                                <span className={gradeInfoStyles.detailValue}>{catedraticoSeleccionado.telefono}</span>
                                            </div>
                                        </div>
                                    )}
                                    {touched.dpiCatedratico && errors.dpiCatedratico && (
                                        <p className={styles.errorText}>{errors.dpiCatedratico}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className={styles.formActions}>
                            <Link
                                to={`/admin/cursos/${id}`}
                                className={styles.buttonCancel}
                            >
                                <FaArrowLeft style={{ marginRight: '6px' }} />
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                className={`${styles.buttonSubmit} ${saving ? styles.buttonLoading : ''}`}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <FaSpinner className={styles.spinnerIcon} />
                                        <span>Actualizando...</span>
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

            {/* Mensaje de éxito si es necesario */}
            {success && !showNotification && (
                <div className={styles.successNotification}>
                    <FaCheck style={{marginRight: '8px'}} /> {success}
                </div>
            )}

            {/* Modal de selección de grado */}
            <GradeSelectionModal
                isOpen={showGradeModal}
                onClose={() => setShowGradeModal(false)}
                onSelect={(grade) => {
                    // Verificar si el ciclo está activo (asumimos que esto se puede determinar por la descripción del ciclo)
                    // En un escenario real, esto vendría de la API directamente
                    const cicloActivo = Boolean(grade.descripcionCiclo && 
                                       !grade.descripcionCiclo.includes('Sin ciclo activo'));
                    
                    // Añadimos la propiedad cicloActivo al objeto grade
                    setGradoSeleccionado({
                        ...grade,
                        cicloActivo: cicloActivo
                    });
                    
                    setFormData(prev => ({
                        ...prev,
                        idGrado: grade.id
                    }));
                    setShowGradeModal(false);
                    
                    // Marcar el campo como tocado y validar
                    setTouched(prev => ({
                        ...prev,
                        idGrado: true
                    }));
                    setErrors(prev => ({
                        ...prev,
                        idGrado: ''
                    }));
                }}
            />
            
            {/* Modal de selección de catedrático */}
            <TeacherSelectionModal
                isOpen={showTeacherModal}
                onClose={() => setShowTeacherModal(false)}
                onSelect={(teacher) => {
                    // Establecer el catedrático seleccionado
                    setCatedraticoSeleccionado(teacher);
                    
                    // Actualizar el valor del DPI en el formulario
                    setFormData(prev => ({
                        ...prev,
                        dpiCatedratico: teacher.dpi
                    }));
                    
                    // Marcar el campo como tocado y validar
                    setTouched(prev => ({
                        ...prev,
                        dpiCatedratico: true
                    }));
                    setErrors(prev => ({
                        ...prev,
                        dpiCatedratico: ''
                    }));
                }}
            />
        </div>
    );
};

export default EditCoursePage;
