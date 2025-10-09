import { useEffect, useState } from "react";
import { asignacionesService } from "../services/asignacionesService";

interface UseListAsignacionesOptions {
  page?: number;
  limit?: number;
  nombre?: string;
}

export function useListAsignaciones({ page = 1, limit = 5, nombre = "" }: UseListAsignacionesOptions = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    asignacionesService.getAsignacionesAlumno(page, limit, nombre)
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [page, limit, nombre]);

  return { data, loading, error };
}
