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

interface PagoData {
  id: number;
  valor: string | number;
  mora: string | number;
  fechaPago: string;
  numeroPago: number;
  tipoPagoId: number;
  tipoPago?: { descripcion: string };
  createdAt: string;
}

interface AsignacionPagoData {
  id: number;
  alumno: {
    primerNombre?: string;
    segundoNombre?: string;
    tercerNombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    cui?: string;
    telefono?: string;
  };
  gradoCiclo?: {
    grado?: {
      nombre?: string;
      nivelAcademico?: { descripcion?: string };
    };
    ciclo?: {
      descripcion?: string;
      anio?: number;
    };
  };
}

export const generateReciboPagoPDF = (pago: PagoData, asignacion: AsignacionPagoData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPos = 25;

  // Colores corporativos
  const primaryColor = [37, 99, 235]; // Azul #2563eb
  const accentColor = [16, 185, 129]; // Verde #10b981
  const darkGray = [55, 65, 81]; // #374151
  const lightGray = [243, 244, 246]; // #f3f4f6

  // Función auxiliar para agregar texto centrado
  const addCenteredText = (text: string, y: number, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
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

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Función para formatear moneda
  const formatCurrency = (amount?: string | number) => {
    if (!amount) return "Q0.00";
    return `Q${parseFloat(amount.toString()).toFixed(2)}`;
  };

  const convertirNumeroALetras = (num: number): string => {
    if (num === 0) return 'CERO';
    if (num === 100) return 'CIEN';

    let resultado = '';
    const miles = Math.floor(num / 1000);
    const resto = num % 1000;

    if (miles > 0) {
      if (miles === 1) {
        resultado += 'MIL ';
      } else {
        resultado += convertirMenorMil(miles) + ' MIL ';
      }
    }

    if (resto > 0) {
      resultado += convertirMenorMil(resto);
    }

    return resultado.trim();
  };

  const convertirMenorMil = (num: number): string => {
    const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    let resultado = '';
    const c = Math.floor(num / 100);
    const d = Math.floor((num % 100) / 10);
    const u = num % 10;

    if (c > 0) {
      resultado += centenas[c] + ' ';
    }

    if (d === 1) {
      resultado += especiales[u] + ' ';
    } else {
      if (d > 0) resultado += decenas[d] + ' ';
      if (u > 0 && d > 1) resultado += 'Y ';
      if (u > 0 && d !== 1) resultado += unidades[u] + ' ';
    }

    return resultado.trim();
  };

  const totalConMora = parseFloat(pago.valor.toString()) + parseFloat(pago.mora.toString());
  const parteEntera = Math.floor(totalConMora);
  const centavos = Math.round((totalConMora - parteEntera) * 100);
  const montoEnLetras = `${convertirNumeroALetras(parteEntera)} QUETZALES CON ${centavos.toString().padStart(2, '0')}/100`;

  // === ENCABEZADO ===
  // Barra superior con color primario
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 12, 'F');
  
  // Logo/Nombre de la institución
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('COLEGIO CEIC', pageWidth / 2, 8, { align: 'center' });
  
  yPos = 18;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  addCenteredText('Centro Educativo de Innovación y Creatividad', yPos, 9, false, darkGray);
  addCenteredText('NIT: 12345678-9 | Tel: 2222-2222 | info@ceic.edu.gt', yPos + 4, 8, false, [100, 100, 100]);
  
  yPos += 10;
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 10;
  
  // Título del documento
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  addCenteredText('RECIBO DE PAGO', yPos, 18, true, primaryColor);
  
  yPos += 10;
  
  // Número de recibo en caja destacada
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(pageWidth / 2 - 30, yPos - 6, 60, 10, 2, 2, 'FD');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`No. ${pago.id.toString().padStart(6, '0')}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;

  // === INFORMACIÓN DE FECHAS ===
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Fecha de Pago:', margin + 3, yPos + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(pago.fechaPago), margin + 30, yPos + 4);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha de Emisión:', margin + 3, yPos + 7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDateTime(pago.createdAt), margin + 35, yPos + 7.5);
  
  yPos += 15;

  // === INFORMACIÓN DEL ESTUDIANTE ===
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN DEL ESTUDIANTE', margin + 3, yPos + 4.5);
  
  yPos += 9;

  autoTable(doc, {
    startY: yPos,
    theme: 'plain',
    styles: { 
      fontSize: 9,
      cellPadding: 3,
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
      textColor: [55, 65, 81]
    },
    columnStyles: {
      0: { 
        fontStyle: 'bold', 
        cellWidth: 50,
        textColor: [75, 85, 99]
      },
      1: { cellWidth: 'auto' }
    },
    body: [
      ['Nombre Completo:', getNombreCompleto(asignacion.alumno)],
      ['CUI:', asignacion.alumno?.cui || 'N/A'],
      ['Grado:', asignacion.gradoCiclo?.grado?.nombre || 'N/A'],
      ['Ciclo Escolar:', asignacion.gradoCiclo?.ciclo?.descripcion || 'N/A']
    ]
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // === DETALLE DEL PAGO ===
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLE DEL PAGO', margin + 3, yPos + 4.5);
  doc.setTextColor(0, 0, 0);
  
  yPos += 9;

  const tipoPagoDesc = pago.tipoPagoId === 1 ? 'Inscripción' : `Mensualidad #${pago.numeroPago}`;

  autoTable(doc, {
    startY: yPos,
    theme: 'grid',
    headStyles: {
      fillColor: [226, 232, 240],
      textColor: [55, 65, 81],
      fontStyle: 'bold',
      fontSize: 10,
      lineColor: [203, 213, 225],
      lineWidth: 0.5
    },
    bodyStyles: {
      textColor: [55, 65, 81],
      fontSize: 9,
      lineColor: [226, 232, 240],
      lineWidth: 0.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 90, fontStyle: 'normal' },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
    },
    head: [['Concepto', 'Cantidad', 'Monto']],
    body: [
      [tipoPagoDesc, '1', formatCurrency(pago.valor)],
      ['Mora', '1', formatCurrency(pago.mora)]
    ]
  });

  yPos = (doc as any).lastAutoTable.finalY + 5;

  // === TOTALES ===
  // Fondo para la sección de totales
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 22, 2, 2, 'FD');
  
  yPos += 6;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', pageWidth - margin - 55, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(pago.valor), pageWidth - margin - 7, yPos, { align: 'right' });
  
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('Mora:', pageWidth - margin - 55, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(pago.mora), pageWidth - margin - 7, yPos, { align: 'right' });
  
  yPos += 7;
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.8);
  doc.line(pageWidth - margin - 55, yPos - 1, pageWidth - margin - 7, yPos - 1);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('TOTAL:', pageWidth - margin - 55, yPos + 5);
  doc.text(formatCurrency(totalConMora), pageWidth - margin - 7, yPos + 5, { align: 'right' });
  doc.setTextColor(0, 0, 0);

  yPos += 14;

  // === MONTO EN LETRAS ===
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 14, 2, 2, 'FD');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Son:', margin + 3, yPos + 6);
  doc.setFont('helvetica', 'normal');
  const montoLetrasLines = doc.splitTextToSize(montoEnLetras, pageWidth - 2 * margin - 18);
  doc.text(montoLetrasLines, margin + 13, yPos + 6);

  yPos += 20;

  // === OBSERVACIONES ===
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(107, 114, 128);
  doc.text('• Este recibo es válido únicamente con el sello y firma de la institución.', margin, yPos);
  doc.text('• Conserve este documento como comprobante de pago.', margin, yPos + 4);
  doc.text('• Los pagos realizados no son reembolsables.', margin, yPos + 8);

  yPos += 16;

  // === FIRMA ===
  const signatureY = yPos;
  const centerX = pageWidth / 2;

  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setLineWidth(0.5);
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.line(centerX - 35, signatureY, centerX + 35, signatureY);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Firma y Sello de Autorización', centerX, signatureY + 5, { align: 'center' });

  // === PIE DE PÁGINA ===
  const footerY = pageHeight - 20;
  
  // Línea decorativa superior
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  // Información de contacto
  doc.setFontSize(7);
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  doc.text('Dirección: Guatemala, Ciudad', margin, footerY + 4);
  doc.text('Teléfono: 2222-2222 | Email: info@ceic.edu.gt', margin, footerY + 8);
  
  // Información del documento
  doc.text(`Código de asignación: #${asignacion.id}`, pageWidth - margin, footerY + 4, { align: 'right' });
  doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, pageWidth - margin, footerY + 8, { align: 'right' });

  // Barra inferior con color primario
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

  // Guardar el PDF
  const nombreEstudiante = getNombreCompleto(asignacion.alumno).replace(/\s+/g, '_');
  const nombreArchivo = `Recibo_Pago_${nombreEstudiante}_${pago.id}.pdf`;
  doc.save(nombreArchivo);
};
