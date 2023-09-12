import { _mock } from 'src/_mock';

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Administrador de BE-U',
    email: 'admin@beu.com',
    password: 'beu123',
    photoURL: _mock.image.avatar(9),
    phoneNumber: '+57 31865555555',
    country: 'Colombia',
    address: 'Carrera 7 # 26-86',
    state: 'Bogotá, D.C.',
    city: 'Bogotá',
    zipCode: '110311',
    about: 'Administrador del Centro de la VMU de la Pontificia Universidad Javeriana.',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}
