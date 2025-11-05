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

type TabType = "info" | "responsables" | "pagos";

interface Pago {
  id: number;
  valor: string;
  mora: string;
  fechaPago: string;
  numeroPago: number;
  tipoPagoId: number;
  tipoPago?: { descripcion: string };
  createdAt: string;
}

interface PagoDisplay {
  tipo: "inscripcion" | "mensual";
  numeroPago: number;
  pagado: boolean;
  monto: string;
  pago?: Pago;
  esSiguiente: boolean;
}

const AsignacionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("info");
  
  const asignacionId = id ? parseInt(id) : null;
  const { asignacion, loading, error } = useOneAsignacion(asignacionId);
  
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
  
  const formatCurrency = (amount: string | number | undefined) => {
    if (!amount) return "Q0.00";
    return `Q${parseFloat(amount.toString()).toFixed(2)}`;
  };
  
  const getNombreCompleto = (persona: any) => {
    if (!persona) return "N/A";
    return [
      persona.primerNombre,
      persona.segundoNombre,
      persona.tercerNombre,
      persona.primerApellido,
      persona.segundoApellido
    ].filter(Boolean).join(" ");
  };
  
  const getGenderIcon = (genero: string) => {
    if (!genero) return null;
    const isMale = genero.toLowerCase() === "m" || genero.toLowerCase() === "masculino";
    return isMale ? <FaMale className={styles.iconMale} /> : <FaFemale className={styles.iconFemale} />;
  };
  
  const getStatusClass = (estadoId: number) => {
    const statusMap: Record<number, string> = {
      1: styles.statusActive,
      2: styles.statusInactive
    };
    return statusMap[estadoId] || styles.statusPending;
  };
  
  const getStatusIcon = (estadoId: number) => {
    if (estadoId === 1) return <FaCheckCircle className={styles.iconActive} />;
    if (estadoId === 2) return <FaExclamationCircle className={styles.iconInactive} />;
    return <FaRegClock className={styles.iconPending} />;
  };

  const handleDownloadPDF = () => {
    if (asignacion) {
      generateAsignacionPDF(asignacion);
    }
  };

  const calcularDatosPagos = () => {
    if (!asignacion) return null;

    const inscripcionPagada = asignacion.pagos?.find((p: Pago) => p.tipoPagoId === 1);
    const pagosMensuales = asignacion.pagos?.filter((p: Pago) => p.tipoPagoId === 2) || [];
    const numerosPagados = pagosMensuales.map((p: Pago) => p.numeroPago).sort((a: number, b: number) => a - b);
    
    const siguientePagoPendiente = inscripcionPagada 
      ? (numerosPagados.length === 0 ? 1 : Math.max(...numerosPagados) + 1)
      : null;
    
    const cantidadPagos = asignacion.gradoCiclo?.cantidadPagos || 0;
    const todosLosPagos: PagoDisplay[] = [];
    
    todosLosPagos.push({
      tipo: "inscripcion",
      numeroPago: 0,
      pagado: !!inscripcionPagada,
      monto: asignacion.gradoCiclo?.precioInscripcion || "0",
      pago: inscripcionPagada,
      esSiguiente: !inscripcionPagada
    });
    
    for (let i = 1; i <= cantidadPagos; i++) {
      const pagado = numerosPagados.includes(i);
      const pagoData = pagosMensuales.find((p: Pago) => p.numeroPago === i);
      
      todosLosPagos.push({
        tipo: "mensual",
        numeroPago: i,
        pagado,
        monto: asignacion.gradoCiclo?.precioPago || "0",
        pago: pagoData,
        esSiguiente: siguientePagoPendiente === i
      });
    }

    const totalPagado = (asignacion.pagos || []).reduce((sum: number, pago: Pago) => 
      sum + parseFloat(pago.valor), 0
    );
    
    const totalMora = (asignacion.pagos || []).reduce((sum: number, pago: Pago) => 
      sum + parseFloat(pago.mora || "0"), 0
    );

    const totalCiclo = parseFloat(asignacion.gradoCiclo?.precioInscripcion || "0") + 
      parseFloat(asignacion.gradoCiclo?.precioPago || "0") * cantidadPagos;

    const pendientePagar = totalCiclo - totalPagado;

    return {
      todosLosPagos,
      inscripcionPagada,
      pagosMensuales,
      cantidadPagos,
      totalPagado,
      totalMora,
      totalCiclo,
      pendientePagar
    };
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
        <FaExclamationCircle size={48} />
        <h2>Error al cargar</h2>
        <p>{error.message || "Ha ocurrido un error desconocido"}</p>
        <button onClick={() => navigate("/admin/asignaciones")} className={styles.backButton}>
          <FaArrowLeft /> Volver al listado
        </button>
      </div>
    );
  }

  if (!asignacion) {
    return (
      <div className={styles.notFoundContainer}>
        <FaExclamationCircle size={48} />
        <h2>Asignación no encontrada</h2>
        <p>No se pudo encontrar la asignación solicitada.</p>
        <button onClick={() => navigate("/admin/asignaciones")} className={styles.backButton}>
          <FaArrowLeft /> Volver al listado
        </button>
      </div>
    );
  }

  const datosPagos = calcularDatosPagos();

  const renderHeader = () => (
    <div className={styles.pageHeader}>
      <button onClick={() => navigate("/admin/asignaciones")} className={styles.backButton}>
        <FaArrowLeft /> Volver
      </button>

      <div className={styles.headerTitle}>
        <FaGraduationCap size={28} className={styles.headerIcon} />
        <div>
          <h1>Asignación #{asignacion.id}</h1>
          <p className={styles.subtitle}>
            {getNombreCompleto(asignacion.alumno)}
          </p>
        </div>
      </div>

      <div className={styles.headerActions}>
        <button onClick={handleDownloadPDF} className={styles.pdfButton} title="Descargar PDF">
          <FaFilePdf /> PDF
        </button>
        <Link to={`/admin/asignaciones/editar/${asignacion.id}`} className={styles.editButton}>
          <FaEdit /> Editar
        </Link>
      </div>
    </div>
  );

  const renderStatusBanner = () => (
    <div className={`${styles.statusBanner} ${getStatusClass(asignacion.idEstadoAsignacion)}`}>
      {getStatusIcon(asignacion.idEstadoAsignacion)}
      <span>{asignacion.estadoAsignacion?.descripcion || "Estado desconocido"}</span>
      <span className={styles.statusDate}>
        {formatDate(asignacion.updatedAt)}
      </span>
    </div>
  );

  const renderTabs = () => (
    <div className={styles.tabsContainer}>
      <button 
        className={`${styles.tabButton} ${activeTab === "info" ? styles.activeTab : ""}`}
        onClick={() => setActiveTab("info")}
      >
        <FaIdCard /> Información
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === "responsables" ? styles.activeTab : ""}`}
        onClick={() => setActiveTab("responsables")}
      >
        <FaUserFriends /> Responsables ({asignacion.alumno?.responsables?.length || 0})
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === "pagos" ? styles.activeTab : ""}`}
        onClick={() => setActiveTab("pagos")}
      >
        <FaDollarSign /> Pagos {datosPagos && `(${datosPagos.pagosMensuales.length + (datosPagos.inscripcionPagada ? 1 : 0)}/${datosPagos.cantidadPagos + 1})`}
      </button>
    </div>
  );

  const renderInfoEstudiante = () => (
    <div className={styles.infoSection}>
      <h2 className={styles.sectionTitle}>
        <FaUser className={styles.sectionIcon} /> Información del Estudiante
      </h2>
      
      <div className={styles.studentCard}>
        <div className={styles.studentAvatar}>
          {asignacion.alumno?.primerNombre?.charAt(0)}
          {asignacion.alumno?.primerApellido?.charAt(0)}
        </div>
        <div className={styles.studentDetails}>
          <h3>{getNombreCompleto(asignacion.alumno)}</h3>
          <div className={styles.studentMeta}>
            {getGenderIcon(asignacion.alumno?.genero)}
            <span className={styles.studentCUI}>
              <FaIdCard /> {asignacion.alumno?.cui}
            </span>
            <span className={styles.studentPhone}>
              <FaPhone /> {asignacion.alumno?.telefono || "Sin teléfono"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInfoAcademica = () => (
    <div className={styles.infoSection}>
      <h2 className={styles.sectionTitle}>
        <FaLayerGroup className={styles.sectionIcon} /> Información Académica
      </h2>
      
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.infoCardIcon}>
            <FaBook />
          </div>
          <div className={styles.infoCardContent}>
            <label>Grado</label>
            <h3>{asignacion.gradoCiclo?.grado?.nombre || "No asignado"}</h3>
            <p>Nivel: {asignacion.gradoCiclo?.grado?.nivelAcademico?.descripcion || "N/A"}</p>
            <p>Jornada: {asignacion.gradoCiclo?.grado?.jornada?.descripcion || "N/A"}</p>
          </div>
        </div>
        
        <div className={styles.infoCard}>
          <div className={styles.infoCardIcon}>
            <FaCalendarAlt />
          </div>
          <div className={styles.infoCardContent}>
            <label>Ciclo Escolar</label>
            <h3>{asignacion.gradoCiclo?.ciclo?.descripcion || "No asignado"}</h3>
            <p>Estado: {asignacion.gradoCiclo?.ciclo?.fechaFin ? "Finalizado" : "Activo"}</p>
            {asignacion.gradoCiclo?.ciclo?.fechaFin && (
              <p>Finalizado: {formatDate(asignacion.gradoCiclo.ciclo.fechaFin)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInfoFinanciera = () => (
    <div className={styles.infoSection}>
      <h2 className={styles.sectionTitle}>
        <FaDollarSign className={styles.sectionIcon} /> Información Financiera
      </h2>
      
      <div className={styles.financeGrid}>
        <div className={styles.financeItem}>
          <label>Inscripción</label>
          <span className={styles.financeValue}>
            {formatCurrency(asignacion.gradoCiclo?.precioInscripcion)}
          </span>
        </div>
        
        <div className={styles.financeItem}>
          <label>Pago Mensual</label>
          <span className={styles.financeValue}>
            {formatCurrency(asignacion.gradoCiclo?.precioPago)}
          </span>
        </div>
        
        <div className={styles.financeItem}>
          <label>Cantidad de Pagos</label>
          <span className={styles.financeValue}>
            {asignacion.gradoCiclo?.cantidadPagos || 0} pagos
          </span>
        </div>
        
        <div className={styles.financeItemTotal}>
          <label>Total del Ciclo</label>
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
  );

  const renderInfoAuditoria = () => (
    <div className={styles.infoSection}>
      <h2 className={styles.sectionTitle}>
        <FaRegClock className={styles.sectionIcon} /> Auditoría
      </h2>
      
      <div className={styles.auditGrid}>
        <div className={styles.auditItem}>
          <label>Creación</label>
          <span>{formatDate(asignacion.createdAt)}</span>
        </div>
        <div className={styles.auditItem}>
          <label>Última Actualización</label>
          <span>{formatDate(asignacion.updatedAt)}</span>
        </div>
      </div>
    </div>
  );

  const renderResponsables = () => (
    <div className={styles.responsablesContainer}>
      <h2 className={styles.sectionTitle}>
        <FaUserFriends className={styles.sectionIcon} /> Responsables del Estudiante
      </h2>
      
      {asignacion.alumno?.responsables?.length > 0 ? (
        <div className={styles.responsablesList}>
          {asignacion.alumno.responsables.map((responsable: any) => (
            <div key={responsable.id} className={styles.responsableCard}>
              <div className={styles.responsableAvatar}>
                {responsable.primerNombre?.charAt(0)}
                {responsable.primerApellido?.charAt(0)}
              </div>
              <div className={styles.responsableInfo}>
                <h3>{getNombreCompleto(responsable)}</h3>
                <span className={styles.parentescoTag}>
                  {responsable.idParentesco === 1 ? "Padre" : 
                   responsable.idParentesco === 2 ? "Madre" : "Responsable"}
                </span>
                <div className={styles.responsableDetails}>
                  <span><FaIdCard /> {responsable.idResponsable || "N/A"}</span>
                  <span><FaPhone /> {responsable.telefono || "Sin teléfono"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No hay responsables registrados</p>
          <Link 
            to={`/admin/estudiantes/${asignacion.alumno?.cui}/responsables/agregar`}
            className={styles.addButton}
          >
            + Agregar Responsable
          </Link>
        </div>
      )}
    </div>
  );

  const renderPagos = () => {
    if (!datosPagos) return null;

    const { todosLosPagos, cantidadPagos, totalPagado, totalMora, totalCiclo, pendientePagar } = datosPagos;

    return (
      <div className={styles.pagosContainer}>
        <h2 className={styles.sectionTitle}>
          <FaDollarSign className={styles.sectionIcon} /> Estado de Pagos
        </h2>

        <div className={styles.pagosResumen}>
          <div className={styles.resumenItem}>
            <FaCheckCircle className={styles.resumenIcon} />
            <div>
              <label>Total Pagado</label>
              <span className={styles.resumenValue}>{formatCurrency(totalPagado)}</span>
            </div>
          </div>

          <div className={styles.resumenItem}>
            <FaExclamationCircle className={styles.resumenIcon} />
            <div>
              <label>Total Mora</label>
              <span className={`${styles.resumenValue} ${styles.moraValue}`}>
                {formatCurrency(totalMora)}
              </span>
            </div>
          </div>

          <div className={styles.resumenItem}>
            <FaRegClock className={styles.resumenIcon} />
            <div>
              <label>Pendiente</label>
              <span className={`${styles.resumenValue} ${styles.pendienteValue}`}>
                {formatCurrency(pendientePagar)}
              </span>
            </div>
          </div>

          <div className={`${styles.resumenItem} ${styles.resumenItemTotal}`}>
            <FaDollarSign className={styles.resumenIcon} />
            <div>
              <label>Total Ciclo</label>
              <span className={styles.resumenValueTotal}>{formatCurrency(totalCiclo)}</span>
            </div>
          </div>
        </div>

        <div className={styles.pagosList}>
          {todosLosPagos.map((item: PagoDisplay) => (
            <div 
              key={`${item.tipo}-${item.numeroPago}`} 
              className={`${styles.pagoCard} ${!item.pagado ? styles.pagoCardPendiente : ""}`}
            >
              <div className={styles.pagoHeader}>
                <div className={styles.pagoType}>
                  {item.pagado ? (
                    <FaCheckCircle className={styles.iconPagado} />
                  ) : (
                    <FaRegClock className={styles.iconPendiente} />
                  )}
                  <div>
                    <h4>
                      {item.tipo === "inscripcion" 
                        ? "Inscripción" 
                        : `Pago ${item.numeroPago} de ${cantidadPagos}`}
                    </h4>
                    <span className={styles.pagoStatus}>
                      {item.pagado ? "Pagado" : "Pendiente"}
                    </span>
                  </div>
                </div>
                <div className={styles.pagoMonto}>{formatCurrency(item.monto)}</div>
              </div>
              
              {item.pagado && item.pago ? (
                <div className={styles.pagoDetails}>
                  <div className={styles.pagoDetail}>
                    <FaCalendarAlt />
                    <div>
                      <label>Fecha de Pago</label>
                      <span>{formatDate(item.pago.fechaPago)}</span>
                    </div>
                  </div>
                  
                  {parseFloat(item.pago.mora) > 0 && (
                    <div className={styles.pagoDetail}>
                      <FaExclamationCircle />
                      <div>
                        <label>Mora</label>
                        <span className={styles.moraValue}>
                          {formatCurrency(item.pago.mora)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.pagoDetail}>
                    <FaRegClock />
                    <div>
                      <label>Registrado</label>
                      <span>{formatDate(item.pago.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.pagoAcciones}>
                  {item.esSiguiente ? (
                    <button 
                      className={styles.pagarButton}
                      onClick={() => navigate(`/admin/asignaciones/${asignacion.id}/pagar/${item.tipo === "inscripcion" ? "inscripcion" : item.numeroPago}`)}
                    >
                      <FaDollarSign /> Registrar Pago
                    </button>
                  ) : (
                    <span className={styles.pagoNoDisponible}>
                      {item.tipo === "inscripcion" 
                        ? "Completar inscripción primero" 
                        : `Pagar ${item.numeroPago === 1 ? "inscripción" : `pago ${item.numeroPago - 1}`} primero`}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.detailPageContainer}>
      {renderHeader()}
      {renderStatusBanner()}
      {renderTabs()}

      <div className={styles.contentContainer}>
        {activeTab === "info" && (
          <div className={styles.infoContainer}>
            {renderInfoEstudiante()}
            {renderInfoAcademica()}
            {renderInfoFinanciera()}
            {renderInfoAuditoria()}
          </div>
        )}
        
        {activeTab === "responsables" && renderResponsables()}

        {activeTab === "pagos" && renderPagos()}
      </div>
    </div>
  );
};

export default AsignacionDetailPage;
