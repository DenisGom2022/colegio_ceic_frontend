import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAlumno } from '../../hooks/useAlumno';
import { useEditarAlumno } from '../../hooks/useEditarAlumno';
import type { AlumnoUpdateData } from '../../services/alumnoService';
import styles from './EditarAlumno.module.css';
import FloatingNotification from '../../components/FloatingNotification/FloatingNotification';
import { FaUserEdit, FaArrowLeft, FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const EditarAlumno = () => {
  const { cui } = useParams<{ cui: string }>();
  const navigate = useNavigate();
  
  // Estado para controlar la carga inicial
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Hook para obtener datos del alumno
  const { alumno, loading: loadingAlumno, fetchAlumno } = useAlumno();
  
  // Estado para el formulario
  const [formData, setFormData] = useState<AlumnoUpdateData>({
    cui: '',
    primerNombre: '',
    segundoNombre: '',
    tercerNombre: '',
    primerApellido: '',
    segundoApellido: '',
    telefono: '',
    genero: 'M',
    responsables: []
  });
  
  // Estados para manejar notificaciones y errores
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar datos del alumno cuando se monta el componente
  // Referencia para rastrear si el componente está montado
  const isMounted = useRef(true);

  // Limpiar referencia cuando el componente se desmonta
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Cargar datos del alumno cuando se monta el componente - una sola vez
  useEffect(() => {
    const cargarAlumno = async () => {
      if (!cui) {
        console.log('No se proporcionó CUI');
        return;
      }
      
      // Evitar múltiples llamadas mientras está cargando
      if (isLoading || loadingAlumno) {
        console.log('Ya está cargando datos, evitando llamada redundante');
        return;
      }
      
      console.log(`Cargando datos del alumno con CUI: ${cui}`);
      setIsLoading(true);
      try {
        await fetchAlumno(cui);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    cargarAlumno();
    // Eliminamos loadingAlumno del array de dependencias para evitar loops
  }, [cui, fetchAlumno, isLoading]);
  
  // Actualizar el formulario cuando se cargan los datos del alumno
  useEffect(() => {
    if (alumno) {
      console.log('Datos del alumno recibidos:', alumno);
      
      // Asegurarse de que todos los campos necesarios estén presentes
      const formDataUpdated = {
        cui: alumno.cui || '',
        primerNombre: alumno.primerNombre || '',
        segundoNombre: alumno.segundoNombre || '',
        tercerNombre: alumno.tercerNombre || '',
        primerApellido: alumno.primerApellido || '',
        segundoApellido: alumno.segundoApellido || '',
        telefono: alumno.telefono || '',
        genero: (alumno.genero === 'F' ? 'F' : 'M') as 'M' | 'F',
        responsables: alumno.responsables?.map(resp => ({
          idResponsable: resp.idResponsable || '',
          primerNombre: resp.primerNombre || '',
          segundoNombre: resp.segundoNombre || '',
          tercerNombre: resp.tercerNombre || '',
          primerApellido: resp.primerApellido || '',
          segundoApellido: resp.segundoApellido || '',
          telefono: resp.telefono || '',
          idParentesco: resp.parentesco?.id || 0
        })) || []
      };
      
      console.log('Actualizando formulario con datos:', formDataUpdated);
      setFormData(formDataUpdated);
    } else {
      console.log('No se recibieron datos del alumno');
    }
  }, [alumno]);
  
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
  };
  
  // Manejar los cambios en los responsables
  const handleResponsableChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si hay alguna notificación de error, la limpiamos
    if (showNotification) {
        setShowNotification(false);
        setErrorMessage("");
    }
    
    setFormData(prev => {
      const updatedResponsables = [...(prev.responsables || [])];
      
      updatedResponsables[index] = {
        ...updatedResponsables[index],
        [name]: name === 'idParentesco' ? parseInt(value, 10) : value
      };
      
      return {
        ...prev,
        responsables: updatedResponsables
      };
    });
  };
  
  // Añadir un nuevo responsable
  const addResponsable = () => {
    setFormData(prev => ({
      ...prev,
      responsables: [
        ...(prev.responsables || []),
        {
          idResponsable: '',
          primerNombre: '',
          segundoNombre: '',
          tercerNombre: '',
          primerApellido: '',
          segundoApellido: '',
          telefono: '',
          idParentesco: 1 // Valor por defecto
        }
      ]
    }));
  };
  
  // Eliminar un responsable
  const removeResponsable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsables: prev.responsables?.filter((_, i) => i !== index)
    }));
  };
  
  // Hook para editar alumno - sacándolo fuera de la función submit para evitar problemas de re-creación
  const { editarAlumno, loading: loadingEditar, error: hookError } = useEditarAlumno();

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Evitar múltiples envíos simultáneos
    if (submitting || loadingEditar) {
        console.log('Ya hay una operación en proceso');
        return;
    }
    
    try {
        setSubmitting(true);
        setError(null);
        setErrorMessage("");
        setShowNotification(false);
        setSuccess(false);
        
        console.log('Enviando datos de actualización:', formData);
        
        // Validar campos obligatorios
        if (!formData.primerNombre || !formData.primerApellido || !formData.cui) {
            throw new Error('Debes completar todos los campos obligatorios.');
        }
        
        // Validar que cada responsable tenga los campos obligatorios
        if (formData.responsables?.length) {
            for (const resp of formData.responsables) {
                if (!resp.idResponsable || !resp.primerNombre || !resp.primerApellido || !resp.telefono) {
                    throw new Error('Todos los responsables deben tener ID, primer nombre, primer apellido y teléfono.');
                }
            }
        }
        
        try {
            await editarAlumno(formData);
            
            // Si llega aquí, la operación fue exitosa
            setSuccess(true);
            setShowNotification(true);
            setErrorMessage("");
            
            // Redirigir después de un tiempo
            setTimeout(() => {
                navigate(`/admin/alumno/${cui}`);
            }, 1500);
        } catch (apiError: any) {
            // El hook ahora re-lanza el error para que lo capturemos aquí
            console.error('Error desde API:', apiError);
            
            // Extraer el mensaje de error del backend
            let errorMsg = 'Error al actualizar el alumno';
            
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
        console.error('Error al actualizar el alumno:', err);
        
        const errorMsg = err.message || 'Error al actualizar el alumno';
        
        setError(errorMsg);
        setErrorMessage(errorMsg);
        setShowNotification(true); // Asegurar que la notificación se muestra
        setSuccess(false);
    } finally {
        setSubmitting(false);
    }
  };
  
  if (loadingAlumno) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando datos del alumno...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.editContainer}>
      {/* Encabezado con navegación */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to="/admin/alumnos" className={styles.breadcrumbLink}>Alumnos</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          {alumno && (
            <>
              <Link 
                to={`/admin/alumno/${alumno.cui}`} 
                className={styles.breadcrumbLink}
              >
                Detalle de {alumno.primerNombre} {alumno.primerApellido}
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
            </>
          )}
          <span className={styles.breadcrumbCurrent}>Editar alumno</span>
        </div>
        
        <Link to="/admin/alumnos" className={styles.buttonReturn}>
          <FaArrowLeft size={14} />
          Volver a la lista
        </Link>
      </div>
      
      <div className={styles.editCard}>
        <div className={styles.cardHeader}>
          <div className={styles.headerIcon}>
            <FaUserEdit />
          </div>
          <h1 className={styles.cardTitle}>Editar Alumno</h1>
        </div>

        {success && (
          <div className={styles.successMessage}>
            <p>Alumno actualizado correctamente. Redirigiendo...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Información Personal</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="cui" className={styles.inputLabel}>
                  CUI / DPI (Obligatorio)
                </label>
                <input
                  type="text"
                  id="cui"
                  name="cui"
                  className={styles.inputField}
                  value={formData.cui}
                  onChange={handleChange}
                  disabled={true}
                  title="El CUI no puede ser modificado ya que es la llave primaria"
                />
                <div className={styles.inputHelp}>El CUI no puede ser modificado ya que es la llave primaria</div>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="primerNombre" className={styles.inputLabel}>
                  Primer Nombre (Obligatorio)
                </label>
                <input
                  type="text"
                  id="primerNombre"
                  name="primerNombre"
                  className={styles.inputField}
                  value={formData.primerNombre}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="segundoNombre" className={styles.inputLabel}>
                  Segundo Nombre
                </label>
                <input
                  type="text"
                  id="segundoNombre"
                  name="segundoNombre"
                  className={styles.inputField}
                  value={formData.segundoNombre || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="tercerNombre" className={styles.inputLabel}>
                  Tercer Nombre
                </label>
                <input
                  type="text"
                  id="tercerNombre"
                  name="tercerNombre"
                  className={styles.inputField}
                  value={formData.tercerNombre || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="primerApellido" className={styles.inputLabel}>
                  Primer Apellido (Obligatorio)
                </label>
                <input
                  type="text"
                  id="primerApellido"
                  name="primerApellido"
                  className={styles.inputField}
                  value={formData.primerApellido}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="segundoApellido" className={styles.inputLabel}>
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  id="segundoApellido"
                  name="segundoApellido"
                  className={styles.inputField}
                  value={formData.segundoApellido || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="telefono" className={styles.inputLabel}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  className={styles.inputField}
                  value={formData.telefono || ''}
                  onChange={handleChange}
                  placeholder="Ej: 55551234"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="genero" className={styles.inputLabel}>
                  Género (Obligatorio)
                </label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Sección de Responsables */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Responsables</h2>
              <button
                type="button"
                className={styles.addButton}
                onClick={addResponsable}
              >
                <FaPlus size={14} style={{ marginRight: '5px' }} />
                Añadir Responsable
              </button>
            </div>
            
            {formData.responsables && formData.responsables.length === 0 && (
              <div className={styles.emptyState}>
                <p>No se ha agregado ningún responsable.</p>
                <button
                  type="button"
                  className={styles.addButtonLarge}
                  onClick={addResponsable}
                >
                  <FaPlus size={16} style={{ marginRight: '8px' }} />
                  Agregar Responsable
                </button>
              </div>
            )}
            
            {formData.responsables && formData.responsables.map((responsable, index) => (
              <div key={index} className={styles.responsableCard}>
                <div className={styles.responsableHeader}>
                  <h3 className={styles.responsableTitle}>Responsable #{index + 1}</h3>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => removeResponsable(index)}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor={`idResponsable-${index}`} className={styles.inputLabel}>
                      ID/DPI (Obligatorio)
                    </label>
                    <input
                      type="text"
                      id={`idResponsable-${index}`}
                      name="idResponsable"
                      value={responsable.idResponsable || ''}
                      onChange={(e) => handleResponsableChange(index, e)}
                      className={styles.inputField}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor={`primerNombre-${index}`} className={styles.inputLabel}>
                      Primer Nombre (Obligatorio)
                    </label>
                    <input
                      type="text"
                      id={`primerNombre-${index}`}
                      name="primerNombre"
                      value={responsable.primerNombre || ''}
                      onChange={(e) => handleResponsableChange(index, e)}
                      className={styles.inputField}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor={`segundoNombre-${index}`} className={styles.inputLabel}>
                      Segundo Nombre
                    </label>
                    <input
                      type="text"
                      id={`segundoNombre-${index}`}
                      name="segundoNombre"
                      value={responsable.segundoNombre || ''}
                      onChange={(e) => handleResponsableChange(index, e)}
                      className={styles.inputField}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor={`tercerNombre-${index}`} className={styles.inputLabel}>
                      Tercer Nombre
                    </label>
                    <input
                      type="text"
                      id={`tercerNombre-${index}`}
                      name="tercerNombre"
                      value={responsable.tercerNombre || ''}
                      onChange={(e) => handleResponsableChange(index, e)}
                      className={styles.inputField}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor={`primerApellido-${index}`} className={styles.inputLabel}>
                      Primer Apellido (Obligatorio)
                    </label>
                    <input
                      type="text"
                      id={`primerApellido-${index}`}
                      name="primerApellido"
                      value={responsable.primerApellido || ''}
                      onChange={(e) => handleResponsableChange(index, e)}
                      className={styles.inputField}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor={`segundoApellido-${index}`} className={styles.inputLabel}>
                      Segundo Apellido
                    </label>
                    <input
                      type="text"
                      id={`segundoApellido-${index}`}
                      name="segundoApellido"
                      value={responsable.segundoApellido || ''}
                      onChange={(e) => handleResponsableChange(index, e)}
                      className={styles.inputField}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor={`telefono-${index}`} className={styles.inputLabel}>
                      Teléfono (Obligatorio)
                    </label>
                    <input
                      type="tel"
                      id={`telefono-${index}`}
                      name="telefono"
                      value={responsable.telefono || ''}
                      onChange={(e) => handleResponsableChange(index, e)}
                      className={styles.inputField}
                      required
                      placeholder="Ej: 55551234"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor={`idParentesco-${index}`} className={styles.inputLabel}>
                      Parentesco (Obligatorio)
                    </label>
                    <select
                      id={`idParentesco-${index}`}
                      name="idParentesco"
                      value={responsable.idParentesco || 1}
                      onChange={(e) => handleResponsableChange(index, e)}
                      className={styles.inputField}
                      required
                    >
                      <option value={1}>Padre</option>
                      <option value={2}>Madre</option>
                      <option value={3}>Abuelo</option>
                      <option value={4}>Abuela</option>
                      <option value={5}>Tío</option>
                      <option value={6}>Tía</option>
                      <option value={7}>Hermano</option>
                      <option value={8}>Hermana</option>
                      <option value={9}>Tutor Legal</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Botones de acción */}
          <div className={styles.formActions}>
            <Link 
              to={alumno ? `/admin/alumno/${alumno.cui}` : '/admin/alumnos'} 
              className={styles.buttonCancel}
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className={styles.buttonSave}
              disabled={submitting || loadingEditar}
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
          message={errorMessage || "Alumno actualizado correctamente."}
          type={errorMessage ? "error" : "success"}
          title={errorMessage ? "Error" : "Éxito"}
          onClose={() => setShowNotification(false)}
          autoCloseTime={errorMessage ? 8000 : 5000} // Más tiempo para leer errores
        />
      )}
    </div>
  );
};

export default EditarAlumno;
