import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// _mock
import { USER_CENTER_OPTIONS, USER_ROLE_OPTIONS } from 'src/_mock';
// utils
import { fData } from 'src/utils/format-number';
// api
import { updateUser, createUser, deleteUser } from 'src/api/user';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// assets
import { countries } from 'src/assets/data';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentUser }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    displayName: Yup.string().required('El nombre es obligatorio'),
    email: Yup.string()
      .required('El correo electrónico es obligatorio')
      .email('El correo electrónico debe ser una dirección válida'),
    phoneNumber: Yup.string().required('El número de teléfono es obligatorio'),
    address: Yup.string().required('La dirección es obligatoria'),
    role: Yup.string().required('El rol es obligatorio'),
    photoURL: Yup.string().required('El avatar es obligatorio'),
    center: Yup.string().required('El centro es obligatorio'),
  });

  const defaultValues = useMemo(
    () => ({
      displayName: currentUser?.displayName || '',
      city: currentUser?.city || '',
      role: currentUser?.role || '',
      email: currentUser?.email || '',
      state: currentUser?.state || '',
      center: currentUser?.center || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      zipCode: currentUser?.zipCode || '',
      photoURL: currentUser?.photoURL || null,
      phoneNumber: currentUser?.phoneNumber || '',
      status: currentUser?.status || '',
      isVerified: currentUser?.isVerified || false,
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
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

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentUser) {
        await updateUser(data, currentUser?.id);
        reset();
        enqueueSnackbar('¡Actualización Exitosa!');
        router.push(paths.dashboard.admin.edit(currentUser.id));
        console.info('DATA', data);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await createUser(data);
        reset();
        enqueueSnackbar('¡Creación exitosa!');
        router.push(paths.dashboard.admin.root);
        console.info('DATA', data);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleDeleteUser = useCallback(async () => {
    try {
      await deleteUser(currentUser?.id);
      reset();
      enqueueSnackbar('¡Eliminación Exitosa!');
      router.push(paths.dashboard.admin.root);
      console.info('DATA', currentUser?.id);

    } catch (error) {
      console.error(error);
    }
  });

  const renderProperties = (
    <>
      <Grid xs={12} md={4}>
        <Card sx={{ pt: 10, pb: 5, px: 3 }}>
          {currentUser && (
            <Label
              color={
                (values.status === 'activo' && 'success') ||
                (values.status === 'inactivo' && 'error') ||
                'warning'
              }
              sx={{ position: 'absolute', top: 24, right: 24 }}
            >
              {values.status}
            </Label>
          )}
          <Box sx={{ mb: 5 }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Formatos permitidos *.jpeg, *.jpg, *.png, *.gif
                  <br /> Tamaño máximo {fData(3145728)}
                </Typography>
              }
            />
          </Box>

          {currentUser && (
            <FormControlLabel
              labelPlacement="start"
              control={
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value !== 'activo'}
                      onChange={(event) =>
                        field.onChange(event.target.checked ? 'inactivo' : 'activo')
                      }
                    />
                  )}
                />
              }
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Desabilitar Cuenta
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Apply disable account
                  </Typography>
                </>
              }
              sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
            />
          )}
          <RHFSwitch
            name="isVerified"
            labelPlacement="start"
            label={
              <>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Correo Verificado
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Desactivar esto enviará automáticamente al usuario un correo electrónico de
                  verificación.
                </Typography>
              </>
            }
            sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
          />

          {currentUser && (
            <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
              <Button onClick={handleDeleteUser} variant="soft" color="error">
                Eliminar Usuario
              </Button>
            </Stack>
          )}
        </Card>
      </Grid>

      <Grid xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="displayName" label="Nombre Completo" />
            <RHFTextField name="email" label="Correo Electrónico" />
            <RHFTextField name="phoneNumber" label="Teléfono" />

            <RHFAutocomplete
              name="country"
              label="País"
              options={countries.map((country) => country.label)}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                const { code, label, phone } = countries.filter(
                  (country) => country.label === option
                )[0];

                if (!label) {
                  return null;
                }

                return (
                  <li {...props} key={label}>
                    <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    />
                    {label} ({code})
                  </li>
                );
              }}
            />

            <RHFTextField name="state" label="Departamento" />
            <RHFTextField name="city" label="Ciudad" />
            <RHFTextField name="address" label="Dirección" />
            <RHFTextField name="zipCode" label="Código Postal" />

            <RHFSelect name="center" label="Centro">
              {USER_CENTER_OPTIONS.map((center) => (
                <MenuItem key={center.value} value={center.value}>
                  {center.label}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect name="role" label="Rol">
              {USER_ROLE_OPTIONS.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!currentUser ? 'Crear Usuario' : 'Guardar Cambios'}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </>
  );
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderProperties}
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
