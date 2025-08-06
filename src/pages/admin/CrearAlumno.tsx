import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CrearAlumno.module.css';
import { 
  FaUser, 
  FaSave, 
  FaArrowLeft, 
  FaTimes, 
  FaPlus, 
  FaUsers,
  FaRedo
} from 'react-icons/fa';
import FloatingNotification from '../../components/FloatingNotification/FloatingNotification';
import { useCrearAlumno } from '../../hooks/useCrearAlumno';
import type { AlumnoData, Responsable } from '../../hooks/useCrearAlumno';
import { useTiposParentesco } from '../../hooks/useTiposParentesco';

const CrearAlumno: React.FC = () => {
  const { crearAlumno, loading } = useCrearAlumno();

  // Estado para el formulario de alumno
  const [formData, setFormData] = useState<AlumnoData>({
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

  // Estado para mensajes y notificaciones
  const [notificacion, setNotificacion] = useState<{
    mensaje: string;
    tipo: 'success' | 'error';
    visible: boolean;
  }>({
    mensaje: '',
    tipo: 'success',
    visible: false
  });

  // Estado para errores de validación
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error') => {
    setNotificacion({
      mensaje,
      tipo,
      visible: true
    });

    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      setNotificacion(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Estado para el modal de nuevo tipo de parentesco
  const [showNuevoParentescoModal, setShowNuevoParentescoModal] = useState<boolean>(false);
  const [nuevoParentescoNombre, setNuevoParentescoNombre] = useState<string>('');
  
  // Obtener tipos de parentesco usando el hook
  const { 
    tiposParentesco, 
    loading: loadingParentescos, 
    error: errorParentescos,
    crearNuevoTipoParentesco
  } = useTiposParentesco();

  // Referencia para controlar si ya se mostró la notificación de error
  const [errorNotificado, setErrorNotificado] = useState<boolean>(false);
  
  // Mostrar notificación si hay error en la carga de parentescos (solo una vez)
  React.useEffect(() => {
    if (errorParentescos && !errorNotificado) {
      mostrarNotificacion('Error al cargar tipos de parentesco', 'error');
      setErrorNotificado(true);
    }
  }, [errorParentescos, errorNotificado]);
  
  // Función para crear un nuevo tipo de parentesco
  const handleCrearParentesco = async () => {
    if (!nuevoParentescoNombre.trim()) {
      mostrarNotificacion('El nombre del parentesco no puede estar vacío', 'error');
      return;
    }
    
    try {
      const nuevoTipo = await crearNuevoTipoParentesco(nuevoParentescoNombre.trim());
      // Cerrar el modal antes de mostrar la notificación para evitar problemas de re-renderizado
      setShowNuevoParentescoModal(false);
      setNuevoParentescoNombre('');
      // Mostrar la notificación después de cerrar el modal
      setTimeout(() => {
        mostrarNotificacion(`Tipo de parentesco "${nuevoTipo.descripcion}" creado correctamente`, 'success');
      }, 100);
    } catch (error: any) {
      mostrarNotificacion(
        error.message || 'Error al crear el tipo de parentesco', 
        'error'
      );
      // Aún así cerramos el modal en caso de error para evitar que el usuario se quede atascado
      setShowNuevoParentescoModal(false);
      setNuevoParentescoNombre('');
    }
  };

  // Manejadores de cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Limpiar el error de este campo si existe
    if (errores[name]) {
      setErrores(prevErrores => {
        const newErrores = { ...prevErrores };
        delete newErrores[name];
        return newErrores;
      });
    }
  };

  // Agregar un nuevo responsable
  const agregarResponsable = () => {
    const nuevoResponsable: Responsable = {
      idResponsable: '',
      primerNombre: '',
      segundoNombre: '',
      tercerNombre: '',
      primerApellido: '',
      segundoApellido: '',
      telefono: '',
      idParentesco: tiposParentesco.length > 0 ? tiposParentesco[0].id : 1
    };

    setFormData(prevData => ({
      ...prevData,
      responsables: [...prevData.responsables, nuevoResponsable]
    }));
  };

  // Eliminar un responsable
  const eliminarResponsable = (index: number) => {
    setFormData(prevData => ({
      ...prevData,
      responsables: prevData.responsables.filter((_, i) => i !== index)
    }));
  };

  // Manejar cambios en los datos de responsables
  const handleResponsableChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    
    setFormData(prevData => {
      const nuevosResponsables = [...prevData.responsables];
      nuevosResponsables[index] = {
        ...nuevosResponsables[index],
        [name]: name === 'idParentesco' ? Number(value) : value
      };
      
      return {
        ...prevData,
        responsables: nuevosResponsables
      };
    });

    // Limpiar errores
    const errorKey = `responsable${index}.${name}`;
    if (errores[errorKey]) {
      setErrores(prevErrores => {
        const newErrores = { ...prevErrores };
        delete newErrores[errorKey];
        return newErrores;
      });
    }
  };

  // Validar el formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    // Validar campos del alumno
    if (!formData.cui) nuevosErrores.cui = 'El CUI es obligatorio';
    else if (formData.cui.length !== 13) nuevosErrores.cui = 'El CUI debe tener 13 dígitos';
    
    if (!formData.primerNombre) nuevosErrores.primerNombre = 'El primer nombre es obligatorio';
    if (!formData.primerApellido) nuevosErrores.primerApellido = 'El primer apellido es obligatorio';
    if (!formData.telefono) nuevosErrores.telefono = 'El teléfono es obligatorio';

    // Validar responsables
    formData.responsables.forEach((responsable, index) => {
      if (!responsable.idResponsable) 
        nuevosErrores[`responsable${index}.idResponsable`] = 'El DPI del responsable es obligatorio';
      else if (responsable.idResponsable.length !== 13)
        nuevosErrores[`responsable${index}.idResponsable`] = 'El DPI debe tener 13 dígitos';
      
      if (!responsable.primerNombre) 
        nuevosErrores[`responsable${index}.primerNombre`] = 'El primer nombre es obligatorio';
      
      if (!responsable.primerApellido) 
        nuevosErrores[`responsable${index}.primerApellido`] = 'El primer apellido es obligatorio';
      
      if (!responsable.telefono) 
        nuevosErrores[`responsable${index}.telefono`] = 'El teléfono es obligatorio';
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      mostrarNotificacion('Por favor, completa todos los campos obligatorios', 'error');
      return;
    }

    try {
      await crearAlumno(formData);
      // Restablecer el formulario a valores iniciales
      setFormData({
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
      // Limpiar errores
      setErrores({});
      // Mostrar notificación de éxito
      mostrarNotificacion('Alumno creado exitosamente. Puede agregar otro alumno.', 'success');
    } catch (error: any) {
      console.error('Error en la creación del alumno:', error);
      // Mostrar notificación de error
      mostrarNotificacion(
        error.message || 'Error al crear el alumno, intente nuevamente',
        'error'
      );
    }
  };

  return (
    <div className={styles.formContainer}>
      {notificacion.visible && (
        <FloatingNotification
          type={notificacion.tipo}
          title={notificacion.tipo === 'success' ? 'Éxito' : 'Error'}
          message={notificacion.mensaje}
          onClose={() => setNotificacion(prev => ({ ...prev, visible: false }))}
        />
      )}
      
      {/* Modal para nuevo tipo de parentesco */}
      {showNuevoParentescoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Nuevo Tipo de Parentesco</h3>
            
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Nombre del parentesco
                  <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="text"
                  value={nuevoParentescoNombre}
                  onChange={(e) => setNuevoParentescoNombre(e.target.value)}
                  className={styles.formInput}
                  placeholder="Ej. Tío/a, Abuelo/a, Tutor/a"
                  autoFocus
                />
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.buttonCancel}
                onClick={() => {
                  setShowNuevoParentescoModal(false);
                  setNuevoParentescoNombre('');
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.buttonSave}
                onClick={handleCrearParentesco}
                disabled={loadingParentescos}
              >
                {loadingParentescos ? (
                  <>
                    <div className={styles.loadingSpinner}></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave size={14} />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to="/admin/dashboard" className={styles.breadcrumbLink}>Dashboard</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link to="/admin/alumnos" className={styles.breadcrumbLink}>Alumnos</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Crear Alumno</span>
        </div>
        
        <Link to="/admin/alumnos" className={styles.buttonReturn}>
          <FaArrowLeft size={14} />
          Volver al listado
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Sección de Datos Personales */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerIcon}>
              <FaUser size={16} />
            </div>
            <h2 className={styles.cardTitle}>Nuevo Alumno</h2>
          </div>
          
          <div className={styles.form}>
            <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}><FaUser size={12} /></span>
              Datos Personales
            </h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  CUI / Código Único de Identificación
                  <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="text"
                  name="cui"
                  value={formData.cui}
                  onChange={handleChange}
                  className={`${styles.formInput} ${errores.cui ? styles.formInputError : ''}`}
                  placeholder="Ej. 1234567890123"
                  maxLength={13}
                />
                {errores.cui && <div className={styles.error}>{errores.cui}</div>}
                <div className={styles.formHint}>Ingrese los 13 dígitos sin guiones</div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Género
                  <span className={styles.requiredMark}>*</span>
                </label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className={styles.formSelect}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Teléfono
                  <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`${styles.formInput} ${errores.telefono ? styles.formInputError : ''}`}
                  placeholder="Ej. 55555555"
                />
                {errores.telefono && <div className={styles.error}>{errores.telefono}</div>}
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Primer Nombre
                  <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="text"
                  name="primerNombre"
                  value={formData.primerNombre}
                  onChange={handleChange}
                  className={`${styles.formInput} ${errores.primerNombre ? styles.formInputError : ''}`}
                  placeholder="Primer nombre"
                />
                {errores.primerNombre && <div className={styles.error}>{errores.primerNombre}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Segundo Nombre
                </label>
                <input
                  type="text"
                  name="segundoNombre"
                  value={formData.segundoNombre}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Segundo nombre"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Tercer Nombre
                </label>
                <input
                  type="text"
                  name="tercerNombre"
                  value={formData.tercerNombre}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Tercer nombre"
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Primer Apellido
                  <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  type="text"
                  name="primerApellido"
                  value={formData.primerApellido}
                  onChange={handleChange}
                  className={`${styles.formInput} ${errores.primerApellido ? styles.formInputError : ''}`}
                  placeholder="Primer apellido"
                />
                {errores.primerApellido && <div className={styles.error}>{errores.primerApellido}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  name="segundoApellido"
                  value={formData.segundoApellido}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Segundo apellido"
                />
              </div>
              
              <div className={styles.formGroup}>
                {/* Espacio vacío para mantener la alineación */}
              </div>
            </div>
          </div>

          {/* Sección de Responsables */}
          <div className={styles.formSection}>
            <div className={styles.responsableHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}><FaUsers size={12} /></span>
                Responsables
                <span className={styles.responsableCount}>{formData.responsables.length}</span>
              </h3>
              
              <button
                type="button"
                className={styles.buttonAddResponsable}
                onClick={agregarResponsable}
              >
                <FaPlus size={12} />
                Agregar Responsable
              </button>
            </div>

            {formData.responsables.length === 0 && (
              <div className={styles.emptyState}>
                No hay responsables registrados
                <span style={{ marginTop: '8px', fontWeight: 500 }}>
                  Haz clic en "Agregar Responsable" para comenzar
                </span>
              </div>
            )}

            {formData.responsables.map((responsable, index) => (
              <div key={index} className={styles.responsableItem}>
                <button
                  type="button"
                  className={styles.buttonRemoveResponsable}
                  onClick={() => eliminarResponsable(index)}
                  title="Eliminar responsable"
                >
                  <FaTimes size={14} />
                </button>

                <h4>Responsable #{index + 1}</h4>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      DPI / Documento Personal de Identificación
                      <span className={styles.requiredMark}>*</span>
                    </label>
                    <input
                      type="text"
                      name="idResponsable"
                      value={responsable.idResponsable}
                      onChange={(e) => handleResponsableChange(e, index)}
                      className={`${styles.formInput} ${
                        errores[`responsable${index}.idResponsable`] ? styles.formInputError : ''
                      }`}
                      placeholder="Ej. 1234567890123"
                      maxLength={13}
                    />
                    {errores[`responsable${index}.idResponsable`] && (
                      <div className={styles.error}>{errores[`responsable${index}.idResponsable`]}</div>
                    )}
                    <div className={styles.formHint}>Ingrese los 13 dígitos sin guiones</div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Parentesco
                      <span className={styles.requiredMark}>*</span>
                    </label>
                    <div className={styles.selectWithButton}>
                      <select
                        name="idParentesco"
                        value={responsable.idParentesco}
                        onChange={(e) => handleResponsableChange(e, index)}
                        className={styles.formSelect}
                        disabled={loadingParentescos}
                      >
                        {loadingParentescos ? (
                          <option value="">Cargando...</option>
                        ) : (
                          tiposParentesco.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                              {tipo.descripcion}
                            </option>
                          ))
                        )}
                      </select>
                      <button
                        type="button"
                        className={styles.buttonAddTipo}
                        onClick={() => setShowNuevoParentescoModal(true)}
                        title="Crear nuevo tipo de parentesco"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Teléfono
                      <span className={styles.requiredMark}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={responsable.telefono}
                      onChange={(e) => handleResponsableChange(e, index)}
                      className={`${styles.formInput} ${
                        errores[`responsable${index}.telefono`] ? styles.formInputError : ''
                      }`}
                      placeholder="Ej. 55555555"
                    />
                    {errores[`responsable${index}.telefono`] && (
                      <div className={styles.error}>{errores[`responsable${index}.telefono`]}</div>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Primer Nombre
                      <span className={styles.requiredMark}>*</span>
                    </label>
                    <input
                      type="text"
                      name="primerNombre"
                      value={responsable.primerNombre}
                      onChange={(e) => handleResponsableChange(e, index)}
                      className={`${styles.formInput} ${
                        errores[`responsable${index}.primerNombre`] ? styles.formInputError : ''
                      }`}
                      placeholder="Primer nombre"
                    />
                    {errores[`responsable${index}.primerNombre`] && (
                      <div className={styles.error}>{errores[`responsable${index}.primerNombre`]}</div>
                    )}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Segundo Nombre
                    </label>
                    <input
                      type="text"
                      name="segundoNombre"
                      value={responsable.segundoNombre}
                      onChange={(e) => handleResponsableChange(e, index)}
                      className={styles.formInput}
                      placeholder="Segundo nombre"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Tercer Nombre
                    </label>
                    <input
                      type="text"
                      name="tercerNombre"
                      value={responsable.tercerNombre}
                      onChange={(e) => handleResponsableChange(e, index)}
                      className={styles.formInput}
                      placeholder="Tercer nombre"
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Primer Apellido
                      <span className={styles.requiredMark}>*</span>
                    </label>
                    <input
                      type="text"
                      name="primerApellido"
                      value={responsable.primerApellido}
                      onChange={(e) => handleResponsableChange(e, index)}
                      className={`${styles.formInput} ${
                        errores[`responsable${index}.primerApellido`] ? styles.formInputError : ''
                      }`}
                      placeholder="Primer apellido"
                    />
                    {errores[`responsable${index}.primerApellido`] && (
                      <div className={styles.error}>{errores[`responsable${index}.primerApellido`]}</div>
                    )}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Segundo Apellido
                    </label>
                    <input
                      type="text"
                      name="segundoApellido"
                      value={responsable.segundoApellido}
                      onChange={(e) => handleResponsableChange(e, index)}
                      className={styles.formInput}
                      placeholder="Segundo apellido"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    {/* Espacio vacío para mantener la alineación */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de acción */}
          <div className={styles.formActions}>
            <Link to="/admin/alumnos" className={styles.buttonCancel}>
              Volver a la lista
            </Link>
            <button 
              type="button" 
              className={styles.buttonReset}
              onClick={() => {
                setFormData({
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
                setErrores({});
              }}
            >
              <FaRedo size={14} />
              Limpiar formulario
            </button>
            <button 
              type="submit" 
              className={styles.buttonSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.loadingSpinner}></div>
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave size={14} />
                  Guardar Alumno
                </>
              )}
            </button>
          </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CrearAlumno;
