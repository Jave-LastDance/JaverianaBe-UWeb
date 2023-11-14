import { random, sample } from 'lodash';
// config
import { HOST_API } from '../../config';
// utils
import _mock from '.';

// ----------------------------------------------------------------------

const EVENT_NAME = [
'Conferencia sobre Innovación y Tecnología',
'Festival de Cine Universitario',
'Semana de la Ciencia y la Investigación',
'Exposición de Arte Contemporáneo',
'Encuentro Internacional de Literatura',
'Concierto de Música Clásica',
'Feria de Emprendimiento y Negocios',
'Jornada de Derechos Humanos',
'Semana del Medio Ambiente',
'Conversatorio sobre Política Global',
'Festival de Danzas Folclóricas',
'Exposición Fotográfica',
'Conferencia de Salud Mental',
'Taller de Creatividad y Diseño',
'Foro de Educación Inclusiva',
'Exposición de Ciencias Naturales',
'Semana de la Comunicación',
'Charla sobre Historia del Arte',
'Conferencia de Economía Sostenible',
'Feria de Voluntariado Universitario',
'Concierto de Música Latina',
'Jornada de Ciencias Sociales',
'Exposición de Arquitectura Sustentable',
'Conversatorio de Literatura Latinoamericana'
];

const EVENT_COLOR = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];
export const EVENT_TAGS = [
  'Liderazgo',
  'Bienestar',
  'ArteYCultura',
  'Innovación',
  'Ética',
];



const EVENT_DESCRIPTION = [
  'Evento enfocado en presentar avances y tendencias en el campo de la innovación y la tecnología',
  'Celebración de producciones cinematográficas creadas por estudiantes universitarios',
  'Período dedicado a la divulgación de avances científicos y proyectos de investigación',
  'Muestra de obras artísticas modernas y actuales en diversas disciplinas',
  'Reunión donde escritores de diferentes países comparten su obra y perspectivas literarias',
  'Presentación de piezas musicales tradicionales y clásicas interpretadas por músicos especializados',
  'Espacio para que emprendedores presenten sus proyectos y establezcan conexiones comerciales',
  'Día dedicado a la discusión y promoción de cuestiones relacionadas con los derechos humanos',
  'Evento centrado en la concienciación y acción en favor de la preservación ambiental',
  'Charla que aborda temas y tendencias actuales en el ámbito político global',
  'Celebración de tradiciones culturales a través de presentaciones de bailes folclóricos',
  'Exhibición de imágenes capturadas por fotógrafos, mostrando diversos estilos y temas',
  'Charla que trata temas relacionados con la salud mental, sus desafíos y soluciones',
  'Actividad práctica para estimular la creatividad y aprender sobre el diseño en distintos contextos',
  'Espacio de discusión sobre estrategias y prácticas para una educación accesible y equitativa',
  'Mostrando aspectos de la naturaleza a través de exhibiciones científicas',
  'Evento que explora diferentes formas y medios de comunicación, desde periodismo hasta medios digitales',
  'Presentación de aspectos destacados y evolución histórica en el mundo del arte',
  'Charla acerca de modelos económicos que buscan equilibrio entre desarrollo y sostenibilidad',
  'Evento donde organizaciones presentan oportunidades de voluntariado a estudiantes',
  'Presentación de música tradicional y contemporánea de América Latina',
  'Día dedicado a explorar diversas disciplinas de ciencias sociales y sus impactos',
  'Muestra de diseños arquitectónicos que priorizan la sostenibilidad ambiental',
  'Charla que analiza y celebra la literatura de América Latina en sus contextos culturales',
];




const PRODUCT_SIZE = ['6', '7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'];

const EVENT_CATEGORY_GROUP_OPTIONS = [
  {
    group: 'Conferencias',
    classify: ['Charlas Magistrales Javerianas', 'Diálogos Académicos', 'Conferencias de Expertos', 'Seminarios Interactivos', 'Presentaciones Académicas'],
  },
  {
    group: 'Talleres',
    classify: ['Talleres Prácticos Javerianos', 'Sesiones de Desarrollo de Habilidades', 'Capacitación Aplicada', 'Laboratorios Creativos', 'Clínicas Educativas'],
  },
  {
    group: 'Charlas',
    classify: ['Charlas Inspiradoras Javerianas', 'Diálogos Informativos', 'Conversaciones Reflexivas', 'Charlas Interactivas', 'Encuentros Enriquecedores'],
  },
];

// ----------------------------------------------------------------------

export const events = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  name: EVENT_NAME[index],
  capacity: random(99),
  createdStart: _mock.time(index),
  createdEnd: _mock.time(index-1),
  state: sample(['publicado', 'borrador']),
  location: _mock.location(index),
  description: EVENT_DESCRIPTION[index],
  mode: sample(['virtual', 'presencial', 'combinada']),
  category: EVENT_CATEGORY_GROUP_OPTIONS[index % 3].classify[index % 5],
  allDay: false,
  cycle: `521${index+1}`,
  duration: random(1, 5),
  eventUrl: 'https://www.javeriana.edu.co/inicio',
  coverUrl: _mock.image.product(index+1),
  images: [...Array(5)].map((_, index) => _mock.image.product(index+1)),
  code: `38BEE27${index}`,
  sku: `WW75K521${index}YW/SV`,
  tags: EVENT_TAGS,
  price: _mock.number.price(index),
  priceSale: index % 3 ? null : _mock.number.price(index),
  totalRating: _mock.number.rating(index),
  totalReview: random(9999),
  ratings: [...Array(5)].map((_, index) => ({
    name: `${index + 1} Star`,
    starCount: random(9999),
    reviewCount: random(9999),
  })),
  reviews: [...Array(5)].map((_, index) => ({
    id: _mock.id(index),
    name: _mock.name.fullName(index),
    avatarUrl: `${HOST_API}/assets/images/avatars/avatar_${index+1}.jpg`,
    comment: _mock.text.sentence(index),
    rating: _mock.number.rating(index),
    isPurchased: _mock.boolean(index),
    helpful: random(9999),
    postedAt: _mock.time(index),
  })),
  sizes: PRODUCT_SIZE,
  available: index % 3 === 0 ? random(19, 100) : 2,
  gender: sample(['Men', 'Women', 'Kids']),
  colors:
    (index === 0 && EVENT_COLOR.slice(0, 2)) ||
    (index === 1 && EVENT_COLOR.slice(1, 3)) ||
    (index === 2 && EVENT_COLOR.slice(2, 4)) ||
    (index === 3 && EVENT_COLOR.slice(3, 6)) ||
    //
    (index === 4 && EVENT_COLOR.slice(4, 6)) ||
    (index === 5 && EVENT_COLOR.slice(5, 6)) ||
    (index === 6 && EVENT_COLOR.slice(0, 2)) ||
    (index === 7 && EVENT_COLOR.slice(4, 6)) ||
    //
    (index === 8 && EVENT_COLOR.slice(2, 4)) ||
    (index === 9 && EVENT_COLOR.slice(2, 6)) ||
    (index === 10 && EVENT_COLOR.slice(3, 6)) ||
    (index === 11 && EVENT_COLOR.slice(2, 6)) ||
    //
    (index === 12 && EVENT_COLOR.slice(2, 7)) ||
    (index === 13 && EVENT_COLOR.slice(4, 7)) ||
    (index === 14 && EVENT_COLOR.slice(0, 2)) ||
    (index === 15 && EVENT_COLOR.slice(5, 8)) ||
    //
    (index === 16 && EVENT_COLOR.slice(4, 6)) ||
    (index === 17 && EVENT_COLOR.slice(5, 6)) ||
    (index === 18 && EVENT_COLOR.slice(0, 2)) ||
    (index === 19 && EVENT_COLOR.slice(4, 6)) ||
    //
    (index === 20 && EVENT_COLOR.slice(4, 6)) ||
    (index === 21 && EVENT_COLOR.slice(5, 6)) ||
    (index === 22 && EVENT_COLOR.slice(5, 8)) ||
    (index === 23 && EVENT_COLOR.slice(4, 6)),

}));

//TABLA EVENTOS
export const eventsBEU = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  name: EVENT_NAME[index],
  description: EVENT_DESCRIPTION[index],
  tags: sample(['salida', 'ornitología', 'facatativa', 'liderazgo']), 
  public_type:sample(['todos', 'estudiantes', 'artes', 'profesores']),  //Agregar al Formulario
  requirements: EVENT_DESCRIPTION[index],
  duration: random(1, 5), // Se calcula fecha fin - fecha inicio
  location: _mock.location(index),
  capacity: random(99), // Aclarar si no hay límite
  mode: sample(['virtual', 'presencial', 'combinada']),
  state: sample(['publicado', 'borrador', 'vencido']),
  category: EVENT_CATEGORY_GROUP_OPTIONS[index % 3].classify[index % 5], // Solamente group (tags)
  topic: EVENT_CATEGORY_GROUP_OPTIONS[index % 3].classify[index % 5], // Solamente group (tags) 
  cycle: `521${index+1}`, // Lista  2310, 2320, 2330
  date_start: _mock.time(index), // Cambiar tipo DATE
  date_end: _mock.time(index-1), // Cambiar tipo DATE
  time_start: _mock.time(index), // Hora inicio tipo TIME
  time_end:_mock.time(index), // Hora fin tipo TIME
  prom_rating: _mock.number.rating(index),
  date_start_post: _mock.time(index), // Cambiar tipo DATE
  price: _mock.number.price(index), // FLOAT
  url_event: 'https://www.javeriana.edu.co/inicio',
  url_poster: _mock.image.product(index+1),
  url_photos: [...Array(5)].map((_, index) => _mock.image.product(index+1)),
  Headid_head: _mock.id(index),
  Centerid_unity: _mock.id(index),
  total_review: random(9999), // Se tiene que agregar en el back

// TABLA RATING
  ratings: [...Array(5)].map((_, index) => ({
    id: `${index + 1} Star`,
    starCount: random(9999),
    reviewCount: random(9999),
  })),

// TABLA REVIEW
  commentevent: [...Array(5)].map((_, index) => ({
    id_comment_event: _mock.id(index),
    id_user: _mock.id(index),
    name: _mock.name.fullName(index), // Traer info del usuario(id)
    avatarUrl: `${HOST_API}/assets/images/avatars/avatar_${index+1}.jpg`, // Traer info del usuario(id)
    comment: _mock.text.sentence(index),
    rating: _mock.number.rating(index),
    isPurchased: _mock.boolean(index),
    helpful: random(9999),
    postedAt: _mock.time(index),
  })),

  colors:
    (index === 0 && EVENT_COLOR.slice(0, 2)) ||
    (index === 1 && EVENT_COLOR.slice(1, 3)) ||
    (index === 2 && EVENT_COLOR.slice(2, 4)) ||
    (index === 3 && EVENT_COLOR.slice(3, 6)) ||
    //
    (index === 4 && EVENT_COLOR.slice(4, 6)) ||
    (index === 5 && EVENT_COLOR.slice(5, 6)) ||
    (index === 6 && EVENT_COLOR.slice(0, 2)) ||
    (index === 7 && EVENT_COLOR.slice(4, 6)) ||
    //
    (index === 8 && EVENT_COLOR.slice(2, 4)) ||
    (index === 9 && EVENT_COLOR.slice(2, 6)) ||
    (index === 10 && EVENT_COLOR.slice(3, 6)) ||
    (index === 11 && EVENT_COLOR.slice(2, 6)) ||
    //
    (index === 12 && EVENT_COLOR.slice(2, 7)) ||
    (index === 13 && EVENT_COLOR.slice(4, 7)) ||
    (index === 14 && EVENT_COLOR.slice(0, 2)) ||
    (index === 15 && EVENT_COLOR.slice(5, 8)) ||
    //
    (index === 16 && EVENT_COLOR.slice(4, 6)) ||
    (index === 17 && EVENT_COLOR.slice(5, 6)) ||
    (index === 18 && EVENT_COLOR.slice(0, 2)) ||
    (index === 19 && EVENT_COLOR.slice(4, 6)) ||
    //
    (index === 20 && EVENT_COLOR.slice(4, 6)) ||
    (index === 21 && EVENT_COLOR.slice(5, 6)) ||
    (index === 22 && EVENT_COLOR.slice(5, 8)) ||
    (index === 23 && EVENT_COLOR.slice(4, 6)) ||
    EVENT_COLOR.slice(2, 6),
}));
