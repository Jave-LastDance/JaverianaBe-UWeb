import PropTypes from 'prop-types';
// @mui
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// ----------------------------------------------------------------------

export default function TableSelectedAction({
  dense,
  action,
  publish,
  rowCount,
  numSelected,
  onSelectAllRows,
  sx,
  ...other
}) {
  if (!numSelected) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        pl: 1,
        pr: 2,
        top: 0,
        left: 0,
        width: 1,
        zIndex: 9,
        height: 58,
        position: 'relative',
        bgcolor: 'background.neutral',
        ...(dense && {
          height: 38,
        }),
        ...sx,
      }}
      {...other}
    >
      <Checkbox
        indeterminate={!!numSelected && numSelected < rowCount}
        checked={!!rowCount && numSelected === rowCount}
        onChange={(event) => onSelectAllRows(event.target.checked)}
      />


      <Typography
        variant="subtitle2"
        sx={{
          ml: 2,
          flexGrow: 1,
          color: 'primary.main',
          ...(dense && {
            ml: 3,
          }),
        }}
      >
        ({numSelected}) seleccionados
      </Typography>


      {publish && publish}
      { action && action }
 
    </Stack>
  );
}

TableSelectedAction.propTypes = {
  action: PropTypes.node,
  publish: PropTypes.node,
  dense: PropTypes.bool,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
  rowCount: PropTypes.number,
  sx: PropTypes.object,
};
