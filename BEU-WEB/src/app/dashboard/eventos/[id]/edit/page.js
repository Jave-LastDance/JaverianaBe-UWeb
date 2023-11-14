import PropTypes from 'prop-types';
// utils
import axios, { endpoints } from 'src/utils/axios';
// sections
import  EventEditView  from 'src/sections/eventos/view/event-edit-view';
import {EVENT_SERVICE } from 'src/config-global';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'BE-U: Editar Evento',
};

export default function EventEditPage({ params }) {
  const { id } = params;

  return <EventEditView id={id} />;
}

export async function generateStaticParams() {
  const res = await axios.get(`${EVENT_SERVICE}${endpoints.event.list}`);


  return res.data.map((event) => ({
    id: String(event.id), // Convierte a cadena (string)
  }));
}

EventEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
