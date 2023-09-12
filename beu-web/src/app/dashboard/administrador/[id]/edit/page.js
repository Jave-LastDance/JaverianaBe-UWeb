import PropTypes from 'prop-types';
// _mock
import { _userList } from 'src/_mock/_user';
// sections
import  UserEditView  from 'src/sections/administrador/usuarios/view/user-edit-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'BE-U: Editar Usuario',
};

export default function UserEditPage({ params }) {
  const { id } = params;

  return <UserEditView id={id} />;
}


UserEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};