import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useOneAsignacion } from "../hooks/useOneAsignacion";
import { generateAsignacionPDF } from "../../../../../services/pdfService";
import styles from "./AsignacionDetailPage.module.css"; 
import {
  FaArrowLeft,
  FaGraduationCap,
  FaEdit,
  FaCalendarAlt,
  FaBook,
  FaUser,
  FaPhone,
  FaIdCard,
  FaMale,
  FaFemale,
  FaRegClock,
  FaDollarSign,
  FaUserFriends,
  FaLayerGroup,
  FaCheckCircle,
  FaExclamationCircle,
  FaFilePdf
} from "react-icons/fa";

const AsignacionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  
  // Convertir el id a número o usar null si no hay id
  const asignacionId = id ? parseInt(id) : null;
  
  const { asignacion, loading, error } = useOneAsignacion(asignacionId);
  
  // Formatear fecha
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  // Formatear precio
  const formatCurrency = (amount: string | number | undefined) => {
    if (!amount) return "Q0.00";
    return `Q${parseFloat(amount.toString()).toFixed(2)}`;
  };
  
  // Obtener nombre completo
  const getNombreCompleto = (persona: any) => {
    if (!persona) return "N/A";
    return [
      persona.primerNombre || '',
      persona.segundoNombre || '',
      persona.tercerNombre || '',
      persona.primerApellido || '',
      persona.segundoApellido || ''
    ].filter(Boolean).join(' ');
  };
  
  // Obtener icono de género
  const getGenderIcon = (genero: string) => {
    if (!genero) return null;
    if (genero.toLowerCase() === 'm' || genero.toLowerCase() === 'masculino') {
      return <FaMale className={styles.iconMale} />;
    }
    return <FaFemale className={styles.iconFemale} />;
  };
  
  // Obtener clase para estado
  const getStatusClass = (estadoId: number) => {
    switch (estadoId) {
      case 1: return styles.statusActive;
      case 2: return styles.statusInactive;
      default: return styles.statusPending;
    }
  };
  
  const getStatusIcon = (estadoId: number) => {
    switch (estadoId) {
      case 1: return <FaCheckCircle className={styles.iconActive} />;
      case 2: return <FaExclamationCircle className={styles.iconInactive} />;
      default: return <FaRegClock className={styles.iconPending} />;
    }
  };

  // Manejar descarga de PDF
  const handleDownloadPDF = () => {
    if (asignacion) {
      generateAsignacionPDF(asignacion);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando detalles de la asignación...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error al cargar la asignación</h2>
        <p>{error.message || "Ha ocurrido un error desconocido"}</p>
        <button 
          onClick={() => navigate("/admin/asignaciones")}
          className={styles.backButton}
        >
          <FaArrowLeft /> Volver al listado
        </button>
      </div>
    );
  }

  if (!asignacion) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Asignación no encontrada</h2>
        <p>No se encontró la asignación solicitada o no existe.</p>
        <button 
          onClick={() => navigate("/admin/asignaciones")}
          className={styles.backButton}
        >
          <FaArrowLeft /> Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailPageContainer}>
      {/* Encabezado */}
      <div className={styles.pageHeader}>
        <button 
          onClick={() => navigate("/admin/asignaciones")}
          className={styles.backButton}
        >
          <FaArrowLeft /> Volver al listado
        </button>

        <div className={styles.headerTitle}>
          <FaGraduationCap size={30} className={styles.headerIcon} />
          <div className={styles.headerText}>
            <h1>Detalle de Asignación #{asignacion.id}</h1>
            <div className={styles.subtitle}>
              Información completa de la asignación
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button 
            onClick={handleDownloadPDF}
            className={styles.pdfButton}
            title="Descargar Ficha de Inscripción"
          >
            <FaFilePdf /> Descargar PDF
          </button>
          
          <Link 
            to={`/admin/asignaciones/editar/${asignacion.id}`}
            className={styles.editButton}
          >
            <FaEdit /> Editar
          </Link>
        </div>
      </div>

      {/* Estado de la asignación */}
      <div className={`${styles.statusBanner} ${getStatusClass(asignacion.idEstadoAsignacion)}`}>
        {getStatusIcon(asignacion.idEstadoAsignacion)}
        <span>Estado: {asignacion.estadoAsignacion?.descripcion || "Desconocido"}</span>
        <span className={styles.statusDate}>
          Última actualización: {formatDate(asignacion.updatedAt)}
        </span>
      </div>

      {/* Pestañas */}
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'info' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <FaIdCard /> Información General
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'responsables' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('responsables')}
        >
          <FaUserFriends /> Responsables ({asignacion.alumno?.responsables?.length || 0})
        </button>
      </div>

      <div className={styles.contentContainer}>
        {activeTab === 'info' && (
          <div className={styles.infoContainer}>
            {/* Información del Estudiante */}
            <div className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>
                <FaUser className={styles.sectionIcon} /> 
                Información del Estudiante
              </h2>
              
              <div className={styles.infoGrid}>
                <div className={styles.studentInfo}>
                  <div className={styles.avatarLarge}>
                    {asignacion.alumno?.primerNombre?.charAt(0) || ''}
                    {asignacion.alumno?.primerApellido?.charAt(0) || ''}
                  </div>
                  
                  <div className={styles.studentName}>
                    <h3>{getNombreCompleto(asignacion.alumno)}</h3>
                    <div className={styles.studentMeta}>
                      {getGenderIcon(asignacion.alumno?.genero)} 
                      <span className={styles.studentCUI}>CUI: {asignacion.alumno?.cui}</span>
                    </div>
                    <div className={styles.contactInfo}>
                      <FaPhone className={styles.contactIcon} /> {asignacion.alumno?.telefono || "No registrado"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>
                <FaLayerGroup className={styles.sectionIcon} /> 
                Información Académica
              </h2>
              
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <div className={styles.infoCardHeader}>
                    <FaBook className={styles.infoCardIcon} />
                    <h3>Grado</h3>
                  </div>
                  <div className={styles.infoCardContent}>
                    <p>{asignacion.gradoCiclo?.grado?.nombre || "No asignado"}</p>
                    <div className={styles.infoCardMeta}>
                      <span>
                        Nivel: {asignacion.gradoCiclo?.grado?.nivelAcademico?.descripcion || "N/A"}
                      </span>
                      <span>
                        Jornada: {asignacion.gradoCiclo?.grado?.jornada?.descripcion || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.infoCard}>
                  <div className={styles.infoCardHeader}>
                    <FaCalendarAlt className={styles.infoCardIcon} />
                    <h3>Ciclo Escolar</h3>
                  </div>
                  <div className={styles.infoCardContent}>
                    <p>{asignacion.gradoCiclo?.ciclo?.descripcion || "No asignado"}</p>
                    <div className={styles.infoCardMeta}>
                      <span>
                        Estado: {asignacion.gradoCiclo?.ciclo?.fechaFin ? "Finalizado" : "Activo"}
                      </span>
                      {asignacion.gradoCiclo?.ciclo?.fechaFin && (
                        <span>
                          Finalizado: {formatDate(asignacion.gradoCiclo?.ciclo?.fechaFin)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Financiera */}
            <div className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>
                <FaDollarSign className={styles.sectionIcon} /> 
                Información Financiera
              </h2>
              
              <div className={styles.infoGrid}>
                <div className={styles.financeCard}>
                  <div className={styles.financeItem}>
                    <span className={styles.financeLabel}>Precio de Inscripción:</span>
                    <span className={styles.financeValue}>
                      {formatCurrency(asignacion.gradoCiclo?.precioInscripcion)}
                    </span>
                  </div>
                  
                  <div className={styles.financeItem}>
                    <span className={styles.financeLabel}>Precio por Pago:</span>
                    <span className={styles.financeValue}>
                      {formatCurrency(asignacion.gradoCiclo?.precioPago)}
                    </span>
                  </div>
                  
                  <div className={styles.financeItem}>
                    <span className={styles.financeLabel}>Cantidad de Pagos:</span>
                    <span className={styles.financeValue}>
                      {asignacion.gradoCiclo?.cantidadPagos || 0}
                    </span>
                  </div>
                  
                  <div className={styles.financeItemTotal}>
                    <span className={styles.financeLabel}>Total del Ciclo:</span>
                    <span className={styles.financeValueTotal}>
                      {formatCurrency(
                        parseFloat(asignacion.gradoCiclo?.precioInscripcion || "0") + 
                        parseFloat(asignacion.gradoCiclo?.precioPago || "0") * 
                        (asignacion.gradoCiclo?.cantidadPagos || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fechas y Auditoría */}
            <div className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>
                <FaRegClock className={styles.sectionIcon} /> 
                Información de Auditoría
              </h2>
              
              <div className={styles.auditGrid}>
                <div className={styles.auditItem}>
                  <span className={styles.auditLabel}>Fecha de Creación:</span>
                  <span className={styles.auditValue}>{formatDate(asignacion.createdAt)}</span>
                </div>
                
                <div className={styles.auditItem}>
                  <span className={styles.auditLabel}>Última Actualización:</span>
                  <span className={styles.auditValue}>{formatDate(asignacion.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'responsables' && (
          <div className={styles.responsablesContainer}>
            <h2 className={styles.sectionTitle}>
              <FaUserFriends className={styles.sectionIcon} /> 
              Listado de Responsables
            </h2>
            
            {asignacion.alumno?.responsables?.length > 0 ? (
              <div className={styles.responsablesList}>
                {asignacion.alumno.responsables.map((responsable: any) => (
                  <div key={responsable.id} className={styles.responsableCard}>
                    <div className={styles.responsableHeader}>
                      <div className={styles.responsableAvatar}>
                        {responsable.primerNombre?.charAt(0) || ''}
                        {responsable.primerApellido?.charAt(0) || ''}
                      </div>
                      <div className={styles.responsableTitle}>
                        <h3>{getNombreCompleto(responsable)}</h3>
                        <div className={styles.parentescoTag}>
                          {/* Aquí podríamos mostrar el tipo de parentesco si lo tuviéramos */}
                          {responsable.idParentesco === 1 ? "Padre" : 
                           responsable.idParentesco === 2 ? "Madre" : "Responsable"}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.responsableDetails}>
                      <div className={styles.responsableDetail}>
                        <span className={styles.detailLabel}>Identificación:</span>
                        <span className={styles.detailValue}>{responsable.idResponsable || "N/A"}</span>
                      </div>
                      
                      <div className={styles.responsableDetail}>
                        <span className={styles.detailLabel}>Teléfono:</span>
                        <span className={styles.detailValue}>{responsable.telefono || "No registrado"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No hay responsables registrados para este estudiante.</p>
                <Link 
                  to={`/admin/estudiantes/${asignacion.alumno?.cui}/responsables/agregar`}
                  className={styles.addButton}
                >
                  + Agregar Responsable
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AsignacionDetailPage;
