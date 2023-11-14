// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    estadisticas: `${ROOTS.DASHBOARD}/estadisticas`,
    eventos: {
      root: `${ROOTS.DASHBOARD}/eventos`,
      details: (id) => `${ROOTS.DASHBOARD}/eventos/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/eventos/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/eventos/new`,
    },
    notificaciones: `${ROOTS.DASHBOARD}/notificaciones`,
    archivos: `/coming-soon`,
    calendario: {
      root: `${ROOTS.DASHBOARD}/calendario`

    },
    cuenta: `${ROOTS.DASHBOARD}/cuenta`,
    admin: {
      root: `${ROOTS.DASHBOARD}/administrador`,
      edit: (id) => `${ROOTS.DASHBOARD}/administrador/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/administrador/new`,     
    },
    
  },
};
