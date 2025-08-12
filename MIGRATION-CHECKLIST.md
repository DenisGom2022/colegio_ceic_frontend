# Lista de verificación para la migración

Usa esta lista para asegurar que has completado todos los pasos necesarios al migrar un módulo a la nueva estructura feature-based.

## Para cada feature

### Preparación
- [ ] Identificar todos los componentes relacionados con la feature
- [ ] Identificar todos los hooks relacionados con la feature
- [ ] Identificar todos los servicios relacionados con la feature
- [ ] Identificar todos los modelos relacionados con la feature

### Estructura de carpetas
- [ ] Crear estructura de carpetas base
  - [ ] `/features/[nombre-feature]`
  - [ ] `/features/[nombre-feature]/components`
  - [ ] `/features/[nombre-feature]/hooks`
  - [ ] `/features/[nombre-feature]/models`
  - [ ] `/features/[nombre-feature]/pages`
  - [ ] `/features/[nombre-feature]/services`
- [ ] Crear archivos index.ts en cada carpeta

### Migración de archivos
- [ ] Migrar modelos
- [ ] Migrar servicios
- [ ] Migrar hooks
- [ ] Migrar componentes específicos
- [ ] Migrar páginas

### Actualización de dependencias
- [ ] Actualizar rutas de importación
- [ ] Verificar compatibilidad con componentes compartidos
- [ ] Revisar y actualizar referencias a servicios

### Rutas y navegación
- [ ] Actualizar configuración de rutas
- [ ] Verificar enlaces y navegación

### Pruebas
- [ ] Probar funcionalidad completa de la feature
- [ ] Verificar que no hay errores de consola
- [ ] Verificar que no hay errores de TypeScript
- [ ] Probar integración con otras features

### Limpieza
- [ ] Eliminar archivos antiguos después de verificar funcionalidad
- [ ] Actualizar documentación
