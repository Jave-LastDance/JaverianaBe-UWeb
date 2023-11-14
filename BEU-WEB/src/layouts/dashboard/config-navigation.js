import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  folder: icon('ic_folder'),
  event: icon('ic_event'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Principal',
        items: [
          { title: 'Home', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'Estadísticas', path: paths.dashboard.estadisticas, icon: ICONS.analytics },
          
          
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'Gestión',
        items: [
          { title: 'Eventos', path: paths.dashboard.eventos.root, icon: ICONS.tour },
          { title: 'Archivos', path: paths.dashboard.archivos, icon: ICONS.folder },
          { title: 'Calendario', path: paths.dashboard.calendario.root, icon: ICONS.calendar },
          { title: 'Cuenta', path: paths.dashboard.cuenta, icon: ICONS.user },
          {
            title: 'Administrador',
            path: paths.dashboard.admin.root,
            icon: ICONS.lock,
            roles: ['admin'],
            caption: ('Solo para administradores'),
            children: [
              { title: 'Usuarios', path: paths.dashboard.admin.root },
            ],
          },
        ],
      },
    ],
    []
  );

  return data;
}
