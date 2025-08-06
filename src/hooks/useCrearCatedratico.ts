import { useState } from "react";
import { createCatedratico } from "../services/catedraticoService";

export interface CrearCatedraticoParams {
  dpi: string;
  idUsuario: string;
}

export const useCrearCatedratico = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearNuevoCatedratico = async (datos: CrearCatedraticoParams): Promise<{
    success: boolean;
    errorMessage?: string;
    data?: any;
  }> => {
    setLoading(true);
    setError(null);
    try {
      const response = await createCatedratico(datos);
      return {
        success: true,
        data: response
      };
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || "Error al crear catedrático";
      setError(errorMessage);
      return {
        success: false,
        errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return { crearNuevoCatedratico, loading, error };
};
