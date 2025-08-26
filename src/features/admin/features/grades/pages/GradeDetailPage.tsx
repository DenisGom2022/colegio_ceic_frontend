import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './GradeDetailPage.module.css';
import {
    FaArrowLeft, FaEdit, FaGraduationCap, FaSchool, FaClock, FaCalendarAlt,
    FaMoneyBillWave, FaClipboardList, FaHistory, FaExclamationCircle,
    FaCoins, FaRegCalendarCheck, FaFileInvoiceDollar, FaLink, FaArchive
} from 'react-icons/fa';
import { useGrado, useCurso } from '../hooks';
import FloatingNotification from '../../../../../components/FloatingNotification/FloatingNotification';
import CoursesTable from '../components/CoursesTable';
import AddCourseModal from '../components/AddCourseModal';


// Definición de tipo para el registro de actividad
interface ActivityLog {
    id: string;
    type: 'create' | 'update' | 'assign' | 'price';
    description: string;
    timestamp: string;
}

// Componente Modal personalizado para asignar ciclo actual
interface AssignCycleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: { precioInscripcion: number; precioPago: number; cantidadPagos: number }) => void;
    loading: boolean;
}

const AssignCycleModal = ({ isOpen, onClose, onSubmit, loading }: AssignCycleModalProps) => {
    const [precioInscripcion, setPrecioInscripcion] = useState<string>('');
    const [precioPago, setPrecioPago] = useState<string>('');
    const [cantidadPagos, setCantidadPagos] = useState<string>('');
    const [formErrors, setFormErrors] = useState({
        precioInscripcion: '',
        precioPago: '',
        cantidadPagos: ''
    });

    const validateForm = () => {
        const errors = {
            precioInscripcion: '',
            precioPago: '',
            cantidadPagos: ''
        };
        let isValid = true;

        if (!precioInscripcion) {
            errors.precioInscripcion = 'El precio de inscripción es requerido';
            isValid = false;
        } else if (isNaN(Number(precioInscripcion)) || Number(precioInscripcion) <= 0) {
            errors.precioInscripcion = 'El precio debe ser un número positivo';
            isValid = false;
        }

        if (!precioPago) {
            errors.precioPago = 'El precio por pago es requerido';
            isValid = false;
        } else if (isNaN(Number(precioPago)) || Number(precioPago) <= 0) {
            errors.precioPago = 'El precio debe ser un número positivo';
            isValid = false;
        }

        if (!cantidadPagos) {
            errors.cantidadPagos = 'La cantidad de pagos es requerida';
            isValid = false;
        } else if (isNaN(Number(cantidadPagos)) || Number(cantidadPagos) <= 0 || !Number.isInteger(Number(cantidadPagos))) {
            errors.cantidadPagos = 'La cantidad debe ser un número entero positivo';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                precioInscripcion: Number(precioInscripcion),
                precioPago: Number(precioPago),
                cantidadPagos: Number(cantidadPagos)
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        <FaLink size={18} />
                        Asignar grado al ciclo actual
                    </h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.modalBody}>
                        <p className="mb-4 text-gray-600 text-sm">
                            Configure los parámetros financieros para la asignación del grado al ciclo escolar actual.
                        </p>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaFileInvoiceDollar size={16} />
                                Precio de inscripción (Q)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={precioInscripcion}
                                onChange={(e) => setPrecioInscripcion(e.target.value)}
                                className={styles.formInput}
                                placeholder="Ej. 500.00"
                            />
                            {formErrors.precioInscripcion && (
                                <p className={styles.formError}>
                                    <FaExclamationCircle size={14} />
                                    {formErrors.precioInscripcion}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaCoins size={16} />
                                Precio por pago (Q)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={precioPago}
                                onChange={(e) => setPrecioPago(e.target.value)}
                                className={styles.formInput}
                                placeholder="Ej. 100.00"
                            />
                            {formErrors.precioPago && (
                                <p className={styles.formError}>
                                    <FaExclamationCircle size={14} />
                                    {formErrors.precioPago}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaRegCalendarCheck size={16} />
                                Cantidad de pagos
                            </label>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={cantidadPagos}
                                onChange={(e) => setCantidadPagos(e.target.value)}
                                className={styles.formInput}
                                placeholder="Ej. 10"
                            />
                            {formErrors.cantidadPagos && (
                                <p className={styles.formError}>
                                    <FaExclamationCircle size={14} />
                                    {formErrors.cantidadPagos}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.buttonCancel}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.buttonSubmit}
                        >
                            {loading ? (
                                <>
                                    <span className="inline-block animate-spin mr-2">⟳</span>
                                    Asignando...
                                </>
                            ) : (
                                <>
                                    <FaLink className="mr-2" size={16} />
                                    Asignar al ciclo
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const GradeDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
    const [notificationMessage, setNotificationMessage] = useState<string>('');

    // Estado para el modal de asignación de ciclo
    const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
    
    // Estado para el modal de agregar curso
    const [showAddCourseModal, setShowAddCourseModal] = useState<boolean>(false);

    // Dummy data para registro de actividad (en una implementación real, esto vendría de una API)
    const [activityLogs] = useState<ActivityLog[]>([
        {
            id: '1',
            type: 'create',
            description: 'Grado creado',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '2',
            type: 'update',
            description: 'Información del grado actualizada',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '3',
            type: 'assign',
            description: 'Grado asignado al ciclo 2026',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    ]);

    const {
        grado,
        getGradoById,
        loading,
        error,
        asignarCicloActual
    } = useGrado();
    
    const {
        loading: courseLoading,
        error: courseError,
        message: courseMessage,
        createCourseForGrade,
        resetState: resetCourseState
    } = useCurso();
    
    const localError = '';

    useEffect(() => {
        if (id) {
            getGradoById(id);
        }
    }, [id, getGradoById]);

    // Verificar si el grado ya está asignado al ciclo actual
    const isAssignedToCurrentCycle = () => {
        console.log('Debug - Grado completo:', grado);
        
        // Primero intentar con ciclosActivos (estructura anterior)
        if (grado?.ciclosActivos && grado.ciclosActivos.length > 0) {
            console.log('Debug - Usando ciclosActivos:', grado.ciclosActivos);
            return true;
        }
        
        // Luego intentar con gradosCiclo (nueva estructura)
        if (!grado || !grado.gradosCiclo || grado.gradosCiclo.length === 0) {
            console.log('Debug - No hay grado o gradosCiclo:', { grado: !!grado, gradosCiclo: grado?.gradosCiclo });
            return false;
        }

        // El ciclo actual es el que tiene fechaFin = null o undefined
        const hasActiveCycle = grado.gradosCiclo.some(gradoCiclo => {
            const fechaFin = gradoCiclo.ciclo?.fechaFin;
            console.log('Debug - Evaluando ciclo:', {
                id: gradoCiclo.id,
                cicloId: gradoCiclo.ciclo?.id,
                fechaFin: fechaFin,
                isActive: fechaFin === null || fechaFin === undefined
            });
            return fechaFin === null || fechaFin === undefined;
        });
        console.log('Debug - Tiene ciclo activo:', hasActiveCycle);
        return hasActiveCycle;
    };

    // Obtener el ciclo activo del grado
    const getActiveCycle = () => {
        // Primero intentar con ciclosActivos (estructura anterior)
        if (grado?.ciclosActivos && grado.ciclosActivos.length > 0) {
            console.log('Debug getActiveCycle - Usando ciclosActivos:', grado.ciclosActivos[0]);
            return grado.ciclosActivos[0];
        }
        
        // Luego intentar con gradosCiclo (nueva estructura)
        if (!grado || !grado.gradosCiclo || grado.gradosCiclo.length === 0) {
            console.log('Debug getActiveCycle - No hay grado o gradosCiclo');
            return null;
        }

        const activeCycle = grado.gradosCiclo.find(gradoCiclo => {
            const fechaFin = gradoCiclo.ciclo?.fechaFin;
            console.log('Debug getActiveCycle - Evaluando ciclo:', {
                id: gradoCiclo.id,
                cicloId: gradoCiclo.ciclo?.id,
                fechaFin: fechaFin,
                isActive: fechaFin === null || fechaFin === undefined
            });
            return fechaFin === null || fechaFin === undefined;
        });
        console.log('Debug getActiveCycle - Ciclo activo encontrado:', activeCycle);
        return activeCycle;
    };

    // Obtener los ciclos finalizados del grado
    const getFinishedCycles = () => {
        // Primero intentar con ciclosFinalizados (estructura anterior)
        if (grado?.ciclosFinalizados && grado.ciclosFinalizados.length > 0) {
            console.log('Debug getFinishedCycles - Usando ciclosFinalizados:', grado.ciclosFinalizados);
            return grado.ciclosFinalizados;
        }
        
        // Luego intentar con gradosCiclo (nueva estructura)
        if (!grado || !grado.gradosCiclo || grado.gradosCiclo.length === 0) {
            return [];
        }

        const finishedCycles = grado.gradosCiclo.filter(gradoCiclo => {
            const fechaFin = gradoCiclo.ciclo?.fechaFin;
            return fechaFin !== null && fechaFin !== undefined;
        });
        console.log('Debug getFinishedCycles - Ciclos finalizados encontrados:', finishedCycles);
        return finishedCycles;
    };

    // Manejar la asignación al ciclo actual
    const handleAssignToCycle = async (formData: { precioInscripcion: number; precioPago: number; cantidadPagos: number }) => {
        if (!id) return;

        try {
            await asignarCicloActual({
                idGrado: Number(id),
                precioInscripcion: formData.precioInscripcion,
                precioPago: formData.precioPago,
                cantidadPagos: formData.cantidadPagos
            });

            setShowAssignModal(false);
            setNotificationType('success');
            setNotificationMessage('Grado asignado exitosamente al ciclo actual');
            setShowNotification(true);

            // Recargar los datos del grado para mostrar la asignación
            getGradoById(id);

        } catch (error: any) {
            console.error('Error al asignar el grado al ciclo:', error);
            // NO cerrar el modal en caso de error para que el usuario vea la notificación
            setNotificationType('error');
            
            // Extraer el mensaje de error del backend
            let errorMessage = 'Error al asignar el grado al ciclo actual';
            
            if (error?.response?.data?.message) {
                // Si el error viene del response de axios
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                // Si el error tiene un mensaje directo
                errorMessage = error.message;
            }
            
            setNotificationMessage(errorMessage);
            setShowNotification(true);
        }
    };

    // Manejar la creación de curso
    const handleAddCourse = async (courseData: {
        nombre: string;
        notaMaxima: number;
        notaAprobada: number;
        dpiCatedratico: string;
    }) => {
        if (!id) return;

        try {
            await createCourseForGrade({
                ...courseData,
                idGrado: Number(id)
            });

            setShowAddCourseModal(false);
            setNotificationType('success');
            setNotificationMessage(courseMessage || 'Curso creado exitosamente');
            setShowNotification(true);

            // Recargar los datos del grado para mostrar el nuevo curso
            getGradoById(id);
            resetCourseState();

        } catch (error: any) {
            console.error('Error al crear el curso:', error);
            setNotificationType('error');
            setNotificationMessage(courseError || error?.message || 'Error al crear el curso');
            setShowNotification(true);
        }
    };

    // Formatear fecha
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // Formatear moneda
    const formatCurrency = (amount: string | undefined) => {
        if (!amount) return "Q0.00";
        const numericValue = parseFloat(amount);
        return `Q${numericValue.toFixed(2)}`;
    };

    // Obtener el icono para el tipo de actividad
    const getActivityIcon = (type: ActivityLog['type']) => {
        switch (type) {
            case 'create': return <FaGraduationCap />;
            case 'update': return <FaEdit />;
            case 'assign': return <FaClipboardList />;
            case 'price': return <FaMoneyBillWave />;
            default: return <FaHistory />;
        }
    };

    // Formatear fecha de la actividad
    const formatActivityDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div className={styles.detailContainer}>
                <div className="text-center py-16">
                    <div className="text-gray-400 text-lg">Cargando información del grado...</div>
                </div>
            </div>
        );
    }

    if (error || localError) {
        return (
            <div className={styles.detailContainer}>
                <div className="text-center py-16">
                    <div className="text-red-500 text-lg">Error: {error || localError}</div>
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

    if (!grado) {
        return (
            <div className={styles.detailContainer}>
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
        <div className={styles.detailContainer}>
            {/* Encabezado con navegación */}
            <div className={styles.pageHeader}>
                <div className={styles.breadcrumb}>
                    <Link to="/admin/grados">Grados</Link>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <span className={styles.breadcrumbCurrent}>Detalle de grado</span>
                </div>

                <div className={styles.actionButtons}>
                    <Link to="/admin/grados" className={styles.buttonReturn}>
                        <FaArrowLeft size={14} />
                        <span>Volver a la lista</span>
                    </Link>
                    <Link to={`/admin/editar-grado/${grado.id}`} className={styles.buttonEdit}>
                        <FaEdit size={14} />
                        <span>Editar grado</span>
                    </Link>
                    <button
                        onClick={() => !isAssignedToCurrentCycle() && setShowAssignModal(true)}
                        className={`${styles.buttonAssign} ${isAssignedToCurrentCycle() ? styles.disabled : ''}`}
                        disabled={isAssignedToCurrentCycle()}
                        title={isAssignedToCurrentCycle() ? 'Este grado ya está asignado al ciclo actual' : 'Configurar y asignar este grado al ciclo actual'}
                    >
                        <FaLink size={14} />
                        <span>Asignar al ciclo actual</span>
                    </button>
                </div>
            </div>

            {/* Tarjeta de detalle de grado */}
            <div className={styles.userDetailCard}>
                {/* Encabezado con información principal */}
                <div className={styles.userHeader}>
                    <div className={styles.avatarLarge}>
                        <FaGraduationCap size={28} />
                    </div>

                    <div className={styles.userInfo}>
                        <h2 className={styles.userName}>
                            {grado.nombre}
                        </h2>

                        <div className={styles.userMeta}>
                            <div className={styles.userMetaItem}>
                                <FaSchool size={14} />
                                {grado.nivelAcademico.descripcion}
                            </div>
                            <div className={styles.userMetaItem}>
                                <FaClock size={14} />
                                {grado.jornada.descripcion}
                            </div>
                            <div className={styles.userMetaItem}>
                                <FaCalendarAlt size={14} />
                                Creado el {formatDate(grado.createdAt)}
                            </div>
                        </div>

                        <div className={styles.userStatus}>
                            <div className={`${styles.statusDot} ${styles.active}`}></div>
                            <span className={`${styles.statusText} ${styles.active}`}>Activo</span>
                        </div>
                    </div>
                </div>

                {/* Sección: Información básica */}
                <div className={styles.detailSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionIcon}>
                            <FaGraduationCap size={16} />
                        </div>
                        <h3 className={styles.sectionTitle}>Información del grado</h3>
                    </div>

                    <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>Nombre</div>
                            <div className={styles.detailValue}>{grado.nombre}</div>
                        </div>

                        <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>Nivel académico</div>
                            <div className={styles.detailValue}>{grado.nivelAcademico.descripcion}</div>
                        </div>

                        <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>Jornada</div>
                            <div className={styles.detailValue}>{grado.jornada.descripcion}</div>
                        </div>

                        <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>Fecha de creación</div>
                            <div className={styles.detailValue}>{formatDate(grado.createdAt)}</div>
                        </div>

                        <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>Última actualización</div>
                            <div className={styles.detailValue}>{formatDate(grado.updatedAt)}</div>
                        </div>

                        <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>Estado</div>
                            <div className={styles.detailValue}>
                                <div className={styles.userStatus} style={{ marginTop: 0 }}>
                                    <div className={`${styles.statusDot} ${styles.active}`}></div>
                                    <span className={`${styles.statusText} ${styles.active}`}>Activo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección: Ciclo activo */}
                {(() => {
                    const activeCycle = getActiveCycle();
                    return activeCycle ? (
                        <div className={styles.detailSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionIcon}>
                                    <FaClipboardList size={16} />
                                </div>
                                <h3 className={styles.sectionTitle}>Ciclo Activo</h3>
                                <div className={`${styles.statusDot} ${styles.active}`}></div>
                                <span className={`${styles.statusText} ${styles.active}`}>Activo</span>
                            </div>
                            <div className={styles.detailGrid}>
                                <div className={styles.detailItem}>
                                    <div className={styles.detailLabel}>id</div>
                                    <div className={styles.detailValue}>{activeCycle.id}</div>
                                </div>

                                <div className={styles.detailItem}>
                                    <div className={styles.detailLabel}>Ciclo</div>
                                    <div className={styles.detailValue}>{activeCycle.idCiclo + " " + activeCycle.ciclo.descripcion}</div>
                                </div>

                                <div className={styles.detailItem}>
                                    <div className={styles.detailLabel}>Precio de inscripción</div>
                                    <div className={styles.detailValue}>{formatCurrency(activeCycle.precioInscripcion)}</div>
                                </div>

                                <div className={styles.detailItem}>
                                    <div className={styles.detailLabel}>Cantidad de Pagos</div>
                                    <div className={styles.detailValue}>{activeCycle.cantidadPagos}</div>
                                </div>

                                <div className={styles.detailItem}>
                                    <div className={styles.detailLabel}>Precio de Pago</div>
                                    <div className={styles.detailValue}>{formatCurrency(activeCycle.precioPago)}</div>
                                </div>

                                <div className={styles.detailItem}>
                                    <div className={styles.detailLabel}>Cantidad de Cursos</div>
                                    <div className={styles.detailValue}>{activeCycle.cursos?.length || 0}</div>
                                </div>                                            
                            </div>
                            <CoursesTable 
                                cursos={activeCycle.cursos || []} 
                                gradeId={grado.id}
                                showAddButton={true}
                            />
                        </div>
                    ) : (
                    <div className={styles.detailSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                <FaClipboardList size={16} />
                            </div>
                            <h3 className={styles.sectionTitle}>Ciclo Activo</h3>
                            <div className={`${styles.statusDot} ${styles.inactive}`}></div>
                            <span className={`${styles.statusText} ${styles.inactive}`}>Sin asignar</span>
                        </div>
                        <div className={styles.noCycleMessage}>
                            <div className={styles.noCycleIcon}>
                                <FaExclamationCircle size={24} />
                            </div>
                            <div className={styles.noCycleContent}>
                                <h4 className={styles.noCycleTitle}>No hay ciclo activo asignado</h4>
                                <p className={styles.noCycleText}>
                                    Este grado no está asignado a ningún ciclo activo actualmente.
                                </p>
                                <button
                                    onClick={() => setShowAssignModal(true)}
                                    className={styles.assignCycleBtn}
                                >
                                    <FaLink size={14} />
                                    Asignar al ciclo actual
                                </button>
                            </div>
                        </div>
                    </div>
                );
                })()}

                {/* Sección: Ciclos Finalizados */}
                {(() => {
                    const finishedCycles = getFinishedCycles();
                    return finishedCycles.length > 0 && (
                        <div className={styles.detailSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionIcon}>
                                    <FaArchive size={16} />
                                </div>
                                <h3 className={styles.sectionTitle}>Ciclos Finalizados</h3>
                                <div className={`${styles.statusDot} ${styles.inactive}`}></div>
                                <span className={`${styles.statusText} ${styles.inactive}`}>
                                    {finishedCycles.length} {finishedCycles.length === 1 ? 'ciclo' : 'ciclos'}
                                </span>
                            </div>
                            
                            <div className={styles.finalizadosCyclesContainer}>
                                {finishedCycles.map((cicloFinalizado) => (
                                <div key={cicloFinalizado.id} className={styles.finalizadoCycleCard}>
                                    <div className={styles.finalizadoCycleHeader}>
                                        <div className={styles.finalizadoCycleInfo}>
                                            <h4 className={styles.finalizadoCycleTitle}>
                                                {cicloFinalizado.ciclo.descripcion}
                                            </h4>
                                            <div className={styles.finalizadoCycleMeta}>
                                                <span className={styles.finalizadoCycleId}>
                                                    ID: {cicloFinalizado.id}
                                                </span>
                                                <span className={styles.finalizadoCycleDate}>
                                                    Finalizado: {formatDate(cicloFinalizado.ciclo.fechaFin)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.finalizadoCycleStatus}>
                                            <div className={`${styles.statusDot} ${styles.inactive}`}></div>
                                            <span className={`${styles.statusText} ${styles.inactive}`}>Finalizado</span>
                                        </div>
                                    </div>

                                    <div className={styles.finalizadoCycleDetails}>
                                        <div className={styles.detailGrid}>
                                            <div className={styles.detailItem}>
                                                <div className={styles.detailLabel}>Precio de inscripción</div>
                                                <div className={styles.detailValue}>{formatCurrency(cicloFinalizado.precioInscripcion)}</div>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <div className={styles.detailLabel}>Cantidad de Pagos</div>
                                                <div className={styles.detailValue}>{cicloFinalizado.cantidadPagos}</div>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <div className={styles.detailLabel}>Precio de Pago</div>
                                                <div className={styles.detailValue}>{formatCurrency(cicloFinalizado.precioPago)}</div>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <div className={styles.detailLabel}>Cantidad de Cursos</div>
                                                <div className={styles.detailValue}>
                                                    {cicloFinalizado.cursos?.length || 0}
                                                </div>
                                            </div>
                                        </div>

                                        {cicloFinalizado.cursos && cicloFinalizado.cursos.length > 0 && (
                                            <CoursesTable cursos={cicloFinalizado.cursos} gradeId={grado.id} />
                                        )}

                                        {(!cicloFinalizado.cursos || cicloFinalizado.cursos.length === 0) && (
                                            <div className={styles.noCursosMessage}>
                                                <div className={styles.noCursosIcon}>
                                                    <FaGraduationCap size={20} />
                                                </div>
                                                <span className={styles.noCursosText}>
                                                    Este ciclo no tuvo cursos asignados
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    );
                })()}

                {/* Sección: Registro de actividad */}
                <div className={styles.activitySection}>
                    <div className={styles.activityHeader}>
                        <h3 className={styles.activityTitle}>
                            <FaHistory size={16} />
                            Registro de actividad
                        </h3>
                    </div>

                    <div className={styles.activityList}>
                        {activityLogs.map((activity) => (
                            <div key={activity.id} className={styles.activityItem}>
                                <div className={styles.activityIcon}>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className={styles.activityContent}>
                                    <div className={styles.activityText}>
                                        <span className={styles.activityDescription}>
                                            {activity.description}
                                        </span>
                                    </div>
                                    <div className={styles.activityDate}>
                                        {formatActivityDate(activity.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activityLogs.length === 0 && (
                            <div className="text-center py-8">
                                <span className="text-gray-400">No hay registros de actividad</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de asignación de ciclo */}
            {showAssignModal && (
                <AssignCycleModal
                    isOpen={showAssignModal}
                    onClose={() => setShowAssignModal(false)}
                    onSubmit={handleAssignToCycle}
                    loading={loading}
                />
            )}

            {/* Modal de agregar curso */}
            {showAddCourseModal && (
                <AddCourseModal
                    isOpen={showAddCourseModal}
                    onClose={() => setShowAddCourseModal(false)}
                    onSubmit={handleAddCourse}
                    loading={courseLoading}
                />
            )}

            {showNotification && (
                <FloatingNotification
                    type={notificationType}
                    title={notificationType === 'success' ? 'Éxito' : 'Error'}
                    message={notificationMessage}
                    onClose={() => {
                        setShowNotification(false);
                        // Si es un error y el modal de asignación está abierto, mantenerlo abierto
                        // Si es éxito, ya se cerró el modal en el try
                        if (notificationType === 'error' && showAssignModal) {
                            // El modal permanece abierto para que el usuario pueda intentar de nuevo
                        }
                    }}
                    autoCloseTime={notificationType === 'success' ? 3000 : 0}
                />
            )}
        </div>
    );
};

export default GradeDetailPage;
