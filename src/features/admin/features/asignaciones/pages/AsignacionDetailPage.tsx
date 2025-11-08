import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useOneAsignacion } from "../hooks/useOneAsignacion";
import { generateAsignacionPDF, generateReciboPagoPDF } from "../../../../../services/pdfService";
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
  FaCheckCircle,
  FaExclamationCircle,
  FaFilePdf,
  FaFileInvoiceDollar,
  FaHistory
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

interface Persona {
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
}

interface PagoDisplay {
  tipo: "inscripcion" | "mensual";
  numeroPago: number;
  pagado: boolean;
  monto: string;
  pago?: Pago;
  esSiguiente: boolean;
}

interface Asignacion {
  id: number;
  alumno: Persona;
  idEstadoAsignacion: number;
  estadoAsignacion?: {
    descripcion: string;
  };
  updatedAt: string;
  pagos?: Pago[];
  ciclo?: {
    descripcion: string;
    anio: number;
  };
  grado?: {
    descripcion: string;
  };
  seccion?: {
    descripcion: string;
  };
  createdAt: string;
  updatedBy?: string;
  montoInscripcion?: string;
  montoMensualidad?: string;
}

const AsignacionDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const { asignacion, loading, error } = useOneAsignacion(Number(id));

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

  const getNombreCompleto = (persona: Persona | undefined) => {
    if (!persona) return "N/A";
    return [
      persona.primerNombre,
      persona.segundoNombre,
      persona.tercerNombre,
      persona.primerApellido,
      persona.segundoApellido
    ].filter(Boolean).join(" ");
  };

  const getStatusClass = (estadoId: number) => {
    const statusMap: Record<number, string> = {
      1: styles.statusActive,
      2: styles.statusInactive,
      3: styles.statusPending
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

  const getGenderIcon = (genero: string) => {
    if (!genero) return null;
    const isMale = genero.toLowerCase() === "m" || genero.toLowerCase() === "masculino";
    return isMale ? <FaMale className={styles.iconMale} /> : <FaFemale className={styles.iconFemale} />;
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
        <div className={styles.loadingSpinner} />
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

  const renderInfoEstudiante = () => (
    <div className={styles.studentCard}>
      <div className={styles.studentAvatar}>
        {asignacion.alumno?.primerNombre?.charAt(0)}
        {asignacion.alumno?.primerApellido?.charAt(0)}
      </div>
      <div className={styles.studentDetails}>
        <h3>{getNombreCompleto(asignacion.alumno)}</h3>
        <div className={styles.studentMeta}>
          <span className={styles.metaItem}>
            {getGenderIcon(asignacion.alumno?.genero)}
            <span>{asignacion.alumno?.genero === 'M' ? 'Masculino' : 'Femenino'}</span>
          </span>
          <span className={styles.metaItem}>
            <FaIdCard /> CUI: {asignacion.alumno?.cui}
          </span>
          <span className={styles.metaItem}>
            <FaPhone /> Tel: {asignacion.alumno?.telefono || "Sin teléfono"}
          </span>
        </div>
      </div>
    </div>
  );

  const renderInfoAcademica = () => (
    <div className={styles.infoGrid}>
      <div className={styles.infoCard}>
        <div className={styles.infoCardHeader}>
          <div className={styles.infoCardIcon}>
            <FaBook />
          </div>
          <h4 className={styles.infoCardTitle}>Grado</h4>
        </div>
        <p className={styles.infoCardValue}>
          {asignacion.gradoCiclo?.grado?.nombre || "No asignado"}
        </p>
        <div className={styles.infoCardMeta}>
          <div>Nivel: {asignacion.gradoCiclo?.grado?.nivelAcademico?.descripcion || "N/A"}</div>
          <div>Jornada: {asignacion.gradoCiclo?.grado?.jornada?.descripcion || "N/A"}</div>
        </div>
      </div>
      
      <div className={styles.infoCard}>
        <div className={styles.infoCardHeader}>
          <div className={styles.infoCardIcon}>
            <FaCalendarAlt />
          </div>
          <h4 className={styles.infoCardTitle}>Ciclo Escolar</h4>
        </div>
        <p className={styles.infoCardValue}>
          {asignacion.gradoCiclo?.ciclo?.descripcion || "No asignado"}
        </p>
        <div className={styles.infoCardMeta}>
          <div>
            Estado: 
            <span className={asignacion.gradoCiclo?.ciclo?.fechaFin ? styles.estadoFinalizado : styles.estadoActivo}>
              {asignacion.gradoCiclo?.ciclo?.fechaFin ? " Finalizado" : " Activo"}
            </span>
          </div>
          {asignacion.gradoCiclo?.ciclo?.fechaFin && (
            <div>Finalizado: {formatDate(asignacion.gradoCiclo.ciclo.fechaFin)}</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInfoFinanciera = () => (
    <div className={styles.financeGrid}>
      <div className={styles.financeCard}>
        <div className={styles.financeLabel}>
          Inscripción
        </div>
        <div className={styles.financeValue}>
          {formatCurrency(asignacion.gradoCiclo?.precioInscripcion)}
        </div>
      </div>
      
      <div className={styles.financeCard}>
        <div className={styles.financeLabel}>
          Pago Mensual
        </div>
        <div className={styles.financeValue}>
          {formatCurrency(asignacion.gradoCiclo?.precioPago)}
        </div>
      </div>
      
      <div className={styles.financeCard}>
        <div className={styles.financeLabel}>
          Cantidad de Pagos
        </div>
        <div className={styles.financeValue}>
          {asignacion.gradoCiclo?.cantidadPagos || 0}
        </div>
      </div>
      
      <div className={styles.financeCardTotal}>
        <div className={styles.financeLabel}>
          Total del Ciclo
        </div>
        <div className={styles.financeValue}>
          {formatCurrency(
            parseFloat(asignacion.gradoCiclo?.precioInscripcion || "0") + 
            parseFloat(asignacion.gradoCiclo?.precioPago || "0") * 
            (asignacion.gradoCiclo?.cantidadPagos || 0)
          )}
        </div>
      </div>
    </div>
  );

  const renderInfoAuditoria = () => (
    <div className={styles.infoGrid}>
      <div className={styles.infoCard}>
        <div className={styles.infoCardHeader}>
          <div className={styles.infoCardIcon}>
            <FaRegClock />
          </div>
          <h4 className={styles.infoCardTitle}>Fecha de Creación</h4>
        </div>
        <p className={styles.infoCardValue}>
          {formatDate(asignacion.createdAt)}
        </p>
      </div>
      
      <div className={styles.infoCard}>
        <div className={styles.infoCardHeader}>
          <div className={styles.infoCardIcon}>
            <FaHistory />
          </div>
          <h4 className={styles.infoCardTitle}>Última Actualización</h4>
        </div>
        <p className={styles.infoCardValue}>
          {formatDate(asignacion.updatedAt)}
        </p>
      </div>
    </div>
  );

  const renderResponsables = () => (
    <>
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
                  <span className={styles.metaItem}>
                    <FaIdCard /> {responsable.idResponsable || "N/A"}
                  </span>
                  <span className={styles.metaItem}>
                    <FaPhone /> {responsable.telefono || "Sin teléfono"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No hay responsables registrados para este estudiante</p>
          <Link 
            to={`/admin/estudiantes/${asignacion.alumno?.cui}/responsables/agregar`}
            className={styles.addButton}
          >
            <FaUserFriends /> Agregar Responsable
          </Link>
        </div>
      )}
    </>
  );

  const renderPagos = () => {
    if (!datosPagos) return null;

    const { todosLosPagos, cantidadPagos, totalPagado, totalMora, totalCiclo, pendientePagar } = datosPagos;

    return (
      <>
        <div className={styles.pagosResumen}>
          <div className={`${styles.resumenCard} ${styles.resumenPagado}`}>
            <div className={styles.resumenIcon}>
              <FaCheckCircle />
            </div>
            <div className={styles.resumenInfo}>
              <div className={styles.resumenLabel}>Total Pagado</div>
              <div className={styles.resumenValue}>{formatCurrency(totalPagado)}</div>
            </div>
          </div>

          <div className={`${styles.resumenCard} ${styles.resumenMora}`}>
            <div className={styles.resumenIcon}>
              <FaExclamationCircle />
            </div>
            <div className={styles.resumenInfo}>
              <div className={styles.resumenLabel}>Total Mora</div>
              <div className={styles.resumenValue}>{formatCurrency(totalMora)}</div>
            </div>
          </div>

          <div className={`${styles.resumenCard} ${styles.resumenPendiente}`}>
            <div className={styles.resumenIcon}>
              <FaRegClock />
            </div>
            <div className={styles.resumenInfo}>
              <div className={styles.resumenLabel}>Pendiente</div>
              <div className={styles.resumenValue}>{formatCurrency(pendientePagar)}</div>
            </div>
          </div>

          <div className={styles.resumenTotal}>
            <div className={styles.resumenIcon}>
              <FaDollarSign />
            </div>
            <div className={styles.resumenInfo}>
              <div className={styles.resumenLabel}>Total Ciclo</div>
              <div className={styles.resumenValue}>{formatCurrency(totalCiclo)}</div>
            </div>
          </div>
        </div>

        <div className={styles.pagosList}>
          {todosLosPagos.map((item: PagoDisplay) => (
            <div 
              key={`${item.tipo}-${item.numeroPago}`} 
              className={styles.pagoCard}
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
                <>
                  <div className={styles.pagoDetails}>
                    <div className={styles.pagoDetail}>
                      <FaCalendarAlt />
                      <label>Fecha de Pago:</label>
                      <span>{formatDate(item.pago.fechaPago)}</span>
                    </div>
                    
                    {parseFloat(item.pago.mora) > 0 && (
                      <div className={styles.pagoDetail}>
                        <FaExclamationCircle />
                        <label>Mora:</label>
                        <span className={styles.moraValue}>
                          {formatCurrency(item.pago.mora)}
                        </span>
                      </div>
                    )}
                    
                    <div className={styles.pagoDetail}>
                      <FaRegClock />
                      <label>Registrado:</label>
                      <span>{formatDate(item.pago.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className={styles.pagoAcciones}>
                    <button 
                      className={styles.reciboButton}
                      onClick={() => generateReciboPagoPDF(item.pago!, asignacion)}
                      title="Descargar Recibo de Pago"
                    >
                      <FaFilePdf /> Descargar Recibo
                    </button>
                  </div>
                </>
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
      </>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
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

  return (
    <div className={styles.detailPageContainer}>
      <div className={styles.headerWrapper}>
        <header className={styles.pageHeader}>
          <div className={styles.headerTop}>
            <button onClick={() => navigate("/admin/asignaciones")} className={styles.backButton}>
              <FaArrowLeft /> Regresar a Asignaciones
            </button>

            <div className={styles.headerTitle}>
              <div className={styles.headerIcon}>
                <FaGraduationCap />
              </div>
              <div className={styles.headerTitleText}>
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
                <FaEdit /> Editar Asignación
              </Link>
            </div>
          </div>

          <div className={`${styles.statusBanner} ${getStatusClass(asignacion.idEstadoAsignacion)}`}>
            {getStatusIcon(asignacion.idEstadoAsignacion)}
            <span>{asignacion.estadoAsignacion?.descripcion || "Estado desconocido"}</span>
            <span className={styles.statusDate}>
              Última actualización: {formatDate(asignacion.updatedAt)}
            </span>
          </div>
        </header>

        <div className={styles.navigationBar}>
          <nav className={styles.tabsContainer}>
            <button 
              className={`${styles.tabButton} ${activeTab === "info" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("info")}
            >
              <FaUser /> Información General
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === "responsables" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("responsables")}
            >
              <FaUserFriends /> Responsables
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === "pagos" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("pagos")}
            >
              <FaDollarSign /> Control de Pagos
            </button>
          </nav>
        </div>
      </div>

      <main className={styles.contentContainer}>
        {activeTab === "info" && (
          <div className={styles.infoContainer}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <FaUser className={styles.sectionIcon} /> 
                  Información del Estudiante
                </h2>
              </div>
              <div className={styles.sectionContent}>
                {renderInfoEstudiante()}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <FaBook className={styles.sectionIcon} /> 
                  Información Académica
                </h2>
              </div>
              <div className={styles.sectionContent}>
                {renderInfoAcademica()}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <FaFileInvoiceDollar className={styles.sectionIcon} /> 
                  Información Financiera
                </h2>
              </div>
              <div className={styles.sectionContent}>
                {renderInfoFinanciera()}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <FaHistory className={styles.sectionIcon} /> 
                  Información de Auditoría
                </h2>
              </div>
              <div className={styles.sectionContent}>
                {renderInfoAuditoria()}
              </div>
            </section>
          </div>
        )}
        
        {activeTab === "responsables" && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaUserFriends className={styles.sectionIcon} /> 
                Responsables del Estudiante
              </h2>
            </div>
            <div className={styles.sectionContent}>
              {renderResponsables()}
            </div>
          </section>
        )}

        {activeTab === "pagos" && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaFileInvoiceDollar className={styles.sectionIcon} /> 
                Control de Pagos
              </h2>
            </div>
            <div className={styles.sectionContent}>
              {renderPagos()}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AsignacionDetailPage;
