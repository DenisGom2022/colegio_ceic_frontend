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

// Interfaces para el reporte de notas
interface NotasAlumno {
  id: number;
  alumno: {
    primerNombre: string;
    segundoNombre?: string;
    tercerNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    cui: string;
  };
  tareaAlumnos?: Array<{
    id: number;
    punteoObtenido: number;
    tarea: {
      id: number;
      titulo: string;
      punteo: number;
    };
  }>;
}

interface CursoNotasData {
  nombre: string;
  notaMaxima: number;
  notaAprobada: number;
  catedratico?: {
    primerNombre?: string;
    primerApellido?: string;
  };
  gradoCiclo?: {
    grado?: {
      nombre?: string;
    };
    ciclo?: {
      descripcion?: string;
    };
    asignacionesAlumno?: NotasAlumno[];
  };
  tareas?: Array<{
    id: number;
    titulo: string;
    descripcion?: string;
    punteo: number;
    idBimestre: number;
  }>;
}

interface BimestreData {
  id: number;
  numeroBimestre: number;
  descripcion?: string;
}

export const generateReporteNotasPDF = (
  curso: CursoNotasData, 
  bimestre: BimestreData,
  bimestreId: number
) => {
  const doc = new jsPDF('landscape'); // Formato horizontal para más columnas
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  let yPos = 20;

  // Colores corporativos
  const primaryColor = [37, 99, 235]; // Azul
  const darkGray = [55, 65, 81];
  const lightGray = [243, 244, 246];

  // Función para formatear nombres
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

  // === ENCABEZADO ===
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('COLEGIO CEIC', pageWidth / 2, 8, { align: 'center' });
  
  yPos = 17;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Centro Educativo de Innovación y Creatividad', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 8;
  
  // Título del reporte
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE DE CALIFICACIONES', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;

  // === INFORMACIÓN DEL CURSO ===
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 20, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  
  const leftCol = margin + 5;
  const rightCol = pageWidth / 2 + 10;
  
  yPos += 5;
  doc.text('Curso:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(curso.nombre, leftCol + 20, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Grado:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(curso.gradoCiclo?.grado?.nombre || 'N/A', rightCol + 20, yPos);
  
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Catedrático:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(getNombreCompleto(curso.catedratico), leftCol + 25, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Ciclo:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(curso.gradoCiclo?.ciclo?.descripcion || 'N/A', rightCol + 20, yPos);
  
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Bimestre:', leftCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${bimestre.numeroBimestre} - ${bimestre.descripcion || ''}`, leftCol + 22, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Nota Aprobación:', rightCol, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${curso.notaAprobada} / ${curso.notaMaxima}`, rightCol + 35, yPos);
  
  yPos += 12;

  // === TABLA DE NOTAS ===
  // Filtrar tareas del bimestre
  const tareasDelBimestre = curso.tareas?.filter(t => t.idBimestre === bimestreId) || [];
  
  // Debug: Verificar estructura de datos
  console.log('=== DEBUG REPORTE PDF ===');
  console.log('Tareas del bimestre:', tareasDelBimestre);
  console.log('Primer alumno (ejemplo):', curso.gradoCiclo?.asignacionesAlumno?.[0]);
  console.log('Tareas del primer alumno:', curso.gradoCiclo?.asignacionesAlumno?.[0]?.tareaAlumnos);
  
  // Preparar datos para la tabla
  const alumnos = curso.gradoCiclo?.asignacionesAlumno || [];
  
  // Crear encabezados dinámicos con números
  const headers = ['No.', 'CUI', 'Nombre Completo'];
  tareasDelBimestre.forEach((tarea, index) => {
    // Usar solo el número de la tarea y los puntos
    headers.push(`T${index + 1}\n(${tarea.punteo}pts)`);
  });
  headers.push('Total', 'Estado');
  
  // Crear filas de datos
  const rows = alumnos.map((asignacion, index) => {
    const row: any[] = [
      (index + 1).toString(),
      asignacion.alumno.cui,
      getNombreCompleto(asignacion.alumno)
    ];
    
    let totalObtenido = 0;
    
    // Agregar calificaciones por tarea
    tareasDelBimestre.forEach(tarea => {
      // Buscar la tarea del alumno - intentar con diferentes estructuras posibles
      const tareaAlumno = asignacion.tareaAlumnos?.find(
        (ta: any) => {
          // Verificar si ta.tarea existe y tiene id
          if (ta.tarea && ta.tarea.id) {
            return ta.tarea.id === tarea.id;
          }
          // Si no tiene tarea, verificar si ta.idTarea existe
          if (ta.idTarea) {
            return ta.idTarea === tarea.id;
          }
          return false;
        }
      );
      
      if (tareaAlumno) {
        const punteo = parseFloat(tareaAlumno.punteoObtenido.toString());
        totalObtenido += punteo;
        row.push(punteo.toFixed(1));
      } else {
        row.push('-');
      }
    });
    
    // Total y estado
    row.push(totalObtenido.toFixed(1));
    row.push(totalObtenido >= curso.notaAprobada ? 'Aprobado' : 'Reprobado');
    
    return row;
  });
  
  // Calcular total de puntos disponibles
  const totalPuntos = tareasDelBimestre.reduce((sum, tarea) => sum + tarea.punteo, 0);
  
  autoTable(doc, {
    startY: yPos,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      valign: 'middle'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [55, 65, 81],
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // No.
      1: { cellWidth: 25, halign: 'center' }, // CUI
      2: { cellWidth: 50, halign: 'left' }, // Nombre
      // Las tareas tendrán ancho automático
      [headers.length - 2]: { halign: 'center', fontStyle: 'bold' }, // Total
      [headers.length - 1]: { halign: 'center', fontStyle: 'bold' } // Estado
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: (data) => {
      // Colorear la columna de estado
      if (data.column.index === headers.length - 1 && data.section === 'body') {
        const estado = data.cell.text[0];
        if (estado === 'Aprobado') {
          data.cell.styles.textColor = [16, 185, 129];
          data.cell.styles.fontStyle = 'bold';
        } else if (estado === 'Reprobado') {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // === LEYENDA DE TAREAS ===
  if (tareasDelBimestre.length > 0) {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('LEYENDA DE TAREAS', margin + 3, yPos + 4);
    
    yPos += 8;
    
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    
    // Calcular altura necesaria para todas las tareas
    const tareaHeight = 5;
    const leyendaHeight = (tareasDelBimestre.length * tareaHeight) + 6;
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, leyendaHeight, 2, 2, 'FD');
    
    yPos += 4;
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(8);
    
    // Imprimir tareas en dos columnas si hay muchas
    const mitad = Math.ceil(tareasDelBimestre.length / 2);
    const colWidth = (pageWidth - 2 * margin) / 2;
    
    tareasDelBimestre.forEach((tarea, index) => {
      const col = index < mitad ? 0 : 1;
      const row = index < mitad ? index : index - mitad;
      const x = margin + 5 + (col * colWidth);
      const y = yPos + (row * tareaHeight);
      
      doc.setFont('helvetica', 'bold');
      doc.text(`T${index + 1}:`, x, y);
      doc.setFont('helvetica', 'normal');
      
      // Truncar el título si es muy largo
      const titulo = tarea.titulo || 'Sin título';
      const maxWidth = colWidth - 20;
      const tituloTruncado = doc.getTextWidth(titulo) > maxWidth 
        ? titulo.substring(0, 50) + '...' 
        : titulo;
      
      doc.text(tituloTruncado, x + 10, y);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(107, 114, 128);
      doc.text(`(${tarea.punteo}pts)`, x + 10 + doc.getTextWidth(tituloTruncado) + 2, y);
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    });
    
    yPos += leyendaHeight + 4;
  }
  
  // === RESUMEN ESTADÍSTICO ===
  const aprobados = alumnos.filter(asignacion => {
    const total = tareasDelBimestre.reduce((sum, tarea) => {
      const tareaAlumno = asignacion.tareaAlumnos?.find(
        (ta: any) => ta.tarea?.id === tarea.id
      );
      return sum + (tareaAlumno ? parseFloat(tareaAlumno.punteoObtenido.toString()) : 0);
    }, 0);
    return total >= curso.notaAprobada;
  }).length;
  
  const reprobados = alumnos.length - aprobados;
  const porcentajeAprobacion = alumnos.length > 0 
    ? ((aprobados / alumnos.length) * 100).toFixed(1) 
    : '0.0';
  
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 18, 2, 2, 'F');
  
  yPos += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('RESUMEN:', leftCol, yPos);
  
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Total de Estudiantes: ${alumnos.length}`, leftCol, yPos);
  doc.text(`Aprobados: ${aprobados}`, leftCol + 60, yPos);
  doc.text(`Reprobados: ${reprobados}`, leftCol + 110, yPos);
  doc.text(`Porcentaje de Aprobación: ${porcentajeAprobacion}%`, leftCol + 160, yPos);
  doc.text(`Total Puntos Disponibles: ${totalPuntos}`, leftCol + 230, yPos);
  
  // === PIE DE PÁGINA ===
  const footerY = pageHeight - 15;
  
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setFontSize(7);
  doc.setTextColor(107, 114, 128);
  doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, margin, footerY + 4);
  doc.text(`Página 1 de 1`, pageWidth - margin, footerY + 4, { align: 'right' });
  
  // Barra inferior
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');
  
  // Guardar el PDF
  const nombreArchivo = `Reporte_Notas_${curso.nombre.replace(/\s+/g, '_')}_Bimestre${bimestre.numeroBimestre}.pdf`;
  doc.save(nombreArchivo);
};

// Interfaz para el reporte de calificaciones del alumno
interface TareaAlumnoData {
  id: number;
  idTarea: number;
  punteoObtenido: string | number;
  fechaEntrega: string;
  tarea: {
    id: number;
    titulo: string;
    descripcion: string;
    punteo: number;
    fechaEntrega: string;
    curso?: {
      id: number;
      nombre: string;
      notaMaxima: number;
      notaAprobada: number;
    };
  };
}

interface AsignacionCalificacionesData {
  id: number;
  alumno: {
    primerNombre: string;
    segundoNombre?: string;
    tercerNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    cui: string;
    genero?: string;
    telefono?: string;
  };
  gradoCiclo?: {
    grado?: {
      nombre?: string;
      nivelAcademico?: { descripcion?: string };
      jornada?: { descripcion?: string };
    };
    ciclo?: {
      descripcion?: string;
      id?: number;
    };
  };
  tareaAlumnos?: TareaAlumnoData[];
}

export const generateReporteCalificacionesAlumnoPDF = (asignacion: AsignacionCalificacionesData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  let yPos = 20;

  // Colores corporativos
  const primaryColor = [37, 99, 235]; // Azul
  const successColor = [16, 185, 129]; // Verde
  const dangerColor = [239, 68, 68]; // Rojo
  const darkGray = [55, 65, 81];
  const lightGray = [243, 244, 246];

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
      month: "short",
      year: "numeric"
    });
  };

  // Función auxiliar para agregar texto centrado
  const addCenteredText = (text: string, y: number, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  // === ENCABEZADO ===
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('COLEGIO CEIC', pageWidth / 2, 8, { align: 'center' });
  
  yPos = 18;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  addCenteredText('Centro Educativo de Innovación y Creatividad', yPos, 9, false, darkGray);
  
  yPos += 8;
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 8;
  
  // Título del documento
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  addCenteredText('REPORTE DE CALIFICACIONES', yPos, 16, true, primaryColor);
  addCenteredText(asignacion.gradoCiclo?.ciclo?.descripcion || 'N/A', yPos + 6, 10, false, darkGray);
  
  yPos += 15;

  // === INFORMACIÓN DEL ESTUDIANTE ===
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL ESTUDIANTE', margin + 3, yPos + 4.5);
  
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
      ['Nivel:', asignacion.gradoCiclo?.grado?.nivelAcademico?.descripcion || 'N/A'],
      ['Jornada:', asignacion.gradoCiclo?.grado?.jornada?.descripcion || 'N/A']
    ]
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // === AGRUPAR TAREAS POR CURSO ===
  const tareasPorCurso: { [key: number]: TareaAlumnoData[] } = {};
  
  if (asignacion.tareaAlumnos && asignacion.tareaAlumnos.length > 0) {
    asignacion.tareaAlumnos.forEach((tareaAlumno) => {
      const cursoId = tareaAlumno.tarea?.curso?.id;
      if (cursoId) {
        if (!tareasPorCurso[cursoId]) {
          tareasPorCurso[cursoId] = [];
        }
        tareasPorCurso[cursoId].push(tareaAlumno);
      }
    });
  }

  const cursos = Object.keys(tareasPorCurso);

  if (cursos.length === 0) {
    // Sin calificaciones
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    addCenteredText('No hay calificaciones registradas', yPos + 15, 12, false, [107, 114, 128]);
  } else {
    // === CALIFICACIONES POR CURSO ===
    cursos.forEach((cursoIdStr, index) => {
      const cursoId = parseInt(cursoIdStr);
      const tareas = tareasPorCurso[cursoId];
      const primerTarea = tareas[0];
      const curso = primerTarea.tarea.curso;

      // Verificar si hay espacio suficiente para el siguiente curso
      if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = 20;
      }

      // Calcular totales
      const totalPunteoObtenido = tareas.reduce(
        (sum, ta) => sum + parseFloat(ta.punteoObtenido.toString()),
        0
      );

      const totalPuntosPosibles = tareas.reduce(
        (sum, ta) => sum + ta.tarea.punteo,
        0
      );

      const porcentaje = totalPuntosPosibles > 0 
        ? (totalPunteoObtenido / totalPuntosPosibles) * 100 
        : 0;

      // Calcular la nota equivalente sobre la nota máxima del curso
      const notaMaxima = curso?.notaMaxima || 100;
      const notaAprobada = curso?.notaAprobada || 60;
      const notaEquivalente = totalPuntosPosibles > 0 
        ? (totalPunteoObtenido / totalPuntosPosibles) * notaMaxima
        : 0;
      
      const aprobado = notaEquivalente >= notaAprobada;

      // Encabezado del curso
      const cursoColor = aprobado ? successColor : dangerColor;
      doc.setFillColor(cursoColor[0], cursoColor[1], cursoColor[2]);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(curso?.nombre || 'Curso sin nombre', margin + 3, yPos + 5.5);
      
      // Estado en el encabezado
      const estadoTexto = aprobado ? 'APROBADO' : 'REPROBADO';
      const estadoWidth = doc.getTextWidth(estadoTexto);
      doc.text(estadoTexto, pageWidth - margin - estadoWidth - 3, yPos + 5.5);
      
      yPos += 10;

      // Resumen del curso
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 12, 'F');
      
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      
      const resumeY = yPos + 4;
      doc.text('Tareas Entregadas:', margin + 3, resumeY);
      doc.setFont('helvetica', 'normal');
      doc.text(tareas.length.toString(), margin + 40, resumeY);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Punteo Obtenido:', margin + 60, resumeY);
      doc.setFont('helvetica', 'normal');
      doc.text(`${totalPunteoObtenido.toFixed(2)} / ${totalPuntosPosibles}`, margin + 95, resumeY);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Porcentaje:', margin + 135, resumeY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(aprobado ? successColor[0] : dangerColor[0], aprobado ? successColor[1] : dangerColor[1], aprobado ? successColor[2] : dangerColor[2]);
      doc.text(`${porcentaje.toFixed(2)}%`, margin + 158, resumeY);
      
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('Nota Aprobación:', margin + 3, resumeY + 5);
      doc.setFont('helvetica', 'normal');
      doc.text(`${notaAprobada} / ${notaMaxima}`, margin + 40, resumeY + 5);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Nota Equivalente:', margin + 80, resumeY + 5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(aprobado ? successColor[0] : dangerColor[0], aprobado ? successColor[1] : dangerColor[1], aprobado ? successColor[2] : dangerColor[2]);
      doc.text(`${notaEquivalente.toFixed(2)} / ${notaMaxima}`, margin + 118, resumeY + 5);
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

      yPos += 14;

      // Tabla de tareas
      const tareasData = tareas.map((ta, idx) => [
        (idx + 1).toString(),
        ta.tarea.titulo,
        formatDate(ta.tarea.fechaEntrega),
        formatDate(ta.fechaEntrega),
        ta.tarea.punteo.toString(),
        parseFloat(ta.punteoObtenido.toString()).toFixed(2)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['No.', 'Tarea', 'Fecha Límite', 'Fecha Entrega', 'Punteo Máx.', 'Punteo Obtenido']],
        body: tareasData,
        theme: 'grid',
        headStyles: {
          fillColor: [75, 85, 99],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [55, 65, 81]
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 60, halign: 'left' },
          2: { cellWidth: 28, halign: 'center', fontSize: 7 },
          3: { cellWidth: 28, halign: 'center', fontSize: 7 },
          4: { cellWidth: 20, halign: 'center' },
          5: { cellWidth: 25, halign: 'center', fontStyle: 'bold' }
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        margin: { left: margin, right: margin }
      });

      yPos = (doc as any).lastAutoTable.finalY + 2;

      // Línea de total para este curso
      doc.setFillColor(aprobado ? successColor[0] : dangerColor[0], aprobado ? successColor[1] : dangerColor[1], aprobado ? successColor[2] : dangerColor[2]);
      doc.setDrawColor(aprobado ? successColor[0] : dangerColor[0], aprobado ? successColor[1] : dangerColor[1], aprobado ? successColor[2] : dangerColor[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, 'FD');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL DEL CURSO:', margin + 3, yPos + 5.5);
      doc.text(`${totalPunteoObtenido.toFixed(2)} / ${totalPuntosPosibles} pts (${porcentaje.toFixed(1)}%)`, pageWidth - margin - 60, yPos + 5.5);
      
      yPos += 12;

      // Espacio entre cursos
      if (index < cursos.length - 1) {
        yPos += 5;
      }
    });
  }

  // === PIE DE PÁGINA ===
  const footerY = pageHeight - 20;
  
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setFontSize(7);
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  doc.text('Dirección: Guatemala, Ciudad', margin, footerY + 4);
  doc.text('Teléfono: 2222-2222 | Email: info@ceic.edu.gt', margin, footerY + 8);
  
  doc.text(`Código de asignación: #${asignacion.id}`, pageWidth - margin, footerY + 4, { align: 'right' });
  doc.text(`Generado: ${formatDate(new Date().toISOString())} ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`, pageWidth - margin, footerY + 8, { align: 'right' });

  // Barra inferior
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

  // Guardar el PDF
  const nombreEstudiante = getNombreCompleto(asignacion.alumno).replace(/\s+/g, '_');
  const nombreArchivo = `Calificaciones_${nombreEstudiante}_${asignacion.id}.pdf`;
  doc.save(nombreArchivo);
};

// Interfaces para el recibo de pago de servicio
interface PagoServicioData {
  id: number;
  valor: string;
  fechaPagado: string;
  createdAt: string;
  servicio: {
    id: number;
    descripcion: string;
    valor: string;
    fecha_a_pagar: string;
  };
}

interface AsignacionServicioData {
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
    };
  };
}

export const generateReciboServicioPDF = (pagoServicio: PagoServicioData, asignacion: AsignacionServicioData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPos = 25;

  // Colores corporativos
  const primaryColor = [37, 99, 235]; // Azul #2563eb
  const accentColor = [16, 185, 129]; // Verde #10b981
  const serviceColor = [139, 92, 246]; // Púrpura #8b5cf6
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

  // Función para convertir números a letras
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

  const total = parseFloat(pagoServicio.valor);
  const parteEntera = Math.floor(total);
  const centavos = Math.round((total - parteEntera) * 100);
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
  doc.setTextColor(serviceColor[0], serviceColor[1], serviceColor[2]);
  addCenteredText('RECIBO DE PAGO DE SERVICIO', yPos, 18, true, serviceColor);
  
  yPos += 10;
  
  // Número de recibo en caja destacada
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setDrawColor(serviceColor[0], serviceColor[1], serviceColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(pageWidth / 2 - 30, yPos - 6, 60, 10, 2, 2, 'FD');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(serviceColor[0], serviceColor[1], serviceColor[2]);
  doc.text(`No. ${pagoServicio.id.toString().padStart(6, '0')}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;

  // === INFORMACIÓN DE FECHAS ===
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Fecha de Pago:', margin + 3, yPos + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(pagoServicio.fechaPagado), margin + 30, yPos + 4);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha de Emisión:', margin + 3, yPos + 7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDateTime(pagoServicio.createdAt), margin + 35, yPos + 7.5);
  
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

  // === INFORMACIÓN DEL SERVICIO ===
  doc.setFillColor(serviceColor[0], serviceColor[1], serviceColor[2]);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN DEL SERVICIO', margin + 3, yPos + 4.5);
  
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
      ['Descripción:', pagoServicio.servicio.descripcion],
      ['Fecha Límite Pago:', formatDate(pagoServicio.servicio.fecha_a_pagar)],
      ['Valor del Servicio:', formatCurrency(pagoServicio.servicio.valor)],
      ['Estado:', 'PAGADO']
    ]
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // === DETALLE DEL PAGO ===
  doc.setFillColor(serviceColor[0], serviceColor[1], serviceColor[2]);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLE DEL PAGO', margin + 3, yPos + 4.5);
  doc.setTextColor(0, 0, 0);
  
  yPos += 9;

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
      [pagoServicio.servicio.descripcion, '1', formatCurrency(pagoServicio.valor)]
    ]
  });

  yPos = (doc as any).lastAutoTable.finalY + 5;

  // === TOTALES ===
  // Fondo para la sección de totales
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 18, 2, 2, 'FD');
  
  yPos += 6;
  doc.setDrawColor(serviceColor[0], serviceColor[1], serviceColor[2]);
  doc.setLineWidth(0.8);
  doc.line(pageWidth - margin - 75, yPos, pageWidth - margin - 7, yPos);
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('TOTAL PAGADO:', pageWidth - margin - 75, yPos);
  doc.text(formatCurrency(total), pageWidth - margin - 7, yPos, { align: 'right' });
  doc.setTextColor(0, 0, 0);

  yPos += 10;

  // === MONTO EN LETRAS ===
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(serviceColor[0], serviceColor[1], serviceColor[2]);
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

  // === CARACTERÍSTICAS DEL SERVICIO ===
  doc.setFillColor(254, 249, 195); // Fondo amarillo claro
  doc.setDrawColor(217, 119, 6); // Borde amarillo
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 16, 2, 2, 'FD');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14); // Texto amarillo oscuro
  doc.text('IMPORTANTE:', margin + 3, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 53, 15);
  doc.text('• Este pago corresponde a un servicio adicional al pago de mensualidades.', margin + 3, yPos + 10);
  doc.text('• El servicio ha sido marcado como PAGADO en el sistema.', margin + 3, yPos + 14);

  yPos += 20;

  // === OBSERVACIONES GENERALES ===
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(107, 114, 128);
  doc.text('• Este recibo es válido únicamente con el sello y firma de la institución.', margin, yPos);
  doc.text('• Conserve este documento como comprobante de pago del servicio.', margin, yPos + 4);
  doc.text('• Los pagos de servicios realizados no son reembolsables.', margin, yPos + 8);

  yPos += 16;

  // === FIRMA ===
  const signatureY = yPos;
  const centerX = pageWidth / 2;

  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setLineWidth(0.5);
  doc.setDrawColor(serviceColor[0], serviceColor[1], serviceColor[2]);
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
  doc.text(`ID Servicio: #${pagoServicio.servicio.id}`, pageWidth - margin, footerY + 6, { align: 'right' });
  doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, pageWidth - margin, footerY + 8, { align: 'right' });

  // Barra inferior con color de servicio
  doc.setFillColor(serviceColor[0], serviceColor[1], serviceColor[2]);
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

  // Guardar el PDF
  const nombreEstudiante = getNombreCompleto(asignacion.alumno).replace(/\s+/g, '_');
  const servicioNombre = pagoServicio.servicio.descripcion.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  const nombreArchivo = `Recibo_Servicio_${servicioNombre}_${nombreEstudiante}_${pagoServicio.id}.pdf`;
  doc.save(nombreArchivo);
};
