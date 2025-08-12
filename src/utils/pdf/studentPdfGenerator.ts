import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Student } from '../../features/admin/features/students/models/Student';

// Colores corporativos profesionales (paleta empresarial)
const COLORS = {
  primary: [25, 47, 89], // Azul oscuro corporativo
  secondary: [70, 100, 150], // Azul medio
  accent: [0, 122, 204], // Azul brillante
  complementary: [151, 71, 34], // Marrón complementario
  neutral: [77, 77, 77], // Gris neutro
  light: [240, 240, 240], // Gris claro
  ultraLight: [250, 250, 250], // Casi blanco
  text: [33, 33, 33], // Texto principal
  lightText: [100, 100, 100], // Texto secundario
  success: [39, 115, 66], // Verde corporativo
  warning: [193, 135, 20], // Naranja corporativo
  danger: [175, 35, 35], // Rojo corporativo
  chart: {
    blue: [65, 105, 225],
    green: [39, 115, 66],
    orange: [255, 137, 20],
    purple: [128, 0, 128],
    red: [175, 35, 35]
  }
};

// Función para generar el PDF de estudiantes con estilo profesional
export const generateStudentsPDF = (students: Student[], searchQuery: string = ""): void => {
  // Crear un nuevo documento PDF (tamaño carta)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter' // Tamaño carta (215.9 x 279.4 mm)
  });
  
  // Información de fecha y hora
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  const formattedTime = today.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Añadir encabezado con diseño profesional empresarial
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Fondo para el encabezado (gradiente simulado)
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(0, 0, pageWidth, 32, 'F');
  
  // Franja de acento
  doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.rect(0, 32, pageWidth, 3, 'F');
  
  // Franja inferior de color
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');
  
  // Añadir texto del encabezado
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('COLEGIO CEIC', 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('EXCELENCIA EDUCATIVA', 15, 26);
  
  // Título del informe (lado derecho)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('INFORME DE ESTUDIANTES', pageWidth - 15, 20, { align: 'right' });
  
  // Subtítulo con referencia (lado derecho)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const reportRef = `REF: EST-${today.toISOString().slice(0, 10).replace(/-/g, '')}`;
  doc.text(reportRef, pageWidth - 15, 26, { align: 'right' });
  
  // Sección de información del documento
  doc.setFillColor(COLORS.ultraLight[0], COLORS.ultraLight[1], COLORS.ultraLight[2]);
  doc.roundedRect(15, 45, pageWidth - 30, 30, 2, 2, 'F');
  
  // Líneas decorativas
  doc.setDrawColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.setLineWidth(0.5);
  doc.line(25, 55, 75, 55);
  doc.line(pageWidth - 75, 55, pageWidth - 25, 55);
  
  // Información del reporte en formato vertical (más organizado)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text('INFORMACIÓN DEL REPORTE', pageWidth / 2, 52, { align: 'center' });
  
  // Sección de información vertical
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  
  // Datos en formato vertical (más espacio y mejor organización)
  const startY = 58;
  const lineHeight = 5;
  
  // Primera línea: Fecha de emisión
  doc.setFont('helvetica', 'bold');
  doc.text('FECHA DE EMISIÓN:', 25, startY);
  doc.setFont('helvetica', 'normal');
  doc.text(formattedDate, 75, startY);
  
  // Segunda línea: Hora de generación
  doc.setFont('helvetica', 'bold');
  doc.text('HORA:', 25, startY + lineHeight);
  doc.setFont('helvetica', 'normal');
  doc.text(formattedTime, 75, startY + lineHeight);
  
  // Tercera línea: Total registros
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL ESTUDIANTES:', 25, startY + lineHeight * 2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.text(students.length.toString(), 75, startY + lineHeight * 2);
  
  // Cuarta línea: Filtro aplicado
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('FILTRO APLICADO:', 25, startY + lineHeight * 3);
  
  if (searchQuery) {
    doc.setFont('helvetica', 'italic');
    doc.text(`"${searchQuery}"`, 75, startY + lineHeight * 3);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
    doc.text('Ninguno', 75, startY + lineHeight * 3);
  }
  
  // Restaurar color de texto
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  
  // Obtener nombre completo del estudiante
  const getNombreCompleto = (student: Student): string => {
    return `${student.primerNombre || ''} ${student.segundoNombre || ''} ${student.tercerNombre || ''} ${student.primerApellido || ''} ${student.segundoApellido || ''}`.trim().replace(/\s+/g, ' ');
  };
  
  // Formatear género
  const formatGenero = (genero: string): string => {
    return genero === 'M' ? 'Masculino' : 'Femenino';
  };
  
  // Formatear fecha
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // Espacio adicional para mejor distribución vertical
  const tableStartPosition = 80;
  
  // Título de la tabla con estilo corporativo mejorado
  doc.setFillColor(COLORS.light[0], COLORS.light[1], COLORS.light[2]);
  doc.roundedRect(15, tableStartPosition, pageWidth - 30, 10, 2, 2, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text('LISTADO DE ESTUDIANTES', pageWidth / 2, tableStartPosition + 7, { align: 'center' });
  
  // Preparar los datos para la tabla con formato profesional
  const tableData = students.map((student, index) => {
    // Crear índice numerado con formato
    const indexFormatted = (index + 1).toString().padStart(2, '0');
    
    return [
      indexFormatted, // Índice numerado
      getNombreCompleto(student),
      student.cui,
      formatGenero(student.genero),
      student.telefono || 'N/A',
      student.responsables?.length.toString() || '0',
      formatDate(student.createdAt)
    ];
  });

  // Agregar tabla con diseño profesional corporativo
  autoTable(doc, {
    head: [['#', 'Nombre Completo', 'CUI', 'Género', 'Teléfono', 'Resp.', 'Fecha Ingreso']],
    body: tableData,
    startY: tableStartPosition + 14, // Posición ajustada para el formato vertical
    // Espacio para evitar superposiciones
    headStyles: {
      fillColor: [COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      cellPadding: 5
    },
    bodyStyles: {
      fontSize: 8.5,
      cellPadding: 4,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
      valign: 'middle'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // Muy sutilmente coloreado
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' }, // #
      1: { cellWidth: 'auto', minCellWidth: 60 }, // Nombre
      2: { cellWidth: 28, halign: 'center' }, // CUI
      3: { cellWidth: 22, halign: 'center' }, // Género
      4: { cellWidth: 22, halign: 'center' }, // Teléfono
      5: { cellWidth: 12, halign: 'center', fontStyle: 'bold' }, // Responsables
      6: { cellWidth: 28, halign: 'center' } // Fecha
    },
    margin: { top: 25, left: 15, right: 15, bottom: 25 },
    styles: {
      font: 'helvetica',
      overflow: 'linebreak'
    },
    showHead: 'everyPage',
    tableWidth: 'auto',
    // Ajustar altura de encabezado para asegurar consistencia
    didDrawCell: function(data) {
      // Si es la primera fila de una nueva página, verificar espacio disponible
      if (data.row.index === 0 && data.section === 'body') {
        // Asegurar que hay suficiente espacio para la fila completa
        const cellHeight = data.cell.height;
        const pageHeight = doc.internal.pageSize.getHeight();
        const currentY = data.cursor?.y || 0;
        
        // Si hay riesgo de corte, mover a la siguiente página
        if (currentY + cellHeight > pageHeight - 30) {
          doc.addPage();
        }
      }
    },
    didParseCell: function(data) {
      // Dar formato especial a algunas celdas
      const col = data.column.index;
      const isHeader = data.section === 'head';
      
      // Dar formato a columnas específicas
      if (!isHeader) {
        // Dar formato a la columna de género
        if (col === 3) {
          const genero = data.cell.text[0].toString();
          if (genero.includes('Masculino')) {
            data.cell.styles.fontStyle = 'normal';
            data.cell.styles.textColor = [0, 87, 183]; // Azul masculino
          } else if (genero.includes('Femenino')) {
            data.cell.styles.fontStyle = 'normal';
            data.cell.styles.textColor = [189, 16, 224]; // Morado femenino
          }
        }
        
        // Dar formato a la columna de responsables
        else if (col === 5 && parseInt(data.cell.text[0].toString()) > 0) {
          data.cell.styles.textColor = [39, 115, 66]; // Verde para estudiantes con responsables
        } 
        else if (col === 5 && parseInt(data.cell.text[0].toString()) === 0) {
          data.cell.styles.textColor = [175, 35, 35]; // Rojo para estudiantes sin responsables
        }
      }
    },
    didDrawPage: (data: { pageNumber: number; }) => {
      // Asegurar que el contenido no se superponga con los encabezados y pies de página
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const currentPage = data.pageNumber;
      
      // Configuramos el espacio adecuado para el contenido de la tabla
      
      // Cabecera en todas las páginas (excepto la primera)
      if (currentPage > 1) {
        // Fondo para el encabezado de páginas secundarias
        doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        doc.rect(0, 0, pageWidth, 20, 'F');
        
        // Aseguramos espacio para el contenido de la tabla
        
        // Línea de acento
        doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
        doc.rect(0, 20, pageWidth, 2, 'F');
        
        // Logo y título en páginas secundarias
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('COLEGIO CEIC', 15, 8);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('EXCELENCIA EDUCATIVA', 15, 14);
        
        // Título del reporte en páginas secundarias
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORME DE ESTUDIANTES', pageWidth - 15, 8, { align: 'right' });
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(reportRef, pageWidth - 15, 14, { align: 'right' });
      }
      
      // Pie de página profesional en todas las páginas
      // Fondo del pie de página
      doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');
      
      // Línea de acento superior del pie de página
      doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
      doc.rect(0, pageHeight - 18, pageWidth, 1, 'F');
      
      // Información del pie de página
      doc.setTextColor(255, 255, 255);
      
      // Espacio reservado para la numeración de página
      // La numeración completa se agregará al final del proceso
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      // No agregamos texto aquí, lo haremos al final
      
      // Información de copyright
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(
        `COLEGIO CEIC © ${new Date().getFullYear()} | CONFIDENCIAL`,
        15,
        pageHeight - 10
      );
      
      // Fecha y hora en el centro del pie de página
      const dateTime = new Date().toLocaleString('es-ES');
      doc.setFontSize(7);
      doc.text(
        `GENERADO: ${dateTime}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      
      // Decoración del pie de página con elementos profesionales
      doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
      doc.rect(15, pageHeight - 6, 20, 1, 'F');
      doc.rect(pageWidth - 35, pageHeight - 6, 20, 1, 'F');
      
      // Se eliminó la marca de agua para un aspecto más limpio y profesional
    }
  });
  
  // Añadir resumen o estadísticas al final con diseño profesional
  const totalPages = (doc as any).getNumberOfPages();
  const lastPage = totalPages;
  
  // Cambiar a la última página para añadir resumen
  doc.setPage(lastPage);
  
  // Añadir información de resumen con diseño corporativo
  const yPosition = doc.internal.pageSize.getHeight() - 30;
  
  // Contar estudiantes por género
  const masculinos = students.filter(s => s.genero === 'M').length;
  const femeninos = students.filter(s => s.genero === 'F').length;
  
  // Marco elegante para la sección de resumen
  doc.setFillColor(COLORS.light[0], COLORS.light[1], COLORS.light[2]);
  doc.roundedRect(15, yPosition - 52, doc.internal.pageSize.getWidth() - 30, 35, 3, 3, 'F');
  
  // Barra superior del marco de resumen
  doc.setFillColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
  doc.rect(15, yPosition - 52, doc.internal.pageSize.getWidth() - 30, 8, 'F');
  
  // Título del resumen
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('RESUMEN DE DATOS', doc.internal.pageSize.getWidth() / 2, yPosition - 46, { align: 'center' });
  
  // Datos estadísticos con formato vertical mejorado
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.setFontSize(9);
  
  // Calcular porcentajes
  const porcMasculinos = students.length ? Math.round((masculinos / students.length) * 100) : 0;
  const porcFemeninos = students.length ? Math.round((femeninos / students.length) * 100) : 0;
  
  // Formato vertical para mejor visualización (centrado)
  const centerX = pageWidth / 2;
  
  // Tabla de datos
  // Fila 1 - Título
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]);
  doc.text('ESTADÍSTICAS DE ESTUDIANTES', centerX, yPosition - 38, { align: 'center' });
  
  // Fila 2 - Total de estudiantes
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.text('Total de estudiantes:', centerX - 60, yPosition - 30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.text(students.length.toString(), centerX + 20, yPosition - 30);
  
  // Línea divisoria
  doc.setDrawColor(COLORS.light[0], COLORS.light[1], COLORS.light[2]);
  doc.setLineWidth(0.5);
  doc.line(centerX - 70, yPosition - 26, centerX + 70, yPosition - 26);
  
  // Fila 3 - Distribución por género
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('DISTRIBUCIÓN POR GÉNERO', centerX, yPosition - 20, { align: 'center' });
  
  // Fila 4 - Masculino
  doc.setFont('helvetica', 'bold');
  doc.text('Masculino:', centerX - 40, yPosition - 14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 87, 183); // Color masculino
  doc.text(`${masculinos} (${porcMasculinos}%)`, centerX + 10, yPosition - 14);
  
  // Fila 5 - Femenino
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.text('Femenino:', centerX - 40, yPosition - 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(189, 16, 224); // Color femenino
  doc.text(`${femeninos} (${porcFemeninos}%)`, centerX + 10, yPosition - 8);
  
  // Sección de firmas y validación
  doc.setDrawColor(COLORS.light[0], COLORS.light[1], COLORS.light[2]);
  doc.setLineWidth(0.5);
  
  // Línea para firma
  doc.line(25, yPosition - 5, 95, yPosition - 5);
  doc.line(pageWidth - 95, yPosition - 5, pageWidth - 25, yPosition - 5);
  
  // Texto para firmas
  doc.setFontSize(8);
  doc.text('Generado por', 60, yPosition + 2, { align: 'center' });
  doc.text('Revisado por', pageWidth - 60, yPosition + 2, { align: 'center' });
  
  // Disclaimer profesional
  doc.setFontSize(7);
  doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
  doc.text('Este reporte fue generado automáticamente por el sistema de gestión académica. Documento confidencial.',
    doc.internal.pageSize.getWidth() / 2, 
    doc.internal.pageSize.getHeight() - 22, 
    { align: 'center' }
  );
  
  // Ahora que el documento está completo, añadimos el número total de páginas
  // a cada página recorriéndolas una por una
  const totalPagesCount = (doc as any).getNumberOfPages();
  
  // Recorrer todas las páginas para añadir la numeración completa
  for (let i = 1; i <= totalPagesCount; i++) {
    // Ir a la página i
    doc.setPage(i);
    
    // Añadir la numeración de página completa
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `PÁGINA ${i} DE ${totalPagesCount}`,
      pageWidth - 15,
      pageHeight - 10,
      { align: 'right' }
    );
  }
  
  // Guardar el PDF con nombre profesional
  const formattedDateTime = today.toISOString().slice(0, 19).replace(/[-:T]/g, '').substring(0, 14);
  const fileName = `CEIC_Informe_Estudiantes_${formattedDateTime}.pdf`;
  doc.save(fileName);
};
