import PropTypes from 'prop-types';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
// theme
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function AppWelcome({ title, description, action, img, ...other }) {
  const theme = useTheme();

  return (
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette.primary.light, 0.2),
          endColor: alpha(theme.palette.primary.main, 0.2),
        }),
        height: {  xs: 'column', md: 'row'  },
        borderRadius: 2,
        position: 'relative',
        color: 'primary.darker',
        backgroundColor: 'common.white',
      }}
      {...other}
    >
      <Stack
        flexGrow={1}
        justifyContent="center"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        sx={{
          p: {
            xs: theme.spacing(4, 3, 1, 3), 
            md: theme.spacing(3), 
          },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography variant="h4" sx={{ md: 2, whiteSpace: 'pre-line' }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
            maxWidth: 600,
            mb: { xs: 2, xl: 3 }
          }}
        >
          {description}
        </Typography>

        {action && action}
      </Stack>

      {img && (
        <Stack
          component="span"
          justifyContent="center"
          sx={{
            p: { xs: 5, md: 3 },
            maxWidth: 250,
            mx: 'auto',
          }}
        >
          {img}
        </Stack>
      )}
    </Stack>
  );
}

AppWelcome.propTypes = {
  action: PropTypes.node,
  description: PropTypes.string,
  img: PropTypes.node,
  title: PropTypes.string,
};