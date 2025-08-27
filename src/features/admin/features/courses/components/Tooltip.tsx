import React, { useState, useRef, useEffect } from 'react';
import styles from '../pages/EditCoursePage.module.css';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent tooltip from going off screen
    const adjustPosition = () => {
      if (tooltipRef.current && isVisible) {
        const rect = tooltipRef.current.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          tooltipRef.current.style.right = 'auto';
          tooltipRef.current.style.left = '0';
        }
      }
    };
    
    adjustPosition();
  }, [isVisible]);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={styles.tooltip} ref={tooltipRef}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
