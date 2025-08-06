import React from 'react';
import styles from './Table.module.css';

export type ColumnDefinition<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  icon?: React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
};

export type ActionButton = {
  icon: React.ReactNode;
  title: string;
  onClick: (item: any, index: number) => void;
}

type TableProps<T> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  actions?: ActionButton[];
  onRowClick?: (item: T, index: number) => void;
  isLoading?: boolean;
  noDataMessage?: string;
  className?: string;
  showIndex?: boolean;
  currentPage?: number;
  pageSize?: number;
};

function Table<T extends Record<string, any>>({
  data,
  columns,
  actions,
  onRowClick,
  isLoading = false,
  noDataMessage = "Sin resultados",
  className = "",
  showIndex = true,
  currentPage = 1,
  pageSize = 10,
}: TableProps<T>) {
  
  const handleRowClick = (item: T, index: number) => {
    if (onRowClick) onRowClick(item, index);
  };

  const renderCellContent = (item: T, column: ColumnDefinition<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    
    return item[column.accessor as keyof T];
  };

  return (
    <div className={`${styles.tableWrapper} ${className}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            {showIndex && <th className={styles.indexHeader}>#</th>}
            {columns.map((column, index) => (
              <th 
                key={index}
                className={styles.tableHeader}
                style={{ 
                  width: column.width,
                  textAlign: column.align || 'left'
                }}
              >
                <span className={styles.headerLabel}>
                  <span>{column.header}</span>
                  {column.icon && <span className={styles.headerIcon}>{column.icon}</span>}
                </span>
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className={styles.actionsHeader}></th>
            )}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length + (showIndex ? 1 : 0) + (actions ? 1 : 0)} className={styles.loadingCell}>
                <div className={styles.loadingSpinner}></div>
                <span>Cargando...</span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (showIndex ? 1 : 0) + (actions ? 1 : 0)} className={styles.emptyCell}>
                {noDataMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr 
                key={idx} 
                className={styles.tableRow}
                onClick={() => handleRowClick(item, idx)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {showIndex && (
                  <td className={styles.indexCell}>
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                )}
                
                {columns.map((column, colIdx) => (
                  <td 
                    key={colIdx}
                    style={{ textAlign: column.align || 'left' }}
                  >
                    {renderCellContent(item, column)}
                  </td>
                ))}
                
                {actions && actions.length > 0 && (
                  <td className={styles.actionsCell}>
                    {actions.map((action, actionIdx) => (
                      <button
                        key={actionIdx}
                        className={styles.actionButton}
                        title={action.title}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(item, idx);
                        }}
                      >
                        {action.icon}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
