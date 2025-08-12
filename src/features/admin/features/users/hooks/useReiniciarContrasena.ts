import { useState } from 'react';
import { reiniciarContrasena } from '../services/userService';
import { CambiarContrasenaError } from '../errors';

export const useReiniciarContrasena = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const resetPassword = async (usuario: string, newContrasena: string) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const message = await reiniciarContrasena(usuario, newContrasena);
            setSuccess(true);
            return message;
        } catch (error) {
            if (error instanceof CambiarContrasenaError) {
                setError(error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Error al reiniciar la contraseña');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
    };

    return {
        loading,
        error,
        success,
        resetPassword,
        resetState
    };
};
