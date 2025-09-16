import { useState } from "react"
import { tareaSevice, type createTareaProps } from "../services/tareaService";

export const useCreateTarea = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);
    const [success, setSuccess] = useState(false);
    
    const createTarea = async (data:createTareaProps) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await tareaSevice.createTarea(data);
            setSuccess(true);
            return true;
        } catch (error:any) {
            const errorMessage = error?.response?.data?.message || error.message || "Error al crear la tarea";
            setError(errorMessage);
            setSuccess(false);
            throw error;
        }finally{
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        success,
        createTarea
    }
}