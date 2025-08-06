import React, { useState } from 'react';
import Table from '../../components/Table';
import type { ColumnDefinition, ActionButton } from '../../components/Table';
import styles from './TableExample.module.css';
import { FaUser, FaIdBadge, FaPhone, FaUserTag, FaCalendarAlt, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

// Assuming this is your data type
interface Usuario {
  usuario: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  telefono: string;
  tipoUsuario: { descripcion: string };
  createdAt: string;
}

const PAGE_SIZE_OPTIONS = [5, 8, 12, 20, 40];

const TableExample: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[1]);
  
  // Ejemplo de datos, reemplazar con tus datos reales
  const usuarios: Usuario[] = [
    { 
      usuario: 'usuario1', 
      primerNombre: 'Juan', 
      segundoNombre: 'Carlos', 
      primerApellido: 'Pérez', 
      segundoApellido: 'Gómez',
      telefono: '555-1234',
      tipoUsuario: { descripcion: 'Administrador' },
      createdAt: '2023-07-15'
    },
    { 
      usuario: 'usuario2', 
      primerNombre: 'María', 
      segundoNombre: 'José', 
      primerApellido: 'López', 
      segundoApellido: 'Fernández',
      telefono: '555-5678',
      tipoUsuario: { descripcion: 'Profesor' },
      createdAt: '2023-07-20'
    },
    { 
      usuario: 'usuario3', 
      primerNombre: 'Pedro', 
      segundoNombre: 'Luis', 
      primerApellido: 'González', 
      segundoApellido: 'Martínez',
      telefono: '555-9012',
      tipoUsuario: { descripcion: 'Estudiante' },
      createdAt: '2023-07-25'
    }
  ];
  
  // Calcular datos paginados
  const totalPages = Math.ceil(usuarios.length / pageSize);
  const paginated = usuarios.slice((page-1)*pageSize, page*pageSize);
  
  // Definir las columnas de la tabla
  const columns: ColumnDefinition<Usuario>[] = [
    { 
      header: 'Usuario', 
      accessor: 'usuario',
      icon: <FaUser />
    },
    { 
      header: 'Nombres', 
      accessor: (item: Usuario) => `${item.primerNombre} ${item.segundoNombre}`,
      icon: <FaIdBadge />
    },
    { 
      header: 'Apellido', 
      accessor: (item: Usuario) => `${item.primerApellido} ${item.segundoApellido}`,
      icon: <FaIdBadge />
    },
    { 
      header: 'Teléfono', 
      accessor: 'telefono',
      icon: <FaPhone />
    },
    { 
      header: 'Tipo Usuario', 
      accessor: (item: Usuario) => (
        <span className={`${styles.badge} ${getTypeClass(item.tipoUsuario.descripcion)}`}>
          {item.tipoUsuario.descripcion}
        </span>
      ),
      icon: <FaUserTag />
    },
    { 
      header: 'Fecha de creación', 
      accessor: (item: Usuario) => <span className={styles.date}>{item.createdAt}</span>,
      icon: <FaCalendarAlt />
    }
  ];
  
  // Definir las acciones para cada fila
  const actions: ActionButton[] = [
    {
      icon: <FaEye />,
      title: 'Ver información',
      onClick: (item: Usuario) => alert(`Ver usuario: ${item.usuario}`)
    },
    {
      icon: <FaEdit />,
      title: 'Editar usuario',
      onClick: (item: Usuario) => alert(`Editar usuario: ${item.usuario}`)
    },
    {
      icon: <FaTrash />,
      title: 'Eliminar usuario',
      onClick: (item: Usuario) => alert(`Eliminar usuario: ${item.usuario}`)
    }
  ];
  
  // Función auxiliar para determinar la clase de la insignia
  function getTypeClass(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'administrador':
        return styles.badgeRed;
      case 'profesor':
        return styles.badgeBlue;
      case 'estudiante':
        return styles.badgeGreen;
      default:
        return '';
    }
  }
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <span>Lista de Usuarios</span> <span className={styles.newBadge}>New</span>
        </div>
        <button className={styles.createButton}>
          + Nuevo Usuario
        </button>
      </header>
      
      <div className={styles.content}>
        <div className={styles.topBar}>
          <h2 className={styles.title}>Usuarios</h2>
          <div className={styles.searchBar}>
            <input
              className={styles.searchInput}
              placeholder="Buscar..."
            />
            <button className={styles.buttonSearch}>
              Buscar
            </button>
            <button className={styles.filterButton}>
              Filtrar
            </button>
          </div>
        </div>
        
        {/* Usar el componente Table reutilizable */}
        <Table
          data={paginated}
          columns={columns}
          actions={actions}
          showIndex={true}
          currentPage={page}
          pageSize={pageSize}
          className={styles.customTable}
        />
        
        <div className={styles.pagination}>
          <select
            className={styles.pageSizeSelect}
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {PAGE_SIZE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt} / pág.</option>
            ))}
          </select>
          <span className={styles.paginationInfo}>
            {usuarios.length} registros
          </span>
          <button
            className={styles.pageButton}
            onClick={() => setPage(p => Math.max(1, p-1))}
            disabled={page === 1}
            aria-label="Anterior"
          >
            &#60;
          </button>
          {Array.from({length: totalPages}, (_,i) => i+1).map(num => (
            <button
              key={num}
              className={`${styles.pageButton} ${num === page ? styles.active : ''}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
          <button
            className={styles.pageButton}
            onClick={() => setPage(p => Math.min(totalPages, p+1))}
            disabled={page === totalPages || totalPages === 0}
            aria-label="Siguiente"
          >
            &#62;
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableExample;
