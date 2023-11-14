import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
// utils
import cors from 'src/utils/cors';

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: './public/assets/images/events',
  filename: function (_req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);
  try {
    if (req.method === 'POST') {
      upload.single('file')(req as any, res as any, (err: any) => {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({ message: 'Error al subir el archivo' });
        } else if (err) {
          return res.status(500).json({ message: 'Error interno del servidor' });
        }

        const imageUrl = `http://localhost:3000/assets/images/events/${(req as any).file.filename}`;

        // Retornar la URL en la respuesta
        res.status(200).json({ message: 'Archivo subido exitosamente', imageUrl });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export default handler;
