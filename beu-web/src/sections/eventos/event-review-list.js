import PropTypes from 'prop-types';
// @mui
import Pagination, { paginationClasses } from '@mui/material/Pagination';
//
import EventReviewItem from './event-review-item';

// ----------------------------------------------------------------------

export default function EventReviewList({ reviews }) {
  return (
    <>
      {reviews.map((review) => (
        <EventReviewItem key={review.id} review={review} />
      ))}

      <Pagination
        count={10}
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

EventReviewList.propTypes = {
  reviews: PropTypes.array,
};
