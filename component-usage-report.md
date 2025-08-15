# Component Usage Report

Generated on: 13/8/2025, 11:46:50 a. m.

## Summary

- Total components analyzed: 82
- Unused components: 1
- Components only in unused barrel files: 2
- Components only referenced by CSS filename: 0
- Fully used components: 81

## Unused Components

- **StudentRoutes** (in `features\admin\features\students\index.ts`)

## Components Only in Unused Barrel Files

These components are only exported in barrel files that aren't imported anywhere else in your codebase.

- **StudentRoutes** (in `features\admin\features\students\index.ts`)
  - Exported in unused barrel file: `features\admin\features\students\index.ts`
- **StudentRoutes** (in `features\admin\features\students\routes.tsx`)
  - Exported in unused barrel file: `features\admin\features\students\index.ts`

## Detailed Component Analysis

### AdminDashboard

- **File**: `features\admin\features\dashboard\pages\AdminDashboard.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `routes\adminRoutes.tsx` (línea 6, import)
  - **Referenced in CSS**:
    - `features\admin\features\dashboard\pages\AdminDashboard.module.css` (fileName)
  - **Used in JSX in**:
    - `routes\adminRoutes.tsx` (línea 17)
  - **Used in routes in**:
    - `routes\adminRoutes.tsx` (línea 6)

---

### AdminDashboard

- **File**: `pages\admin\AdminDashboard.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `routes\adminRoutes.tsx` (línea 6, import)
  - **Referenced in CSS**:
    - `features\admin\features\dashboard\pages\AdminDashboard.module.css` (fileName)
  - **Used in JSX in**:
    - `routes\adminRoutes.tsx` (línea 17)
  - **Used in routes in**:
    - `routes\adminRoutes.tsx` (línea 6)

---

### App

- **File**: `App.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `main.tsx` (línea 4, import)
  - **Referenced in CSS**:
    - `App.css` (fileName)
  - **Used in JSX in**:
    - `main.tsx` (línea 8)

---

### AppRoutes

- **File**: `routes\AppRoutes.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `App.tsx` (línea 3, import)
  - **Used in JSX in**:
    - `App.tsx` (línea 10)
  - **Used in routes in**:
    - `App.tsx` (línea 3)
    - `routes\AppRoutes.tsx` (línea 19)

---

### AuthProvider

- **File**: `features\auth\hooks\useAuth.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `App.tsx` (línea 2, import)
  - **Used in JSX in**:
    - `App.tsx` (línea 9)

---

### AuthProvider

- **File**: `hooks\useAuth.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `App.tsx` (línea 2, import)
  - **Used in JSX in**:
    - `App.tsx` (línea 9)

---

### Button

- **File**: `components\Button.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\ui\index.ts` at line 6: `export * from './Button';`
    - This barrel file is imported in:
      - `components\index.ts` at line 6: `export * from './ui';`
- **Usage Details**:
  - **Imported in**:
    - `pages\cambiaContrasena\CambiaContrasena.tsx` (línea 3, import)
  - **Re-exported in barrel files**:
    - `components\ui\index.ts` (línea 6): `export * from './Button';`
  - **Referenced in CSS**:
    - `pages\usuarios\Usuarios.module.css` (class selector (kebab-case) (línea 187))
  - **Used in JSX in**:
    - `pages\cambiaContrasena\CambiaContrasena.tsx` (línea 91)

---

### Button

- **File**: `components\ui\Button.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\ui\index.ts` at line 6: `export * from './Button';`
    - This barrel file is imported in:
      - `components\index.ts` at line 6: `export * from './ui';`
- **Usage Details**:
  - **Imported in**:
    - `pages\cambiaContrasena\CambiaContrasena.tsx` (línea 3, import)
  - **Re-exported in barrel files**:
    - `components\ui\index.ts` (línea 6): `export * from './Button';`
  - **Referenced in CSS**:
    - `pages\usuarios\Usuarios.module.css` (class selector (kebab-case) (línea 187))
  - **Used in JSX in**:
    - `pages\cambiaContrasena\CambiaContrasena.tsx` (línea 91)

---

### CambiaContrasena

- **File**: `pages\cambiaContrasena\CambiaContrasena.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `routes\AppRoutes.tsx` (línea 12, import)
  - **Used in JSX in**:
    - `routes\AppRoutes.tsx` (línea 24)
  - **Used in routes in**:
    - `routes\AppRoutes.tsx` (línea 12)

---

### CambiarContrasenaError

- **File**: `Errors\CambiarContrasenaError.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\errors\index.ts` at line 1: `export * from './CambiarContrasenaError';`
    - This barrel file is imported in:
      - `features\admin\features\users\hooks\useReiniciarContrasena.ts` at line 3: `import { CambiarContrasenaError } from '../errors';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\users\hooks\useReiniciarContrasena.ts` (línea 3, import)
    - `features\admin\features\users\hooks\useResetPassword.ts` (línea 3, import)
    - `features\auth\hooks\useLogin.ts` (línea 4, import)
    - `hooks\useLogin.ts` (línea 4, import)
    - `hooks\useReiniciarContrasena.ts` (línea 3, import)
    - `services\authService.ts` (línea 3, import)
  - **Re-exported in barrel files**:
    - `features\admin\features\users\errors\index.ts` (línea 1): `export * from './CambiarContrasenaError';`

---

### CambiarContrasenaError

- **File**: `features\admin\features\users\errors\CambiarContrasenaError.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\errors\index.ts` at line 1: `export * from './CambiarContrasenaError';`
    - This barrel file is imported in:
      - `features\admin\features\users\hooks\useReiniciarContrasena.ts` at line 3: `import { CambiarContrasenaError } from '../errors';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\users\hooks\useReiniciarContrasena.ts` (línea 3, import)
    - `features\admin\features\users\hooks\useResetPassword.ts` (línea 3, import)
    - `features\auth\hooks\useLogin.ts` (línea 4, import)
    - `hooks\useLogin.ts` (línea 4, import)
    - `hooks\useReiniciarContrasena.ts` (línea 3, import)
    - `services\authService.ts` (línea 3, import)
  - **Re-exported in barrel files**:
    - `features\admin\features\users\errors\index.ts` (línea 1): `export * from './CambiarContrasenaError';`

---

### Ciclos

- **File**: `pages\admin\Ciclos.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Referenced in CSS**:
    - `pages\admin\Ciclos.module.css` (fileName)
  - **Used in routes in**:
    - `routes\adminRoutes.tsx` (línea 31)

---

### CreateCyclePage

- **File**: `features\admin\features\cycles\pages\CreateCyclePage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\cycles\pages\index.ts` at line 3: `export { default as CreateCyclePage } from './CreateCyclePage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\cycles\pages\index.ts` (línea 3): `export { default as CreateCyclePage } from './CreateCyclePage';`
  - **Referenced in CSS**:
    - `features\admin\features\cycles\pages\CreateCyclePage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 20)
  - **Used in routes in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 5)

---

### CreateCyclePage

- **File**: `features\admin\features\cycles\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\cycles\pages\index.ts` at line 3: `export { default as CreateCyclePage } from './CreateCyclePage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\cycles\pages\index.ts` (línea 3): `export { default as CreateCyclePage } from './CreateCyclePage';`
  - **Referenced in CSS**:
    - `features\admin\features\cycles\pages\CreateCyclePage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 20)
  - **Used in routes in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 5)

---

### CreateStudentPage

- **File**: `features\admin\features\students\pages\CreateStudentPage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\students\pages\index.ts` at line 4: `export { default as CreateStudentPage } from './CreateStudentPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\students\routes.tsx` (línea 5, import)
  - **Re-exported in barrel files**:
    - `features\admin\features\students\pages\index.ts` (línea 4): `export { default as CreateStudentPage } from './CreateStudentPage';`
  - **Referenced in CSS**:
    - `features\admin\features\students\pages\CreateStudentPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\students\routes.tsx` (línea 13)
    - `features\admin\routes\studentRoutes.tsx` (línea 26)
  - **Used in routes in**:
    - `features\admin\features\students\routes.tsx` (línea 5)
    - `features\admin\routes\studentRoutes.tsx` (línea 7)

---

### CreateStudentPage

- **File**: `features\admin\features\students\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\students\pages\index.ts` at line 4: `export { default as CreateStudentPage } from './CreateStudentPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\students\routes.tsx` (línea 5, import)
  - **Re-exported in barrel files**:
    - `features\admin\features\students\pages\index.ts` (línea 4): `export { default as CreateStudentPage } from './CreateStudentPage';`
  - **Referenced in CSS**:
    - `features\admin\features\students\pages\CreateStudentPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\students\routes.tsx` (línea 13)
    - `features\admin\routes\studentRoutes.tsx` (línea 26)
  - **Used in routes in**:
    - `features\admin\features\students\routes.tsx` (línea 5)
    - `features\admin\routes\studentRoutes.tsx` (línea 7)

---

### CreateTeacherPage

- **File**: `features\admin\features\teachers\pages\CreateTeacherPage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\teachers\pages\index.ts` at line 4: `export * from './CreateTeacherPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\teachers\pages\index.ts` (línea 4): `export * from './CreateTeacherPage';`
  - **Referenced in CSS**:
    - `features\admin\features\teachers\pages\CreateTeacherPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\teacherRoutes.tsx` (línea 26)
  - **Used in routes in**:
    - `features\admin\routes\teacherRoutes.tsx` (línea 6)

---

### CreateUserPage

- **File**: `features\admin\features\users\pages\CreateUser.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\pages\index.ts` at line 4: `export { CreateUserPage as CreateUserPageLegacy } from './CreateUser';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
  - Exported in `features\admin\features\users\pages\index.ts` at line 6: `export { CreateUserPage } from './CreateUserPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\users\pages\index.ts` (línea 4, usage)
  - **Re-exported in barrel files**:
    - `features\admin\features\users\pages\index.ts` (línea 4): `export { CreateUserPage as CreateUserPageLegacy } from './CreateUser';`
    - `features\admin\features\users\pages\index.ts` (línea 6): `export { CreateUserPage } from './CreateUserPage';`
  - **Referenced in CSS**:
    - `features\admin\features\users\pages\CreateUserPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\userRoutes.tsx` (línea 27)
  - **Used in routes in**:
    - `features\admin\routes\userRoutes.tsx` (línea 6)

---

### CreateUserPage

- **File**: `features\admin\features\users\pages\CreateUserPage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\pages\index.ts` at line 4: `export { CreateUserPage as CreateUserPageLegacy } from './CreateUser';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
  - Exported in `features\admin\features\users\pages\index.ts` at line 6: `export { CreateUserPage } from './CreateUserPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\users\pages\index.ts` (línea 4, usage)
  - **Re-exported in barrel files**:
    - `features\admin\features\users\pages\index.ts` (línea 4): `export { CreateUserPage as CreateUserPageLegacy } from './CreateUser';`
    - `features\admin\features\users\pages\index.ts` (línea 6): `export { CreateUserPage } from './CreateUserPage';`
  - **Referenced in CSS**:
    - `features\admin\features\users\pages\CreateUserPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\userRoutes.tsx` (línea 27)
  - **Used in routes in**:
    - `features\admin\routes\userRoutes.tsx` (línea 6)

---

### CreateUserPage

- **File**: `features\admin\features\users\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\pages\index.ts` at line 4: `export { CreateUserPage as CreateUserPageLegacy } from './CreateUser';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
  - Exported in `features\admin\features\users\pages\index.ts` at line 6: `export { CreateUserPage } from './CreateUserPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\users\pages\index.ts` (línea 4, usage)
  - **Re-exported in barrel files**:
    - `features\admin\features\users\pages\index.ts` (línea 4): `export { CreateUserPage as CreateUserPageLegacy } from './CreateUser';`
    - `features\admin\features\users\pages\index.ts` (línea 6): `export { CreateUserPage } from './CreateUserPage';`
  - **Referenced in CSS**:
    - `features\admin\features\users\pages\CreateUserPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\userRoutes.tsx` (línea 27)
  - **Used in routes in**:
    - `features\admin\routes\userRoutes.tsx` (línea 6)

---

### CreateUserPageLegacy

- **File**: `features\admin\features\users\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\pages\index.ts` at line 4: `export { CreateUserPage as CreateUserPageLegacy } from './CreateUser';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\users\pages\index.ts` (línea 4): `export { CreateUserPage as CreateUserPageLegacy } from './CreateUser';`

---

### CycleDetailPage

- **File**: `features\admin\features\cycles\pages\CycleDetailPage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\cycles\pages\index.ts` at line 2: `export { default as CycleDetailPage } from './CycleDetailPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\cycles\pages\index.ts` (línea 2): `export { default as CycleDetailPage } from './CycleDetailPage';`
  - **Referenced in CSS**:
    - `features\admin\features\cycles\pages\CycleDetailPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 16)
  - **Used in routes in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 4)

---

### CycleDetailPage

- **File**: `features\admin\features\cycles\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\cycles\pages\index.ts` at line 2: `export { default as CycleDetailPage } from './CycleDetailPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\cycles\pages\index.ts` (línea 2): `export { default as CycleDetailPage } from './CycleDetailPage';`
  - **Referenced in CSS**:
    - `features\admin\features\cycles\pages\CycleDetailPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 16)
  - **Used in routes in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 4)

---

### CycleListPage

- **File**: `features\admin\features\cycles\pages\CycleListPage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\cycles\pages\index.ts` at line 1: `export { default as CycleListPage } from './CycleListPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\cycles\pages\index.ts` (línea 1): `export { default as CycleListPage } from './CycleListPage';`
  - **Referenced in CSS**:
    - `features\admin\features\cycles\pages\CycleListPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 12)
  - **Used in routes in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 3)

---

### CycleListPage

- **File**: `features\admin\features\cycles\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\cycles\pages\index.ts` at line 1: `export { default as CycleListPage } from './CycleListPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\cycles\pages\index.ts` (línea 1): `export { default as CycleListPage } from './CycleListPage';`
  - **Referenced in CSS**:
    - `features\admin\features\cycles\pages\CycleListPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 12)
  - **Used in routes in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 3)

---

### Dashboard

- **File**: `features\dashboard\pages\Dashboard.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `routes\AppRoutes.tsx` (línea 8, import)
  - **Referenced in CSS**:
    - `features\dashboard\pages\Dashboard.module.css` (fileName)
  - **Used in JSX in**:
    - `routes\AppRoutes.tsx` (línea 32)
  - **Used in routes in**:
    - `routes\adminRoutes.tsx` (línea 5)
    - `routes\AppRoutes.tsx` (línea 7)

---

### Dashboard

- **File**: `pages\dashboard\Dashboard.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `routes\AppRoutes.tsx` (línea 8, import)
  - **Referenced in CSS**:
    - `features\dashboard\pages\Dashboard.module.css` (fileName)
  - **Used in JSX in**:
    - `routes\AppRoutes.tsx` (línea 32)
  - **Used in routes in**:
    - `routes\adminRoutes.tsx` (línea 5)
    - `routes\AppRoutes.tsx` (línea 7)

---

### DeleteConfirmModal

- **File**: `components\DeleteConfirmModal.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\cycles\pages\CycleDetailPage.tsx` (línea 5, import)
    - `features\admin\features\cycles\pages\CycleListPage.tsx` (línea 6, import)
    - `features\admin\features\students\pages\StudentDetailPage.tsx` (línea 6, import)
    - `features\admin\features\students\pages\StudentListPage.tsx` (línea 16, import)
    - `features\admin\features\teachers\pages\TeacherDetailPage.tsx` (línea 6, import)
    - `features\admin\features\teachers\pages\TeachersPage.tsx` (línea 13, import)
    - `features\admin\features\users\pages\UsersPage.tsx` (línea 16, import)
    - `pages\admin\Ciclos.tsx` (línea 20, import)
  - **Referenced in CSS**:
    - `components\DeleteConfirmModal.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\cycles\pages\CycleDetailPage.tsx` (línea 493)
    - `features\admin\features\cycles\pages\CycleDetailPage.tsx` (línea 506)
    - `features\admin\features\cycles\pages\CycleListPage.tsx` (línea 532)
    - `features\admin\features\cycles\pages\CycleListPage.tsx` (línea 543)
    - `features\admin\features\students\pages\StudentDetailPage.tsx` (línea 307)
    - `features\admin\features\students\pages\StudentListPage.tsx` (línea 453)
    - `features\admin\features\teachers\pages\TeacherDetailPage.tsx` (línea 279)
    - `features\admin\features\teachers\pages\TeachersPage.tsx` (línea 431)
    - `features\admin\features\users\pages\UsersPage.tsx` (línea 461)
    - `pages\admin\Ciclos.tsx` (línea 546)
    - `pages\admin\Ciclos.tsx` (línea 557)

---

### EditCyclePage

- **File**: `features\admin\features\cycles\pages\EditCyclePage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\cycles\pages\index.ts` at line 4: `export { default as EditCyclePage } from './EditCyclePage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\cycles\pages\index.ts` (línea 4): `export { default as EditCyclePage } from './EditCyclePage';`
  - **Referenced in CSS**:
    - `features\admin\features\cycles\pages\EditCyclePage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 24)
  - **Used in routes in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 6)

---

### EditCyclePage

- **File**: `features\admin\features\cycles\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\cycles\pages\index.ts` at line 4: `export { default as EditCyclePage } from './EditCyclePage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\cycles\pages\index.ts` (línea 4): `export { default as EditCyclePage } from './EditCyclePage';`
  - **Referenced in CSS**:
    - `features\admin\features\cycles\pages\EditCyclePage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 24)
  - **Used in routes in**:
    - `features\admin\routes\cycleRoutes.tsx` (línea 6)

---

### EditStudentPage

- **File**: `features\admin\features\students\pages\EditStudentPage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\students\pages\index.ts` at line 5: `export { default as EditStudentPage } from './EditStudentPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\students\routes.tsx` (línea 6, import)
  - **Re-exported in barrel files**:
    - `features\admin\features\students\pages\index.ts` (línea 5): `export { default as EditStudentPage } from './EditStudentPage';`
  - **Referenced in CSS**:
    - `features\admin\features\students\pages\EditStudentPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\students\routes.tsx` (línea 14)
    - `features\admin\routes\studentRoutes.tsx` (línea 44)
  - **Used in routes in**:
    - `features\admin\features\students\routes.tsx` (línea 6)
    - `features\admin\routes\studentRoutes.tsx` (línea 8)

---

### EditStudentPage

- **File**: `features\admin\features\students\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\students\pages\index.ts` at line 5: `export { default as EditStudentPage } from './EditStudentPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\students\routes.tsx` (línea 6, import)
  - **Re-exported in barrel files**:
    - `features\admin\features\students\pages\index.ts` (línea 5): `export { default as EditStudentPage } from './EditStudentPage';`
  - **Referenced in CSS**:
    - `features\admin\features\students\pages\EditStudentPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\students\routes.tsx` (línea 14)
    - `features\admin\routes\studentRoutes.tsx` (línea 44)
  - **Used in routes in**:
    - `features\admin\features\students\routes.tsx` (línea 6)
    - `features\admin\routes\studentRoutes.tsx` (línea 8)

---

### EditTeacherPage

- **File**: `features\admin\features\teachers\pages\EditTeacherPage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\teachers\pages\index.ts` at line 5: `export * from './EditTeacherPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\teachers\pages\index.ts` (línea 5): `export * from './EditTeacherPage';`
  - **Referenced in CSS**:
    - `features\admin\features\teachers\pages\EditTeacherPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\teacherRoutes.tsx` (línea 44)
  - **Used in routes in**:
    - `features\admin\routes\teacherRoutes.tsx` (línea 8)

---

### EditUserPage

- **File**: `features\admin\features\users\pages\EditUser.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\pages\index.ts` at line 8: `export { default as EditUserPage } from './EditUser';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\users\pages\index.ts` (línea 8): `export { default as EditUserPage } from './EditUser';`
  - **Used in JSX in**:
    - `features\admin\routes\userRoutes.tsx` (línea 45)
  - **Used in routes in**:
    - `features\admin\routes\userRoutes.tsx` (línea 8)

---

### EditUserPage

- **File**: `features\admin\features\users\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\pages\index.ts` at line 8: `export { default as EditUserPage } from './EditUser';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\users\pages\index.ts` (línea 8): `export { default as EditUserPage } from './EditUser';`
  - **Used in JSX in**:
    - `features\admin\routes\userRoutes.tsx` (línea 45)
  - **Used in routes in**:
    - `features\admin\routes\userRoutes.tsx` (línea 8)

---

### EmptyState

- **File**: `unused\EmptyState.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\common\components\index.ts` at line 5: `export * from './EmptyState';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\common\components\index.ts` (línea 5): `export * from './EmptyState';`

---

### FloatingNotification

- **File**: `components\FloatingNotification\FloatingNotification.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\index.ts` at line 16: `export * from './FloatingNotification';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
- **Usage Details**:
  - **Imported in**:
    - `components\FloatingNotification\index.ts` (línea 4, import)
    - `features\admin\features\cycles\pages\CreateCyclePage.tsx` (línea 7, import)
    - `features\admin\features\cycles\pages\CycleDetailPage.tsx` (línea 8, import)
    - `features\admin\features\cycles\pages\EditCyclePage.tsx` (línea 6, import)
    - `features\admin\features\students\pages\CreateStudentPage.tsx` (línea 15, import)
    - `features\admin\features\students\pages\EditStudentPage.tsx` (línea 8, import)
    - `features\admin\features\students\pages\StudentDetailPage.tsx` (línea 7, import)
    - `features\admin\features\teachers\pages\CreateTeacherPage.tsx` (línea 11, import)
    - `features\admin\features\teachers\pages\EditTeacherPage.tsx` (línea 8, import)
    - `features\admin\features\teachers\pages\TeacherDetailPage.tsx` (línea 7, import)
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 17, import)
    - `features\admin\features\users\pages\CreateUserPage.tsx` (línea 4, import)
    - `features\admin\features\users\pages\UserDetail.tsx` (línea 10, import)
  - **Re-exported in barrel files**:
    - `components\index.ts` (línea 16): `export * from './FloatingNotification';`
  - **Used in JSX in**:
    - `features\admin\features\cycles\pages\CreateCyclePage.tsx` (línea 95)
    - `features\admin\features\cycles\pages\CycleDetailPage.tsx` (línea 255)
    - `features\admin\features\cycles\pages\EditCyclePage.tsx` (línea 316)
    - `features\admin\features\students\pages\CreateStudentPage.tsx` (línea 294)
    - `features\admin\features\students\pages\EditStudentPage.tsx` (línea 795)
    - `features\admin\features\students\pages\StudentDetailPage.tsx` (línea 132)
    - `features\admin\features\teachers\pages\CreateTeacherPage.tsx` (línea 366)
    - `features\admin\features\teachers\pages\EditTeacherPage.tsx` (línea 438)
    - `features\admin\features\teachers\pages\TeacherDetailPage.tsx` (línea 291)
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 436)
    - `features\admin\features\users\pages\CreateUserPage.tsx` (línea 542)
    - `features\admin\features\users\pages\CreateUserPage.tsx` (línea 552)
    - `features\admin\features\users\pages\UserDetail.tsx` (línea 383)

---

### FloatingNotification

- **File**: `components\FloatingNotification\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\index.ts` at line 16: `export * from './FloatingNotification';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
- **Usage Details**:
  - **Imported in**:
    - `components\FloatingNotification\index.ts` (línea 4, import)
    - `features\admin\features\cycles\pages\CreateCyclePage.tsx` (línea 7, import)
    - `features\admin\features\cycles\pages\CycleDetailPage.tsx` (línea 8, import)
    - `features\admin\features\cycles\pages\EditCyclePage.tsx` (línea 6, import)
    - `features\admin\features\students\pages\CreateStudentPage.tsx` (línea 15, import)
    - `features\admin\features\students\pages\EditStudentPage.tsx` (línea 8, import)
    - `features\admin\features\students\pages\StudentDetailPage.tsx` (línea 7, import)
    - `features\admin\features\teachers\pages\CreateTeacherPage.tsx` (línea 11, import)
    - `features\admin\features\teachers\pages\EditTeacherPage.tsx` (línea 8, import)
    - `features\admin\features\teachers\pages\TeacherDetailPage.tsx` (línea 7, import)
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 17, import)
    - `features\admin\features\users\pages\CreateUserPage.tsx` (línea 4, import)
    - `features\admin\features\users\pages\UserDetail.tsx` (línea 10, import)
  - **Re-exported in barrel files**:
    - `components\index.ts` (línea 16): `export * from './FloatingNotification';`
  - **Used in JSX in**:
    - `features\admin\features\cycles\pages\CreateCyclePage.tsx` (línea 95)
    - `features\admin\features\cycles\pages\CycleDetailPage.tsx` (línea 255)
    - `features\admin\features\cycles\pages\EditCyclePage.tsx` (línea 316)
    - `features\admin\features\students\pages\CreateStudentPage.tsx` (línea 294)
    - `features\admin\features\students\pages\EditStudentPage.tsx` (línea 795)
    - `features\admin\features\students\pages\StudentDetailPage.tsx` (línea 132)
    - `features\admin\features\teachers\pages\CreateTeacherPage.tsx` (línea 366)
    - `features\admin\features\teachers\pages\EditTeacherPage.tsx` (línea 438)
    - `features\admin\features\teachers\pages\TeacherDetailPage.tsx` (línea 291)
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 436)
    - `features\admin\features\users\pages\CreateUserPage.tsx` (línea 542)
    - `features\admin\features\users\pages\CreateUserPage.tsx` (línea 552)
    - `features\admin\features\users\pages\UserDetail.tsx` (línea 383)

---

### Forbidden

- **File**: `features\auth\pages\Forbidden.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `routes\AppRoutes.tsx` (línea 16, import)
  - **Used in JSX in**:
    - `routes\AppRoutes.tsx` (línea 25)
  - **Used in routes in**:
    - `routes\AppRoutes.tsx` (línea 16)

---

### Forbidden

- **File**: `pages\Forbidden.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `routes\AppRoutes.tsx` (línea 16, import)
  - **Used in JSX in**:
    - `routes\AppRoutes.tsx` (línea 25)
  - **Used in routes in**:
    - `routes\AppRoutes.tsx` (línea 16)

---

### Input

- **File**: `components\ui\Input.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\ui\index.ts` at line 7: `export * from './Input';`
    - This barrel file is imported in:
      - `components\index.ts` at line 6: `export * from './ui';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `components\ui\index.ts` (línea 7): `export * from './Input';`
  - **Referenced in CSS**:
    - `features\admin\features\cycles\pages\CycleListPage.module.css` (class selector (kebab-case) (línea 94))
    - `features\admin\features\students\pages\StudentListPage.module.css` (class selector (kebab-case) (línea 125))
    - `features\admin\features\teachers\pages\TeachersPage.module.css` (class selector (kebab-case) (línea 145))
    - `features\admin\features\users\pages\CreateUser.module.css` (class selector (kebab-case) (línea 81))
    - `features\admin\features\users\pages\CreateUserPage.module.css` (class selector (kebab-case) (línea 145))
    - `features\admin\features\users\pages\EditUser.module.css` (class selector (kebab-case) (línea 144))
    - `features\admin\features\users\pages\ResetPassword.module.css` (class selector (kebab-case) (línea 101))
    - `features\admin\features\users\pages\UsersPage.module.css` (class selector (kebab-case) (línea 151))
    - `pages\admin\Ciclos.module.css` (class selector (kebab-case) (línea 94))
    - `pages\cambiaContrasena\ReiniciarContrasena.module.css` (class selector (kebab-case) (línea 101))
    - `pages\usuarios\EditarUsuario.module.css` (class selector (kebab-case) (línea 271))
    - `pages\usuarios\EditarUsuarioNew.module.css` (class selector (kebab-case) (línea 144))
    - `pages\usuarios\UsuariosNew.module.css` (class selector (kebab-case) (línea 145))

---

### LockIcon

- **File**: `icons\LockIcon.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `features\auth\pages\Login.tsx` (línea 6, import)
    - `pages\login\login.tsx` (línea 7, import)
  - **Used in JSX in**:
    - `features\auth\pages\Login.tsx` (línea 83)
    - `pages\login\login.tsx` (línea 83)

---

### Login

- **File**: `features\auth\pages\Login.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `routes\AppRoutes.tsx` (línea 11, import)
  - **Referenced in CSS**:
    - `features\auth\pages\Login.module.css` (fileName)
  - **Used in JSX in**:
    - `routes\AppRoutes.tsx` (línea 23)
  - **Used in routes in**:
    - `routes\AppRoutes.tsx` (línea 11)

---

### Login

- **File**: `pages\login\login.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `routes\AppRoutes.tsx` (línea 11, import)
  - **Referenced in CSS**:
    - `features\auth\pages\Login.module.css` (fileName)
  - **Used in JSX in**:
    - `routes\AppRoutes.tsx` (línea 23)
  - **Used in routes in**:
    - `routes\AppRoutes.tsx` (línea 11)

---

### MainLayout

- **File**: `components\Layout\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\Layout\index.ts` at line 4: `export { MainLayout, SideMenu };`
    - This barrel file is imported in:
      - `components\index.ts` at line 9: `// export * from './Layout';`
- **Usage Details**:
  - **Imported in**:
    - `components\Layout\index.ts` (línea 1, import)
    - `features\admin\routes\studentRoutes.tsx` (línea 3, import)
    - `features\admin\routes\teacherRoutes.tsx` (línea 3, import)
    - `features\admin\routes\userRoutes.tsx` (línea 3, import)
    - `routes\adminRoutes.tsx` (línea 3, import)
    - `routes\AppRoutes.tsx` (línea 2, import)
  - **Re-exported in barrel files**:
    - `components\Layout\index.ts` (línea 4): `export { MainLayout, SideMenu };`
  - **Referenced in CSS**:
    - `components\Layout\MainLayout.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\studentRoutes.tsx` (línea 16)
    - `features\admin\routes\studentRoutes.tsx` (línea 25)
    - `features\admin\routes\studentRoutes.tsx` (línea 34)
    - `features\admin\routes\studentRoutes.tsx` (línea 43)
    - `features\admin\routes\teacherRoutes.tsx` (línea 16)
    - `features\admin\routes\teacherRoutes.tsx` (línea 25)
    - `features\admin\routes\teacherRoutes.tsx` (línea 34)
    - `features\admin\routes\teacherRoutes.tsx` (línea 43)
    - `features\admin\routes\userRoutes.tsx` (línea 17)
    - `features\admin\routes\userRoutes.tsx` (línea 26)
    - `features\admin\routes\userRoutes.tsx` (línea 35)
    - `features\admin\routes\userRoutes.tsx` (línea 44)
    - `features\admin\routes\userRoutes.tsx` (línea 53)
    - `routes\adminRoutes.tsx` (línea 16)
    - `routes\adminRoutes.tsx` (línea 55)
    - `routes\AppRoutes.tsx` (línea 31)
    - `routes\AppRoutes.tsx` (línea 38)
    - `routes\AppRoutes.tsx` (línea 45)

---

### MainLayout

- **File**: `components\Layout\MainLayout.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\Layout\index.ts` at line 4: `export { MainLayout, SideMenu };`
    - This barrel file is imported in:
      - `components\index.ts` at line 9: `// export * from './Layout';`
- **Usage Details**:
  - **Imported in**:
    - `components\Layout\index.ts` (línea 1, import)
    - `features\admin\routes\studentRoutes.tsx` (línea 3, import)
    - `features\admin\routes\teacherRoutes.tsx` (línea 3, import)
    - `features\admin\routes\userRoutes.tsx` (línea 3, import)
    - `routes\adminRoutes.tsx` (línea 3, import)
    - `routes\AppRoutes.tsx` (línea 2, import)
  - **Re-exported in barrel files**:
    - `components\Layout\index.ts` (línea 4): `export { MainLayout, SideMenu };`
  - **Referenced in CSS**:
    - `components\Layout\MainLayout.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\studentRoutes.tsx` (línea 16)
    - `features\admin\routes\studentRoutes.tsx` (línea 25)
    - `features\admin\routes\studentRoutes.tsx` (línea 34)
    - `features\admin\routes\studentRoutes.tsx` (línea 43)
    - `features\admin\routes\teacherRoutes.tsx` (línea 16)
    - `features\admin\routes\teacherRoutes.tsx` (línea 25)
    - `features\admin\routes\teacherRoutes.tsx` (línea 34)
    - `features\admin\routes\teacherRoutes.tsx` (línea 43)
    - `features\admin\routes\userRoutes.tsx` (línea 17)
    - `features\admin\routes\userRoutes.tsx` (línea 26)
    - `features\admin\routes\userRoutes.tsx` (línea 35)
    - `features\admin\routes\userRoutes.tsx` (línea 44)
    - `features\admin\routes\userRoutes.tsx` (línea 53)
    - `routes\adminRoutes.tsx` (línea 16)
    - `routes\adminRoutes.tsx` (línea 55)
    - `routes\AppRoutes.tsx` (línea 31)
    - `routes\AppRoutes.tsx` (línea 38)
    - `routes\AppRoutes.tsx` (línea 45)

---

### MainLayout

- **File**: `layouts\MainLayout.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\Layout\index.ts` at line 4: `export { MainLayout, SideMenu };`
    - This barrel file is imported in:
      - `components\index.ts` at line 9: `// export * from './Layout';`
- **Usage Details**:
  - **Imported in**:
    - `components\Layout\index.ts` (línea 1, import)
    - `features\admin\routes\studentRoutes.tsx` (línea 3, import)
    - `features\admin\routes\teacherRoutes.tsx` (línea 3, import)
    - `features\admin\routes\userRoutes.tsx` (línea 3, import)
    - `routes\adminRoutes.tsx` (línea 3, import)
    - `routes\AppRoutes.tsx` (línea 2, import)
  - **Re-exported in barrel files**:
    - `components\Layout\index.ts` (línea 4): `export { MainLayout, SideMenu };`
  - **Referenced in CSS**:
    - `components\Layout\MainLayout.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\studentRoutes.tsx` (línea 16)
    - `features\admin\routes\studentRoutes.tsx` (línea 25)
    - `features\admin\routes\studentRoutes.tsx` (línea 34)
    - `features\admin\routes\studentRoutes.tsx` (línea 43)
    - `features\admin\routes\teacherRoutes.tsx` (línea 16)
    - `features\admin\routes\teacherRoutes.tsx` (línea 25)
    - `features\admin\routes\teacherRoutes.tsx` (línea 34)
    - `features\admin\routes\teacherRoutes.tsx` (línea 43)
    - `features\admin\routes\userRoutes.tsx` (línea 17)
    - `features\admin\routes\userRoutes.tsx` (línea 26)
    - `features\admin\routes\userRoutes.tsx` (línea 35)
    - `features\admin\routes\userRoutes.tsx` (línea 44)
    - `features\admin\routes\userRoutes.tsx` (línea 53)
    - `routes\adminRoutes.tsx` (línea 16)
    - `routes\adminRoutes.tsx` (línea 55)
    - `routes\AppRoutes.tsx` (línea 31)
    - `routes\AppRoutes.tsx` (línea 38)
    - `routes\AppRoutes.tsx` (línea 45)

---

### PageHeader

- **File**: `features\common\components\PageHeader\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\common\components\index.ts` at line 4: `export * from './PageHeader';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
  - Exported in `features\common\components\PageHeader\index.ts` at line 1: `export { PageHeader } from './PageHeader';`
    - This barrel file is imported in:
      - `features\common\components\index.ts` at line 4: `export * from './PageHeader';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 18, import)
    - `features\common\components\PageHeader\index.ts` (línea 1, usage)
  - **Re-exported in barrel files**:
    - `features\common\components\index.ts` (línea 4): `export * from './PageHeader';`
    - `features\common\components\PageHeader\index.ts` (línea 1): `export { PageHeader } from './PageHeader';`
  - **Referenced in CSS**:
    - `features\common\components\PageHeader\PageHeader.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 189)

---

### PageHeader

- **File**: `features\common\components\PageHeader\PageHeader.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\common\components\index.ts` at line 4: `export * from './PageHeader';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
  - Exported in `features\common\components\PageHeader\index.ts` at line 1: `export { PageHeader } from './PageHeader';`
    - This barrel file is imported in:
      - `features\common\components\index.ts` at line 4: `export * from './PageHeader';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 18, import)
    - `features\common\components\PageHeader\index.ts` (línea 1, usage)
  - **Re-exported in barrel files**:
    - `features\common\components\index.ts` (línea 4): `export * from './PageHeader';`
    - `features\common\components\PageHeader\index.ts` (línea 1): `export { PageHeader } from './PageHeader';`
  - **Referenced in CSS**:
    - `features\common\components\PageHeader\PageHeader.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 189)

---

### PageHeader

- **File**: `features\common\components\PageHeader.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\common\components\index.ts` at line 4: `export * from './PageHeader';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
  - Exported in `features\common\components\PageHeader\index.ts` at line 1: `export { PageHeader } from './PageHeader';`
    - This barrel file is imported in:
      - `features\common\components\index.ts` at line 4: `export * from './PageHeader';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 18, import)
    - `features\common\components\PageHeader\index.ts` (línea 1, usage)
  - **Re-exported in barrel files**:
    - `features\common\components\index.ts` (línea 4): `export * from './PageHeader';`
    - `features\common\components\PageHeader\index.ts` (línea 1): `export { PageHeader } from './PageHeader';`
  - **Referenced in CSS**:
    - `features\common\components\PageHeader\PageHeader.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 189)

---

### ProtectedRoute

- **File**: `components\ProtectedRoute.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `layouts\MainLayout.tsx` (línea 3, import)
    - `routes\AppRoutes.tsx` (línea 15, import)
  - **Used in JSX in**:
    - `layouts\MainLayout.tsx` (línea 7)
    - `routes\AppRoutes.tsx` (línea 30)
    - `routes\AppRoutes.tsx` (línea 37)
    - `routes\AppRoutes.tsx` (línea 44)
  - **Used in routes in**:
    - `components\ProtectedRoute.tsx` (línea 4)
    - `components\ProtectedRouteAdmin.tsx` (línea 5)
    - `features\admin\routes\studentRoutes.tsx` (línea 2)
    - `features\admin\routes\teacherRoutes.tsx` (línea 2)
    - `features\admin\routes\userRoutes.tsx` (línea 2)
    - `routes\adminRoutes.tsx` (línea 2)
    - `routes\AppRoutes.tsx` (línea 15)
    - `routes\ProtectedRoute.tsx` (línea 5)
    - `routes\ProtectedRouteAdmin.tsx` (línea 6)

---

### ProtectedRoute

- **File**: `routes\ProtectedRoute.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `layouts\MainLayout.tsx` (línea 3, import)
    - `routes\AppRoutes.tsx` (línea 15, import)
  - **Used in JSX in**:
    - `layouts\MainLayout.tsx` (línea 7)
    - `routes\AppRoutes.tsx` (línea 30)
    - `routes\AppRoutes.tsx` (línea 37)
    - `routes\AppRoutes.tsx` (línea 44)
  - **Used in routes in**:
    - `components\ProtectedRoute.tsx` (línea 4)
    - `components\ProtectedRouteAdmin.tsx` (línea 5)
    - `features\admin\routes\studentRoutes.tsx` (línea 2)
    - `features\admin\routes\teacherRoutes.tsx` (línea 2)
    - `features\admin\routes\userRoutes.tsx` (línea 2)
    - `routes\adminRoutes.tsx` (línea 2)
    - `routes\AppRoutes.tsx` (línea 15)
    - `routes\ProtectedRoute.tsx` (línea 5)
    - `routes\ProtectedRouteAdmin.tsx` (línea 6)

---

### ProtectedRouteAdmin

- **File**: `components\ProtectedRouteAdmin.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `features\admin\routes\studentRoutes.tsx` (línea 2, import)
    - `features\admin\routes\teacherRoutes.tsx` (línea 2, import)
    - `features\admin\routes\userRoutes.tsx` (línea 2, import)
    - `routes\adminRoutes.tsx` (línea 2, import)
  - **Used in JSX in**:
    - `features\admin\routes\studentRoutes.tsx` (línea 15)
    - `features\admin\routes\studentRoutes.tsx` (línea 24)
    - `features\admin\routes\studentRoutes.tsx` (línea 33)
    - `features\admin\routes\studentRoutes.tsx` (línea 42)
    - `features\admin\routes\teacherRoutes.tsx` (línea 15)
    - `features\admin\routes\teacherRoutes.tsx` (línea 24)
    - `features\admin\routes\teacherRoutes.tsx` (línea 33)
    - `features\admin\routes\teacherRoutes.tsx` (línea 42)
    - `features\admin\routes\userRoutes.tsx` (línea 16)
    - `features\admin\routes\userRoutes.tsx` (línea 25)
    - `features\admin\routes\userRoutes.tsx` (línea 34)
    - `features\admin\routes\userRoutes.tsx` (línea 43)
    - `features\admin\routes\userRoutes.tsx` (línea 52)
    - `routes\adminRoutes.tsx` (línea 15)
    - `routes\adminRoutes.tsx` (línea 54)
  - **Used in routes in**:
    - `components\ProtectedRouteAdmin.tsx` (línea 5)
    - `features\admin\routes\studentRoutes.tsx` (línea 2)
    - `features\admin\routes\teacherRoutes.tsx` (línea 2)
    - `features\admin\routes\userRoutes.tsx` (línea 2)
    - `routes\adminRoutes.tsx` (línea 2)
    - `routes\ProtectedRouteAdmin.tsx` (línea 6)

---

### ProtectedRouteAdmin

- **File**: `routes\ProtectedRouteAdmin.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `features\admin\routes\studentRoutes.tsx` (línea 2, import)
    - `features\admin\routes\teacherRoutes.tsx` (línea 2, import)
    - `features\admin\routes\userRoutes.tsx` (línea 2, import)
    - `routes\adminRoutes.tsx` (línea 2, import)
  - **Used in JSX in**:
    - `features\admin\routes\studentRoutes.tsx` (línea 15)
    - `features\admin\routes\studentRoutes.tsx` (línea 24)
    - `features\admin\routes\studentRoutes.tsx` (línea 33)
    - `features\admin\routes\studentRoutes.tsx` (línea 42)
    - `features\admin\routes\teacherRoutes.tsx` (línea 15)
    - `features\admin\routes\teacherRoutes.tsx` (línea 24)
    - `features\admin\routes\teacherRoutes.tsx` (línea 33)
    - `features\admin\routes\teacherRoutes.tsx` (línea 42)
    - `features\admin\routes\userRoutes.tsx` (línea 16)
    - `features\admin\routes\userRoutes.tsx` (línea 25)
    - `features\admin\routes\userRoutes.tsx` (línea 34)
    - `features\admin\routes\userRoutes.tsx` (línea 43)
    - `features\admin\routes\userRoutes.tsx` (línea 52)
    - `routes\adminRoutes.tsx` (línea 15)
    - `routes\adminRoutes.tsx` (línea 54)
  - **Used in routes in**:
    - `components\ProtectedRouteAdmin.tsx` (línea 5)
    - `features\admin\routes\studentRoutes.tsx` (línea 2)
    - `features\admin\routes\teacherRoutes.tsx` (línea 2)
    - `features\admin\routes\userRoutes.tsx` (línea 2)
    - `routes\adminRoutes.tsx` (línea 2)
    - `routes\ProtectedRouteAdmin.tsx` (línea 6)

---

### PUBLIC_ROUTES

- **File**: `routes\routeMap.ts`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `routes\AppRoutes.tsx` (línea 5, import)
  - **Used in routes in**:
    - `routes\AppRoutes.tsx` (línea 5)
    - `routes\routeMap.ts` (línea 9)

---

### ResetPasswordPage

- **File**: `features\admin\features\users\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\pages\index.ts` at line 9: `export { default as ResetPasswordPage } from './ResetPassword';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\users\pages\index.ts` (línea 9): `export { default as ResetPasswordPage } from './ResetPassword';`
  - **Referenced in CSS**:
    - `features\admin\features\users\pages\ResetPasswordPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\userRoutes.tsx` (línea 54)
  - **Used in routes in**:
    - `features\admin\routes\userRoutes.tsx` (línea 9)

---

### ResetPasswordPage

- **File**: `features\admin\features\users\pages\ResetPassword.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\pages\index.ts` at line 9: `export { default as ResetPasswordPage } from './ResetPassword';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\users\pages\index.ts` (línea 9): `export { default as ResetPasswordPage } from './ResetPassword';`
  - **Referenced in CSS**:
    - `features\admin\features\users\pages\ResetPasswordPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\userRoutes.tsx` (línea 54)
  - **Used in routes in**:
    - `features\admin\routes\userRoutes.tsx` (línea 9)

---

### SecureIcon

- **File**: `icons\SecureIcon.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `pages\cambiaContrasena\CambiaContrasena.tsx` (línea 4, import)
  - **Used in JSX in**:
    - `pages\cambiaContrasena\CambiaContrasena.tsx` (línea 45)

---

### SideMenu

- **File**: `components\Layout\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\Layout\index.ts` at line 4: `export { MainLayout, SideMenu };`
    - This barrel file is imported in:
      - `components\index.ts` at line 9: `// export * from './Layout';`
- **Usage Details**:
  - **Imported in**:
    - `components\Layout\index.ts` (línea 2, import)
    - `components\Layout\MainLayout.tsx` (línea 3, import)
    - `layouts\MainLayout.tsx` (línea 2, import)
  - **Re-exported in barrel files**:
    - `components\Layout\index.ts` (línea 4): `export { MainLayout, SideMenu };`
  - **Referenced in CSS**:
    - `components\Layout\SideMenu.module.css` (fileName)
  - **Used in JSX in**:
    - `components\Layout\MainLayout.tsx` (línea 14)
    - `layouts\MainLayout.tsx` (línea 9)

---

### SideMenu

- **File**: `components\Layout\SideMenu.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\Layout\index.ts` at line 4: `export { MainLayout, SideMenu };`
    - This barrel file is imported in:
      - `components\index.ts` at line 9: `// export * from './Layout';`
- **Usage Details**:
  - **Imported in**:
    - `components\Layout\index.ts` (línea 2, import)
    - `components\Layout\MainLayout.tsx` (línea 3, import)
    - `layouts\MainLayout.tsx` (línea 2, import)
  - **Re-exported in barrel files**:
    - `components\Layout\index.ts` (línea 4): `export { MainLayout, SideMenu };`
  - **Referenced in CSS**:
    - `components\Layout\SideMenu.module.css` (fileName)
  - **Used in JSX in**:
    - `components\Layout\MainLayout.tsx` (línea 14)
    - `layouts\MainLayout.tsx` (línea 9)

---

### StudentDetailPage

- **File**: `features\admin\features\students\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\students\pages\index.ts` at line 3: `export { default as StudentDetailPage } from './StudentDetailPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\students\routes.tsx` (línea 4, import)
  - **Re-exported in barrel files**:
    - `features\admin\features\students\pages\index.ts` (línea 3): `export { default as StudentDetailPage } from './StudentDetailPage';`
  - **Referenced in CSS**:
    - `features\admin\features\students\pages\StudentDetailPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\students\routes.tsx` (línea 12)
    - `features\admin\routes\studentRoutes.tsx` (línea 35)
  - **Used in routes in**:
    - `features\admin\features\students\routes.tsx` (línea 4)
    - `features\admin\routes\studentRoutes.tsx` (línea 6)

---

### StudentDetailPage

- **File**: `features\admin\features\students\pages\StudentDetailPage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\students\pages\index.ts` at line 3: `export { default as StudentDetailPage } from './StudentDetailPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\students\routes.tsx` (línea 4, import)
  - **Re-exported in barrel files**:
    - `features\admin\features\students\pages\index.ts` (línea 3): `export { default as StudentDetailPage } from './StudentDetailPage';`
  - **Referenced in CSS**:
    - `features\admin\features\students\pages\StudentDetailPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\students\routes.tsx` (línea 12)
    - `features\admin\routes\studentRoutes.tsx` (línea 35)
  - **Used in routes in**:
    - `features\admin\features\students\routes.tsx` (línea 4)
    - `features\admin\routes\studentRoutes.tsx` (línea 6)

---

### StudentListPage

- **File**: `features\admin\features\students\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\students\pages\index.ts` at line 2: `export { default as StudentListPage } from './StudentListPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\students\routes.tsx` (línea 3, import)
  - **Re-exported in barrel files**:
    - `features\admin\features\students\pages\index.ts` (línea 2): `export { default as StudentListPage } from './StudentListPage';`
  - **Referenced in CSS**:
    - `features\admin\features\students\pages\StudentListPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\students\routes.tsx` (línea 11)
    - `features\admin\routes\studentRoutes.tsx` (línea 17)
  - **Used in routes in**:
    - `features\admin\features\students\routes.tsx` (línea 3)
    - `features\admin\routes\studentRoutes.tsx` (línea 5)

---

### StudentListPage

- **File**: `features\admin\features\students\pages\StudentListPage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\students\pages\index.ts` at line 2: `export { default as StudentListPage } from './StudentListPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\students\routes.tsx` (línea 3, import)
  - **Re-exported in barrel files**:
    - `features\admin\features\students\pages\index.ts` (línea 2): `export { default as StudentListPage } from './StudentListPage';`
  - **Referenced in CSS**:
    - `features\admin\features\students\pages\StudentListPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\students\routes.tsx` (línea 11)
    - `features\admin\routes\studentRoutes.tsx` (línea 17)
  - **Used in routes in**:
    - `features\admin\features\students\routes.tsx` (línea 3)
    - `features\admin\routes\studentRoutes.tsx` (línea 5)

---

### StudentRoutes

- **File**: `features\admin\features\students\index.ts`
- **Status**: ❌ UNUSED
- **In Barrel Files**: Yes (❌ UNUSED)
  - Exported in `features\admin\features\students\index.ts` at line 7: `export { default as StudentRoutes } from './routes';`
    - ⚠️ This barrel file is not imported anywhere!

---

### StudentRoutes

- **File**: `features\admin\features\students\routes.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (❌ UNUSED)
  - Exported in `features\admin\features\students\index.ts` at line 7: `export { default as StudentRoutes } from './routes';`
    - ⚠️ This barrel file is not imported anywhere!
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\students\index.ts` (línea 7): `export { default as StudentRoutes } from './routes';`
  - **Used in routes in**:
    - `features\admin\features\students\routes.tsx` (línea 8)

---

### StudentTable

- **File**: `features\admin\features\students\components\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\students\components\index.ts` at line 2: `export { default as StudentTable } from './StudentTable';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\students\components\index.ts` (línea 2): `export { default as StudentTable } from './StudentTable';`
  - **Referenced in CSS**:
    - `features\admin\features\students\components\StudentTable.module.css` (fileName)

---

### StudentTable

- **File**: `features\admin\features\students\components\StudentTable.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\students\components\index.ts` at line 2: `export { default as StudentTable } from './StudentTable';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\students\components\index.ts` (línea 2): `export { default as StudentTable } from './StudentTable';`
  - **Referenced in CSS**:
    - `features\admin\features\students\components\StudentTable.module.css` (fileName)

---

### Table

- **File**: `components\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\index.ts` at line 12: `export * from './Table';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
  - Exported in `components\index.ts` at line 13: `export { default as Table } from './Table';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
- **Usage Details**:
  - **Imported in**:
    - `components\Table\index.ts` (línea 4, import)
  - **Re-exported in barrel files**:
    - `components\index.ts` (línea 12): `export * from './Table';`
    - `components\index.ts` (línea 13): `export { default as Table } from './Table';`
  - **Referenced in CSS**:
    - `components\Table\Table.module.css` (fileName)
    - `components\Table\Table.module.css` (class selector (kebab-case) (línea 10))
    - `features\admin\features\cycles\pages\CycleListPage.module.css` (class selector (kebab-case) (línea 186))
    - `features\admin\features\students\components\StudentTable.module.css` (class selector (kebab-case) (línea 1))
    - `features\admin\features\students\pages\StudentListPage.module.css` (class selector (kebab-case) (línea 151))
    - `features\admin\features\teachers\pages\EditTeacherPage.module.css` (class selector (kebab-case) (línea 497))
    - `features\admin\features\teachers\pages\TeachersPage.module.css` (class selector (kebab-case) (línea 189))
    - `features\admin\features\users\pages\UsersPage.module.css` (class selector (kebab-case) (línea 216))
    - `pages\admin\Ciclos.module.css` (class selector (kebab-case) (línea 186))
    - `pages\usuarios\UsuariosNew.module.css` (class selector (kebab-case) (línea 188))
  - **Used in JSX in**:
    - `features\admin\features\students\components\StudentTable.tsx` (línea 76)

---

### Table

- **File**: `components\Table\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\index.ts` at line 12: `export * from './Table';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
  - Exported in `components\index.ts` at line 13: `export { default as Table } from './Table';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
- **Usage Details**:
  - **Imported in**:
    - `components\Table\index.ts` (línea 4, import)
  - **Re-exported in barrel files**:
    - `components\index.ts` (línea 12): `export * from './Table';`
    - `components\index.ts` (línea 13): `export { default as Table } from './Table';`
  - **Referenced in CSS**:
    - `components\Table\Table.module.css` (fileName)
    - `components\Table\Table.module.css` (class selector (kebab-case) (línea 10))
    - `features\admin\features\cycles\pages\CycleListPage.module.css` (class selector (kebab-case) (línea 186))
    - `features\admin\features\students\components\StudentTable.module.css` (class selector (kebab-case) (línea 1))
    - `features\admin\features\students\pages\StudentListPage.module.css` (class selector (kebab-case) (línea 151))
    - `features\admin\features\teachers\pages\EditTeacherPage.module.css` (class selector (kebab-case) (línea 497))
    - `features\admin\features\teachers\pages\TeachersPage.module.css` (class selector (kebab-case) (línea 189))
    - `features\admin\features\users\pages\UsersPage.module.css` (class selector (kebab-case) (línea 216))
    - `pages\admin\Ciclos.module.css` (class selector (kebab-case) (línea 186))
    - `pages\usuarios\UsuariosNew.module.css` (class selector (kebab-case) (línea 188))
  - **Used in JSX in**:
    - `features\admin\features\students\components\StudentTable.tsx` (línea 76)

---

### Table

- **File**: `components\Table\Table.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `components\index.ts` at line 12: `export * from './Table';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
  - Exported in `components\index.ts` at line 13: `export { default as Table } from './Table';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
- **Usage Details**:
  - **Imported in**:
    - `components\Table\index.ts` (línea 4, import)
  - **Re-exported in barrel files**:
    - `components\index.ts` (línea 12): `export * from './Table';`
    - `components\index.ts` (línea 13): `export { default as Table } from './Table';`
  - **Referenced in CSS**:
    - `components\Table\Table.module.css` (fileName)
    - `components\Table\Table.module.css` (class selector (kebab-case) (línea 10))
    - `features\admin\features\cycles\pages\CycleListPage.module.css` (class selector (kebab-case) (línea 186))
    - `features\admin\features\students\components\StudentTable.module.css` (class selector (kebab-case) (línea 1))
    - `features\admin\features\students\pages\StudentListPage.module.css` (class selector (kebab-case) (línea 151))
    - `features\admin\features\teachers\pages\EditTeacherPage.module.css` (class selector (kebab-case) (línea 497))
    - `features\admin\features\teachers\pages\TeachersPage.module.css` (class selector (kebab-case) (línea 189))
    - `features\admin\features\users\pages\UsersPage.module.css` (class selector (kebab-case) (línea 216))
    - `pages\admin\Ciclos.module.css` (class selector (kebab-case) (línea 186))
    - `pages\usuarios\UsuariosNew.module.css` (class selector (kebab-case) (línea 188))
  - **Used in JSX in**:
    - `features\admin\features\students\components\StudentTable.tsx` (línea 76)

---

### TeacherDetailPage

- **File**: `features\admin\features\teachers\pages\TeacherDetailPage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\teachers\pages\index.ts` at line 3: `export * from './TeacherDetailPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\teachers\pages\index.ts` (línea 3): `export * from './TeacherDetailPage';`
  - **Referenced in CSS**:
    - `features\admin\features\teachers\pages\TeacherDetailPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\teacherRoutes.tsx` (línea 35)
  - **Used in routes in**:
    - `features\admin\routes\teacherRoutes.tsx` (línea 7)

---

### TeachersPage

- **File**: `features\admin\features\teachers\pages\TeachersPage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\teachers\pages\index.ts` at line 2: `export * from './TeachersPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\routes\teacherRoutes.tsx` (línea 4, import)
  - **Re-exported in barrel files**:
    - `features\admin\features\teachers\pages\index.ts` (línea 2): `export * from './TeachersPage';`
  - **Referenced in CSS**:
    - `features\admin\features\teachers\pages\TeachersPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\teacherRoutes.tsx` (línea 17)
  - **Used in routes in**:
    - `features\admin\routes\teacherRoutes.tsx` (línea 4)

---

### USER_ROUTES

- **File**: `routes\routeMap.ts`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `routes\AppRoutes.tsx` (línea 5, import)
  - **Used in routes in**:
    - `routes\AppRoutes.tsx` (línea 5)
    - `routes\routeMap.ts` (línea 18)

---

### UserButton

- **File**: `features\admin\features\users\components\ui\UserButton.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 19, import)
  - **Used in JSX in**:
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 193)
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 406)
    - `features\admin\features\users\pages\CreateUser.tsx` (línea 414)

---

### UserDeleteModal

- **File**: `features\admin\features\users\components\UserDeleteModal.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\components\index.ts` at line 3: `export * from './UserDeleteModal';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\index.ts` at line 5: `export * from './components';`
      - `features\admin\features\users\pages\CreateUser.tsx` at line 19: `import { UserButton } from '../components';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\users\components\index.ts` (línea 3): `export * from './UserDeleteModal';`

---

### UserDetailPage

- **File**: `features\admin\features\users\pages\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\pages\index.ts` at line 7: `export { UserDetailPage } from './UserDetail';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\users\pages\index.ts` (línea 7, usage)
  - **Re-exported in barrel files**:
    - `features\admin\features\users\pages\index.ts` (línea 7): `export { UserDetailPage } from './UserDetail';`
  - **Referenced in CSS**:
    - `features\admin\features\users\pages\UserDetailPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\userRoutes.tsx` (línea 36)
  - **Used in routes in**:
    - `features\admin\routes\userRoutes.tsx` (línea 7)

---

### UserDetailPage

- **File**: `features\admin\features\users\pages\UserDetail.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\pages\index.ts` at line 7: `export { UserDetailPage } from './UserDetail';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Imported in**:
    - `features\admin\features\users\pages\index.ts` (línea 7, usage)
  - **Re-exported in barrel files**:
    - `features\admin\features\users\pages\index.ts` (línea 7): `export { UserDetailPage } from './UserDetail';`
  - **Referenced in CSS**:
    - `features\admin\features\users\pages\UserDetailPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\userRoutes.tsx` (línea 36)
  - **Used in routes in**:
    - `features\admin\routes\userRoutes.tsx` (línea 7)

---

### UserIcon

- **File**: `icons\UserIcon.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `features\auth\pages\Login.tsx` (línea 7, import)
    - `pages\login\login.tsx` (línea 8, import)
  - **Used in JSX in**:
    - `features\auth\pages\Login.tsx` (línea 65)
    - `pages\login\login.tsx` (línea 65)

---

### UserSelectionModal

- **File**: `components\UserSelectionModal\index.ts`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `components\UserSelectionModal\index.ts` (línea 1, import)
    - `features\admin\features\teachers\pages\CreateTeacherPage.tsx` (línea 12, import)
  - **Referenced in CSS**:
    - `components\UserSelectionModal\UserSelectionModal.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\teachers\pages\CreateTeacherPage.tsx` (línea 382)
    - `features\admin\features\teachers\pages\EditTeacherPage.tsx` (línea 430)

---

### UserSelectionModal

- **File**: `components\UserSelectionModal\UserSelectionModal.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: No
- **Usage Details**:
  - **Imported in**:
    - `components\UserSelectionModal\index.ts` (línea 1, import)
    - `features\admin\features\teachers\pages\CreateTeacherPage.tsx` (línea 12, import)
  - **Referenced in CSS**:
    - `components\UserSelectionModal\UserSelectionModal.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\features\teachers\pages\CreateTeacherPage.tsx` (línea 382)
    - `features\admin\features\teachers\pages\EditTeacherPage.tsx` (línea 430)

---

### UsersPage

- **File**: `features\admin\features\users\pages\UsersPage.tsx`
- **Status**: ✅ USED
- **In Barrel Files**: Yes (✅ USED)
  - Exported in `features\admin\features\users\pages\index.ts` at line 2: `export * from './UsersPage';`
    - This barrel file is imported in:
      - `features\admin\features\students\index.ts` at line 6: `export * from './pages';`
      - `features\admin\features\users\index.ts` at line 2: `export * from './pages';`
- **Usage Details**:
  - **Re-exported in barrel files**:
    - `features\admin\features\users\pages\index.ts` (línea 2): `export * from './UsersPage';`
  - **Referenced in CSS**:
    - `features\admin\features\users\pages\UsersPage.module.css` (fileName)
  - **Used in JSX in**:
    - `features\admin\routes\userRoutes.tsx` (línea 18)
  - **Used in routes in**:
    - `features\admin\routes\userRoutes.tsx` (línea 5)

---

## Recommendations

- Components marked as **UNUSED** can be safely removed from the codebase if they are not needed for future use.
- When removing a component, check if it's exported in any barrel files and remove those export statements as well.
- Components in **UNUSED BARREL FILES** might need to be reconsidered for removal since they're only exported in barrel files that aren't used elsewhere.
- Components marked as **ONLY CSS FILENAME** should be reviewed to determine if they are truly needed.

Report generated by find-unused-components-final.js
