import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function eventTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}) {
  const handleRemoveStock = (inputValue) => {
    const newValue = filters.category.filter((item) => item !== inputValue);
    onFilters('category', newValue);
  };

  const handleRemovePublish = (inputValue) => {
    const newValue = filters.state.filter((item) => item !== inputValue);
    onFilters('state', newValue);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.50 }}>
          Resultados encontrados
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.category.length && (
          <Block label="Categoría:">
            {filters.category.map((item) => (
              <Chip sx={{ textTransform: 'capitalize' }} key={item} label={item} size="small" onDelete={() => handleRemoveStock(item)} />
            ))}
          </Block>
        )}

        {!!filters.state.length && (
          <Block label="Estado:">
            {filters.state.map((item) => (
              <Chip
                sx={{ textTransform: 'capitalize' }}
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemovePublish(item)}
              />
            ))}
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Limpiar
        </Button>
      </Stack>
    </Stack>
  );
}

eventTableFiltersResult.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
