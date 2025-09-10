import { useEffect, useState } from "react"
import { getAllMisCursos } from "../services/MisCursosService";
import type { Curso } from "../../../interfaces/interfaces";

export const useListMisCursos = () => {
    const [misCursos, setMisCursos] = useState<Curso[]|null>(null);
    const [esCatedratico, setEsCatedratico] = useState<Boolean>(false);
    const [loading, setLoading] = useState<Boolean>(false);
    const [error, setError] = useState<String|null>(null);

    useEffect(()=> {
        getAllCursos();
    }, []);
    
    const getAllCursos = async () => {
        try{
            setError(null);
            setLoading(true);
            const { cursos, esCatedratico } = await getAllMisCursos();
            setMisCursos(cursos);
            setEsCatedratico(esCatedratico);
        }catch(error:any){
            setError(error);
        }finally{
            setLoading(false);
        }
    }

    return {
        misCursos,
        esCatedratico,
        error,
        loading
    }
    
}