'use client';

import PropTypes from 'prop-types';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import esLocale from 'date-fns/locale/es'; // Importa el idioma español para date-fns
//


// ----------------------------------------------------------------------

export default function LocalizationProvider({ children }) {

  return (
    <MuiLocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale} >
      {children}
    </MuiLocalizationProvider>
  );
}

LocalizationProvider.propTypes = {
  children: PropTypes.node,
};
