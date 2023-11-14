'use client';

import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// api
import { useGetEvent, updateStateEvent } from 'src/api/event';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
//
import { EventDetailsSkeleton } from '../event-skeleton';
import EventDetailsReview from '../event-details-review';
import EventDetailsSummary from '../event-details-summary';
import EventDetailsToolbar from '../event-details-toolbar';
import EventDetailsCarousel from '../event-details-carousel';
import EventDetailsDescription from '../event-details-description';
import EventDetailsActivities from '../event-details-activities';
// ----------------------------------------------------------------------

const STATE_OPTIONS = [
  { value: 'activo', label: 'Activo' },
  { value: 'borrador', label: 'Borrador' },
  { value: 'desactivado', label: 'Desactivado' },
  { value: 'cancelado', label: 'Cancelado' },
];
// ----------------------------------------------------------------------

export default function EventDetailsView({ id }) {
  const { event, eventLoading, eventError } = useGetEvent(id);

  console.log('EVENT', event);

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('description');

  const [publishState, setPublishState] = useState(event?.state || 'borrador');

  useEffect(() => {
    if (event) {
      setPublishState(event?.state);
    }
  }, [event?.state]);

  const handleChangePublish = useCallback(
    (newValue) => {
      setPublishState(newValue);
      updateStateEvent(id, newValue).catch((error) => {
        console.error('Error al actualizar el estado:', error);
      });
    },
    [id]
  );

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const renderSkeleton = <EventDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${eventError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.eventos.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Regresar
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderEvent = event && (
    <>
      <EventDetailsToolbar
        backLink={paths.dashboard.eventos.root}
        editLink={paths.dashboard.eventos.edit(`${event?.id}`)}
        liveLink={event.eventUrl}
        state={publishState || event?.state}
        onChangeState={handleChangePublish}
        stateOptions={STATE_OPTIONS}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <EventDetailsCarousel event={event} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <EventDetailsSummary disabledActions event={event} />
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 4 }}
      ></Box>

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: 'description',
              label: 'Descripción y Resumen',
            },
            {
              value: 'activities',
              label: 'Actividades',
              hidden: !event.activities || event.activities.length === 0,
            },
            {
              value: 'reviews',
              label: `Reseñas (${event.reviews.length})`,
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === 'description' && (
          <EventDetailsDescription description={event?.description} url={event?.requirements} />
        )}

        {currentTab === 'activities' && <EventDetailsActivities activities={event.activities} />}

        {currentTab === 'reviews' && (
          <EventDetailsReview
            ratings={event?.ratings}
            reviews={event?.reviews}
            totalRatings={event?.totalRating}
            totalReviews={event?.totalReview}
          />
        )}
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {eventLoading && renderSkeleton}

      {eventError && renderError}

      {event && renderEvent}
    </Container>
  );
}

EventDetailsView.propTypes = {
  id: PropTypes.string,
};
