import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../hooks/useAuth";
import { RESPUESTA_USER } from "../../../enums/enums";
import { LockIcon } from "../../../icons/LockIcon";
import { UserIcon } from "../../../icons/UserIcon";
import styles from "./Login.module.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error } = useLogin();
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    // Navega a dashboard cuando usuario esté listo después de login
    useEffect(() => {
        if (!isLoading && user) {
            navigate("/dashboard");
        }
    }, [user, isLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const respuesta = await login(username, password);
        
        if (respuesta === RESPUESTA_USER.CAMBIA_PASSWORD) {
            return navigate({
                pathname: "/cambiaContrasena",
                search: `?username=${username}`
            });
        } else if (respuesta === RESPUESTA_USER.ERROR) {
            console.error("Error en el login");
            // El error ya se muestra en el componente
        }
    };

    return (
        <div className={styles.loginBg}>
            <div className={styles.leftPanel}>
                <h2>BIENVENIDO</h2>
                <h4 className={styles.subtitle}>COLEGIO CEIC</h4>
                <p>Accede al portal del Colegio CEIC para consultar tus calificaciones, tareas, avisos y mucho más. ¡Forma parte de nuestra comunidad educativa!</p>
            </div>
            <section className={styles.container}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoWrapper}>
                        <img src="/logo.png" alt="CEIC Logo" className={styles.logo} />
                        <h3 className={styles.logoText}>Colegio CEIC</h3>
                    </div>
                </div>
                
                <header className={styles.formHeader}>
                    <h1 className={styles.title}>Iniciar sesión</h1>
                    <p className={styles.subtitle}>Ingresa tus credenciales para acceder al sistema</p>
                </header>
                
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">Usuario</label>
                        <div className={styles.inputWithIcon}>
                            <UserIcon />
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Ingresa tu usuario"
                                className={styles.formInput}
                            />
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Contraseña</label>
                        <div className={styles.passwordContainer}>
                            <div className={styles.inputWithIcon}>
                                <LockIcon />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Ingresa tu contraseña"
                                    className={styles.formInput}
                                />
                            </div>
                            <button 
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(v => !v)}
                            >
                                {showPassword ? "OCULTAR" : "MOSTRAR"}
                            </button>
                        </div>
                    </div>
                    
                    <div className={styles.formOptions}>
                        <label className={styles.rememberMe}>
                            <input type="checkbox" /> Recuérdame
                        </label>
                        <a href="/reiniciar-contrasena" className={styles.forgotPassword}>¿Olvidaste tu contraseña?</a>
                    </div>
                    
                    {error && <div className={styles.error}>{error}</div>}
                    
                    <button 
                        type="submit"
                        className={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'Iniciar sesión'}
                    </button>
                </form>
                
                <div className={styles.footerInfo}>
                    <p>Sistema de Gestión Académica</p>
                    <p className={styles.footerCredit}>© 2025 Colegio CEIC</p>
                </div>
            </section>
        </div>
    );
}
