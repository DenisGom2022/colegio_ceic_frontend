import { FaUsersCog, FaChalkboardTeacher, FaBook, FaCalendarAlt, FaChartLine, FaBell, FaGraduationCap, FaUserTie } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    
    const cards = [
        {
            title: 'Gestión de Usuarios',
            description: 'Administre usuarios, asigne roles y gestione permisos',
            icon: <FaUsersCog size={24} color="#ffffff" />,
            color: '#3B82F6',
            link: '/admin/usuarios',
            priority: 'high'
        },
        {
            title: 'Gestión de Catedráticos',
            description: 'Administre a los docentes y asigne materias',
            icon: <FaUserTie size={24} color="#ffffff" />,
            color: '#8B5CF6',
            link: '/admin/catedraticos',
            priority: 'high'
        },
        {
            title: 'Gestión de Cursos',
            description: 'Cree, edite y administre los cursos del colegio',
            icon: <FaChalkboardTeacher size={24} color="#ffffff" />,
            color: '#10B981',
            link: '/admin/cursos',
            priority: 'medium'
        },
        {
            title: 'Materias',
            description: 'Configure las materias y asigne profesores',
            icon: <FaBook size={24} color="#ffffff" />,
            color: '#F59E0B',
            link: '/admin/materias',
            priority: 'medium'
        },
        {
            title: 'Estudiantes',
            description: 'Administre los estudiantes matriculados',
            icon: <FaGraduationCap size={24} color="#ffffff" />,
            color: '#EC4899',
            link: '/admin/estudiantes',
            priority: 'medium'
        },
        {
            title: 'Calendario Escolar',
            description: 'Gestione eventos, días festivos y horarios',
            icon: <FaCalendarAlt size={24} color="#ffffff" />,
            color: '#6366F1',
            link: '/admin/calendario',
            priority: 'low'
        },
        {
            title: 'Reportes y Estadísticas',
            description: 'Visualice informes y métricas del colegio',
            icon: <FaChartLine size={24} color="#ffffff" />,
            color: '#2DD4BF',
            link: '/admin/reportes',
            priority: 'low'
        }
    ];

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Panel de Administración</h1>
                    <p className={styles.subtitle}>
                        Bienvenido, {user?.primerNombre} {user?.primerApellido}. Gestione todos los aspectos del colegio desde este panel.
                    </p>
                </div>
                <div className={styles.notificationContainer}>
                    <button className={styles.notificationButton}>
                        <FaBell size={18} />
                        <span className={styles.notificationBadge}>3</span>
                    </button>
                </div>
            </div>

            {/* Sección de Tarjetas Destacadas */}
            <div className={styles.sectionTitle}>
                <h2>Administración Principal</h2>
                <p>Acceda a las funciones más utilizadas</p>
            </div>

            <div className={styles.featuredCards}>
                {cards
                  .filter(card => card.priority === 'high')
                  .map((card, index) => (
                    <Link to={card.link} key={index} className={styles.cardLink}>
                        <div className={styles.featuredCard} style={{ borderTop: `4px solid ${card.color}` }}>
                            <div className={styles.cardIcon} style={{ background: card.color }}>
                                {card.icon}
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{card.title}</h3>
                                <p className={styles.cardDescription}>{card.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className={styles.sectionTitle}>
                <h2>Todas las Funciones</h2>
                <p>Explore todas las herramientas administrativas</p>
            </div>

            <div className={styles.cardsGrid}>
                {cards
                  .filter(card => card.priority !== 'high')
                  .map((card, index) => (
                    <Link to={card.link} key={index} className={styles.cardLink}>
                        <div className={styles.card}>
                            <div className={styles.cardIcon} style={{ background: card.color }}>
                                {card.icon}
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{card.title}</h3>
                                <p className={styles.cardDescription}>{card.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Sección de Estadísticas Rápidas */}
            <div className={styles.statsSection}>
                <h2 className={styles.sectionTitle}>Estadísticas Rápidas</h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>152</div>
                        <div className={styles.statLabel}>Estudiantes</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>24</div>
                        <div className={styles.statLabel}>Catedráticos</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>18</div>
                        <div className={styles.statLabel}>Cursos</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>6</div>
                        <div className={styles.statLabel}>Eventos Próximos</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
