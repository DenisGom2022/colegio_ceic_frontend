import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode; role?: string }) {  
    const { evaluado, usuario } = useAuth();
    
    if (!evaluado) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column',
                background: '#f5f7fa'
            }}>
                <div style={{ marginBottom: '20px' }}>Cargando...</div>
                <div 
                    style={{ 
                        width: '50px', 
                        height: '50px', 
                        border: '5px solid #f3f3f3',
                        borderTop: '5px solid #3b82f6', 
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}
                />
                <style>
                    {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    `}
                </style>
            </div>
        );
    }
    
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
}
