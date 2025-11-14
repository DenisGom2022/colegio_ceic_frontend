import React, { useState } from 'react';
import { FaCogs, FaExclamationCircle, FaMoneyBillWave, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import styles from '../pages/GradeDetailPage.module.css';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    descripcion: string;
    valor: number;
    fecha_a_pagar: string;
    id_grado_ciclo: number;
  }) => void;
  loading: boolean;
  id_grado_ciclo: number;
}

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  id_grado_ciclo
}) => {
  const [descripcion, setDescripcion] = useState<string>('');
  const [valor, setValor] = useState<string>('');
  const [fechaAPagar, setFechaAPagar] = useState<string>('');
  const [formErrors, setFormErrors] = useState({
    descripcion: '',
    valor: '',
    fecha_a_pagar: ''
  });

  const validateForm = () => {
    const errors = {
      descripcion: '',
      valor: '',
      fecha_a_pagar: ''
    };
    let isValid = true;

    // Validar descripción
    if (!descripcion.trim()) {
      errors.descripcion = 'La descripción es requerida';
      isValid = false;
    } else if (descripcion.trim().length < 3) {
      errors.descripcion = 'La descripción debe tener al menos 3 caracteres';
      isValid = false;
    }

    // Validar valor
    if (!valor) {
      errors.valor = 'El valor es requerido';
      isValid = false;
    } else if (isNaN(Number(valor)) || Number(valor) <= 0) {
      errors.valor = 'El valor debe ser un número positivo';
      isValid = false;
    }

    // Validar fecha
    if (!fechaAPagar) {
      errors.fecha_a_pagar = 'La fecha a pagar es requerida';
      isValid = false;
    } else {
      const selectedDate = new Date(fechaAPagar);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.fecha_a_pagar = 'La fecha no puede ser anterior a hoy';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        descripcion: descripcion.trim(),
        valor: Number(valor),
        fecha_a_pagar: fechaAPagar,
        id_grado_ciclo: id_grado_ciclo
      });
    }
  };

  const resetForm = () => {
    setDescripcion('');
    setValor('');
    setFechaAPagar('');
    setFormErrors({
      descripcion: '',
      valor: '',
      fecha_a_pagar: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <FaCogs size={18} />
            Crear Nuevo Servicio
          </h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <p className="mb-4 text-gray-600 text-sm">
              Complete la información del servicio que se agregará al ciclo activo.
            </p>

            {/* Campo descripción */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <FaFileAlt size={16} />
                Descripción del servicio
              </label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={styles.formInput}
                placeholder="Ej. Uniforme, Libros, Materiales..."
                maxLength={100}
              />
              {formErrors.descripcion && (
                <p className={styles.formError}>
                  <FaExclamationCircle size={14} />
                  {formErrors.descripcion}
                </p>
              )}
            </div>

            {/* Campo valor */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <FaMoneyBillWave size={16} />
                Valor del servicio (Q)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className={styles.formInput}
                placeholder="Ej. 100.00"
              />
              {formErrors.valor && (
                <p className={styles.formError}>
                  <FaExclamationCircle size={14} />
                  {formErrors.valor}
                </p>
              )}
            </div>

            {/* Campo fecha a pagar */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <FaCalendarAlt size={16} />
                Fecha límite de pago
              </label>
              <input
                type="date"
                value={fechaAPagar}
                onChange={(e) => setFechaAPagar(e.target.value)}
                className={styles.formInput}
                min={new Date().toISOString().split('T')[0]}
              />
              {formErrors.fecha_a_pagar && (
                <p className={styles.formError}>
                  <FaExclamationCircle size={14} />
                  {formErrors.fecha_a_pagar}
                </p>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="text-sm text-blue-800">
                <strong>Información:</strong> Este servicio se asociará al ciclo activo y estará disponible 
                para todos los alumnos inscritos en este grado.
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.buttonCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.buttonSubmit}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Creando servicio...
                </>
              ) : (
                <>
                  <FaCogs className="mr-2" size={16} />
                  Crear Servicio
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServiceModal;