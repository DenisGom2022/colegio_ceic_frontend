import React from 'react';
import styles from '../pages/EditCoursePage.module.css';

interface StatusBadgeProps {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
  icon?: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, text, icon }) => {
  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return styles.successBadge;
      case 'error':
        return styles.errorBadge;
      case 'warning':
        return styles.warningBadge;
      case 'info':
        return styles.infoBadge;
      default:
        return styles.infoBadge;
    }
  };

  return (
    <div className={`${styles.badge} ${getTypeClass()}`}>
      {icon && <span className={styles.badgeIcon}>{icon}</span>}
      <span>{text}</span>
    </div>
  );
};

export default StatusBadge;
