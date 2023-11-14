import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
// auth
import { AuthContext } from 'src/auth/context/jwt/auth-context';
import { useContext } from 'react';
// api
import { updateUser, useGetUser } from 'src/api/user';
// utils
import { fData } from 'src/utils/format-number';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';

import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default  function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useContext(AuthContext);

  // const { userWeb, isLoading, error, isValidating } =  useGetUser(user?.id);


  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Nombre es obligatorio'),
    email: Yup.string()
      .required('Email es obligatorio')
      .email('El email debe ser una dirección de correo electrónico válida'),
    photoURL: Yup.mixed().nullable().required('El avatar es obligatorio'),
    phoneNumber: Yup.string().required('El número de teléfono es obligatorio'),
    country: Yup.string().required('El país es obligatorio'),
    address: Yup.string().required('La dirección es obligatoria'),
    state: Yup.string().required('El departamento es obligatorio'),
    city: Yup.string().required('La ciudad es obligatoria'),
    zipCode: Yup.string().required('El código postal es obligatorio'),
  });

  const defaultValues = {
    displayName: user?.displayName || '',
    email: user?.email || '',
    password: user?.password || '',
    photoURL: user?.photoURL || null,
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || '',
    address: user?.address || '',
    state: user?.state || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    about: user?.about || '',
    role : user?.role || '',
    center: user?.center || '',
    status: user?.status || 'inactivo',
    isVerified: user?.isVerified || false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {

      await updateUser(data, user?.id);

      window.location.reload(); 
      enqueueSnackbar('¡Actualización Exitosa!', {autoHideDuration: 5000});
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });



  const handleDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 1) {
        const file = acceptedFiles[0];

        const newFile = URL.createObjectURL(file);

        setValue('photoURL', newFile, { shouldValidate: false });

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

            setValue('photoURL', imageUrl, { shouldValidate: false });
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
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
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
              <RHFTextField name="displayName" label="Nombre" />
              <RHFTextField name="email" label="Correo" disabled/>
              <RHFTextField name="phoneNumber" label="Teléfono" />
              <RHFTextField name="address" label="Dirección" />
              <RHFTextField name="center" label="Centro" disabled />

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
              disabled
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
                      {label} ({code}) +{phone}
                    </li>
                  );
                }}
              />

              <RHFTextField name="state" label="Departamento" />
              <RHFTextField name="city" label="Ciudad" />
              <RHFTextField name="zipCode" label="Código Postal" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="Sobre mi" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Guardar cambios
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
