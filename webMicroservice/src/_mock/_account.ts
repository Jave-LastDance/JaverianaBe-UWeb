// config
import { HOST_API } from '../../config';

// ----------------------------------------------------------------------

export const JWT_SECRET = 'beu-secret-key';

export const JWT_EXPIRES_IN = '3 days';

export const users = [
  {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Administrador de BE-U',
    email: 'admin@beu.com',
    password: 'beu123',
    photoURL: `${HOST_API}/assets/images/avatars/avatar_default.jpg`,
    phoneNumber: '(318) 7549345',
    country: 'Colombia',
    address: 'Carrera 7 # 26-86',
    state: 'Bogotá, D.C.',
    city: 'Bogotá',
    zipCode: '110311',
    about: 'Administrador de BE-U de la Pontificia Universidad Javeriana.',
    role: 'admin',
    status: 'activo',
    center: 'BE-U',
    isVerified: true,
  },
  {
    id: '8864c717-587d-472a-929a-8e5f298024da-1',
    displayName: 'Administrador CJFD',
    email: 'cjfd@beu.com',
    password: 'beu123',
    photoURL: `${HOST_API}/assets/images/avatars/avatar_1.jpg`,
    phoneNumber: '(310) 5435543',
    country: 'Colombia',
    address: 'Carrera 7 # 26-86',
    state: 'Bogotá, D.C.',
    city: 'Bogotá',
    zipCode: '110311',
    about: 'Administrador del Centro Javeriano de Formación Deportiva de la Pontificia Universidad Javeriana.',
    role: 'user',
    center: 'Deportivo',
    status: 'activo',
    isVerified: true,
  },
  {
    id: '8864c717-587d-472a-929a-8e5f298024da-2',
    displayName: 'Administrador CGC',
    email: 'cgc@beu.com',
    password: 'beu123',
    photoURL: `${HOST_API}/assets/images/avatars/avatar_2.jpg`,
    phoneNumber: '(310) 2849843',
    country: 'Colombia',
    address: 'Carrera 7 # 26-86',
    state: 'Bogotá, D.C.',
    city: 'Bogotá',
    zipCode: '110311',
    about: 'Administrador del Centro de Gestión Cultural de la Pontificia Universidad Javeriana.',
    role: 'user',
    status: 'inactivo',
    center: 'Cultural',
    isVerified: true,
  },
];
