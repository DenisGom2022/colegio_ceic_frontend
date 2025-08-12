import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReiniciarContrasena } from '../hooks';
import styles from './ResetPassword.module.css';
import { FaKey, FaArrowLeft } from 'react-icons/fa';

export const ResetPasswordPage = () => {
    const { usuario } = useParams<{ usuario: string }>();
    const navigate = useNavigate();
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
    const [mensajeNotificacion, setMensajeNotificacion] = useState('');
    const [tipoNotificacion, setTipoNotificacion] = useState<'success' | 'error'>('success');
    
    const { loading, error, resetPassword } = useReiniciarContrasena();

    // Validar que tenemos un usuario
    useEffect(() => {
        if (!usuario) {
            navigate('/admin/usuarios');
        }
    }, [usuario, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Validaciones básicas
        if (!contrasena || !confirmarContrasena) {
            setFormError('Todos los campos son obligatorios');
            return;
        }

        if (contrasena !== confirmarContrasena) {
            setFormError('Las contraseñas no coinciden');
            return;
        }

        if (contrasena.length < 6) {
            setFormError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const mensaje = await resetPassword(usuario!, contrasena);
            
            // Mostrar notificación de éxito
            setMensajeNotificacion(mensaje || 'Contraseña reiniciada con éxito');
            setTipoNotificacion('success');
            setMostrarNotificacion(true);
            
            // Limpiar el formulario
            setContrasena('');
            setConfirmarContrasena('');
            
            // Redirigir después de un breve momento
            setTimeout(() => {
                navigate('/admin/usuarios');
            }, 2000);
            
        } catch (err) {
            // Error será manejado por el hook y mostrado en la interfaz
            setTipoNotificacion('error');
            setMensajeNotificacion(error || 'Error al reiniciar la contraseña');
            setMostrarNotificacion(true);
        }
    };
    
    const handleVolver = () => {
        navigate('/admin/usuarios');
    };

    return (
        <div className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={handleVolver}>
                        <FaArrowLeft /> Volver
                    </button>
                    <h1 className={styles.title}>
                        <FaKey className={styles.icon} />
                        Reiniciar Contraseña
                    </h1>
                </div>

                <div className={styles.formCard}>
                    <div className={styles.formHeader}>
                        <h2>Usuario: <span className={styles.username}>{usuario}</span></h2>
                        <p className={styles.instructions}>
                            Al reiniciar la contraseña, el usuario tendrá que utilizar esta nueva contraseña para acceder al sistema.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="contrasena" className={styles.label}>Nueva Contraseña</label>
                            <input
                                type="password"
                                id="contrasena"
                                className={styles.input}
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                placeholder="Ingrese la nueva contraseña"
                                autoComplete="new-password"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmarContrasena" className={styles.label}>Confirmar Contraseña</label>
                            <input
                                type="password"
                                id="confirmarContrasena"
                                className={styles.input}
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                placeholder="Confirme la nueva contraseña"
                                autoComplete="new-password"
                            />
                        </div>

                        {(formError || error) && (
                            <div className={styles.errorMessage}>
                                {formError || error}
                            </div>
                        )}

                        <div className={styles.formActions}>
                            <button 
                                type="button" 
                                className={styles.cancelButton}
                                onClick={handleVolver}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Procesando...' : 'Reiniciar Contraseña'}
                            </button>
                        </div>
                    </form>
                </div>

                {mostrarNotificacion && (
                    <div className={`${styles.notification} ${tipoNotificacion === 'success' ? styles.success : styles.error}`}>
                        <span>{mensajeNotificacion}</span>
                        <button 
                            className={styles.closeNotification}
                            onClick={() => setMostrarNotificacion(false)}
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
    );
};

export default ResetPasswordPage;
