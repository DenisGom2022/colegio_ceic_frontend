import React from 'react';
import styles from '../pages/EditCoursePage.module.css';

interface SectionDividerProps {
  title: string;
  icon?: React.ReactNode;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ title, icon }) => {
  return (
    <div className={styles.sectionDivider}>
      {icon && <span className={styles.sectionIcon}>{icon}</span>}
      <h3>{title}</h3>
    </div>
  );
};

export default SectionDivider;
