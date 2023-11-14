import { sign } from 'jsonwebtoken';
// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import { JWT_SECRET, JWT_EXPIRES_IN } from 'src/_mock/_account';
import { query } from 'src/utils/database';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { email, password } = req.body;

    const querySql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const valueParams: any[] = [email];
    const result = await query({ query: querySql, values: valueParams });

    if (Array.isArray(result) && result.length > 0) {
      const user = result[0];

      if (typeof user === 'object' && 'password' in user && user.password === password) {
        const accessToken = sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });

        res.status(200).json({
          accessToken,
          user,
        });
      } else {
        return res.status(400).json({
          message: 'Contraseña incorrecta. ¡Intenta de nuevo!',
        });
      }
    } else {
      return res.status(404).json({
        message: 'Ese usuario no existe. ¡Intenta de nuevo!',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
