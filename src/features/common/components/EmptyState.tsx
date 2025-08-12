import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}

/**
 * Componente para mostrar un estado vacío
 * Útil para cuando no hay resultados en una búsqueda o una lista está vacía
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon, 
  actionButton 
}) => {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 mt-4">
      {icon && (
        <div className="mx-auto mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
          {description}
        </p>
      )}
      {actionButton && (
        <div className="mt-6">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
