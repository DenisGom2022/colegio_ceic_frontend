# Módulo de Gestión de Usuarios

Este módulo maneja toda la funcionalidad relacionada con la gestión de usuarios en el sistema, incluyendo creación, visualización, edición y eliminación de usuarios.

## Estructura

```
users/
├── components/       # Componentes específicos de usuarios
├── errors/          # Errores personalizados para esta feature
├── hooks/           # Hooks relacionados con usuarios
│   ├── useTablaUsuario.ts
│   ├── useTiposUsuario.ts
│   ├── useUsuario.ts
│   ├── useEditarUsuario.ts
│   ├── useEliminarUsuario.ts
│   └── useReiniciarContrasena.ts
├── models/          # Modelos e interfaces
│   ├── Usuario.ts
│   ├── CrearUsuario.ts
│   └── TipoUsuario.ts
├── pages/           # Páginas de usuarios
│   ├── UsersPage.tsx
│   ├── CrearUsuario.tsx
│   ├── DetalleUsuario.tsx
│   └── EditarUsuario.tsx
└── services/        # Servicios de API para usuarios
    └── userService.ts
```

## Características

- **Listado de usuarios**: Vista paginada con búsqueda y ordenación.
- **Creación de usuarios**: Formulario para agregar nuevos usuarios al sistema.
- **Visualización de detalles**: Página con información completa de un usuario.
- **Edición de usuarios**: Actualización de información de usuarios existentes.
- **Eliminación de usuarios**: Eliminación segura con confirmación.
- **Reinicio de contraseña**: Funcionalidad para gestionar contraseñas de usuarios.

## Modelos

- **Usuario**: Representa un usuario del sistema con su información completa.
- **CrearUsuario**: Datos necesarios para crear un nuevo usuario.
- **TipoUsuario**: Enumeración de los diferentes tipos/roles de usuario.

## Hooks

- **useTablaUsuario**: Gestiona la carga y paginación de la lista de usuarios.
- **useUsuario**: Funciones para crear y obtener información de usuarios.
- **useTiposUsuario**: Carga los tipos de usuario disponibles.
- **useEditarUsuario**: Lógica para la actualización de datos de usuario.
- **useEliminarUsuario**: Maneja la eliminación de usuarios.
- **useReiniciarContrasena**: Gestiona el reinicio de contraseñas.

## Servicios

El archivo `userService.ts` contiene todas las llamadas a la API relacionadas con usuarios, incluyendo:

- `getAllUsuarios`: Obtiene listado paginado de usuarios.
- `getUsuarioByUsername`: Obtiene detalles de un usuario específico.
- `crearUsuario`: Crea un nuevo usuario.
- `editarUsuario`: Actualiza un usuario existente.
- `eliminarUsuario`: Elimina un usuario.
- `reiniciarContrasena`: Reinicia la contraseña de un usuario.
