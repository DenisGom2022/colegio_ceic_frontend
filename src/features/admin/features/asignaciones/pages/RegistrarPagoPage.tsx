import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOneAsignacion } from "../hooks/useOneAsignacion";
import { useCreatePago } from "../hooks/useCreatePago";
import styles from "./RegistrarPagoPage.module.css";
import {
  FaArrowLeft,
  FaDollarSign,
  FaCalendarAlt,
  FaExclamationCircle,
  FaCheckCircle,
  FaSave
} from "react-icons/fa";

const RegistrarPagoPage: React.FC = () => {
  const { id, pagoInfo } = useParams();
  const navigate = useNavigate();
  const { asignacion, loading: loadingAsignacion } = useOneAsignacion(Number(id));
  const { createPago, loading: loadingPago, error, success } = useCreatePago();

  const [formData, setFormData] = useState({
    valor: "",
    mora: "0",
    fechaPago: new Date().toISOString().split("T")[0]
  });

  const [tipoPago, setTipoPago] = useState<{ id: number; descripcion: string; numeroPago: number } | null>(null);

  useEffect(() => {
    if (asignacion && pagoInfo) {
      if (pagoInfo === "inscripcion") {
        setTipoPago({
          id: 1,
          descripcion: "Inscripción",
          numeroPago: 1
        });
        setFormData(prev => ({
          ...prev,
          valor: asignacion.gradoCiclo?.precioInscripcion || "0"
        }));
      } else {
        const numPago = parseInt(pagoInfo);
        setTipoPago({
          id: 2,
          descripcion: `Mensualidad ${numPago}`,
          numeroPago: numPago
        });
        setFormData(prev => ({
          ...prev,
          valor: asignacion.gradoCiclo?.precioPago || "0"
        }));
      }
    }
  }, [asignacion, pagoInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!asignacion || !tipoPago) return;

    try {
      await createPago({
        idAsignacionCurso: asignacion.id,
        tipoPagoId: tipoPago.id,
        numeroPago: tipoPago.numeroPago,
        valor: parseFloat(formData.valor),
        mora: parseFloat(formData.mora),
        fechaPago: formData.fechaPago
      });

      // Redirigir después de 1.5 segundos si fue exitoso
      setTimeout(() => {
        navigate(`/admin/asignaciones/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Error al registrar pago:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (amount: string | number | undefined) => {
    if (!amount) return "Q0.00";
    return `Q${parseFloat(amount.toString()).toFixed(2)}`;
  };

  const getNombreCompleto = (persona: any) => {
    if (!persona) return "N/A";
    return [
      persona.primerNombre,
      persona.segundoNombre,
      persona.tercerNombre,
      persona.primerApellido,
      persona.segundoApellido
    ].filter(Boolean).join(" ");
  };

  if (loadingAsignacion) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Cargando información...</p>
      </div>
    );
  }

  if (!asignacion || !tipoPago) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationCircle size={48} />
        <h2>Error al cargar</h2>
        <p>No se pudo cargar la información de la asignación</p>
        <button onClick={() => navigate(`/admin/asignaciones/${id}`)} className={styles.backButton}>
          <FaArrowLeft /> Volver
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <button onClick={() => navigate(`/admin/asignaciones/${id}`)} className={styles.backButton}>
          <FaArrowLeft /> Volver a Detalles
        </button>

        <div className={styles.headerTitle}>
          <div className={styles.headerIcon}>
            <FaDollarSign />
          </div>
          <div>
            <h1>Registrar Pago</h1>
            <p className={styles.subtitle}>{tipoPago.descripcion}</p>
          </div>
        </div>
      </header>

      <div className={styles.contentContainer}>
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Información de la Asignación</h3>
            <div className={styles.infoDetails}>
              <div className={styles.infoRow}>
                <label>Estudiante:</label>
                <span>{getNombreCompleto(asignacion.alumno)}</span>
              </div>
              <div className={styles.infoRow}>
                <label>Grado:</label>
                <span>{asignacion.gradoCiclo?.grado?.nombre || "N/A"}</span>
              </div>
              <div className={styles.infoRow}>
                <label>Ciclo:</label>
                <span>{asignacion.gradoCiclo?.ciclo?.descripcion || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3>Datos del Pago</h3>

            {error && (
              <div className={styles.errorMessage}>
                <FaExclamationCircle />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className={styles.successMessage}>
                <FaCheckCircle />
                <span>¡Pago registrado exitosamente!</span>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="tipoPago">Tipo de Pago</label>
              <input
                type="text"
                id="tipoPago"
                value={tipoPago.descripcion}
                disabled
                className={styles.inputDisabled}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="valor">
                Monto <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWithIcon}>
                <FaDollarSign className={styles.inputIcon} />
                <input
                  type="number"
                  id="valor"
                  name="valor"
                  value={formData.valor}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className={styles.input}
                  disabled={tipoPago.id === 1 || tipoPago.id === 2}
                />
              </div>
              <small className={styles.helpText}>
                {tipoPago.id === 1 
                  ? `Monto de inscripción: ${formatCurrency(asignacion.gradoCiclo?.precioInscripcion)}`
                  : `Monto de mensualidad: ${formatCurrency(asignacion.gradoCiclo?.precioPago)}`}
              </small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="mora">Mora</label>
              <div className={styles.inputWithIcon}>
                <FaDollarSign className={styles.inputIcon} />
                <input
                  type="number"
                  id="mora"
                  name="mora"
                  value={formData.mora}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={styles.input}
                />
              </div>
              <small className={styles.helpText}>Ingrese el monto de mora si aplica</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="fechaPago">
                Fecha de Pago <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWithIcon}>
                <FaCalendarAlt className={styles.inputIcon} />
                <input
                  type="date"
                  id="fechaPago"
                  name="fechaPago"
                  value={formData.fechaPago}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className={styles.totalSection}>
              <div className={styles.totalRow}>
                <span>Subtotal:</span>
                <span className={styles.totalAmount}>{formatCurrency(formData.valor)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Mora:</span>
                <span className={styles.totalAmount}>{formatCurrency(formData.mora)}</span>
              </div>
              <div className={styles.totalRowFinal}>
                <span>Total a Pagar:</span>
                <span className={styles.totalAmountFinal}>
                  {formatCurrency(parseFloat(formData.valor || "0") + parseFloat(formData.mora || "0"))}
                </span>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => navigate(`/admin/asignaciones/${id}`)}
                className={styles.cancelButton}
                disabled={loadingPago}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loadingPago || success}
              >
                {loadingPago ? (
                  <>
                    <div className={styles.spinner} />
                    Procesando...
                  </>
                ) : (
                  <>
                    <FaSave /> Registrar Pago
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrarPagoPage;
