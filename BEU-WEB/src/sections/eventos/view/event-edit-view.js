'use client';

import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// api
import { useGetEvent } from 'src/api/event';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

//
import EventNewEditForm from 'src/sections/eventos/event-new-edit-form';

// ----------------------------------------------------------------------

export default function EventEditView({ id }) {
  const settings = useSettingsContext();

  const { event: currentEvent, eventLoading, eventError } = useGetEvent(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Editar"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Eventos',
            href: paths.dashboard.eventos.root,
          },
          {
            name: currentEvent?.name,
            href: paths.dashboard.eventos.details(id),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <EventNewEditForm currentEvent={currentEvent} />
    </Container>
  );
}

EventEditView.propTypes = {
  id: PropTypes.string,
};
