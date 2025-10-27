import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { SecureIcon } from "../../icons/SecureIcon";
import cambiaStyles from "./cambiaContrasena.module.css";
import { RESPUESTA_USER } from "../../enums/enums";
import { useUsuario } from "../../hooks/useUsuario";
import { FaArrowLeft, FaCheckCircle, FaEye, FaEyeSlash, FaLock, FaShieldAlt, FaUser } from "react-icons/fa";

export default function CambiaContrasena() {
    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState(() => searchParams.get("username") || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [changeSuccess, setChangeSuccess] = useState(false);
    const { cambiarContrasena, loading, error } = useUsuario();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resp = await cambiarContrasena(username, currentPassword, newPassword, confirmPassword);
        if (resp === RESPUESTA_USER.OK) {
            setChangeSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    };

    // Validación de contraseñas
    const passwordsMatch = newPassword === confirmPassword;
    const passwordStrong = newPassword.length >= 6;

    return (
        <div className={cambiaStyles.pageContainer}>
            <div className={cambiaStyles.pageContent}>
                {/* Panel izquierdo */}
                <div className={cambiaStyles.leftPanel}>
                    <div className={cambiaStyles.logoContainer}>
                        <div className={cambiaStyles.logoIcon}>
                            <SecureIcon />
                        </div>
                        <h3 className={cambiaStyles.logoText}>Colegio CEIC</h3>
                    </div>
                    
                    <div className={cambiaStyles.leftPanelContent}>
                        <h1 className={cambiaStyles.mainTitle}>Seguridad de tu cuenta</h1>
                        <p className={cambiaStyles.description}>
                            Cambiar tu contraseña regularmente ayuda a mantener tu cuenta segura. 
                            Utiliza una combinación de letras, números y símbolos para crear una 
                            contraseña fuerte.
                        </p>
                        
                        <div className={cambiaStyles.securityTips}>
                            <h4 className={cambiaStyles.tipsTitle}>Consejos de seguridad:</h4>
                            <ul className={cambiaStyles.tipsList}>
                                <li>Usa al menos 8 caracteres</li>
                                <li>Combina letras mayúsculas y minúsculas</li>
                                <li>Incluye números y símbolos</li>
                                <li>Evita información personal obvia</li>
                                <li>No reutilices contraseñas</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className={cambiaStyles.bottomNote}>
                        <p>Sistema de Gestión Académica</p>
                    </div>
                </div>

                {/* Panel derecho - formulario */}
                <div className={cambiaStyles.rightPanel}>
                    <Link to="/login" className={cambiaStyles.backButton}>
                        <FaArrowLeft /> <span>Volver</span>
                    </Link>

                    {changeSuccess ? (
                        <div className={cambiaStyles.successContainer}>
                            <div className={cambiaStyles.successIcon}>
                                <FaCheckCircle />
                            </div>
                            <h2 className={cambiaStyles.successTitle}>¡Contraseña actualizada!</h2>
                            <p className={cambiaStyles.successMessage}>
                                Tu contraseña ha sido cambiada correctamente.
                                Serás redirigido a la página de inicio de sesión en unos segundos...
                            </p>
                            <Button 
                                onClick={() => navigate('/login')} 
                                className={cambiaStyles.loginButton}
                            >
                                Ir al inicio de sesión
                            </Button>
                        </div>
                    ) : (
                        <div className={cambiaStyles.formContainer}>
                            <div className={cambiaStyles.formHeader}>
                                <div className={cambiaStyles.iconContainer}>
                                    <FaShieldAlt />
                                </div>
                                <div>
                                    <h2 className={cambiaStyles.formTitle}>Cambiar contraseña</h2>
                                    <p className={cambiaStyles.formSubtitle}>Actualiza tu información de seguridad</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className={cambiaStyles.passwordForm}>
                                <div className={cambiaStyles.inputGroup}>
                                    <label htmlFor="username">Usuario</label>
                                    <div className={cambiaStyles.inputWithIcon}>
                                        <FaUser className={cambiaStyles.inputIcon} />
                                        <input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={cambiaStyles.formInput}
                                            placeholder="Ingresa tu nombre de usuario"
                                            required
                                            autoComplete="username"
                                        />
                                    </div>
                                </div>

                                <div className={cambiaStyles.inputGroup}>
                                    <label htmlFor="current-password">Contraseña actual</label>
                                    <div className={cambiaStyles.passwordContainer}>
                                        <div className={cambiaStyles.inputWithIcon}>
                                            <FaLock className={cambiaStyles.inputIcon} />
                                            <input
                                                id="current-password"
                                                type={showCurrent ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className={cambiaStyles.formInput}
                                                placeholder="Ingresa tu contraseña actual"
                                                required
                                                autoComplete="current-password"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className={cambiaStyles.togglePassword}
                                            onClick={() => setShowCurrent(v => !v)}
                                            aria-label={showCurrent ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showCurrent ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div className={cambiaStyles.inputGroup}>
                                    <label htmlFor="new-password">Nueva contraseña</label>
                                    <div className={cambiaStyles.passwordContainer}>
                                        <div className={cambiaStyles.inputWithIcon}>
                                            <FaLock className={cambiaStyles.inputIcon} />
                                            <input
                                                id="new-password"
                                                type={showNew ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className={`${cambiaStyles.formInput} ${newPassword && !passwordStrong ? cambiaStyles.inputError : ''}`}
                                                placeholder="Ingresa tu nueva contraseña"
                                                required
                                                autoComplete="new-password"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className={cambiaStyles.togglePassword}
                                            onClick={() => setShowNew(v => !v)}
                                            aria-label={showNew ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showNew ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {newPassword && !passwordStrong && (
                                        <p className={cambiaStyles.errorText}>La contraseña debe tener al menos 6 caracteres</p>
                                    )}
                                </div>

                                <div className={cambiaStyles.inputGroup}>
                                    <label htmlFor="confirm-password">Confirmar contraseña</label>
                                    <div className={cambiaStyles.passwordContainer}>
                                        <div className={cambiaStyles.inputWithIcon}>
                                            <FaLock className={cambiaStyles.inputIcon} />
                                            <input
                                                id="confirm-password"
                                                type={showConfirm ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`${cambiaStyles.formInput} ${confirmPassword && !passwordsMatch ? cambiaStyles.inputError : ''}`}
                                                placeholder="Confirma tu nueva contraseña"
                                                required
                                                autoComplete="new-password"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className={cambiaStyles.togglePassword}
                                            onClick={() => setShowConfirm(v => !v)}
                                            aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {confirmPassword && !passwordsMatch && (
                                        <p className={cambiaStyles.errorText}>Las contraseñas no coinciden</p>
                                    )}
                                </div>

                                {error && <div className={cambiaStyles.errorAlert}>{error}</div>}

                                <button 
                                    type="submit" 
                                    className={cambiaStyles.submitButton}
                                    disabled={loading || !passwordsMatch || !passwordStrong}
                                >
                                    {loading ? 'Procesando...' : 'Cambiar contraseña'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
