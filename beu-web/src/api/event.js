import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
import axios from 'axios';
import { HOST_API, EVENT_SERVICE } from 'src/config-global';
import { fromServiceEvents, fromServiceEvent } from 'src/services/events-microservice';

// ----------------------------------------------------------------------

export function useGetEvents() {
  const URL = `${EVENT_SERVICE}${endpoints.event.list}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const eventsView = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return fromServiceEvents(data);
  }, [data]);

  const memoizedValue = useMemo(
    () => ({
      events: eventsView || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !eventsView?.length,
    }),
    [eventsView, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetEvent(eventId) {
  const URL = `${EVENT_SERVICE}${endpoints.event.details}${eventId}`;

  const { data, error } = useSWR(eventId ? URL : null, fetcher);

  const modifiedEvent = data ? fromServiceEvent(data) : null;

  const eventLoading = !data && !error;
  const eventError = error;
  const eventValidating = !data && !error;

  const memoizedValue = useMemo(
    () => ({
      event: modifiedEvent,
      eventLoading,
      eventError,
      eventValidating,
    }),
    [modifiedEvent, eventLoading, eventError, eventValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------



export async function updateEvent(eventData) {
  const URL = `${EVENT_SERVICE}${endpoints.event.update}`;

  try {
    const response = await axios.put(URL, eventData);

    if (response.status === 200) {
      console.log('Evento actualizado correctamente:', response.data);
      return response.data; // Opcional: puedes devolver los datos actualizados si lo deseas
    } else {
      console.error('Error al actualizar el evento:', response.data);
      throw new Error('Error al actualizar el evento');
    }
  } catch (error) {
    console.error('Error en la solicitud de actualización:', error);
    throw error; // Lanza el error para que el código que llama pueda manejarlo
  }
}

// ----------------------------------------------------------------------

export async function updateStateEvent(eventId) {
  const URL = `${EVENT_SERVICE}${endpoints.event.updateState}${eventId}`;
  
  const response = await axios.put(URL, eventId);

    if (response.status === 200) {
      return response.data;
    } else {      
      throw new Error('Error al actualizar el estado del  evento', response.data);
    }

}

// ----------------------------------------------------------------------

export async function createEvent(eventData) {
  const URL = `${EVENT_SERVICE}${endpoints.event.create}`;

  try {
    const response = await axios.post(URL, eventData);

    if (response.status === 200) {
      console.log('Evento actualizado correctamente:', response.data);
      return response.data; // Opcional: puedes devolver los datos actualizados si lo deseas
    } else {
      console.error('Error al actualizar el evento:', response.data);
      throw new Error('Error al actualizar el evento');
    }
  } catch (error) {
    console.error('Error en la solicitud de actualización:', error);
    throw error; // Lanza el error para que el código que llama pueda manejarlo
  }
}

export async function deleteEvent(eventId) {
  const URL = `${EVENT_SERVICE}${endpoints.event.delete}${eventId}`;

  await axios
    .delete(URL, { eventId })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}

// ----------------------------------------------------------------------


export function searchEvents(center) {

  if (!center) {
    return {
      events: [],
      eventsLoading: false,
      eventsError: null,
      eventsValidating: false,
      eventsEmpty: true,
    };
  }
  const URL = `${EVENT_SERVICE}${endpoints.event.search}${center}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const eventsView = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return fromServiceEvents(data);
  }, [data]);

  const memoizedValue = useMemo(
    () => ({
      events: eventsView || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !eventsView?.length,
    }),
    [eventsView, error, isLoading, isValidating]
  );

  return memoizedValue;
}


