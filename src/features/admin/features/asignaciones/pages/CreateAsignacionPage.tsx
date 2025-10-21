import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateAsignacion } from '../hooks/useCreateAsignacion';
import { gradoService } from '../../grades/services/gradoService';
import type { Grado } from '../../grades/services/gradoService';
import styles from './CreateAsignacionPage.module.css';
import { FaSave, FaArrowLeft, FaUserGraduate, FaSchool } from 'react-icons/fa';
import FloatingNotification from '../../../../../components/FloatingNotification/FloatingNotification';

const CreateAsignacionPage: React.FC = () => {
  const navigate = useNavigate();
  const { createAsignacion, loading, error, data } = useCreateAsignacion();
  
  const [cuiAlumno, setCuiAlumno] = useState<string>('');
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

  // Manejar respuesta del servidor
  useEffect(() => {
    if (data) {
      if (data.message && data.asignacion) {
        // Éxito
        mostrarNotificacion(data.message, 'success');
        setTimeout(() => {
          navigate('/admin/asignaciones');
        }, 2000);
      } else if (data.message) {
        // Error del servidor (ej: alumno ya asignado)
        mostrarNotificacion(data.message, 'error');
      }
    }
  }, [data, navigate]);

  // Manejar errores del hook
  useEffect(() => {
    if (error) {
      mostrarNotificacion(error, 'error');
    }
  }, [error]);

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error') => {
    setNotificacion({
      mensaje,
      tipo,
      visible: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!cuiAlumno.trim()) {
      mostrarNotificacion('El CUI del alumno es requerido', 'error');
      return;
    }

    if (cuiAlumno.trim().length !== 13) {
      mostrarNotificacion('El CUI debe tener 13 dígitos', 'error');
      return;
    }

    if (!idGrado || idGrado === 0) {
      mostrarNotificacion('Debe seleccionar un grado', 'error');
      return;
    }

    await createAsignacion(cuiAlumno.trim(), idGrado);
  };

  const handleCancel = () => {
    navigate('/admin/asignaciones');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <FaUserGraduate className={styles.titleIcon} />
            Crear Nueva Asignación
          </h1>
          <p className={styles.subtitle}>
            Asigne un alumno a un grado del ciclo escolar activo
          </p>
        </div>
        <Link to="/admin/asignaciones" className={styles.backButton}>
          <FaArrowLeft /> Volver
        </Link>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          {/* CUI del Alumno */}
          <div className={styles.formGroup}>
            <label htmlFor="cuiAlumno" className={styles.label}>
              <FaUserGraduate className={styles.labelIcon} />
              CUI del Alumno *
            </label>
            <input
              type="text"
              id="cuiAlumno"
              className={styles.input}
              value={cuiAlumno}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 13);
                setCuiAlumno(value);
              }}
              placeholder="Ingrese el CUI (13 dígitos)"
              maxLength={13}
              disabled={loading}
            />
            <small className={styles.helper}>
              Ingrese el CUI del alumno que desea asignar al grado
            </small>
          </div>

          {/* Selección de Grado */}
          <div className={styles.formGroup}>
            <label htmlFor="idGrado" className={styles.label}>
              <FaSchool className={styles.labelIcon} />
              Grado *
            </label>
            {loadingGrados ? (
              <div className={styles.loadingSelect}>Cargando grados...</div>
            ) : (
              <select
                id="idGrado"
                className={styles.select}
                value={idGrado}
                onChange={(e) => setIdGrado(Number(e.target.value))}
                disabled={loading || grados.length === 0}
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
                Seleccione el grado al que desea asignar el alumno
              </small>
            )}
          </div>

          {/* Botones de acción */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || loadingGrados || grados.length === 0}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Creando...
                </>
              ) : (
                <>
                  <FaSave />
                  Crear Asignación
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

export default CreateAsignacionPage;
