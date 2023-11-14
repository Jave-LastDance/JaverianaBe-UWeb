// sections
import AdminUsersView from 'src/sections/administrador/usuarios/view/users-list-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'BE-U: Administrador',
};

export default function PermissionDeniedPage() {
  return <AdminUsersView />;
}