import { useState } from 'react';
import { editarUsuario } from '../services/userService';
import type { EditarUsuarioInt } from '../services/userService';

export const useEditarUsuario = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const updateUser = async (userData: EditarUsuarioInt) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const message = await editarUsuario(userData);
            setSuccess(true);
            return message;
        } catch (err:any) {
            setError(err?.response?.data?.message || err.message || 'Error al actualizar el usuario');
            throw err;
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
        updateUser,
        resetState
    };
};
