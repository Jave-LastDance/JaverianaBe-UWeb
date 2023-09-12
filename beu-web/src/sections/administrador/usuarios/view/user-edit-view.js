'use client';

import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
//api
import { useGetUser } from 'src/api/user';
// _mock
import { _userList } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserNewEditForm from 'src/sections/administrador/usuarios/user-new-edit-form';

// ----------------------------------------------------------------------

export default function UserEditView({ id }) {
  const settings = useSettingsContext();

  const { user, userLoading, userError } = useGetUser(id);


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Editar Usuario"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Administrador',
            href: paths.dashboard.admin.root,
          },
          {
            name: 'Usuarios',
            href: paths.dashboard.admin.root,
          },
          { name: user?.displayName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
   
   <UserNewEditForm currentUser={user} />
      
    </Container>
  );
}

UserEditView.propTypes = {
  id: PropTypes.string,
};
