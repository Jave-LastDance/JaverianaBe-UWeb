import PropTypes from 'prop-types';
import { parseISO, sub } from 'date-fns';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
// auth
import { AuthContext } from 'src/auth/context/jwt/auth-context';
import { useContext } from 'react';
// api
import { updateEvent, createEvent, deleteActivity, uploadImages } from 'src/api/event';
import { toServiceEvent, toServiceNewEvent } from 'src/services/events-microservice';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import {
  EVENT_TAGS,
  EVENT_CYLE,
  EVENT_CATEGORY_OPTIONS,
  EVENT_HEAD_OPTIONS,
  EVENT_CENTER_OPTIONS,
  EVENT_PUBLIC_OPTIONS,
  EVENT_TOPIC_OPTIONS,
  EVENT_HOURS_OPTIONS,
  EVENT_LOCATIONS_OPTIONS,
} from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFSelect,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function EventNewEditForm({ currentEvent }) {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [includePrice, setIncludePrice] = useState(currentEvent?.price !== 0);

  const [eventState, setEventState] = useState(currentEvent?.state || 'borrador');

  useEffect(() => {
    if (currentEvent) {
      setEventState(currentEvent?.state);
    }
  }, [currentEvent?.state]);

  const handlePublishChange = () => {
    setEventState(eventState === 'activo' ? 'borrador' : 'activo');
  };

  const NewEventSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    tags: Yup.array().min(2, 'Debe tener al menos 2 etiquetas'),
    category: Yup.string().required('La categoría es obligatoria'),
    description: Yup.string().required('La descripción es obligatoria'),
    cycle: Yup.string().required('El ciclo electivo es obligatorio'),
    location: Yup.string().required('La ubicación es obligatoria'),
    createdStart: Yup.mixed().required('La fecha de creación es obligatoria'),
    headEmail: Yup.string().required('El encargado del evento es obligatorio'),
    center: Yup.string().required('El centro javeriano es obligatorio'),
    eventUrl: Yup.string().required('La URL del evento es obligatoria'),
    coverUrl: Yup.string().required('La imagen de portada es obligatoria'),
    topic: Yup.array().min(1, 'Debe tener al menos 1 tema'),
    public_type: Yup.array().min(1, 'Debe tener al menos 1 tipo de público'),
    timeStart: Yup.string().required('La hora de inicio es obligatoria'),
    timeEnd: Yup.string().required('La hora de fin es obligatoria'),
    requirements: Yup.string().required('El resumen es obligatorio'),
    createdEnd: Yup.mixed()
      .required('La fecha de vencimiento es obligatoria')
      .test(
        'date-min',
        'La fecha de vencimiento debe ser posterior a la fecha de creación',
        (value, { parent }) => value.getTime() >= parent.createdStart.getTime()
      ),
    includePrice: Yup.boolean(), // Debe ser un booleano en tus datos.
    // No Obligatory
    capacity: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentEvent?.id || '',
      name: currentEvent?.name || '',
      description: currentEvent?.description || '',
      images: currentEvent?.images || [],
      location: currentEvent?.location || '',
      duration: currentEvent?.duration || '',
      mode: currentEvent?.mode || '',
      price: currentEvent?.price || 0,
      capacity: currentEvent?.capacity || 0,
      cycle: currentEvent?.cycle || '',
      createdStart: parseISO(currentEvent?.createdStart),
      createdEnd: parseISO(currentEvent?.createdEnd),
      eventUrl: currentEvent?.eventUrl || '',
      tags: currentEvent?.tags || [],
      category: currentEvent?.category || '',
      public_type: currentEvent?.public_type || [],
      topic: currentEvent?.topic || [],
      requirements: currentEvent?.requirements || '',
      state: currentEvent?.state || '',
      totalRating: currentEvent?.totalRating || 0,
      coverUrl: currentEvent?.coverUrl || '',
      startPost: parseISO(currentEvent?.startPost) || new Date(),
      headEmail: currentEvent?.headEmail || '',
      center: currentEvent?.center || '',
      timeStart: currentEvent?.timeStart || '',
      timeEnd: currentEvent?.timeEnd || '',
      activities: currentEvent?.activities || [],
    }),
    [currentEvent]
  );

  const methods = useForm({
    resolver: yupResolver(NewEventSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'activities',
  });

  const handleAdd = () => {
    append({
      id_event: currentEvent?.id,
      id_activity: '',
      location: '',
      topic: '',
      public_type: '',
      category: '',
      name: '',
      date: '',
      time_end: '',
      time_start: '',
      description: '',
    });
  };

  useEffect(() => {
    if (currentEvent) {
      reset(defaultValues);
    }
  }, [currentEvent, defaultValues, reset]);

  useEffect(() => {
    if (includePrice) {
      setValue('price', currentEvent?.price || 0);
    } else {
      setValue('price', currentEvent?.price || 0);
    }
  }, [currentEvent?.price, includePrice, setValue]);

  const handleRemoveActivity = (index, id) => {
    if (id !== '') {
      deleteActivity(id);
    }
    remove(index);
  };

  const handleDropCover = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 1) {
        const file = acceptedFiles[0];

        const newFile = URL.createObjectURL(file);

        setValue('coverUrl', newFile, { shouldValidate: false });

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('http://localhost:3000/api/events/uploadCover', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            const imageUrl = data.imageUrl; // Obtener la URL del servidor

            console.log(imageUrl); // Maneja la respuesta del servidor

            setValue('coverUrl', imageUrl, { shouldValidate: false });
          } else {
            console.error('Error al subir el archivo');
          }
        } catch (error) {
          console.error('Error al subir el archivo', error);
        }
      }
    },
    [setValue]
  );

  const handleDropCoverActivities = useCallback(
    async (acceptedFiles, activityIndex) => {
      if (acceptedFiles.length === 1) {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('http://localhost:3000/api/events/uploadCover', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            const imageUrl = data.imageUrl; // Obtener la URL del servidor

            // Utiliza el índice de la actividad para actualizar el coverUrl correcto.
            setValue(`activities[${activityIndex}].url_poster`, imageUrl, {
              shouldValidate: false,
            });
          } else {
            console.error('Error al subir el archivo');
          }
        } catch (error) {
          console.error('Error al subir el archivo', error);
        }
      }
    },
    [setValue]
  );

  const handleDropImages = useCallback(
    async (acceptedFiles) => {
      const files = values.images || [];

      const newUrls = acceptedFiles.map((file) => URL.createObjectURL(file));

      setValue('images', [...files, ...newUrls], { shouldValidate: true });

      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('file', file);

        // Realizar la solicitud para subir cada archivo
        fetch('http://localhost:3000/api/events/uploadCover', {
          method: 'POST',
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Error al subir el archivo');
            }
          })
          .then((data) => {
            const imageUrl = data.imageUrl; // Obtener la URL del servidor
            setValue('images', [...files, imageUrl], { shouldValidate: true });
          })
          .catch((error) => {
            console.error('Error al subir el archivo', error);
          });
      });
    },
    [setValue, values.images]
  );

  const onSubmit = handleSubmit(async (data) => {
    data.state = eventState;

    try {
      if (currentEvent) {
        const Transformedata = toServiceEvent(data);
        console.info('DATA', Transformedata);
        await updateEvent(Transformedata);
        reset();
        enqueueSnackbar('¡Actualización Exitosa!');
        router.push(paths.dashboard.eventos.details(currentEvent.id));
      } else {
        const TransformNewEvent = toServiceNewEvent(data);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await createEvent(TransformNewEvent);
        reset();
        enqueueSnackbar('¡Creación exitosa!');
        router.push(paths.dashboard.eventos.root);
        console.info('DATA', TransformNewEvent);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const handleChangeIncludePrice = useCallback((event) => {
    setIncludePrice(event.target.checked);
  }, []);

  const renderDetails = (
    <>
      <Grid xs={12} md={6}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Detalles
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Título, descripción e imágenes...
        </Typography>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Nombre del Evento" />

            <RHFTextField name="description" label="Descripción" multiline rows={4} />

            <RHFTextField name="requirements" label="Resumen" />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Cover</Typography>
              <RHFUpload
                thumbnail
                name="coverUrl"
                maxSize={3145728}
                onDrop={handleDropCover}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
              <Typography variant="subtitle2">Fotos</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDropImages}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      <Grid xs={12} md={6}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Propiedades
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Atributos del evento
        </Typography>
        <Card sx={{ mb: 3 }}>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFSelect
                fullWidth
                name="location"
                label="Ubicación"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {EVENT_LOCATIONS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                fullWidth
                name="cycle"
                label="Ciclo Electivo"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {EVENT_CYLE.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                name="capacity"
                label="Capacidad"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFSelect
                fullWidth
                name="category"
                label="Categoría"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {EVENT_CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Controller
                name="createdStart"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Fecha Inicio"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="createdEnd"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    format="dd/MM/yyyy"
                    label="Fecha Fin"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />

              <RHFSelect
                fullWidth
                name="timeStart"
                label="Hora Inicio"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {EVENT_HOURS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                fullWidth
                name="timeEnd"
                label="Hora Fin"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {EVENT_HOURS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                fullWidth
                name="headEmail"
                label="Encargado del Evento"
                InputLabelProps={{ shrink: true }}
              >
                {EVENT_HEAD_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              {user?.center === 'BE-U' && (
                <RHFSelect
                  fullWidth
                  name="center"
                  label="Centro Javeriano"
                  InputLabelProps={{ shrink: true }}
                >
                  {EVENT_CENTER_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
            </Box>

            <RHFAutocomplete
              name="public_type"
              label="Público"
              placeholder="+ Tipos"
              multiple
              freeSolo
              options={EVENT_PUBLIC_OPTIONS.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <RHFAutocomplete
              name="topic"
              label="Tema"
              placeholder="+ Temas"
              multiple
              freeSolo
              options={EVENT_TOPIC_OPTIONS.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="success"
                    variant="soft"
                  />
                ))
              }
            />

            <RHFAutocomplete
              name="tags"
              label="Etiquetas"
              placeholder="+ Etiquetas"
              multiple
              freeSolo
              options={EVENT_TAGS.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="error"
                    variant="soft"
                  />
                ))
              }
            />

            <RHFTextField name="eventUrl" label="URL Evento" />

            <Typography variant="subtitle2">Modalidad</Typography>

            <Controller
              name="mode"
              control={control}
              render={({ field }) => (
                <Box gap={2} display="grid" gridTemplateColumns="repeat(3, 1fr)">
                  {[
                    {
                      label: 'remoto',
                      icon: <Iconify icon="ri:remote-control-line" width={32} sx={{ mb: 2 }} />,
                    },
                    {
                      label: 'presencial',
                      icon: <Iconify icon="ic:sharp-people" width={32} sx={{ mb: 2 }} />,
                    },
                    {
                      label: 'combinada',
                      icon: <Iconify icon="mdi:instant-mix" width={32} sx={{ mb: 2 }} />,
                    },
                  ].map((item) => (
                    <Paper
                      component={ButtonBase}
                      variant="outlined"
                      key={item.label}
                      onClick={() => field.onChange(item.label)}
                      sx={{
                        p: 2.5,
                        borderRadius: 1,
                        typography: 'subtitle2',
                        flexDirection: 'column',
                        ...(item.label === field.value && {
                          borderWidth: 2,
                          borderColor: 'text.primary',
                        }),
                      }}
                    >
                      {item.icon}
                      {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                    </Paper>
                  ))}
                </Box>
              )}
            />

            <Controller
              name="startPost"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  label="Fecha Inicio de Publicación"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <FormControlLabel
                control={<Switch checked={includePrice} onChange={handleChangeIncludePrice} />}
                label="Precio"
              />

              {includePrice && (
                <RHFTextField
                  name="price"
                  label="Precio"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          $
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  // RENDER EVENT ACTIVITIES
  const renderActivities = (
    <>
      <Grid xs={12} md={12}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Actividades
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Actividades del evento
        </Typography>
        <Card sx={{ mb: 3 }}>
          {!mdUp && <CardHeader title="Activities" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={3}>
              {fields.map((item, index) => (
                <Stack key={item.id_activity} alignItems="flex-start" spacing={1.5}>
                  <Typography variant="subtitle2" sx={{ textAlign: 'left' }}>{`Actividad ${
                    index + 1
                  }`}</Typography>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <RHFUpload
                      thumbnail
                      name={`activities[${index}].url_poster`}
                      maxSize={3145728}
                      onDrop={(acceptedFiles) => handleDropCoverActivities(acceptedFiles, index)}
                      onRemove={handleRemoveFile}
                      onRemoveAll={handleRemoveAllFiles}
                      onUpload={() => console.info('ON UPLOAD')}
                      sx={{ maxWidth: '250px' }}
                    />

                    <Box
                      columnGap={2}
                      rowGap={1}
                      display="grid"
                      gridTemplateRows={{
                        xs: 'repeat(auto, minmax(0, auto))', // Ajusta automáticamente la altura según el contenido pero con un mínimo de 0
                        md: 'repeat(auto, minmax(0, auto))', // Ajusta automáticamente la altura según el contenido pero con un mínimo de 0
                      }}
                      gridTemplateColumns={{
                        xs: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)',
                      }}
                    >
                      <RHFTextField
                        name={`activities[${index}].name`}
                        label="Nombre"
                        InputLabelProps={{ shrink: true }}
                      />

                      <RHFTextField
                        name={`activities[${index}].description`}
                        label="Descripción"
                        InputLabelProps={{ shrink: true }}
                      />
                      <RHFSelect
                        fullWidth
                        name={`activities[${index}].location`}
                        label="Ubicación"
                        InputLabelProps={{ shrink: true }}
                        PaperPropsSx={{ textTransform: 'capitalize' }}
                      >
                        {EVENT_LOCATIONS_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                      <RHFSelect
                        name={`activities[${index}].category`}
                        label="Categoría"
                        PaperPropsSx={{ textTransform: 'capitalize' }}
                        sx={{ width: '250px' }} // Ajusta el ancho según tus necesidades
                      >
                        {EVENT_CATEGORY_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </RHFSelect>

                      <Controller
                        name={`activities[${index}].date`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <DatePicker
                            {...field}
                            value={field.value ? parseISO(field.value) : null} // Transformar la fecha con parseISO
                            format="dd/MM/yyyy"
                            label="Fecha"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!error,
                                helperText: error?.message,
                              },
                            }}
                            rules={{
                              validate: (value) => (value ? true : undefined), // Permitir que sea opcional
                            }}
                          />
                        )}
                      />

                      <RHFSelect
                        fullWidth
                        name={`activities[${index}].time_start`}
                        label="Hora Inicio"
                        InputLabelProps={{ shrink: true }}
                        PaperPropsSx={{ textTransform: 'capitalize' }}
                      >
                        {EVENT_HOURS_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                      <RHFSelect
                        fullWidth
                        name={`activities[${index}].time_end`}
                        label="Hora Fin"
                        InputLabelProps={{ shrink: true }}
                        PaperPropsSx={{ textTransform: 'capitalize' }}
                      >
                        {EVENT_HOURS_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </RHFSelect>

                      <RHFSelect
                        fullWidth
                        name={`activities[${index}].public_type`}
                        label="Público"
                        InputLabelProps={{ shrink: true }}
                      >
                        {EVENT_PUBLIC_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </RHFSelect>

                      <RHFSelect
                        fullWidth
                        name={`activities[${index}].topic`}
                        label="Tema"
                        InputLabelProps={{ shrink: true }}
                      >
                        {EVENT_TOPIC_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </RHFSelect>

                      <Button
                        color="error"
                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                        onClick={() => handleRemoveActivity(index, item.id_activity)}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </Stack>
                </Stack>
              ))}

              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleAdd}
                sx={{ flexShrink: 0 }}
              >
                Agregar Actividad
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      <Grid xs={12} md={12} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch checked={eventState === 'activo'} onChange={handlePublishChange} />}
          label="Publicar"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentEvent ? 'Crear Evento' : 'Guardar Cambios'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderActivities}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

EventNewEditForm.propTypes = {
  currentEvent: PropTypes.object,
};
