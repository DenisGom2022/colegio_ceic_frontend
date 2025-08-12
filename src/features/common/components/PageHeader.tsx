import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

/**
 * Componente de encabezado para páginas
 * Muestra un título, subtítulo opcional y un botón de acción opcional
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actionButton }) => {
  return (
    <div className="mb-6 flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actionButton && (
        <div>{actionButton}</div>
      )}
    </div>
  );
};

export default PageHeader;
