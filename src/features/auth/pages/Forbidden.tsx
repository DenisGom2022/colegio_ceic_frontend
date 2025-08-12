import { Link } from "react-router-dom";

const Forbidden = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            color: '#1e293b',
        }}>
            <h1 style={{ fontSize: 48, fontWeight: 700, color: '#111827', marginBottom: 16 }}>403</h1>
            <h2 style={{ fontSize: 32, marginBottom: 8 }}>Acceso denegado</h2>
            <p>No tienes permiso para acceder a este recurso.</p>
            <Link to="/login" style={{ marginTop: 24, color: '#2563eb', textDecoration: 'underline', fontWeight: 500 }}>
                Ir al login
            </Link>
        </div>
    );
};

export default Forbidden;
