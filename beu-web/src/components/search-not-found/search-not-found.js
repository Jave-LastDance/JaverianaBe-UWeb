import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

// ----------------------------------------------------------------------

export default function SearchNotFound({ query, sx, ...other }) {
  return query ? (
    <Paper
      sx={{
        bgcolor: 'unset',
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" gutterBottom>
        Sin Resultados
      </Typography>

      <Typography variant="body2">
        No se encontraron resultados para: &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> Intenta verificar la ortografía o usa palabras clave más generales.  
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      Por favor, ingrese un término de búsqueda.
    </Typography>
  );
}

SearchNotFound.propTypes = {
  query: PropTypes.string,
  sx: PropTypes.object,
};
