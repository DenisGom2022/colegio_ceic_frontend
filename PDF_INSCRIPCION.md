# Ficha de Inscripción en PDF

## Descripción
Se ha implementado la funcionalidad para descargar una **Ficha de Inscripción** en formato PDF desde la página de detalle de asignaciones.

## Características del PDF

### Diseño Formal y Académico
- **Encabezado institucional**: Logo/nombre del colegio con líneas decorativas
- **Información estructurada**: Secciones claramente definidas con encabezados azules
- **Tipografía profesional**: Uso de fuentes Helvetica con jerarquía visual
- **Formato tabular**: Datos organizados en tablas para fácil lectura

### Contenido Incluido

1. **Datos del Estudiante**
   - Nombre completo
   - CUI
   - Género
   - Teléfono

2. **Información Académica**
   - Grado
   - Nivel académico
   - Jornada
   - Ciclo escolar
   - Estado de asignación

3. **Información Financiera**
   - Precio de inscripción
   - Precio por pago
   - Cantidad de pagos
   - Total en pagos
   - **Total del ciclo** (destacado)

4. **Responsables** (si existen)
   - Tabla con nombre completo, parentesco y teléfono
   - Múltiples responsables en formato tabular

5. **Sección de Firmas**
   - Firma del responsable
   - Firma de autorización
   - Fecha de emisión
   - Fecha de inscripción
   - Código de asignación

## Cómo Usar

1. Navega al detalle de una asignación: `/admin/asignaciones/detalle/:id`
2. En el encabezado de la página, haz clic en el botón rojo **"Descargar PDF"** con icono de archivo PDF
3. El PDF se descargará automáticamente con el nombre: `Ficha_Inscripcion_[NombreEstudiante]_[ID].pdf`

## Botón de Descarga

- **Color**: Rojo (#dc2626) para diferenciarlo del botón de edición
- **Icono**: FaFilePdf de react-icons
- **Ubicación**: En el encabezado, al lado del botón "Editar"
- **Efecto hover**: Cambia de color y tiene una ligera elevación

## Personalización

Si deseas personalizar el PDF, puedes editar el archivo:
```
src/services/pdfService.ts
```

### Elementos personalizables:
- **Colores**: Cambia los valores RGB en `doc.setFillColor()` y `doc.setDrawColor()`
- **Tipografía**: Modifica `doc.setFont()` y `doc.setFontSize()`
- **Logo**: Puedes agregar un logo institucional usando `doc.addImage()`
- **Márgenes**: Ajusta la variable `margin`
- **Secciones**: Agrega o elimina secciones según necesites

## Dependencias Utilizadas

- **jspdf**: Generación de documentos PDF
- **jspdf-autotable**: Creación de tablas en PDF
- **react-icons**: Icono del botón (FaFilePdf)

## Notas Técnicas

- El PDF se genera en el cliente (navegador)
- No requiere conexión al backend
- El archivo se descarga directamente sin necesidad de guardarlo en el servidor
- Compatible con todos los navegadores modernos
- Tamaño de página: A4 (210mm x 297mm)
- Orientación: Vertical (Portrait)

## Vista Previa del Diseño

```
┌─────────────────────────────────────────────┐
│         COLEGIO CEIC                        │
│  Centro Educativo de Innovación...         │
├─────────────────────────────────────────────┤
│      FICHA DE INSCRIPCIÓN                   │
│      Año Lectivo: 2024                      │
├─────────────────────────────────────────────┤
│ ■ DATOS DEL ESTUDIANTE                      │
│                                             │
│   Nombre Completo:  Juan Pérez García       │
│   CUI:             1234567890101            │
│   Género:          Masculino                │
│   Teléfono:        5555-5555                │
├─────────────────────────────────────────────┤
│ ■ INFORMACIÓN ACADÉMICA                     │
│                                             │
│   Grado:           Primero Básico           │
│   Nivel:           Básico                   │
│   Jornada:         Matutina                 │
│   Ciclo:           2024                     │
├─────────────────────────────────────────────┤
│ ■ INFORMACIÓN FINANCIERA                    │
│                                             │
│   Inscripción:                   Q500.00    │
│   Precio por Pago:              Q300.00    │
│   Cantidad Pagos:                    10    │
│   Total en Pagos:              Q3,000.00    │
│   ─────────────────────────────────────    │
│   TOTAL DEL CICLO:             Q3,500.00    │
├─────────────────────────────────────────────┤
│ ■ RESPONSABLES                              │
│                                             │
│  Nombre        Parentesco    Teléfono       │
│  ───────────────────────────────────────    │
│  María García   Madre        5555-1234      │
│  José Pérez     Padre        5555-5678      │
├─────────────────────────────────────────────┤
│                                             │
│  _______________      _______________       │
│  Firma Responsable    Firma Autorización   │
│                                             │
│  Fecha emisión: 03 de noviembre de 2025    │
│  Fecha inscripción: 15 de enero de 2024    │
│  Código: #123                               │
└─────────────────────────────────────────────┘
```

## Mejoras Futuras Sugeridas

1. Agregar logo del colegio (requiere imagen)
2. Incluir código QR con información de la asignación
3. Agregar campos para condiciones y términos
4. Opción de idioma (español/inglés)
5. Marca de agua institucional
6. Numeración de páginas para documentos largos
7. Estadísticas de pagos realizados
8. Historial de calificaciones (si aplica)
