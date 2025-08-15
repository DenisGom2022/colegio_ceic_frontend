import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { actualizarGrado, type ActualizarGradoDTO } from '../services/gradoService';

export const useEditarGrado = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const editarGrado = useCallback(async (gradoData: ActualizarGradoDTO) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await actualizarGrado(gradoData);
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el grado');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSuccess = useCallback(() => {
    // Mostrar mensaje de éxito temporalmente y navegar a la página de detalles
    setTimeout(() => {
      navigate('/admin/grados');
    }, 2000);
  }, [navigate]);

  return {
    editarGrado,
    loading,
    error,
    success,
    handleSuccess
  };
};
