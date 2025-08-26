import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaGraduationCap, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaClock, FaLayerGroup } from 'react-icons/fa';
import { type Grado } from '../../grades/services/gradoService';
import { useGradeTable } from '../../grades/hooks/useGradeTable';
import styles from './GradeSelectionModal.module.css';

interface GradeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (grade: { 
    id: number; 
    nombre: string; 
    descripcionCiclo: string;
    nivelAcademico: string;
    jornada: string;
  }) => void;
}

const GradeSelectionModal: React.FC<GradeSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const ITEMS_PER_PAGE = 4; // Número razonable para el modal

  // Usar el hook que ya funciona para obtener paginación desde backend
  const {
    grades,
    loading
  } = useGradeTable({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    searchTerm: activeSearchQuery,
    sortField: 'nombre',
    sortDirection: 'asc'
  });


  // Obtener todos los grados desde el backend con paginación
  const allGradesFromBackend = grades?.grados || [];
  
  // Separar grados activos e inactivos
  const activeGrades = allGradesFromBackend.filter((grade: Grado) => {
    const hasActiveCycle = grade.gradosCiclo?.some(gc => 
      gc.ciclo && gc.ciclo.fechaFin === null
    );
    return hasActiveCycle;
  });

  const inactiveGrades = allGradesFromBackend.filter((grade: Grado) => {
    const hasActiveCycle = grade.gradosCiclo?.some(gc => 
      gc.ciclo && gc.ciclo.fechaFin === null
    );
    return !hasActiveCycle;
  });

  // Mostrar todos los grados (activos primero, luego inactivos)
  const gradesToShow = [...activeGrades, ...inactiveGrades];

  const getActiveCycle = (grade: Grado) => {
    // Primero intentar con ciclosActivos
    if (grade.ciclosActivos && grade.ciclosActivos.length > 0) {
      return grade.ciclosActivos[0];
    }
    
    // Si no, buscar en gradosCiclo un ciclo sin fechaFin
    if (grade.gradosCiclo && grade.gradosCiclo.length > 0) {
      return grade.gradosCiclo.find(gc => gc.ciclo.fechaFin === null);
    }
    
    return null;
  };

  const isGradeActive = (grade: Grado) => {
    const hasActiveCycle = grade.gradosCiclo?.some(gc => 
      gc.ciclo && gc.ciclo.fechaFin === null
    );
    return hasActiveCycle;
  };

  // Manejo de búsqueda
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

  // Resetear página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearchQuery]);

  const handleGradeSelect = (grade: Grado) => {
    const activeCycle = getActiveCycle(grade);
    onSelect({
      id: grade.id,
      nombre: grade.nombre,
      descripcionCiclo: activeCycle?.ciclo?.descripcion || 'Sin ciclo activo',
      nivelAcademico: grade.nivelAcademico?.descripcion || 'Sin nivel',
      jornada: grade.jornada?.descripcion || 'Sin jornada'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <FaGraduationCap className={styles.titleIcon} />
            Seleccionar Grado
          </h3>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar grado o ciclo..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className={styles.searchInput}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
          />
        </div>

        <div className={styles.infoBanner}>
          <div className={styles.infoBannerContent}>
            <div className={styles.infoItem}>
              <div className={styles.activeIndicator}></div>
              <span>Grados con ciclo activo</span>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.inactiveIndicator}></div>
              <span>Grados sin ciclo activo</span>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Cargando grados disponibles...</p>
            </div>
          ) : (
            <>
              <div className={styles.contentBody}>
                <div className={styles.gradesList}>
                  {gradesToShow.length === 0 ? (
                    <div className={styles.noResults}>
                      <FaGraduationCap className={styles.noResultsIcon} />
                      <p>No se encontraron grados disponibles</p>
                      <small>Los grados deben tener un ciclo activo para crear cursos</small>
                    </div>
                  ) : (
                    gradesToShow.map((grade) => {
                      const activeCycle = getActiveCycle(grade);
                      const isActive = isGradeActive(grade);
                      
                      return (
                        <div
                          key={grade.id}
                          className={`${styles.gradeItem} ${!isActive ? styles.gradeItemInactive : ''}`}
                          onClick={() => handleGradeSelect(grade)}
                        >
                          <div className={`${styles.gradeIcon} ${!isActive ? styles.gradeIconInactive : ''}`}>
                            <FaGraduationCap />
                            {!isActive && (
                              <div className={styles.inactiveOverlay}>
                                <span className={styles.inactiveText}>INACTIVO</span>
                              </div>
                            )}
                          </div>
                          <div className={styles.gradeInfo}>
                            <div className={`${styles.gradeName} ${!isActive ? styles.gradeNameInactive : ''}`}>
                              {grade.nombre}
                              {!isActive && <span className={styles.inactiveBadge}>Sin ciclo activo</span>}
                            </div>
                            <div className={styles.gradeDetails}>
                              <div className={styles.gradeDetailRow}>
                                <FaLayerGroup className={styles.detailIcon} />
                                <span className={!isActive ? styles.inactiveDetails : ''}>
                                  {grade.nivelAcademico?.descripcion || 'Sin nivel'}
                                </span>
                              </div>
                              <div className={styles.gradeDetailRow}>
                                <FaClock className={styles.detailIcon} />
                                <span className={!isActive ? styles.inactiveDetails : ''}>
                                  {grade.jornada?.descripcion || 'Sin jornada'}
                                </span>
                              </div>
                              <div className={styles.gradeDetailRow}>
                                <FaCalendarAlt className={styles.detailIcon} />
                                <span className={!isActive ? styles.inactiveDetails : ''}>
                                  {activeCycle?.ciclo?.descripcion || 'Sin ciclo activo'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`${styles.selectIndicator} ${!isActive ? styles.selectIndicatorInactive : ''}`}>
                            →
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Paginación - Temporalmente siempre visible para debug */}
              <div className={styles.pagination}>
                <div className={styles.paginationInfo}>
                  Página {currentPage} de {grades?.totalPages || 1} - {grades?.total || 0} grados totales
            
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
                      {Array.from({ length: Math.min(5, grades?.totalPages || 1) }, (_, i) => {
                        const totalPages = grades?.totalPages || 1;
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
                      onClick={() => setCurrentPage(prev => Math.min(grades?.totalPages || 1, prev + 1))}
                      disabled={currentPage === (grades?.totalPages || 1)}
                      className={styles.paginationButton}
                    >
                      Siguiente
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeSelectionModal;
