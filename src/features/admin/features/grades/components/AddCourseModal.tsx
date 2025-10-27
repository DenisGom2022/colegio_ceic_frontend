import { useState, useEffect } from 'react';
import { FaGraduationCap, FaUser, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { getCatedraticos } from '../../../../../services/catedraticoService';
import styles from './AddCourseModal.module.css';
import type { Catedratico } from '../../../../../interfaces/interfaces';

interface AddCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (courseData: {
        nombre: string;
        notaMaxima: number;
        notaAprobada: number;
        dpiCatedratico: string;
    }) => void;
    loading: boolean;
}

const AddCourseModal = ({ isOpen, onClose, onSubmit, loading }: AddCourseModalProps) => {
    const [nombre, setNombre] = useState<string>('');
    const [notaMaxima, setNotaMaxima] = useState<string>('100');
    const [notaAprobada, setNotaAprobada] = useState<string>('60');
    const [dpiCatedratico, setDpiCatedratico] = useState<string>('');
    const [catedraticos, setCatedraticos] = useState<Catedratico[]>([]);
    const [loadingCatedraticos, setLoadingCatedraticos] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState({
        nombre: '',
        notaMaxima: '',
        notaAprobada: '',
        dpiCatedratico: ''
    });

    // Cargar catedráticos cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            loadCatedraticos();
        }
    }, [isOpen]);

    const loadCatedraticos = async () => {
        setLoadingCatedraticos(true);
        try {
            // Obtener todos los catedráticos (con un límite alto)
            const response = await getCatedraticos(1, 100);
            setCatedraticos(response.catedraticos);
        } catch (error) {
            console.error('Error loading teachers:', error);
        } finally {
            setLoadingCatedraticos(false);
        }
    };

    const validateForm = () => {
        const errors = {
            nombre: '',
            notaMaxima: '',
            notaAprobada: '',
            dpiCatedratico: ''
        };
        let isValid = true;

        // Validar nombre
        if (!nombre.trim()) {
            errors.nombre = 'El nombre del curso es requerido';
            isValid = false;
        } else if (nombre.trim().length < 2) {
            errors.nombre = 'El nombre debe tener al menos 2 caracteres';
            isValid = false;
        }

        // Validar nota máxima
        if (!notaMaxima) {
            errors.notaMaxima = 'La nota máxima es requerida';
            isValid = false;
        } else if (isNaN(Number(notaMaxima)) || Number(notaMaxima) <= 0) {
            errors.notaMaxima = 'La nota máxima debe ser un número positivo';
            isValid = false;
        } else if (Number(notaMaxima) > 1000) {
            errors.notaMaxima = 'La nota máxima no puede ser mayor a 1000';
            isValid = false;
        }

        // Validar nota aprobada
        if (!notaAprobada) {
            errors.notaAprobada = 'La nota aprobada es requerida';
            isValid = false;
        } else if (isNaN(Number(notaAprobada)) || Number(notaAprobada) <= 0) {
            errors.notaAprobada = 'La nota aprobada debe ser un número positivo';
            isValid = false;
        } else if (Number(notaAprobada) >= Number(notaMaxima)) {
            errors.notaAprobada = 'La nota aprobada debe ser menor que la nota máxima';
            isValid = false;
        }

        // Validar catedrático
        if (!dpiCatedratico) {
            errors.dpiCatedratico = 'Debe seleccionar un catedrático';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                nombre: nombre.trim(),
                notaMaxima: Number(notaMaxima),
                notaAprobada: Number(notaAprobada),
                dpiCatedratico
            });
        }
    };

    const resetForm = () => {
        setNombre('');
        setNotaMaxima('100');
        setNotaAprobada('60');
        setDpiCatedratico('');
        setFormErrors({
            nombre: '',
            notaMaxima: '',
            notaAprobada: '',
            dpiCatedratico: ''
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
                        <FaGraduationCap size={18} />
                        Agregar Nuevo Curso
                    </h3>
                    <button
                        type="button"
                        onClick={handleClose}
                        className={styles.closeButton}
                        disabled={loading}
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.modalBody}>
                        <p className={styles.modalDescription}>
                            Complete la información del nuevo curso que se asignará al ciclo activo.
                        </p>

                        {/* Nombre del curso */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaGraduationCap size={16} />
                                Nombre del curso
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className={styles.formInput}
                                placeholder="Ej. Matemáticas, Lenguaje, Ciencias..."
                                disabled={loading}
                            />
                            {formErrors.nombre && (
                                <p className={styles.formError}>
                                    <FaExclamationCircle size={14} />
                                    {formErrors.nombre}
                                </p>
                            )}
                        </div>

                        {/* Notas */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Nota máxima
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={notaMaxima}
                                    onChange={(e) => setNotaMaxima(e.target.value)}
                                    className={styles.formInput}
                                    disabled={loading}
                                />
                                {formErrors.notaMaxima && (
                                    <p className={styles.formError}>
                                        <FaExclamationCircle size={14} />
                                        {formErrors.notaMaxima}
                                    </p>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Nota aprobada
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={notaAprobada}
                                    onChange={(e) => setNotaAprobada(e.target.value)}
                                    className={styles.formInput}
                                    disabled={loading}
                                />
                                {formErrors.notaAprobada && (
                                    <p className={styles.formError}>
                                        <FaExclamationCircle size={14} />
                                        {formErrors.notaAprobada}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Catedrático */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <FaUser size={16} />
                                Catedrático asignado
                            </label>
                            
                            {loadingCatedraticos ? (
                                <div className={styles.loadingSelect}>
                                    <span>Cargando catedráticos...</span>
                                </div>
                            ) : (
                                <select
                                    value={dpiCatedratico}
                                    onChange={(e) => setDpiCatedratico(e.target.value)}
                                    className={styles.formSelect}
                                    disabled={loading}
                                >
                                    <option value="">Seleccionar catedrático</option>
                                    {catedraticos.map((catedratico) => (
                                        <option key={catedratico.dpi} value={catedratico.dpi}>
                                            {catedratico.usuario 
                                                ? `${catedratico.usuario.primerNombre} ${catedratico.usuario.primerApellido} (${catedratico.dpi})`
                                                : `DPI: ${catedratico.dpi}`
                                            }
                                        </option>
                                    ))}
                                </select>
                            )}
                            
                            {formErrors.dpiCatedratico && (
                                <p className={styles.formError}>
                                    <FaExclamationCircle size={14} />
                                    {formErrors.dpiCatedratico}
                                </p>
                            )}
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
                            disabled={loading || loadingCatedraticos}
                            className={styles.buttonSubmit}
                        >
                            {loading ? (
                                <>
                                    <span className={styles.spinner}>⟳</span>
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <FaGraduationCap size={16} />
                                    Crear Curso
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCourseModal;
