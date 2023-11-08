import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
// utils
import { fDate } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify';
// _mock
import { EVENT_LOCATIONS_OPTIONS } from 'src/_mock';

// ----------------------------------------------------------------------

export default function EventActivityItem({ activity }) {
  const {
    id_activity,
    name,
    description,
    location,
    public_type,
    category,
    topic,
    date,
    url_poster,
    isPurchased,
    time_start,
    time_end,
  } = activity;

  const renderInfo = (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'row',
        md: 'column',
      }}
      sx={{
        width: { md: 330 },
        textAlign: { md: 'center' },
        marginRight: 2,
      }}
    >
      <Avatar
        src={url_poster}
        sx={{
          width: { xs: 48, md: 64 },
          height: { xs: 48, md: 64 },
        }}
      />

      <ListItemText
        primary={name.length > 40 ? `${name.substring(0, 40)}...` : name}
        secondary={time_start + ' - ' + time_end}
        primaryTypographyProps={{
          noWrap: true,
          typography: 'subtitle2',
          mb: 0.5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}
        secondaryTypographyProps={{
          noWrap: true,
          typography: 'caption',
          component: 'span',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}
      />
      <Typography variant="body2">{date}</Typography>
    </Stack>
  );

  const renderContent = (
    <Stack
      spacing={2}
      direction={{
        xs: 'row',
        md: 'column',
      }}
      sx={{
        width: { md: 540 },
      }}
    >
      {isPurchased && (
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            color: 'success.main',
            typography: 'caption',
          }}
        >
          <Iconify icon="ic:round-verified" width={16} sx={{ mr: 0.5 }} />
          Actividad Verificada
        </Stack>
      )}

      <Stack direction="row">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          Lugar
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'justify' }}>
          {EVENT_LOCATIONS_OPTIONS.find((option) => option.value === location)?.label ||
            'No encontrado'}
        </Typography>
      </Stack>

      <Stack direction="row">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          Categoría:
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'justify' }}>
          {category}
        </Typography>
      </Stack>

      <Stack direction="row">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          Tema:
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'justify' }}>
          {topic}
        </Typography>
      </Stack>

      <Stack direction="row">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          Público:
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'justify' }}>
          {public_type}
        </Typography>
      </Stack>

      <Stack direction="row">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          Descripción:
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'justify' }}>
        {description.length > 55 ? `${description.substring(0, 55)}...` : description}
        </Typography>
      </Stack>

     
    </Stack>
  );

  return (
    <Stack
      spacing={30}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        mt: 5,
        px: { xs: 2.5, md: 0 },
        display: 'flex', // Agregamos display flex
        alignItems: 'center', // Centramos verticalmente
      }}
    >
      {renderInfo}

      {renderContent}
    </Stack>
  );
}

EventActivityItem.propTypes = {
  review: PropTypes.object,
};
