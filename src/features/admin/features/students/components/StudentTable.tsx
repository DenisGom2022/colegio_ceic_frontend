import React from 'react';
import type { Student } from '../models/Student';
import Table, { type ColumnDefinition, type ActionButton } from '../../../../../components/Table/Table';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  onDelete: (cui: string) => void;
  deleteLoading?: boolean;
}

const StudentTable: React.FC<StudentTableProps> = ({ 
  students, 
  isLoading, 
  onDelete,
  deleteLoading
}) => {
  const formatName = (student: Student) => {
    const nombres = [
      student.primerNombre,
      student.segundoNombre,
      student.tercerNombre
    ].filter(Boolean).join(' ');
    
    const apellidos = [
      student.primerApellido,
      student.segundoApellido
    ].filter(Boolean).join(' ');
    
    return `${nombres} ${apellidos}`;
  };

  const columns: ColumnDefinition<Student>[] = [
    {
      header: 'CUI',
      accessor: 'cui',
      width: '15%'
    },
    {
      header: 'Nombre Completo',
      accessor: (student) => formatName(student),
      width: '40%'
    },
    {
      header: 'Teléfono',
      accessor: 'telefono',
      width: '15%'
    },
    {
      header: 'Género',
      accessor: 'genero',
      width: '15%'
    }
  ];

  const actions: ActionButton[] = [
    {
      icon: <FaEye />,
      title: 'Ver Detalles',
      onClick: (student: Student) => window.location.href = `/admin/students/${student.cui}`
    },
    {
      icon: <FaEdit />,
      title: 'Editar',
      onClick: (student: Student) => window.location.href = `/admin/students/${student.cui}/edit`
    },
    {
      icon: <FaTrash />,
      title: 'Eliminar',
      onClick: (student: Student) => onDelete(student.cui)
    }
  ];

  return (
    <Table 
      data={students}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      noDataMessage="No hay estudiantes para mostrar"
    />
  );
};

export default StudentTable;
