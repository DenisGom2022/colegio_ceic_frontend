import { useState } from 'react';
import { eliminarUsuario as eliminarUsuarioService } from '../services/userService';

export const useEliminarUsuario = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const eliminarUsuario = async (usuario: string) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            await eliminarUsuarioService(usuario);
            setSuccess(true);
            return true;
        } catch (err: any) {
            setError(err.message || 'Error al eliminar el usuario');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        eliminarUsuario,
        isLoading,
        error,
        success
    };
};
