import React from 'react';
import type { IconType } from 'react-icons';
import styles from './CourseButton.module.css';

interface CourseButtonProps {
  icon: IconType;
  label: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
  to?: string;
}

export const CourseButton: React.FC<CourseButtonProps> = ({
  icon: Icon,
  label,
  description,
  isActive = false,
  onClick
}) => {
  return (
    <div
      className={`${styles.courseButton} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <div className={styles.iconContainer}>
        <Icon className={styles.icon} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.label}>{label}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};
