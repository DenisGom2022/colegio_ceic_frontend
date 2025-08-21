# Vista de Cursos - Documentación

## Descripción
Se ha creado una vista completa de gestión de cursos que consume el endpoint `/curso` del backend.

## Estructura de archivos creados

### Modelos
- `src/features/admin/features/courses/models/Course.ts` - Definiciones de tipos TypeScript
- `src/features/admin/features/courses/models/index.ts` - Exportaciones de tipos

### Servicios
- `src/features/admin/features/courses/services/courseService.ts` - Servicio para obtener cursos
- `src/features/admin/features/courses/services/index.ts` - Exportaciones de servicios

### Hooks
- `src/features/admin/features/courses/hooks/useCourses.ts` - Hook personalizado para manejar el estado de cursos
- `src/features/admin/features/courses/hooks/index.ts` - Exportaciones de hooks

### Páginas
- `src/features/admin/features/courses/pages/CoursesPage.tsx` - Componente principal de la vista de cursos
- `src/features/admin/features/courses/pages/CoursesPage.module.css` - Estilos específicos
- `src/features/admin/features/courses/pages/index.ts` - Exportaciones de páginas

### Rutas
- `src/features/admin/routes/courseRoutes.tsx` - Definición de rutas para cursos

## Funcionalidades implementadas

### Vista de Cursos (CoursesPage)
- **Listado completo** de todos los cursos disponibles
- **Búsqueda** por nombre de curso
- **Ordenamiento** por diferentes campos (nombre, nota máxima, nota de aprobación)
- **Paginación** con opciones de tamaño de página personalizables
- **Estados de carga** y manejo de errores
- **Estado vacío** cuando no hay cursos
- **Información detallada** de cada curso:
  - Nombre del curso
  - Información del grado y ciclo asociado
  - Datos del catedrático asignado
  - Notas máxima y de aprobación
  - Estado del ciclo (activo/finalizado)

### Interfaz de usuario
- **Diseño responsivo** y moderno
- **Iconografía consistente** con FontAwesome
- **Tabla interactiva** con hover effects
- **Indicadores visuales** para estados activos/finalizados
- **Controles de paginación** intuitivos
- **Barra de búsqueda** con icono y botones de acción

## Navegación
Se ha agregado un enlace "Cursos" en el menú lateral de administración que lleva a `/admin/cursos`.

## Endpoint utilizado
```
GET /curso
```

**Respuesta esperada:**
```json
{
  "message": "Cursos obtenidos exitosamente",
  "cursos": [
    {
      "id": 7,
      "nombre": "Computación",
      "notaMaxima": 100,
      "notaAprobada": 60,
      "idGradoCiclo": 6,
      "dpiCatedratico": "3043520980114",
      "createdAt": "2025-08-18T16:39:20.000Z",
      "updatedAt": "2025-08-18T16:39:20.000Z",
      "deletedAt": null,
      "gradoCiclo": {
        // información del grado y ciclo
      },
      "catedratico": {
        // información del catedrático
      }
    }
  ]
}
```

## Uso
1. Navegar a `/admin/cursos` o hacer clic en "Cursos" en el menú lateral
2. La vista cargará automáticamente todos los cursos disponibles
3. Usar la barra de búsqueda para filtrar por nombre
4. Hacer clic en los encabezados de columna para ordenar
5. Usar los controles de paginación para navegar entre páginas

## Características técnicas
- **TypeScript** con tipado estricto
- **Hooks personalizados** para lógica reutilizable
- **Gestión de estado** con useState y useEffect
- **Manejo de errores** robusto
- **CSS Modules** para estilos encapsulados
- **Componentes funcionales** con React Hooks
