import { useState } from "react";
import { TareasAlumnoService } from "../services/TareasAlumnoService";

interface CreateTareaBody {
  idTarea: number;
  idAsignacionAlumno: number;
  fechaEntrega: string;
  puntoObtenido: number;
}

interface CreateTareaResult {
  message: string;
  tareaAlumno?: any;
}

export function useCreateTareaAlumno() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateTareaResult | null>(null);


  const createTarea = async (body: CreateTareaBody) => {
    setLoading(true);
    setError(null);
    try {
      const res = await TareasAlumnoService.createTarea(body);
      setResult(res);
      return res;
    } catch (err: any) {
      // Si el backend responde con status > 400 y trae message, mostrar ese mensaje
      const backendMsg = err?.response?.data?.message;
      setError(backendMsg || err?.message || "Error desconocido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTarea, loading, error, result };
}
