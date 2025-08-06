import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './EditarCatedratico.module.css';
import { FaArrowLeft, FaSave, FaUserEdit, FaUser, FaCheck, FaSpinner } from 'react-icons/fa';
import { getCatedraticoById, updateCatedratico } from '../../services/catedraticoService';
import type { Catedratico } from '../../hooks/useTablaCatedratico';
import FloatingNotification from '../../components/FloatingNotification';
import UserSelectionModal from '../../components/UserSelectionModal';

const EditarCatedratico = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [catedratico, setCatedratico] = useState<Catedratico | null>(null);
    const [formData, setFormData] = useState({
        dpi: '',
        idUsuario: ''
    });
    const [loading, setLoading] = useState<boolean>(false); // Initialize as false
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    
    // Estado para el modal de selección de usuarios
    const [showModal, setShowModal] = useState(false);
    
    // Estados para notificaciones
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    
    // Estado para guardar el usuario seleccionado completo
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Cargar los datos del catedrático al iniciar
    useEffect(() => {
        const loadCatedratico = async () => {
            if (!id) {
                console.log('ID no proporcionado');
                return;
            }

            try {
                // Evitar múltiples llamadas mientras está cargando
                if (loading) return;
                
                setLoading(true);
                console.log(`Cargando datos para el catedrático con ID: ${id}`);
                const data = await getCatedraticoById(id);
                console.log('Datos cargados:', data);
                setCatedratico(data);
                
                // Inicializar el formulario con los datos existentes
                setFormData({
                    dpi: data.dpi || '',
                    idUsuario: data.idUsuario || ''
                });
                
                // Si el catedrático ya tiene un usuario asociado, cargar también su información
                if (data.usuario) {
                    setSelectedUser(data.usuario);
                }
                
                setError(null);
            } catch (err: any) {
                console.error('Error al cargar los datos del catedrático:', err);
                setError(err?.response?.data?.message || err.message || 'Error al cargar los datos del catedrático');
            } finally {
                setLoading(false);
            }
        };

        loadCatedratico();
    }, [id, loading]);

    // Función para abrir el modal de selección de usuario
    const handleOpenUserModal = () => {
        setShowNotification(false);
        setErrorMessage("");
        setShowModal(true);
    };
    
    // Función para seleccionar un usuario del modal
    const handleSelectUser = (usuario: any) => {
        setSelectedUser(usuario);
        
        setFormData(prev => ({
            ...prev,
            idUsuario: usuario.usuario
        }));
        
        setShowModal(false);
    };

    // Manejar cambios en los campos del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    };

    // Enviar el formulario para actualizar el catedrático
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // No permitir múltiples envíos simultáneos
            if (submitting) return;
            
            setSubmitting(true);
            setError(null);
            setShowNotification(false);
            setErrorMessage("");
            
            console.log('Enviando actualización con datos:', formData);
            
            // Enviamos el idUsuario y el DPI como requiere la API
            const resultado = await updateCatedratico(formData.idUsuario, { dpi: formData.dpi });
            console.log('Respuesta de actualización:', resultado);
            
            setSuccess(true);
            setShowNotification(true);
            
            // Redirigir a la página de detalles después de un tiempo
            setTimeout(() => {
                navigate(`/admin/catedratico/${formData.dpi}`);
            }, 1500);
            
        } catch (err: any) {
            console.error('Error al actualizar el catedrático:', err);
            const errorMsg = err?.response?.data?.message || err.message || 'Error al actualizar el catedrático';
            setError(errorMsg);
            setErrorMessage(errorMsg);
            setShowNotification(true);
            setSuccess(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Cargando datos del catedrático...</p>
            </div>
        );
    }

    return (
        <div className={styles.editContainer}>
            {/* Encabezado con navegación */}
            <div className={styles.pageHeader}>
                <div className={styles.breadcrumb}>
                    <Link to="/admin/catedraticos" className={styles.breadcrumbLink}>Catedráticos</Link>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    {catedratico && (
                        <>
                            <Link 
                                to={`/admin/catedratico/${catedratico.dpi}`} 
                                className={styles.breadcrumbLink}
                            >
                                Detalle de {catedratico.idUsuario}
                            </Link>
                            <span className={styles.breadcrumbSeparator}>/</span>
                        </>
                    )}
                    <span className={styles.breadcrumbCurrent}>Editar catedrático</span>
                </div>
                
                <Link to="/admin/catedraticos" className={styles.buttonReturn}>
                    <FaArrowLeft size={14} />
                    Volver a la lista
                </Link>
            </div>

            <div className={styles.editCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.headerIcon}>
                        <FaUserEdit />
                    </div>
                    <h1 className={styles.cardTitle}>Editar Catedrático</h1>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className={styles.successMessage}>
                        <p>Catedrático actualizado correctamente. Redirigiendo...</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Información del catedrático</h2>
                        
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="dpi" className={styles.inputLabel}>
                                    DPI
                                </label>
                                <input
                                    type="text"
                                    id="dpi"
                                    name="dpi"
                                    className={styles.inputField}
                                    value={formData.dpi}
                                    onChange={handleChange}
                                    disabled={true} // No permitir cambiar el DPI porque es la llave primaria
                                    title="El DPI no puede ser modificado ya que es la llave primaria"
                                />
                                <div className={styles.inputHelp}>El DPI no puede ser modificado ya que es la llave primaria</div>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="idUsuario" className={styles.inputLabel}>
                                    Nombre de usuario
                                </label>
                                <div className={styles.userSelectContainer}>
                                    <input
                                        type="text"
                                        id="idUsuario"
                                        name="idUsuario"
                                        className={styles.inputField}
                                        value={formData.idUsuario}
                                        onChange={handleChange}
                                        required
                                        placeholder="Seleccione un usuario"
                                        readOnly
                                    />
                                    <button 
                                        type="button" 
                                        className={styles.selectUserButton}
                                        onClick={handleOpenUserModal}
                                    >
                                        <FaUser size={14} />
                                        Seleccionar usuario
                                    </button>
                                </div>
                                
                                {/* Mostrar información del usuario seleccionado */}
                                {selectedUser && (
                                    <div className={styles.selectedUserInfo}>
                                        <div className={styles.selectedUserAvatar}>
                                            {selectedUser.primerNombre?.charAt(0)}{selectedUser.primerApellido?.charAt(0)}
                                        </div>
                                        <div className={styles.selectedUserDetails}>
                                            <h4 className={styles.selectedUserName}>
                                                {selectedUser.primerNombre} {selectedUser.segundoNombre ? `${selectedUser.segundoNombre} ` : ''}
                                                {selectedUser.primerApellido} {selectedUser.segundoApellido || ''}
                                            </h4>
                                            <p className={styles.selectedUserUsername}>@{selectedUser.usuario}</p>
                                            {selectedUser.tipoUsuario && (
                                                <span className={styles.selectedUserType}>{selectedUser.tipoUsuario.descripcion}</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <Link 
                            to={catedratico ? `/admin/catedratico/${catedratico.dpi}` : '/admin/catedraticos'}
                            className={styles.buttonCancel}
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className={styles.buttonSave}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <div className={styles.spinnerSmall}></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <FaSave size={14} />
                                    Guardar cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Modal de selección de usuario */}
            <UserSelectionModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)} 
                onSelectUser={handleSelectUser} 
            />
            
            {/* Notificación de éxito o error */}
            {showNotification && (
                <FloatingNotification
                    message={errorMessage || "Catedrático actualizado correctamente."}
                    type={errorMessage ? "error" : "success"}
                    title={errorMessage ? "Error" : "Éxito"}
                    onClose={() => setShowNotification(false)}
                    autoCloseTime={5000}
                />
            )}
        </div>
    );
};

export default EditarCatedratico;
