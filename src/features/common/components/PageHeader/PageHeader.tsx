import React from 'react';
import type { ReactNode } from 'react';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  actionButton 
}) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.headerTitle}>{title}</h1>
        {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
      </div>
      
      {actionButton && (
        <div className={styles.headerActions}>
          {actionButton}
        </div>
      )}
    </div>
  );
};
