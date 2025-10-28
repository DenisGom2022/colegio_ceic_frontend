import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useModificaAsignacion } from '../hooks/useModificaAsignacion';
import { useOneAsignacion } from '../hooks/useOneAsignacion';
import { gradoService } from '../../grades/services/gradoService';
import type { Grado } from '../../grades/services/gradoService';
import styles from './CreateAsignacionPage.module.css';
import { FaSave, FaArrowLeft, FaUserGraduate, FaSchool } from 'react-icons/fa';
import FloatingNotification from '../../../../../components/FloatingNotification/FloatingNotification';

const ModificaAsignacionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const asignacionId = id ? parseInt(id) : null;
  
  const { modificaAsignacion, loading: loadingUpdate, error: errorUpdate, data: dataUpdate } = useModificaAsignacion();
  const { asignacion, loading: loadingAsignacion, error: errorAsignacion } = useOneAsignacion(asignacionId);
  
  const [idGrado, setIdGrado] = useState<number>(0);
  const [grados, setGrados] = useState<Grado[]>([]);
  const [loadingGrados, setLoadingGrados] = useState<boolean>(true);
  
  const [notificacion, setNotificacion] = useState<{
    mensaje: string;
    tipo: 'success' | 'error';
    visible: boolean;
  }>({
    mensaje: '',
    tipo: 'success',
    visible: false
  });

  // Cargar grados con ciclos activos
  useEffect(() => {
    const fetchGrados = async () => {
      try {
        setLoadingGrados(true);
        const gradosData = await gradoService.getGradosWithActiveCycles();
        setGrados(gradosData);
      } catch (err) {
        mostrarNotificacion('Error al cargar los grados disponibles', 'error');
      } finally {
        setLoadingGrados(false);
      }
    };

    fetchGrados();
  }, []);

  // Establecer el grado actual cuando se carga la asignación
  useEffect(() => {
    if (asignacion && asignacion.gradoCiclo?.idGrado) {
      setIdGrado(asignacion.gradoCiclo.idGrado);
    }
  }, [asignacion]);

  // Manejar respuesta del servidor
  useEffect(() => {
    if (dataUpdate) {
      if (dataUpdate.message && dataUpdate.asignacion) {
        // Éxito
        mostrarNotificacion(dataUpdate.message, 'success');
        setTimeout(() => {
          navigate('/admin/asignaciones');
        }, 2000);
      } else if (dataUpdate.message) {
        // Error del servidor (ej: ciclo no activo)
        mostrarNotificacion(dataUpdate.message, 'error');
      }
    }
  }, [dataUpdate, navigate]);

  // Manejar errores del hook de actualización
  useEffect(() => {
    if (errorUpdate) {
      mostrarNotificacion(errorUpdate, 'error');
    }
  }, [errorUpdate]);

  // Manejar errores al cargar la asignación
  useEffect(() => {
    if (errorAsignacion) {
      mostrarNotificacion('Error al cargar la asignación', 'error');
    }
  }, [errorAsignacion]);

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error') => {
    setNotificacion({
      mensaje,
      tipo,
      visible: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!asignacionId) {
      mostrarNotificacion('ID de asignación no válido', 'error');
      return;
    }

    // Validaciones
    if (!idGrado || idGrado === 0) {
      mostrarNotificacion('Debe seleccionar un grado', 'error');
      return;
    }

    // Verificar si el grado cambió
    if (asignacion && asignacion.gradoCiclo?.idGrado === idGrado) {
      mostrarNotificacion('Debe seleccionar un grado diferente al actual', 'error');
      return;
    }

    await modificaAsignacion(asignacionId, idGrado);
  };

  const handleCancel = () => {
    navigate('/admin/asignaciones');
  };

  // Mostrar loading mientras carga la asignación
  if (loadingAsignacion) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <span className={styles.spinner}></span>
          <p>Cargando asignación...</p>
        </div>
      </div>
    );
  }

  // Si no se encontró la asignación
  if (!asignacion && !loadingAsignacion) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Asignación no encontrada</h2>
          <Link to="/admin/asignaciones" className={styles.backButton}>
            <FaArrowLeft /> Volver a asignaciones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <FaUserGraduate className={styles.titleIcon} />
            Modificar Asignación
          </h1>
          <p className={styles.subtitle}>
            Actualice el grado de la asignación del alumno
          </p>
        </div>
        <Link to="/admin/asignaciones" className={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
      </div>

      {/* Información del alumno */}
      {asignacion && (
        <div className={styles.infoCard}>
          <h3 className={styles.infoTitle}>Información del Alumno</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>CUI:</span>
              <span className={styles.infoValue}>{asignacion.alumno?.cui || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Nombre:</span>
              <span className={styles.infoValue}>
                {asignacion.alumno?.primerNombre} {asignacion.alumno?.segundoNombre || ''} {asignacion.alumno?.primerApellido} {asignacion.alumno?.segundoApellido || ''}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Grado Actual:</span>
              <span className={styles.infoValue}>
                {asignacion.gradoCiclo?.grado?.nombre || 'N/A'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ciclo:</span>
              <span className={styles.infoValue}>
                {asignacion.gradoCiclo?.ciclo?.descripcion || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          {/* Selección de Grado */}
          <div className={styles.formGroup}>
            <label htmlFor="idGrado" className={styles.label}>
              <FaSchool className={styles.labelIcon} />
              Nuevo Grado *
            </label>
            {loadingGrados ? (
              <div className={styles.loadingSelect}>Cargando grados...</div>
            ) : (
              <select
                id="idGrado"
                className={styles.select}
                value={idGrado}
                onChange={(e) => setIdGrado(Number(e.target.value))}
                disabled={loadingUpdate || grados.length === 0}
              >
                <option value={0}>Seleccione un grado</option>
                {grados.map((grado) => (
                  <option key={grado.id} value={grado.id}>
                    {grado.nombre} - {grado.nivelAcademico?.descripcion || ''} - {grado.jornada?.descripcion || ''}
                    {grado.gradosCiclo && grado.gradosCiclo.length > 0 && 
                      ` (${grado.gradosCiclo[0].ciclo.descripcion})`
                    }
                  </option>
                ))}
              </select>
            )}
            {!loadingGrados && grados.length === 0 && (
              <small className={styles.helperError}>
                No hay grados disponibles con ciclos activos
              </small>
            )}
            {!loadingGrados && grados.length > 0 && (
              <small className={styles.helper}>
                Seleccione el nuevo grado para la asignación del alumno
              </small>
            )}
          </div>

          {/* Botones de acción */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={loadingUpdate}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loadingUpdate || loadingGrados || grados.length === 0}
            >
              {loadingUpdate ? (
                <>
                  <span className={styles.spinner}></span>
                  Actualizando...
                </>
              ) : (
                <>
                  <FaSave />
                  Actualizar Asignación
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Notificación */}
      {notificacion.visible && (
        <FloatingNotification
          title={notificacion.tipo === 'success' ? 'Éxito' : 'Error'}
          message={notificacion.mensaje}
          type={notificacion.tipo}
          onClose={() => setNotificacion({ ...notificacion, visible: false })}
          autoCloseTime={notificacion.tipo === 'success' ? 3000 : 0}
        />
      )}
    </div>
  );
};

export default ModificaAsignacionPage;
