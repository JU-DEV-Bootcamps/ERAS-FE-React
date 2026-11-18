// English texts of ERAS v3, the reference language: es.ts and pt-BR.ts have exactly the same keys.
// Keys are grouped by the screen or piece that shows them.
export const en = {
  app: {
    name: 'ERAS',
  },
  home: {
    title: 'ERAS',
    welcome: 'You are signed in.',
  },
  accessDenied: {
    title: 'Access denied',
    message: 'You do not have permission to open this page.',
  },
  notFound: {
    title: 'Page not found',
    message: 'The page you are looking for does not exist.',
  },
  shell: {
    logout: 'Log out',
  },
};

/** The shape every language resource must have. */
export type Translation = typeof en;
