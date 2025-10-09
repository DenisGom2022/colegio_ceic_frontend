import { useState, useEffect } from "react";
import { asignacionesService } from "../services/asignacionesService";

/**
 * Hook para obtener una asignación de alumno específica por su ID
 * @param id ID de la asignación a consultar
 * @returns Objeto con la asignación, estado de carga y posible error
 */
export function useOneAsignacion(id: number | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Si no hay ID, no hacemos la petición
    if (id === null) return;

    const fetchAsignacion = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await asignacionesService.getAsignacionAlumno(id);
        setData(response);
      } catch (err) {
        setError(err);
        console.error("Error al obtener la asignación:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAsignacion();
  }, [id]);

  // Función para recargar los datos
  const recargarDatos = async () => {
    if (id === null) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await asignacionesService.getAsignacionAlumno(id);
      setData(response);
    } catch (err) {
      setError(err);
      console.error("Error al recargar la asignación:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    asignacion: data?.asignacion || null,
    loading,
    error,
    recargarDatos
  };
}
