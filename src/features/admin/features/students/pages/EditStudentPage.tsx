import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getStudentByCui } from '../services/studentService';
import { useUpdateStudent } from '../hooks/useUpdateStudent';
import type { StudentUpdateData } from '../services/studentService';
import styles from './EditStudentPage.module.css';
import { FaUserEdit, FaArrowLeft, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import FloatingNotification from '../../../../../components/FloatingNotification';

// Interfaz para manejar los tipos de parentesco
interface ParentescoOption {
    id: number;
    descripcion: string;
}

const EditStudentPage = () => {
    const { cui } = useParams<{ cui: string }>();
    const navigate = useNavigate();

    // Referencia para rastrear si el componente está montado
    const isMounted = useRef(true);

    // Estado para el formulario
    const [formData, setFormData] = useState<StudentUpdateData>({
        cui: cui || '',
        primerNombre: '',
        segundoNombre: '',
        tercerNombre: '',
        primerApellido: '',
        segundoApellido: '',
        telefono: '',
        genero: 'M',
        responsables: []
    });

    // Estados para manejar el UI
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Lista de parentescos
    const [parentescos] = useState<ParentescoOption[]>([
        { id: 1, descripcion: 'Padre' },
        { id: 2, descripcion: 'Madre' },
        { id: 3, descripcion: 'Abuelo' },
        { id: 4, descripcion: 'Abuela' },
        { id: 5, descripcion: 'Tío' },
        { id: 6, descripcion: 'Tía' },
        { id: 7, descripcion: 'Hermano' },
        { id: 8, descripcion: 'Hermana' },
        { id: 9, descripcion: 'Tutor Legal' }
    ]);

    // Hook para actualizar estudiante
    const { updateStudent, loading: updating, error: updateError } = useUpdateStudent();

    // Limpiar referencia cuando el componente se desmonta
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Cargar datos del estudiante cuando se monta el componente o cambia el cui
    useEffect(() => {
        console.log('Ejecutando useEffect para cargar estudiante, CUI:', cui);
        
        // Flag para controlar la ejecución única
        let isActive = true;
        // Variable para rastrear si la carga ya ha finalizado
        let loadingCompleted = false;
        
        const fetchStudentData = async () => {
            if (!cui) {
                console.log('No se proporcionó CUI');
                setLoading(false);
                loadingCompleted = true;
                return;
            }

            try {
                setLoading(true);
                setError(null);
                console.log('Obteniendo datos del estudiante con CUI:', cui);
                const data = await getStudentByCui(cui);
                console.log('Datos recibidos:', data);

                // Verificar si la operación aún debe continuar
                if (!isActive) {
                    console.log('Operación cancelada - componente desmontado');
                    return;
                }

                if (data) {
                    // Inicializar el formulario con los datos del estudiante
                    setFormData({
                        cui: data.cui,
                        primerNombre: data.primerNombre || '',
                        segundoNombre: data.segundoNombre || '',
                        tercerNombre: data.tercerNombre || '',
                        primerApellido: data.primerApellido || '',
                        segundoApellido: data.segundoApellido || '',
                        telefono: data.telefono || '',
                        genero: (data.genero === 'F' ? 'F' : 'M') as 'M' | 'F',
                        responsables: data.responsables?.map(resp => ({
                            idResponsable: resp.idResponsable || '',
                            primerNombre: resp.primerNombre || '',
                            segundoNombre: resp.segundoNombre || '',
                            tercerNombre: resp.tercerNombre || '',
                            primerApellido: resp.primerApellido || '',
                            segundoApellido: resp.segundoApellido || '',
                            telefono: resp.telefono || '',
                            idParentesco: resp.idParentesco || 1
                        })) || []
                    });
                    
                    // Marcar la carga como completada exitosamente
                    loadingCompleted = true;
                } else {
                    console.warn('No se recibieron datos del estudiante');
                    setError('No se encontraron datos para este estudiante');
                }
            } catch (err: any) {
                console.error('Error en EditStudentPage:', err);
                if (isActive) {
                    setError(err.response?.data?.message || 'Error al cargar los datos del estudiante');
                }
            } finally {
                if (isActive) {
                    console.log('Terminando carga, desactivando estado loading');
                    setLoading(false);
                    loadingCompleted = true;
                }
            }
        };

        fetchStudentData();
        
        // Añadir un timeout de seguridad para evitar que se quede cargando indefinidamente
        // pero solo si la carga aún no ha sido completada
        const timeoutId = setTimeout(() => {
            if (isActive && !loadingCompleted) {
                console.warn('Se ha excedido el tiempo de espera para la carga de datos');
                setLoading(false);
                setError('No se pudo cargar los datos del estudiante. Tiempo de espera excedido.');
            }
        }, 10000); // 10 segundos de timeout
        
        return () => {
            console.log('Limpiando efecto de carga de estudiante');
            isActive = false;
            clearTimeout(timeoutId);
        };
    }, [cui]); // Eliminado 'loading' de las dependencias

    // Actualizar el estado del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Si hay alguna notificación de error, la limpiamos
        if (showNotification) {
            setShowNotification(false);
            setNotificationMessage('');
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejar los cambios en los responsables
    const handleResponsableChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Si hay alguna notificación de error, la limpiamos
        if (showNotification) {
            setShowNotification(false);
            setNotificationMessage('');
        }

        setFormData(prev => {
            const updatedResponsables = [...(prev.responsables || [])];

            updatedResponsables[index] = {
                ...updatedResponsables[index],
                [name]: name === 'idParentesco' ? parseInt(value, 10) : value
            };

            return {
                ...prev,
                responsables: updatedResponsables
            };
        });
    };

    // Añadir un nuevo responsable
    const addResponsable = () => {
        setFormData(prev => ({
            ...prev,
            responsables: [
                ...(prev.responsables || []),
                {
                    idResponsable: '',
                    primerNombre: '',
                    segundoNombre: '',
                    tercerNombre: '',
                    primerApellido: '',
                    segundoApellido: '',
                    telefono: '',
                    idParentesco: 1 // Valor por defecto
                }
            ]
        }));
    };

    // Eliminar un responsable
    const removeResponsable = (index: number) => {
        setFormData(prev => ({
            ...prev,
            responsables: prev.responsables?.filter((_, i) => i !== index)
        }));
    };

    // Enviar el formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Prevenir el comportamiento por defecto del formulario
        e.stopPropagation();

        // Evitar múltiples envíos simultáneos
        if (isSubmitting || updating) {
            console.log('Ya hay una operación en proceso');
            return;
        }

        // Desactivar cualquier redirección automática anterior
        window.onbeforeunload = (e) => {
            e.preventDefault();
            e.returnValue = '';
            return '';
        };

        try {
            setIsSubmitting(true);
            setError(null);
            setNotificationMessage('');
            setShowNotification(false);
            setIsSuccess(false);

            console.log('Enviando datos de actualización:', formData);

            // Validar campos obligatorios
            if (!formData.primerNombre || !formData.primerApellido || !formData.cui) {
                throw new Error('Debes completar todos los campos obligatorios.');
            }

            // Validar que cada responsable tenga los campos obligatorios
            if (formData.responsables?.length) {
                for (const resp of formData.responsables) {
                    if (!resp.idResponsable || !resp.primerNombre || !resp.primerApellido || !resp.telefono) {
                        throw new Error('Todos los responsables deben tener ID, primer nombre, primer apellido y teléfono.');
                    }
                }
            }
            // Se permite que el estudiante no tenga responsables

            if (!cui) {
                throw new Error('No se pudo identificar el estudiante a actualizar.');
            }
            
            try {
                // Realizar la actualización
                await updateStudent(cui, formData);
                
                // Si llega aquí, la operación fue exitosa
                setIsSuccess(true);
                setShowNotification(true);
                setNotificationMessage('Estudiante actualizado correctamente.');
    
                // Redirigir después de un tiempo SOLO si la operación fue exitosa
                setTimeout(() => {
                    // Eliminar el handler de beforeunload antes de navegar
                    window.onbeforeunload = null;
                    navigate('/admin/estudiantes');
                }, 2000);
            } catch (updateErr: any) {
                // Capturar específicamente errores de la actualización
                // En lugar de relanzar el error, lo manejamos aquí mostrando la notificación
                console.error('Error al actualizar el estudiante:', updateErr);
                
                let errorMsg = 'Error al actualizar el estudiante';
                
                if (updateErr.response?.data?.message) {
                    errorMsg = updateErr.response.data.message;
                } else if (updateErr.response?.data?.error) {
                    errorMsg = updateErr.response.data.error;
                } else if (updateErr.message) {
                    errorMsg = updateErr.message;
                }
                
                setError(errorMsg);
                setNotificationMessage(errorMsg);
                setShowNotification(true);
                setIsSuccess(false);
                
                // No propagamos el error, lo manejamos aquí
                // para evitar que se redireccione a la lista
            }
            
        } catch (err: any) {
            console.error('Error al actualizar el estudiante:', err);
            
            // Este bloque catch ahora solo captura errores de validación de formulario
            // u otros errores que no provengan de la actualización del estudiante
            let errorMsg = 'Error al actualizar el estudiante';
            
            if (err.message) {
                errorMsg = err.message;
            }
            
            setError(errorMsg);
            setNotificationMessage(errorMsg);
            setShowNotification(true);
            setIsSuccess(false);
            
            // Eliminar el handler de beforeunload en caso de error
            window.onbeforeunload = null;
            
            // No redirigimos en caso de error, mostramos la notificación para que el usuario pueda corregir
            
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Cargando datos del estudiante...</p>
            </div>
        );
    }
    
    // Si no hay CUI o el estudiante no existe después de cargar
    if (!cui || (!loading && (!formData || !formData.cui))) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorMessage}>
                    <p>No se pudo cargar la información del estudiante.</p>
                    <p>Verifique que el estudiante exista e inténtelo de nuevo.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/estudiantes')}
                    className={styles.buttonReturn}
                >
                    <FaArrowLeft size={14} style={{ marginRight: '5px' }} />
                    Volver a la lista de estudiantes
                </button>
            </div>
        );
    }

    // Solo mostrar el error si no tenemos datos válidos del estudiante
    // Esto evita que errores posteriores sobreescriban datos ya cargados
    if (error && (!formData || !formData.cui || !formData.primerNombre)) {
        return (
            <div className={styles.editContainer}>
                <div className={styles.errorMessage}>{error}</div>
                <button
                    onClick={() => navigate('/admin/estudiantes')}
                    className={styles.buttonReturn}
                >
                    <FaArrowLeft size={14} style={{ marginRight: '5px' }} />
                    Volver a la lista de estudiantes
                </button>
            </div>
        );
    }

    return (
        <div className={styles.editContainer}>
            
            {/* Encabezado con navegación */}
            <div className={styles.pageHeader}>
                <div className={styles.breadcrumb}>
                    <Link to="/admin/estudiantes" className={styles.breadcrumbLink}>Estudiantes</Link>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    {cui && (
                        <>
                            <Link
                                to={`/admin/estudiantes/${cui}`}
                                className={styles.breadcrumbLink}
                            >
                                Detalle de {formData.primerNombre} {formData.primerApellido}
                            </Link>
                            <span className={styles.breadcrumbSeparator}>/</span>
                        </>
                    )}
                    <span className={styles.breadcrumbCurrent}>Editar estudiante</span>
                </div>

                <Link to="/admin/estudiantes" className={styles.buttonReturn}>
                    <FaArrowLeft size={14} style={{ marginRight: '5px' }} />
                    Volver a la lista
                </Link>
            </div>

            <div className={styles.editCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.headerIcon}>
                        <FaUserEdit />
                    </div>
                    <h1 className={styles.cardTitle}>Editar Estudiante</h1>
                </div>

                {/* Mostrar mensaje de éxito o error en la parte superior del formulario */}
                {isSuccess && (
                    <div className={styles.successMessage}>
                        <p>Estudiante actualizado correctamente. Redirigiendo...</p>
                    </div>
                )} 

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Información Personal</h2>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="cui" className={styles.inputLabel}>
                                    CUI / DPI (Obligatorio)
                                </label>
                                <input
                                    type="text"
                                    id="cui"
                                    name="cui"
                                    className={styles.inputField}
                                    value={formData.cui}
                                    onChange={handleChange}
                                    disabled={true}
                                    title="El CUI no puede ser modificado ya que es la llave primaria"
                                />
                                <div className={styles.inputHelp}>El CUI no puede ser modificado ya que es la llave primaria</div>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="primerNombre" className={styles.inputLabel}>
                                    Primer Nombre (Obligatorio)
                                </label>
                                <input
                                    type="text"
                                    id="primerNombre"
                                    name="primerNombre"
                                    className={styles.inputField}
                                    value={formData.primerNombre}
                                    onChange={handleChange}
                                    required
                                    disabled={updating || isSubmitting}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="segundoNombre" className={styles.inputLabel}>
                                    Segundo Nombre
                                </label>
                                <input
                                    type="text"
                                    id="segundoNombre"
                                    name="segundoNombre"
                                    className={styles.inputField}
                                    value={formData.segundoNombre || ''}
                                    onChange={handleChange}
                                    disabled={updating || isSubmitting}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="tercerNombre" className={styles.inputLabel}>
                                    Tercer Nombre
                                </label>
                                <input
                                    type="text"
                                    id="tercerNombre"
                                    name="tercerNombre"
                                    className={styles.inputField}
                                    value={formData.tercerNombre || ''}
                                    onChange={handleChange}
                                    disabled={updating || isSubmitting}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="primerApellido" className={styles.inputLabel}>
                                    Primer Apellido (Obligatorio)
                                </label>
                                <input
                                    type="text"
                                    id="primerApellido"
                                    name="primerApellido"
                                    className={styles.inputField}
                                    value={formData.primerApellido}
                                    onChange={handleChange}
                                    required
                                    disabled={updating || isSubmitting}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="segundoApellido" className={styles.inputLabel}>
                                    Segundo Apellido
                                </label>
                                <input
                                    type="text"
                                    id="segundoApellido"
                                    name="segundoApellido"
                                    className={styles.inputField}
                                    value={formData.segundoApellido || ''}
                                    onChange={handleChange}
                                    disabled={updating || isSubmitting}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="telefono" className={styles.inputLabel}>
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    className={styles.inputField}
                                    value={formData.telefono || ''}
                                    onChange={handleChange}
                                    placeholder="Ej: 55551234"
                                    disabled={updating || isSubmitting}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="genero" className={styles.inputLabel}>
                                    Género (Obligatorio)
                                </label>
                                <select
                                    id="genero"
                                    name="genero"
                                    value={formData.genero}
                                    onChange={handleChange}
                                    className={styles.inputField}
                                    required
                                    disabled={updating || isSubmitting}
                                >
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Responsables */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                Responsables del Estudiante
                                {formData.responsables && formData.responsables.length > 0 && (
                                    <span className={styles.responsableCount}>{formData.responsables.length}</span>
                                )}
                            </h2>
                            <button
                                type="button"
                                className={styles.addButton}
                                onClick={addResponsable}
                                disabled={updating || isSubmitting}
                                title="Agregar un nuevo responsable"
                            >
                                <FaPlus size={14} style={{ marginRight: '5px' }} />
                                Añadir Responsable
                            </button>
                        </div>

                        {formData.responsables && formData.responsables.length === 0 && (
                            <div className={styles.emptyState}>
                                <p>No se ha agregado ningún responsable para este estudiante.</p>
                                <p>Puede agregar responsables si lo desea (opcional).</p>
                                <button
                                    type="button"
                                    className={styles.addButtonLarge}
                                    onClick={addResponsable}
                                    disabled={updating || isSubmitting}
                                >
                                    <FaPlus size={16} style={{ marginRight: '8px' }} />
                                    Agregar Responsable
                                </button>
                            </div>
                        )}

                        {formData.responsables && formData.responsables.map((responsable, index) => (
                            <div key={index} className={styles.responsableCard}>
                                <div className={styles.responsableHeader}>
                                    <h3 className={styles.responsableTitle}>
                                        Responsable #{index + 1}
                                    </h3>
                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={() => removeResponsable(index)}
                                        disabled={updating || isSubmitting}
                                        title="Eliminar este responsable"
                                        aria-label="Eliminar responsable"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>

                                {index === 0 && (
                                    <div className={styles.responsableNotice}>
                                        <FaUserEdit size={14} />
                                        <span>Este será el responsable principal del estudiante.</span>
                                    </div>
                                )}

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor={`idResponsable-${index}`} className={styles.inputLabel}>
                                            ID/DPI (Obligatorio)
                                        </label>
                                        <input
                                            type="text"
                                            id={`idResponsable-${index}`}
                                            name="idResponsable"
                                            value={responsable.idResponsable || ''}
                                            onChange={(e) => handleResponsableChange(index, e)}
                                            className={styles.inputField}
                                            required
                                            disabled={updating || isSubmitting}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor={`primerNombre-${index}`} className={styles.inputLabel}>
                                            Primer Nombre (Obligatorio)
                                        </label>
                                        <input
                                            type="text"
                                            id={`primerNombre-${index}`}
                                            name="primerNombre"
                                            value={responsable.primerNombre || ''}
                                            onChange={(e) => handleResponsableChange(index, e)}
                                            className={styles.inputField}
                                            required
                                            disabled={updating || isSubmitting}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor={`segundoNombre-${index}`} className={styles.inputLabel}>
                                            Segundo Nombre
                                        </label>
                                        <input
                                            type="text"
                                            id={`segundoNombre-${index}`}
                                            name="segundoNombre"
                                            value={responsable.segundoNombre || ''}
                                            onChange={(e) => handleResponsableChange(index, e)}
                                            className={styles.inputField}
                                            disabled={updating || isSubmitting}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor={`tercerNombre-${index}`} className={styles.inputLabel}>
                                            Tercer Nombre
                                        </label>
                                        <input
                                            type="text"
                                            id={`tercerNombre-${index}`}
                                            name="tercerNombre"
                                            value={responsable.tercerNombre || ''}
                                            onChange={(e) => handleResponsableChange(index, e)}
                                            className={styles.inputField}
                                            disabled={updating || isSubmitting}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor={`primerApellido-${index}`} className={styles.inputLabel}>
                                            Primer Apellido (Obligatorio)
                                        </label>
                                        <input
                                            type="text"
                                            id={`primerApellido-${index}`}
                                            name="primerApellido"
                                            value={responsable.primerApellido || ''}
                                            onChange={(e) => handleResponsableChange(index, e)}
                                            className={styles.inputField}
                                            required
                                            disabled={updating || isSubmitting}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor={`segundoApellido-${index}`} className={styles.inputLabel}>
                                            Segundo Apellido
                                        </label>
                                        <input
                                            type="text"
                                            id={`segundoApellido-${index}`}
                                            name="segundoApellido"
                                            value={responsable.segundoApellido || ''}
                                            onChange={(e) => handleResponsableChange(index, e)}
                                            className={styles.inputField}
                                            disabled={updating || isSubmitting}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor={`telefono-${index}`} className={styles.inputLabel}>
                                            Teléfono (Obligatorio)
                                        </label>
                                        <input
                                            type="tel"
                                            id={`telefono-${index}`}
                                            name="telefono"
                                            value={responsable.telefono || ''}
                                            onChange={(e) => handleResponsableChange(index, e)}
                                            className={styles.inputField}
                                            required
                                            placeholder="Ej: 55551234"
                                            disabled={updating || isSubmitting}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor={`idParentesco-${index}`} className={styles.inputLabel}>
                                            Parentesco (Obligatorio)
                                        </label>
                                        <select
                                            id={`idParentesco-${index}`}
                                            name="idParentesco"
                                            value={responsable.idParentesco || 1}
                                            onChange={(e) => handleResponsableChange(index, e)}
                                            className={styles.inputField}
                                            required
                                            disabled={updating || isSubmitting}
                                        >
                                            {parentescos.map(p => (
                                                <option key={p.id} value={p.id}>{p.descripcion}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Botones de acción */}
                    <div className={styles.formActions}>
                        <Link
                            to={cui ? `/admin/estudiantes/${cui}` : '/admin/estudiantes'}
                            className={styles.buttonCancel}
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className={styles.buttonSave}
                            disabled={updating || isSubmitting}
                        >
                            {(updating || isSubmitting) ? (
                                <>
                                    <div className={styles.spinnerSmall}></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <FaSave size={14} style={{ marginRight: '5px' }} />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Mostrar la notificación flotante para errores y éxitos */}
            {showNotification && (
              <FloatingNotification
                message={notificationMessage || (isSuccess ? "Estudiante actualizado correctamente." : "Error al actualizar el estudiante.")}
                type={isSuccess ? "success" : "error"}
                title={isSuccess ? "Éxito" : "Error"}
                onClose={() => setShowNotification(false)}
                autoCloseTime={isSuccess ? 5000 : 8000}
              />
            )}
        </div>
    );
};

export default EditStudentPage;
