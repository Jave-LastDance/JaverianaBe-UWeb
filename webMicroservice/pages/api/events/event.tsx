import { paramCase } from 'change-case';
// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import { events } from 'src/_mock/_events';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { eventId } = req.query;
    
    const event = events.find((_events) => _events.id === eventId);


    if (!event) {
      return res.status(404).json({
        message: 'Evento no encontrado',
      });
    }

    res.status(200).json({ event });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
