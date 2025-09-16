import { useState } from "react";
import { bimestreService } from "../services/bimestreService";

export const useModificaBimestre = () => {

    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const iniciarBimestre = async (idBimestre: number):Promise<any> => {
        setLoading(true);
        setError(null);
        try {
            await bimestreService.iniciarBimestre(idBimestre);
            return {success: true, error: ""};
        } catch (error:any) {
            const errorMessage = error?.response?.data?.message || error.message || "Error al iniciar bimestre";
            setError(errorMessage);
            return {success: false, error: errorMessage};;
        }finally {
            setLoading(false);
        }
    };

    const finalizarBimestre = async (idBimestre: number) => {
        setLoading(true);
        setError(null); 
        try {
            await bimestreService.finalizarBimestre(idBimestre);
            return {success: true, error: ""};
        } catch (error:any) {
            const errorMessage = error?.response?.data?.message || error.message || "Error al finalizar bimestre";
            setError(errorMessage);
            return {success: false, error: errorMessage};;
        }finally {
            setLoading(false);
        }
    };

    return {
        iniciarBimestre,
        finalizarBimestre,
        error,
        loading
    };
};