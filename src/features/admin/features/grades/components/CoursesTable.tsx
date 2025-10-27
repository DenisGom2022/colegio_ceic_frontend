import type { FC } from "react"
//import type { Curso } from "../services/gradoService"
import type { Usuario } from "../../users";
import { Link } from "react-router-dom";
import { FaEye, FaPencilAlt, FaTrash, FaGraduationCap, FaUser, FaPlus } from "react-icons/fa";

import styles from "./CoursesTable.module.css";
import type { Curso } from "../../../../../interfaces/interfaces";

interface CoursesTableProps {
    cursos: Curso[];
    gradeId?: string | number;
    showAddButton?: boolean;
}

const formatNombreCompleto = (usuario: Usuario) => {
    // Construye el nombre completo, omitiendo espacios extra si faltan nombres/apellidos
    const partes = [
        usuario.primerNombre,
        usuario.segundoNombre,
        usuario.tercerNombre,
        usuario.primerApellido,
        usuario.segundoApellido
    ].filter((parte): parte is string => Boolean(parte));
    return partes.join(" ");
}

const CoursesTable: FC<CoursesTableProps> = ({ cursos, gradeId, showAddButton = false }) => {

    if (!cursos || cursos.length === 0) {
        return (
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <FaGraduationCap size={16} />
                        </div>
                        <h3 className={styles.tableTitle}>Cursos Asignados</h3>
                        <div className={styles.coursesCount}>0 cursos</div>
                        {showAddButton && gradeId && (
                            <Link
                                to={`/admin/grado/${gradeId}/agregar-curso`}
                                className={styles.addCourseBtn}
                                title="Agregar nuevo curso"
                            >
                                <FaPlus size={14} />
                                <span>Agregar Curso</span>
                            </Link>
                        )}
                    </div>
                </div>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <FaGraduationCap size={32} />
                    </div>
                    <h4 className={styles.emptyTitle}>No hay cursos asignados</h4>
                    <p className={styles.emptyDescription}>
                        Este grado aún no tiene cursos asignados para el ciclo actual.
                    </p>
                    {showAddButton && gradeId && (
                        <Link
                            to={`/admin/grado/${gradeId}/agregar-curso`}
                            className={styles.emptyStateBtn}
                        >
                            <FaPlus size={16} />
                            Agregar primer curso
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.headerIcon}>
                        <FaGraduationCap size={16} />
                    </div>
                    <h3 className={styles.tableTitle}>Cursos Asignados</h3>
                    <div className={styles.coursesCount}>
                        {cursos.length} {cursos.length === 1 ? 'curso' : 'cursos'}
                    </div>
                    {showAddButton && gradeId && (
                        <Link
                            to={`/admin/grado/${gradeId}/agregar-curso`}
                            className={styles.addCourseBtn}
                            title="Agregar nuevo curso"
                        >
                            <FaPlus size={14} />
                            <span>Agregar Curso</span>
                        </Link>
                    )}
                </div>
            </div>
            
            <div className={styles.tableWrapper}>
                <table className={styles.coursesTable}>
                    <thead>
                        <tr>
                            <th className={styles.headerCell}>
                                <span className={styles.headerText}>ID</span>
                            </th>
                            <th className={styles.headerCell}>
                                <span className={styles.headerText}>Nombre del Curso</span>
                            </th>
                            <th className={styles.headerCell}>
                                <span className={styles.headerText}>Nota Máxima</span>
                            </th>
                            <th className={styles.headerCell}>
                                <span className={styles.headerText}>Nota Aprobada</span>
                            </th>
                            <th className={styles.headerCell}>
                                <span className={styles.headerText}>Catedrático</span>
                            </th>
                            <th className={styles.headerCell}>
                                <span className={styles.headerText}>Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cursos.map((curso) => (
                            <tr key={curso.id} className={styles.tableRow}>
                                <td className={styles.tableCell}>
                                    <span className={styles.courseId}>{curso.id}</span>
                                </td>
                                <td className={styles.tableCell}>
                                    <div className={styles.courseInfo}>
                                        <span className={styles.courseName}>{curso.nombre}</span>
                                    </div>
                                </td>
                                <td className={styles.tableCell}>
                                    <div className={styles.badgeContainer}>
                                        <span className={styles.badgeMax}>
                                            {curso.notaMaxima} pts
                                        </span>
                                    </div>
                                </td>
                                <td className={styles.tableCell}>
                                    <div className={styles.badgeContainer}>
                                        <span className={styles.badgeAprob}>
                                            {curso.notaAprobada} pts
                                        </span>
                                    </div>
                                </td>
                                <td className={styles.tableCell}>
                                    <div className={styles.teacherInfo}>
                                        <div className={styles.teacherIcon}>
                                            <FaUser size={12} />
                                        </div>
                                        <span className={styles.teacherName}>
                                            {formatNombreCompleto(curso.catedratico.usuario)}
                                        </span>
                                    </div>
                                </td>
                                <td className={styles.tableCell}>
                                    <div className={styles.actionsCell}>
                                        <Link
                                            to={`/admin/cursos/${curso.id}?return=grade&gradeId=${gradeId}`}
                                            className={`${styles.actionBtn} ${styles.viewBtn}`} 
                                            title="Ver detalles del curso"
                                        >
                                            <FaEye size={14} />
                                        </Link>
                                        <button 
                                            className={`${styles.actionBtn} ${styles.editBtn}`} 
                                            title="Editar curso"
                                        >
                                            <FaPencilAlt size={14} />
                                        </button>
                                        <button 
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                                            title="Eliminar curso"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CoursesTable
