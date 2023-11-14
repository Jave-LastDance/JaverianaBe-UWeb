import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { query } from 'src/utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    if (req.method !== 'PUT') {
      return res.status(405).json({
        message: 'Método no permitido. Se requiere un método PUT',
      });
    }

    const { userId } = req.query;
    const updateUser = req.body;
    

    if (!userId) {
      return res.status(400).json({
        message: 'Falta el parámetro de consulta "userId"',
      });
    }

    const updateSql = `UPDATE users 
      SET displayName = ?, email = ?, password = ?, photoURL = ?, phoneNumber = ?, country = ?, 
      address = ?, state = ?, city = ?, zipCode = ?, about = ?, role = ?, status = ?, center = ?, isVerified = ?
      WHERE id = ?`;

    const updateParams: any[] = [
      updateUser.displayName, 
      updateUser.email, 
      updateUser.password,
      updateUser.photoURL, 
      updateUser.phoneNumber, 
      updateUser.country, 
      updateUser.address,
      updateUser.state,
      updateUser.city,
      updateUser.zipCode,
      updateUser.about,
      updateUser.role,
      updateUser.status,
      updateUser.center,
      updateUser.isVerified,
      userId
    ];

    const affectedRows = await query({ query: updateSql, values: updateParams });

    res.status(200).json({
      message: 'Usuario actualizado',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
    });
  }
}
