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

      if (eventData.activities.length > 0) {
        const updatedActivities = [];

        try {
          const updatedActivity = await updateActivity(eventData.activities);
          console.log('Actividades actualizadas:', updatedActivity);
          updatedActivities.push(updatedActivity);
        } catch (updateError) {
          console.error('Error al actualizar las actividades:', updateError);

          for (const activity of eventData.activities) {
            try {
              const createdActivity = await createActivity(activity);
              console.log('Actividad creada:', createdActivity);
              updatedActivities.push(createdActivity);
            } catch (createError) {
              console.error('Error al crear la actividad:', createError);
              // Maneja el error según sea necesario
            }
          }
        }
      }

      return response.data; // Devuelve los datos actualizados del evento
    } else {
      console.error('Error al actualizar el evento:', response.data);
      throw new Error('Error al actualizar el evento');
    }
  } catch (error) {
    console.error('Error en la solicitud de actualización:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function updateStateEvent(eventId, state) {
  const URL = `${EVENT_SERVICE}${endpoints.event.updateState}${eventId}/${state}`;

  
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


export async function updateActivity(activityData) {
  const URL = `${EVENT_SERVICE}/eventosPUJ/actividadesPUJ/actividades`; // Asegúrate de que la URL sea la correcta para tu API

  try {
    const response = await axios.put(URL, activityData);

    if (response.status === 200) {
      console.log('Actividad actualizada correctamente:', response.data);
      return response.data; // Opcional: puedes devolver los datos actualizados si lo deseas
    } else {
      console.error('Error al actualizar la actividad:', response.data);
      throw new Error('Error al actualizar la actividad');
    }
  } catch (error) {
    console.error('Error en la solicitud de actualización de la actividad:', error);
    throw error; // Lanza el error para que el código que llama pueda manejarlo
  }
}

export async function createActivity(newActivity) {
  const URL = `${EVENT_SERVICE}/eventosPUJ/actividadesPUJ/actividad`; // Asegúrate de que la URL sea la correcta para tu API

  try {
    const response = await axios.post(URL, newActivity);

    if (response.status === 200) {
      console.log('Actividad creada correctamente:', response.data);
      return response.data; // Opcional: puedes devolver los datos de la actividad creada si lo deseas
    } else {
      console.error('Error al crear la actividad:', response.status, response.data);
      throw new Error('Error al crear la actividad');
    }
  } catch (error) {
    console.error('Error en la solicitud de creación de la actividad:', error);
    throw error; // Lanza el error para que el código que llama pueda manejarlo
  }
}

export async function deleteActivity(activityId) {
  const URL = `${EVENT_SERVICE}/eventosPUJ/actividadesPUJ/actividad/${activityId}`; // Asegúrate de que la URL sea la correcta para tu API y que se incluya el ID de la actividad

  try {
    const response = await axios.delete(URL);

    if (response.status === 200) {
      console.log('Actividad eliminada correctamente');
      return true; // Opcional: puedes devolver un valor para indicar el éxito de la eliminación
    } else {
      console.error('Error al eliminar la actividad:', response.data);
      throw new Error('Error al eliminar la actividad');
    }
  } catch (error) {
    console.error('Error en la solicitud de eliminación de la actividad:', error);
    throw error; // Lanza el error para que el código que llama pueda manejarlo
  }
}
