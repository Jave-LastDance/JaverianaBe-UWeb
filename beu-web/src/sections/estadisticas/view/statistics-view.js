'use client';

// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
// _mock
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
  _appAuthors, 
  _appInstalled, 
  _appRelated
} from 'src/_mock';

// components
import { useSettingsContext } from 'src/components/settings';
//

import AnalyticsCurrentVisits from 'src/sections/estadisticas/analytics-current-visits';
import AnalyticsWebsiteVisits from 'src/sections/estadisticas/analytics-website-visits';
import AnalyticsWidgetSummary from 'src/sections/estadisticas/analytics-widget-summary';
import AnalyticsCurrentSubject from 'src/sections/estadisticas/analytics-current-subject';
import AnalyticsConversionRates from 'src/sections/estadisticas/analytics-conversion-rates';
import AppTopAuthors from 'src/sections/estadisticas/card-top-authors';
import AppTopRelated from 'src/sections/estadisticas/card-top-related';
import AppTopInstalledCountries from 'src/sections/estadisticas/card-top-installed-countries';

// ----------------------------------------------------------------------

export default function EstadisticasView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Notificaciones Semanales"
            total={638}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Nuevos Usuarios"
            total={1352}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Eventos Promocionados"
            total={1723}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Reportes"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Alcance de Notificaciones"
            subheader="(+32%) más que el mes pasado"
            chart={{
              labels: [
                '01/01/2023',
                '02/01/2023',
                '03/01/2023',
                '04/01/2023',
                '05/01/2023',
                '06/01/2023',
                '07/01/2023',
                '08/01/2023',
                '09/01/2023',
                '10/01/2023',
                '11/01/2023',
              ],
              series: [
                {
                  name: 'Ingeniería',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Ciencias',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Medicina',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Tipos de Notificaciones"
            chart={{
              series: [
                { label: 'Informativas', value: 4344 },
                { label: 'Alertas', value: 5435 },
                { label: 'Inscripción', value: 3684 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Usuarios Notificados"
            subheader="(+45%) más que el mes pasado"
            chart={{
              series: [
                { label: 'Evento 1', value: 400 },
                { label: 'Evento 2', value: 430 },
                { label: 'Evento 3', value: 448 },
                { label: 'Evento 4', value: 470 },
                { label: 'Evento 5', value: 540 },
                { label: 'Evento 6', value: 580 },
                { label: 'Evento 7', value: 690 },

              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Carreras Interesadas"
            chart={{
              categories: ['Ingeniería de Sistemas', 'Comunicación Social', 'Arquitectura', 'Filosofía', 'Música', 'Ingeniería Industrial'],
              series: [
                { name: 'Notificación 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Notificación 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Notificación 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>


        <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top eventos Promocionados" list={_appRelated} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Carreras Interesadas" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Usuarios" list={_appAuthors} />
        </Grid>

      </Grid>
    </Container>
  );
}
