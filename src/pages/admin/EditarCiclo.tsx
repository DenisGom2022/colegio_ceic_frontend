import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDetalleCiclo } from '../../hooks/useDetalleCiclo';
import { useEditarCiclo } from '../../hooks/useEditarCiclo';
import styles from './EditarCiclo.module.css';
import FloatingNotification from '../../components/FloatingNotification/FloatingNotification';
import { FaCalendarAlt, FaArrowLeft, FaSave } from 'react-icons/fa';
import type { CicloUpdateData } from '../../services/cicloService';

const EditarCiclo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cicloId = id ? parseInt(id, 10) : 0;
  
  // Estado para controlar la carga inicial
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Hook para obtener datos del ciclo
  const { ciclo, loading: loadingCiclo, recargarDatos: recargarCiclo } = useDetalleCiclo(cicloId);
  
  // Estado para el formulario
  const [formData, setFormData] = useState<CicloUpdateData>({
    id: cicloId,
    descripcion: ''
  });

  // Estado para validación de formulario
  const [touched, setTouched] = useState<{ descripcion: boolean }>({
    descripcion: false
  });
  
  // Estados para manejar notificaciones y errores
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Referencia para rastrear si el componente está montado
  const isMounted = useRef(true);

  // Limpiar referencia cuando el componente se desmonta
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Cargar datos del ciclo cuando se monta el componente - una sola vez
  useEffect(() => {
    const cargarCiclo = async () => {
      if (!cicloId) {
        console.log('No se proporcionó ID');
        return;
      }
      
      // Evitar múltiples llamadas mientras está cargando
      if (isLoading || loadingCiclo) {
        console.log('Ya está cargando datos, evitando llamada redundante');
        return;
      }
      
      console.log(`Cargando datos del ciclo con ID: ${cicloId}`);
      setIsLoading(true);
      try {
        await recargarCiclo();
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    cargarCiclo();
    // Eliminamos loadingCiclo del array de dependencias para evitar loops
  }, [cicloId, recargarCiclo, isLoading]);
  
  // Actualizar el formulario cuando se cargan los datos del ciclo
  useEffect(() => {
    if (ciclo) {
      console.log('Datos del ciclo recibidos:', ciclo);
      
      // Actualizar el formulario con los datos recibidos
      setFormData({
        id: ciclo.id,
        descripcion: ciclo.descripcion || ''
      });
    } else {
      console.log('No se recibieron datos del ciclo');
    }
  }, [ciclo]);
  
  // Actualizar el estado del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si hay alguna notificación de error, la limpiamos
    if (showNotification) {
        setShowNotification(false);
        setErrorMessage("");
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Marcar campo como tocado
    if (name === 'descripcion') {
      setTouched(prev => ({ ...prev, descripcion: true }));
    }
  };
  
  // Hook para editar ciclo - sacándolo fuera de la función submit para evitar problemas de re-creación
  const { editarCiclo, loading: loadingEditar } = useEditarCiclo();

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Evitar múltiples envíos simultáneos
    if (submitting || loadingEditar) {
        console.log('Ya hay una operación en proceso');
        return;
    }
    
    // Marcar campos como tocados para validación
    setTouched({ descripcion: true });
    
    try {
        setSubmitting(true);
        setErrorMessage("");
        setShowNotification(false);
        setSuccess(false);
        
        console.log('Enviando datos de actualización:', formData);
        
        // Validar campos obligatorios
        if (!formData.descripcion) {
            throw new Error('La descripción es obligatoria.');
        }
        
        try {
            await editarCiclo(formData);
            
            // Si llega aquí, la operación fue exitosa
            setSuccess(true);
            setShowNotification(true);
            setErrorMessage("");
            
            // Redirigir después de un tiempo
            setTimeout(() => {
                navigate(`/admin/ciclo/${cicloId}`);
            }, 1500);
        } catch (apiError: any) {
            // El hook ahora re-lanza el error para que lo capturemos aquí
            console.error('Error desde API:', apiError);
            
            // Extraer el mensaje de error del backend
            let errorMsg = 'Error al actualizar el ciclo';
            
            // Manejar diferentes formatos de respuesta de error
            if (apiError.response?.data?.message) {
                errorMsg = apiError.response.data.message;
            } else if (apiError.response?.data?.error) {
                errorMsg = apiError.response.data.error;
            } else if (apiError.response?.data) {
                // Si es un objeto, intentar convertirlo a string
                if (typeof apiError.response.data === 'object') {
                    errorMsg = JSON.stringify(apiError.response.data);
                } else {
                    errorMsg = String(apiError.response.data);
                }
            } else if (apiError.message) {
                errorMsg = apiError.message;
            }
            
            throw new Error(errorMsg);
        }
    } catch (err: any) {
        console.error('Error al actualizar el ciclo:', err);
        
        const errorMsg = err.message || 'Error al actualizar el ciclo';
        
        setErrorMessage(errorMsg);
        setShowNotification(true); // Asegurar que la notificación se muestra
        setSuccess(false);
    } finally {
        setSubmitting(false);
    }
  };
  
  if (loadingCiclo) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando datos del ciclo...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.editContainer}>
      {/* Encabezado con navegación */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to="/admin/ciclos" className={styles.breadcrumbLink}>Ciclos</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          {ciclo && (
            <>
              <Link 
                to={`/admin/ciclo/${ciclo.id}`} 
                className={styles.breadcrumbLink}
              >
                Detalle de {ciclo.descripcion}
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
            </>
          )}
          <span className={styles.breadcrumbCurrent}>Editar ciclo</span>
        </div>
        
        <Link to="/admin/ciclos" className={styles.buttonReturn}>
          <FaArrowLeft size={14} />
          Volver a la lista
        </Link>
      </div>
      
      <div className={styles.editCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerIcon}>
            <FaCalendarAlt />
          </div>
          <h1 className={styles.cardTitle}>Editar Ciclo</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Información del Ciclo</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="id" className={styles.inputLabel}>
                  ID
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  className={styles.inputField}
                  value={formData.id}
                  disabled={true}
                  title="El ID no puede ser modificado ya que es la llave primaria"
                />
                <div className={styles.inputHelp}>El ID no puede ser modificado ya que es la llave primaria</div>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="descripcion" className={styles.inputLabel}>
                  Descripción (Obligatorio)
                </label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  className={`${styles.inputField} ${touched.descripcion && !formData.descripcion ? styles.inputError : ''}`}
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Ciclo Escolar 2025"
                />
                {touched.descripcion && !formData.descripcion && (
                  <div className={styles.errorMessage}>La descripción es obligatoria</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className={styles.formActions}>
            <Link 
              to={ciclo ? `/admin/ciclo/${ciclo.id}` : '/admin/ciclos'} 
              className={styles.buttonCancel}
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className={styles.buttonSave}
              disabled={submitting || loadingEditar || !formData.descripcion}
            >
              {(submitting || loadingEditar) ? (
                <>
                  <div className={styles.spinnerSmall}></div>
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave size={14} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Notificación de éxito o error */}
      {showNotification && (
        <FloatingNotification
          message={errorMessage || "Ciclo actualizado correctamente."}
          type={errorMessage ? "error" : "success"}
          title={errorMessage ? "Error" : "Éxito"}
          onClose={() => setShowNotification(false)}
          autoCloseTime={errorMessage ? 8000 : 5000} // Más tiempo para leer errores
        />
      )}
    </div>
  );
};

export default EditarCiclo;
