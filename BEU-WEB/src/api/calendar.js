import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetEvents() {
  const URL = [endpoints.event.listMock];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(() => {
    const events = data?.events.map((event) => ({
      ...event,
      textColor: event?.colors[0] || '',
    }));

    return {
      events: events || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.events.length,
    };
  }, [data?.events, error, isLoading, isValidating]);
  return memoizedValue;
}
// ----------------------------------------------------------------------

export async function updateEvent(eventData, eventId) {
  const URL = `${HOST_API}${endpoints.event.update}?eventId=${eventId}`;

  await axios
    .put(URL, { eventData })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}