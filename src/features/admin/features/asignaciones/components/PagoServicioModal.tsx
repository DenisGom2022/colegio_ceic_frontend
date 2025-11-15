import React, { useState } from 'react';
import { FaTimes, FaDollarSign, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import { usePagoServicio } from '../hooks/usePagoServicio';
import styles from './PagoServicioModal.module.css';

interface PagoServicioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    servicio: {
        id: number;
        descripcion: string;
        valor: string;
        fecha_a_pagar: string;
    };
    idAsignacionAlumno: number;
}

const PagoServicioModal: React.FC<PagoServicioModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    servicio,
    idAsignacionAlumno
}) => {
    const { registrarPagoServicio, loading, error, clearError } = usePagoServicio();
    
    const [formData, setFormData] = useState({
        valor: servicio.valor,
        fecha_pagado: new Date().toISOString().split('T')[0] // Fecha actual por defecto
    });

    const [successMessage, setSuccessMessage] = useState('');

    const formatCurrency = (amount: string) => {
        return `Q${parseFloat(amount).toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar errores cuando el usuario empiece a escribir
        if (error) {
            clearError();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.valor || !formData.fecha_pagado) {
            return;
        }

        try {
            await registrarPagoServicio({
                id_servicio: servicio.id,
                id_asignacion_alumno: idAsignacionAlumno,
                valor: formData.valor,
                fecha_pagado: formData.fecha_pagado
            });

            setSuccessMessage('¡Pago de servicio registrado exitosamente!');
            
            // Cerrar modal después de 2 segundos y llamar onSuccess
            setTimeout(() => {
                setSuccessMessage('');
                onSuccess();
                onClose();
            }, 2000);

        } catch (err) {
            // El error ya está manejado en el hook
            console.error('Error al registrar pago de servicio:', err);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                valor: servicio.valor,
                fecha_pagado: new Date().toISOString().split('T')[0]
            });
            clearError();
            setSuccessMessage('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <FaDollarSign className={styles.titleIcon} />
                        Registrar Pago de Servicio
                    </h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        disabled={loading}
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {successMessage && (
                        <div className={styles.successMessage}>
                            <div className={styles.successIcon}>✓</div>
                            <p>{successMessage}</p>
                        </div>
                    )}

                    {!successMessage && (
                        <>
                            <div className={styles.servicioInfo}>
                                <h3 className={styles.servicioTitulo}>{servicio.descripcion}</h3>
                                <div className={styles.servicioDetails}>
                                    <div className={styles.servicioDetail}>
                                        <span className={styles.label}>Valor del Servicio:</span>
                                        <span className={styles.value}>{formatCurrency(servicio.valor)}</span>
                                    </div>
                                    <div className={styles.servicioDetail}>
                                        <span className={styles.label}>Fecha Límite:</span>
                                        <span className={styles.value}>{formatDate(servicio.fecha_a_pagar)}</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="valor" className={styles.formLabel}>
                                        <FaDollarSign className={styles.labelIcon} />
                                        Monto a Pagar
                                    </label>
                                    <input
                                        type="number"
                                        id="valor"
                                        name="valor"
                                        value={formData.valor}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className={styles.formInput}
                                        placeholder="0.00"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="fecha_pagado" className={styles.formLabel}>
                                        <FaCalendarAlt className={styles.labelIcon} />
                                        Fecha de Pago
                                    </label>
                                    <input
                                        type="date"
                                        id="fecha_pagado"
                                        name="fecha_pagado"
                                        value={formData.fecha_pagado}
                                        onChange={handleInputChange}
                                        className={styles.formInput}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {error && (
                                    <div className={styles.errorMessage}>
                                        <p>{error}</p>
                                    </div>
                                )}

                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className={styles.cancelButton}
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={loading || !formData.valor || !formData.fecha_pagado}
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner className={styles.spinnerIcon} />
                                                Registrando...
                                            </>
                                        ) : (
                                            <>
                                                <FaDollarSign />
                                                Registrar Pago
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PagoServicioModal;