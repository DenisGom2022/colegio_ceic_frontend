import React, { useEffect } from 'react';
import { FaCheck, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import './NotificationStyles.css';

export interface FloatingNotificationProps {
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  autoCloseTime?: number; // Tiempo en ms para cerrar automáticamente (0 para no cerrar)
}

/**
 * Componente reutilizable para mostrar notificaciones flotantes
 * 
 * @param type - Tipo de notificación: 'error', 'success', 'warning', 'info'
 * @param title - Título de la notificación
 * @param message - Mensaje descriptivo
 * @param onClose - Función para cerrar la notificación
 * @param autoCloseTime - Tiempo en milisegundos para cerrar automáticamente (0 o undefined para no cerrar)
 */
const FloatingNotification: React.FC<FloatingNotificationProps> = ({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  autoCloseTime = 0
}) => {
  // Cerrar automáticamente después del tiempo especificado
  // Por defecto, solo las notificaciones de éxito se cierran automáticamente
  useEffect(() => {
    if (autoCloseTime > 0 || (type === 'success' && autoCloseTime === undefined)) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime || 5000); // Si autoCloseTime es undefined pero es success, usar 5000ms
      
      return () => clearTimeout(timer);
    }
  }, [type, onClose, autoCloseTime]);

  // Determinar el icono según el tipo
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <FaExclamationTriangle className="notificationIcon" />;
      case 'success':
        return <FaCheck className="notificationIcon" />;
      case 'warning':
        return <FaExclamationTriangle className="notificationIcon" />;
      case 'info':
      default:
        return <FaExclamationTriangle className="notificationIcon" />;
    }
  };

  // Clase CSS correspondiente al tipo
  const getNotificationClass = () => {
    switch (type) {
      case 'error':
        return 'errorNotification';
      case 'success':
        return 'successNotification';
      case 'warning':
        return 'warningNotification';
      case 'info':
      default:
        return 'infoNotification';
    }
  };

  return (
    <div className={`floatingNotification ${getNotificationClass()}`}>
      <div className="notificationHeader">
        <h4 className="notificationTitle">
          {getIcon()}
          {title}
        </h4>
        <button className="notificationClose" onClick={onClose} aria-label="Cerrar notificación">
          <FaTimes />
        </button>
      </div>
      <div className="notificationContent">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default FloatingNotification;
