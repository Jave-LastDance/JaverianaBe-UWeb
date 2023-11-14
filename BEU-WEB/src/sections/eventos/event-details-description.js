import PropTypes from 'prop-types';
// components
import Markdown from 'src/components/markdown';

// ----------------------------------------------------------------------

export default function EventDetailsDescription({ description, url }) {
  return (
    <div>
    <Markdown
    
    children={`###### Descripción \n ${description}`}
      sx={{
        p: 3,
        '& p, li, ol': {
          typography: 'body2',
        },
        '& ol': {
          p: 0,
          display: { md: 'flex' },
          listStyleType: 'none',
          '& li': {
            '&:first-of-type': {
              minWidth: 240,
              mb: { xs: 0.5, md: 0 },
            },
          },
        },
      }}
    />

        <Markdown 
        
        children={`###### Resumen \n ${url}`}
        sx={{
          p: 3,
          '& p, li, ol': {
            typography: 'body2',
          },
          '& ol': {
            p: 0,
            display: { md: 'flex' },
            listStyleType: 'none',
            '& li': {
              '&:first-of-type': {
                minWidth: 240,
                mb: { xs: 0.5, md: 0 },
              },
            },
          },
        }} />

    </div>
     
  );
}

EventDetailsDescription.propTypes = {
  description: PropTypes.string,
  url: PropTypes.string,
};
