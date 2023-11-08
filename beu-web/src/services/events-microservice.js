import { format, parse } from 'date-fns';
import uuidv4 from 'src/utils/uuidv4';

export function fromServiceEvents(events) {
  if (!events || !Array.isArray(events)) {
    return [];
  }
  const eventsView = events.map((event) => {
    // Transforma el atributo url_photos
    const imagesArray = event?.url_photos
      ? event.url_photos.split(',').map((url) => url.trim())
      : [];

    // Transforma el atributo tags
    const tagsArray = event?.tags ? event.tags.split(',').map((tag) => tag.trim()) : [];

    const topicArray = event?.topic ? event.topic.split(',').map((url) => url.trim()) : [];

    // Transforma el atributo public_type
    const publicArray = event?.public_type
      ? event.public_type.split(',').map((publicType) => publicType.trim())
      : [];

    return {
      id: event?.id.toString() || uuidv4(),
      name: event?.name || '',
      tags: tagsArray || [],
      public_type: publicArray || [],
      requirements: event?.requirements || '',
      duration: event?.duration || '',
      capacity: event?.capacity || 0,
      location: event?.location || '',
      mode: event?.mode || '',
      state: event?.state || '',
      category: event?.category || '',
      topic: topicArray || [],
      cycle: event?.cycle.toString() || '',
      totalRating: event?.prom_rating || 0,
      createdStart: event?.date_start || new Date(),
      createdEnd: event?.date_end || new Date(),
      timeStart: event?.time_start || '',
      timeEnd: event?.time_end || '',
      description: event?.description || '',
      startPost: event?.date_start_post || new Date(),
      price: event?.price || 0,
      eventUrl: event?.url_event || '',
      coverUrl: event?.url_poster || '',
      images: imagesArray || [],
      headEmail: event?.head_email || '',
      center: event?.name_center || '',
      ratings: event?.rating || [],
      reviews: event?.reviews || [],
      headID: event?.head_id || '',

      activities: event?.activities || [], // CAMBIAR POR ACTIVIDADES DE UN EVENTO
    };
  });

  return eventsView;
}

export function fromServiceEvent(event) {
  // Aplicar las modificaciones necesarias al evento aquí
  const imagesArray = event?.url_photos ? event.url_photos.split(',').map((url) => url.trim()) : [];

  const tagsArray = event?.tags ? event.tags.split(',').map((tag) => tag.trim()) : [];

  const topicArray = event?.topic ? event.topic.split(',').map((url) => url.trim()) : [];

  const publicArray = event?.public_type
    ? event.public_type.split(',').map((publicType) => publicType.trim())
    : [];

  const modifiedEvent = {
    id: event?.id.toString() || ' ',
    name: event?.name || '',
    tags: tagsArray || [],
    public_type: publicArray || [],
    requirements: event?.requirements || '',
    duration: event?.duration || '',
    capacity: event?.capacity || 0,
    location: event?.location || '',
    mode: event?.mode || '',
    state: event?.state || '',
    category: event?.category || '',
    topic: topicArray || [],
    cycle: event?.cycle.toString() || '',
    totalRating: event?.prom_rating || 0,
    createdStart: event?.date_start || new Date(),
    createdEnd: event?.date_end || new Date(),
    timeStart: event?.time_start.split(':').slice(0, 2).join(':') || '',
    timeEnd: event?.time_end.split(':').slice(0, 2).join(':') || '',
    description: event?.description || '',
    startPost: event?.date_start_post || new Date(),
    price: event?.price || 0,
    eventUrl: event?.url_event || '',
    coverUrl: event?.url_poster || '',
    images: imagesArray || [],
    headEmail: event?.head_email || '',
    center: event?.name_center || '',
    ratings: event?.rating || [],
    reviews: event?.total_reviews || [],
  };

  

  return modifiedEvent;
}

//-------------------------------------------------------------------------------------

export function transformActivities(activities) {
  for (let activity of activities) {
    activity.id_activity = parseInt(activity.id_activity, 10) || 1;
    activity.id_event = parseInt(activity.id_event, 10) || 1;
    activity.date = new Date(activity.date);
    activity.date.setDate(activity.date.getDate() + 2); // Agregar 2 días a la fecha
    activity.date = activity.date.toISOString().split('T')[0];
  }
}

export function toServiceEvent(data) {
  data.date_start = new Date(data.createdStart);
  data.date_start.setDate(data.date_start.getDate() + 1);
  data.date_start = data.date_start.toISOString().split('T')[0];

  data.date_end = new Date(data.createdEnd);
  data.date_end.setDate(data.date_end.getDate() + 1);
  data.date_end = data.date_end.toISOString().split('T')[0];

  transformActivities(data.activities);

  const EditEvent = {
    id: parseInt(data.id, 10) || 1,
    name: data.name.trim(),
    tags: data.tags.join(','),
    public_type: data.public_type.join(','),
    requirements: data.requirements,
    duration: parseInt(data.duration) || 0,
    capacity: parseInt(data.capacity), // Convierte capacity a número
    location: data.location,
    mode: data.mode,
    state: data.state,
    category: data.category,
    topic: Array.isArray(data.topic) ? data.topic.join(',') : data.topic,
    cycle: parseInt(data.cycle, 10),

    // Convierte y formatea las fechas
    date_start: data.date_start,
    date_end: data.date_end,
    date_start_post: data.startPost.toISOString().split('T')[0],
    time_start: data.timeStart,
    time_end: data.timeEnd,

    description: data.description,
    price: parseFloat(data.price),
    url_event: data.eventUrl,
    url_poster: data.coverUrl,
    url_photos: Array.isArray(data.images) ? data.images.join(',') : data.images, // Convierte imágenes a una cadena separada por comas
    head_email: data.headEmail,
    name_center: data.center,
    prom_rating: data.totalRating,
    rating: data?.ratings || [],
    reviews: data?.reviews || [],
    activities: data?.activities || [],
  };

  return EditEvent;
}

export function toServiceNewEvent(data) {
  data.date_start = new Date(data.createdStart);
  data.date_start.setDate(data.date_start.getDate() + 1);
  data.date_start = data.date_start.toISOString().split('T')[0];

  const newEvent = {
    id: parseInt(data.id, 10) || 1,
    name: data.name.trim(),
    tags: data.tags.join(','),
    public_type: data.public_type.join(','),
    requirements: data.requirements,
    duration: parseInt(data.duration) || 0,
    capacity: parseInt(data.capacity), // Convierte capacity a número
    location: data.location,
    mode: data.mode,
    state: data.state,
    category: data.category,
    topic: Array.isArray(data.topic) ? data.topic.join(',') : data.topic,
    cycle: parseInt(data.cycle, 10),

    // Convierte y formatea las fechas
    date_start: data.date_start,
    date_end: data.createdEnd.toISOString().split('T')[0],
    date_start_post: data.startPost.toISOString().split('T')[0],
    time_start: data.timeStart,
    time_end: data.timeEnd,
    description: data.description,
    price: parseFloat(data.price),
    url_event: data.eventUrl,
    url_poster: data.coverUrl,
    url_photos: Array.isArray(data.images) ? data.images.join(',') : data.images, // Convierte imágenes a una cadena separada por comas
    head_email: data.headEmail,
    name_center: data.center,
    prom_rating: data.totalRating,
    rating: data?.ratings || [],
    reviews: data?.reviews || [],
    activities: data.activities || [],
  };

  return newEvent;
}
