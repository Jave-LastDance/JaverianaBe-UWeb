import { verify } from 'jsonwebtoken';
// next
import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import { JWT_SECRET } from 'src/_mock/_account';
import { query } from 'src/utils/database';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        message: 'Authorization token missing',
      });
    }

    const accessToken = `${authorization}`.split(' ')[1];

    const data = verify(accessToken, JWT_SECRET);

    const userId = typeof data === 'object' ? data?.userId : '';

    const querySql = 'SELECT * FROM users WHERE id = ? LIMIT 1';
    const valueParams: any[] = [userId];
    const result = await query({ query: querySql, values: valueParams });

    if (Array.isArray(result) && result.length > 0) {
      const user = result[0];
      return res.status(200).json({ user });
    } else {
      return res.status(401).json({
        message: 'Invalid authorization token',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
