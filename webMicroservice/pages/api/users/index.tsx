import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { query } from 'src/utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    if (req.method !== 'GET') {
      return res.status(405).json({
        message: 'Método no permitido. Se requiere un método GET',
      });
    }

    const querySql = 'SELECT * FROM users';
    const valueParams: any[] = [];
    const data = await query({ query: querySql, values: valueParams });

    res.status(200).json({ users: data });
  } catch (error) {
    res.status(500).json({ error });
  }
}


