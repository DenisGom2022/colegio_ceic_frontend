import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaUserTie, FaPhone, FaIdCard, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTeacherTable } from '../../teachers/hooks/useTeacherTable';
import styles from './TeacherSelectionModal.module.css';

interface TeacherSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (teacher: { 
    dpi: string;
    nombre: string;
    tipoUsuario: string;
    telefono: string;
  }) => void;
}

const TeacherSelectionModal: React.FC<TeacherSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Usar el hook para obtener los datos de catedráticos
  const {
    teachers,
    loading,
    error,
    refetch
  } = useTeacherTable({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    searchTerm: activeSearchQuery,
    sortField: 'nombre',
    sortDirection: 'asc'
  });

  // Manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '' && activeSearchQuery !== '') {
      setActiveSearchQuery('');
      setCurrentPage(1);
    }
  };

  // Resetear la página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearchQuery]);

  const handleTeacherSelect = (teacher: any) => {
    const fullName = [
      teacher.usuario?.primerNombre,
      teacher.usuario?.segundoNombre,
      teacher.usuario?.tercerNombre,
      teacher.usuario?.primerApellido,
      teacher.usuario?.segundoApellido
    ].filter(Boolean).join(' ');

    onSelect({
      dpi: teacher.dpi,
      nombre: fullName,
      tipoUsuario: teacher.usuario?.tipoUsuario?.descripcion || 'Docente',
      telefono: teacher.usuario?.telefono || 'No disponible'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <FaUserTie className={styles.titleIcon} />
            Seleccionar Catedrático
          </h3>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        <form className={styles.searchContainer} onSubmit={handleSearch}>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nombre o DPI..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Buscar
            </button>
          </div>
        </form>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Cargando catedráticos...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
              <button onClick={refetch} className={styles.retryButton}>
                Reintentar
              </button>
            </div>
          ) : (
            <>
              <div className={styles.contentBody}>
                {!teachers || teachers.items.length === 0 ? (
                  <div className={styles.noResults}>
                    <FaUserTie className={styles.noResultsIcon} />
                    <p>No se encontraron catedráticos</p>
                  </div>
                ) : (
                  <div className={styles.teacherList}>
                    {teachers.items.map((teacher) => {
                      const fullName = [
                        teacher.usuario?.primerNombre,
                        teacher.usuario?.segundoNombre,
                        teacher.usuario?.tercerNombre,
                        teacher.usuario?.primerApellido,
                        teacher.usuario?.segundoApellido
                      ].filter(Boolean).join(' ');
                      
                      return (
                        <div 
                          key={teacher.dpi} 
                          className={styles.teacherItem}
                          onClick={() => handleTeacherSelect(teacher)}
                        >
                          <div className={styles.teacherIcon}>
                            <FaUserTie />
                          </div>
                          <div className={styles.teacherInfo}>
                            <div className={styles.teacherName}>{fullName}</div>
                            <div className={styles.teacherDetails}>
                              <div className={styles.teacherDetailRow}>
                                <FaIdCard className={styles.detailIcon} />
                                <span>DPI: {teacher.dpi}</span>
                              </div>
                              {teacher.usuario?.telefono && (
                                <div className={styles.teacherDetailRow}>
                                  <FaPhone className={styles.detailIcon} />
                                  <span>Tel: {teacher.usuario.telefono}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className={styles.selectIndicator}>→</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {teachers && teachers.totalPages > 1 && (
                <div className={styles.pagination}>
                  <div className={styles.paginationInfo}>
                    Página {currentPage} de {teachers.totalPages} - {teachers.totalItems} catedráticos totales
                  </div>
                  <div className={styles.paginationControls}>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={styles.paginationButton}
                    >
                      <FaChevronLeft />
                      Anterior
                    </button>
                    <div className={styles.paginationNumbers}>
                      {Array.from({ length: Math.min(5, teachers.totalPages) }, (_, i) => {
                        const totalPages = teachers.totalPages;
                        let startPage = Math.max(1, currentPage - 2);
                        let endPage = Math.min(totalPages, startPage + 4);
                        if (endPage - startPage < 4) {
                          startPage = Math.max(1, endPage - 4);
                        }
                        const pageNum = startPage + i;
                        if (pageNum <= endPage) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`${styles.paginationNumber} ${
                                currentPage === pageNum ? styles.paginationNumberActive : ''
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        return null;
                      }).filter(Boolean)}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(teachers.totalPages, prev + 1))}
                      disabled={currentPage === teachers.totalPages}
                      className={styles.paginationButton}
                    >
                      Siguiente
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherSelectionModal;
