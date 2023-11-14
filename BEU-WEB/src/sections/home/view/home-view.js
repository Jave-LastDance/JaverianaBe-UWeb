'use client';

// @mui
'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// auth
import { AuthContext } from 'src/auth/context/jwt/auth-context';
import { useContext } from 'react';
// _mock
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { SeoIllustration } from 'src/assets/illustrations';
//
import AppWelcome from 'src/sections/home/cards/card-welcome';
import AppAreaInstalled from 'src/sections/home/cards/card-area-installed';
import AppWidgetSummary from 'src/sections/home/cards/card-widget-summary';
import AppCurrentDownload from 'src/sections/home/cards/card-current-download';


// ----------------------------------------------------------------------

export default function HomeView() {
  const { user } = useContext(AuthContext);

  const theme = useTheme();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={2}            color="inherit">
        
        <Grid xs={12} md={12} >
          <AppWelcome
            title={`Bienvenido de vuelta ${user?.displayName} 👋 `}
            description="Panel de Administración BE-U: ¡Gestiona y Supervisa con Facilidad!"
            img={<SeoIllustration />}
            action={
              <Button href='/dashboard/eventos' variant="contained" color="primary">
                Administrar eventos
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4} lg={8} height="100%">
          <AppAreaInstalled
            title="Interés General"
            subheader="(+43%) más que el mes pasado"
            chart={{
              categories: [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Estudiantes',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'Profesores y Administrativos',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Estudiantes',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'Profesores y Administrativos',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={4} lg={4} height="100%">
          <AppCurrentDownload
            title="Descargas Actuales"
            chart={{
              series: [
                { label: 'Mac', value: 249 },
                { label: 'Window', value: 340 },
                { label: 'iOS', value: 2131 },
                { label: 'Android', value: 2834 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Usuarios Activos"
            percent={2.6}
            total={4876}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Instalaciones Totales"
            percent={0.2}
            total={5140}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Descargas Totales"
            percent={-0.1}
            total={6780}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
