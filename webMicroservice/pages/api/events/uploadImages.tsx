import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import cors from 'src/utils/cors';

const storage = multer.diskStorage({
  destination: './public/assets/images/events',
  filename: function (_req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const uploadMultiple = multer({ storage }).array('files', 10);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);
  try {
    if (req.method === 'POST') {
      uploadMultiple(req as any, res as any, (err: any) => {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({ message: 'Error al subir los archivos' });
        } else if (err) {
          return res.status(500).json({ message: 'Error interno del servidor' });
        }

        const imageUrls = (req as any).files.map((file: any) => {
          return `http://localhost:3000/assets/images/events/${file.filename}`;
        });

        res.status(200).json({ message: 'Archivos subidos exitosamente', imageUrls });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
export default handler;
