import React, { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaSearch, 
  FaUser, 
  FaChevronLeft, 
  FaChevronRight,
  FaSpinner,
  FaExclamationCircle,
  FaUserTie,
  FaIdCard,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';
import styles from './TeacherSelectionModal.module.css';
import { useCatedraticos } from '../hooks';

interface Teacher {
  dpi: string;
  nombres: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  genero?: string;
}

interface TeacherSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (teacher: Teacher) => void;
}

const TeacherSelectionModal: React.FC<TeacherSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const { catedraticos, loading, error, getCatedraticos } = useCatedraticos();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  
  const itemsPerPage = 6;

  useEffect(() => {
    if (isOpen) {
      getCatedraticos();
      setSearchTerm('');
      setCurrentPage(1);
      setSelectedTeacher(null);
    }
  }, [isOpen, getCatedraticos]);

  const filteredTeachers = catedraticos?.filter((teacher: Teacher) =>
    teacher.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.dpi.includes(searchTerm)
  ) || [];

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeachers = filteredTeachers.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleConfirmSelection = () => {
    if (selectedTeacher) {
      onSelect(selectedTeacher);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setCurrentPage(1);
    setSelectedTeacher(null);
    onClose();
  };

  const formatDPI = (dpi: string) => {
    // Formato DPI: 1234567890123 -> 1234-56789-0123
    if (dpi.length === 13) {
      return `${dpi.slice(0, 4)}-${dpi.slice(4, 9)}-${dpi.slice(9)}`;
    }
    return dpi;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FaUserTie size={20} />
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.modalTitle}>Seleccionar Catedrático</h2>
              <p className={styles.modalSubtitle}>
                Elija el catedrático que impartirá este curso
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Cerrar modal"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Search */}
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o DPI..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Content */}
        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <FaSpinner className={styles.loadingIcon} />
              <span>Cargando catedráticos...</span>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <FaExclamationCircle className={styles.errorIcon} />
              <h3>Error al cargar los datos</h3>
              <p>{error}</p>
              <button 
                onClick={() => getCatedraticos()}
                className={styles.retryButton}
              >
                Reintentar
              </button>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className={styles.emptyContainer}>
              <FaUser className={styles.emptyIcon} />
              <h3>No se encontraron catedráticos</h3>
              <p>
                {searchTerm 
                  ? `No hay resultados para "${searchTerm}"`
                  : 'No hay catedráticos disponibles'
                }
              </p>
            </div>
          ) : (
            <>
              {/* Teachers Grid */}
              <div className={styles.teachersGrid}>
                {paginatedTeachers.map((teacher: Teacher) => (
                  <div
                    key={teacher.dpi}
                    className={`${styles.teacherCard} ${
                      selectedTeacher?.dpi === teacher.dpi ? styles.selected : ''
                    }`}
                    onClick={() => handleTeacherSelect(teacher)}
                  >
                    <div className={styles.teacherAvatar}>
                      <FaUser size={24} />
                    </div>
                    
                    <div className={styles.teacherInfo}>
                      <h3 className={styles.teacherName}>
                        {teacher.nombres} {teacher.apellidos}
                      </h3>
                      
                      <div className={styles.teacherDetails}>
                        <div className={styles.teacherDetail}>
                          <FaIdCard size={12} />
                          <span>{formatDPI(teacher.dpi)}</span>
                        </div>
                        
                        {teacher.email && (
                          <div className={styles.teacherDetail}>
                            <FaEnvelope size={12} />
                            <span>{teacher.email}</span>
                          </div>
                        )}
                        
                        {teacher.telefono && (
                          <div className={styles.teacherDetail}>
                            <FaPhone size={12} />
                            <span>{teacher.telefono}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedTeacher?.dpi === teacher.dpi && (
                      <div className={styles.selectedIndicator}>
                        <div className={styles.selectedDot}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <div className={styles.paginationInfo}>
                    Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTeachers.length)} de {filteredTeachers.length} catedráticos
                  </div>
                  
                  <div className={styles.paginationControls}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={styles.paginationButton}
                      aria-label="Página anterior"
                    >
                      <FaChevronLeft size={12} />
                    </button>

                    <div className={styles.pageNumbers}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        if (
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`${styles.pageNumber} ${
                                currentPage === page ? styles.active : ''
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 || 
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className={styles.pageEllipsis}>
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={styles.paginationButton}
                      aria-label="Página siguiente"
                    >
                      <FaChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button
            onClick={handleClose}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedTeacher}
            className={styles.selectButton}
          >
            Seleccionar catedrático
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherSelectionModal;
