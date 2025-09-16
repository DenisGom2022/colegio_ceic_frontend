import { useLocation, useNavigate } from "react-router-dom";
import { useMisCursosActivos } from "../hooks/useMisCursosActivos";
import { useState, useEffect } from "react";
import { useCreateTarea } from "../hooks/useCreateTarea";
import FloatingNotification from "../../../components/FloatingNotification";
import "./CreateTareaPage.css";

function toDateInputValue(date = new Date()) {
  // Ajusta a zona horaria local para evitar desfases
  const off = date.getTimezoneOffset();
  const local = new Date(date.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function toISO8601(dateString: string) {
  if (!dateString) return null;
  // dateString = "2025-09-11"
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day); // crea Date en hora local
  return date.toISOString(); // "2025-09-11T06:00:00.000Z" (depende de tu zona)
}

export const CreateTareaPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const idCurso = params.get("idCurso") || 0;
  const nroBimestre = params.get("nroBimestre") || 0;
  const { misCursosActivos } = useMisCursosActivos();

  const [curso, setCurso] = useState<any>(idCurso);
  const [bimestre, setBimestre] = useState<any>(nroBimestre);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [punteo, setPunteo] = useState(100);
  const [fechaEntrega, setFechaEntrega] = useState("");

  const { createTarea, error, loading, success } = useCreateTarea();
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (misCursosActivos?.length === 1) {
      setCurso(misCursosActivos[0].id);
    }
  }, [misCursosActivos]);

  useEffect(() => {
    if (success) {
      setShowNotification(true);
      // Redireccionar al detalle del curso después de mostrar la notificación
      setTimeout(() => {
        navigate(`/mis-cursos/${curso}`);
      }, 2000); // 2 segundos para que el usuario vea la notificación
    }
  }, [success, navigate, curso]);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!curso) {
      alert("Debe seleccionar un curso");
      return;
    }

    if (!fechaEntrega) {
      alert("Debe seleccionar una fecha de entrega");
      return;
    }

    const formData = {
      titulo,
      descripcion,
      punteo,
      fechaEntrega: toISO8601(fechaEntrega) || "",
      idCurso: curso,
      nroBimestre: bimestre,
    };

    try {
      await createTarea(formData);
      // Reset form on success
      setTitulo("");
      setDescripcion("");
      setPunteo(100);
      setFechaEntrega("");
    } catch (err) {
      console.error("Error creating tarea:", err);
    }
  };

  const handleCursoSelect = (cursoSeleccionado: any) => {
    setCurso(cursoSeleccionado.id);
    setShowModal(false);
  };

  const handleCancel = () => {
    navigate(`/mis-cursos/${curso}`);
  };

  const getCursoSeleccionado = () => {
    return misCursosActivos?.find((c) => c.id == curso);
  };

  return (
    <div className="create-tarea-container">
      {/* Professional Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Gestión Académica</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="breadcrumb-item">Tareas</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="breadcrumb-item active">Nueva Actividad</span>
          </div>
          
          <div className="header-title-section">
            <div className="title-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" stroke="currentColor" strokeWidth="1.5"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="1.5"/>
                <polyline points="10,9 9,10 10,11" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="title-content">
              <h1 className="page-title">Crear Nueva Tarea Académica</h1>
              <p className="page-description">Configure y programe una nueva actividad de evaluación para sus estudiantes</p>
            </div>
            <div className="header-meta">
              <div className="meta-badge">
                <span className="badge primary">Sistema Académico</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="main-layout">
        {/* Form Content */}
        <div className="form-content">
          <div className="form-wrapper">
            <form className="professional-form" onSubmit={submitForm}>
              
              {/* Course Selection Section */}
              <div className="form-card">
                <div className="card-header">
                  <div className="header-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div className="header-content">
                    <h2 className="card-title">Configuración Académica</h2>
                    <p className="card-description">Seleccione el curso y período para la nueva tarea</p>
                  </div>
                  <div className="header-badge">
                    <span className="badge success">Configuración</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-text">Curso Asignado</span>
                        <span className="label-required">*</span>
                      </label>
                      <button
                        type="button"
                        className={`btn-select-course ${getCursoSeleccionado() ? 'has-selection' : ''}`}
                        onClick={() => setShowModal(true)}
                      >
                        <div className="course-selection-content">
                          <div className="course-selection-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                          </div>
                          <div className="course-selection-text">
                            {getCursoSeleccionado() ? (
                              <>
                                <div className="course-selection-title">
                                  {getCursoSeleccionado()?.nombre}
                                </div>
                                <div className="course-selection-subtitle">
                                  {getCursoSeleccionado()?.gradoCiclo?.grado?.nombre} - {getCursoSeleccionado()?.gradoCiclo?.grado?.nivelAcademico?.descripcion}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="course-selection-title">
                                  Seleccionar Curso Académico
                                </div>
                                <div className="course-selection-subtitle">
                                  Haga clic para elegir un curso disponible
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="course-selection-arrow">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </div>
                      </button>
                    </div>

                    <div className="form-group">
                      <label htmlFor="bimestre" className="form-label">
                        <span className="label-text">Período Bimestral</span>
                        <span className="label-required">*</span>
                      </label>
                      <div className="select-container">
                        <select
                          name="bimestre"
                          id="bimestre"
                          className="form-select"
                          value={bimestre}
                          onChange={(e) => setBimestre(e.target.value)}
                          required
                        >
                          <option value="">Seleccione el bimestre</option>
                          <option value="1">Primer Bimestre</option>
                          <option value="2">Segundo Bimestre</option>
                          <option value="3">Tercer Bimestre</option>
                          <option value="4">Cuarto Bimestre</option>
                        </select>
                        <div className="select-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Details Section */}
              <div className="form-card">
                <div className="card-header">
                  <div className="header-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" stroke="currentColor" strokeWidth="1.5"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div className="header-content">
                    <h2 className="card-title">Especificaciones de la Tarea</h2>
                    <p className="card-description">Defina el contenido y descripción detallada de la actividad</p>
                  </div>
                  <div className="header-badge">
                    <span className="badge info">Contenido</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="form-group full-width">
                    <label htmlFor="titulo" className="form-label">
                      <span className="label-text">Título de la Actividad Académica</span>
                      <span className="label-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      id="titulo"
                      className="form-input"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Ejemplo: Análisis Crítico de la Literatura Contemporánea Guatemalteca"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="descripcion" className="form-label">
                      <span className="label-text">Descripción y Objetivos de Aprendizaje</span>
                      <span className="label-required">*</span>
                    </label>
                    <textarea
                      name="descripcion"
                      id="descripcion"
                      className="form-textarea"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Proporcione una descripción detallada que incluya: objetivos de aprendizaje, metodología, criterios de evaluación, recursos necesarios y entregables esperados..."
                      rows={6}
                      required
                    />
                    <div className="textarea-footer">
                      <span className="char-counter">{descripcion.length} caracteres</span>
                      <span className="helper-text">Incluya objetivos, metodología y criterios de evaluación</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation Parameters Section */}
              <div className="form-card">
                <div className="card-header">
                  <div className="header-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M19 7h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div className="header-content">
                    <h2 className="card-title">Parámetros de Evaluación</h2>
                    <p className="card-description">Configure la puntuación y cronograma de entrega</p>
                  </div>
                  <div className="header-badge">
                    <span className="badge warning">Evaluación</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="punteo" className="form-label">
                        <span className="label-text">Valoración Máxima</span>
                        <span className="label-required">*</span>
                      </label>
                      <div className="input-with-addon">
                        <input
                          type="number"
                          name="punteo"
                          id="punteo"
                          className="form-input"
                          value={punteo}
                          onChange={(e) => setPunteo(parseInt(e.target.value))}
                          placeholder="100"
                          min="1"
                          max="100"
                          required
                        />
                        <div className="input-addon">
                          <span>puntos</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="fechaEntrega" className="form-label">
                        <span className="label-text">Fecha Límite de Entrega</span>
                        <span className="label-required">*</span>
                      </label>
                      <div className="date-input-container">
                        <input
                          type="date"
                          name="fechaEntrega"
                          id="fechaEntrega"
                          className="form-input"
                          value={fechaEntrega}
                          onChange={(e) => setFechaEntrega(e.target.value)}
                          min={toDateInputValue()}
                          required
                        />
                        <div className="date-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5"/>
                            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5"/>
                            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5"/>
                            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <div className="actions-content">
                  <div className="actions-left">
                    <div className="required-info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M12 16v-4" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M12 8h.01" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <span>Los campos marcados con (*) son obligatorios</span>
                    </div>
                  </div>
                  <div className="actions-right">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <div className="btn-content">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2"/>
                          <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Cancelar</span>
                      </div>
                    </button>
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="btn-loading">
                          <div className="loading-spinner"></div>
                          <span>Creando Tarea...</span>
                        </div>
                      ) : (
                        <div className="btn-content">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span>Crear Tarea Académica</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="error-message">
          <div className="error-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Course Selection Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Seleccionar Curso Académico</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">Seleccione el curso para el cual desea crear la nueva tarea académica:</p>
              <div className="course-list">
                {misCursosActivos && misCursosActivos.length > 0 ? (
                  misCursosActivos.map((curso) => (
                    <div
                      key={curso.id}
                      className="course-item"
                      onClick={() => handleCursoSelect(curso)}
                    >
                      <div className="course-info">
                        <h4 className="course-title">{curso.nombre}</h4>
                        <p className="course-details">
                          {curso.gradoCiclo?.grado?.nombre} - {curso.gradoCiclo?.grado?.nivelAcademico?.descripcion}
                        </p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  ))
                ) : (
                  <div className="no-courses">
                    <p>No hay cursos activos disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificación de éxito */}
      {showNotification && (
        <FloatingNotification
          type="success"
          title="¡Tarea creada exitosamente!"
          message="La tarea ha sido creada y asignada correctamente."
          onClose={() => setShowNotification(false)}
          autoCloseTime={5000}
        />
      )}
    </div>
  );
};
