import React from 'react';
import styles from './DeleteConfirmModal.module.css';
import { FaExclamationTriangle } from 'react-icons/fa';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    itemId: string;
    onConfirm: (itemId: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
    confirmButtonText?: string;
    confirmButtonClass?: string;
    modalClass?: string;
    icon?: React.ReactNode;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    title,
    message,
    itemId,
    onConfirm,
    onCancel,
    isLoading = false,
    confirmButtonText = 'Eliminar',
    confirmButtonClass = '',
    modalClass = '',
    icon
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(itemId);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={`${styles.modalContent} ${modalClass ? styles[modalClass] : ''}`}>
                <div className={`${styles.modalHeader} ${modalClass ? styles[modalClass] : ''}`}>
                    <div className={`${styles.warningIcon} ${modalClass ? styles[modalClass] : ''}`}>
                        {icon || <FaExclamationTriangle size={24} />}
                    </div>
                    <h2 className={`${styles.modalTitle} ${modalClass ? styles[modalClass] : ''}`}>{title}</h2>
                </div>
                
                <div className={styles.modalBody}>
                    <p className={styles.modalMessage}>{message}</p>
                </div>
                
                <div className={styles.modalFooter}>
                    <button 
                        className={styles.cancelButton} 
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button 
                        className={`${styles.confirmButton} ${confirmButtonClass ? styles[confirmButtonClass] : ''}`}
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? `Procesando...` : confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
