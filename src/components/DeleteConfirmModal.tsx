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
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    title,
    message,
    itemId,
    onConfirm,
    onCancel,
    isLoading = false
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(itemId);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <div className={styles.warningIcon}>
                        <FaExclamationTriangle size={24} />
                    </div>
                    <h2 className={styles.modalTitle}>{title}</h2>
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
                        className={styles.confirmButton} 
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
