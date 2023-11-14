import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { USER_CENTER_OPTIONS, USER_ROLE_OPTIONS } from 'src/_mock';
// assets
import { countries } from 'src/assets/data';
//api
import { updateUser } from 'src/api/user';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function UserQuickEditForm({ currentUser, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const NewUserSchema = Yup.object().shape({
    displayName: Yup.string().required('El nombre es obligatorio'),
    email: Yup.string()
      .required('El correo electrónico es obligatorio')
      .email('El correo electrónico debe ser una dirección válida'),
    phoneNumber: Yup.string().required('El número de teléfono es obligatorio'),
    address: Yup.string().required('La dirección es obligatoria'),
    country: Yup.string().required('El país es obligatorio'),
    state: Yup.string().required('El estado es obligatorio'),
    city: Yup.string().required('La ciudad es obligatoria'),
    role: Yup.string().required('El rol es obligatorio'),
  });

  const defaultValues = useMemo(
    () => ({
      displayName: currentUser?.displayName || '',
      email: currentUser?.email || '',
      password: currentUser?.password || '',
      photoURL: currentUser?.photoURL || '',
      phoneNumber: currentUser?.phoneNumber || '',
      country: currentUser?.country || '',
      address: currentUser?.address || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
      about: currentUser?.about || '',
      role: currentUser?.role || '',
      center: currentUser?.center,
      status: currentUser?.status || 'inactivo',
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateUser(data, currentUser?.id);
      reset();
      onClose();
      router.push(paths.dashboard.admin.root);
      enqueueSnackbar('¡Actualización Exitosa!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const [password, setPassword] = useState({
    value: defaultValues.password || '', // Puedes establecer un valor predeterminado si es necesario
    showPassword: false,
  });

  const handleTogglePassword = () => {
    setPassword((prevPassword) => ({
      ...prevPassword,
      showPassword: !prevPassword.showPassword,
    }));
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Edición Rápida</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            La cuenta está esperando confirmación.
          </Alert>

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

            <RHFSelect name="center" label="Centro">
              {USER_CENTER_OPTIONS.map((center) => (
                <MenuItem key={center.value} value={center.value}>
                  {center.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField
              name="password"
              label="Contraseña"
              type={password.showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      <Iconify
                        icon={password.showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFAutocomplete
              name="country"
              label="País"
              options={countries.map((country) => country.label)}
              getOptionLabel={(option) => option}
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

            <RHFSelect name="role" label="Rol">
              {USER_ROLE_OPTIONS.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField name="state" label="Departamento" />
            <RHFTextField name="city" label="Ciudad" />
            <RHFTextField name="address" label="Dirección" />
            <RHFTextField name="zipCode" label="Código Postal" />
            <RHFTextField name="about" label="Información" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Guardar
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

UserQuickEditForm.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
