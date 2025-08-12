# Colegio CEIC - Frontend

> **Nota**: Este proyecto está actualmente en proceso de migración a una estructura basada en características (feature-based). Consulta la [Guía de Migración](./MIGRATION-GUIDE.md) para más detalles.

## Estructura del Proyecto

El proyecto sigue una estructura basada en características (feature-based) para facilitar la organización y escalabilidad:

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

## Características principales

- **Sistema de autenticación**: Login, recuperación de contraseña y protección de rutas
- **Gestión de usuarios**: CRUD completo de usuarios con diferentes roles
- **Panel administrativo**: Gestión de alumnos, catedráticos, ciclos y más
- **Diseño responsivo**: Interfaz adaptable a dispositivos móviles y de escritoriopeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

## Tecnologías utilizadas

- React 18
- TypeScript
- Vite
- React Router v6
- Axios para peticiones HTTP
- CSS Modules para estilos
- Tailwind CSS

## Desarrollo

### Requisitos previos

- Node.js 16.x o superior
- npm 8.x o superior

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/DenisGom2022/colegio_ceic_frontend.git

# Instalar dependencias
cd colegio_ceic_frontend
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

### Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run lint` - Ejecuta el linter para verificar errores
- `npm run preview` - Previsualiza la versión de producción

## Patrones de diseño

- **Feature-based structure**: Organización por características para mejor escalabilidad
- **Container/Presentational Pattern**: Separación de lógica y presentación
- **Custom Hooks**: Encapsulación de lógica reutilizable
- **Protected Routes**: Rutas protegidas basadas en roles de usuario
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
