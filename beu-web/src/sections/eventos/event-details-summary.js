import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { format } from 'date-fns';

// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import Typography from '@mui/material/Typography';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// utils
import { fShortenNumber, fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
//


// ----------------------------------------------------------------------

export default function EventDetailsSummary({
  items,
  event,
  onAddCart,
  onGotoStep,
  disabledActions,
  ...other
}) {
  const router = useRouter();

  const {
    id,
    name,
    category,
    description,
    location,
    capacity,
    mode,
    createdStart,
    createdEnd,
    timeStart,
    timeEnd,
    cycle,
    duration,
    price,
    coverUrl,
    available,
    totalRating,
    totalReview,
 
  } = event;

  const existEvent = !!items?.length && items.map((item) => item.id).includes(id);

  const isMaxQuantity =
    !!items?.length &&
    items.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    name,
    coverUrl,
    available,
    price,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (event) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!existEvent) {
        onAddCart?.({
          ...data,
          colors: [values.colors],
          subTotal: data.price * data.quantity,
        });
      }
      onGotoStep?.(0);
      router.push(paths.dashboard.eventos.root);
    } catch (error) {
      console.error(error);
    }
  });

  const handleAddCart = useCallback(() => {
    try {
      onAddCart?.({
        ...values,
        colors: [values.colors],
        subTotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  }, [onAddCart, values]);

  const startHours = parseInt(timeStart);
  const endHours = parseInt(timeEnd);

  const durationHours = endHours - startHours;

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      
      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Favoritos
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Compartir
      </Link>
    </Stack>
  );

  const renderLocation = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Lugar
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'justify' }}>
      {location}
      </Typography>
    </Stack>
  );

  const renderCapacity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Capacidad
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'justify' }}>
      {capacity} Personas
      </Typography>

    </Stack>
  );

  const renderStartDate= (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Fecha Inicio
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'justify', textTransform: 'capitalize'}}>
      {createdStart}
      </Typography>

    </Stack>
    
  );

  const renderEndDate= (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Fecha Fin
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'justify', textTransform: 'capitalize'}}>
      {createdEnd}
      </Typography>

    </Stack>
    
  );

  const renderCycle = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Ciclo Electivo
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'justify' }}>
      {cycle}
      </Typography>
    </Stack>
  );

  const renderDuration = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Duración
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'justify' }}>
      {durationHours} Hora(s)
      </Typography>
    </Stack>
  );

  const renderPrice = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Precio
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'justify' }}>
        {price === 0 ? 'GRATIS' : fCurrency(price)}
      </Typography>
    </Stack>
  );
  

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        size="large"
        color="primary"
        variant="contained"
        startIcon={<Iconify icon="fluent:preview-link-16-regular" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Previsualización
      </Button>

    </Stack>
  );

  const renderDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'justify' }}>
      {description}
    </Typography>
  );

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: 'text.disabled',
        typography: 'body2',
      }}
    >
      <Rating size="small" value={totalRating} precision={0.5} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(totalReview)} reviews)`}
    </Stack>
  );

  
  const renderMode =  (
<Stack direction="row" alignItems="center" spacing={1}>

    {mode === 'presencial' && <Label color="success">{mode.toUpperCase()}</Label>}
    {mode === 'virtual' && <Label color="info">{mode.toUpperCase()}</Label>}
    {mode !== 'presencial' && mode !== 'virtual' && <Label color="error">{mode.toUpperCase()}</Label>}
  </Stack>
  );

  const renderCategory = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color: 'primary.main',
      }}
    >
      {category}
    </Box>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">

          {renderMode}

          <Typography variant="h5">{name}</Typography>

          {renderRating}

          {renderCategory}

          {renderDescription}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderLocation}

        {renderCapacity}

        {renderStartDate}

        {renderEndDate}
        
        {renderCycle}

        {renderDuration}

        {renderPrice}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}

        {renderShare}
      </Stack>
    </FormProvider>
  );
}

EventDetailsSummary.propTypes = {
  items: PropTypes.array,
  disabledActions: PropTypes.bool,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  event: PropTypes.object,
};
