# Guía de Migración a Estructura Feature-Based

Este documento detalla el proceso de migración de la estructura de carpetas actual a una estructura basada en características (feature-based), que mejorará la organización y escalabilidad del código.

## Objetivos de la Migración

1. Organizar el código por funcionalidades/dominios
2. Mejorar la cohesión y reducir el acoplamiento
3. Facilitar el desarrollo en equipos grandes
4. Hacer el código más mantenible a largo plazo

## Estructura Final

```
src/
├── assets/                  # Recursos estáticos 
├── components/              # Componentes compartidos entre features
│   ├── ui/                  # Componentes UI reutilizables
│   ├── Layout/              # Componentes de layout
│   ├── Table/               # Componente de tabla reutilizable
│   └── FloatingNotification/# Notificaciones
├── enums/                   # Enumeraciones globales
├── features/                # Características organizadas por dominio
│   ├── auth/                # Autenticación
│   │   ├── components/      # Componentes específicos de auth
│   │   ├── hooks/           # Hooks de auth (useAuth, useLogin)
│   │   └── pages/           # Páginas de auth (Login, Forbidden)
│   ├── dashboard/           # Dashboard general
│   └── admin/               # Módulo de administración
│       ├── components/      # Componentes compartidos de admin
│       ├── hooks/           # Hooks compartidos de admin
│       └── features/        # Sub-features de administración
│           ├── dashboard/   # Dashboard de administración
│           ├── usuarios/    # Gestión de usuarios
│           ├── alumnos/     # Gestión de alumnos
│           ├── ciclos/      # Gestión de ciclos académicos
│           └── catedraticos/# Gestión de catedráticos
├── hooks/                   # Hooks globales
├── icons/                   # Componentes de iconos
├── layouts/                 # Layouts de aplicación
├── models/                  # Interfaces y tipos
├── routes/                  # Configuración de rutas
├── services/                # Servicios de API
└── utils/                   # Utilidades y funciones auxiliares
```

## Plan de Migración

### Fase 1: Preparación y estructura base (Completada)

- ✅ Creación de la estructura de carpetas principal
- ✅ Configuración de routing centralizado en /routes
- ✅ Migración del sistema de autenticación

### Fase 2: Migración de componentes (En progreso)

- ✅ Componentes UI reutilizables (Button, Input)
- ✅ Layout principal
- ✅ Componente Table
- ✅ Sistema de notificaciones
- ✅ Componentes compartidos entre features

### Fase 3: Migración de características

- ✅ Feature de autenticación
- ✅ Feature de dashboard
- ⬜ Feature de administración
  - ✅ Dashboard de administración
  - ✅ Gestión de usuarios (modelos, servicios y hooks)
    - ✅ Modelo de usuario
    - ✅ Servicios de usuario
    - ✅ Hooks de usuario
    - ⬜ Páginas de usuario (en progreso)
      - ✅ Página principal de usuarios
      - ⬜ Página de creación de usuario
      - ⬜ Página de detalles de usuario
      - ⬜ Página de edición de usuario
      - ⬜ Página de reinicio de contraseña
  - ⬜ Gestión de alumnos
  - ⬜ Gestión de ciclos
  - ⬜ Gestión de catedráticos

### Fase 4: Limpieza y optimización

- ⬜ Eliminar archivos duplicados
- ⬜ Actualizar importaciones
- ⬜ Pruebas y corrección de errores
  - ⬜ Ejecutar pruebas unitarias
  - ⬜ Verificar funcionamiento del sistema de rutas
  - ⬜ Validar formularios y acciones CRUD
  - ⬜ Comprobar compatibilidad entre componentes
  - ⬜ Revisar errores de TypeScript
- ⬜ Optimización de rendimiento

## Estrategia de migración gradual

Para minimizar el riesgo y permitir un desarrollo continuo durante la migración, seguimos estos pasos para cada módulo:

1. Crear la nueva estructura de carpetas
2. Copiar los archivos a sus nuevas ubicaciones
   - Revisar y adaptar interfaces/tipos
   - Resolver dependencias externas
   - Crear archivos index.ts para facilitar importaciones
3. Adaptar las importaciones según sea necesario
   - Actualizar rutas relativas
   - Resolver problemas de componentes incompatibles
   - Verificar errores de TypeScript
4. Actualizar el sistema de rutas
   - Adaptar las rutas para usar los nuevos componentes
   - Validar protección de rutas y reglas de acceso
5. Probar la funcionalidad
   - Comprobar que no hay errores de consola
   - Verificar que los formularios funcionan correctamente
   - Validar que las interacciones de usuario funcionan como se espera
6. Eliminar los archivos antiguos
   - Eliminar solo después de confirmar que todo funciona correctamente
   - Mantener respaldos temporales si es necesario

## Beneficios de la nueva estructura

- **Encapsulación**: Cada característica contiene sus propios componentes, hooks y servicios
- **Reutilización**: Componentes comunes se extraen a carpetas compartidas
- **Escalabilidad**: Fácil añadir nuevas características sin afectar a las existentes
- **Mantenimiento**: Código más organizado y fácil de entender
- **Colaboración**: Varios desarrolladores pueden trabajar en diferentes características simultáneamente

## Impacto en el desarrollo actual

Durante la migración, mantendremos ambas estructuras funcionando en paralelo para evitar interrupciones. Una vez completada, eliminaremos la estructura antigua y actualizaremos la documentación.

## Problemas comunes y soluciones

### Errores de importación

- **Problema**: Rutas de importación rotas después de mover archivos.
- **Solución**: Usar archivos `index.ts` en cada carpeta para exportar sus contenidos, facilitando las importaciones.

### Componentes incompatibles

- **Problema**: Componentes que requieren ajustes al moverlos a la nueva estructura.
- **Solución**: Crear adaptadores o versiones específicas de componentes para cada feature cuando sea necesario.

### Dependencias circulares

- **Problema**: Referencias circulares entre módulos.
- **Solución**: Refactorizar para eliminar dependencias circulares, extrayendo lógica compartida a un nivel superior.

## Errores comunes durante la migración

### Props incompatibles entre componentes

- **Error**: `Property 'as' does not exist on type 'IntrinsicAttributes & ButtonProps'`
- **Causa**: Al migrar componentes, las interfaces de props pueden no ser compatibles con el uso en las nuevas ubicaciones.
- **Solución**: Crear componentes específicos para cada feature que se adapten a los requerimientos particulares, como hicimos con `UserButton` en la feature de usuarios.

### Componentes no encontrados

- **Error**: `Cannot find name 'DeleteConfirmModal'`
- **Causa**: Referencias a componentes que ya no están en el mismo contexto o ruta.
- **Solución**: Crear versiones locales de los componentes necesarios o actualizar las importaciones. Por ejemplo, creamos `UserDeleteModal` específico para la feature de usuarios.

### Errores de TypeScript

- **Error**: `'deleteError' is declared but its value is never read`
- **Causa**: Variables declaradas pero no utilizadas, especialmente al refactorizar código.
- **Solución**: Limpiar las declaraciones no utilizadas o utilizar el operador de destructuring sin incluir las variables que no se necesitan.

### Archivos duplicados

- **Error**: `ERROR while calling tool: File already exists`
- **Causa**: Intentar crear un archivo que ya existe en la nueva estructura.
- **Solución**: Verificar si el archivo ya se migró anteriormente y, en ese caso, actualizarlo en lugar de crearlo nuevamente.

## Registro de problemas y soluciones durante nuestra migración

### UsersPage.tsx

| Problema | Solución |
|----------|----------|
| Error en props del componente Button: `Property 'as' does not exist on type 'IntrinsicAttributes & ButtonProps'` | Creamos un componente `UserButton` específico para la feature que acepta la prop `to` para enlaces |
| Error con DeleteConfirmModal: `Property 'onClose' does not exist on type 'IntrinsicAttributes & DeleteConfirmModalProps'` | Implementamos `UserDeleteModal` adaptado a las necesidades específicas de la feature |
| Variable no utilizada: `'deleteError' is declared but its value is never read` | Eliminamos la variable no utilizada del destructuring del hook |
| Importaciones duplicadas | Unificamos las importaciones y eliminamos duplicados |

### Hooks de usuario

| Problema | Solución |
|----------|----------|
| Falta de la función `cambiarContrasenaService` en el servicio | Agregamos la función faltante al archivo de servicios |
| Error al intentar recrear useEliminarUsuario.ts | Verificamos que el archivo ya existía y actualizamos su contenido |

### Otros componentes específicos

| Problema | Solución |
|----------|----------|
| Incompatibilidad de interfaces entre la versión global y la específica | Creamos versiones específicas de componentes cuando las interfaces son incompatibles |
| Rutas de importación excesivamente largas y propensas a errores | Utilizamos archivos index.ts para simplificar las importaciones |

## Herramientas y recursos para la migración

### Documentación

- [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md): Esta guía principal con la estrategia y pasos a seguir.
- [MIGRATION-CHECKLIST.md](./MIGRATION-CHECKLIST.md): Lista de verificación para cada feature migrada.
- [MIGRATION-TEST-PLAN.md](./MIGRATION-TEST-PLAN.md): Plan detallado para probar la aplicación después de la migración.

### Scripts de validación

Hemos creado un script para validar la migración y detectar posibles problemas:

```bash
# Instalar dependencias necesarias
npm install --save-dev ts-node @types/node

# Ejecutar el validador de migración
npx ts-node migration-validator.ts
```

Este script verifica:
- Archivos duplicados entre la estructura antigua y nueva
- Directorios sin archivos index.ts para exportaciones
- Potenciales dependencias circulares

### Mejores prácticas para la migración

1. **Trabajar en ramas**: Crear una rama específica para cada feature que se va a migrar
2. **Commits pequeños**: Realizar commits frecuentes y con alcance limitado
3. **Pruebas continuas**: Verificar la funcionalidad después de cada cambio significativo
4. **Revisión de código**: Hacer revisiones de código para detectar problemas temprano
5. **Documentar problemas**: Mantener un registro de problemas encontrados y soluciones aplicadas
