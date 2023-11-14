import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import { query } from 'src/utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    if (req.method !== 'POST') {
      return res.status(405).json({
        message: 'Método no permitido. Se requiere un método POST',
      });
    }

    const newUser = req.body; // Assuming the user object is sent in the request body

    if (!newUser) {
      return res.status(400).json({
        message: 'Solicitud inválida. Faltan datos del usuario.',
      });
    }

    const createSql = `INSERT INTO users (displayName, email, password, photoURL, phoneNumber, country, address, state, city, zipCode, about, role, status, center, isVerified) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const createParams: any[] = [
      newUser.displayName,
      newUser.email,
      newUser.password,
      newUser.photoURL,
      newUser.phoneNumber,
      newUser.country,
      newUser.address,
      newUser.state,
      newUser.city,
      newUser.zipCode,
      newUser.about,
      newUser.role,
      newUser.status,
      newUser.center,
      newUser.isVerified,
    ];

    const insertResult = await query({ query: createSql, values: createParams });

    if (insertResult) {
      return res.status(200).json({
        message: 'Usuario creado exitosamente.',
      });
    } else {
      return res.status(500).json({
        message: 'Error al crear el usuario en la base de datos.',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Error interno del servidor.',
    });
  }
}
