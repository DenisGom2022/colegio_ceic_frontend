// Export user-related pages
export * from './UsersPage';
// Original component with legacy structure
export { CreateUserPage as CreateUserPageLegacy } from './CreateUser';
// New component with identical structure to CrearUsuarioNew
export { CreateUserPage } from './CreateUserPage';
export { UserDetailPage } from './UserDetail';
export { default as EditUserPage } from './EditUser';
export { default as ResetPasswordPage } from './ResetPassword';
