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

    const { query } = req.query;

    const cleanQuery = `${query}`.toLowerCase().trim();

    const results: typeof events = [];

    events.forEach((event) => {
      if (!query) {
        return results.push(event);
      }

      if (event.name.toLowerCase().includes(cleanQuery)) {
        return results.push(event);
      }
    });

    res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
