import PropTypes from 'prop-types';
// utils
import axios, { endpoints } from 'src/utils/axios';
// sections
import  EventDetailsView  from 'src/sections/eventos/view/event-details-view';
import {EVENT_SERVICE } from 'src/config-global';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'BE-U: Detalles Evento',
};

export default function Page({ params }) {
  const { id } = params;

  return<EventDetailsView key={id} id={id} />

}

export async function generateStaticParams() {
  const res = await axios.get(`${EVENT_SERVICE}${endpoints.event.list}`);



  return res.data.map((event) => ({
    id: String(event.id), // Convierte a cadena (string)
  }));
}

Page.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
