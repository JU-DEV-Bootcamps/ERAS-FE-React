import type { Translation } from './en';

// Neutral Spanish texts of ERAS v3 (formal "usted", no regional words). Same keys as en.ts.
export const es: Translation = {
  app: {
    name: 'ERAS',
  },
  home: {
    title: 'ERAS',
    welcome: 'Sesión iniciada.',
  },
  accessDenied: {
    title: 'Acceso denegado',
    message: 'No tiene permiso para abrir esta página.',
  },
  notFound: {
    title: 'Página no encontrada',
    message: 'La página que busca no existe.',
  },
  shell: {
    logout: 'Cerrar sesión',
  },
};
