import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { query } from 'src/utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    if (req.method !== 'DELETE') {
      return res.status(405).json({
        message: 'Método no permitido. Se requiere un método DELETE',
      });
    }

    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: 'Falta el parámetro de consulta "userId"',
      });
    }

    const deleteSql = `DELETE FROM users WHERE id = ?`;
    const valueParams: any[] = [userId];
    const deletionResult = await query({ query: deleteSql, values: valueParams });

    if ((deletionResult as any)?.affectedRows === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      message: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
    });
  }
}
