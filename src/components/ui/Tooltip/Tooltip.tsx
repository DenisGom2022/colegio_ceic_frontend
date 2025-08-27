import React from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'top' }) => {
  return (
    <div className={styles.tooltipWrapper}>
      {children}
      <span className={`${styles.tooltipText} ${styles[position]}`}>
        {text}
      </span>
    </div>
  );
};

export default Tooltip;
