import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCrearCiclo } from '../../hooks/useCrearCiclo';
import styles from './CrearCiclo.module.css';
import { FaCalendarAlt, FaArrowLeft, FaSave, FaRedo } from 'react-icons/fa';
import FloatingNotification from '../../components/FloatingNotification/FloatingNotification';

const CrearCiclo = () => {
  const [id, setId] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [touched, setTouched] = useState<{ id: boolean; descripcion: boolean }>({
    id: false,
    descripcion: false
  });

  // Estado para notificaciones
  const [notificacion, setNotificacion] = useState<{
    mensaje: string;
    tipo: 'success' | 'error';
    visible: boolean;
  }>({
    mensaje: '',
    tipo: 'success',
    visible: false
  });

  const navigate = useNavigate();
  const { crearCiclo, loading } = useCrearCiclo();
  
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados para mostrar errores
    setTouched({ id: true, descripcion: true });
    
    // Validar campos
    if (!isFormValid()) {
      mostrarNotificacion('Por favor, complete todos los campos obligatorios', 'error');
      return;
    }
    
    try {
      const result = await crearCiclo({ id, descripcion });
      if (result) {
        mostrarNotificacion('Ciclo escolar creado exitosamente', 'success');
        // Redirigir a la lista después de una breve pausa
        setTimeout(() => {
          navigate('/admin/ciclos');
        }, 1500);
      }
    } catch (error: any) {
      mostrarNotificacion(error.message || 'Error al crear el ciclo', 'error');
    }
  };

  const isFormValid = () => {
    return !!id && !!descripcion;
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
      
      {/* Encabezado */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link to="/admin/dashboard" className={styles.breadcrumbLink}>Dashboard</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link to="/admin/ciclos" className={styles.breadcrumbLink}>Ciclos</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Crear Ciclo</span>
        </div>
        
        <Link to="/admin/ciclos" className={styles.buttonReturn}>
          <FaArrowLeft size={14} />
          Volver al listado
        </Link>
      </div>

      {/* Ya no necesitamos estos mensajes fijos ya que usamos FloatingNotification */}
      
      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        {/* Tarjeta del formulario */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerIcon}>
              <FaCalendarAlt size={20} />
            </div>
            <h2 className={styles.cardTitle}>Nuevo Ciclo Escolar</h2>
          </div>
          
          <div className={styles.form}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>
                  <FaCalendarAlt size={14} />
                </span>
                Datos del Ciclo Escolar
              </h3>
              
              <div className={styles.formRow}>
                {/* Campo de ID */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="id">
                    ID <span className={styles.requiredMark}>*</span>
                  </label>
                  <input
                    id="id"
                    type="text"
                    className={`${styles.formInput} ${touched.id && !id ? styles.formInputError : ''}`}
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    onBlur={() => setTouched({ ...touched, id: true })}
                    placeholder="Ej. 2026"
                    disabled={loading}
                  />
                  {touched.id && !id && (
                    <div className={styles.error}>El ID es obligatorio</div>
                  )}
                  <div className={styles.formHint}>
                    Introduce el ID único para el ciclo escolar (normalmente el año).
                  </div>
                </div>

                {/* Campo de Descripción */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="descripcion">
                    Descripción <span className={styles.requiredMark}>*</span>
                  </label>
                  <input
                    id="descripcion"
                    type="text"
                    className={`${styles.formInput} ${touched.descripcion && !descripcion ? styles.formInputError : ''}`}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    onBlur={() => setTouched({ ...touched, descripcion: true })}
                    placeholder="Ej. Ciclo 2025"
                    disabled={loading}
                  />
                  {touched.descripcion && !descripcion && (
                    <div className={styles.error}>La descripción es obligatoria</div>
                  )}
                  <div className={styles.formHint}>
                    Describe el ciclo escolar de forma clara y concisa.
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acciones */}
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.buttonCancel}
                onClick={() => navigate('/admin/ciclos')}
                disabled={loading}
              >
                Cancelar
              </button>
              
              <button
                type="button"
                className={styles.buttonReset}
                onClick={() => {
                  setId('');
                  setDescripcion('');
                  setTouched({ id: false, descripcion: false });
                }}
                disabled={loading}
              >
                <FaRedo size={14} />
                Limpiar
              </button>
              
              <button
                type="submit"
                className={styles.buttonSave}
                disabled={loading || !isFormValid()}
              >
                {loading ? (
                  <>
                    <div className={styles.loadingSpinner}></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave size={14} />
                    Guardar Ciclo
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

export default CrearCiclo;
