import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './EditUser.module.css';
import {
    FaUser,
    FaIdCard,
    FaPhone,
    FaUserTag,
    FaArrowLeft,
    FaCheck,
    FaAddressCard,
    FaUserPlus,
    FaSpinner,
    FaSave
} from 'react-icons/fa';
import { useEditarUsuario, useUsuario } from '../hooks';
import { getAllTiposUsuario } from '../services/userService';
import type { TipoUsuario } from '../models';

interface FormErrors {
    [key: string]: string;
}

const EditUserPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getUsuarioById, usuario: usuarioData, loading: loadingUsuario, error: errorUsuario } = useUsuario();
    const { loading: loadingUpdate, updateUser } = useEditarUsuario();

    // Estados para los campos del formulario
    const [formData, setFormData] = useState({
        usuario: '',
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
    const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>([]);
    const [, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
    const [notificationMessage, setNotificationMessage] = useState('');

    // Cargar datos del usuario y tipos de usuario
    useEffect(() => {
        let isMounted = true;

        const cargarDatos = async () => {
            if (!id) {
                navigate('/admin/usuarios');
                return;
            }

            try {
                setLoading(true);
                // Cargar datos del usuario
                await getUsuarioById(id);

                // Cargar tipos de usuario
                const tipos = await getAllTiposUsuario();
                if (isMounted && tipos) {
                    setTiposUsuario(tipos);
                }
                setLoading(false);
            } catch (err) {
                if (isMounted) {
                    console.error("Error al cargar datos:", err);
                    setError('Error al cargar los datos del usuario');
                    setLoading(false);
                }
            }
        };

        cargarDatos();

        return () => {
            isMounted = false;
        };
    }, [id, getUsuarioById, navigate]);

    // Actualizar formulario cuando se carga el usuario
    useEffect(() => {
        if (usuarioData) {
            setFormData({
                usuario: usuarioData.usuario,
                primerNombre: usuarioData.primerNombre || '',
                segundoNombre: usuarioData.segundoNombre || '',
                tercerNombre: usuarioData.tercerNombre || '',
                primerApellido: usuarioData.primerApellido || '',
                segundoApellido: usuarioData.segundoApellido || '',
                telefono: usuarioData.telefono || '',
                idTipoUsuario: usuarioData.tipoUsuario?.id || 0
            });
        }
    }, [usuarioData]);

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'primerNombre':
            case 'primerApellido':
                return value.trim() === '' ? 'Este campo es requerido' : '';
            case 'telefono':
                return value.trim() === '' ? 'El teléfono es requerido' :
                    !/^[0-9]{8,12}$/.test(value) ? 'Ingrese un número de teléfono válido' : '';
            default:
                return '';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'idTipoUsuario' ? parseInt(value, 10) : value
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
        if (!formData.primerNombre) {
            newErrors.primerNombre = 'El primer nombre es requerido';
            isValid = false;
        }

        if (!formData.primerApellido) {
            newErrors.primerApellido = 'El primer apellido es requerido';
            isValid = false;
        }

        if (!formData.telefono) {
            newErrors.telefono = 'El teléfono es requerido';
            isValid = false;
        } else if (!/^[0-9]{8,12}$/.test(formData.telefono)) {
            newErrors.telefono = 'Ingrese un número de teléfono válido';
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
            try {
                const mensaje = await updateUser({
                    usuario: formData.usuario,
                    primerNombre: formData.primerNombre,
                    segundoNombre: formData.segundoNombre || undefined,
                    tercerNombre: formData.tercerNombre || undefined,
                    primerApellido: formData.primerApellido,
                    segundoApellido: formData.segundoApellido || undefined,
                    telefono: formData.telefono,
                    idTipoUsuario: formData.idTipoUsuario
                });

                // Mostrar notificación de éxito
                setNotificationType('success');
                setNotificationMessage(mensaje || 'Usuario actualizado con éxito');
                setShowNotification(true);

                // Redirigir después de un breve momento
                setTimeout(() => {
                    navigate(`/admin/usuarios/${formData.usuario}`);
                }, 2000);

            } catch (err: any) {
                setNotificationType('error');
                setNotificationMessage(err?.response?.data?.message || err.message || 'Error al actualizar el usuario');
                setShowNotification(true);
            }
        }
    };

    return (
        <div className={styles.formContainer}>
            {/* Encabezado con migas de pan */}
            <div className={styles.pageHeader}>
                <div className={styles.breadcrumb}>
                    <Link to="/admin/usuarios">Usuarios</Link>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <Link to={`/admin/usuarios/${formData.usuario}`}>{formData.usuario}</Link>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <span className={styles.breadcrumbCurrent}>Editar usuario</span>
                </div>

                <Link to={`/admin/usuarios/${formData.usuario}`} className={styles.buttonCancel}>
                    <FaArrowLeft size={14} style={{ marginRight: '6px' }} />
                    Volver a detalles
                </Link>
            </div>

            {loadingUsuario ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.loader}></div>
                    <p>Cargando datos del usuario...</p>
                </div>
            ) : errorUsuario ? (
                <div className={styles.errorContainer}>
                    <p className={styles.errorMessage}>{errorUsuario}</p>
                    <Link to="/admin/usuarios" className={styles.buttonCancel}>
                        Volver a la lista
                    </Link>
                </div>
            ) : (
                /* Formulario */
                <form onSubmit={handleSubmit}>
                    <div className={styles.formCard}>
                        {/* Sección: Información de cuenta */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionIcon}>
                                    <FaUser />
                                </div>
                                <div>
                                    <h3 className={styles.sectionTitle}>Información de cuenta</h3>
                                    <p className={styles.sectionDescription}>
                                        Datos de identificación del usuario en el sistema
                                    </p>
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>
                                        Usuario
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <FaUser className={styles.inputIcon} />
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={formData.usuario}
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                    <p className={styles.helpText}>El nombre de usuario no puede modificarse</p>
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
                                        >
                                            <option value="">Seleccione un tipo</option>
                                            {tiposUsuario.map(tipo => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.descripcion}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <p className={styles.helpText}>Define los permisos en el sistema</p>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className={styles.formActions}>
                            <Link
                                to={`/admin/usuarios/${formData.usuario}`}
                                className={styles.buttonCancel}
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                className={`${styles.buttonSubmit} ${loadingUpdate ? styles.buttonLoading : ''}`}
                                disabled={loadingUpdate}
                            >
                                {loadingUpdate ? (
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
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditUserPage;
