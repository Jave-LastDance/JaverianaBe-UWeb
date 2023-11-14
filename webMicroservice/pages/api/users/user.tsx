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

    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: 'Falta el parámetro de consulta "userId"',
      });
    }

    const querySql = `SELECT * FROM users WHERE id = ? LIMIT 1`;
    const valueParams: any[] = [userId];
    const data = await query({ query: querySql, values: valueParams });

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json( data[0] ); // Devuelve solo el primer elemento del array como un objeto único
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
    });
  }
}
