import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// utils
import { fShortenNumber } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
//
import EventReviewList from './event-review-list';
import EventReviewNewForm from './event-review-new-form';
import EventActivityItem from './event-activity-item';

// ----------------------------------------------------------------------

export default function EventDetailsActivities({ activities }) {
  const activityList = activities.map((activity, index) => (
    <div key={activity.id_activity}>
     
      <EventActivityItem key={activity.id_activity} activity={activity} />
      <Divider sx={{ borderStyle: 'dashed', my: 5 }} />
    </div>
  ));
  return (
    <>
      {activityList}

      <Pagination
        count={5}
        sx={{
          mx: 'auto',
          [`& .${paginationClasses.ul}`]: {
            my: 5,
            mx: 'auto',
            justifyContent: 'center',
          },
        }}
      />
    </>
  );
}

EventDetailsActivities.propTypes = {
  activities: PropTypes.array,
};
