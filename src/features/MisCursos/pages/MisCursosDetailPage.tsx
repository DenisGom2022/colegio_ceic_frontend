import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMiCurso } from "../hooks/useMiCurso";
import { useCreateTareaAlumno } from "../../TareasAlumno/hooks/useCreateTareaAlumno";
import styles from "./MisCursosDetailPage.module.css";
import type { Bimestre, AsignacionAlumno, Tarea } from "../../../interfaces/interfaces";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";

// Importar los componentes refactorizados
import { CalificarModal } from "../components/CalificarModal";
import { CourseHeader } from "../components/CourseHeader";
import { Tabs } from "../components/Tabs";
import { BimestreSelector } from "../components/BimestreSelector";
import { InfoTab } from "../components/InfoTab";
import { TasksTab } from "../components/TasksTab";
import { NotesTab } from "../components/NotesTab";
import { StudentsTab } from "../components/StudentsTab";
import { CourseSidebar } from "../components/CourseSidebar";

const MisCursosDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { curso: cursoOriginal, error, loading } = useMiCurso(id);
  const [curso, setCurso] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedBimestre, setSelectedBimestre] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para el modal de calificación
  const [modalOpen, setModalOpen] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<string>("");
  const [asignacionId, setAsignacionId] = useState<number | null>(null);
  const { createTarea, loading: loadingCreate, error: errorCreate } = useCreateTareaAlumno();

  // Sincronizar el curso original con el estado local
  useEffect(() => {
    if (cursoOriginal) {
      setCurso(cursoOriginal);
    }
  }, [cursoOriginal]);
  
  useEffect(() => {
    if (curso?.gradoCiclo?.ciclo?.bimestres) {
      // Buscar si hay algún bimestre con estado 1 (activo)
      const bimestres = curso.gradoCiclo.ciclo.bimestres;
      const activeBimestre = bimestres.find((bim: Bimestre) => bim.idEstado === 1);
      if (activeBimestre) {
        setSelectedBimestre(activeBimestre.id);
      } else {
        // Si no hay bimestres activos, seleccionar el primero
        setSelectedBimestre(bimestres[0]?.id || null);
      }
    }
  }, [curso]);

  // Funciones para manejar el modal de calificación
  const handleAbrirModalCalificar = (tarea: Tarea, asignacion: AsignacionAlumno) => {
    setTareaSeleccionada(tarea);
    setAlumnoSeleccionado(`${asignacion.alumno.primerNombre} ${asignacion.alumno.primerApellido}`);
    setAsignacionId(asignacion.id);
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setTareaSeleccionada(null);
    setAlumnoSeleccionado("");
    setAsignacionId(null);
  };

  const handleGuardarCalificacion = async (punteo: number, fechaEntrega: string) => {
    if (!tareaSeleccionada || !asignacionId || !curso) return;
    
    const resultado = await createTarea({
      idTarea: tareaSeleccionada.id,
      idAsignacionAlumno: asignacionId,
      fechaEntrega,
      puntoObtenido: punteo
    });

    if (resultado && resultado.tareaAlumno) {
      // Actualizar el estado local del curso con la nueva calificación
      setCurso((prevCurso: any) => {
        if (!prevCurso) return prevCurso;
        
        // Crear una copia profunda del curso
        const cursoActualizado = { ...prevCurso };
        
        // Actualizar la asignación del alumno con la nueva tarea calificada
        if (cursoActualizado.gradoCiclo?.asignacionesAlumno) {
          cursoActualizado.gradoCiclo.asignacionesAlumno = cursoActualizado.gradoCiclo.asignacionesAlumno.map((asignacion: any) => {
            if (asignacion.id === asignacionId) {
              return {
                ...asignacion,
                tareaAlumnos: [
                  ...(asignacion.tareaAlumnos || []),
                  resultado.tareaAlumno
                ]
              };
            }
            return asignacion;
          });
        }
        
        return cursoActualizado;
      });
      
      // Cerrar modal
      handleCerrarModal();
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.loadingIcon} />
        <p className={styles.loadingText}>Cargando información del curso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle style={{ marginRight: "8px" }} />
        <span>Error al cargar el curso: {error}</span>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle style={{ marginRight: "8px" }} />
        <span>No se encontró el curso solicitado.</span>
      </div>
    );
  }
  
  // Dejar solo para verificar la estructura

  const {
    nombre,
    notaMaxima,
    notaAprobada,
    createdAt,
    gradoCiclo,
    catedratico
  } = curso;
  
  // Verificar si el curso ha finalizado
  const cursoFinalizado = gradoCiclo?.ciclo?.fechaFin !== null;
  
  // Los bimestres están dentro de gradoCiclo.ciclo.bimestres, no directamente en curso
  const bimestres = gradoCiclo?.ciclo?.bimestres || [];
  
  // Obtener el bimestre seleccionado o el primero si no hay selección
  const bimestreActual = bimestres.find((b: Bimestre) => b.id === selectedBimestre) || bimestres[0];
  
  // Mostrar todas las tareas sin filtrar para verificar que existen
  let tareasActuales = curso.tareas || [];
  
  // Calcular el punteo total de todas las tareas del bimestre actual
  const totalPunteoTareas = tareasActuales.length > 0
    ? tareasActuales.reduce((total:any, tarea:any) => total + (tarea.punteo || 0), 0)
    : 0;

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <CourseHeader
        nombre={nombre}
        notaAprobada={notaAprobada}
        notaMaxima={notaMaxima}
        cursoFinalizado={cursoFinalizado}
        gradoCiclo={gradoCiclo}
      />

      {/* Content */}
      <div className={styles.mainContent}>
        <div className={styles.courseContent}>
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {(activeTab === "tasks" || activeTab === "notes") && bimestres.length > 0 && (
            <BimestreSelector
              selectedBimestre={selectedBimestre}
              bimestres={bimestres}
              onBimestreChange={setSelectedBimestre}
            />
          )}

          <div className={styles.contentBody}>
            {activeTab === "info" && (
              <InfoTab
                nombre={nombre}
                notaMaxima={notaMaxima}
                notaAprobada={notaAprobada}
                createdAt={createdAt}
                cursoFinalizado={cursoFinalizado}
                gradoCiclo={gradoCiclo}
              />
            )}

            {activeTab === "tasks" && (
              <TasksTab
                curso={curso}
                cursoFinalizado={cursoFinalizado}
                selectedBimestre={selectedBimestre}
                bimestreActual={bimestreActual}
              />
            )}

            {activeTab === "notes" && (
              <NotesTab
                curso={curso}
                selectedBimestre={selectedBimestre}
                bimestreActual={bimestreActual}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onCalificar={handleAbrirModalCalificar}
                gradoCiclo={gradoCiclo}
              />
            )}

            {activeTab === "students" && (
              <StudentsTab
                gradoCiclo={gradoCiclo}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            )}
          </div>
        </div>

        <CourseSidebar
          catedratico={catedratico}
          notaAprobada={notaAprobada}
          notaMaxima={notaMaxima}
          totalPunteoTareas={totalPunteoTareas}
          cursoFinalizado={cursoFinalizado}
          cursoId={curso.id}
          cursoNombre={curso.nombre}
          selectedBimestre={selectedBimestre}
          bimestres={bimestres}
        />
      </div>

      {/* Modal de calificación */}
      <CalificarModal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        tarea={tareaSeleccionada}
        alumnoNombre={alumnoSeleccionado}
        onSubmit={handleGuardarCalificacion}
        loading={loadingCreate}
        error={errorCreate}
      />
    </div>
  );
};

export default MisCursosDetailPage;
