import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  calendar: '/api/calendar/events',
  auth: {
    me: '/api/account/my-account',
    login: '/api/account/login',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/blog/posts',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  event: {
    listMock: '/api/events',    
    list: '/eventosPUJ/eventos', // eventMicroservice
    details: '/eventosPUJ/evento/',
    search: '/eventosPUJ/evento/centro/',
    updateMock: '/api/events/update',
    upload: '/api/events/uploadImages',
    update: '/eventosPUJ/evento', // eventMicroservice
    updateState: '/eventosPUJ/evento/estado/', // eventMicroservice
    create: '/eventosPUJ/evento', // eventMicroservice
    deleteMock: '/api/events/delete',
    delete: '/eventosPUJ/evento/', // eventMicroservice
  },
  user: {
    list:'/api/users', 
    details: '/api/users/user',
    update: '/api/users/update',   
    create: '/api/users/create',
    delete: '/api/users/delete',
  }
};
