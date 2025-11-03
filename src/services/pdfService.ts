import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AsignacionData {
  id: number;
  alumno: {
    primerNombre?: string;
    segundoNombre?: string;
    tercerNombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    cui?: string;
    telefono?: string;
    genero?: string;
    responsables?: any[];
  };
  gradoCiclo: {
    grado?: {
      nombre?: string;
      nivelAcademico?: { descripcion?: string };
      jornada?: { descripcion?: string };
    };
    ciclo?: {
      descripcion?: string;
      fechaFin?: string;
    };
    precioInscripcion?: string | number;
    precioPago?: string | number;
    cantidadPagos?: number;
  };
  estadoAsignacion?: {
    descripcion?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const generateAsignacionPDF = (asignacion: AsignacionData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  let yPos = 20;

  // Función auxiliar para agregar texto centrado
  const addCenteredText = (text: string, y: number, fontSize: number, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  // Función para formatear nombres completos
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

  // Función para formatear fechas
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  // Función para formatear moneda
  const formatCurrency = (amount?: string | number) => {
    if (!amount) return "Q0.00";
    return `Q${parseFloat(amount.toString()).toFixed(2)}`;
  };

  // === ENCABEZADO ===
  // Línea superior decorativa
  doc.setDrawColor(0, 51, 102); // Azul oscuro
  doc.setLineWidth(0.5);
  doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5);

  // Logo o Nombre de la Institución
  addCenteredText('COLEGIO CEIC', yPos + 3, 18, true);
  addCenteredText('Centro Educativo de Innovación y Creatividad', yPos + 9, 9);
  
  yPos += 15;
  doc.setLineWidth(0.2);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 8;
  addCenteredText('FICHA DE INSCRIPCIÓN', yPos, 14, true);
  addCenteredText(`Año Lectivo: ${asignacion.gradoCiclo?.ciclo?.descripcion || 'N/A'}`, yPos + 6, 10);
  
  yPos += 12;

  // === INFORMACIÓN DEL ESTUDIANTE ===
  doc.setFillColor(0, 51, 102);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL ESTUDIANTE', margin + 3, yPos + 4);
  doc.setTextColor(0, 0, 0);
  
  yPos += 9;

  // Tabla de información del estudiante
  autoTable(doc, {
    startY: yPos,
    theme: 'plain',
    styles: { 
      fontSize: 9,
      cellPadding: 2,
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    },
    body: [
      ['Nombre Completo:', getNombreCompleto(asignacion.alumno)],
      ['CUI:', asignacion.alumno?.cui || 'N/A'],
      ['Género:', asignacion.alumno?.genero === 'M' ? 'Masculino' : asignacion.alumno?.genero === 'F' ? 'Femenino' : 'N/A'],
      ['Teléfono:', asignacion.alumno?.telefono || 'No registrado']
    ]
  });

  yPos = (doc as any).lastAutoTable.finalY + 8;

  // === INFORMACIÓN ACADÉMICA ===
  doc.setFillColor(0, 51, 102);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN ACADÉMICA', margin + 3, yPos + 4);
  doc.setTextColor(0, 0, 0);
  
  yPos += 9;

  autoTable(doc, {
    startY: yPos,
    theme: 'plain',
    styles: { 
      fontSize: 9,
      cellPadding: 2,
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    },
    body: [
      ['Grado:', asignacion.gradoCiclo?.grado?.nombre || 'N/A'],
      ['Nivel Académico:', asignacion.gradoCiclo?.grado?.nivelAcademico?.descripcion || 'N/A'],
      ['Jornada:', asignacion.gradoCiclo?.grado?.jornada?.descripcion || 'N/A'],
      ['Ciclo Escolar:', asignacion.gradoCiclo?.ciclo?.descripcion || 'N/A'],
      ['Estado de Asignación:', asignacion.estadoAsignacion?.descripcion || 'N/A']
    ]
  });

  yPos = (doc as any).lastAutoTable.finalY + 8;

  // === INFORMACIÓN FINANCIERA ===
  doc.setFillColor(0, 51, 102);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN FINANCIERA', margin + 3, yPos + 4);
  doc.setTextColor(0, 0, 0);
  
  yPos += 9;

  const precioInscripcion = parseFloat(asignacion.gradoCiclo?.precioInscripcion?.toString() || '0');
  const precioPago = parseFloat(asignacion.gradoCiclo?.precioPago?.toString() || '0');
  const cantidadPagos = asignacion.gradoCiclo?.cantidadPagos || 0;
  const totalPagos = precioPago * cantidadPagos;
  const totalCiclo = precioInscripcion + totalPagos;

  autoTable(doc, {
    startY: yPos,
    theme: 'plain',
    styles: { 
      fontSize: 9,
      cellPadding: 2,
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto', halign: 'right' }
    },
    body: [
      ['Precio de Inscripción:', formatCurrency(precioInscripcion)],
      ['Precio por Pago:', formatCurrency(precioPago)],
      ['Cantidad de Pagos:', cantidadPagos.toString()],
      ['Total en Pagos:', formatCurrency(totalPagos)],
      ['', ''],
      ['TOTAL DEL CICLO:', formatCurrency(totalCiclo)]
    ],
    didParseCell: (data) => {
      if (data.row.index === 5) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fontSize = 10;
        data.cell.styles.fillColor = [240, 240, 240];
      }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 12;

  // Líneas de firma
  const signatureY = yPos + 15;
  const leftSignatureX = margin + 20;
  const rightSignatureX = pageWidth - margin - 60;

  doc.setLineWidth(0.3);
  doc.line(leftSignatureX, signatureY, leftSignatureX + 50, signatureY);
  doc.line(rightSignatureX, signatureY, rightSignatureX + 50, signatureY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Firma del Responsable', leftSignatureX + 25, signatureY + 4, { align: 'center' });
  doc.text('Firma de Autorización', rightSignatureX + 25, signatureY + 4, { align: 'center' });

  // Fecha de emisión
  yPos = signatureY + 12;
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(`Fecha de emisión: ${formatDate(new Date().toISOString())}`, margin, yPos);
  doc.text(`Fecha de inscripción: ${formatDate(asignacion.createdAt)}`, margin, yPos + 4);
  doc.text(`Código de asignación: #${asignacion.id}`, margin, yPos + 8);

  // Línea inferior decorativa
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

  // Guardar el PDF
  const nombreEstudiante = getNombreCompleto(asignacion.alumno).replace(/\s+/g, '_');
  const nombreArchivo = `Ficha_Inscripcion_${nombreEstudiante}_${asignacion.id}.pdf`;
  doc.save(nombreArchivo);
};
